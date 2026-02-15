import Layout from '../components/layout/Layout';
import { Tag, SectionHeader, CodeBlock, TipBox } from '../components/ui';

const loggingModelListenerCode = `package com.example.langchain4j.listeners;

import dev.langchain4j.model.chat.listener.ModelListener;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.chat.listener.ChatMemoryContext;
import dev.langchain4j.model.chat.listener.ChatMemoryId;

public class LoggingModelListener implements ModelListener {

    @Override
    public void onRequest(ChatMemoryContext context, ChatMemoryId memoryId) {
        System.out.printf("[%s] 请求开始 - Memory ID: %s", 
            context.chatMemoryId(), memoryId);
    }

    @Override
    public void onResponse(ChatMemoryContext context, ChatMemoryId memoryId, AiMessage response) {
        System.out.printf("[%s] 响应完成 - Memory ID: %s - 内容: %s",
            context.chatMemoryId(), memoryId, response.text());
    }

    @Override
    public void onError(ChatMemoryContext context, ChatMemoryId memoryId, Throwable error) {
        System.err.println("[%s] 错误发生 - Memory ID: %s - Error: %s",
            context.chatMemoryId(), memoryId, error.getMessage());
    }
}`;

const budgetTokenListenerCode = `package com.example.langchain4j.listeners;

import dev.langchain4j.model.chat.listener.TokenListener;
import java.util.concurrent.atomic.AtomicLong;

public class BudgetTokenListener implements TokenListener {

    private final AtomicLong totalTokens = new AtomicLong(0);
    private static final double BUDGET_THRESHOLD = 100000;

    @Override
    public void onToken(int tokens, TokenRequest request) {
        long currentTotal = totalTokens.addAndGet(tokens);
        
        if (currentTotal > BUDGET_THRESHOLD) {
            System.out.println("警告：Token 使用超过预算！当前: " + currentTotal);
        }
    }
}`;

const listenerIntegrationCode = `public class ListenerIntegration {

    private final ChatLanguageModel chatModel;
    private final ModelListener loggingListener;
    private final TokenListener tokenListener;

    public ListenerIntegration(ChatLanguageModel chatModel) {
        this.chatModel = chatModel;
        this.loggingListener = new LoggingModelListener();
        this.tokenListener = new BudgetTokenListener();
        
        chatModel.addListener(loggingListener);
        chatModel.addListener(tokenListener);
    }

    public String sendMessageWithListeners(String message) {
        return chatModel.generate(message);
    }
}`;

const ChatListenersPage = () => {
  return (
    <Layout>
      <div className="page-tags">
        <Tag variant="indigo">聊天监听器</Tag>
        <Tag variant="purple">事件处理</Tag>
        <Tag variant="green">异步编程</Tag>
      </div>

      <h1 className="page-title">监听器</h1>
      <p className="page-description">
        LangChain4j 的聊天监听器机制与事件处理。
      </p>

      <nav className="toc-nav">
        <h3 className="toc-title">目录</h3>
        <ol className="toc-list">
          <li className="toc-item"><span className="toc-number">1.</span> <a href="#overview" className="toc-link">监听器概述</a></li>
          <li className="toc-item"><span className="toc-number">2.</span> <a href="#types" className="toc-link">监听器类型</a></li>
          <li className="toc-item"><span className="toc-number">3.</span> <a href="#implementation" className="toc-link">监听器实现</a></li>
          <li className="toc-item"><span className="toc-number">4.</span> <a href="#application" className="toc-link">实战应用</a></li>
        </ol>
      </nav>

      <section id="overview" className="content-section">
        <SectionHeader number={1} title="监听器概述" />
        <p className="paragraph">
          聊天监听器是 LangChain4j 提供的一种事件驱动机制，用于监听和响应聊天过程中的各种事件：
        </p>

        <div className="grid-3col">
          <div className="card card-blue">
            <h4 className="font-semibold text-blue-800 mb-2">事件类型</h4>
            <p className="text-blue-700 text-sm">监听器可以响应多种事件：</p>
            <ul className="text-blue-600 text-xs space-y-1">
              <li>• 消息发送前</li>
              <li>• 消息发送后</li>
              <li>• 模型开始生成</li>
              <li>• 模型生成完成</li>
              <li>• Token 使用更新</li>
            </ul>
          </div>
          <div className="card card-green">
            <h4 className="font-semibold text-green-800 mb-2">应用场景</h4>
            <p className="text-green-700 text-sm">监听器的典型应用场景：</p>
            <ul className="text-green-600 text-xs space-y-1">
              <li>• 日志记录和审计</li>
              <li>• Token 使用监控</li>
              <li>• 消息中间件处理</li>
              <li>• 自定义业务逻辑触发</li>
              <li>• 流程控制和拦截</li>
            </ul>
          </div>
          <div className="card card-purple">
            <h4 className="font-semibold text-purple-800 mb-2">核心优势</h4>
            <p className="text-purple-700 text-sm">使用监听器的优势：</p>
            <ul className="text-purple-600 text-xs space-y-1">
              <li>• 解耦：将业务逻辑从主流程中分离</li>
              <li>• 可测试：独立测试监听器逻辑</li>
              <li>• 可扩展：动态添加和移除监听器</li>
              <li>• 观察者模式：易于实现复杂的事件链</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="types" className="content-section">
        <SectionHeader number={2} title="监听器类型" />
        <p className="paragraph">
          LangChain4j 提供了多种内置监听器：
        </p>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>监听器</th>
                <th>触发时机</th>
                <th>用途</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>ModelListener</strong></td>
                <td>模型生成过程中</td>
                <td>监控模型响应、流式输出处理</td>
              </tr>
              <tr>
                <td><strong>TokenListener</strong></td>
                <td>Token 使用时</td>
                <td>实时监控 Token 消耗、预算控制</td>
              </tr>
              <tr>
                <td><strong>ChatMemoryListener</strong></td>
                <td>聊天记忆更新时</td>
                <td>记忆持久化、上下文管理</td>
              </tr>
              <tr>
                <td><strong>ToolExecutionListener</strong></td>
                <td>工具执行时</td>
                <td>日志记录、权限检查、结果处理</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="implementation" className="content-section">
        <SectionHeader number={3} title="监听器实现" />

        <h3 className="subsection-title">3.1 ModelListener 示例</h3>
        <p className="text-gray-700 mb-4">使用 ModelListener 监控模型生成过程：</p>

        <CodeBlock
          code={loggingModelListenerCode}
          language="java"
          filename="LoggingModelListener.java"
        />

        <h3 className="subsection-title">3.2 TokenListener 示例</h3>
        <p className="text-gray-700 mb-4">使用 TokenListener 监控 Token 使用：</p>

        <CodeBlock
          code={budgetTokenListenerCode}
          language="java"
          filename="BudgetTokenListener.java"
        />
      </section>

      <section id="application" className="content-section">
        <SectionHeader number={4} title="实战应用" />

        <h3 className="subsection-title">4.1 集成监听器</h3>
        <p className="text-gray-700 mb-4">将监听器集成到 ChatLanguageModel：</p>

        <CodeBlock
          code={listenerIntegrationCode}
          language="java"
          filename="ListenerIntegration.java"
        />

        <h3 className="subsection-title">4.2 异步处理</h3>
        <p className="text-gray-700 mb-4">监听器中的异步处理最佳实践：</p>

        <TipBox variant="info" title="异步注意事项">
          <ul className="list-styled">
            <li><strong>避免阻塞</strong>：监听器中不要执行耗时操作，使用异步 API</li>
            <li><strong>错误处理</strong>：监听器中的错误不应影响主流程</li>
            <li><strong>幂等性</strong>：确保监听器逻辑可以安全重试</li>
            <li><strong>线程安全</strong>：监听器必须是线程安全的</li>
          </ul>
        </TipBox>

        <div className="info-card info-card-purple mt-6">
          <h4 className="font-semibold text-purple-800 mb-3">最佳实践总结</h4>
          <ul className="text-purple-700 space-y-2">
            <li><strong>轻量级监听器</strong>：快速执行，避免影响主流程性能</li>
            <li><strong>合理使用日志</strong>：适当级别记录关键事件，避免过度日志</li>
            <li><strong>组合监听器</strong>：多个监听器可以协同工作实现复杂逻辑</li>
            <li><strong>测试覆盖</strong>：为监听器逻辑编写单元测试</li>
            <li><strong>监控告警</strong>：使用监听器实现成本控制和异常告警</li>
          </ul>
        </div>
      </section>

      <section className="content-section">
        <div className="summary-card">
          <h3 className="text-2xl font-bold mb-4">本节小结</h3>
          <p className="mb-4">本节完整介绍了 LangChain4j 的聊天监听器机制，包括：</p>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li><strong>监听器概述</strong>：事件类型、应用场景、核心优势</li>
            <li><strong>监听器类型</strong>：ModelListener、TokenListener、ChatMemoryListener、ToolExecutionListener</li>
            <li><strong>监听器实现</strong>：完整的代码示例、集成方法</li>
            <li><strong>实战应用</strong>：监听器集成、异步处理、最佳实践</li>
          </ul>
          <div className="border-t border-indigo-400 pt-6">
            <p className="text-sm opacity-80 mb-2">核心特性</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Tag variant="indigo">事件驱动</Tag>
              <Tag variant="purple">异步处理</Tag>
              <Tag variant="blue">日志监控</Tag>
              <Tag variant="green">Token统计</Tag>
            </div>
            <p className="text-sm opacity-80 mb-2">技术栈</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Tag variant="cyan">LangChain4j</Tag>
              <Tag variant="indigo">ModelListener</Tag>
              <Tag variant="purple">TokenListener</Tag>
            </div>
            <a href="/faq" className="text-white hover:text-indigo-200 transition-colors">
              下一章：常见问题 →
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ChatListenersPage;
