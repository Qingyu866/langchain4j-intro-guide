import Layout from '../components/layout/Layout';
import { Tag, SectionHeader, CodeBlockWithCopy, TipBox } from '../components/ui';

const exceptionHierarchyCode = `package com.example.langchain4j.exception;

import dev.langchain4j.exception.*;

public class ExceptionHierarchy {

    public static void demonstrateExceptions() {
        try {
            // 1. 网络相关异常
            // ConnectionException: HTTP 连接失败
            // TimeoutException: 请求超时

            // 2. 认证相关异常
            // AuthenticationException: API Key 无效
            // AuthorizationException: 权限不足
            // RateLimitExceededException: 配额超限

            // 3. 模型相关异常
            // ModelUnreachableException: 模型不可用
            // TokenLimitExceededException: Token 超限
            // ContentPolicyViolationException: 内容违规

            // 4. 工具相关异常
            // ToolExecutionException: 工具执行失败
            // ToolParameterValidationException: 参数验证失败

        } catch (ConnectionException e) {
            System.err.println("网络连接失败: " + e.getMessage());
        } catch (AuthenticationException e) {
            System.err.println("认证失败: " + e.getMessage());
        } catch (ModelUnreachableException e) {
            System.err.println("模型不可用: " + e.getMessage());
        }
    }
}`;

const retryHandlerCode = `package com.example.langchain4j.retry;

import java.time.Duration;

public class RetryHandler {

    private final int maxRetries;
    private final Duration initialDelay;
    private final Duration maxDelay;

    public RetryHandler(int maxRetries, Duration initialDelay, Duration maxDelay) {
        this.maxRetries = maxRetries;
        this.initialDelay = initialDelay;
        this.maxDelay = maxDelay;
    }

    public <T> T executeWithRetry(RetryableTask<T> task) throws Exception {
        Exception lastError = null;

        for (int attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                if (attempt > 0) {
                    Duration delay = getRetryDelay(attempt - 1);
                    Thread.sleep(delay.toMillis());
                }
                return task.execute();
            } catch (Exception e) {
                lastError = e;
                if (!shouldRetry(e) || attempt == maxRetries) {
                    throw e;
                }
            }
        }
        throw lastError;
    }

    public Duration getRetryDelay(int attempt) {
        long delayMillis = (long) (initialDelay.toMillis() * Math.pow(2, attempt));
        long jitter = (long) (Math.random() * delayMillis * 0.1);
        delayMillis += jitter;
        Duration delay = Duration.ofMillis(delayMillis);
        return delay.compareTo(maxDelay) < 0 ? delay : maxDelay;
    }

    public boolean shouldRetry(Exception e) {
        return e instanceof ConnectionException || e instanceof TimeoutException;
    }

    public interface RetryableTask<T> {
        T execute() throws Exception;
    }
}`;

const modelFailoverCode = `package com.example.langchain4j.failover;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.data.message.UserMessage;

public class ModelFailover {

    private final List<ChatLanguageModel> models;
    private volatile int currentIndex = 0;

    public ModelFailover(ChatLanguageModel... models) {
        this.models = List.of(models);
    }

    public String generateWithFailover(String prompt) {
        for (int i = 0; i < models.size(); i++) {
            try {
                ChatLanguageModel model = models.get(currentIndex);
                String response = model.generate(new UserMessage(prompt));
                return response;
            } catch (Exception e) {
                currentIndex = (currentIndex + 1) % models.size();
            }
        }
        throw new RuntimeException("所有 AI 模型都不可用");
    }
}`;

const errorLoggerCode = `package com.example.langchain4j.logging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ErrorLogger {

    private static final Logger logger = LoggerFactory.getLogger(ErrorLogger.class);

    public static void logError(Exception error, String context) {
        logger.error("错误类型: {}, 消息: {}, 上下文: {}",
            error.getClass().getSimpleName(),
            error.getMessage(),
            context
        );
    }
}`;

const comprehensiveErrorHandlerCode = `package com.example.langchain4j.framework;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.data.message.UserMessage;

public class ComprehensiveErrorHandler {

    private final ChatLanguageModel model;
    private final RetryHandler retryHandler;

    public ComprehensiveErrorHandler(ChatLanguageModel model) {
        this.model = model;
        this.retryHandler = new RetryHandler(3,
            java.time.Duration.ofSeconds(1),
            java.time.Duration.ofSeconds(10)
        );
    }

    public String generateWithFullErrorHandling(String prompt) {
        try {
            String response = retryHandler.executeWithRetry(() -> {
                return model.generate(new UserMessage(prompt)).content();
            });
            return response;
        } catch (Exception e) {
            ErrorLogger.logError(e, "generateWithFullErrorHandling");
            return handleException(e);
        }
    }

    private String handleException(Exception e) {
        if (e instanceof AuthenticationException) {
            return "无法连接到 AI 服务，请联系管理员";
        }
        if (e instanceof RateLimitExceededException) {
            return "请求过于频繁，请稍后重试";
        }
        return "服务暂时不可用，请稍后重试";
    }
}`;

const ErrorHandlingPage = () => {
  return (
    <Layout>
      <div className="page-tags">
        <Tag variant="indigo">错误处理</Tag>
        <Tag variant="red">异常管理</Tag>
        <Tag variant="orange">生产实践</Tag>
      </div>

      <h1 className="page-title">错误处理</h1>
      <p className="page-description">
        全面掌握 LangChain4j 的异常处理策略，构建健壮的 AI 应用。
      </p>

      <nav className="toc-nav">
        <h3 className="toc-title">目录</h3>
        <ol className="toc-list">
          <li className="toc-item"><span className="toc-number">1.</span> <a href="#classification" className="toc-link">错误分类与处理策略</a></li>
          <li className="toc-item"><span className="toc-number">2.</span> <a href="#network" className="toc-link">网络错误处理</a></li>
          <li className="toc-item"><span className="toc-number">3.</span> <a href="#auth" className="toc-link">认证与授权错误</a></li>
          <li className="toc-item"><span className="toc-number">4.</span> <a href="#model" className="toc-link">模型调用错误</a></li>
          <li className="toc-item"><span className="toc-number">5.</span> <a href="#tool" className="toc-link">工具调用错误</a></li>
          <li className="toc-item"><span className="toc-number">6.</span> <a href="#logging" className="toc-link">日志与监控</a></li>
          <li className="toc-item"><span className="toc-number">7.</span> <a href="#example" className="toc-link">综合示例</a></li>
        </ol>
      </nav>

      <section id="classification" className="content-section">
        <SectionHeader number={1} title="错误分类与处理策略" />
        <p className="paragraph">
          在生产环境中，LLM 调用可能遇到各种错误。本节介绍如何分类和处理这些错误，确保应用的稳定性。
        </p>

        <h3 className="subsection-title">1.1 LangChain4j 异常体系</h3>
        <p className="text-gray-700 mb-4">LangChain4j 提供了丰富的异常类型，帮助开发者定位和处理不同类型的错误：</p>

        <CodeBlockWithCopy
          code={exceptionHierarchyCode}
          language="java"
          filename="ExceptionHierarchy.java"
        />

        <h3 className="subsection-title">1.2 错误处理最佳实践</h3>
        <p className="text-gray-700 mb-4">遵循以下最佳实践，构建健壮的错误处理机制：</p>

        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>分类处理</strong>: 不同类型的错误使用不同的处理策略</li>
          <li><strong>优雅降级</strong>: 错误发生时提供友好的降级方案</li>
          <li><strong>重试机制</strong>: 对临时性错误（如网络抖动）自动重试</li>
          <li><strong>日志记录</strong>: 详细记录错误信息，便于排查问题</li>
          <li><strong>告警通知</strong>: 对严重错误及时通知运维人员</li>
          <li><strong>用户反馈</strong>: 向用户清晰的错误提示，避免技术术语</li>
        </ul>
      </section>

      <section id="network" className="content-section">
        <SectionHeader number={2} title="网络错误处理" />
        <p className="paragraph">
          网络错误是最常见的错误类型。本节介绍如何处理 HTTP 连接异常、超时错误，以及实现重试机制和熔断器模式。
        </p>

        <h3 className="subsection-title">2.1 重试机制</h3>
        <p className="text-gray-700 mb-4">使用指数退避算法实现智能重试：</p>

        <CodeBlockWithCopy
          code={retryHandlerCode}
          language="java"
          filename="RetryHandler.java"
        />
      </section>

      <section id="auth" className="content-section">
        <SectionHeader number={3} title="认证与授权错误" />
        <p className="paragraph">
          认证和授权错误通常需要人工干预。本节介绍如何安全地处理这些错误。
        </p>

        <h3 className="subsection-title">3.1 安全处理认证错误</h3>
        <p className="text-gray-700 mb-4">处理认证错误时，必须遵循安全最佳实践：</p>

        <TipBox variant="warning" title="安全注意事项">
          <ul className="list-styled">
            <li><strong>不暴露敏感信息</strong>: 不要向用户显示 API Key 或详细错误</li>
            <li><strong>日志脱敏</strong>: 在日志中隐藏 API Key 等敏感信息</li>
            <li><strong>限流</strong>: 防止暴力破解 API Key</li>
            <li><strong>告警</strong>: 及时通知管理员认证失败事件</li>
          </ul>
        </TipBox>
      </section>

      <section id="model" className="content-section">
        <SectionHeader number={4} title="模型调用错误" />
        <p className="paragraph">
          模型调用可能因各种原因失败。本节介绍如何处理模型不可用、Token 超限、内容违规等错误。
        </p>

        <h3 className="subsection-title">4.1 模型故障转移</h3>
        <p className="text-gray-700 mb-4">当模型不可用时，应该实施故障转移策略：</p>

        <CodeBlockWithCopy
          code={modelFailoverCode}
          language="java"
          filename="ModelFailover.java"
        />
      </section>

      <section id="tool" className="content-section">
        <SectionHeader number={5} title="工具调用错误" />
        <p className="paragraph">
          工具调用可能因各种原因失败。本节介绍如何处理工具执行异常、参数验证错误和返回值处理异常。
        </p>

        <h3 className="subsection-title">5.1 工具错误恢复策略</h3>
        <p className="text-gray-700 mb-4">工具执行失败时，应该根据错误类型采取不同的处理策略：</p>

        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>备用工具</strong>: 尝试使用备用工具</li>
          <li><strong>缓存结果</strong>: 使用缓存的历史结果</li>
          <li><strong>降级响应</strong>: 返回默认或简化响应</li>
        </ul>
      </section>

      <section id="logging" className="content-section">
        <SectionHeader number={6} title="日志与监控" />
        <p className="paragraph">
          完善的日志和监控系统可以帮助快速定位问题。本节介绍如何记录错误日志、监控性能指标和设置告警。
        </p>

        <h3 className="subsection-title">6.1 结构化日志</h3>
        <p className="text-gray-700 mb-4">使用结构化日志记录错误信息：</p>

        <CodeBlockWithCopy
          code={errorLoggerCode}
          language="java"
          filename="ErrorLogger.java"
        />
      </section>

      <section id="example" className="content-section">
        <SectionHeader number={7} title="综合示例：完整的错误处理框架" />
        <p className="paragraph">
          本节将所有错误处理策略整合到一个完整的框架中，展示如何构建生产级的错误处理系统。
        </p>

        <CodeBlockWithCopy
          code={comprehensiveErrorHandlerCode}
          language="java"
          filename="ComprehensiveErrorHandler.java"
        />
      </section>

      <section className="content-section">
        <div className="summary-card">
          <h3 className="text-2xl font-bold mb-4">本章小结</h3>
          <p className="mb-4">全面介绍了 LangChain4j 的错误处理策略。通过掌握这些技巧，您可以：</p>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li><strong>分类处理</strong>：根据错误类型采用不同的处理策略</li>
            <li><strong>智能重试</strong>：使用指数退避算法自动重试临时性错误</li>
            <li><strong>故障转移</strong>：当主模型或工具不可用时自动切换到备用</li>
            <li><strong>安全处理</strong>：妥善处理认证错误，避免泄露敏感信息</li>
            <li><strong>监控告警</strong>：建立完善的日志和监控系统，及时发现异常</li>
          </ul>
          <div className="border-t border-indigo-400 pt-6">
            <p className="text-sm opacity-80 mb-2">核心特性</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Tag variant="indigo">异常分类</Tag>
              <Tag variant="purple">重试机制</Tag>
              <Tag variant="blue">熔断器</Tag>
              <Tag variant="green">故障转移</Tag>
              <Tag variant="orange">日志监控</Tag>
            </div>
            <p className="text-sm opacity-80 mb-2">技术栈</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Tag variant="cyan">LangChain4j</Tag>
              <Tag variant="indigo">SLF4J</Tag>
              <Tag variant="purple">Exponential Backoff</Tag>
            </div>
            <a href="/moderation-safety" className="text-white hover:text-indigo-200 transition-colors">
              下一章：内容审核与安全 →
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ErrorHandlingPage;
