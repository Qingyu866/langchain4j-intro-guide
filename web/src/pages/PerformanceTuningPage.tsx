import Layout from '../components/layout/Layout';
import { Tag, SectionHeader, CodeBlock, TipBox } from '../components/ui';

const httpClientPoolConfigCode = `package com.example.performance.config;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import okhttp3.ConnectionPool;
import okhttp3.OkHttpClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
public class HttpClientPoolConfig {

    @Value("\${openai.api.timeout.connect:10}")
    private int connectTimeoutSeconds;

    @Value("\${openai.api.timeout.read:60}")
    private int readTimeoutSeconds;

    @Value("\${openai.api.pool.max-idle:5}")
    private int maxIdleConnections;

    @Value("\${openai.api.pool.keep-alive:300}")
    private long keepAliveDurationSeconds;

    @Bean
    public OkHttpClient okHttpClient() {
        return new OkHttpClient.Builder()
            .connectionPool(new ConnectionPool(
                maxIdleConnections,
                keepAliveDurationSeconds,
                TimeUnit.SECONDS
            ))
            .connectTimeout(connectTimeoutSeconds, TimeUnit.SECONDS)
            .readTimeout(readTimeoutSeconds, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .retryOnConnectionFailure(true)
            .followRedirects(true)
            .followSslRedirects(true)
            .addInterceptor(new PerformanceMonitoringInterceptor())
            .addInterceptor(new RetryInterceptor(3, 1000, 2.0))
            .build();
    }

    @Bean
    public ChatLanguageModel chatLanguageModel(OkHttpClient httpClient) {
        return OpenAiChatModel.builder()
            .apiKey(System.getenv("OPENAI_API_KEY"))
            .modelName("gpt-4")
            .temperature(0.7)
            .maxTokens(1000)
            .timeout(Duration.ofSeconds(readTimeoutSeconds))
            .client(httpClient)
            .build();
    }
}`;

const multiLevelCacheServiceCode = `package com.example.performance.cache;

import com.github.benmanes.caffeine.Cache;
import com.github.benmanes.caffeine.Caffeine;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class MultiLevelCacheService {

    private final RedisTemplate<String, Object> redisTemplate;
    
    private final Cache<String, String> l1Cache = Caffeine.newBuilder()
        .maximumSize(1000)
        .expireAfterWrite(5, TimeUnit.MINUTES)
        .build();

    public Optional<String> get(String key) {
        String value = l1Cache.getIfPresent(key);
        if (value != null) {
            log.debug("L1命中: key");
            return Optional.of(value);
        }

        value = (String) redisTemplate.opsForValue().get(key);
        if (value != null) {
            log.debug("L2命中: key，回填L1");
            l1Cache.put(key, value);
            return Optional.of(value);
        }

        log.debug("L3未命中: key");
        return Optional.empty();
    }

    public void put(String key, String value, long ttlSeconds) {
        l1Cache.put(key, value);
        redisTemplate.opsForValue().set(
            key, 
            value, 
            Duration.ofSeconds(ttlSeconds)
        );
        log.debug("写入缓存: key, TTL={}s", ttlSeconds);
    }

    public void evict(String key) {
        l1Cache.invalidate(key);
        redisTemplate.delete(key);
        log.debug("删除缓存: key");
    }
}`;

const batchEmbeddingOptimizationCode = `package com.example.performance.batch;

import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingStore;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class BatchEmbeddingOptimization {

    private final EmbeddingModel embeddingModel;
    private final EmbeddingStore<TextSegment> embeddingStore;

    private static final int BATCH_SIZE = 100;
    private static final int PARALLEL_THREADS = 4;
    private final ExecutorService executor = Executors.newFixedThreadPool(PARALLEL_THREADS);

    public void batchEmbedAndStore(List<TextSegment> segments) {
        long startTime = System.currentTimeMillis();
        int totalSegments = segments.size();
        log.info("开始批量处理Embedding: 总数={}", totalSegments);

        List<List<TextSegment>> batches = partition(segments, BATCH_SIZE);

        List<CompletableFuture<Void>> futures = batches.stream()
            .map(batch -> CompletableFuture.runAsync(() -> {
                int attempt = 0;
                while (attempt < 3) {
                    try {
                        processBatch(batch);
                        break;
                    } catch (Exception e) {
                        attempt++;
                        if (attempt >= 3) {
                            log.error("批次处理失败: size={}", batch.size(), e);
                            throw new RuntimeException("批次处理失败", e);
                        }
                        try {
                            Thread.sleep(1000);
                        } catch (InterruptedException ie) {
                            Thread.currentThread().interrupt();
                        }
                    }
                }
            }, executor))
            .collect(Collectors.toList());

        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

        long duration = System.currentTimeMillis() - startTime;
        log.info("批量处理完成: 总数={}, 耗时={}ms, 平均={}ms/条",
            totalSegments, duration, duration / totalSegments);
    }

    private void processBatch(List<TextSegment> batch) {
        log.debug("处理批次: size={}", batch.size());
        var embeddings = embeddingModel.embedAll(batch).content();
        for (int i = 0; i < batch.size(); i++) {
            TextSegment segment = batch.get(i);
            var embedding = embeddings.get(i);
            embeddingStore.add(idFor(segment), embedding, segment);
        }
        log.debug("批次处理完成: size={}", batch.size());
    }

    private <T> List<List<T>> partition(List<T> list, int batchSize) {
        List<List<T>> result = new ArrayList<>();
        for (int i = 0; i < list.size(); i += batchSize) {
            int end = Math.min(i + batchSize, list.size());
            result.add(new ArrayList<>(list.subList(i, end)));
        }
        return result;
    }

    private String idFor(TextSegment segment) {
        return segment.text().hashCode() + "";
    }

    @PreDestroy
    public void shutdown() {
        executor.shutdown();
    }
}`;

const tokenOptimizerCode = `package com.example.performance.token;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class TokenOptimizer {

    public int estimateTokens(String text) {
        if (text == null || text.isEmpty()) {
            return 0;
        }
        int charCount = text.length();
        return (int) Math.ceil(charCount / 4.0);
    }

    public String optimizeSystemPrompt(String originalSystemPrompt) {
        String optimized = originalSystemPrompt.replaceAll("\\\\s+", " ").trim();
        optimized = optimized
            .replace("You are", "你是")
            .replace("Please", "请")
            .replace("ensure that", "确保")
            .replace("make sure to", "务必");

        List<String> sentences = new ArrayList<>();
        String[] split = optimized.split("[.!?。！？]");
        for (String sentence : split) {
            String trimmed = sentence.trim();
            if (!trimmed.isEmpty() && !sentences.contains(trimmed)) {
                sentences.add(trimmed);
            }
        }
        optimized = String.join("。", sentences);

        return optimized;
    }

    public String optimizeUserPrompt(String userPrompt) {
        String optimized = userPrompt.trim().replaceAll("\\\\s+", " ");
        optimized = optimized
            .replace("请帮我", "")
            .replace("能否", "")
            .replace("非常感谢", "感谢")
            .replace("麻烦你", "");
        optimized = optimized
            .replaceAll("。+", "。")
            .replaceAll("，+", "，")
            .replaceAll("！+", "！");
        return optimized;
    }

    public List<String> simplifyHistory(
        List<String> history,
        int maxContextTokens,
        int recentMessagesCount
    ) {
        if (history == null || history.isEmpty()) {
            return history;
        }

        List<String> simplified = new ArrayList<>();
        int startIndex = Math.max(0, history.size() - recentMessagesCount);
        for (int i = startIndex; i < history.size(); i++) {
            simplified.add(history.get(i));
        }

        int totalTokens = calculateTokens(simplified);
        while (totalTokens > maxContextTokens && simplified.size() > 2) {
            simplified.remove(0);
            totalTokens = calculateTokens(simplified);
        }

        return simplified;
    }

    private int calculateTokens(List<String> messages) {
        int total = 0;
        for (String msg : messages) {
            total += estimateTokens(msg);
        }
        return total;
    }
}`;

const PerformanceTuningPage = () => {
  return (
    <Layout>
      <div className="page-tags">
        <Tag variant="indigo">性能优化</Tag>
        <Tag variant="green">高级难度</Tag>
      </div>

      <h1 className="page-title">LangChain4j 性能调优</h1>
      <p className="page-description">
        优化 AI 应用性能，通过连接池、缓存、批量处理等手段，提升响应速度、降低成本。
      </p>

      <section className="content-section">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 性能优化概览</h2>
        <div className="grid-4col">
          <div className="card card-green">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">响应速度</h3>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• 连接池优化</li>
              <li>• 缓存策略</li>
              <li>• 批量处理</li>
            </ul>
          </div>
          <div className="card card-blue">
            <div className="text-3xl mb-3">💾</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">资源利用</h3>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• 内存管理</li>
              <li>• 并发控制</li>
              <li>• 资源回收</li>
            </ul>
          </div>
          <div className="card card-purple">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">成本控制</h3>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• Token优化</li>
              <li>• 模型选择</li>
              <li>• 请求合并</li>
            </ul>
          </div>
          <div className="card card-orange">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">监控分析</h3>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• 性能指标</li>
              <li>• 瓶颈识别</li>
              <li>• 调优工具</li>
            </ul>
          </div>
        </div>
      </section>

      <TipBox variant="info" title="学习目标">
        <ul className="list-styled">
          <li>掌握LangChain4j应用的性能优化技巧</li>
          <li>学习连接池、缓存、批量处理等优化策略</li>
          <li>理解Token优化和成本控制方法</li>
          <li>掌握监控、分析和调优工具的使用</li>
          <li>学习生产环境性能优化最佳实践</li>
        </ul>
      </TipBox>

      <section className="content-section">
        <SectionHeader number={1} title="连接池优化" />

        <h3 className="subsection-title">1.1 HTTP连接池配置</h3>
        <p className="text-gray-700 mb-4">配置优化的OkHttpClient，连接池管理大幅提升HTTP请求性能：</p>

        <CodeBlock
          code={httpClientPoolConfigCode}
          language="java"
          filename="HttpClientPoolConfig.java"
        />

        <TipBox variant="success" title="连接池优化要点">
          <ul className="list-styled">
            <li><strong>连接复用</strong>：保持连接活跃，避免频繁创建销毁</li>
            <li><strong>合理池大小</strong>：maxIdleConnections 根据并发量设置</li>
            <li><strong>Keep-alive</strong>：设置合理的keep-alive时间</li>
            <li><strong>超时控制</strong>：connectTimeout、readTimeout 要合理设置</li>
          </ul>
        </TipBox>
      </section>

      <section className="content-section">
        <SectionHeader number={2} title="缓存策略" />

        <h3 className="subsection-title">2.1 多级缓存实现</h3>
        <p className="text-gray-700 mb-4">实现：L1（Caffeine本地缓存）→ L2（Redis分布式缓存）→ L3（数据库）：</p>

        <CodeBlock
          code={multiLevelCacheServiceCode}
          language="java"
          filename="MultiLevelCacheService.java"
        />

        <TipBox variant="info" title="缓存最佳实践">
          <ul className="list-styled">
            <li><strong>多级缓存</strong>：L1内存缓存 → L2分布式缓存 → L3数据库</li>
            <li><strong>缓存预热</strong>：应用启动时加载热点数据</li>
            <li><strong>TTL策略</strong>：根据数据更新频率设置合理的过期时间</li>
            <li><strong>缓存穿透保护</strong>：对不存在的key也缓存空值</li>
            <li><strong>缓存雪崩保护</strong>：TTL增加随机抖动，避免同时失效</li>
          </ul>
        </TipBox>
      </section>

      <section className="content-section">
        <SectionHeader number={3} title="批量处理优化" />

        <h3 className="subsection-title">3.1 批量Embedding</h3>
        <p className="text-gray-700 mb-4">批量处理配置，并发执行，错误重试：</p>

        <CodeBlock
          code={batchEmbeddingOptimizationCode}
          language="java"
          filename="BatchEmbeddingOptimization.java"
        />

        <div className="info-card info-card-purple">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-purple-600">📊</span> 批量处理性能对比
          </h4>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>批大小</th>
                  <th>API调用次数</th>
                  <th>耗时</th>
                  <th>吞吐量</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1 (串行)</td>
                  <td>1000</td>
                  <td>~30000ms</td>
                  <td>3.3 条/秒</td>
                </tr>
                <tr>
                  <td>50</td>
                  <td>20</td>
                  <td>~18000ms</td>
                  <td>55.6 条/秒</td>
                </tr>
                <tr>
                  <td>100 (推荐)</td>
                  <td>10</td>
                  <td>~12000ms</td>
                  <td>83.3 条/秒</td>
                </tr>
                <tr>
                  <td>200</td>
                  <td>5</td>
                  <td>~8000ms</td>
                  <td>125.0 条/秒</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-gray-700">
            <strong>结论</strong>：批大小从1增加到100时，吞吐量提升<strong>25倍</strong>。推荐批大小为100-200。
          </div>
        </div>
      </section>

      <section className="content-section">
        <SectionHeader number={4} title="Token优化" />

        <h3 className="subsection-title">4.1 Token计数和优化</h3>
        <p className="text-gray-700 mb-4">Token优化服务，减少API调用成本：</p>

        <CodeBlock
          code={tokenOptimizerCode}
          language="java"
          filename="TokenOptimizer.java"
        />

        <div className="info-card info-card-green">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-green-600">✅</span> Token优化效果
          </h4>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>优化项</th>
                  <th>节省Token</th>
                  <th>节省成本(%)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>系统提示词优化</td>
                  <td>每次200-300</td>
                  <td>5-10%</td>
                </tr>
                <tr>
                  <td>用户输入优化</td>
                  <td>每次50-150</td>
                  <td>1-3%</td>
                </tr>
                <tr>
                  <td>对话历史裁剪</td>
                  <td>每次500-2000</td>
                  <td>10-30%</td>
                </tr>
                <tr>
                  <td>总优化效果</td>
                  <td>每次750-2550</td>
                  <td>15-40%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="summary-card">
          <h2 className="text-2xl font-bold mb-4">🎯 性能优化总结</h2>
          <div className="grid-3col">
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="text-2xl mb-3">⚡</div>
              <div className="font-semibold mb-2">响应速度</div>
              <ul className="text-sm space-y-1">
                <li>• HTTP连接池</li>
                <li>• 并发处理</li>
                <li>• 重试机制</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="text-2xl mb-3">💾</div>
              <div className="font-semibold mb-2">资源利用</div>
              <ul className="text-sm space-y-1">
                <li>• 多级缓存</li>
                <li>• 内存管理</li>
                <li>• 资源回收</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="text-2xl mb-3">💰</div>
              <div className="font-semibold mb-2">成本控制</div>
              <ul className="text-sm space-y-1">
                <li>• Token优化</li>
                <li>• 模型选择</li>
                <li>• 缓存利用</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="text-2xl mb-3">📊</div>
              <div className="font-semibold mb-2">批量处理</div>
              <ul className="text-sm space-y-1">
                <li>• Embedding批量</li>
                <li>• 并发执行</li>
                <li>• 错误重试</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="text-2xl mb-3">📈</div>
              <div className="font-semibold mb-2">监控分析</div>
              <ul className="text-sm space-y-1">
                <li>• 性能指标</li>
                <li>• 瓶颈识别</li>
                <li>• 调优工具</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="text-2xl mb-3">🔧</div>
              <div className="font-semibold mb-2">调优工具</div>
              <ul className="text-sm space-y-1">
                <li>• 性能分析器</li>
                <li>• Profiling工具</li>
                <li>• 日志分析</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-lg mb-2">📚 <strong>下一章：深度解析</strong></p>
            <p className="text-sm">深入探讨LangChain4j的内部机制和高级特性</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PerformanceTuningPage;
