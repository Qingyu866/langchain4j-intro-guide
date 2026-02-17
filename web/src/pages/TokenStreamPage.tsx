import Layout from '../components/layout/Layout';
import { CodeBlockWithCopy, MermaidChart } from '../components/ui';

const basicStreamExample = `
package com.example.stream;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.model.output.Response;

/**
 * 基础流式响应示例
 * 展示如何使用 TokenStream 实现实时流式输出
 */
public class BasicStreamingExample {

    public static void main(String[] args) {
        // 创建支持流式的 ChatModel
        ChatLanguageModel model = OpenAiChatModel.builder()
                .apiKey("your-api-key")
                .modelName("gpt-4")
                .temperature(0.7)
                .build();

        String userMessage = "请用3个要点介绍量子计算的基本原理";

        // 启动流式响应
        model.generate(userMessage, new StreamingHandler());
    }

    /**
     * 流式处理器：处理每个 token 和完成事件
     */
    static class StreamingHandler implements StreamingChatModelListener {

        private final StringBuilder fullResponse = new StringBuilder();

        @Override
        public void onPartial(String token) {
            // 接收到部分 token
            System.out.print(token);
            fullResponse.append(token);
        }

        @Override
        public void onComplete(Response<AiMessage> response) {
            // 流式完成
            System.out.println("\\n\\n[流式完成]");
            System.out.println("完整响应: " + fullResponse.toString());

            // 可以访问完整的 AiMessage
            AiMessage message = response.content();
            System.out.println("Token 使用情况: " +
                message.tokenUsage().ifPresent(usage ->
                    "输入: " + usage.inputTokenCount() +
                    ", 输出: " + usage.outputTokenCount()
                ));
        }

        @Override
        public void onError(Throwable error) {
            // 错误处理
            System.err.println("流式处理出错: " + error.getMessage());
            error.printStackTrace();
        }
    }
}
`.trim();

const reactiveStreamExample = `
package com.example.stream.reactive;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.model.output.Response;
import reactor.core.publisher.Flux;

/**
 * 响应式流式处理示例
 * 使用 Reactor 集成流式响应
 */
public class ReactiveStreamingExample {

    public static void main(String[] args) {
        ChatLanguageModel model = OpenAiChatModel.builder()
                .apiKey("your-api-key")
                .modelName("gpt-4")
                .build();

        String prompt = "解释微服务架构的优缺点";

        // 创建响应式流
        Flux<String> tokenStream = model.stream(prompt);

        // 订阅并处理流式 token
        tokenStream
            .buffer(100)  // 每100个token批量处理
            .subscribe(
                buffer -> {
                    String chunk = String.join("", buffer);
                    System.out.println("[批量] " + chunk);
                    // 可以发送到 WebSocket 前端
                    sendToFrontend(chunk);
                },
                error -> System.err.println("错误: " + error),
                () -> System.out.println("\\n流式完成!")
            );

        // 阻塞主线程
        try { Thread.sleep(10000); } catch (InterruptedException e) {}
    }

    private static void sendToFrontend(String chunk) {
        // WebSocket 发送逻辑
        // webSocketSession.send(new TextMessage(chunk));
    }
}
`.trim();

const streamingWithValidationExample = `
package com.example.stream.validation;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.service.output.OutputGuardException;
import dev.langchain4j.service.stream.StreamingChatModelListener;

/**
 * 流式输出验证示例
 * 在流式输出过程中实时验证内容
 */
public class StreamingValidationExample {

    public static void main(String[] args) {
        ChatLanguageModel model = OpenAiChatModel.builder()
                .apiKey("your-api-key")
                .modelName("gpt-4")
                .temperature(0.3)
                .build();

        String prompt = "生成一个包含用户信息的JSON（姓名、邮箱）";

        model.generate(prompt, new ValidatingStreamingHandler());
    }

    static class ValidatingStreamingHandler implements StreamingChatModelListener {

        private final StringBuilder content = new StringBuilder();
        private boolean hasPersonalInfo = false;

        // 敏感信息关键词
        private final String[] SENSITIVE_PATTERNS = {
            "\\d{15,}",  // 长数字（可能是身份证）
            "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b"  // 邮箱
        };

        @Override
        public void onPartial(String token) {
            content.append(token);
            System.out.print(token);

            // 实时检查敏感信息
            for (String pattern : SENSITIVE_PATTERNS) {
                if (token.matches(pattern)) {
                    hasPersonalInfo = true;
                    System.out.println("\\n[警告] 检测到敏感信息!");
                }
            }
        }

        @Override
        public void onComplete(Response<AiMessage> response) {
            System.out.println("\\n[验证完成]");

            if (hasPersonalInfo) {
                System.err.println("错误: 输出包含敏感个人信息");
                // 可以记录日志或触发告警
            }

            // 最终格式验证
            String jsonContent = content.toString();
            if (!isValidJson(jsonContent)) {
                System.err.println("警告: JSON 格式可能无效");
            }
        }

        @Override
        public void onError(Throwable error) {
            System.err.println("\\n流式错误: " + error.getMessage());
        }

        private boolean isValidJson(String content) {
            try {
                new ObjectMapper().readTree(content);
                return true;
            } catch (Exception e) {
                return false;
            }
        }
    }
}
`.trim();

const multiAgentStreamExample = `
package com.example.stream.multiagent;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.agent.tool.Tool;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.stream.StreamingChatModelListener;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CountDownLatch;

/**
 * 多 Agent 并发流式处理示例
 * 多个 Agent 同时处理任务并实时输出
 */
public class MultiAgentStreamingExample {

    private static final ConcurrentHashMap<String, StringBuilder> agentOutputs =
        new ConcurrentHashMap<>();

    public static void main(String[] args) throws InterruptedException {
        ChatLanguageModel model = OpenAiChatModel.builder()
                .apiKey("your-api-key")
                .modelName("gpt-4")
                .build();

        String userQuery = "分析人工智能在医疗、金融、教育领域的应用";

        // 创建 3 个专业 Agent
        CountDownLatch latch = new CountDownLatch(3);

        // 医疗领域 Agent
        Thread medicalAgent = new Thread(() -> {
            String prompt = "作为医疗AI专家，分析AI在医疗领域的应用：" + userQuery;
            model.generate(prompt, new AgentHandler("医疗Agent"));
            latch.countDown();
        });

        // 金融领域 Agent
        Thread financeAgent = new Thread(() -> {
            String prompt = "作为金融科技专家，分析AI在金融领域的应用：" + userQuery;
            model.generate(prompt, new AgentHandler("金融Agent"));
            latch.countDown();
        });

        // 教育领域 Agent
        Thread educationAgent = new Thread(() -> {
            String prompt = "作为教育技术专家，分析AI在教育领域的应用：" + userQuery;
            model.generate(prompt, new AgentHandler("教育Agent"));
            latch.countDown();
        });

        // 启动所有 Agent
        medicalAgent.start();
        financeAgent.start();
        educationAgent.start();

        // 等待所有 Agent 完成
        latch.await();

        // 汇总结果
        System.out.println("\\n=== 汇总报告 ===");
        agentOutputs.forEach((agent, output) -> {
            System.out.println("\\n【" + agent + "】");
            System.out.println(output.toString());
        });
    }

    static class AgentHandler implements StreamingChatModelListener {
        private final String agentName;
        private final StringBuilder output = new StringBuilder();

        public AgentHandler(String agentName) {
            this.agentName = agentName;
            agentOutputs.put(agentName, output);
        }

        @Override
        public void onPartial(String token) {
            output.append(token);
            System.out.println("[" + agentName + "] " + token);
        }

        @Override
        public void onComplete(Response<AiMessage> response) {
            System.out.println("\\n[" + agentName + "] 完成");
        }

        @Override
        public void onError(Throwable error) {
            System.err.println("[" + agentName + "] 错误: " + error.getMessage());
        }
    }
}
`.trim();

const ragStreamExample = `
package com.example.stream.rag;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.EmbeddingStoreIngestor;
import dev.langchain4j.model.embedding.EmbeddingModel;
import static dev.langchain4j.model.openai.OpenAiEmbeddingModel;

/**
 * RAG 流式检索增强示例
 * 显示检索到的文档并流式生成答案
 */
public class RagStreamingExample {

    public static void main(String[] args) {
        ChatLanguageModel chatModel = OpenAiChatModel.builder()
                .apiKey("your-api-key")
                .modelName("gpt-4")
                .build();

        EmbeddingModel embeddingModel = OpenAiEmbeddingModel.builder()
                .apiKey("your-api-key")
                .build();

        EmbeddingStore<TextSegment> vectorStore = /* 初始化向量存储 */;

        // 用户查询
        String query = "什么是 LangChain4j 的 TokenStream？";

        // 1. 先检索相关文档
        List<TextSegment> relevantDocs = vectorStore.findRelevant(
            embeddingModel.embed(query).content(),
            3  // top-3 文档
        );

        System.out.println("=== 检索到的相关文档 ===");
        relevantDocs.forEach(doc -> {
            System.out.println("- " + doc.text());
        });

        // 2. 构建增强提示
        String enhancedPrompt = buildRagPrompt(query, relevantDocs);

        // 3. 流式生成答案
        System.out.println("\\n=== AI 回答（流式） ===");
        chatModel.generate(enhancedPrompt, new RagStreamingHandler());
    }

    private static String buildRagPrompt(String query, List<TextSegment> docs) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("基于以下参考文档回答问题：\\n\\n");

        for (int i = 0; i < docs.size(); i++) {
            prompt.append("【文档").append(i + 1).append("】\\n");
            prompt.append(docs.get(i).text()).append("\\n\\n");
        }

        prompt.append("问题：").append(query).append("\\n\\n");
        prompt.append("请提供详细且准确的答案。");

        return prompt.toString();
    }

    static class RagStreamingHandler implements StreamingChatModelListener {

        private final StringBuilder answer = new StringBuilder();

        @Override
        public void onPartial(String token) {
            answer.append(token);
            System.out.print(token);

            // 实时统计
            if (answer.length() % 100 == 0) {
                System.out.printf(" [%d 字符]\\n", answer.length());
            }
        }

        @Override
        public void onComplete(Response<AiMessage> response) {
            System.out.println("\\n\\n[答案完成]");
            System.out.println("总字符数: " + answer.length());

            response.tokenUsage().ifPresent(usage -> {
                System.out.printf("Token 使用: 输入=%d, 输出=%d\\n",
                    usage.inputTokenCount(),
                    usage.outputTokenCount()
                );
            });
        }

        @Override
        public void onError(Throwable error) {
            System.err.println("\\n生成错误: " + error.getMessage());
        }
    }
}
`.trim();

const streamingMetricsExample = `
package com.example.stream.metrics;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.service.stream.StreamingChatModelListener;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.model.output.Response;
import java.time.Instant;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * 流式性能监控示例
 * 实时统计流式响应的性能指标
 */
public class StreamingMetricsExample {

    public static void main(String[] args) {
        ChatLanguageModel model = OpenAiChatModel.builder()
                .apiKey("your-api-key")
                .modelName("gpt-4")
                .temperature(0.7)
                .build();

        String prompt = "撰写一篇关于 AI 未来发展的短文（200字）";

        System.out.println("=== 流式性能监控 ===\\n");
        model.generate(prompt, new MetricsStreamingHandler());
    }

    static class MetricsStreamingHandler implements StreamingChatModelListener {

        private final StringBuilder content = new StringBuilder();
        private final AtomicInteger tokenCount = new AtomicInteger(0);

        private Instant firstTokenTime;
        private Instant lastTokenTime;
        private Instant startTime;

        private final int[] tokenLatencies = new int[1000];  // 存储token间延迟
        private int latencyIndex = 0;

        @Override
        public void onStart() {
            startTime = Instant.now();
            System.out.println("[开始] " + startTime);
        }

        @Override
        public void onPartial(String token) {
            if (firstTokenTime == null) {
                firstTokenTime = Instant.now();
                long ttft = java.time.Duration.between(startTime, firstTokenTime).toMillis();
                System.out.printf("\\n[首字延迟] %d ms\\n", ttft);
            }

            lastTokenTime = Instant.now();
            int count = tokenCount.incrementAndGet();

            // 记录 token 间延迟
            if (latencyIndex < tokenLatencies.length) {
                tokenLatencies[latencyIndex++] = count;
            }

            content.append(token);
            System.out.print(token);

            // 每50个token统计一次
            if (count % 50 == 0) {
                System.out.printf("\\n[进度] 已接收 %d tokens\\n", count);
            }
        }

        @Override
        public void onComplete(Response<AiMessage> response) {
            Instant endTime = Instant.now();

            // 计算总时长
            long totalDuration = java.time.Duration.between(startTime, endTime).toMillis();
            long generationDuration = java.time.Duration.between(firstTokenTime, endTime).toMillis();

            // 计算 token 速度
            double tokensPerSecond = (tokenCount.get() * 1000.0) / generationDuration;

            System.out.println("\\n\\n=== 性能报告 ===");
            System.out.printf("首字延迟 (TTFT): %d ms\\n",
                java.time.Duration.between(startTime, firstTokenTime).toMillis());
            System.out.printf("总时长: %d ms\\n", totalDuration);
            System.out.printf("生成时长: %d ms\\n", generationDuration);
            System.out.printf("总 Token 数: %d\\n", tokenCount.get());
            System.out.printf("生成速度: %.2f tokens/秒\\n", tokensPerSecond);
            System.out.printf("平均 Token 延迟: %.2f ms\\n",
                (double) generationDuration / tokenCount.get());

            response.tokenUsage().ifPresent(usage -> {
                System.out.printf("\\n官方统计:\\n");
                System.out.printf("  输入 Tokens: %d\\n", usage.inputTokenCount());
                System.out.printf("  输出 Tokens: %d\\n", usage.outputTokenCount());
                System.out.printf("  总 Tokens: %d\\n",
                    usage.inputTokenCount() + usage.outputTokenCount());
            });
        }

        @Override
        public void onError(Throwable error) {
            System.err.println("\\n[错误] " + error.getMessage());
        }
    }
}
`.trim();

const TokenStreamPage = () => {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Token Stream 深度解析</h1>
          <p className="text-xl text-gray-600">
            实时流式输出的完整指南：从基础到高级应用
          </p>
        </div>

        {/* 导航 */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
          <nav className="space-y-1">
            <a href="#overview" className="block text-blue-700 hover:text-blue-900">概述</a>
            <a href="#basic-usage" className="block text-blue-700 hover:text-blue-900">基础用法</a>
            <a href="#reactive" className="block text-blue-700 hover:text-blue-900">响应式集成</a>
            <a href="#validation" className="block text-blue-700 hover:text-blue-900">流式验证</a>
            <a href="#multi-agent" className="block text-blue-700 hover:text-blue-900">多 Agent 流式</a>
            <a href="#rag-streaming" className="block text-blue-700 hover:text-blue-900">RAG 流式</a>
            <a href="#metrics" className="block text-blue-700 hover:text-blue-900">性能监控</a>
            <a href="#best-practices" className="block text-blue-700 hover:text-blue-900">最佳实践</a>
          </nav>
        </div>

        {/* 概述 */}
        <section id="overview" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">概述</h2>

          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">什么是 Token Stream？</h3>
            <div className="prose max-w-none text-gray-700 space-y-4">
              <p>
                <strong>Token Stream</strong> 是 LangChain4j 提供的流式响应机制，允许在 LLM 生成过程中实时接收每个 token，
                而不是等待完整响应生成完毕。
              </p>

              <h4 className="font-semibold text-gray-900 mt-6 mb-3">核心优势</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>更好的用户体验：</strong>用户立即看到输出，无需等待</li>
                <li><strong>实时反馈：</strong>可以提前检测并中断不期望的输出</li>
                <li><strong>降低延迟感知：</strong>首字延迟（TTFT）远低于完整响应时间</li>
                <li><strong>灵活处理：</strong>支持实时验证、过滤、转换流式内容</li>
                <li><strong>并发能力：</strong>可同时处理多个流式请求</li>
              </ul>

              <h4 className="font-semibold text-gray-900 mt-6 mb-3">典型应用场景</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>聊天机器人：实现类似 ChatGPT 的逐字显示效果</li>
                <li>代码生成：实时显示生成中的代码</li>
                <li>长文本生成：报告、文章、邮件等</li>
                <li>多 Agent 并发：多个 AI 同时处理任务</li>
                <li>实时监控：在流式输出中进行验证、过滤、告警</li>
              </ul>
            </div>
          </div>

          {/* 工作流程图 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Token Stream 工作流程</h3>
            <MermaidChart chart={`
graph TB
    A[客户端请求] --> B[ChatLanguageModel.generate]
    B --> C[建立流式连接]
    C --> D{LLM 生成 Token}
    D --> E[onPartial 回调]
    E --> F{更多 Token}
    F -->|是| D
    F -->|否| G[onComplete 回调]
    G --> H[返回完整响应]

    D -.->|错误| I[onError 回调]
    I --> J[异常处理]

    style A fill:#e3f2fd
    style H fill:#4caf50
    style I fill:#f44336
            `} />
          </div>
        </section>

        {/* 基础用法 */}
        <section id="basic-usage" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">基础用法</h2>

          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">StreamingChatModelListener 接口</h3>
            <div className="prose max-w-none text-gray-700">
              <p>LangChain4j 通过 <code className="bg-gray-100 px-2 py-1 rounded">StreamingChatModelListener</code> 接口提供流式处理能力：</p>
            </div>
            <CodeBlockWithCopy
              language="java"
              code={`public interface StreamingChatModelListener {
    // 接收部分 token（核心方法）
    void onPartial(String token);

    // 流式完成
    void onComplete(Response<AiMessage> response);

    // 错误处理
    void onError(Throwable error);
}`}
            />
          </div>

          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">完整示例：基础流式输出</h3>
            <CodeBlockWithCopy
              language="java"
              code={basicStreamExample}
            />

            <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500">
              <h4 className="font-semibold text-green-900 mb-2">关键点说明</h4>
              <ul className="list-disc pl-5 text-green-800 space-y-1">
                <li><strong>onPartial：</strong>每次接收一个或多个 token，可实时处理或输出</li>
                <li><strong>onComplete：</strong>流式结束后提供完整的 Response 对象，包含 token 使用统计</li>
                <li><strong>onError：</strong>任何阶段的错误都会通过此回调通知</li>
                <li><strong>StringBuilder：</strong>建议累积 token 以便后续处理</li>
              </ul>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">输出效果</h3>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              <div>量</div>
              <div>子</div>
              <div>计</div>
              <div>算</div>
              <div>利</div>
              <div>用</div>
              <div>...</div>
              <div className="text-gray-400 mt-2">[流式完成]</div>
              <div className="text-gray-400">完整响应: 量子计算利用...</div>
            </div>
          </div>
        </section>

        {/* 响应式集成 */}
        <section id="reactive" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">响应式集成</h2>

          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">使用 Reactor 处理流式响应</h3>
            <div className="prose max-w-none text-gray-700 mb-4">
              <p>
                LangChain4j 可以与 Project Reactor 等响应式框架无缝集成，实现更强大的流式处理能力。
              </p>
            </div>
            <CodeBlockWithCopy
              language="java"
              code={reactiveStreamExample}
            />
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <h4 className="font-semibold text-blue-900 mb-2">响应式编程优势</h4>
            <ul className="list-disc pl-5 text-blue-800 space-y-1">
              <li><strong>背压控制：</strong>通过 buffer() 控制处理速率，避免内存溢出</li>
              <li><strong>操作符链：</strong>map、filter、reduce 等丰富的操作符</li>
              <li><strong>异步非阻塞：</strong>提高系统吞吐量</li>
              <li><strong>WebSocket 集成：</strong>轻松对接前端实时推送</li>
            </ul>
          </div>
        </section>

        {/* 流式验证 */}
        <section id="validation" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">流式验证</h2>

          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">实时输出验证与过滤</h3>
            <div className="prose max-w-none text-gray-700 mb-4">
              <p>
                在流式输出过程中实时验证内容，及时发现并拦截不合规的输出。
              </p>
            </div>
            <CodeBlockWithCopy
              language="java"
              code={streamingWithValidationExample}
            />
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">验证策略建议</h4>
            <ul className="list-disc pl-5 text-yellow-800 space-y-1">
              <li><strong>轻量级检测：</strong>使用关键词匹配，避免复杂正则</li>
              <li><strong>累积验证：</strong>某些验证需要完整上下文，在 onComplete 中进行</li>
              <li><strong>快速失败：</strong>检测到问题立即中断，避免继续生成</li>
              <li><strong>日志记录：</strong>记录所有验证失败案例用于审计</li>
            </ul>
          </div>
        </section>

        {/* 多 Agent 流式 */}
        <section id="multi-agent" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">多 Agent 并发流式</h2>

          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">多个 Agent 同时工作</h3>
            <div className="prose max-w-none text-gray-700 mb-4">
              <p>
                利用多线程并发，让多个 AI Agent 同时处理不同维度的任务，并通过流式输出实时展示进度。
              </p>
            </div>
            <CodeBlockWithCopy
              language="java"
              code={multiAgentStreamExample}
            />
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">并发流式输出效果</h3>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm space-y-1">
              <div>[医疗Agent] 人工智能</div>
              <div>[金融Agent] 在金融</div>
              <div>[教育Agent] 教育科技</div>
              <div>[医疗Agent] 在医疗领域</div>
              <div>[金融Agent] 领域的应用包括...</div>
              <div>[教育Agent] 正在变革...</div>
              <div className="text-gray-400 mt-2">...</div>
              <div className="text-blue-400 mt-4">=== 汇总报告 ===</div>
            </div>
          </div>
        </section>

        {/* RAG 流式 */}
        <section id="rag-streaming" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">RAG 流式检索增强</h2>

          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">显示检索文档 + 流式生成答案</h3>
            <div className="prose max-w-none text-gray-700 mb-4">
              <p>
                在 RAG 应用中，先显示检索到的相关文档，然后流式生成基于这些文档的答案。
              </p>
            </div>
            <CodeBlockWithCopy
              language="java"
              code={ragStreamExample}
            />
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">输出流程</h3>
            <MermaidChart chart={`
graph TB
    A[用户查询] --> B[向量检索]
    B --> C[显示相关文档]
    C --> D[构建增强提示]
    D --> E[LLM 流式生成]
    E --> F[实时输出答案]
    F --> G[完成并统计]

    style A fill:#e3f2fd
    style C fill:#fff3e0
    style E fill:#f3e5f5
    style G fill:#4caf50
            `} />
          </div>
        </section>

        {/* 性能监控 */}
        <section id="metrics" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">性能监控</h2>

          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">实时监控流式性能指标</h3>
            <div className="prose max-w-none text-gray-700 mb-4">
              <p>
                通过监听流式响应的关键时间点，计算详细的性能指标。
              </p>
            </div>
            <CodeBlockWithCopy
              language="java"
              code={streamingMetricsExample}
            />
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">关键性能指标</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">首字延迟 (TTFT)</h4>
                <p className="text-sm text-blue-800">
                  Time To First Token：从发送请求到接收第一个 token 的时间。影响用户感知的响应速度。
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">生成速度</h4>
                <p className="text-sm text-green-800">
                  Tokens/Second：每秒生成的 token 数量。衡量 LLM 的输出吞吐量。
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">Token 间延迟</h4>
                <p className="text-sm text-purple-800">
                  Inter-Token Latency：相邻两个 token 之间的平均时间间隔。
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2">总时长</h4>
                <p className="text-sm text-orange-800">
                  Total Duration：从请求开始到完整响应接收的总时间。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 最佳实践 */}
        <section id="best-practices" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">最佳实践</h2>

          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">1. 错误处理</h3>
              <CodeBlockWithCopy
                language="java"
                code={`@Override
public void onError(Throwable error) {
    // 记录详细错误日志
    logger.error("Stream error: type={}, message={}",
        error.getClass().getSimpleName(),
        error.getMessage()
    );

    // 根据错误类型处理
    if (error instanceof TimeoutException) {
        // 超时：提示用户重试
        notifyUser("请求超时，请重试");
    } else if (error instanceof RateLimitException) {
        // 限流：延迟后重试
        scheduleRetry();
    } else {
        // 其他错误：显示友好提示
        notifyUser("服务暂时不可用");
    }

    // 清理资源
    cleanup();
}`}
              />
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">2. WebSocket 集成</h3>
              <CodeBlockWithCopy
                language="java"
                code={`@Controller
public class ChatStreamController {

    @Autowired
    private ChatLanguageModel model;

    @MessageMapping("/chat/stream")
    public void streamChat(
        String message,
        SimpMessageHeaderAccessor headerAccessor
    ) {
        String sessionId = headerAccessor.getSessionId();

        model.generate(message, new StreamingChatModelListener() {
            @Override
            public void onPartial(String token) {
                // 实时推送到前端
                messagingTemplate.convertAndSendToUser(
                    sessionId,
                    "/queue/chat",
                    new ChatMessage(token, "partial")
                );
            }

            @Override
            public void onComplete(Response<AiMessage> response) {
                messagingTemplate.convertAndSendToUser(
                    sessionId,
                    "/queue/chat",
                    new ChatMessage("", "complete")
                );
            }

            @Override
            public void onError(Throwable error) {
                messagingTemplate.convertAndSendToUser(
                    sessionId,
                    "/queue/chat",
                    new ChatMessage(error.getMessage(), "error")
                );
            }
        });
    }
}`}
              />
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">3. 资源管理</h3>
              <CodeBlockWithCopy
                language="java"
                code={`public class ResourceManager {

    private final Set<StreamingChatModelListener> activeStreams =
        ConcurrentHashMap.newKeySet();

    public void registerStream(StreamingChatModelListener listener) {
        activeStreams.add(listener);
    }

    public void unregisterStream(StreamingChatModelListener listener) {
        activeStreams.remove(listener);
    }

    @PreDestroy
    public void cleanup() {
        // 应用关闭时清理所有活跃流
        activeStreams.forEach(listener -> {
            try {
                listener.onError(new RuntimeException("Server shutdown"));
            } catch (Exception e) {
                logger.warn("Error during cleanup", e);
            }
        });
        activeStreams.clear();
    }
}`}
              />
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">4. 性能优化建议</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">批处理</h4>
                  <p className="text-sm text-blue-800">
                    使用 buffer() 批量处理 token，减少前端更新频率
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">连接池</h4>
                  <p className="text-sm text-green-800">
                    复用 HTTP 连接，避免每次请求建立新连接
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">超时设置</h4>
                  <p className="text-sm text-purple-800">
                    合理设置连接和读取超时，避免长时间阻塞
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">监控指标</h4>
                  <p className="text-sm text-orange-800">
                    使用 Prometheus/Grafana 监控流式性能指标
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <h4 className="font-semibold text-red-900 mb-2">常见陷阱</h4>
              <ul className="list-disc pl-5 text-red-800 space-y-1">
                <li><strong>阻塞 onPartial：</strong>避免在 onPartial 中执行耗时操作</li>
                <li><strong>内存泄漏：</strong>确保长时间运行的流被正确清理</li>
                <li><strong>线程安全：</strong>多线程访问共享状态时注意同步</li>
                <li><strong>异常吞没：</strong>onError 中必须处理异常，不能静默失败</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 总结 */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">总结</h2>
            <div className="space-y-3">
              <p>
                Token Stream 是 LangChain4j 提供的强大流式输出机制，通过 <code className="bg-white/20 px-2 py-1 rounded">StreamingChatModelListener</code> 接口实现实时 token 处理。
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>核心方法：<strong>onPartial</strong>（接收 token）、<strong>onComplete</strong>（完成）、<strong>onError</strong>（错误）</li>
                <li>可集成响应式框架（Reactor）实现更灵活的流式处理</li>
                <li>支持实时验证、多 Agent 并发、RAG 增强等高级场景</li>
                <li>通过监控 TTFT、生成速度等指标优化用户体验</li>
                <li>注意错误处理、资源管理和性能优化</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default TokenStreamPage;
