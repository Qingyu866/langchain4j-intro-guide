import Layout from '../components/layout/Layout';
import { Tag, CodeBlockWithCopy, SectionHeader, TipBox, SummarySection } from '../components/ui';

const CoreConceptsPage = () => {
  const chatModelBasic = `import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.data.message.AiMessage;
import java.util.List;

// 创建ChatLanguageModel
ChatLanguageModel model = OpenAiChatModel.builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .modelName("gpt-4")
    .temperature(0.7)
    .maxTokens(1000)
    .build();

// 生成响应
String response = model.generate("Hello, LangChain4j!");
System.out.println(response);`;

  const chatModelAdvanced = `import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import java.util.List;

ChatLanguageModel model = OpenAiChatModel.builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .modelName("gpt-4")
    // 温度参数：控制随机性，0.0-2.0
    .temperature(0.7)
    // 最大token数：限制响应长度
    .maxTokens(2000)
    // 超时设置（毫秒）
    .timeout(30000)
    // Top-P采样：0.0-1.0
    .topP(0.9)
    // 频率惩罚
    .frequencyPenalty(0.5)
    .build();

// 生成带系统消息的响应
AiMessage systemMessage = SystemMessage.from("You are a helpful assistant.");
AiMessage userMessage = UserMessage.from("Explain quantum computing.");

List<AiMessage> messages = List.of(systemMessage, userMessage);
String response = model.generate(messages);`;

  const aiServicesBasic = `import dev.langchain4j.service.AiServices;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import static dev.langchain4j.model.openai.OpenAiChatModel.builder;

// 定义AI Service接口
interface Assistant {
    String chat(String message);
}

// 创建ChatLanguageModel
ChatLanguageModel model = builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .build();

// 构建AI Service
Assistant assistant = AiServices.builder(Assistant.class)
    .chatLanguageModel(model)
    .build();

// 使用
String response = assistant.chat("Hello!");
System.out.println(response);`;

  const aiServicesAdvanced = `import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;
import static dev.langchain4j.model.openai.OpenAiChatModel.builder;

interface Translator {
    @SystemMessage("You are a professional translator.")
    @UserMessage("Translate to {{language}}: {{text}}")
    String translate(
        @V("text") String text,
        @V("language") String language
    );
}

interface SentimentAnalyzer {
    @UserMessage("Analyze sentiment of: {{it}}")
    Sentiment analyzeSentiment(String text);
}

enum Sentiment {
    POSITIVE, NEUTRAL, NEGATIVE
}

ChatLanguageModel model = builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .build();

// 创建不同的AI Services
Translator translator = AiServices.builder(Translator.class)
    .chatLanguageModel(model)
    .build();

SentimentAnalyzer analyzer = AiServices.builder(SentimentAnalyzer.class)
    .chatLanguageModel(model)
    .build();

// 使用
String translation = translator.translate("Hello, world!", "Spanish");
Sentiment sentiment = analyzer.analyzeSentiment("I love LangChain4j!");

System.out.println("Translation: " + translation);
System.out.println("Sentiment: " + sentiment);`;

  const chatMemoryTypes = `import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.memory.chat.TokenWindowChatMemory;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import java.util.List;

ChatLanguageModel model = builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .build();

// 方式1：MessageWindowChatMemory - 保留最近N条消息
MessageWindowChatMemory memory1 = MessageWindowChatMemory.builder()
    .maxMessages(10)  // 保留最近10条
    .id("user-123")  // 用户ID
    .build();

// 方式2：TokenWindowChatMemory - 基于token数量管理
TokenWindowChatMemory memory2 = TokenWindowChatMemory.builder()
    .maxTokens(2000)  // 最多2000个token
    .id("user-123")
    .build();

// 在AI Service中使用
interface ChatBot {
    String chat(@MemoryId String userId, String message);
}

ChatBot bot = AiServices.builder(ChatBot.class)
    .chatLanguageModel(model)
    .chatMemoryProvider(userId -> memory1)  // 为每个用户创建独立的memory
    .build();

// 使用
bot.chat("user-123", "Hello!");  // 使用memory1
bot.chat("user-456", "Hi there!");  // 使用新的memory`;

  const streamingExample = `import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.model.chat.StreamingResponseHandler;
import dev.langchain4j.data.message.AiMessage;
import static dev.langchain4j.model.openai.OpenAiChatModel.builder;

// 创建StreamingChatModel
StreamingChatModel model = builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .modelName("gpt-4")
    .build();

// 使用流式响应
model.generate("Tell me a story about AI.", new StreamingResponseHandler() {
    @Override
    public void onPartialResponse(String partialResponse) {
        // 接收部分响应（token流）
        System.out.print(partialResponse);  // 逐步输出
    }

    @Override
    public void onCompleteResponse(String completeResponse) {
        // 响应完成
        System.out.println("\\n--- COMPLETE ---");
    }

    @Override
    public void onError(Throwable error) {
        // 错误处理
        System.err.println("Error: " + error.getMessage());
    }
});`;

  const toolsExample = `import dev.langchain4j.service.AiServices;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.service.tool.Tool;
import dev.langchain4j.service.tool.ToolExecutor;
import static dev.langchain4j.model.openai.OpenAiChatModel.builder;

// 定义工具
@Tool("get_weather")  // 工具名称
public String getWeather(String location) {
    // 获取天气的API调用
    return "Weather in " + location + ": 25°C, sunny";
}

@Tool("calculate")
public int calculate(int a, String operation, int b) {
    return switch (operation) {
        case "add" -> a + b;
        case "subtract" -> a - b;
        case "multiply" -> a * b;
        default -> throw new IllegalArgumentException("Unknown operation");
    };
}

// 创建AI Service
interface Assistant {
    String chat(String message);
}

ChatLanguageModel model = builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .build();

// 构建AI Service并注册工具
Assistant assistant = AiServices.builder(Assistant.class)
    .chatLanguageModel(model)
    .tools(
        ToolSpecification.builder()
            .name("get_weather")
            .description("Get current weather for a location")
            .parameters("""
                {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "City name"
                        }
                    },
                    "required": ["location"]
                }
                """)
            .build(),
        ToolSpecification.builder()
            .name("calculate")
            .description("Perform mathematical calculations")
            .parameters(...)
            .build()
    )
    .build();

// AI会自动调用这些工具
String response = assistant.chat("What's the weather in Beijing and add 5 and 3?");`;

  return (
    <Layout>
      <div className="page-tags">
        <Tag variant="indigo">核心概念</Tag>
        <Tag variant="purple">设计哲学</Tag>
        <Tag variant="green">架构理解</Tag>
      </div>

      <h1 className="page-title">核心概念</h1>
      <p className="page-description">
        深入理解 LangChain4j 的核心概念，掌握框架的设计哲学和基础架构。
      </p>

      <nav className="toc-nav">
        <h3 className="toc-nav-title">目录</h3>
        <ol className="toc-list">
          <li className="toc-item"><span className="toc-number">1.</span> <a href="#ChatLanguageModel" className="toc-link">ChatLanguageModel</a></li>
          <li className="toc-item"><span className="toc-number">2.</span> <a href="#AiServices" className="toc-link">AiServices</a></li>
          <li className="toc-item"><span className="toc-number">3.</span> <a href="#ChatMemory" className="toc-link">ChatMemory</a></li>
          <li className="toc-item"><span className="toc-number">4.</span> <a href="#Streaming响应" className="toc-link">Streaming响应</a></li>
          <li className="toc-item"><span className="toc-number">5.</span> <a href="#工具调用" className="toc-link">工具调用</a></li>
        </ol>
      </nav>

      <section id="ChatLanguageModel" className="content-section">
        <SectionHeader number={1} title="ChatLanguageModel" />

        <h3 className="subsection-title">1.1 接口概述</h3>
        <p className="paragraph">
          ChatLanguageModel是LangChain4j与LLM交互的核心接口，提供了统一的API来调用不同的语言模型提供商。
        </p>

        <div className="info-card info-card-blue">
          <h4 className="card-title-blue">核心特性</h4>
          <ul className="list-styled list-blue">
            <li><strong>统一接口</strong>：支持20+ LLM提供商，切换模型无需改代码</li>
            <li><strong>简化调用</strong>：通过generate()方法即可生成响应</li>
            <li><strong>消息管理</strong>：支持单条和多条消息输入</li>
            <li><strong>流式响应</strong>：支持Token流式输出</li>
            <li><strong>配置灵活</strong>：提供丰富的配置选项</li>
          </ul>
        </div>

        <h3 className="subsection-title">1.2 基础用法</h3>
        <p className="paragraph">
          最简单的使用方式：
        </p>

        <CodeBlockWithCopy language="java" filename="BasicChatModelExample.java" code={chatModelBasic} />

        <TipBox type="tip" title="Builder模式优势">
          <ul className="tip-box-list">
            <li><strong>链式调用</strong>：代码更清晰易读</li>
            <li><strong>可选参数</strong>：所有配置都有合理的默认值</li>
            <li><strong>类型安全</strong>：编译时检查配置参数</li>
          </ul>
        </TipBox>

        <h3 className="subsection-title">1.3 高级配置</h3>
        <p className="paragraph">
          通过Builder模式可以配置更多参数：
        </p>

        <CodeBlockWithCopy language="java" filename="AdvancedChatModelExample.java" code={chatModelAdvanced} />

        <div className="info-card info-card-green">
          <h4 className="card-title-green">常用配置参数</h4>
          <table className="styled-table">
            <thead>
              <tr>
                <th>参数</th>
                <th>类型</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>temperature</td>
                <td>double</td>
                <td>0.0-2.0，控制随机性，值越低越确定</td>
              </tr>
              <tr>
                <td>maxTokens</td>
                <td>Integer</td>
                <td>最大生成的token数</td>
              </tr>
              <tr>
                <td>timeout</td>
                <td>Duration</td>
                <td>请求超时时间</td>
              </tr>
              <tr>
                <td>topP</td>
                <td>double</td>
                <td>0.0-1.0，控制采样范围</td>
              </tr>
              <tr>
                <td>frequencyPenalty</td>
                <td>double</td>
                <td>降低重复内容</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="AiServices" className="content-section">
        <SectionHeader number={2} title="AiServices" />

        <h3 className="subsection-title">2.1 声明式接口设计</h3>
        <p className="paragraph">
          AiServices是LangChain4j最强大的特性之一，通过声明式接口大幅简化AI应用开发。类似于Spring Data JPA，你只需要定义接口，框架自动提供实现。
        </p>

        <CodeBlockWithCopy language="java" filename="AiServicesBasicExample.java" code={aiServicesBasic} />

        <TipBox type="success" title="设计理念">
          <ul className="tip-box-list">
            <li><strong>关注接口</strong>：只需定义"要做什么"，无需关心"怎么做"</li>
            <li><strong>类型安全</strong>：编译时检查方法签名</li>
            <li><strong>自动实现</strong>：框架自动生成接口实现代码</li>
            <li><strong>易于测试</strong>：接口可以轻松mock进行单元测试</li>
          </ul>
        </TipBox>

        <h3 className="subsection-title">2.2 注解详解</h3>
        <p className="paragraph">
          AiServices支持多种注解来定制行为：
        </p>

        <CodeBlockWithCopy language="java" filename="AiServicesAdvancedExample.java" code={aiServicesAdvanced} />

        <div className="info-card info-card-purple">
          <h4 className="card-title-purple">主要注解</h4>
          <table className="styled-table">
            <thead>
              <tr>
                <th>注解</th>
                <th>用途</th>
                <th>示例</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>@SystemMessage</td>
                <td>定义系统角色和全局指令</td>
                <td>"You are a helpful assistant."</td>
              </tr>
              <tr>
                <td>@UserMessage</td>
                <td>定义用户消息模板</td>
                <td>"Translate to {"{{language}}"}: {"{{text}}"}"</td>
              </tr>
              <tr>
                <td>@V</td>
                <td>将方法参数绑定到模板变量</td>
                <td>@V("text") String text</td>
              </tr>
              <tr>
                <td>@MemoryId</td>
                <td>标识会话ID，用于多用户场景</td>
                <td>@MemoryId String userId</td>
              </tr>
              <tr>
                <td>@Moderate</td>
                <td>自动审核AI输出的内容</td>
                <td>@Moderate String chat(String msg)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="subsection-title">2.3 方法返回类型</h3>
        <p className="paragraph">
          AiService方法支持多种返回类型：
        </p>

        <div className="grid-3col">
          <div className="card-blue">
            <h4 className="card-title-blue">String</h4>
            <p className="card-description-blue">纯文本响应</p>
            <div className="code-inline">String chat(String message)</div>
          </div>
          <div className="card-blue">
            <h4 className="card-title-blue">Enum</h4>
            <p className="card-description-blue">分类任务</p>
            <div className="code-inline">Sentiment analyze(String text)</div>
          </div>
          <div className="card-blue">
            <h4 className="card-title-blue">POJO</h4>
            <p className="card-description-blue">结构化数据提取</p>
            <div className="code-inline">User extract(String text)</div>
          </div>
          <div className="card-green">
            <h4 className="card-title-green">List&lt;String&gt;</h4>
            <p className="card-description-green">列表输出</p>
            <div className="code-inline">List&lt;String&gt; listItems(String topic)</div>
          </div>
          <div className="card-green">
            <h4 className="card-title-green">Result&lt;T&gt;</h4>
            <p className="card-description-green">访问元数据和Token使用</p>
            <div className="code-inline">Result&lt;String&gt; chat(String msg)</div>
          </div>
          <div className="card-purple">
            <h4 className="card-title-purple">TokenStream</h4>
            <p className="card-description-purple">流式响应</p>
            <div className="code-inline">TokenStream stream(String msg)</div>
          </div>
        </div>
      </section>

      <section id="ChatMemory" className="content-section">
        <SectionHeader number={3} title="ChatMemory" />

        <h3 className="subsection-title">3.1 为什么需要ChatMemory</h3>
        <p className="paragraph">
          ChatMemory用于管理对话历史，实现多轮对话。没有ChatMemory时，每次调用都是独立的，LLM无法记住之前的对话内容。
        </p>

        <div className="info-card info-card-indigo">
          <h4 className="card-title-indigo">ChatMemory的作用</h4>
          <ul className="list-styled list-indigo">
            <li><strong>上下文保持</strong>：让LLM记住对话历史</li>
            <li><strong>多轮对话</strong>：支持连续的问答交互</li>
            <li><strong>用户隔离</strong>：不同用户的对话互不干扰</li>
            <li><strong>Token优化</strong>：只发送必要的历史消息，控制成本</li>
          </ul>
        </div>

        <h3 className="subsection-title">3.2 内存实现类型</h3>
        <p className="paragraph">
          LangChain4j提供多种ChatMemory实现，根据不同场景选择：
        </p>

        <CodeBlockWithCopy language="java" filename="ChatMemoryTypesExample.java" code={chatMemoryTypes} />

        <div className="info-card info-card-green">
          <h4 className="card-title-green">内存类型对比</h4>
          <table className="styled-table">
            <thead>
              <tr>
                <th>类型</th>
                <th>管理方式</th>
                <th>适用场景</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>MessageWindowChatMemory</td>
                <td>保留最近N条消息</td>
                <td>需要精确控制历史长度</td>
              </tr>
              <tr>
                <td>TokenWindowChatMemory</td>
                <td>基于token数量管理</td>
                <td>需要控制Token使用量</td>
              </tr>
              <tr>
                <td>ChatMemoryProvider</td>
                <td>工厂模式，支持持久化</td>
                <td>多用户、需要数据库存储</td>
              </tr>
            </tbody>
          </table>
        </div>

        <TipBox type="info" title="最佳实践">
          <ul className="tip-box-list">
            <li><strong>合理设置窗口大小</strong>：太小会丢失上下文，太大会增加成本</li>
            <li><strong>清理策略</strong>：定期清理过期的对话历史</li>
            <li><strong>持久化</strong>：生产环境使用数据库存储历史</li>
            <li><strong>内存清理</strong>：提供清除对话历史的功能</li>
          </ul>
        </TipBox>
      </section>

      <section id="Streaming响应" className="content-section">
        <SectionHeader number={4} title="Streaming响应" />

        <h3 className="subsection-title">4.1 什么是流式响应</h3>
        <p className="paragraph">
          Streaming响应允许你逐步接收LLM的输出，而不是等待整个响应完成。这对于实时交互和长文本生成特别有用。
        </p>

        <div className="info-card info-card-purple">
          <h4 className="card-title-purple">优势</h4>
          <ul className="list-styled list-purple">
            <li><strong>实时反馈</strong>：用户可以立即看到输出，无需等待完整响应</li>
            <li><strong>降低延迟</strong>：第一个token快速返回，提升用户体验</li>
            <li><strong>中断能力</strong>：用户可以在响应过程中停止生成</li>
            <li><strong>成本可视化</strong>：可以看到实际token使用量</li>
          </ul>
        </div>

        <h3 className="subsection-title">4.2 StreamingChatModel使用</h3>
        <p className="paragraph">
          使用StreamingChatModel和StreamingResponseHandler实现流式响应：
        </p>

        <CodeBlockWithCopy language="java" filename="StreamingExample.java" code={streamingExample} />

        <TipBox type="warning" title="注意事项">
          <ul className="tip-box-list">
            <li><strong>非阻塞</strong>：StreamingResponseHandler的回调是异步的</li>
            <li><strong>错误处理</strong>：必须实现onError方法处理异常</li>
            <li><strong>状态管理</strong>：流式响应需要管理生成状态（开始、进行中、完成）</li>
            <li><strong>前端集成</strong>：Web应用需要使用Server-Sent Events或WebSocket传输流</li>
          </ul>
        </TipBox>
      </section>

      <section id="工具调用" className="content-section">
        <SectionHeader number={5} title="工具调用" />

        <h3 className="subsection-title">5.1 Function Calling概述</h3>
        <p className="paragraph">
          Function Calling（工具调用）是LLM的高级能力，允许AI调用外部工具/函数来执行实际操作。这使得AI不仅能生成文本，还能执行计算、查询数据库、调用API等操作。
        </p>

        <div className="info-card info-card-blue">
          <h4 className="card-title-blue">应用场景</h4>
          <ul className="list-styled list-blue">
            <li><strong>实时数据查询</strong>：查询天气、股票、汇率等实时信息</li>
            <li><strong>计算操作</strong>：执行数学计算、日期转换等</li>
            <li><strong>数据库操作</strong>：查询、更新数据库记录</li>
            <li><strong>API调用</strong>：调用外部服务（发送邮件、创建订单）</li>
            <li><strong>文件系统操作</strong>：读写文件、搜索文件</li>
          </ul>
        </div>

        <h3 className="subsection-title">5.2 定义工具</h3>
        <p className="paragraph">
          使用@Tool注解定义工具：
        </p>

        <CodeBlockWithCopy language="java" filename="ToolsExample.java" code={toolsExample} />

        <TipBox type="success" title="工具定义要点">
          <ul className="tip-box-list">
            <li><strong>清晰名称</strong>：工具名称要简洁描述性强</li>
            <li><strong>详细描述</strong>：帮助LLM理解工具的用途</li>
            <li><strong>参数定义</strong>：明确参数类型、是否必需、默认值</li>
            <li><strong>返回值</strong>：返回结构化数据（字符串、JSON、POJO）</li>
            <li><strong>错误处理</strong>：工具内部要有良好的异常处理</li>
          </ul>
        </TipBox>

        <h3 className="subsection-title">5.3 Agent实现</h3>
        <p className="paragraph">
          Agent是具有工具调用能力的AI系统，它可以自主决定何时使用哪些工具，并协调多个工具完成任务。
        </p>

        <div className="info-card info-card-green">
          <h4 className="card-title-green">Agent工作流程</h4>
          <ol className="list-decimal list-styled">
            <li><strong>理解任务</strong>：解析用户的请求和意图</li>
            <li><strong>规划步骤</strong>：决定需要哪些工具以及调用顺序</li>
            <li><strong>执行工具</strong>：按顺序调用必要的工具</li>
            <li><strong>整合结果</strong>：将多个工具的输出整合为最终答案</li>
            <li><strong>持续优化</strong>：根据结果调整策略，可能需要多轮调用</li>
          </ol>
        </div>

        <TipBox type="info" title="Agent最佳实践">
          <ul className="tip-box-list">
            <li><strong>工具分离</strong>：每个工具职责单一，易于测试和维护</li>
            <li><strong>权限控制</strong>：限制Agent可以访问的工具和资源</li>
            <li><strong>日志记录</strong>：记录工具调用历史，便于调试和审计</li>
            <li><strong>超时设置</strong>：为工具调用设置合理的超时时间</li>
            <li><strong>重试机制</strong>：对于失败的工具调用实现重试</li>
          </ul>
        </TipBox>
      </section>

      <SummarySection
        description="本节深入讲解了LangChain4j的核心概念："
        items={[
          '<strong>ChatLanguageModel</strong>：统一的LLM接口、配置选项、Builder模式',
          '<strong>AiServices</strong>：声明式接口、注解系统、多种返回类型',
          '<strong>ChatMemory</strong>：对话历史管理、多种内存实现、多用户隔离',
          '<strong>Streaming响应</strong>：实时输出、StreamingResponseHandler、异步处理',
          '<strong>工具调用</strong>：Function Calling、@Tool注解、Agent实现',
        ]}
        footer="🎉 恭喜你掌握了核心概念！继续学习Embedding模型，深入理解向量化技术。"
      />
    </Layout>
  );
};

export default CoreConceptsPage;
