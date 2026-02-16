import Layout from '../components/layout/Layout';
import { Tag, CodeBlockWithCopy, SectionHeader, TipBox, SummarySection } from '../components/ui';

const AdvancedFeaturesPage = () => {
  const streamingComplete = `import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.chat.StreamingChatLanguageModel;
import dev.langchain4j.model.chat.StreamingResponseHandler;
import dev.langchain4j.model.openai.OpenAiStreamingChatModel;
import static dev.langchain4j.model.openai.OpenAiStreamingChatModel.builder;

// 创建StreamingChatModel
StreamingChatModel model = builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .modelName("gpt-4")
    .build();

// 实现流式响应
model.generate("写一首关于AI的诗", new StreamingResponseHandler() {
    // 接收部分token（流式输出）
    @Override
    public void onPartialResponse(String partialResponse) {
        System.out.print(partialResponse);
    }

    // 响应完成
    @Override
    public void onCompleteResponse(String completeResponse) {
        System.out.println("\\n--- COMPLETE ---");
    }

    // 错误处理
    @Override
    public void onError(Throwable error) {
        System.err.println("Error: " + error.getMessage());
    }
});`;

  const structuredOutputComplete = `import dev.langchain4j.service.AiServices;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import static dev.langchain4j.model.openai.OpenAiChatModel.builder;

// 定义POJO类
public class WeatherInfo {
    private String city;
    private double temperature;
    private String condition;
    private String description;

    // 构造器、getters、setters
}

// 定义AI Service接口
interface WeatherService {
    @UserMessage("Get weather for {{city}}")
    WeatherInfo getWeather(@V("city") String city);
}

// 创建AI Service
ChatLanguageModel model = builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .modelName("gpt-4")
    .build();

WeatherService weatherService = AiServices.builder(WeatherService.class)
    .chatLanguageModel(model)
    .build();

// 使用 - 自动解析为POJO
WeatherInfo weather = weatherService.getWeather("Beijing");
System.out.println("Temperature: " + weather.getTemperature());
System.out.println("Condition: " + weather.getCondition());
System.out.println("Description: " + weather.getDescription());`;

  const agentArchitecture = `import dev.langchain4j.service.AiServices;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.agent.tool.Tool;
import dev.langchain4j.agent.tool.ToolExecutor;
import java.util.Map;
import java.util.HashMap;
import static dev.langchain4j.model.openai.OpenAiChatModel.builder;

// 定义工具
@Tool("search_web")
public class WebSearchTool {
    public String search(String query) {
        // 实现网页搜索
        return "搜索结果：" + query;
    }
}

@Tool("get_database")
public class DatabaseTool {
    public String query(String sql) {
        // 实现数据库查询
        return "查询结果";
    }
}

// 定义Agent接口
interface ResearchAgent {
    String research(String topic);
}

// 创建Agent
ChatLanguageModel model = builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .modelName("gpt-4")
    .temperature(0.0)  // 确定性决策
    .build();

Map<String, Tool> tools = new HashMap<>();
tools.put("search_web", ToolSpecification.builder()
    .name("search_web")
    .description("Search the web for information")
    .build());
tools.put("get_database", ToolSpecification.builder()
    .name("get_database")
    .description("Query the database")
    .build());

ResearchAgent agent = AiServices.builder(ResearchAgent.class)
    .chatLanguageModel(model)
    .tools(tools)
    .build();

// Agent自主决策和工具调用
String result = agent.research("AI发展趋势");
System.out.println(result);`;

  return (
    <Layout>
      <div className="page-tags">
        <Tag variant="indigo">高级特性</Tag>
        <Tag variant="purple">进阶内容</Tag>
        <Tag variant="green">实战应用</Tag>
      </div>

      <h1 className="page-title">高级特性</h1>
      <p className="page-description">
        深入探索LangChain4j的高级特性，包括流式响应、结构化输出、智能体架构等，构建强大的AI应用。
      </p>

      <nav className="toc-nav">
        <h3 className="toc-nav-title">目录</h3>
        <ol className="toc-list">
          <li className="toc-item"><span className="toc-number">1.</span> <a href="#流式响应" className="toc-link">流式响应</a></li>
          <li className="toc-item"><span className="toc-number">2.</span> <a href="#结构化输出" className="toc-link">结构化输出</a></li>
          <li className="toc-item"><span className="toc-number">3.</span> <a href="#智能体架构" className="toc-link">智能体架构</a></li>
          <li className="toc-item"><span className="toc-number">4.</span> <a href="#最佳实践" className="toc-link">最佳实践</a></li>
          <li className="toc-item"><span className="toc-number">5.</span> <a href="#常见问题" className="toc-link">常见问题</a></li>
        </ol>
      </nav>

      <section id="流式响应" className="content-section">
        <SectionHeader number={1} title="流式响应" />

        <h3 className="subsection-title">1.1 为什么需要流式响应</h3>
        <p className="paragraph">
          流式响应（Streaming）允许AI应用逐步接收LLM的输出，而不是等待完整响应后才显示。这在长文本生成场景中特别重要。
        </p>

        <div className="info-card info-card-blue">
          <h4 className="card-title-blue">核心优势</h4>
          <ul className="list-styled list-blue">
            <li><strong>实时反馈</strong>：用户可以立即看到输出，无需长时间等待</li>
            <li><strong>更好的用户体验</strong>：减少感知延迟，提升交互流畅度</li>
            <li><strong>适合长文本</strong>：生成长文档时，可以逐步显示内容</li>
            <li><strong>降低资源占用</strong>：客户端和服务器都更高效地处理数据流</li>
          </ul>
        </div>

        <h3 className="subsection-title">1.2 StreamingChatLanguageModel</h3>
        <p className="paragraph">
          LangChain4j提供了StreamingChatLanguageModel接口，支持流式输出：
        </p>

        <CodeBlockWithCopy language="java" filename="StreamingExample.java" code={streamingComplete} />

        <TipBox type="info" title="StreamingResponseHandler接口">
          <ul className="tip-box-list">
            <li><strong>onPartialResponse</strong>：接收并处理部分token</li>
            <li><strong>onCompleteResponse</strong>：在流式响应完成时调用</li>
            <li><strong>onError</strong>：处理流式响应过程中的错误</li>
            <li><strong>TokenStream</strong>：可以获取原始token流</li>
          </ul>
        </TipBox>

        <h3 className="subsection-title">1.3 前端集成</h3>
        <p className="paragraph">
          在Web应用中集成流式响应：
        </p>

        <div className="info-card info-card-purple">
          <h4 className="card-title-purple">集成方式</h4>
          <ul className="list-styled list-purple">
            <li><strong>Server-Sent Events</strong>：传统的Web流式响应方案</li>
            <li><strong>WebSocket</strong>：双向实时通信</li>
            <li><strong>SSE（Server-Sent Events）</strong>：HTTP流式响应</li>
            <li><strong>React组件</strong>：使用state管理流式数据</li>
          </ul>
        </div>
      </section>

      <section id="结构化输出" className="content-section">
        <SectionHeader number={2} title="结构化输出" />

        <h3 className="subsection-title">2.1 OutputParser接口</h3>
        <p className="paragraph">
          结构化输出允许将LLM的文本响应直接转换为Java对象（POJO），便于程序化处理和数据验证。
        </p>

        <div className="info-card info-card-green">
          <h4 className="card-title-green">自动解析优势</h4>
          <ul className="list-styled list-green">
            <li><strong>类型安全</strong>：编译时检查，减少运行时错误</li>
            <li><strong>代码简洁</strong>：无需手动解析字符串</li>
            <li><strong>易于测试</strong>：可以轻松mock和验证</li>
            <li><strong>数据验证</strong>：可以添加字段级别的验证</li>
          </ul>
        </div>

        <h3 className="subsection-title">2.2 使用POJO</h3>
        <p className="paragraph">
          通过定义POJO类和返回类型，LangChain4j可以自动解析响应：
        </p>

        <CodeBlockWithCopy language="java" filename="StructuredOutputExample.java" code={structuredOutputComplete} />

        <TipBox type="success" title="POJO设计要点">
          <ul className="tip-box-list">
            <li><strong>可序列化</strong>：实现Serializable接口</li>
            <li><strong>默认值</strong>：为字段设置合理的默认值</li>
            <li><strong>验证方法</strong>：添加validate()方法检查数据完整性</li>
            <li><strong>Builder模式</strong>：使用Builder简化对象创建</li>
            <li><strong>不可变对象</strong>：使用final字段或复制构造器</li>
          </ul>
        </TipBox>
      </section>

      <section id="智能体架构" className="content-section">
        <SectionHeader number={3} title="智能体架构" />

        <h3 className="subsection-title">3.1 什么是Agent</h3>
        <p className="paragraph">
          Agent（智能体）是具有工具调用能力的AI系统，它可以自主决策、规划任务、调用工具并整合结果，形成更强大的应用。
        </p>

        <div className="info-card info-card-indigo">
          <h4 className="card-title-indigo">Agent工作流程</h4>
          <ol className="list-decimal list-styled">
            <li><strong>理解任务</strong>：解析用户的请求和意图</li>
            <li><strong>规划步骤</strong>：将复杂任务拆解为多个子任务</li>
            <li><strong>选择工具</strong>：根据任务需要选择合适的工具</li>
            <li><strong>执行工具</strong>：按顺序调用必要的工具</li>
            <li><strong>整合结果</strong>：将多个工具的输出整合为最终答案</li>
            <li><strong>反思优化</strong>：根据执行结果调整策略，可能需要多次迭代</li>
          </ol>
        </div>

        <h3 className="subsection-title">3.2 工具和工具执行器</h3>
        <p className="paragraph">
          LangChain4j提供了Tool和ToolExecutor接口，用于定义和执行工具：
        </p>

        <CodeBlockWithCopy language="java" filename="AgentExample.java" code={agentArchitecture} />

        <TipBox type="warning" title="工具设计原则">
          <ul className="tip-box-list">
            <li><strong>单一职责</strong>：每个工具只做一件事，保持简单</li>
            <li><strong>清晰描述</strong>：工具的功能和参数要有清晰的描述</li>
            <li><strong>错误处理</strong>：工具内部要有良好的异常处理和错误消息</li>
            <li><strong>幂等性</strong>：工具应该是幂等的，多次调用结果一致</li>
            <li><strong>输入验证</strong>：验证输入参数，避免无效调用</li>
          </ul>
        </TipBox>
      </section>

      <section id="最佳实践" className="content-section">
        <SectionHeader number={4} title="最佳实践" />

        <h3 className="subsection-title">4.1 性能优化</h3>
        <p className="paragraph">
          使用高级特性时的性能优化建议：
        </p>

        <div className="info-card info-card-purple">
          <h4 className="card-title-purple">优化策略</h4>
          <ul className="list-styled list-purple">
            <li><strong>流式响应</strong>：使用流式响应减少用户等待时间</li>
            <li><strong>批量操作</strong>：对于Embedding等操作使用批量API</li>
            <li><strong>缓存机制</strong>：缓存频繁调用的结果，减少重复计算</li>
            <li><strong>异步处理</strong>：使用异步API提高并发性能</li>
            <li><strong>连接池</strong>：复用HTTP连接，减少连接开销</li>
          </ul>
        </div>

        <h3 className="subsection-title">4.2 错误处理</h3>
        <p className="paragraph">
          健壮的错误处理策略：
        </p>

        <div className="info-card info-card-yellow">
          <h4 className="card-title-yellow">错误处理要点</h4>
          <ul className="list-styled list-yellow">
            <li><strong>超时设置</strong>：为所有LLM调用设置合理的超时时间</li>
            <li><strong>重试机制</strong>：对于可重试的操作实现指数退避</li>
            <li><strong>降级策略</strong>：主服务失败时切换到备用方案</li>
            <li><strong>异常捕获</strong>：捕获特定异常，提供友好的错误消息</li>
            <li><strong>日志记录</strong>：记录详细的错误信息，便于调试</li>
          </ul>
        </div>

        <h3 className="subsection-title">4.3 安全考虑</h3>
        <p className="paragraph">
          使用高级特性时的安全实践：
        </p>

        <div className="info-card info-card-red">
          <h4 className="card-title-red">安全建议</h4>
          <ul className="list-styled list-red">
            <li><strong>输入验证</strong>：验证所有用户输入，防止注入攻击</li>
            <li><strong>输出过滤</strong>：对AI输出进行内容审核和敏感信息过滤</li>
            <li><strong>权限控制</strong>：限制工具访问的资源和API</li>
            <li><strong>数据加密</strong>：敏感数据在传输和存储时加密</li>
            <li><strong>审计日志</strong>：记录关键操作，便于事后审计</li>
          </ul>
        </div>
      </section>

      <section id="常见问题" className="content-section">
        <SectionHeader number={5} title="常见问题" />

        <h3 className="subsection-title">5.1 FAQ</h3>
        <div className="faq-section">
          <div className="faq-item">
            <h4 className="faq-question">Q: 流式响应和非流式响应有什么区别？</h4>
            <p className="faq-answer">
              A: 非流式响应等待完整输出后才返回，用户需等待较长时间。流式响应逐步返回token，可以实时显示，提升用户体验。
              非流式：适合短文本、需要完整答案的场景。
              流式：适合长文本生成、实时交互的场景。
            </p>
          </div>

          <div className="faq-item">
            <h4 className="faq-question">Q: 结构化输出失败时如何处理？</h4>
            <p className="faq-answer">
              A: 可以通过以下方式处理：
              - 设置temperature参数降低随机性，提高输出稳定性
              - 添加清晰的格式要求（如JSON格式）到prompt中
              - 使用重试机制自动恢复
              - 记录失败案例，分析原因并调整prompt
              - 考虑使用few-shot learning提供示例引导正确输出
            </p>
          </div>

          <div className="faq-item">
            <h4 className="faq-question">Q: Agent如何处理工具调用失败？</h4>
            <p className="faq-answer">
              A: Agent应该有完善的错误处理机制：
              - 捕获工具执行异常，记录详细错误信息
              - 根据错误类型决定是否重试或跳过该工具
              - 提供降级工具作为备选方案
              - 将错误信息反馈给LLM，让它尝试其他方法
              - 实现最大重试次数，避免无限循环
            </p>
          </div>

          <div className="faq-item">
            <h4 className="faq-question">Q: 如何优化Agent的决策效率？</h4>
            <p className="faq-answer">
              A: 优化策略包括：
              - 使用清晰的prompt，明确任务目标和约束
              - 限制工具数量，只提供必要的工具
              - 为工具添加优先级，帮助Agent更快选择
              - 使用上下文缓存，避免重复调用
              - 实现并行工具调用（如果LLM支持）
              - 定期分析Agent的决策日志，优化prompt
            </p>
          </div>

          <div className="faq-item">
            <h4 className="faq-question">Q: 流式响应如何处理中间结果？</h4>
            <p className="faq-answer">
              A: 中间结果处理策略：
              - 在onPartialResponse中更新UI状态，显示部分内容
              - 对中间结果进行基本的格式化和清理
              - 不要假设中间结果是完整的，可能被截断或修正
              - 实现用户可以手动停止生成的功能
              - 记录中间结果，便于调试和分析
            </p>
          </div>
        </div>
      </section>

      <SummarySection
        description="本节深入讲解了LangChain4j的高级特性："
        items={[
          '<strong>流式响应</strong>：StreamingChatLanguageModel、StreamingResponseHandler、实时输出',
          '<strong>结构化输出</strong>：OutputParser、POJO映射、自动类型转换',
          '<strong>智能体架构</strong>：Agent设计原理、工具定义、自主决策',
          '<strong>最佳实践</strong>：性能优化、错误处理、安全考虑',
          '<strong>常见问题</strong>：流式和非流式对比、输出失败处理、Agent优化',
        ]}
        footer="🎉 恭喜你掌握了高级特性！继续学习输出解析，深入了解结构化输出的实现机制。"
      />
    </Layout>
  );
};

export default AdvancedFeaturesPage;
