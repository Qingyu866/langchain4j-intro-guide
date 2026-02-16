import Layout from '../components/layout/Layout';
import { Tag, CodeBlockWithCopy, SectionHeader, TipBox } from '../components/ui';

const ProjectAiAssistantPage = () => {
  const aiServiceConfigCode = `package com.example.aiassistant.config;

import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.tool.ToolSpecification;
import dev.langchain4j.model.chat.ChatLanguageModel;

public class AiServiceConfig {

    private static final String OPENAI_API_KEY = System.getenv("OPENAI_API_KEY");

    public KnowledgeAssistant knowledgeAssistant() {
        return AiServices.builder(KnowledgeAssistant.class)
                .chatLanguageModel(createChatModel())
                .tools(
                     weatherSearchTool,
                     calculatorTool,
                     codeInterpreterTool,
                     webBrowserTool,
                     ragRetrieverTool
                )
                .build();
    }
}`;

  const agentControllerCode = `package com.example.aiassistant.controller;

import com.example.aiassistant.dto.AgentRequest;
import com.example.aiassistant.dto.AgentResponse;
import com.example.aiassistant.service.AgentService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/agent")
@CrossOrigin(origins = "*")
public class AgentController {

    private final AgentService agentService;

    public AgentController(AgentService agentService) {
        this.agentService = agentService;
    }

    @PostMapping("/chat")
    public ResponseEntity<String> chat(@RequestBody AgentRequest request) {
        return ResponseEntity.ok(agentService.chat(request));
    }

    @GetMapping(value = "/chat/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamChat(@RequestBody AgentRequest request) {
        return agentService.streamChat(request);
    }
}`;

  const agentServiceCode = `package com.example.aiassistant.service;

import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.service.AiServices;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Service
public class AgentService {

    private final ChatLanguageModel chatModel;
    private static final String SYSTEM_PROMPT = "你是一个智能助手，可以帮助用户完成各种任务。";

    public SseEmitter streamChat(AgentRequest request) {
        SseEmitter emitter = new SseEmitter();
        
        try {
            var agentResponse = chatModel.generate(
                    UserMessage.from(request.userMessage())
            );
            
            emitter.send(agentResponse.content().text());
            emitter.complete();
        } catch (Exception e) {
            emitter.completeWithError(e);
        }
        
        return emitter;
    }
}`;

  return (
    <Layout>
      <div className="page-tags">
        <Tag variant="blue">实战项目</Tag>
        <Tag variant="purple">AI助手</Tag>
        <Tag variant="green">~60分钟</Tag>
      </div>

      <h1 className="page-title">AI助手项目实战</h1>
      <p className="page-description">
        本章将带你构建一个功能强大的AI助手应用。超越简单的聊天机器人，
        我们将实现智能Agent系统，集成多种工具和RAG能力，打造生产级AI应用。
      </p>

      <div className="bg-gray-50 rounded-lg p-6 mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 项目概览</h2>
        <p className="text-gray-700 mb-4">
          本项目将构建一个具备以下特性的AI助手：
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-5 hover:border-indigo-300 transition-colors">
            <div className="text-2xl mb-3">🤖 智能Agent</div>
            <p className="text-gray-600 text-sm mb-3">自动理解用户意图，调用合适工具</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-5 hover:border-indigo-300 transition-colors">
            <div className="text-2xl mb-3">🔧 工具调用</div>
            <p className="text-gray-600 text-sm mb-3">集成代码编辑器、网页浏览、API调用等工具</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-5 hover:border-indigo-300 transition-colors">
            <div className="text-2xl mb-3">💾 RAG集成</div>
            <p className="text-gray-600 text-sm mb-3">结合知识库提供准确回答</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-5 hover:border-indigo-300 transition-colors">
            <div className="text-2xl mb-3">📊 多模态支持</div>
            <p className="text-gray-600 text-sm mb-3">处理图像、音频等多种数据类型</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-5 hover:border-indigo-300 transition-colors">
            <div className="text-2xl mb-3">💬 持久化对话</div>
            <p className="text-gray-600 text-sm mb-3">保留对话历史，提供个性化体验</p>
          </div>
        </div>
      </div>

      <section className="content-section">
        <SectionHeader number={1} title="Agent架构设计" />

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 mb-6">
          <h3 className="subsection-title-sm">AI Service vs 传统Agent</h3>
          <p className="text-gray-700 mb-4">
            LangChain4j提供两种Agent实现方式：
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-xl font-semibold text-indigo-600 mb-3">AI Service</div>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li><strong>自动工具选择</strong>：根据上下文自动选择合适的工具</li>
                <li><strong>内置工具集成</strong>：与RAG、Function Calling无缝集成</li>
                <li><strong>流式输出</strong>：实时返回中间结果</li>
                <li><strong>高级功能</strong>：支持复杂的多步推理</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-xl font-semibold text-gray-900 mb-3">传统Agent</div>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li><strong>需要手动选择工具</strong>：每次调用都要明确指定</li>
                <li><strong>缺乏上下文感知</strong>：需要手动传递对话历史</li>
                <li><strong>实现复杂</strong>：多步任务需要自己编排</li>
              </ul>
            </div>
          </div>
        </div>

        <CodeBlockWithCopy language="java" filename="AiServiceConfig.java" code={aiServiceConfigCode} />
      </section>

      <section className="content-section">
        <SectionHeader number={2} title="后端API开发" />

        <h3 className="subsection-title">2.1 AgentController实现</h3>
        <CodeBlockWithCopy language="java" filename="AgentController.java" code={agentControllerCode} />

        <h3 className="subsection-title">2.2 AgentService实现</h3>
        <CodeBlockWithCopy language="java" filename="AgentService.java" code={agentServiceCode} />

        <TipBox type="warning" title="注意">
          <ul className="space-y-1 text-sm">
            <li><strong>流式输出</strong>：生产环境应使用消息队列（RabbitMQ、Kafka）而非SSE</li>
            <li><strong>工具调用超时</strong>：设置合理的超时时间，避免等待过久</li>
            <li><strong>内存管理</strong>：流式输出会占用大量内存，需要及时发送和释放</li>
          </ul>
        </TipBox>
      </section>

      <section className="content-section">
        <SectionHeader number={3} title="前端界面实现" />

        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-6">
          <h3 className="subsection-title-sm">React + TypeScript前端架构</h3>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="text-xl font-semibold text-gray-900 mb-3">组件结构</div>
            <ul className="text-gray-700 text-sm space-y-1">
              <li> src/pages/ - 页面组件</li>
              <li> src/components/ - 可复用组件</li>
              <li> src/services/ - API服务层</li>
              <li> src/hooks/ - 自定义Hooks</li>
              <li> src/types/ - TypeScript类型定义</li>
              <li> src/utils/ - 工具函数</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="content-section summary-section">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">🎯 项目总结</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">核心功能</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li> ✅ 智能Agent系统（自动工具选择 + AI Service）</li>
              <li> ✅ 工具集成（内置多种工具 + 自定义工具支持）</li>
              <li> ✅ 流式输出（SSE实时推送）</li>
              <li> ✅ RAG集成（调用rag-retriever）</li>
              <li> ✅ 多模态支持（图像、音频处理）</li>
              <li> ✅ 持久化对话（ContextManager + UserPreferences）</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">技术栈</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li> 后端：Spring Boot 3.2.x</li>
              <li> AI框架：LangChain4j</li>
              <li> 前端：React + TypeScript</li>
              <li> 数据库：PostgreSQL + PGVector</li>
              <li> 容器化：Docker + Compose</li>
              <li> 监控：Prometheus + Grafana</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="font-medium text-gray-900">下一步：学习 <a href="/project-rag-kb" className="text-indigo-600 hover:text-indigo-800">RAG知识库项目</a>，构建企业级知识库系统。</p>
        </div>
      </section>
    </Layout>
  );
};

export default ProjectAiAssistantPage;
