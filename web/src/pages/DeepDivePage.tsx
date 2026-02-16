import Layout from '../components/layout/Layout';
import { Tag, SectionHeader, CodeBlockWithCopy, TipBox, MermaidChart } from '../components/ui';

const customChatModelCode = `package com.example.langchain4j.custom;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.output.Response;

public class CustomChatModel implements ChatLanguageModel {

    private final String baseUrl;
    private final String apiKey;
    private final Double temperature;

    public CustomChatModel(String baseUrl, String apiKey, Double temperature) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
        this.temperature = temperature;
    }

    @Override
    public Response<AiMessage> generate(List<ChatMessage> messages) {
        String requestBody = buildRequestPayload(messages);
        String response = httpClient.sendRequest(
            baseUrl + "/v1/chat/completions",
            "POST",
            requestBody,
            Map.of("Authorization", "Bearer " + apiKey)
        );
        AiMessage aiMessage = parseResponse(response);
        return new Response<>(aiMessage);
    }

    private String buildRequestPayload(List<ChatMessage> messages) {
        StringBuilder sb = new StringBuilder();
        sb.append("{");
        sb.append("\\"model\\": \\"custom-model-v1\\",");
        sb.append("\\"messages\\": [");
        for (int i = 0; i < messages.size(); i++) {
            ChatMessage msg = messages.get(i);
            if (i > 0) sb.append(",");
            sb.append("{\\"role\\": \\"").append(msg.type()).append("\\",");
            sb.append("\\"content\\": \\"").append(msg.text()).append("\\"}");
        }
        sb.append("],");
        sb.append("\\"temperature\\": ").append(temperature);
        sb.append("}");
        return sb.toString();
    }

    private AiMessage parseResponse(String jsonResponse) {
        JSONObject json = new JSONObject(jsonResponse);
        String content = json.getJSONArray("choices")
                              .getJSONObject(0)
                              .getJSONObject("message")
                              .getString("content");
        return new AiMessage(content);
    }
}`;

const redisChatMemoryCode = `package com.example.langchain4j.memory;

import dev.langchain4j.memory.ChatMemory;
import dev.langchain4j.data.message.ChatMessage;
import redis.clients.jedis.Jedis;

public class RedisChatMemory implements ChatMemory {

    private final String sessionId;
    private final Jedis jedis;
    private final int maxMessages;

    public RedisChatMemory(String sessionId, Jedis jedis, int maxMessages) {
        this.sessionId = sessionId;
        this.jedis = jedis;
        this.maxMessages = maxMessages;
    }

    @Override
    public void add(ChatMessage message) {
        String key = "chat:memory:" + sessionId;
        String jsonMessage = serializeMessage(message);
        jedis.lpush(key, jsonMessage);
        jedis.ltrim(key, 0, maxMessages - 1);
        jedis.expire(key, 86400);
    }

    @Override
    public List<ChatMessage> messages() {
        String key = "chat:memory:" + sessionId;
        List<String> jsonMessages = jedis.lrange(key, 0, -1);
        Collections.reverse(jsonMessages);
        return jsonMessages.stream()
            .map(this::deserializeMessage)
            .collect(Collectors.toList());
    }

    @Override
    public void clear() {
        String key = "chat:memory:" + sessionId;
        jedis.del(key);
    }

    private String serializeMessage(ChatMessage message) {
        JSONObject json = new JSONObject();
        json.put("type", message.type().name());
        json.put("text", message.text());
        return json.toString();
    }

    private ChatMessage deserializeMessage(String json) {
        JSONObject obj = new JSONObject(json);
        String type = obj.getString("type");
        String text = obj.getString("text");
        switch (type) {
            case "USER": return new UserMessage(text);
            case "AI": return new AiMessage(text);
            default: throw new IllegalArgumentException("Unknown message type: " + type);
        }
    }
}`;

const asyncStreamingExampleCode = `package com.example.langchain4j.async;

import dev.langchain4j.model.openai.OpenAiStreamingChatModel;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.UserMessage;
import java.util.concurrent.CompletableFuture;

public class AsyncStreamingExample {

    private final OpenAiStreamingChatModel model;

    public AsyncStreamingExample(String apiKey) {
        this.model = OpenAiStreamingChatModel.builder()
            .apiKey(apiKey)
            .modelName("gpt-4")
            .temperature(0.7)
            .build();
    }

    public CompletableFuture<String> generateAsync(String prompt) {
        CompletableFuture<String> future = new CompletableFuture<>();
        StringBuilder responseBuilder = new StringBuilder();

        model.generate(new UserMessage(prompt), StreamingResponseHandler.builder()
            .onPartialResponse(partialResponse -> {
                String token = partialResponse.content();
                responseBuilder.append(token);
                System.out.print(token);
            })
            .onComplete(completeResponse -> {
                String fullResponse = responseBuilder.toString();
                future.complete(fullResponse);
            })
            .onError(error -> {
                future.completeExceptionally(error);
            })
            .build()
        );

        return future;
    }

    public static void main(String[] args) {
        AsyncStreamingExample example = new AsyncStreamingExample("your-api-key");

        example.generateAsync("介绍一下 LangChain4j 的核心特性")
            .thenAccept(response -> {
                System.out.println("\\n完整响应: " + response);
            })
            .exceptionally(error -> {
                System.err.println("生成失败: " + error.getMessage());
                return null;
            });

        System.out.println("正在生成响应...");
    }
}`;

const requestInterceptorCode = `package com.example.langchain4j.interceptor;

import dev.langchain4j.model.chat.request.ChatRequest;
import dev.langchain4j.model.chat.response.ChatResponse;
import dev.langchain4j.model.chat.ChatLanguageModel;
import java.lang.reflect.Proxy;

public class RequestInterceptor {

    public static ChatLanguageModel wrap(ChatLanguageModel model) {
        return (ChatLanguageModel) Proxy.newProxyInstance(
            RequestInterceptor.class.getClassLoader(),
            new Class[]{ChatLanguageModel.class},
            (proxy, method, args) -> {
                long startTime = System.currentTimeMillis();
                System.out.println("[INTERCEPTOR] Before call: " + method.getName());

                Object result = method.invoke(model, args);

                long endTime = System.currentTimeMillis();
                System.out.println("[INTERCEPTOR] After call: " + method.getName() +
                    ", Time: " + (endTime - startTime) + "ms");

                if (result instanceof ChatResponse) {
                    ChatResponse response = (ChatResponse) result;
                    response.metadata().put("interceptor_timestamp", endTime);
                }

                return result;
            }
        );
    }

    public static void main(String[] args) {
        ChatLanguageModel originalModel = OpenAiChatModel.builder()
            .apiKey("your-api-key")
            .build();

        ChatLanguageModel wrappedModel = RequestInterceptor.wrap(originalModel);

        String response = wrappedModel.generate("Hello!");
        System.out.println("Response: " + response);
    }
}`;

const chatModelCoreCode = `package com.example.langchain4j.core;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.output.Response;
import dev.langchain4j.data.message.ChatMessage;

public abstract class ChatModelCore implements ChatLanguageModel {

    @Override
    public abstract Response<AiMessage> generate(List<ChatMessage> messages);

    @Override
    public Response<AiMessage> generate(
        String systemPrompt,
        List<ChatMessage> messages
    ) {
        List<ChatMessage> fullMessages = new ArrayList<>();
        fullMessages.add(new SystemMessage(systemPrompt));
        fullMessages.addAll(messages);
        return generate(fullMessages);
    }

    @Override
    public Response<AiMessage> generate(String userMessage) {
        List<ChatMessage> messages = List.of(new UserMessage(userMessage));
        return generate(messages);
    }

    public int estimateTokenCount(String text) {
        return (text.length() + 3) / 4;
    }

    public String getModelInfo() {
        return this.getClass().getSimpleName();
    }

    public void close() {
    }
}`;

const DeepDivePage = () => {
  return (
    <Layout>
      <div className="page-tags">
        <Tag variant="indigo">深度解析</Tag>
        <Tag variant="purple">架构设计</Tag>
        <Tag variant="pink">源码分析</Tag>
      </div>

      <h1 className="page-title">深度解析</h1>
      <p className="page-description">
        深入 LangChain4j 的内部架构、设计模式和扩展机制。
      </p>

      <nav className="toc-nav">
        <h3 className="toc-title">目录</h3>
        <ol className="toc-list">
          <li className="toc-item"><span className="toc-number">1.</span> <a href="#architecture" className="toc-link">LangChain4j 内部架构</a></li>
          <li className="toc-item"><span className="toc-number">2.</span> <a href="#memory" className="toc-link">内存管理机制</a></li>
          <li className="toc-item"><span className="toc-number">3.</span> <a href="#concurrency" className="toc-link">线程模型与并发</a></li>
          <li className="toc-item"><span className="toc-number">4.</span> <a href="#extension" className="toc-link">高级扩展性模式</a></li>
          <li className="toc-item"><span className="toc-number">5.</span> <a href="#source" className="toc-link">源码解析</a></li>
        </ol>
      </nav>

      <section id="architecture" className="content-section">
        <SectionHeader number={1} title="LangChain4j 内部架构" />
        <p className="paragraph">
          LangChain4j 采用模块化、可扩展的架构设计。本节深入解析其核心组件、插件系统和扩展点机制。
        </p>

        <h3 className="subsection-title">1.1 核心组件设计</h3>

        <p className="paragraph mb-4">LangChain4j 的核心架构概览：</p>

        <MermaidChart chart={`
          graph TB
              subgraph "🎨 服务层 Service Layer"
                  A1[AiServices]
                  A2[ChatMemory]
              end

              subgraph "🤖 模型层 Model Layer"
                  B1[ChatLanguageModel]
                  B2[StreamingChatModel]
                  B3[EmbeddingModel]
              end

              subgraph "🔧 工具层 Tool Layer"
                  C1[ToolSpecification]
                  C2[ToolExecutor]
              end

              subgraph "💾 存储层 Store Layer"
                  D1[ChatMemoryProvider]
                  D2[EmbeddingStore]
              end

              A1 --> B1
              A1 --> B2
              A1 --> C1
              A2 --> D1
              B3 --> D2

              style A1 fill:#f3e5f5
              style B1 fill:#e3f2fd
              style C1 fill:#fff3e0
              style D2 fill:#e8f5e9
        `} />
        <p className="text-gray-700 mb-4">LangChain4j 的核心由四个抽象接口构成，它们共同构建了灵活的 AI 应用框架：</p>

        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>ChatLanguageModel</strong>: 语言模型接口，定义了与 LLM 交互的核心方法</li>
          <li><strong>Tool</strong>: 工具接口，封装可被 AI 调用的外部功能</li>
          <li><strong>Memory</strong>: 内存接口，管理对话历史和上下文</li>
          <li><strong>Chain</strong>: 链式接口，连接多个组件形成处理流程</li>
        </ul>

        <h4 className="text-lg font-semibold text-gray-900 mb-3">自定义 ChatModel 实现</h4>
        <p className="text-gray-700 mb-4">通过实现 ChatLanguageModel 接口，可以自定义任何 LLM 的适配器：</p>

        <CodeBlockWithCopy
          code={customChatModelCode}
          language="java"
          filename="CustomChatModel.java"
        />

        <h3 className="subsection-title">1.2 插件系统机制</h3>
        <p className="text-gray-700 mb-4">LangChain4j 使用 Java SPI（Service Provider Interface）实现插件系统，支持运行时动态加载扩展：</p>

        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>ServiceLoader</strong>: Java 标准的服务加载机制</li>
          <li><strong>Auto-Registration</strong>: 通过 META-INF/services 自动注册插件</li>
          <li><strong>Priority</strong>: 插件优先级控制加载顺序</li>
        </ul>

        <h3 className="subsection-title">1.3 扩展点设计</h3>
        <p className="text-gray-700 mb-4">LangChain4j 在关键流程中定义了多个扩展点，允许开发者插入自定义逻辑：</p>

        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>RequestInterceptor</strong>: 请求拦截器，在发送到 LLM 前修改请求</li>
          <li><strong>ResponseHandler</strong>: 响应处理器，在接收 LLM 响应后进行处理</li>
          <li><strong>TokenCounter</strong>: Token 计数器，自定义 token 计算逻辑</li>
          <li><strong>MemoryProvider</strong>: 内存提供者，自定义对话存储策略</li>
        </ul>
      </section>

      <section id="memory" className="content-section">
        <SectionHeader number={2} title="内存管理机制" />
        <p className="paragraph">
          LangChain4j 提供灵活的内存管理系统，支持多种对话历史存储和检索策略。
        </p>

        <h3 className="subsection-title">2.1 Message Window 实现</h3>
        <p className="text-gray-700 mb-4">MessageWindow 是最常用的内存实现，使用滑动窗口算法管理对话历史：</p>

        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>最大消息数</strong>: 限制保留的消息数量</li>
          <li><strong>过期策略</strong>: 满载时自动移除最早的消息</li>
          <li><strong>Token 感知</strong>: 基于 token 数量而非消息数量限制</li>
        </ul>

        <h4 className="text-lg font-semibold text-gray-900 mb-3">自定义 Memory 实现</h4>
        <p className="text-gray-700 mb-4">通过实现 ChatMemory 接口，可以自定义对话存储逻辑：</p>

        <CodeBlockWithCopy
          code={redisChatMemoryCode}
          language="java"
          filename="RedisChatMemory.java"
        />

        <h3 className="subsection-title">2.2 Token 滑动窗口</h3>
        <p className="text-gray-700 mb-4">TokenChatMemory 实现基于 token 数量的限制，比简单的消息数量限制更精确：</p>

        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>Token 计数</strong>: 使用 Tokenizer 准确计算 token 数量</li>
          <li><strong>智能截断</strong>: 保留最新消息，自动移除最早消息</li>
          <li><strong>跨模型兼容</strong>: 支持不同 LLM 的 token 计算方式</li>
        </ul>

        <h3 className="subsection-title">2.3 持久化策略</h3>
        <p className="text-gray-700 mb-4">LangChain4j 支持多种持久化存储后端：</p>

        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>数据库</strong>: PostgreSQL、MySQL 等关系型数据库</li>
          <li><strong>NoSQL</strong>: Redis、MongoDB 等键值存储</li>
          <li><strong>文件系统</strong>: 本地文件或云存储</li>
          <li><strong>自定义</strong>: 实现自定义的 ChatMemory 接口</li>
        </ul>
      </section>

      <section id="concurrency" className="content-section">
        <SectionHeader number={3} title="线程模型与并发" />
        <p className="paragraph">
          LangChain4j 提供同步和异步两种调用模式，并内置线程安全机制。
        </p>

        <h3 className="subsection-title">3.1 同步 vs 异步调用</h3>
        <p className="text-gray-700 mb-4">根据应用场景选择合适的调用模式：</p>

        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>同步调用</strong>: 简单直接，适合单线程场景</li>
          <li><strong>异步调用</strong>: 基于 CompletableFuture，适合高并发场景</li>
          <li><strong>流式调用</strong>: 实时返回生成内容，提升用户体验</li>
        </ul>

        <h4 className="text-lg font-semibold text-gray-900 mb-3">异步流式调用示例</h4>
        <p className="text-gray-700 mb-4">使用 StreamingChatLanguageModel 实现实时流式输出：</p>

        <CodeBlockWithCopy
          code={asyncStreamingExampleCode}
          language="java"
          filename="AsyncStreamingExample.java"
        />

        <h3 className="subsection-title">3.2 线程安全设计</h3>
        <p className="text-gray-700 mb-4">LangChain4j 的核心组件都是线程安全的：</p>

        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>Immutable 对象</strong>: ChatLanguageModel、Tool 等核心对象不可变</li>
          <li><strong>线程局部变量</strong>: Memory 使用线程局部变量避免竞争</li>
          <li><strong>无状态设计</strong>: 大多数组件是无状态的，天然线程安全</li>
        </ul>

        <h3 className="subsection-title">3.3 并发最佳实践</h3>
        <p className="text-gray-700 mb-4">在高并发场景下，建议遵循以下最佳实践：</p>

        <TipBox variant="info" title="并发最佳实践">
          <ul className="list-styled">
            <li><strong>连接池</strong>: 使用 HTTP 连接池复用连接</li>
            <li><strong>限流</strong>: 使用 RateLimiter 控制 LLM API 调用频率</li>
            <li><strong>异步</strong>: 优先使用异步 API 避免阻塞</li>
            <li><strong>缓存</strong>: 对重复请求使用缓存减少 LLM 调用</li>
          </ul>
        </TipBox>
      </section>

      <section id="extension" className="content-section">
        <SectionHeader number={4} title="高级扩展性模式" />
        <p className="paragraph">
          LangChain4j 提供多种扩展机制，支持深度定制和集成。
        </p>

        <h3 className="subsection-title">4.1 自定义 ChatModel</h3>
        <p className="text-gray-700 mb-4">通过实现 ChatLanguageModel 接口，可以集成任何 LLM 服务：</p>

        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>开源模型</strong>: 集成本地部署的 Llama、Mistral 等</li>
          <li><strong>私有云</strong>: 集成企业内部的 LLM 服务</li>
          <li><strong>自定义协议</strong>: 适配非标准的 LLM API</li>
        </ul>

        <h4 className="text-lg font-semibold text-gray-900 mb-3">AOP 拦截器实现</h4>
        <p className="text-gray-700 mb-4">使用 AOP 拦截器在请求/响应生命周期中插入自定义逻辑：</p>

        <CodeBlockWithCopy
          code={requestInterceptorCode}
          language="java"
          filename="RequestInterceptor.java"
        />

        <h3 className="subsection-title">4.2 自定义 ToolExecutor</h3>
        <p className="text-gray-700 mb-4">扩展工具执行器，支持更复杂的工具调用场景：</p>

        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>异步执行</strong>: 支持异步工具调用</li>
          <li><strong>批处理</strong>: 批量执行多个工具调用</li>
          <li><strong>缓存</strong>: 缓存工具调用结果</li>
          <li><strong>重试</strong>: 自动重试失败的工具调用</li>
        </ul>
      </section>

      <section id="source" className="content-section">
        <SectionHeader number={5} title="源码解析" />
        <p className="paragraph">
          通过分析 LangChain4j 的源码，理解其设计思路和最佳实践。
        </p>

        <h3 className="subsection-title">5.1 关键类设计思路</h3>
        <p className="text-gray-700 mb-4">LangChain4j 的核心类采用了简洁而强大的设计：</p>

        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>ChatLanguageModel</strong>: 核心接口，定义了与 LLM 交互的抽象</li>
          <li><strong>AiServices</strong>: 动态代理生成器，简化接口定义</li>
          <li><strong>Chain</strong>: 责任链模式，连接多个处理节点</li>
          <li><strong>ToolSpecification</strong>: 工具描述，支持函数调用</li>
        </ul>

        <h3 className="subsection-title">5.2 设计模式应用</h3>
        <p className="text-gray-700 mb-4">LangChain4j 广泛应用经典设计模式：</p>

        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>Builder Pattern</strong>: 构建复杂对象（OpenAiChatModel.builder()）</li>
          <li><strong>Strategy Pattern</strong>: 不同的 LLM 实现策略</li>
          <li><strong>Chain of Responsibility</strong>: 处理链（Chain、ToolExecutor）</li>
          <li><strong>Proxy Pattern</strong>: AiServices 的动态代理</li>
          <li><strong>Template Method</strong>: 抽象基类定义算法骨架</li>
        </ul>

        <h3 className="subsection-title">5.3 性能优化技巧</h3>
        <p className="text-gray-700 mb-4">从源码中学到的性能优化经验：</p>

        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>连接池复用</strong>: HTTP 客户端连接池减少开销</li>
          <li><strong>缓存设计</strong>: Token 计数结果缓存</li>
          <li><strong>懒加载</strong>: 延迟初始化重量级资源</li>
          <li><strong>异步非阻塞</strong>: StreamingChatModel 的流式处理</li>
          <li><strong>对象池</strong>: 可重用对象的池化管理</li>
        </ul>

        <h4 className="text-lg font-semibold text-gray-900 mb-3">自定义 ChatModel 核心实现</h4>
        <p className="text-gray-700 mb-4">深入理解 ChatModel 的实现原理：</p>

        <CodeBlockWithCopy
          code={chatModelCoreCode}
          language="java"
          filename="ChatModelCore.java"
        />
      </section>

      <section className="content-section">
        <div className="summary-card">
          <h3 className="text-2xl font-bold mb-4">本章小结</h3>
          <p className="mb-4">深度解析了 LangChain4j 的内部架构、设计模式和扩展机制。通过理解这些底层原理，您可以：</p>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li><strong>自定义扩展</strong>：实现自己的 ChatModel、Memory、Tool 等组件</li>
            <li><strong>性能优化</strong>：根据应用场景选择合适的调用模式和存储策略</li>
            <li><strong>问题诊断</strong>：通过源码理解快速定位和解决问题</li>
            <li><strong>架构设计</strong>：借鉴 LangChain4j 的设计模式应用到自己的项目</li>
          </ul>
          <div className="border-t border-indigo-400 pt-6">
            <p className="text-sm opacity-80 mb-2">核心特性</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Tag variant="indigo">模块化架构</Tag>
              <Tag variant="purple">插件系统</Tag>
              <Tag variant="blue">扩展点</Tag>
              <Tag variant="green">线程安全</Tag>
              <Tag variant="orange">异步支持</Tag>
            </div>
            <p className="text-sm opacity-80 mb-2">技术栈</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Tag variant="cyan">Java 17+</Tag>
              <Tag variant="indigo">LangChain4j</Tag>
              <Tag variant="purple">SPI</Tag>
              <Tag variant="blue">CompletableFuture</Tag>
            </div>
            <a href="/error-handling" className="text-white hover:text-indigo-200 transition-colors">
              下一章：错误处理 →
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DeepDivePage;
