import Layout from '../components/layout/Layout';
import { Tag, CodeBlockWithCopy, SectionHeader } from '../components/ui';

const ProjectChatbotPage = () => {
  const pomXml = `<dependencies>
    <!-- Spring Boot Starter -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-websocket</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>

    <!-- LangChain4j -->
    <dependency>
        <groupId>dev.langchain4j</groupId>
        <artifactId>langchain4j-open-ai</artifactId>
        <version>0.36.2</version>
    </dependency>

    <!-- PostgreSQL -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
    </dependency>

    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
</dependencies>`;

  const webSocketConfig = `package com.example.chatbot.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // 启用简单消息代理
        config.enableSimpleBroker("/topic", "/queue");
        // 设置客户端发送消息的前缀
        config.setApplicationDestinationPrefixes("/app");
        // 设置用户目的地前缀
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-chat")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
}`;

  const messageEntity = `package com.example.chatbot.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages", indexes = {
    @Index(name = "idx_room_created", columnList = "room_id,created_at"),
    @Index(name = "idx_sender", columnList = "sender_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String roomId;

    @Column(nullable = false)
    private String senderId;

    @Column(nullable = false)
    private String senderName;

    @Column(nullable = false, length = 5000)
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MessageType type = MessageType.TEXT;

    @Column(nullable = false)
    private Boolean isAiGenerated = false;

    private String aiModel;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum MessageType {
        TEXT, IMAGE, FILE, SYSTEM, JOIN, LEAVE, TYPING
    }
}`;

  const chatService = `package com.example.chatbot.service.impl;

import com.example.chatbot.dto.*;
import com.example.chatbot.entity.ChatRoom;
import com.example.chatbot.entity.Message;
import com.example.chatbot.repository.ChatRoomRepository;
import com.example.chatbot.repository.MessageRepository;
import com.example.chatbot.service.ChatService;
import com.example.chatbot.service.OnlineUserService;
import com.example.chatbot.service.ai.ChatAgent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final MessageRepository messageRepository;
    private final OnlineUserService onlineUserService;
    private final ChatAgent chatAgent;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional
    public ChatRoomDTO createRoom(CreateRoomRequest request) {
        String roomId = generateRoomId();
        
        ChatRoom room = ChatRoom.builder()
            .roomId(roomId)
            .name(request.getName())
            .description(request.getDescription())
            .type(request.getType() != null ? request.getType() : ChatRoom.RoomType.GROUP)
            .createdBy(request.getCreatorId())
            .aiEnabled(request.getAiEnabled() != null ? request.getAiEnabled() : true)
            .build();

        room.addMember(request.getCreatorId());
        chatRoomRepository.save(room);
        
        return mapToRoomDTO(room);
    }

    @Override
    @Transactional
    public MessageDTO sendMessage(SendMessageRequest request) {
        ChatRoom room = chatRoomRepository.findByRoomId(request.getRoomId())
            .orElseThrow(() -> new IllegalArgumentException("聊天室不存在"));

        Message userMessage = Message.builder()
            .roomId(request.getRoomId())
            .senderId(request.getSenderId())
            .senderName(request.getSenderName())
            .content(request.getContent())
            .type(Message.MessageType.TEXT)
            .isAiGenerated(false)
            .build();
        messageRepository.save(userMessage);

        // 广播用户消息
        messagingTemplate.convertAndSend(
            "/topic/room/" + request.getRoomId(),
            mapToMessageDTO(userMessage)
        );

        // 如果启用了AI助手，生成AI回复
        if (room.getAiEnabled()) {
            handleAiResponse(request.getRoomId(), room, userMessage);
        }

        return mapToMessageDTO(userMessage);
    }

    private void handleAiResponse(String roomId, ChatRoom room, Message userMessage) {
        new Thread(() -> {
            try {
                String aiResponse = chatAgent.generateResponse(
                    room.getRoomId(),
                    room.getAiBotName(),
                    userMessage.getContent(),
                    room.getRagEnabled(),
                    room.getKnowledgeBaseId()
                );

                Message aiMessage = Message.builder()
                    .roomId(roomId)
                    .senderId("AI")
                    .senderName(room.getAiBotName())
                    .content(aiResponse)
                    .type(Message.MessageType.TEXT)
                    .isAiGenerated(true)
                    .aiModel("gpt-4")
                    .build();
                messageRepository.save(aiMessage);

                messagingTemplate.convertAndSend(
                    "/topic/room/" + roomId,
                    mapToMessageDTO(aiMessage)
                );
            } catch (Exception e) {
                log.error("AI响应生成失败", e);
            }
        }).start();
    }
}`;

  const chatAgent = `package com.example.chatbot.service.ai;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

interface ChatAiService {
    @SystemMessage("你是一个友好的AI助手。用简洁、有用的方式回答用户问题。")
    String chat(@UserMessage String userMessage, String conversationContext);
}

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatAgent {

    private final ChatAiService chatAiService;
    private final MessageRepository messageRepository;
    private final RagService ragService;

    public String generateResponse(
        String roomId,
        String botName,
        String userMessage,
        boolean ragEnabled,
        Long knowledgeBaseId
    ) {
        // 1. 构建对话上下文
        String conversationContext = buildConversationContext(roomId, 5);

        // 2. 如果启用RAG，检索相关知识
        String retrievedContext = "";
        if (ragEnabled && knowledgeBaseId != null) {
            retrievedContext = ragService.retrieveContext(
                userMessage, knowledgeBaseId
            );
        }

        // 3. 组合最终提示
        String enhancedMessage = userMessage;
        if (!retrievedContext.isEmpty()) {
            enhancedMessage = String.format(
                "参考信息：\\n%s\\n\\n用户问题：%s",
                retrievedContext, userMessage
            );
        }

        // 4. 调用AI生成回复
        return chatAiService.chat(enhancedMessage, conversationContext);
    }

    private String buildConversationContext(String roomId, int limit) {
        List<Message> recentMessages = messageRepository.findRecentMessages(roomId, limit);
        return recentMessages.stream()
            .map(msg -> String.format("%s: %s", msg.getSenderName(), msg.getContent()))
            .collect(Collectors.joining("\\n"));
    }
}`;

  const reactComponent = `import React, { useState, useEffect, useRef } from 'react';
import { SockJS } from 'sockjs-client';
import { Stomp, CompatClient } from '@stomp/stompjs';
import axios from 'axios';

const ChatPage: React.FC<{ userId: string; userName: string }> = ({ userId, userName }) => {
  const [stompClient, setStompClient] = useState<CompatClient | null>(null);
  const [connected, setConnected] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

  // 初始化WebSocket连接
  useEffect(() => {
    const client = Stomp.over(() => {
      return new SockJS('http://localhost:8080/ws-chat');
    });

    client.connect({}, () => {
      console.log('WebSocket连接成功');
      setConnected(true);
      setStompClient(client);
    }, (error) => {
      console.error('WebSocket连接失败:', error);
      setConnected(false);
    });

    return () => { if (client) client.disconnect(); };
  }, []);

  // 发送消息
  const sendMessage = () => {
    if (!newMessage.trim() || !stompClient || !currentRoom) return;

    const message = {
      roomId: currentRoom.roomId,
      senderId: userId,
      senderName: userName,
      content: newMessage,
      type: 'TEXT',
      createdAt: new Date(),
    };

    stompClient.send('/app/chat/send', {}, JSON.stringify(message));
    setNewMessage('');
  };

  // 加入聊天室
  const joinRoom = (roomId: string) => {
    if (!stompClient) return;

    stompClient.subscribe(\`/topic/room/\${roomId}\`, (message) => {
      const newMsg = JSON.parse(message.body);
      setMessages((prev) => [...prev, newMsg]);
    });

    stompClient.subscribe(\`/topic/room/\${roomId}/online\`, (message) => {
      const users = JSON.parse(message.body);
      setOnlineUsers(users);
    });

    stompClient.send('/app/chat/join', {}, JSON.stringify({ roomId, userId, userName }));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 聊天室列表 */}
      <aside className="w-80 bg-white border-r">
        {/* ... */}
      </aside>

      {/* 聊天区域 */}
      <main className="flex-1 flex flex-col">
        <header className="bg-white border-b p-4">
          <h1>{currentRoom?.name || '选择聊天室'}</h1>
        </header>

        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
        </div>

        {/* 输入框 */}
        <div className="bg-white border-t p-4">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="输入消息..."
          />
          <button onClick={sendMessage}>发送</button>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;`;

  const dockerCompose = `version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: chatbot_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your_password
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/chatbot_db
      OPENAI_API_KEY: \${OPENAI_API_KEY}
    depends_on:
      - postgres
      - redis

volumes:
  postgres-data:`;

  return (
    <Layout>
      <div className="flex items-center gap-2 mb-4">
        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">2025-02-14</span>
        <Tag variant="green">项目实战</Tag>
        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">中级难度</span>
      </div>

      <h1 className="text-5xl font-bold text-gray-900 mb-6">聊天机器人项目</h1>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 项目概览</h2>
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">WebSocket</div>
              <div className="text-gray-600 text-sm">实时双向通信</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">群聊</div>
              <div className="text-gray-600 text-sm">多用户聊天室</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">消息持久化</div>
              <div className="text-gray-600 text-sm">历史记录查询</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">AI增强</div>
              <div className="text-gray-600 text-sm">智能对话体验</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12 bg-blue-50 border border-blue-100 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">学习目标</h3>
            <ul className="text-gray-700 space-y-2 text-sm list-disc list-inside">
              <li>掌握WebSocket实时通信的完整实现</li>
              <li>理解多用户聊天室的状态管理</li>
              <li>学习消息持久化和历史记录查询</li>
              <li>实现用户在线状态和实时通知</li>
              <li>集成LangChain4j增强对话能力</li>
              <li>实现多Bot协作的聊天场景</li>
            </ul>
          </div>
        </div>
      </div>

      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <span className="flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-full text-sm font-bold">🏗️</span>
          <h2 className="text-2xl font-bold text-gray-900">项目架构设计</h2>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="subsection-title">系统架构图</h3>
          <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto text-sm">
{`┌─────────────────────────────────────────────────────────────────┐
│                         客户端层 (React)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  聊天界面    │  │  群聊列表    │  │  设置面板    │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
                            ↓ WebSocket
┌─────────────────────────────────────────────────────────────────┐
│                    Spring Boot 后端层                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │WebSocket     │  │  ChatService │  │  MessageRepo  │           │
│  │  Controller  │  │              │  │              │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    LangChain4j AI增强层                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  ChatAgent   │  │  RAGService  │  │  ToolAgent   │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘`}
          </pre>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-indigo-600">🔌</span> 核心组件
            </h4>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li>• <strong>ChatWebSocketHandler</strong> - WebSocket消息处理</li>
              <li>• <strong>ChatService</strong> - 聊天业务逻辑</li>
              <li>• <strong>RoomManager</strong> - 聊天室管理</li>
              <li>• <strong>OnlineUserService</strong> - 在线用户管理</li>
              <li>• <strong>MessageRepository</strong> - 消息持久化</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-green-600">🤖</span> AI增强功能
            </h4>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li>• <strong>ChatAgent</strong> - 智能对话Agent</li>
              <li>• <strong>MultiBotCoordinator</strong> - 多Bot协调</li>
              <li>• <strong>ContextMemory</strong> - 对话上下文记忆</li>
              <li>• <strong>ToolIntegration</strong> - 工具调用支持</li>
              <li>• <strong>RAGIntegration</strong> - 知识库检索</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <SectionHeader number={1} title="Spring Boot WebSocket后端实现" />
        
        <h3 className="subsection-title">1.1 项目依赖配置</h3>
        <CodeBlockWithCopy filename="pom.xml">{pomXml}</CodeBlockWithCopy>

        <h3 className="subsection-title">1.2 WebSocket配置</h3>
        <CodeBlockWithCopy filename="WebSocketConfig.java">{webSocketConfig}</CodeBlockWithCopy>

        <h3 className="subsection-title">1.3 消息实体类</h3>
        <CodeBlockWithCopy filename="Message.java">{messageEntity}</CodeBlockWithCopy>
      </section>

      <section className="mb-16">
        <SectionHeader number={2} title="ChatService业务逻辑" />
        
        <h3 className="subsection-title">2.1 ChatService核心实现</h3>
        <CodeBlockWithCopy filename="ChatServiceImpl.java">{chatService}</CodeBlockWithCopy>
      </section>

      <section className="mb-16">
        <SectionHeader number={3} title="React前端实现" />
        
        <h3 className="subsection-title">3.1 ChatPage主组件</h3>
        <CodeBlockWithCopy filename="ChatPage.tsx">{reactComponent}</CodeBlockWithCopy>
      </section>

      <section className="mb-16">
        <SectionHeader number={4} title="AI Agent集成" />
        
        <h3 className="subsection-title">4.1 ChatAgent实现</h3>
        <CodeBlockWithCopy filename="ChatAgent.java">{chatAgent}</CodeBlockWithCopy>
      </section>

      <section className="mb-16">
        <SectionHeader number={5} title="部署和配置" />
        
        <h3 className="subsection-title">5.1 Docker部署配置</h3>
        <CodeBlockWithCopy filename="docker-compose.yml">{dockerCompose}</CodeBlockWithCopy>
      </section>

      <section className="mb-16">
        <SectionHeader number={6} title="最佳实践" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-blue-600">💡</span> WebSocket性能优化
            </h4>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li>• 连接池管理避免频繁创建销毁</li>
              <li>• 心跳检测保持连接活跃</li>
              <li>• 消息压缩减少传输量</li>
              <li>• 断线重连提升用户体验</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-green-600">✅</span> 消息持久化策略
            </h4>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li>• 批量插入提升性能</li>
              <li>• 异步持久化减少延迟</li>
              <li>• 分页查询避免数据过多</li>
              <li>• 定期清理过期消息</li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-amber-600">⚠️</span> 安全注意事项
            </h4>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li>• CSRF防护</li>
              <li>• CORS配置限制</li>
              <li>• 消息内容过滤</li>
              <li>• 速率限制</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="from-indigo-600 to-purple-600 rounded-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">🎯 项目总结</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-white/20 rounded-lg p-5">
            <div className="text-2xl mb-3">🔌 核心技术</div>
            <ul className="text-sm space-y-1">
              <li>• WebSocket实时双向通信</li>
              <li>• STOMP消息协议</li>
              <li>• Spring Boot 3.2.x</li>
              <li>• React 18 + TypeScript</li>
              <li>• PostgreSQL + Redis</li>
              <li>• LangChain4j AI集成</li>
            </ul>
          </div>
          <div className="border border-white/20 rounded-lg p-5">
            <div className="text-2xl mb-3">✨ 关键功能</div>
            <ul className="text-sm space-y-1">
              <li>• 多用户实时群聊</li>
              <li>• 消息持久化和历史记录</li>
              <li>• 在线用户状态管理</li>
              <li>• AI智能对话助手</li>
              <li>• RAG知识库集成</li>
              <li>• 多Bot协作</li>
            </ul>
          </div>
          <div className="border border-white/20 rounded-lg p-5">
            <div className="text-2xl mb-3">🚀 最佳实践</div>
            <ul className="text-sm space-y-1">
              <li>• 异步消息处理</li>
              <li>• 批量数据库操作</li>
              <li>• 分页查询优化</li>
              <li>• Docker容器化部署</li>
              <li>• 健康检查和监控</li>
              <li>• 安全防护机制</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-white/20">
          <p className="text-lg mb-2">📚 <strong>下一章：最佳实践</strong></p>
          <p className="text-sm">学习LangChain4j开发的最佳实践，包括代码组织、错误处理、性能优化等</p>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectChatbotPage;
