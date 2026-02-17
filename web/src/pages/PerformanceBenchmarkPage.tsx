import Layout from '../components/layout/Layout';
import { CodeBlockWithCopy, MermaidChart } from '../components/ui';

const benchmarkFrameworkExample = `
package com.example.benchmark;

import org.openjdk.jmh.annotations.*;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.model.output.Response;
import java.util.concurrent.TimeUnit;

/**
 * JMH 性能基准测试框架示例
 * 使用 JMH（Java Microbenchmark Harness）进行专业性能测试
 */
@BenchmarkMode(Mode.AverageTime)
@OutputTimeUnit(TimeUnit.MILLISECONDS)
@State(Scope.Benchmark)
@Warmup(iterations = 3, time = 1, timeUnit = TimeUnit.SECONDS)
@Measurement(iterations = 5, time = 2, timeUnit = TimeUnit.SECONDS)
@Fork(1)
public class ChatModelBenchmark {

    private ChatLanguageModel gpt4Model;
    private ChatLanguageModel gpt35Model;

    @Setup
    public void setup() {
        gpt4Model = OpenAiChatModel.builder()
                .apiKey(System.getenv("OPENAI_API_KEY"))
                .modelName("gpt-4")
                .temperature(0.7)
                .build();

        gpt35Model = OpenAiChatModel.builder()
                .apiKey(System.getenv("OPENAI_API_KEY"))
                .modelName("gpt-3.5-turbo")
                .temperature(0.7)
                .build();
    }

    @Benchmark
    public Response<AiMessage> benchmarkGPT4_Simple() {
        return gpt4Model.generate("Hello, how are you?");
    }

    @Benchmark
    public Response<AiMessage> benchmarkGPT35_Simple() {
        return gpt35Model.generate("Hello, how are you?");
    }

    @Benchmark
    public Response<AiMessage> benchmarkGPT4_Complex() {
        String complexPrompt = """
            请详细解释以下概念：
            1. 微服务架构
            2. 容器化技术
            3. 服务网格

            每个概念用100字左右说明。
            """;
        return gpt4Model.generate(complexPrompt);
    }

    @Benchmark
    public Response<AiMessage> benchmarkGPT35_Complex() {
        String complexPrompt = """
            请详细解释以下概念：
            1. 微服务架构
            2. 容器化技术
            3. 服务网格

            每个概念用100字左右说明。
            """;
        return gpt35Model.generate(complexPrompt);
    }
}

/*
运行方式：
mvn clean install
java -jar target/benchmarks.jar

结果示例：
Benchmark                              Mode  Cnt    Score    Error  Units
ChatModelBenchmark.benchmarkGPT4_Simple  avgt    5  1234.567 ± 45.678  ms/op
ChatModelBenchmark.benchmarkGPT35_Simple avgt    5   567.890 ± 23.456  ms/op
*/
`.trim();

const embeddingBenchmarkExample = `
package com.example.benchmark.embedding;

import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.openai.OpenAiEmbeddingModel;
import dev.langchain4j.data.embedding.Embedding;
import org.openjdk.jmh.annotations.*;
import java.util.concurrent.TimeUnit;
import java.util.List;

/**
 * Embedding 模型性能基准测试
 */
@BenchmarkMode(Mode.AverageTime)
@OutputTimeUnit(TimeUnit.MILLISECONDS)
@State(Scope.Benchmark)
public class EmbeddingBenchmark {

    private EmbeddingModel textEmbedding3Small;
    private EmbeddingModel textEmbedding3Large;
    private EmbeddingModel ada002;

    private String shortText = "这是一段简短的文本。";
    private String longText = """
        这是一段较长的文本，包含更多的信息和细节。
        在实际应用中，文档的长度可能会有很大的差异。
        Embedding 模型需要能够高效地处理不同长度的文本。
        重复内容用于增加文本长度：测试、测试、测试。
        """;

    @Setup
    public void setup() {
        textEmbedding3Small = OpenAiEmbeddingModel.builder()
                .apiKey(System.getenv("OPENAI_API_KEY"))
                .modelName("text-embedding-3-small")
                .build();

        textEmbedding3Large = OpenAiEmbeddingModel.builder()
                .apiKey(System.getenv("OPENAI_API_KEY"))
                .modelName("text-embedding-3-large")
                .build();

        ada002 = OpenAiEmbeddingModel.builder()
                .apiKey(System.getenv("OPENAI_API_KEY"))
                .modelName("text-embedding-ada-002")
                .build();
    }

    @Benchmark
    public Embedding benchmarkText3Small_Short() {
        return textEmbedding3Small.embed(shortText).content();
    }

    @Benchmark
    public Embedding benchmarkText3Small_Long() {
        return textEmbedding3Small.embed(longText).content();
    }

    @Benchmark
    public Embedding benchmarkText3Large_Short() {
        return textEmbedding3Large.embed(shortText).content();
    }

    @Benchmark
    public Embedding benchmarkAda002_Short() {
        return ada002.embed(shortText).content();
    }

    // 批量 Embedding 性能测试
    @Benchmark
    public List<Embedding> benchmarkBatchEmbedding() {
        List<String> texts = List.of(
            "文本1", "文本2", "文本3", "文本4", "文本5"
        );
        return textEmbedding3Small.embedAll(texts).content();
    }
}
`.trim();

const vectorStoreBenchmarkExample = `
package com.example.benchmark.vectorstore;

import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.pgvector.PgVectorEmbeddingStore;
import dev.langchain4j.store.embedding.redis.RedisEmbeddingStore;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.data.embedding.Embedding;
import org.openjdk.jmh.annotations.*;
import java.util.List;
import java.util.ArrayList;

/**
 * 向量数据库性能基准测试
 */
@BenchmarkMode(Mode.AverageTime)
@OutputTimeUnit(TimeUnit.MILLISECONDS)
@State(Scope.Thread)
public class VectorStoreBenchmark {

    private EmbeddingStore<TextSegment> pgVectorStore;
    private EmbeddingStore<TextSegment> redisStore;

    private List<Embedding> embeddings;
    private List<TextSegment> segments;

    @Setup(Level.Trial)
    public void setup() {
        // 初始化向量存储
        pgVectorStore = PgVectorEmbeddingStore.builder()
                .host("localhost")
                .port(5432)
                .database("langchain4j")
                .user("postgres")
                .password("password")
                .table("benchmarks")
                .dimension(1536)
                .build();

        redisStore = RedisEmbeddingStore.builder()
                .host("localhost")
                .port(6379)
                .build();

        // 准备测试数据
        embeddings = new ArrayList<>();
        segments = new ArrayList<>();

        for (int i = 0; i < 1000; i++) {
            Embedding embedding = createRandomEmbedding(1536);
            TextSegment segment = TextSegment.from("测试文本 " + i);

            embeddings.add(embedding);
            segments.add(segment);

            // 添加到存储
            pgVectorStore.add(embedding, segment);
            redisStore.add(embedding, segment);
        }
    }

    @Benchmark
    public void benchmarkPgVector_Insert() {
        Embedding embedding = createRandomEmbedding(1536);
        TextSegment segment = TextSegment.from("新文档");
        pgVectorStore.add(embedding, segment);
    }

    @Benchmark
    public void benchmarkRedis_Insert() {
        Embedding embedding = createRandomEmbedding(1536);
        TextSegment segment = TextSegment.from("新文档");
        redisStore.add(embedding, segment);
    }

    @Benchmark
    public List<EmbeddingMatch<TextSegment>> benchmarkPgVector_Search() {
        Embedding query = embeddings.get(0);
        return pgVectorStore.findRelevant(query, 10);
    }

    @Benchmark
    public List<EmbeddingMatch<TextSegment>> benchmarkRedis_Search() {
        Embedding query = embeddings.get(0);
        return redisStore.findRelevant(query, 10);
    }

    @Benchmark
    public void benchmarkPgVector_Delete() {
        // 删除测试
        String id = "test-id";
        pgVectorStore.delete(id);
    }

    @TearDown(Level.Trial)
    public void cleanup() {
        // 清理测试数据
        // pgVectorStore.removeAll();
        // redisStore.removeAll();
    }

    private Embedding createRandomEmbedding(int dimension) {
        float[] vector = new float[dimension];
        for (int i = 0; i < dimension; i++) {
            vector[i] = (float) Math.random();
        }
        return Embedding.from(vector);
    }
}
`.trim();

const costAnalysisExample = `
package com.example.benchmark.cost;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.output.Response;
import dev.langchain4j.data.message.AiMessage;

/**
 * 成本分析工具
 * 跟踪和估算 LLM API 调用成本
 */
public class CostAnalyzer {

    // OpenAI 定价（2024年价格，单位：美元/1K tokens）
    private static final double GPT4_INPUT_PRICE = 0.03;
    private static final double GPT4_OUTPUT_PRICE = 0.06;
    private static final double GPT35_INPUT_PRICE = 0.0005;
    private static final double GPT35_OUTPUT_PRICE = 0.0015;

    public static class CostReport {
        private final String modelName;
        private final int inputTokens;
        private final int outputTokens;
        private final double inputCost;
        private final double outputCost;
        private final double totalCost;

        public CostReport(String modelName, int inputTokens, int outputTokens,
                         double inputPrice, double outputPrice) {
            this.modelName = modelName;
            this.inputTokens = inputTokens;
            this.outputTokens = outputTokens;
            this.inputCost = (inputTokens / 1000.0) * inputPrice;
            this.outputCost = (outputTokens / 1000.0) * outputPrice;
            this.totalCost = inputCost + outputCost;
        }

        @Override
        public String toString() {
            return String.format("""
                Model: %s
                Input Tokens: %d (Cost: $%.4f)
                Output Tokens: %d (Cost: $%.4f)
                Total Cost: $%.4f
                """, modelName, inputTokens, inputCost,
                     outputTokens, outputCost, totalCost);
        }
    }

    public static CostReport analyzeCost(Response<AiMessage> response, String modelName) {
        return response.tokenUsage()
                .map(usage -> {
                    double inputPrice, outputPrice;

                    switch (modelName.toLowerCase()) {
                        case "gpt-4":
                            inputPrice = GPT4_INPUT_PRICE;
                            outputPrice = GPT4_OUTPUT_PRICE;
                            break;
                        case "gpt-3.5-turbo":
                            inputPrice = GPT35_INPUT_PRICE;
                            outputPrice = GPT35_OUTPUT_PRICE;
                            break;
                        default:
                            inputPrice = GPT35_INPUT_PRICE;
                            outputPrice = GPT35_OUTPUT_PRICE;
                    }

                    return new CostReport(
                        modelName,
                        usage.inputTokenCount(),
                        usage.outputTokenCount(),
                        inputPrice,
                        outputPrice
                    );
                })
                .orElse(new CostReport(modelName, 0, 0, 0, 0));
    }

    // 使用示例
    public static void main(String[] args) {
        ChatLanguageModel model = OpenAiChatModel.builder()
                .apiKey(System.getenv("OPENAI_API_KEY"))
                .modelName("gpt-4")
                .build();

        // 执行查询
        Response<AiMessage> response = model.generate(
            "请用100字介绍量子计算的基本原理"
        );

        // 分析成本
        CostReport report = analyzeCost(response, "gpt-4");
        System.out.println(report);

        // 批量测试成本估算
        System.out.println("\\n=== 批量测试成本估算 ===");
        estimateBatchCost(100, "gpt-4");
        estimateBatchCost(1000, "gpt-4");
        estimateBatchCost(10000, "gpt-4");
    }

    public static void estimateBatchCost(int requestCount, String modelName) {
        // 假设平均每次请求
        int avgInputTokens = 500;
        int avgOutputTokens = 1000;

        double inputPrice = modelName.equals("gpt-4") ?
            GPT4_INPUT_PRICE : GPT35_INPUT_PRICE;
        double outputPrice = modelName.equals("gpt-4") ?
            GPT4_OUTPUT_PRICE : GPT35_OUTPUT_PRICE;

        double singleCost = ((avgInputTokens / 1000.0) * inputPrice +
                            (avgOutputTokens / 1000.0) * outputPrice);

        double totalCost = singleCost * requestCount;

        System.out.printf("%d 次请求 (%s): $%.2f%n",
            requestCount, modelName, totalCost);
    }
}
`.trim();

const latencyBenchmarkExample = `
package com.example.benchmark.latency;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import org.openjdk.jmh.annotations.*;
import java.util.concurrent.TimeUnit;

/**
 * 延迟基准测试
 * 测量首字延迟(TTFT)和总延迟
 */
@BenchmarkMode(Mode.AverageTime)
@OutputTimeUnit(TimeUnit.MILLISECONDS)
@State(Scope.Benchmark)
public class LatencyBenchmark {

    private ChatLanguageModel model;
    private String testPrompt;

    @Setup
    public void setup() {
        model = OpenAiChatModel.builder()
                .apiKey(System.getenv("OPENAI_API_KEY"))
                .modelName("gpt-4")
                .timeout(Duration.ofSeconds(30))
                .build();

        testPrompt = "请解释什么是微服务架构？";
    }

    @Benchmark
    public String benchmarkTotalLatency() {
        long startTime = System.nanoTime();
        String response = model.generate(testPrompt);
        long endTime = System.nanoTime();

        long latencyMs = (endTime - startTime) / 1_000_000;
        return String.format("Total: %d ms", latencyMs);
    }

    // 流式响应的延迟测试
    @Benchmark
    public void benchmarkStreamingLatency() {
        LatencyTracker tracker = new LatencyTracker();

        model.generate(testPrompt, new StreamingChatModelListener() {
            private long firstTokenTime;

            @Override
            public void onPartial(String token) {
                if (firstTokenTime == 0) {
                    firstTokenTime = System.nanoTime() - tracker.startTime;
                    tracker.ttft = firstTokenTime;
                }
            }

            @Override
            public void onComplete(Response<AiMessage> response) {
                tracker.totalTime = System.nanoTime() - tracker.startTime;
            }

            @Override
            public void onError(Throwable error) {
                tracker.error = error;
            }
        });

        tracker.printReport();
    }

    static class LatencyTracker {
        long startTime;
        long ttft;  // Time To First Token
        long totalTime;
        Throwable error;

        public LatencyTracker() {
            this.startTime = System.nanoTime();
        }

        public void printReport() {
            if (error != null) {
                System.err.println("Error: " + error.getMessage());
                return;
            }

            System.out.printf("TTFT: %.2f ms%n", ttft / 1_000_000.0);
            System.out.printf("Total: %.2f ms%n", totalTime / 1_000_000.0);
            System.out.printf("Generation: %.2f ms%n",
                (totalTime - ttft) / 1_000_000.0);
        }
    }
}
`.trim();

const throughputBenchmarkExample = `
package com.example.benchmark.throughput;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicLong;

/**
 * 吞吐量基准测试
 * 测试系统并发处理能力
 */
public class ThroughputBenchmark {

    private static final int THREAD_COUNT = 10;
    private static final int REQUESTS_PER_THREAD = 100;

    public static void main(String[] args) throws InterruptedException {
        ChatLanguageModel model = OpenAiChatModel.builder()
                .apiKey(System.getenv("OPENAI_API_KEY"))
                .modelName("gpt-3.5-turbo")
                .build();

        System.out.println("=== 吞吐量测试 ===");
        System.out.println("线程数: " + THREAD_COUNT);
        System.out.println("每线程请求数: " + REQUESTS_PER_THREAD);
        System.out.println("总请求数: " + (THREAD_COUNT * REQUESTS_PER_THREAD));

        ExecutorService executor = Executors.newFixedThreadPool(THREAD_COUNT);
        CountDownLatch latch = new CountDownLatch(THREAD_COUNT);

        AtomicLong totalRequests = new AtomicLong(0);
        AtomicLong successCount = new AtomicLong(0);
        AtomicLong errorCount = new AtomicLong(0);

        long startTime = System.currentTimeMillis();

        for (int i = 0; i < THREAD_COUNT; i++) {
            executor.submit(() -> {
                try {
                    for (int j = 0; j < REQUESTS_PER_THREAD; j++) {
                        totalRequests.incrementAndGet();

                        try {
                            model.generate("Hello");
                            successCount.incrementAndGet();
                        } catch (Exception e) {
                            errorCount.incrementAndGet();
                        }
                    }
                } finally {
                    latch.countDown();
                }
            });
        }

        latch.await();
        long endTime = System.currentTimeMillis();

        executor.shutdown();

        // 输出结果
        long duration = endTime - startTime;
        double durationSeconds = duration / 1000.0;

        System.out.printf("\\n=== 测试结果 ===%n");
        System.out.printf("总耗时: %.2f 秒%n", durationSeconds);
        System.out.printf("总请求数: %d%n", totalRequests.get());
        System.out.printf("成功: %d%n", successCount.get());
        System.out.printf("失败: %d%n", errorCount.get());
        System.out.printf("成功率: %.2f%%%n",
            (successCount.get() * 100.0 / totalRequests.get()));
        System.out.printf("吞吐量: %.2f 请求/秒%n",
            totalRequests.get() / durationSeconds);
        System.out.printf("平均延迟: %.2f ms%n",
            (duration * 1.0 / totalRequests.get()));
    }
}
`.trim();

const PerformanceBenchmarkPage = () => {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">性能基准测试</h1>
          <p className="text-xl text-gray-600">
            全面的性能测试指南：从框架搭建到结果分析
          </p>
        </div>

        {/* 导航 */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
          <nav className="space-y-1">
            <a href="#overview" className="block text-blue-700 hover:text-blue-900">概述</a>
            <a href="#benchmark-framework" className="block text-blue-700 hover:text-blue-900">JMH 基准测试框架</a>
            <a href="#embedding-benchmark" className="block text-blue-700 hover:text-blue-900">Embedding 性能测试</a>
            <a href="#vectorstore-benchmark" className="block text-blue-700 hover:text-blue-900">向量数据库测试</a>
            <a href="#cost-analysis" className="block text-blue-700 hover:text-blue-900">成本分析</a>
            <a href="#latency-benchmark" className="block text-blue-700 hover:text-blue-900">延迟测试</a>
            <a href="#throughput-benchmark" className="block text-blue-700 hover:text-blue-900">吞吐量测试</a>
            <a href="#best-practices" className="block text-blue-700 hover:text-blue-900">最佳实践</a>
          </nav>
        </div>

        {/* 概述 */}
        <section id="overview" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">性能基准测试概述</h2>

          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">为什么需要性能测试？</h3>
            <div className="prose max-w-none text-gray-700 space-y-4">
              <p>
                在将 LangChain4j 应用部署到生产环境前，进行全面的性能基准测试至关重要。
              </p>

              <h4 className="font-semibold text-gray-900 mt-6 mb-3">测试目标</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>选择最优模型：</strong>对比不同 LLM 的性能和成本</li>
                <li><strong>容量规划：</strong>确定服务器配置和并发能力</li>
                <li><strong>成本控制：</strong>估算实际使用的 Token 成本</li>
                <li><strong>性能瓶颈：</strong>发现系统中的性能瓶颈</li>
                <li><strong>优化验证：</strong>验证优化措施的效果</li>
              </ul>

              <h4 className="font-semibold text-gray-900 mt-6 mb-3">关键指标</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>延迟（Latency）：</strong>请求响应时间，包括 TTFT 和总延迟</li>
                <li><strong>吞吐量（Throughput）：</strong>单位时间处理的请求数</li>
                <li><strong>成本（Cost）：</strong>每 1000 tokens 的费用</li>
                <li><strong>并发能力（Concurrency）：</strong>同时处理请求的数量</li>
                <li><strong>资源消耗（Resource Usage）：</strong>CPU、内存、网络使用</li>
              </ul>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">性能测试流程</h3>
            <MermaidChart chart={`
graph LR
    A[定义测试目标] --> B[设计测试用例]
    B --> C[搭建测试环境]
    C --> D[执行基准测试]
    D --> E[收集性能数据]
    E --> F[分析结果]
    F --> G[优化改进]
    G --> D

    style A fill:#e3f2fd
    style G fill:#fff3e0
            `} />
          </div>
        </section>

        {/* JMH 框架 */}
        <section id="benchmark-framework" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">JMH 基准测试框架</h2>

          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">使用 JMH 进行专业性能测试</h3>
            <div className="prose max-w-none text-gray-700 mb-4">
              <p>
                JMH（Java Microbenchmark Harness）是 OpenJDK 提供的 Java 微基准测试工具，
                可以避免 JVM 优化对测试结果的干扰。
              </p>
            </div>
            <CodeBlockWithCopy
              language="java"
              code={benchmarkFrameworkExample}
            />
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4">
            <h4 className="font-semibold text-green-900 mb-2">JMH 关键注解说明</h4>
            <ul className="list-disc pl-5 text-green-800 space-y-1">
              <li><strong>@BenchmarkMode：</strong>指定测试模式（平均时间、吞吐量等）</li>
              <li><strong>@Warmup：</strong>预热迭代，让 JIT 编译器优化代码</li>
              <li><strong>@Measurement：</strong>实际测量迭代</li>
              <li><strong>@Fork：</strong>多次独立运行，减少误差</li>
              <li><strong>@State：</strong>管理测试对象的生命周期</li>
            </ul>
          </div>
        </section>

        {/* Embedding 测试 */}
        <section id="embedding-benchmark" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Embedding 模型性能测试</h2>

          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">对比不同 Embedding 模型</h3>
            <CodeBlockWithCopy
              language="java"
              code={embeddingBenchmarkExample}
            />
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">性能对比参考</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">模型</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">维度</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">延迟</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">价格</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">适用场景</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">text-embedding-3-small</td>
                    <td className="px-6 py-4 text-sm text-gray-500">1536</td>
                    <td className="px-6 py-4 text-sm text-gray-500">~50ms</td>
                    <td className="px-6 py-4 text-sm text-gray-500">$0.02/1M tokens</td>
                    <td className="px-6 py-4 text-sm text-gray-500">通用场景，性价比高</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">text-embedding-3-large</td>
                    <td className="px-6 py-4 text-sm text-gray-500">3072</td>
                    <td className="px-6 py-4 text-sm text-gray-500">~100ms</td>
                    <td className="px-6 py-4 text-sm text-gray-500">$0.13/1M tokens</td>
                    <td className="px-6 py-4 text-sm text-gray-500">高精度需求</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">text-embedding-ada-002</td>
                    <td className="px-6 py-4 text-sm text-gray-500">1536</td>
                    <td className="px-6 py-4 text-sm text-gray-500">~60ms</td>
                    <td className="px-6 py-4 text-sm text-gray-500">$0.10/1M tokens</td>
                    <td className="px-6 py-4 text-sm text-gray-500">旧版本，不推荐</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 向量数据库测试 */}
        <section id="vectorstore-benchmark" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">向量数据库性能测试</h2>

          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">对比不同向量存储</h3>
            <CodeBlockWithCopy
              language="java"
              code={vectorStoreBenchmarkExample}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">PgVector</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✅ 事务支持</li>
                <li>✅ ACID 保证</li>
                <li>✅ 易于集成</li>
                <li>⚠️ 性能中等</li>
                <li>⚠️ 需要维护 PostgreSQL</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Redis</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>✅ 高性能</li>
                <li>✅ 低延迟</li>
                <li>✅ 易于扩展</li>
                <li>⚠️ 内存成本高</li>
                <li>⚠️ 持久化需配置</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 成本分析 */}
        <section id="cost-analysis" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">成本分析</h2>

          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">LLM API 成本跟踪</h3>
            <CodeBlockWithCopy
              language="java"
              code={costAnalysisExample}
            />
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">成本优化建议</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">模型选择</h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• 简单任务用 GPT-3.5</li>
                  <li>• 复杂任务用 GPT-4</li>
                  <li>• 批量操作考虑折扣</li>
                </ul>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2">Token 优化</h4>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• 精简 Prompt</li>
                  <li>• 使用缓存</li>
                  <li>• 限制输出长度</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 延迟测试 */}
        <section id="latency-benchmark" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">延迟测试</h2>

          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">TTFT 和总延迟测量</h3>
            <div className="prose max-w-none text-gray-700 mb-4">
              <p>
                <strong>TTFT（Time To First Token）</strong> 是衡量用户体验的关键指标，
                表示从发送请求到收到第一个 token 的时间。
              </p>
            </div>
            <CodeBlockWithCopy
              language="java"
              code={latencyBenchmarkExample}
            />
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <h4 className="font-semibold text-blue-900 mb-2">延迟优化技巧</h4>
            <ul className="list-disc pl-5 text-blue-800 space-y-1">
              <li>使用更快的模型（GPT-3.5 vs GPT-4）</li>
              <li>精简 Prompt 长度</li>
              <li>启用流式输出</li>
              <li>选择地理位置近的 API 端点</li>
              <li>使用连接池复用连接</li>
            </ul>
          </div>
        </section>

        {/* 吞吐量测试 */}
        <section id="throughput-benchmark" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">吞吐量测试</h2>

          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">并发处理能力测试</h3>
            <CodeBlockWithCopy
              language="java"
              code={throughputBenchmarkExample}
            />
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">性能参考值</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">配置</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">吞吐量</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">P95 延迟</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">单线程 GPT-3.5</td>
                    <td className="px-6 py-4 text-sm text-gray-500">~0.5 req/s</td>
                    <td className="px-6 py-4 text-sm text-gray-500">~2000ms</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">10 线程 GPT-3.5</td>
                    <td className="px-6 py-4 text-sm text-gray-500">~3-5 req/s</td>
                    <td className="px-6 py-4 text-sm text-gray-500">~2500ms</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">单线程 GPT-4</td>
                    <td className="px-6 py-4 text-sm text-gray-500">~0.2 req/s</td>
                    <td className="px-6 py-4 text-sm text-gray-500">~5000ms</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 最佳实践 */}
        <section id="best-practices" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">性能测试最佳实践</h2>

          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">1. 测试环境准备</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li><strong>独立环境：</strong>使用与生产环境相似的配置</li>
                <li><strong>网络隔离：</strong>避免其他流量干扰</li>
                <li><strong>多次运行：</strong>至少运行 3 次取平均值</li>
                <li><strong>充分预热：</strong>让 JVM 达到稳定状态</li>
              </ul>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">2. 测试数据准备</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li><strong>真实数据：</strong>使用生产环境的真实数据样本</li>
                <li><strong>多样性：</strong>覆盖不同长度和复杂度的请求</li>
                <li><strong>数据量：</strong>足够大以确保统计显著性</li>
                <li><strong>可复现：</strong>使用固定种子保证可重复</li>
              </ul>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">3. 结果分析</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li><strong>关注 P95/P99：</strong>不只是平均值，关注长尾延迟</li>
                <li><strong>对比基准：</strong>建立性能基线，对比优化效果</li>
                <li><strong>识别瓶颈：</strong>使用 Profiler 找到热点代码</li>
                <li><strong>持续监控：</strong>生产环境持续监控性能指标</li>
              </ul>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">4. 常见误区</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-900 mb-2">❌ 不要这样做</h4>
                  <ul className="text-sm text-red-800 space-y-1">
                    <li>• 在开发环境测试</li>
                    <li>• 只测试一次</li>
                    <li>• 忽略 JVM 预热</li>
                    <li>• 过早优化</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">✅ 应该这样做</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• 使用 JMH 等专业工具</li>
                    <li>• 多次运行取平均</li>
                    <li>• 充分预热后测量</li>
                    <li>• 基于数据优化</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 总结 */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">总结</h2>
            <div className="space-y-3">
              <p>
                性能基准测试是确保 LangChain4j 应用在生产环境中<strong>稳定、高效、经济</strong>运行的关键。
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>测试框架：</strong>使用 JMH 进行专业的微基准测试</li>
                <li><strong>全面覆盖：</strong>测试模型、向量存储、延迟、吞吐量、成本</li>
                <li><strong>持续优化：</strong>建立性能基线，持续监控和改进</li>
                <li><strong>成本控制：</strong>跟踪 Token 使用，优化模型选择</li>
                <li><strong>生产就绪：</strong>充分测试后再部署到生产环境</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default PerformanceBenchmarkPage;
