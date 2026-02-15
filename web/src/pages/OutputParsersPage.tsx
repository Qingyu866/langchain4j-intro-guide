import Layout from '../components/layout/Layout';
import { Tag, CodeBlock, SectionHeader, TipBox, SummarySection } from '../components/ui';

const OutputParsersPage = () => {
  const basicUsage = `import dev.langchain4j.AiServices.AiServices;
import dev.langchain4j.service.OutputParser;
import dev.langchain4j.service.TypeSafeChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import static dev.langchain4j.model.openai.OpenAiChatModel.builder;

// 定义数据类
public class Person {
    private String name;
    private int age;
    private String occupation;

    public Person() {}

    public Person(String name, int age, String occupation) {
        this.name = name;
        this.age = age;
        this.occupation = occupation;
    }

    // getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }
}

// 定义AI Service接口
interface PersonExtractor {
    @UserMessage("Extract person information from: {{it}}")
    Person extract(String text);
}

// 创建AI Service
ChatLanguageModel model = builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .modelName("gpt-4")
    .build();

PersonExtractor extractor = AiServices.builder(PersonExtractor.class)
    .chatLanguageModel(model)
    .outputParser(OutputParser.ofBean(Person.class))
    .build();

// 使用
String text = "John is 30 years old and works as a software engineer.";
Person person = extractor.extract(text);
System.out.println("Name: " + person.getName());
System.out.println("Age: " + person.getAge());
System.out.println("Occupation: " + person.getOccupation());`;

  const customParser = `import dev.langchain4j.AiServices.AiServices;
import dev.langchain4j.service.OutputParser;
import dev.langchain4j.model.openai.OpenAiChatModel;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

// 自定义输出解析器
public class CustomOutputParser implements OutputParser<String, WeatherInfo> {

    private static final Pattern CITY_PATTERN = Pattern.compile("weather in ([a-zA-Z]+)");
    private static final Pattern TEMP_PATTERN = Pattern.compile("(\\d+\\.?\\d*)");
    private static final Pattern CONDITION_PATTERN = Pattern.compile("(sunny|cloudy|rainy|snowy)");

    @Override
    public WeatherInfo parse(String text) {
        WeatherInfo info = new WeatherInfo();

        // 提取城市
        Matcher cityMatcher = CITY_PATTERN.matcher(text.toLowerCase());
        if (cityMatcher.find()) {
            info.setCity(cityMatcher.group(1));
        }

        // 提取温度
        Matcher tempMatcher = TEMP_PATTERN.matcher(text);
        if (tempMatcher.find()) {
            info.setTemperature(Double.parseDouble(tempMatcher.group(1)));
        }

        // 提取天气状况
        Matcher conditionMatcher = CONDITION_PATTERN.matcher(text.toLowerCase());
        if (conditionMatcher.find()) {
            info.setCondition(conditionMatcher.group(1));
        }

        return info;
    }
}

// 使用自定义解析器
ChatLanguageModel model = builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .modelName("gpt-4")
    .build();

CustomOutputParser parser = new CustomOutputParser();

String response = model.generate("What is the weather in Beijing?");
WeatherInfo weather = parser.parse(response);
System.out.println("City: " + weather.getCity());
System.out.println("Temperature: " + weather.getTemperature());
System.out.println("Condition: " + weather.getCondition());`;

  const jsonParsing = `import dev.langchain4j.AiServices.AiServices;
import dev.langchain4j.service.OutputParser;
import dev.langchain4j.model.openai.OpenAiChatModel;
import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;

// 定义复杂的响应结构
public class Article {
    private String title;
    private String content;
    private String author;
    private List<String> tags;

    // 构造器、getters、setters
}

// 定义AI Service接口
interface ArticleExtractor {
    @UserMessage("Extract article information in JSON format")
    Article extract(String text);
}

// 创建AI Service
ChatLanguageModel model = builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .modelName("gpt-4")
    .responseFormat("json_object")  // 启用JSON模式
    .build();

ArticleExtractor extractor = AiServices.builder(ArticleExtractor.class)
    .chatLanguageModel(model)
    .outputParser(OutputParser.fromJson())  // 使用JSON解析器
    .build();

String jsonText = model.generate("Write a short article about AI development");
Article article = extractor.extract(jsonText);

ObjectMapper mapper = new ObjectMapper();
String jsonString = mapper.writeValueAsString(article);
System.out.println(jsonString);`;

  const errorHandling = `import dev.langchain4j.AiServices.AiServices;
import dev.langchain4j.service.OutputParser;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.service.OutputParserException;
import static dev.langchain4j.model.openai.OpenAiChatModel.builder;

// 定义数据类
public class User {
    private String username;
    private String email;
    private int age;
}

// 定义AI Service接口
interface UserExtractor {
    @UserMessage("Extract user information: {{it}}")
    User extract(String text);
}

// 创建AI Service
ChatLanguageModel model = builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .modelName("gpt-4")
    .build();

UserExtractor extractor = AiServices.builder(UserExtractor.class)
    .chatLanguageModel(model)
    .outputParser(OutputParser.ofBean(User.class))
    .build();

// 使用并处理多个文本，带错误处理
List<String> texts = List.of(
    "John Doe, 25, john@example.com",
    "Jane Smith, invalid-email"
);

for (String text : texts) {
    try {
        User user = extractor.extract(text);
        System.out.println("Username: " + user.getUsername());
        System.out.println("Email: " + user.getEmail());
        System.out.println("Age: " + user.getAge());
    } catch (OutputParserException e) {
        System.err.println("解析失败: " + text);
        System.err.println("错误: " + e.getMessage());
    }
}`;

  const performance = `import dev.langchain4j.AiServices.AiServices;
import dev.langchain4j.service.OutputParser;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import java.util.List;
import java.util.ArrayList;
import static dev.langchain4j.model.openai.OpenAiChatModel.builder;

// 定义数据类
public class DocumentInfo {
    private String id;
    private String title;
    private String summary;
}

// 定义AI Service接口
interface DocumentExtractor {
    @UserMessage("Extract document: {{it}}")
    DocumentInfo extract(String text);
}

// 创建AI Service
ChatLanguageModel model = builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .modelName("gpt-4")
    .build();

DocumentExtractor extractor = AiServices.builder(DocumentExtractor.class)
    .chatLanguageModel(model)
    .outputParser(OutputParser.ofBean(DocumentInfo.class))
    .build();

// 批量处理示例
List<String> documents = new ArrayList<>();
// 添加多个文档...

// 批量解析
for (String doc : documents) {
    DocumentInfo info = extractor.extract(doc);
    // 处理解析结果...
    System.out.println("Document ID: " + info.getId());
    System.out.println("Title: " + info.getTitle());
    System.out.println("Summary: " + info.getSummary());
}`;

  return (
    <Layout>
      <div className="page-tags">
        <Tag variant="indigo">输出解析</Tag>
        <Tag variant="purple">结构化输出</Tag>
        <Tag variant="green">类型安全</Tag>
      </div>

      <h1 className="page-title">输出解析</h1>
      <p className="page-description">
        掌握输出解析技术，将LLM的文本输出转换为类型安全的Java对象，构建数据驱动的AI应用。
      </p>

      <nav className="toc-nav">
        <h3 className="toc-nav-title">目录</h3>
        <ol className="toc-list">
          <li className="toc-item"><span className="toc-number">1.</span> <a href="#基本用法" className="toc-link">基本用法</a></li>
          <li className="toc-item"><span className="toc-number">2.</span> <a href="#自定义解析器" className="toc-link">自定义解析器</a></li>
          <li className="toc-item"><span className="toc-number">3.</span> <a href="#JSON解析" className="toc-link">JSON解析</a></li>
          <li className="toc-item"><span className="toc-number">4.</span> <a href="#错误处理" className="toc-link">错误处理</a></li>
          <li className="toc-item"><span className="toc-number">5.</span> <a href="#性能优化" className="toc-link">性能优化</a></li>
          <li className="toc-item"><span className="toc-number">6.</span> <a href="#最佳实践" className="toc-link">最佳实践</a></li>
        </ol>
      </nav>

      <section id="基本用法" className="content-section">
        <SectionHeader number={1} title="基本用法" />

        <h3 className="subsection-title">1.1 为什么需要输出解析</h3>
        <p className="paragraph">
          LLM以文本形式返回答案，但实际应用中往往需要结构化数据，如JSON、对象、列表等。输出解析器可以将文本转换为Java类型安全的对象。
        </p>

        <div className="info-card info-card-blue">
          <h4 className="card-title-blue">核心价值</h4>
          <ul className="list-styled list-blue">
            <li><strong>类型安全</strong>：编译时检查，减少运行时错误</li>
            <li><strong>代码简洁</strong>：无需手动解析字符串</li>
            <li><strong>易于测试</strong>：可以轻松mock和验证</li>
            <li><strong>数据验证</strong>：可以添加字段级别的验证逻辑</li>
            <li><strong>程序化处理</strong>：直接使用对象属性和方法</li>
          </ul>
        </div>

        <h3 className="subsection-title">1.2 OutputParser接口</h3>
        <p className="paragraph">
          LangChain4j提供了OutputParser接口和多种实现，适用于不同的解析场景：
        </p>

        <div className="grid-2col">
          <div className="card">
            <h4 className="card-title">ofString()</h4>
            <p className="card-description">简单字符串输出</p>
            <div className="code-inline">OutputParser.ofString()</div>
          </div>
          <div className="card">
            <h4 className="card-title">ofBean(Class)</h4>
            <p className="card-description">解析为Java Bean（POJO）</p>
            <div className="code-inline">OutputParser.ofBean(Person.class)</div>
          </div>
        </div>

        <TipBox type="info" title="基本用法示例">
          <CodeBlock language="java" filename="BasicUsage.java" code={basicUsage} />
        </TipBox>
      </section>

      <section id="自定义解析器" className="content-section">
        <SectionHeader number={2} title="自定义解析器" />

        <h3 className="subsection-title">2.1 实现OutputParser接口</h3>
        <p className="paragraph">
          对于复杂的解析场景，可以实现自定义的OutputParser接口：
        </p>

        <CodeBlock language="java" filename="CustomParser.java" code={customParser} />

        <TipBox type="success" title="自定义解析器优势">
          <ul className="tip-box-list">
            <li><strong>灵活控制</strong>：完全控制解析逻辑</li>
            <li><strong>复杂验证</strong>：可以实现多层验证逻辑</li>
            <li><strong>错误处理</strong>：精细控制异常处理策略</li>
            <li><strong>性能优化</strong>：可以针对特定场景优化</li>
          </ul>
        </TipBox>
      </section>

      <section id="JSON解析" className="content-section">
        <SectionHeader number={3} title="JSON解析" />

        <h3 className="subsection-title">3.1 fromJson()方法</h3>
        <p className="paragraph">
          使用fromJson()方法可以将JSON字符串转换为Java对象，适用于嵌套JSON结构：
        </p>

        <CodeBlock language="java" filename="JsonParsing.java" code={jsonParsing} />

        <TipBox type="warning" title="JSON模式支持">
          <ul className="tip-box-list">
            <li><strong>responseFormat</strong>：在创建ChatModel时设置responseFormat("json_object")</li>
            <li><strong>提高准确性</strong>：强制LLM输出有效JSON</li>
            <li><strong>类型安全</strong>：OutputParser.fromJson()会自动转换为强类型对象</li>
            <li><strong>支持复杂结构</strong>：可以解析嵌套对象、数组等复杂JSON</li>
          </ul>
        </TipBox>

        <h3 className="subsection-title">3.2 复杂JSON处理</h3>
        <p className="paragraph">
          处理复杂的JSON结构，如数组、嵌套对象、混合类型：
        </p>

        <div className="info-card info-card-purple">
          <h4 className="card-title-purple">复杂JSON示例</h4>
          <pre className="code-text">{'{'}
  "articles": [
    {'{'}
      "title": "Introduction to LangChain4j",
      "content": "...",
      "tags": ["ai", "java"]
    {'}'}
  ]
{'}'}</pre>
          <p className="card-description-purple">支持嵌套对象、数组、混合类型的数据结构</p>
        </div>
      </section>

      <section id="错误处理" className="content-section">
        <SectionHeader number={4} title="错误处理" />

        <h3 className="subsection-title">4.1 OutputParserException</h3>
        <p className="paragraph">
          解析失败时抛出OutputParserException，需要妥善处理：
        </p>

        <CodeBlock language="java" filename="ErrorHandling.java" code={errorHandling} />

        <TipBox type="warning" title="错误处理最佳实践">
          <ul className="tip-box-list">
            <li><strong>捕获异常</strong>：使用try-catch捕获OutputParserException</li>
            <li><strong>提供友好错误消息</strong>：记录详细的错误信息</li>
            <li><strong>重试机制</strong>：对于可重试的操作实现重试</li>
            <li><strong>降级策略</strong>：解析失败时使用默认值或备用方法</li>
            <li><strong>日志记录</strong>：记录失败案例，便于后续分析</li>
            <li><strong>监控告警</strong>：解析错误率过高时发出告警</li>
          </ul>
        </TipBox>
      </section>

      <section id="性能优化" className="content-section">
        <SectionHeader number={5} title="性能优化" />

        <h3 className="subsection-title">5.1 批量处理</h3>
        <p className="paragraph">
          批量解析可以显著提高性能：
        </p>

        <CodeBlock language="java" filename="BatchProcessing.java" code={performance} />

        <TipBox type="info" title="批量处理优势">
          <ul className="tip-box-list">
            <li><strong>减少上下文切换</strong>：批量解析减少模型切换开销</li>
            <li><strong>并行处理</strong>：多线程解析可以提高吞吐量</li>
            <li><strong>流式处理</strong>：对于大批量数据，使用流式API</li>
            <li><strong>连接复用</strong>：复用HTTP连接减少建立开销</li>
          </ul>
        </TipBox>
      </section>

      <section id="最佳实践" className="content-section">
        <SectionHeader number={6} title="最佳实践" />

        <h3 className="subsection-title">6.1 类型安全</h3>
        <p className="paragraph">
          使用类型安全的OutputParser避免运行时错误：
        </p>

        <div className="info-card info-card-green">
          <h4 className="card-title-green">类型安全要点</h4>
          <ul className="list-styled list-green">
            <li><strong>始终使用类型安全</strong>：使用TypeSafeChatLanguageModel</li>
            <li><strong>明确类型定义</strong>：为复杂对象定义明确的class</li>
            <li><strong>字段验证</strong>：在setter方法中添加参数验证</li>
            <li><strong>不可变对象</strong>：使用final字段或复制构造器</li>
            <li><strong>空值处理</strong>：明确处理null和空字符串的情况</li>
          </ul>
        </div>

        <h3 className="subsection-title">6.2 错误处理</h3>
        <p className="paragraph">
          健壮的错误处理策略：
        </p>

        <div className="info-card info-card-yellow">
          <h4 className="card-title-yellow">错误处理要点</h4>
          <ul className="list-styled list-yellow">
            <li><strong>优雅降级</strong>：解析失败时返回默认值或空对象</li>
            <li><strong>用户提示</strong>：提供清晰的错误消息指导用户修正输入</li>
            <li><strong>日志监控</strong>：记录解析错误，定期分析错误模式</li>
            <li><strong>告警机制</strong>：设置错误率阈值，超出时告警</li>
            <li><strong>熔断机制</strong>：错误率过高时暂时禁用解析器</li>
          </ul>
        </div>

        <h3 className="subsection-title">6.3 性能监控</h3>
        <p className="paragraph">
          监控和优化解析性能：
        </p>

        <div className="info-card info-card-indigo">
          <h4 className="card-title-indigo">监控指标</h4>
          <ul className="list-styled list-indigo">
            <li><strong>解析成功率</strong>：成功解析的文本占比</li>
            <li><strong>平均解析时间</strong>：单个文本的平均解析耗时</li>
            <li><strong>P99延迟</strong>：99%的请求在多少时间内完成</li>
            <li><strong>错误率</strong>：解析失败的请求占比</li>
            <li><strong>吞吐量</strong>：每秒处理的文本数量</li>
          </ul>
        </div>
      </section>

      <section id="常见问题" className="content-section">
        <SectionHeader number={7} title="常见问题" />

        <div className="faq-section">
          <div className="faq-item">
            <h4 className="faq-question">Q: 输出解析失败时如何处理？</h4>
            <p className="faq-answer">
              A: 建议的处理方式：
              1. 捕获OutputParserException，提供友好的错误消息
              2. 使用默认值或空对象作为降级方案
              3. 记录详细的错误日志便于调试
              4. 考虑提供重试机制让用户重新提交
              5. 监控解析错误率，过高时调整prompt或模型配置
            </p>
          </div>

          <div className="faq-item">
            <h4 className="faq-question">Q: 如何提高JSON解析的成功率？</h4>
            <p className="faq-answer">
              A: 提高成功率的策略：
              1. 在ChatModel中设置responseFormat("json_object")强制输出JSON格式
              2. 在prompt中明确要求JSON结构，提供格式示例
              3. 使用few-shot learning提供多个正确的JSON示例
              4. 调整temperature参数降低随机性（建议0.1-0.3）
              5. 增加maxTokens确保足够空间输出完整JSON
              6. 实现自定义JSON解析器处理边缘情况
            </p>
          </div>

          <div className="faq-item">
            <h4 className="faq-question">Q: 自定义解析器与内置解析器如何选择？</h4>
            <p className="faq-answer">
              A: 选择建议：
              1. **简单场景**：优先使用内置解析器（ofBean、fromJson）
              2. **复杂验证**：需要多层验证或复杂逻辑时使用自定义解析器
              3. **性能要求**：批量处理或需要特殊优化时考虑自定义
              4. **错误处理**：需要精细控制错误处理策略时使用自定义
              5. **可维护性**：考虑团队技能和后续维护成本
              6. **混合使用**：可以在同一AiServices中组合使用多个解析器
            </p>
          </div>
        </div>
      </section>

      <SummarySection
        description="本节深入讲解了LangChain4j的输出解析功能："
        items={[
          '<strong>基本用法</strong>：OutputParser接口、ofBean、ofString等方法',
          '<strong>自定义解析器</strong>：实现OutputParser接口、复杂逻辑控制',
          '<strong>JSON解析</strong>：fromJson方法、responseFormat配置、复杂JSON处理',
          '<strong>错误处理</strong>：OutputParserException、重试机制、降级策略',
          '<strong>性能优化</strong>：批量处理、并行处理、连接复用',
          '<strong>最佳实践</strong>：类型安全、错误处理策略、性能监控',
          '<strong>常见问题</strong>：解析失败处理、JSON成功率提升、解析器选择',
        ]}
        footer="🎉 恭喜你掌握了输出解析！继续学习Function Calling，深入理解工具调用和Agent实现。"
      />
    </Layout>
  );
};

export default OutputParsersPage;
