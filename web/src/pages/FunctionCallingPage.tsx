import Layout from '../components/layout/Layout';
import { Tag, CodeBlockWithCopy, SectionHeader, TipBox, SummarySection, MermaidChart } from '../components/ui';

const FunctionCallingPage = () => {
  const toolDefinition = `import dev.langchain4j.agent.tool.Tool;
import dev.langchain4j.agent.tool.ToolSpecification;

// 定义天气查询工具
@Tool("get_weather")
public class WeatherTool {
    
    public String getWeather(String city) {
        // 实现天气查询逻辑
        // 这里可以调用真实的天气API
        if (city == null || city.trim().isEmpty()) {
            return "请提供城市名称";
        }
        
        // 模拟天气查询
        return "北京今天天气：晴天，温度25°C";
    }
}`;

  const aiServiceIntegration = `import dev.langchain4j.service.AiServices;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.agent.tool.Tool;
import dev.langchain4j.agent.tool.ToolSpecification;
import dev.langchain4j.agent.tool.ToolExecutor;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import static dev.langchain4j.model.openai.OpenAiChatModel.builder;

// 定义AI Service接口
interface Assistant {
    String chat(String message);
}

// 创建天气工具实例
WeatherTool weatherTool = new WeatherTool();

// 创建工具规格
ToolSpecification weatherSpec = ToolSpecification.builder()
    .name("get_weather")
    .description("Get current weather for a city")
    .parameters("""
        {
            "type": "object",
            "properties": {
                "city": {
                    "type": "string",
                    "description": "City name"
                }
            },
            "required": ["city"]
        }
    }
    """)
    .build();

// 创建工具执行器
Map<String, Tool> tools = new HashMap<>();
tools.put("get_weather", weatherTool);

ToolExecutor executor = ToolExecutor.builder()
    .tools(tools)
    .build();

// 创建AI Service并注册工具
ChatLanguageModel model = builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .modelName("gpt-4")
    .build();

Assistant assistant = AiServices.builder(Assistant.class)
    .chatLanguageModel(model)
    .tools(executor)
    .build();

// 使用
String response = assistant.chat("北京今天天气怎么样？");
System.out.println(response);

// AI会自动调用get_weather工具，传入"北京"作为参数`;

  const agentImplementation = `import dev.langchain4j.service.AiServices;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.agent.tool.Tool;
import dev.langchain4j.agent.tool.ToolSpecification;
import dev.langchain4j.agent.tool.ToolExecutor;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import static dev.langchain4j.model.openai.OpenAiChatModel.builder;

// 定义多个工具
@Tool("search_web")
public class WebSearchTool {
    public String search(String query) {
        return "搜索结果：" + query;
    }
}

@Tool("calculate")
public class CalculatorTool {
    public double calculate(String operation, double a, double b) {
        return switch (operation) {
            case "add" -> a + b;
            case "subtract" -> a - b;
            case "multiply" -> a * b;
            default -> throw new IllegalArgumentException("Unknown operation");
        };
    }
}

@Tool("get_database")
public class DatabaseTool {
    public String query(String sql) {
        return "查询结果";
    }
}

// 定义Agent接口
interface ResearchAgent {
    String research(String topic);
}

// 创建工具Map
Map<String, Tool> toolMap = new HashMap<>();
toolMap.put("search_web", new WebSearchTool());
toolMap.put("calculate", new CalculatorTool());
toolMap.put("get_database", new DatabaseTool());

// 创建工具规格列表
List<ToolSpecification> toolSpecs = List.of(
    ToolSpecification.builder()
        .name("search_web")
        .description("Search the web for information")
        .build(),
    ToolSpecification.builder()
        .name("calculate")
        .description("Perform mathematical calculations")
        .build(),
    ToolSpecification.builder()
        .name("get_database")
        .description("Query the database")
        .build()
);

// 创建工具执行器
ToolExecutor executor = ToolExecutor.builder()
    .tools(toolMap)
    .build();

// 创建Agent
ChatLanguageModel model = builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .modelName("gpt-4")
    .temperature(0.0)  // 确定性决策
    .build();

ResearchAgent agent = AiServices.builder(ResearchAgent.class)
    .chatLanguageModel(model)
    .tools(executor)
    .build();

// Agent会自主决策、规划任务、调用工具
String result = agent.research("AI发展趋势");

System.out.println(result);

// AI可能依次调用：
// 1. search_web: 搜索"AI发展趋势"
// 2. get_database: 查询数据库中的相关信息
// 3. calculate: 计算和汇总数据
// 4. 整合结果并生成最终答案`;

  const multiToolScenario = `import dev.langchain4j.service.AiServices;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.agent.tool.Tool;
import dev.langchain4j.agent.tool.ToolExecutor;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import static dev.langchain4j.model.openai.OpenAiChatModel.builder;

// 定义订单管理工具
@Tool("get_order")
public class OrderTool {
    public String getOrder(String orderId) {
        // 实现订单查询逻辑
        return "订单号：" + orderId + "，状态：已发货";
    }
}

// 定义库存查询工具
@Tool("check_inventory")
public class InventoryTool {
    public boolean checkInventory(String productId) {
        // 实现库存检查逻辑
        return true;  // 简化示例
    }
}

// 定义价格计算工具
@Tool("calculate_price")
public class PricingTool {
    public double calculatePrice(String productId, int quantity) {
        // 实现价格计算逻辑
        return quantity * 99.99;  // 简化示例
    }
}

// 定义Customer Service接口
interface CustomerService {
    String handleCustomerRequest(String request);
}

// 创建AI Service并注册多个工具
Map<String, Tool> tools = new HashMap<>();
tools.put("get_order", new OrderTool());
tools.put("check_inventory", new InventoryTool());
tools.put("calculate_price", new PricingTool());

ToolExecutor executor = ToolExecutor.builder()
    .tools(tools)
    .build();

ChatLanguageModel model = builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .modelName("gpt-4")
    .build();

CustomerService service = AiServices.builder(CustomerService.class)
    .chatLanguageModel(model)
    .tools(executor)
    .build();

// AI会根据需要自动调用多个工具
String response = service.handleCustomerRequest("查询订单12345的库存和价格");

// AI可能依次调用：
// 1. get_order("12345")
// 2. check_inventory("product-123")
// 3. calculatePrice("product-123", 2)
// 4. 整合所有信息返回给用户`;

  const bestPractices = `import dev.langchain4j.agent.tool.Tool;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.agent.tool.ToolSpecification;
import dev.langchain4j.agent.tool.ToolExecutor;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import static dev.langchain4j.model.openai.OpenAiChatModel.builder;

// ✅ 好的工具设计
@Tool("good_search")
public class GoodSearchTool {
    
    /**
     * 搜索网络信息
     * @param query 搜索关键词
     * @return 搜索结果
     */
    public String search(String query) {
        if (query == null || query.trim().isEmpty()) {
            throw new IllegalArgumentException("Query cannot be empty");
        }
        
        // 参数验证
        if (query.length() > 500) {
            throw new IllegalArgumentException("Query too long");
        }
        
        // 实现搜索逻辑
        return "搜索结果：" + query;
    }
}

// ❌ 不好的工具设计
@Tool("bad_calculator")
public class BadCalculatorTool {
    
    /**
     * 计算器（有全局状态，线程不安全）
     */
    private int count = 0;  // ❌ 不好的设计
    
    public double calculate(String operation, double a, double b) {
        count++;  // 副作用
        return switch (operation) {
            case "add" -> a + b;
            case "subtract" -> a - b;
            case "multiply" -> a * b;
            default -> throw new IllegalArgumentException("Unknown operation");
        };
    }
}`;

  return (
    <Layout>
      <div className="page-tags">
        <Tag variant="indigo">Function Calling</Tag>
        <Tag variant="purple">工具调用</Tag>
        <Tag variant="green">智能体</Tag>
      </div>

      <h1 className="page-title">Function Calling</h1>
      <p className="page-description">
        深入理解LangChain4j的Function Calling机制，让AI能够调用Java方法，构建强大的智能体和自动化系统。
      </p>

      <nav className="toc-nav">
        <h3 className="toc-nav-title">目录</h3>
        <ol className="toc-list">
          <li className="toc-item"><span className="toc-number">1.</span> <a href="#概念概述" className="toc-link">概念概述</a></li>
          <li className="toc-item"><span className="toc-number">2.</span> <a href="#定义工具" className="toc-link">定义工具</a></li>
          <li className="toc-item"><span className="toc-number">3.</span> <a href="#集成到AiServices" className="toc-link">集成到AiServices</a></li>
          <li className="toc-item"><span className="toc-number">4.</span> <a href="#智能体架构" className="toc-link">智能体架构</a></li>
          <li className="toc-item"><span className="toc-number">5.</span> <a href="#应用场景" className="toc-link">应用场景</a></li>
          <li className="toc-item"><span className="toc-number">6.</span> <a href="#最佳实践" className="toc-link">最佳实践</a></li>
          <li className="toc-item"><span className="toc-number">7.</span> <a href="#常见问题" className="toc-link">常见问题</a></li>
        </ol>
      </nav>

      <section id="概念概述" className="content-section">
        <SectionHeader number={1} title="概念概述" />

        <h3 className="subsection-title">1.1 什么是Function Calling</h3>
        <p className="paragraph">
          Function Calling（函数调用）是LLM的高级能力，允许AI调用外部工具和API来执行实际操作。这使得AI不仅能生成文本，还能执行计算、查询数据库、调用API等操作。
        </p>

        <div className="info-card info-card-blue">
          <h4 className="card-title-blue">核心价值</h4>
          <ul className="list-styled list-blue">
            <li><strong>扩展能力</strong>：AI不再局限于文本生成，可以执行实际操作</li>
            <li><strong>数据集成</strong>：连接实时数据源，获取最新信息</li>
            <li><strong>自动化</strong>：构建能够自动完成复杂任务的智能系统</li>
            <li><strong>交互性</strong>：AI可以与外部世界进行双向交互</li>
            <li><strong>灵活性</strong>：根据场景动态选择合适的工具</li>
          </ul>
        </div>

        <h3 className="subsection-title mt-6">1.2 Function Calling 工作流程</h3>
        <p className="paragraph mb-4">
          Function Calling 是一个多步骤的交互过程，涉及用户、LLM 和工具之间的协同工作。
        </p>

        <MermaidChart chart={`
          sequenceDiagram
              participant User as 👤 用户
              participant LLM as 🤖 LLM
              participant Tool as 🔧 工具
              participant System as 💻 系统

              User->>LLM: "今天北京天气怎么样？"
              LLM->>LLM: 分析意图，识别需要工具
              LLM->>System: 调用 get_weather 工具
              System->>Tool: 执行工具方法
              Tool->>System: 返回结果
              System->>LLM: 传递工具结果
              LLM->>LLM: 整合信息生成回答
              LLM->>User: "北京今天天气：晴天，温度25°C"

              Note over LLM,Tool: 整个过程对用户透明
        `} />

        <h3 className="subsection-title">1.2 工作流程</h3>
        <p className="paragraph">
          Function Calling的完整工作流程：
        </p>

        <div className="info-card info-card-purple">
          <h4 className="card-title-purple">Function Calling流程</h4>
          <ol className="list-decimal list-styled">
            <li><strong>定义工具</strong>：使用@Tool注解定义可被调用的方法</li>
            <li><strong>注册工具</strong>：通过ToolExecutor注册工具实例</li>
            <li><strong>生成工具规格</strong>：创建ToolSpecification描述工具参数和功能</li>
            <li><strong>AI决策</strong>：LLM根据用户输入决定何时调用哪个工具</li>
            <li><strong>执行工具</strong>：调用对应的方法并获取返回值</li>
            <li><strong>整合结果</strong>：将工具返回值整合到最终答案中</li>
            <li><strong>用户反馈</strong>：将工具执行结果展示给用户</li>
          </ol>
        </div>
      </section>

      <section id="定义工具" className="content-section">
        <SectionHeader number={2} title="定义工具" />

        <h3 className="subsection-title">2.1 使用@Tool注解</h3>
        <p className="paragraph">
          使用@Tool注解将Java方法标记为可被AI调用的工具：
        </p>

        <CodeBlockWithCopy language="java" filename="WeatherTool.java" code={toolDefinition} />

        <TipBox type="info" title="@Tool注解说明">
          <ul className="tip-box-list">
            <li><strong>工具名称</strong>：@Tool("tool_name")指定唯一标识符</li>
            <li><strong>参数验证</strong>：工具方法可以添加参数验证逻辑</li>
            <li><strong>返回类型</strong>：返回值会被整合到AI响应中</li>
            <li><strong>错误处理</strong>：工具方法应该有良好的异常处理</li>
            <li><strong>幂等性</strong>：相同输入多次调用应返回相同结果</li>
            <li><strong>文档注释</strong>：为工具添加清晰的JavaDoc注释</li>
          </ul>
        </TipBox>
      </section>

      <section id="集成到AiServices" className="content-section">
        <SectionHeader number={3} title="集成到AiServices" />

        <h3 className="subsection-title">3.1 基础集成</h3>
        <p className="paragraph">
          将工具集成到AiServices中，让AI自动调用：
        </p>

        <CodeBlockWithCopy language="java" filename="AiServiceIntegration.java" code={aiServiceIntegration} />

        <TipBox type="success" title="集成优势">
          <ul className="tip-box-list">
            <li><strong>声明式设计</strong>：只需定义接口，框架自动生成实现</li>
            <li><strong>自动决策</strong>：AI自动决定何时调用哪个工具</li>
            <li><strong>多工具支持</strong>：可以注册多个工具，AI灵活选择</li>
            <li><strong>类型安全</strong>：工具返回值自动转换为正确类型</li>
            <li><strong>错误处理</strong>：工具执行失败会反映到AI响应中</li>
            <li><strong>易于测试</strong>：可以轻松mock工具进行单元测试</li>
          </ul>
        </TipBox>

        <h3 className="subsection-title">3.2 多个工具场景</h3>
        <p className="paragraph">
          在实际应用中，往往需要多个工具协同工作：
        </p>

        <CodeBlockWithCopy language="java" filename="MultiToolScenario.java" code={multiToolScenario} />

        <div className="info-card info-card-green">
          <h4 className="card-title-green">多工具工作流程</h4>
          <ol className="list-decimal list-styled">
            <li><strong>任务理解</strong>：AI分析用户请求，识别需要哪些工具</li>
            <li><strong>工具规划</strong>：决定调用顺序和依赖关系</li>
            <li><strong>顺序执行</strong>：依次调用相关工具，传递中间结果</li>
            <li><strong>结果整合</strong>：将多个工具的输出整合为连贯的答案</li>
            <li><strong>错误恢复</strong>：某个工具失败时的处理策略</li>
            <li><strong>优化调整</strong>：根据执行结果动态调整计划</li>
          </ol>
        </div>
      </section>

      <section id="智能体架构" className="content-section">
        <SectionHeader number={4} title="智能体架构" />

        <h3 className="subsection-title">4.1 Agent概念</h3>
        <p className="paragraph">
          Agent（智能体）是具有工具调用能力的AI系统，它可以自主决策、规划任务、调用工具并整合结果，形成更强大的应用。
        </p>

        <div className="info-card info-card-indigo">
          <h4 className="card-title-indigo">Agent核心能力</h4>
          <ul className="list-styled list-indigo">
            <li><strong>自主决策</strong>：根据任务目标自主选择工具和策略</li>
            <li><strong>任务规划</strong>：将复杂任务拆解为多个子任务</li>
            <li><strong>多轮交互</strong>：可以与用户进行多轮对话，逐步完成任务</li>
            <li><strong>上下文记忆</strong>：记住对话历史和中间结果</li>
            <li><strong>反思优化</strong>：根据执行结果调整策略，提高效率</li>
            <li><strong>工具协调</strong>：智能调度多个工具，避免冲突</li>
            <li><strong>学习能力</strong>：从执行中学习，优化未来的决策</li>
          </ul>
        </div>

        <h3 className="subsection-title">4.2 Agent实现</h3>
        <p className="paragraph">
          使用AiServices构建Agent：
        </p>

        <CodeBlockWithCopy language="java" filename="AgentImplementation.java" code={agentImplementation} />

        <TipBox type="warning" title="Agent设计要点">
          <ul className="tip-box-list">
            <li><strong>确定性参数</strong>：对于确定性任务，降低temperature提高稳定性</li>
            <li><strong>清晰的角色定义</strong>：明确Agent的能力和限制</li>
            <li><strong>工具隔离</strong>：每个工具职责单一，易于测试和维护</li>
            <li><strong>错误边界</strong>：定义Agent的能力边界，避免超出范围的调用</li>
            <li><strong>日志记录</strong>：记录决策过程，便于调试和分析</li>
            <li><strong>用户控制</strong>：提供用户中断或调整Agent行为的能力</li>
            <li><strong>监控机制</strong>：监控Agent的性能和资源使用</li>
          </ul>
        </TipBox>
      </section>

      <section id="应用场景" className="content-section">
        <SectionHeader number={5} title="应用场景" />

        <div className="grid-2col">
          <div className="card">
            <h4 className="card-title">🔍 信息查询</h4>
            <p className="card-description">搜索网络、查询数据库、获取实时数据</p>
            <ul className="list-styled">
              <li>天气查询、股票行情、汇率转换</li>
              <li>数据库查询、缓存查询、API数据获取</li>
              <li>实时数据、地理位置、时间查询、设备状态</li>
            </ul>
          </div>
          <div className="card">
            <h4 className="card-title">📝 文档处理</h4>
            <p className="card-description">读写文件、生成报告、格式转换、数据提取</p>
            <ul className="list-styled">
              <li>创建、读取、更新、删除文件</li>
              <li>生成PDF、Word、Excel报告</li>
              <li>文件格式转换（PDF转Word、图片OCR）</li>
              <li>数据提取和清洗、表单解析、合同分析</li>
            </ul>
          </div>
          <div className="card">
            <h4 className="card-title">💻️ 计算操作</h4>
            <p className="card-description">数学计算、日期计算、统计分析</p>
            <ul className="list-styled">
              <li>基本运算、复杂公式计算、统计分析</li>
              <li>日期计算、时间转换、时区处理</li>
              <li>财务计算、投资回报率、风险评估</li>
              <li>科学计算、单位转换、数据可视化</li>
            </ul>
          </div>
          <div className="card">
            <h4 className="card-title">🤖 系统集成</h4>
            <p className="card-description">调用外部API、执行系统操作、数据库CRUD</p>
            <ul className="list-styled">
              <li>发送邮件、调用Webhook、HTTP API调用</li>
              <li>数据库操作、查询、插入、更新、删除记录</li>
              <li>系统命令、进程管理、文件操作</li>
              <li>认证授权、权限验证、用户管理</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="最佳实践" className="content-section">
        <SectionHeader number={6} title="最佳实践" />

        <h3 className="subsection-title">6.1 工具设计原则</h3>
        <p className="paragraph">
          设计高质量的工具是成功的关键：
        </p>

        <CodeBlockWithCopy language="java" filename="ToolBestPractices.java" code={bestPractices} />

        <div className="info-card info-card-purple">
          <h4 className="card-title-purple">设计原则对比</h4>
          <table className="styled-table">
            <thead>
              <tr>
                <th>原则</th>
                <th>✅ 好做法</th>
                <th>❌ 不好的做法</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>单一职责</td>
                <td>一个工具只做一件事</td>
                <td>一个工具做多个功能，混乱难测</td>
              </tr>
              <tr>
                <td>参数验证</td>
                <td>添加清晰的参数验证</td>
                <td>没有验证或验证不充分</td>
              </tr>
              <tr>
                <td>错误处理</td>
                <td>捕获异常并返回友好错误</td>
                <td>吞没异常或返回模糊错误</td>
              </tr>
              <tr>
                <td>幂等性</td>
                <td>相同输入返回相同结果</td>
                <td>使用全局状态导致结果不一致</td>
              </tr>
              <tr>
                <td>文档完善</td>
                <td>提供清晰的JavaDoc和使用示例</td>
                <td>文档不清晰或没有示例</td>
              </tr>
              <tr>
                <td>线程安全</td>
                <td>无共享状态或不可变对象</td>
                <td>使用可变状态，并发不安全</td>
              </tr>
            </tbody>
          </table>
        </div>

        <TipBox type="success" title="设计要点">
          <ul className="tip-box-list">
            <li><strong>清晰描述</strong>：工具功能、参数、返回值都有清晰说明</li>
            <li><strong>示例代码</strong>：提供使用示例，降低学习成本</li>
            <li><strong>边界条件</strong>：明确工具的适用范围和限制</li>
            <li><strong>测试覆盖</strong>：提供单元测试和集成测试</li>
            <li><strong>性能考虑</strong>：工具的执行时间和资源消耗</li>
            <li><strong>安全性</strong>：参数验证、权限控制、敏感信息保护</li>
          </ul>
        </TipBox>
      </section>

      <section id="常见问题" className="content-section">
        <SectionHeader number={7} title="常见问题" />

        <div className="faq-section">
          <div className="faq-item">
            <h4 className="faq-question">Q: AI 不调用工具怎么办？</h4>
            <div className="faq-answer">
              <p>可能的原因和解决方案：</p>
              <ul className="tip-box-list">
                <li><strong>Prompt 不清晰</strong>：prompt 中没有明确说明需要调用工具</li>
                <li><strong>工具规格缺失</strong>：ToolSpecification 描述不完整或缺少参数</li>
                <li><strong>参数不匹配</strong>：工具参数与用户提供的信息不一致</li>
                <li><strong>工具不可用</strong>：工具服务故障或超时</li>
                <li><strong>权限问题</strong>：AI 没有权限调用该工具</li>
                <li><strong>解决方案</strong>：优化 prompt、检查工具配置、添加示例引导</li>
              </ul>
            </div>
          </div>

          <div className="faq-item">
            <h4 className="faq-question">Q: 如何调试工具调用？</h4>
            <div className="faq-answer">
              <p>调试方法：</p>
              <ul className="tip-box-list">
                <li>启用详细日志记录工具调用过程</li>
                <li>在工具方法中添加日志语句</li>
                <li>检查 ToolSpecification 是否正确</li>
                <li>使用低 temperature 提高 AI 决策确定性</li>
                <li>单独测试工具，验证逻辑正确性</li>
                <li>分析 AI 的决策日志，理解调用逻辑</li>
              </ul>
            </div>
          </div>

          <div className="faq-item">
            <h4 className="faq-question">Q: 工具调用失败如何重试？</h4>
            <div className="faq-answer">
              <p>重试策略：</p>
              <ul className="tip-box-list">
                <li>检测工具调用失败的异常类型</li>
                <li>对于临时性错误（超时、网络问题）实现指数退避重试</li>
                <li>对于永久性错误（权限不足、参数错误）不重试</li>
                <li>设置最大重试次数和总超时时间</li>
                <li>记录重试历史，便于分析问题模式</li>
                <li>提供用户手动重试的选项</li>
              </ul>
            </div>
          </div>

          <div className="faq-item">
            <h4 className="faq-question">Q: 如何优化工具调用性能？</h4>
            <div className="faq-answer">
              <p>优化策略：</p>
              <ul className="tip-box-list">
                <li><strong>批量处理</strong>：如果可能，将多个请求合并为一次工具调用</li>
                <li><strong>并行执行</strong>：对于独立的工具调用，使用多线程并行执行</li>
                <li><strong>结果缓存</strong>：缓存相同输入的工具调用结果</li>
                <li><strong>异步调用</strong>：使用异步 API 避免阻塞</li>
                <li><strong>连接池</strong>：复用 HTTP 连接减少建立开销</li>
                <li><strong>超时设置</strong>：为工具调用设置合理的超时时间</li>
                <li><strong>工具优化</strong>：优化工具本身性能，减少执行时间</li>
              </ul>
            </div>
          </div>

          <div className="faq-item">
            <h4 className="faq-question">Q: Agent 如何处理工具冲突？</h4>
            <div className="faq-answer">
              <p>冲突处理策略：</p>
              <ul className="tip-box-list">
                <li><strong>工具依赖分析</strong>：识别工具之间的依赖关系</li>
                <li><strong>调度策略</strong>：按照依赖顺序串行调用，或并行调用独立工具</li>
                <li><strong>资源锁定</strong>：对于有状态的工具，确保原子性操作</li>
                <li><strong>冲突检测</strong>：检测潜在的冲突情况（如重复写操作）</li>
                <li><strong>事务管理</strong>：对于数据库操作，使用事务保证一致性</li>
                <li><strong>超时处理</strong>：设置合理的超时，避免无限等待</li>
                <li><strong>错误恢复</strong>：某个工具失败时的降级方案</li>
              </ul>
            </div>
          </div>

          <div className="faq-item">
            <h4 className="faq-question">Q: 工具调用安全注意事项？</h4>
            <div className="faq-answer">
              <p>安全要点：</p>
              <ul className="tip-box-list">
                <li><strong>输入验证</strong>：严格验证所有工具输入参数，防止注入攻击</li>
                <li><strong>权限控制</strong>：工具内部实现权限检查，限制可执行的操作</li>
                <li><strong>数据加密</strong>：敏感数据在传输和存储时加密</li>
                <li><strong>审计日志</strong>：记录关键操作，便于事后审计</li>
                <li><strong>资源限制</strong>：限制工具的资源使用（CPU、内存、网络）</li>
                <li><strong>敏感信息过滤</strong>：避免在日志和错误消息中泄露敏感信息</li>
                <li><strong>最小权限原则</strong>：工具只授予完成任务所需的最小权限</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <SummarySection
        description="本节深入讲解了LangChain4j的Function Calling功能："
        items={[
          '<strong>概念概述</strong>：Function Calling原理、工作流程、核心价值',
          '<strong>工具定义</strong>：@Tool注解、ToolSpecification、参数验证',
          '<strong>AiServices集成</strong>：声明式接口、自动决策、多工具支持',
          '<strong>智能体架构</strong>：Agent设计、自主决策、任务规划、上下文记忆',
          '<strong>应用场景</strong>：信息查询、文档处理、计算操作、系统集成',
          '<strong>最佳实践</strong>：工具设计原则、调试方法、性能优化、安全注意事项',
          '<strong>常见问题</strong>：工具调用失败处理、调试方法、重试策略、冲突处理、安全要点',
        ]}
        footer="🎉 恭喜你完成了所有核心页面的学习！网站内容已全面补充完成。继续学习其他高级主题，探索RAG完整指南和实战示例。"
      />
    </Layout>
  );
};

export default FunctionCallingPage;
