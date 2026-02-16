import Layout from '../components/layout/Layout';
import { Tag, SectionHeader, CodeBlockWithCopy, TipBox, MermaidChart } from '../components/ui';

const ragControllerCode = `package com.example.langchain4j.rag;

import org.springframework.boot.SpringApplication;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/documents")
public class RagController {

    @PostMapping("/upload")
    public Document uploadDocument(@RequestParam("file") MultipartFile file) {
        String fileId = documentService.saveDocument(file);
        return fileId;
    }

    @GetMapping("/search")
    public SearchResponse search(@RequestParam("query") String query) {
        List<Document> documents = documentService.searchDocuments(query);
        return new SearchResponse(documents);
    }
}`;

const pgVectorConfigCode = `package com.example.langchain4j.rag;

import org.springframework.context.annotation.Configuration;

@Configuration
public class PGVectorConfig {

    private int vectorDimension = 1536;

    @Bean
    public Extension createExtension("pgvector", PGVectorExtension.class);
}`;

const documentEmbedderCode = `package com.example.langchain4j.rag;

import dev.langchain4j.model.embedding.EmbeddingModel;
import java.util.List;

public class DocumentEmbedder {

    private final EmbeddingModel embeddingModel;

    public float embed(String text) {
        return embeddingModel.embed(text).content();
    }
}`;

const ragServiceCode = `package com.example.langchain4j.rag.service;

import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.store.embedding.EmbeddingStore;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class RAGService {

    private final ChatLanguageModel chatModel;
    private final EmbeddingStore<TextSegment> embeddingStore;
    private final DocumentService documentService;

    private static final int TOP_K = 3;

    public RAGService(EmbeddingStore<TextSegment> embeddingStore,
                      DocumentService documentService) {
        this.chatModel = OpenAiChatModel.builder()
                .apiKey(System.getenv("OPENAI_API_KEY"))
                .modelName("gpt-4")
                .temperature(0.7)
                .build();
        
        this.embeddingStore = embeddingStore;
        this.documentService = documentService;
    }

    public String answer(String question) {
        // 第一步：检索相关文档
        List<Document> relevantDocs = 
            documentService.searchDocuments(question, TOP_K);
        
        // 第二步：构建上下文
        String context = relevantDocs.stream()
            .map(doc -> doc.content())
            .reduce((s1, s2) -> s1 + "\\n\\n" + s2)
            .orElse("No relevant documents found.");
        
        // 第三步：构建增强的 Prompt
        String prompt = buildPrompt(question, context);
        
        // 第四步：调用 LLM 生成回答
        AiMessage response = chatModel.generate(prompt);
        
        return response.text();
    }

    private String buildPrompt(String question, String context) {
        return String.format("""
            基于以下上下文信息回答问题。如果上下文中没有相关信息，请说明这一点。
            
            上下文：
            %s
            
            问题：
            %s
            
            回答：
            """, context, question);
    }
}`;

const aiAssistantControllerCode = `package com.example.langchain4j.assistant;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/assistant")
public class AiAssistantController {

    private final AssistantService assistantService;

    public AiAssistantController(AssistantService assistantService) {
        this.assistantService = assistantService;
    }

    @PostMapping("/chat")
    public ChatResponse chat(@RequestBody ChatRequest request) {
        return assistantService.chat(
            request.getMessage(),
            request.getModel(),
            request.getUserId()
        );
    }

    @PostMapping("/chat/history")
    public ChatResponse chatWithHistory(@RequestBody ChatWithHistoryRequest request) {
        return assistantService.chatWithHistory(
            request.getMessage(),
            request.getHistory(),
            request.getUserId()
        );
    }

    @PostMapping("/function")
    public FunctionResponse executeFunction(@RequestBody FunctionRequest request) {
        return assistantService.executeFunction(
            request.getMessage(),
            request.getTools()
        );
    }

    @DeleteMapping("/history/{userId}")
    public void clearHistory(@PathVariable String userId) {
        assistantService.clearHistory(userId);
    }
}`;

const modelFactoryCode = `package com.example.langchain4j.assistant.model;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.anthropic.AnthropicChatModel;
import dev.langchain4j.model.google.GoogleGeminiChatModel;
import dev.langchain4j.model.huggingface.HuggingFaceChatModel;
import org.springframework.stereotype.Component;

@Component
public class ModelFactory {

    public ChatLanguageModel createModel(String provider, String modelName) {
        return switch (provider.toLowerCase()) {
            case "openai" -> createOpenAiModel(modelName);
            case "anthropic" -> createAnthropicModel(modelName);
            case "google" -> createGoogleModel(modelName);
            case "huggingface" -> createHuggingFaceModel(modelName);
            default -> throw new IllegalArgumentException(
                "Unsupported provider: " + provider);
        };
    }

    private ChatLanguageModel createOpenAiModel(String modelName) {
        return OpenAiChatModel.builder()
                .apiKey(System.getenv("OPENAI_API_KEY"))
                .modelName(modelName)
                .temperature(0.7)
                .maxTokens(2000)
                .timeout(java.time.Duration.ofSeconds(60))
                .build();
    }

    private ChatLanguageModel createAnthropicModel(String modelName) {
        return AnthropicChatModel.builder()
                .apiKey(System.getenv("ANTHROPIC_API_KEY"))
                .modelName(modelName)
                .temperature(0.7)
                .maxTokens(2000)
                .build();
    }

    private ChatLanguageModel createGoogleModel(String modelName) {
        return GoogleGeminiChatModel.builder()
                .apiKey(System.getenv("GOOGLE_API_KEY"))
                .modelName(modelName)
                .temperature(0.7)
                .build();
    }

    private ChatLanguageModel createHuggingFaceModel(String modelName) {
        return HuggingFaceChatModel.builder()
                .accessToken(System.getenv("HUGGINGFACE_API_KEY"))
                .modelId(modelName)
                .temperature(0.7)
                .maxNewTokens(2000)
                .build();
    }
}`;

const weatherToolCode = `package com.example.langchain4j.assistant.tool;

import dev.langchain4j.agent.tool.Tool;
import org.springframework.stereotype.Component;

@Component
public class WeatherTool {

    @Tool("Get current weather for a city")
    public String getWeather(@ToolParam("name of the city") String city) {
        return getWeatherFromApi(city);
    }

    @Tool("Get weather forecast for the next few days")
    public String getForecast(@ToolParam("name of the city") String city,
                              @ToolParam("number of days to forecast") int days) {
        return getForecastFromApi(city, days);
    }

    private String getWeatherFromApi(String city) {
        return String.format(
            "Current weather in %s: 25°C, Sunny with light breeze", city);
    }

    private String getForecastFromApi(String city, int days) {
        StringBuilder forecast = new StringBuilder();
        forecast.append(String.format("%d-day forecast for %s:\\n", days, city));
        
        for (int i = 1; i <= days; i++) {
            forecast.append(String.format(
                "  Day %d: 23-27°C, Mostly sunny\\n", i));
        }
        
        return forecast.toString();
    }
}`;

const chatWebSocketHandlerCode = `package com.example.langchain4j.chatbot.websocket;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Component
public class ChatWebSocketHandler implements WebSocketHandler {

    private final ChatLanguageModel chatModel;
    private final MessageService messageService;
    
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    public ChatWebSocketHandler(MessageService messageService) {
        this.chatModel = OpenAiChatModel.builder()
                .apiKey(System.getenv("OPENAI_API_KEY"))
                .modelName("gpt-4")
                .temperature(0.8)
                .build();
        this.messageService = messageService;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String userId = getUserIdFromSession(session);
        sessions.put(userId, session);
        sendMessage(session, "Welcome! How can I help you today?");
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
        String userId = getUserIdFromSession(session);
        String userMessage = message.getPayload().toString();
        
        messageService.saveMessage(userId, "user", userMessage);
        List<ChatMessage> history = messageService.getRecentHistory(userId, 10);
        String aiResponse = generateResponse(userMessage, history);
        messageService.saveMessage(userId, "assistant", aiResponse);
        sendMessage(session, aiResponse);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String userId = getUserIdFromSession(session);
        sessions.remove(userId);
    }

    private String generateResponse(String message, List<ChatMessage> history) {
        StringBuilder context = new StringBuilder();
        for (ChatMessage msg : history) {
            context.append(msg.getRole()).append(": ")
                  .append(msg.getContent()).append("\\n");
        }
        
        String prompt = context + "\\nUser: " + message + "\\nAssistant:";
        return chatModel.generate(prompt).content();
    }

    private String getUserIdFromSession(WebSocketSession session) {
        return session.getUri().getQuery().split("=")[1];
    }

    private void sendMessage(WebSocketSession session, String message) throws Exception {
        if (session.isOpen()) {
            session.sendMessage(new TextMessage(message));
        }
    }
}`;

const authServiceCode = `package com.example.langchain4j.chatbot.auth;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private static final String SECRET_KEY = "your-secret-key-at-least-256-bits-long";
    private static final long EXPIRATION_TIME = 86400000;  // 24 小时
    private static final Key signingKey = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    public String generateToken(String userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(signingKey)
                .compact();
    }

    public String validateToken(String token) {
        try {
            String userId = Jwts.parserBuilder()
                    .setSigningKey(signingKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
            return userId;
        } catch (Exception e) {
            throw new RuntimeException("Invalid token", e);
        }
    }
}`;

const PracticePage = () => {
  return (
    <Layout>
      <div className="page-tags">
        <Tag variant="indigo">实战练习</Tag>
        <Tag variant="purple">项目实战</Tag>
        <Tag variant="green">完整流程</Tag>
      </div>

      <h1 className="page-title">实战练习</h1>
      <p className="page-description">
        通过三个完整的实战项目，掌握 LangChain4j 的实际应用开发。
      </p>

      <nav className="toc-nav">
        <h3 className="toc-title">目录</h3>
        <ol className="toc-list">
          <li className="toc-item"><span className="toc-number">1.</span> <a href="#overview" className="toc-link">实战项目概述</a></li>
          <li className="toc-item"><span className="toc-number">2.</span> <a href="#rag-project" className="toc-link">RAG 知识库项目</a></li>
          <li className="toc-item"><span className="toc-number">3.</span> <a href="#ai-assistant" className="toc-link">AI 助手项目</a></li>
          <li className="toc-item"><span className="toc-number">4.</span> <a href="#chatbot" className="toc-link">聊天机器人项目</a></li>
        </ol>
      </nav>

      <section id="overview" className="content-section">
        <SectionHeader number={1} title="实战项目概述" />
        <p className="paragraph">
          本节介绍三个实战项目的整体设计思路、技术栈选择和项目复杂度，帮助您在实际开发中做出正确的技术决策。
        </p>

        <h3 className="subsection-title">1.1 项目类型与复杂度</h3>
        <p className="text-gray-700 mb-4">三个实战项目代表了 LangChain4j 的典型应用场景：</p>

        <div className="grid-3col">
          <div className="card card-blue">
            <h4 className="font-semibold text-blue-800 mb-2">RAG 知识库项目</h4>
            <p className="text-blue-700 text-sm mb-2">企业级文档管理系统</p>
            <p className="text-blue-600 text-sm"> 复杂度：⭐⭐⭐⭐</p>
            <p className="text-blue-600 text-sm"> 核心功能：文档向量化、语义检索、相似度匹配</p>
          </div>
          <div className="card card-purple">
            <h4 className="font-semibold text-purple-800 mb-2">AI 助手项目</h4>
            <p className="text-purple-700 text-sm mb-2">企业级智能助手</p>
            <p className="text-purple-600 text-sm"> 复杂度：⭐⭐⭐</p>
            <p className="text-purple-600 text-sm"> 核心功能：多模型支持、上下文管理、函数调用</p>
          </div>
          <div className="card card-orange">
            <h4 className="font-semibold text-orange-800 mb-2">聊天机器人项目</h4>
            <p className="text-orange-700 text-sm mb-2">实时聊天应用</p>
            <p className="text-orange-600 text-sm"> 复杂度：⭐⭐⭐</p>
            <p className="text-orange-600 text-sm"> 核心功能：实时通信、多用户支持、WebSocket 连接</p>
          </div>
        </div>

        <h3 className="subsection-title">1.2 技术栈选择</h3>
        <p className="text-gray-700 mb-4">三个项目统一使用以下技术栈：</p>

        <div className="info-card info-card-gray">
          <ul className="list-styled">
            <li><strong>LangChain4j</strong>: AI 框架的核心，提供统一的 API</li>
            <li><strong>Spring Boot 3.2.x</strong>: 企业级应用框架，提供依赖注入和自动配置</li>
            <li><strong>PostgreSQL</strong>: 向量数据库，支持 PGVector 扩展</li>
            <li><strong>Redis</strong>: 缓存和会话存储</li>
            <li><strong>React</strong>: 现代化前端框架（聊天机器人）</li>
            <li><strong>Docker</strong>: 容器化部署和微服务架构</li>
            <li><strong>PGVector</strong>: 向量数据库向量扩展，高效相似度搜索</li>
          </ul>
        </div>

        <h3 className="subsection-title">1.3 项目规模与时间估算</h3>
        <p className="text-gray-700 mb-4">三个项目的规模和开发时间估算：</p>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>项目</th>
                <th>后端复杂度</th>
                <th>前端复杂度</th>
                <th>预估开发周期</th>
                <th>代码行数</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>RAG 知识库</td>
                <td>⭐⭐⭐⭐</td>
                <td>⭐⭐</td>
                <td>3-4 周</td>
                <td>3000-4000 行</td>
              </tr>
              <tr>
                <td>AI 助手</td>
                <td>⭐⭐⭐⭐</td>
                <td>⭐⭐</td>
                <td>4-6 周</td>
                <td>4000-5000 行</td>
              </tr>
              <tr>
                <td>聊天机器人</td>
                <td>⭐⭐⭐⭐</td>
                <td>⭐⭐</td>
                <td>5-6 周</td>
                <td>5000-6000 行</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="subsection-title mt-6">1.4 实战项目架构</h3>
        <p className="text-gray-700 mb-4">三个项目的整体架构和关系：</p>

        <MermaidChart chart={`
          graph TB
              subgraph "📚 RAG 知识库项目"
                  A1[📄 文档上传]
                  A2[🔢 文档向量化]
                  A3[💾 PGVector 存储]
                  A4[🔍 语义检索]
                  A5[🤖 RAG 问答]
                  A1 --> A2 --> A3 --> A4 --> A5
              end
              subgraph "🤖 AI 助手项目"
                  B1[🎛️ 模型工厂]
                  B2[🔧 函数调用]
                  B3[💾 上下文管理]
                  B4[📊 多模型支持]
                  B1 --> B2 --> B3 --> B4
              end
              subgraph "💬 聊天机器人项目"
                  C1[🔌 WebSocket]
                  C2[🔐 JWT 认证]
                  C3[💬 消息持久化]
                  C4[👥 多用户并发]
                  C1 --> C2 --> C3 --> C4
              end
              A5 -.->|提供知识| B4
              B4 -.->|增强能力| C4
        `} />
      </section>

      <section id="rag-project" className="content-section">
        <SectionHeader number={2} title="RAG 知识库项目实战" />
        <p className="paragraph">
          构建一个完整的企业级文档管理系统，实现文档向量化、语义检索和智能问答。
        </p>

        <h3 className="subsection-title">2.1 系统架构设计</h3>
        <p className="text-gray-700 mb-4">使用分层架构，确保系统的可扩展性和可维护性：</p>

        <CodeBlockWithCopy
          code={ragControllerCode}
          language="java"
          filename="RagController.java"
        />

        <h3 className="subsection-title">2.2 向量数据库配置</h3>
        <p className="text-gray-700 mb-4">配置 PostgreSQL + PGVector 扩展，实现高效的向量存储和相似度计算：</p>

        <CodeBlockWithCopy
          code={pgVectorConfigCode}
          language="java"
          filename="PGVectorConfig.java"
        />

        <h3 className="subsection-title">2.3 文档向量化</h3>
        <p className="text-gray-700 mb-4">使用 Embedding 模型将文档转换为向量：</p>

        <CodeBlockWithCopy
          code={documentEmbedderCode}
          language="java"
          filename="DocumentEmbedder.java"
        />

        <h3 className="subsection-title">2.4 完整 RAG 流程实现</h3>
        <p className="text-gray-700 mb-4">实现端到端的 RAG 流程，结合向量检索和 LLM 生成：</p>

        <CodeBlockWithCopy
          code={ragServiceCode}
          language="java"
          filename="RAGService.java"
        />

        <TipBox variant="info" title="RAG 核心流程">
          <p className="mb-2"><strong>用户提问 → 检索 → 上下文组装 → LLM 生成</strong></p>
          <ul className="list-styled">
            <li><strong>第一步：用户提问</strong> - 通过 API 发送自然语言查询</li>
            <li><strong>第二步：向量化</strong> - 将查询转换为向量表示</li>
            <li><strong>第三步：相似度搜索</strong> - 在向量数据库中查找最相似的文档</li>
            <li><strong>第四步：上下文组装</strong> - 将检索到的文档组装成 Prompt</li>
            <li><strong>第五步：LLM 生成</strong> - 基于上下文生成准确回答</li>
          </ul>
        </TipBox>
      </section>

      <section id="ai-assistant" className="content-section">
        <SectionHeader number={3} title="AI 助手项目实战" />
        <p className="paragraph">
          构建一个企业级智能助手，支持多模型、函数调用和上下文管理。
        </p>

        <h3 className="subsection-title">3.1 系统架构设计</h3>
        <p className="text-gray-700 mb-4">AI 助手采用模块化架构，支持插件式功能扩展：</p>

        <CodeBlockWithCopy
          code={aiAssistantControllerCode}
          language="java"
          filename="AiAssistantController.java"
        />

        <h3 className="subsection-title">3.2 多模型支持</h3>
        <p className="text-gray-700 mb-4">使用工厂模式支持多种 LLM 模型：</p>

        <CodeBlockWithCopy
          code={modelFactoryCode}
          language="java"
          filename="ModelFactory.java"
        />

        <h3 className="subsection-title">3.3 函数调用实现</h3>
        <p className="text-gray-700 mb-4">使用 LangChain4j 的 Function Calling 功能调用外部工具：</p>

        <CodeBlockWithCopy
          code={weatherToolCode}
          language="java"
          filename="WeatherTool.java"
        />

        <TipBox variant="info" title="AI 助手核心功能">
          <ul className="list-styled">
            <li><strong>多模型支持</strong> - OpenAI、Anthropic、Google、HuggingFace</li>
            <li><strong>函数调用</strong> - 自动调用外部工具和 API</li>
            <li><strong>上下文管理</strong> - 维护对话历史和状态</li>
            <li><strong>灵活配置</strong> - 温度、Token 限制、超时等参数可调</li>
          </ul>
        </TipBox>
      </section>

      <section id="chatbot" className="content-section">
        <SectionHeader number={4} title="聊天机器人项目实战" />
        <p className="paragraph">
          构建一个实时聊天机器人，支持多用户并发、WebSocket 实时通信和消息持久化。
        </p>

        <h3 className="subsection-title">4.1 系统架构设计</h3>
        <p className="text-gray-700 mb-4">聊天机器人采用前后端分离架构，WebSocket 实现实时通信：</p>

        <CodeBlockWithCopy
          code={chatWebSocketHandlerCode}
          language="java"
          filename="ChatWebSocketHandler.java"
        />

        <h3 className="subsection-title">4.2 用户认证与会话管理</h3>
        <p className="text-gray-700 mb-4">使用 JWT 进行用户认证，Redis 管理会话状态：</p>

        <CodeBlockWithCopy
          code={authServiceCode}
          language="java"
          filename="AuthService.java"
        />

        <TipBox variant="info" title="聊天机器人核心功能">
          <ul className="list-styled">
            <li><strong>WebSocket 实时通信</strong> - 低延迟双向消息传输</li>
            <li><strong>用户认证</strong> - JWT Token 安全认证</li>
            <li><strong>消息持久化</strong> - PostgreSQL 存储聊天历史</li>
            <li><strong>多用户并发</strong> - 支持多个用户同时在线</li>
            <li><strong>上下文管理</strong> - 维护对话历史和状态</li>
          </ul>
        </TipBox>
      </section>

      <section className="content-section">
        <div className="summary-card">
          <h3 className="text-2xl font-bold mb-4">本节小结</h3>
          <p className="mb-4">本节完整介绍了三个实战项目的架构设计和核心实现，涵盖了：</p>
          <ul className="list-styled mb-6">
            <li><strong>RAG 知识库</strong>：文档向量化、向量检索、智能问答</li>
            <li><strong>AI 助手</strong>：多模型支持、函数调用、上下文管理</li>
            <li><strong>聊天机器人</strong>：实时通信、用户认证、消息持久化</li>
          </ul>
          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600 mb-2">统一技术栈</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Tag variant="indigo">LangChain4j</Tag>
              <Tag variant="blue">Spring Boot 3.2.x</Tag>
              <Tag variant="green">PostgreSQL</Tag>
              <Tag variant="cyan">Redis</Tag>
              <Tag variant="purple">PGVector</Tag>
              <Tag variant="orange">WebSocket</Tag>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6 mt-6">
            <p className="text-sm text-gray-600 mb-2">下一步</p>
            <a href="/search" className="text-indigo-600 hover:text-indigo-700 transition-colors">
              下一章：搜索功能 →
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PracticePage;
