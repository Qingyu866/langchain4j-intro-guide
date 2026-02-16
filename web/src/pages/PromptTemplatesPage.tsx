import Layout from '../components/layout/Layout';
import { Tag, CodeBlockWithCopy, SectionHeader, TipBox, SummarySection } from '../components/ui';

const PromptTemplatesPage = () => {
  const basicTemplate = `import dev.langchain4j.model.input.PromptTemplate;

// 创建简单的Prompt模板
PromptTemplate template = PromptTemplate.from(
    "Hello, {{name}}! Welcome to {{location}}."
);

// 使用单个变量（{{it}}）
PromptTemplate singleVarTemplate = PromptTemplate.from(
    "Please summarize: {{it}}"
);`;

  const applySingleVar = `import dev.langchain4j.model.input.Prompt;
import dev.langchain4j.model.input.PromptTemplate;
import java.util.HashMap;
import java.util.Map;

PromptTemplate template = PromptTemplate.from(
    "Translate the following text to French: {{it}}"
);

// 方式1：直接传值（用于{{it}}变量）
Prompt prompt1 = template.apply("Hello, how are you?");
System.out.println(prompt1.text());
// 输出: Translate the following text to French: Hello, how are you?

// 方式2：使用Map
Map<String, Object> variables = new HashMap<>();
variables.put("it", "Good morning!");
Prompt prompt2 = template.apply(variables);
System.out.println(prompt2.text());
// 输出: Translate the following text to French: Good morning!`;

  const applyMultipleVars = `import dev.langchain4j.model.input.Prompt;
import dev.langchain4j.model.input.PromptTemplate;
import java.util.HashMap;
import java.util.Map;

// 定义包含多个变量的模板
PromptTemplate template = PromptTemplate.from(
    """
    You are a {{role}} assistant.
    Please help the user: {{user_message}}
    Current date: {{current_date}}
    """
);

// 准备变量Map
Map<String, Object> variables = new HashMap<>();
variables.put("role", "technical support");
variables.put("user_message", "My internet connection is slow");

// {{current_date}}等特殊变量会自动填充
Prompt prompt = template.apply(variables);
System.out.println(prompt.text());
// 输出:
// You are a technical support assistant.
// Please help the user: My internet connection is slow
// Current date: 2025-02-16`;

  const systemUserTemplate = `import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.service.AiServices;
import static dev.langchain4j.model.openai.OpenAiChatModel.builder;

interface Translator {
    @SystemMessage("You are a professional translator fluent in {{target_language}}")
    @UserMessage("Translate the following text to {{target_language}}: {{text}}")
    String translate(@V("text") String text, @V("target_language") String targetLanguage);
}

ChatLanguageModel model = builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .modelName("gpt-3.5-turbo")
    .build();

Translator translator = AiServices.builder(Translator.class)
    .chatLanguageModel(model)
    .build();

String result = translator.translate("Hello, world!", "Spanish");
System.out.println(result);`;

  const conditionalTemplate = `import dev.langchain4j.model.input.Prompt;
import dev.langchain4j.model.input.PromptTemplate;
import java.util.HashMap;
import java.util.Map;

// 条件渲染模板（使用if指令）
PromptTemplate template = PromptTemplate.from(
    """
    {% if is_premium %}
    Welcome, Premium Member!
    You have access to all features.
    {% else %}
    Welcome, Free Member!
    Upgrade to Premium for full access.
    {% endif %}
    """
);

Map<String, Object> variables = new HashMap<>();
variables.put("is_premium", true);
Prompt prompt1 = template.apply(variables);
System.out.println(prompt1.text());

variables.put("is_premium", false);
Prompt prompt2 = template.apply(variables);
System.out.println(prompt2.text());`;

  const loopTemplate = `import dev.langchain4j.model.input.Prompt;
import dev.langchain4j.model.input.PromptTemplate;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

// 循环模板（使用for指令）
PromptTemplate template = PromptTemplate.from(
    """
    Please review the following items:
    {% for item in items %}
    - {{item}}
    {% endfor %}

    Provide a summary.
    """
);

Map<String, Object> variables = new HashMap<>();
variables.put("items", List.of("Item 1", "Item 2", "Item 3"));
Prompt prompt = template.apply(variables);
System.out.println(prompt.text());
// 输出:
// Please review the following items:
// - Item 1
// - Item 2
// - Item 3
//
// Provide a summary.`;

  const chatbotTemplate = `import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.service.AiServices;
import static dev.langchain4j.model.openai.OpenAiChatModel.builder;

// 定义聊天机器人接口
interface ChatBot {
    @SystemMessage("""
        You are a helpful assistant named {{bot_name}}.
        Your tone should be {{tone}}.
        You specialize in helping with {{specialty}}.
        """)
    @UserMessage("{{message}}")
    String chat(@V("message") String message,
              @V("bot_name") String botName,
              @V("tone") String tone,
              @V("specialty") String specialty);
}

ChatLanguageModel model = builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .build();

// 创建不同类型的机器人
ChatBot techBot = AiServices.builder(ChatBot.class)
    .chatLanguageModel(model)
    .build();

String response = techBot.chat(
    "How do I reset my password?",
    "TechBot",
    "professional",
    "technical support"
);

System.out.println(response);`;

  const ragTemplate = `import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.input.Prompt;
import dev.langchain4j.model.input.PromptTemplate;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.query.Metadata;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// RAG查询模板
PromptTemplate ragTemplate = PromptTemplate.from(
    """
    Answer the following question using the provided context:

    Context:
    {% for document in documents %}
    {{document}}
    {% endfor %}

    Question: {{question}}

    If the context doesn't contain enough information to answer, say "I don't have enough information."
    """
);

// 假设我们已经检索到相关文档
List<TextSegment> relevantDocs = contentRetriever.retrieve(
    TextSegment.from("What are the benefits of using LangChain4j?")
);

// 提取文档文本
List<String> documentTexts = relevantDocs.stream()
    .map(TextSegment::text)
    .toList();

Map<String, Object> variables = new HashMap<>();
variables.put("question", "What are the benefits of using LangChain4j?");
variables.put("documents", documentTexts);

Prompt prompt = ragTemplate.apply(variables);

ChatLanguageModel model = builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .build();

String answer = model.generate(prompt);`;

  const codeGenTemplate = `import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.service.AiServices;
import static dev.langchain4j.model.openai.OpenAiChatModel.builder;

interface CodeGenerator {
    @SystemMessage("""
        You are an expert {{language}} developer.
        Generate clean, well-documented code following best practices.
        Include comments explaining the code.
        """)
    @UserMessage("""
        Write a {{language}} function to: {{description}}

        Requirements:
        - Input: {{input}}
        - Output: {{output}}
        - Include error handling
        """)
    String generateCode(@V("language") String language,
                     @V("description") String description,
                     @V("input") String inputType,
                     @V("output") String outputType);
}

ChatLanguageModel model = builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .build();

CodeGenerator generator = AiServices.builder(CodeGenerator.class)
    .chatLanguageModel(model)
    .build();

String code = generator.generateCode(
    "Java",
    "sort an array of integers in ascending order",
    "int[] array",
    "int[] sorted array"
);

System.out.println(code);`;

  const performanceOptimization = `import dev.langchain4j.model.input.PromptTemplate;
import java.util.HashMap;
import java.util.Map;

// ❌ 不好的做法：每次调用都创建新模板
public class BadTemplateManager {
    public Prompt getPrompt(String userInput) {
        // 每次都创建新实例，效率低
        return PromptTemplate.from("Process: {{it}}").apply(userInput);
    }
}

// ✅ 好的做法：复用模板实例
public class GoodTemplateManager {
    private static final PromptTemplate TEMPLATE =
        PromptTemplate.from("Process: {{input}} at {{current_date}}");

    public Prompt getPrompt(String userInput) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("input", userInput);
        // {{current_date}}会自动填充，无需手动设置
        return TEMPLATE.apply(variables);
    }
}

// ✅ 使用常量管理模板
public class TemplateConstants {
    public static final PromptTemplate WELCOME_TEMPLATE =
        PromptTemplate.from("Welcome to {{app_name}}!");

    public static final PromptTemplate ERROR_TEMPLATE =
        PromptTemplate.from("Error: {{error_message}}. Code: {{error_code}}");
}`;

  const troubleshooting = `// 问题1：模板中的变量未正确替换

// ❌ 错误代码
PromptTemplate template = PromptTemplate.from("Hello, {{name}}!");
Map<String, Object> variables = new HashMap<>();
variables.put("userName", "John"); // 键名错误
Prompt prompt = template.apply(variables);

// ✅ 正确代码
Map<String, Object> variables = new HashMap<>();
variables.put("name", "John"); // 键名必须与模板变量名一致
Prompt prompt = template.apply(variables);

// ------------------------------------------------

// 问题2：特殊变量名称冲突

// ❌ 避免使用保留的变量名
PromptTemplate template = PromptTemplate.from("Date: {{current_date}}");
Map<String, Object> variables = new HashMap<>();
variables.put("current_date", "2025-01-01"); // 会被自动值覆盖
Prompt prompt = template.apply(variables);

// ✅ 使用不同的变量名
PromptTemplate template = PromptTemplate.from("Date: {{custom_date}}");
Map<String, Object> variables = new HashMap<>();
variables.put("custom_date", "2025-01-01");
Prompt prompt = template.apply(variables);

// ------------------------------------------------

// 问题3：空值处理

// ❌ 空值会导致错误
Map<String, Object> variables = new HashMap<>();
variables.put("name", null);
Prompt prompt = template.apply(variables); // 可能抛出异常

// ✅ 提供默认值
Map<String, Object> variables = new HashMap<>();
variables.put("name", Optional.ofNullable(inputName).orElse("Guest"));
Prompt prompt = template.apply(variables);`;

  return (
    <Layout>
      <div className="page-tags">
        <Tag variant="indigo">Prompt模板</Tag>
        <Tag variant="purple">提示词工程</Tag>
        <Tag variant="green">变量替换</Tag>
      </div>

      <h1 className="page-title">Prompt模板</h1>
      <p className="page-description">
        掌握Prompt模板系统，构建高效、可维护的AI提示词，提升应用质量和开发效率。
      </p>

      <nav className="toc-nav">
        <h3 className="toc-nav-title">目录</h3>
        <ol className="toc-list">
          <li className="toc-item"><span className="toc-number">1.</span> <a href="#基础概念" className="toc-link">基础概念</a></li>
          <li className="toc-item"><span className="toc-number">2.</span> <a href="#创建和使用模板" className="toc-link">创建和使用模板</a></li>
          <li className="toc-item"><span className="toc-number">3.</span> <a href="#在AiServices中使用" className="toc-link">在AiServices中使用</a></li>
          <li className="toc-item"><span className="toc-number">4.</span> <a href="#高级特性" className="toc-link">高级特性</a></li>
          <li className="toc-item"><span className="toc-number">5.</span> <a href="#实战案例" className="toc-link">实战案例</a></li>
          <li className="toc-item"><span className="toc-number">6.</span> <a href="#最佳实践" className="toc-link">最佳实践</a></li>
          <li className="toc-item"><span className="toc-number">7.</span> <a href="#常见问题" className="toc-link">常见问题</a></li>
        </ol>
      </nav>

      <section id="基础概念" className="content-section">
        <SectionHeader number={1} title="基础概念" />

        <h3 className="subsection-title">1.1 什么是Prompt模板</h3>
        <p className="paragraph">
          Prompt模板是LangChain4j提供的强大功能，允许你预定义可重用的提示词模板，并通过变量替换动态生成最终的prompt。
        </p>

        <div className="info-card info-card-blue">
          <h4 className="card-title-blue">核心优势</h4>
          <p>Prompt模板的主要优势：</p>
          <ul className="list-styled list-blue">
            <li><strong>复用性</strong>：一次定义，多处使用</li>
            <li><strong>可维护</strong>：集中管理，易于修改</li>
            <li><strong>类型安全</strong>：强类型约束，减少错误</li>
            <li><strong>动态性</strong>：运行时动态注入变量</li>
            <li><strong>一致性</strong>：确保prompt格式统一</li>
          </ul>
        </div>

        <h3 className="subsection-title">1.2 变量语法</h3>
        <p className="paragraph">LangChain4j支持多种变量语法：</p>

        <div className="grid-2col">
          <div className="card">
            <h4 className="card-title">{"{{it}}"} - 单个变量</h4>
            <p className="card-description">用于简单场景，表示"它"</p>
            <div className="code-inline">{"{{it}}"}</div>
          </div>
          <div className="card">
            <h4 className="card-title">{"{{variable}}"} - 命名变量</h4>
            <p className="card-description">用于多变量场景，描述性命名</p>
            <div className="code-inline">{"{{user_name}}"}</div>
          </div>
          <div className="card">
            <h4 className="card-title">{"{{current_date}}"} - 特殊变量</h4>
            <p className="card-description">自动填充当前日期</p>
            <div className="code-inline">{"{{current_date}}"}</div>
          </div>
          <div className="card">
            <h4 className="card-title">{"{{current_time}}"} - 特殊变量</h4>
            <p className="card-description">自动填充当前时间</p>
            <div className="code-inline">{"{{current_time}}"}</div>
          </div>
        </div>

        <h3 className="subsection-title">1.3 PromptTemplate类</h3>
        <p className="paragraph">PromptTemplate是核心类，提供静态工厂方法和实例方法：</p>

        <CodeBlockWithCopy language="java" filename="PromptTemplate基础用法" code={basicTemplate} />

        <TipBox type="info" title="设计模式说明">
          <ul className="tip-box-list">
            <li><strong>工厂方法</strong>：<code>PromptTemplate.from()</code>提供静态工厂创建实例</li>
            <li><strong>Builder模式</strong>：链式调用，代码更清晰</li>
            <li><strong>不可变性</strong>：模板对象创建后不可修改，线程安全</li>
            <li><strong>复用性</strong>：同一模板可多次apply不同值</li>
          </ul>
        </TipBox>
      </section>

      <section id="创建和使用模板" className="content-section">
        <SectionHeader number={2} title="创建和使用模板" />

        <h3 className="subsection-title">2.1 使用单个变量（{"{{it}}"}）</h3>
        <p className="paragraph">最简单的使用场景，只有一个变量的模板：</p>

        <CodeBlockWithCopy language="java" filename="ApplySingleVariable.java" code={applySingleVar} />

        <TipBox type="tip" title={`何时使用{{it}}？`}>
          <ul className="tip-box-list">
            <li>简单的单参数场景（如文本摘要、翻译）</li>
            <li>不需要变量名的上下文</li>
            <li>代码更简洁</li>
          </ul>
        </TipBox>

        <h3 className="subsection-title">2.2 使用多个变量</h3>
        <p className="paragraph">当需要注入多个值时，使用Map存储变量：</p>

        <CodeBlockWithCopy language="java" filename="ApplyMultipleVariables.java" code={applyMultipleVars} />

        <TipBox type="success" title="特殊变量说明">
          <ul className="tip-box-list">
            <li><code>{"{{current_date}}"}</code>：自动填充LocalDate.now()</li>
            <li><code>{"{{current_time}}"}</code>：自动填充LocalTime.now()</li>
            <li><code>{"{{current_date_time}}"}</code>：自动填充LocalDateTime.now()</li>
            <li>无需手动设置这些变量的值</li>
          </ul>
        </TipBox>

        <h3 className="subsection-title">2.3 变量命名规则</h3>
        <p className="paragraph">为了代码可读性和维护性，遵循以下命名规则：</p>

        <div className="info-card info-card-green">
          <h4 className="card-title-green">变量命名最佳实践</h4>
          <ul className="list-styled list-green">
            <li><strong>描述性命名</strong>：使用能表示语义的名称，如<code>user_message</code>而非<code>msg</code></li>
            <li><strong>蛇形命名</strong>：使用下划线分隔，如<code>user_name</code></li>
            <li><strong>避免冲突</strong>：不要使用保留字（<code>it</code>、<code>current_date</code>等）</li>
            <li><strong>一致性</strong>：整个项目使用相同的命名风格</li>
          </ul>
        </div>
      </section>

      <section id="在AiServices中使用" className="content-section">
        <SectionHeader number={3} title="在AiServices中使用" />

        <h3 className="subsection-title">3.1 @SystemMessage和@UserMessage</h3>
        <p className="paragraph">在AiServices中，可以使用注解定义系统消息和用户消息模板：</p>

        <CodeBlockWithCopy language="java" filename="AiServicesWithTemplate.java" code={systemUserTemplate} />

        <TipBox type="info" title="注解说明">
          <ul className="tip-box-list">
            <li><strong>@SystemMessage</strong>：定义系统角色和行为指导</li>
            <li><strong>@UserMessage</strong>：定义用户输入模板</li>
            <li><strong>@V("variable")</strong>：将方法参数绑定到模板变量</li>
            <li>支持静态和动态模板（可以通过方法参数传入）</li>
          </ul>
        </TipBox>

        <h3 className="subsection-title">3.2 方法参数映射</h3>
        <p className="paragraph">方法参数与模板变量的映射规则：</p>

        <div className="code-preview">
          <div className="code-preview-content">
            <pre><code>interface MyService {'{'}
    @UserMessage("Process {"{{item}}"} with {"{{option}}"} enabled")
    String process(
        @V("item") String item,      // → {"{{item}}"}
        @V("option") boolean option,    // → {"{{option}}"}
        String unmarkedParam               // 不映射到任何变量
    );
{'}'}</code></pre>
          </div>
        </div>

        <TipBox type="warning" title="注意事项">
          <ul className="tip-box-list">
            <li>所有使用<code>@V</code>的参数必须出现在模板中，否则编译警告</li>
            <li>模板中的每个变量必须有对应的<code>@V</code>参数</li>
            <li>未标记的参数不会注入到模板中</li>
          </ul>
        </TipBox>
      </section>

      <section id="高级特性" className="content-section">
        <SectionHeader number={4} title="高级特性" />

        <h3 className="subsection-title">4.1 条件渲染</h3>
        <p className="paragraph">使用if指令实现条件性内容：</p>

        <CodeBlockWithCopy language="java" filename="ConditionalTemplate.java" code={conditionalTemplate} />

        <TipBox type="info" title="语法说明">
          <ul className="tip-box-list">
            <li><code>{"{% if condition %}"}</code>：开始条件块</li>
            <li><code>{"{% else %}"}</code>：否则分支（可选）</li>
            <li><code>{"{% endif %}"}</code>：结束条件块</li>
            <li>支持布尔表达式：<code>{"{% if is_premium and has_access %}"}</code></li>
          </ul>
        </TipBox>

        <h3 className="subsection-title">4.2 循环渲染</h3>
        <p className="paragraph">使用for指令遍历集合：</p>

        <CodeBlockWithCopy language="java" filename="LoopTemplate.java" code={loopTemplate} />

        <TipBox type="tip" title="循环最佳实践">
          <ul className="tip-box-list">
            <li><strong>性能考虑</strong>：大列表可能消耗较多token</li>
            <li><strong>格式化</strong>：在循环内添加适当的分隔符</li>
            <li><strong>嵌套</strong>：支持多层嵌套循环</li>
            <li><strong>索引访问</strong>：使用<code>{"{{item}}"}</code>或<code>{"{{loop.index}}"}</code></li>
          </ul>
        </TipBox>

        <h3 className="subsection-title">4.3 特殊变量完整列表</h3>
        <p className="paragraph">LangChain4j提供的所有自动填充变量：</p>

        <div className="grid-2col">
          <div className="card-blue">
            <h4 className="card-title-blue">{"{{current_date}}"}</h4>
            <p className="card-description-blue">当前日期：LocalDate.now()</p>
            <div className="code-inline">格式：2025-02-16</div>
          </div>
          <div className="card-blue">
            <h4 className="card-title-blue">{"{{current_time}}"}</h4>
            <p className="card-description-blue">当前时间：LocalTime.now()</p>
            <div className="code-inline">格式：20:30:45</div>
          </div>
          <div className="card-blue">
            <h4 className="card-title-blue">{"{{current_date_time}}"}</h4>
            <p className="card-description-blue">当前日期时间：LocalDateTime.now()</p>
            <div className="code-inline">格式：2025-02-16T20:30:45</div>
          </div>
          <div className="card-green">
            <h4 className="card-title-green">自定义变量</h4>
            <p className="card-description-green">任何你定义的变量</p>
            <div className="code-inline">{"{{user_input}}"}、{"{{name}}"}等</div>
          </div>
        </div>
      </section>

      <section id="实战案例" className="content-section">
        <SectionHeader number={5} title="实战案例" />

        <h3 className="subsection-title">5.1 智能聊天机器人</h3>
        <p className="paragraph">使用模板创建可配置的聊天机器人：</p>

        <CodeBlockWithCopy language="java" filename="ChatBotExample.java" code={chatbotTemplate} />

        <TipBox type="success" title="应用场景">
          <ul className="tip-box-list">
            <li><strong>客服机器人</strong>：根据不同品牌定制角色</li>
            <li><strong>教育助手</strong>：调整语气和专业领域</li>
            <li><strong>编程助手</strong>：指定语言和框架</li>
            <li><strong>创意写作</strong>：改变风格和主题</li>
          </ul>
        </TipBox>

        <h3 className="subsection-title">5.2 RAG查询</h3>
        <p className="paragraph">结合检索增强生成的prompt模板：</p>

        <CodeBlockWithCopy language="java" filename="RAGTemplateExample.java" code={ragTemplate} />

        <TipBox type="info" title="RAG最佳实践">
          <ul className="tip-box-list">
            <li><strong>限制上下文</strong>：只使用最相关的Top-K文档</li>
            <li><strong>清晰指令</strong>：告诉AI何时说不知道</li>
            <li><strong>引用来源</strong>：要求AI注明引用的文档</li>
            <li><strong>模板化</strong>：将RAG流程抽象为可复用模板</li>
          </ul>
        </TipBox>

        <h3 className="subsection-title">5.3 代码生成器</h3>
        <p className="paragraph">使用模板生成代码：</p>

        <CodeBlockWithCopy language="java" filename="CodeGeneratorExample.java" code={codeGenTemplate} />

        <TipBox type="tip" title="代码生成建议">
          <ul className="tip-box-list">
            <li><strong>明确需求</strong>：详细描述输入、输出、约束条件</li>
            <li><strong>语言规范</strong>：指定具体的语言版本和库</li>
            <li><strong>错误处理</strong>：要求添加异常处理逻辑</li>
            <li><strong>测试覆盖</strong>：要求生成单元测试</li>
          </ul>
        </TipBox>
      </section>

      <section id="最佳实践" className="content-section">
        <SectionHeader number={6} title="最佳实践" />

        <h3 className="subsection-title">6.1 性能优化</h3>
        <p className="paragraph">优化Prompt模板的性能和资源使用：</p>

        <CodeBlockWithCopy language="java" filename="PerformanceOptimization.java" code={performanceOptimization} />

        <div className="info-card info-card-purple">
          <h4 className="card-title-purple">性能优化要点</h4>
          <ul className="list-styled list-purple">
            <li><strong>复用实例</strong>：模板对象创建一次，多次使用</li>
            <li><strong>静态常量</strong>：将常用模板定义为static final</li>
            <li><strong>避免拼接</strong>：使用模板而非字符串拼接</li>
            <li><strong>减少复杂性</strong>：复杂的模板拆分为多个简单模板</li>
            <li><strong>缓存变量</strong>：重复使用的变量Map可以复用</li>
          </ul>
        </div>

        <h3 className="subsection-title">6.2 模板设计原则</h3>
        <p className="paragraph">设计高质量的Prompt模板：</p>

        <div className="grid-2col">
          <div className="card-green">
            <h4 className="card-title-green">✅ 好的模板设计</h4>
            <ul className="list-styled list-green">
              <li>清晰的角色定义</li>
              <li>明确的任务说明</li>
              <li>合理的输出格式</li>
              <li>适当的示例（Few-shot）</li>
              <li>错误处理指导</li>
            </ul>
          </div>
          <div className="card-red">
            <h4 className="card-title-red">❌ 避免的问题</h4>
            <ul className="list-styled list-red">
              <li>模糊的角色定义</li>
              <li>复杂的嵌套逻辑</li>
              <li>过多的上下文</li>
              <li>不一致的格式</li>
              <li>硬编码的数值</li>
            </ul>
          </div>
        </div>

        <h3 className="subsection-title">6.3 安全性考虑</h3>
        <p className="paragraph">使用Prompt模板时需要注意的安全问题：</p>

        <div className="info-card info-card-yellow">
          <h4 className="card-title-yellow">安全最佳实践</h4>
          <ul className="list-styled list-yellow">
            <li><strong>输入验证</strong>：验证用户输入，防止注入攻击</li>
            <li><strong>敏感信息</strong>：不要在模板中硬编码API密钥</li>
            <li><strong>内容审核</strong>：对AI输出进行内容过滤</li>
            <li><strong>权限控制</strong>：限制可访问的工具和数据</li>
            <li><strong>日志脱敏</strong>：不要记录完整的prompt（可能包含敏感信息）</li>
          </ul>
        </div>
      </section>

      <section id="常见问题" className="content-section">
        <SectionHeader number={7} title="常见问题" />

        <h3 className="subsection-title">7.1 变量未正确替换</h3>
        <p className="paragraph">最常见的问题之一，变量名不匹配导致替换失败：</p>

        <CodeBlockWithCopy language="java" filename="Troubleshooting.java" code={troubleshooting} />

        <TipBox type="warning" title="调试技巧">
          <ul className="tip-box-list">
            <li><strong>打印输出</strong>：使用<code>prompt.text()</code>查看最终结果</li>
            <li><strong>变量检查</strong>：确保Map的key与模板变量名完全一致</li>
            <li><strong>空值处理</strong>：使用Optional提供默认值</li>
            <li><strong>大小写</strong>：变量名是大小写敏感的</li>
          </ul>
        </TipBox>

        <h3 className="subsection-title">7.2 FAQ</h3>
        <div className="faq-section">
          <div className="faq-item">
            <h4 className="faq-question">Q: 模板变量和AI Services的@V注解有什么区别？</h4>
            <p className="faq-answer">
              A: 模板变量用于PromptTemplate.apply()，@V注解用于AiServices方法参数绑定。两者功能相似但使用场景不同：
              直接使用ChatModel时用PromptTemplate，使用AiServices时用@V注解。
            </p>
          </div>

          <div className="faq-item">
            <h4 className="faq-question">Q: 可以在一个模板中使用多次相同的变量吗？</h4>
            <p className="faq-answer">
              A: 可以。同一个变量可以在模板中多次出现，apply时会全部替换为相同的值。
              例如：<code>Repeat {"{{word}}"} three times: {"{{word}}"}, {"{{word}}"}, {"{{word}}"}</code>
            </p>
          </div>

          <div className="faq-item">
            <h4 className="faq-question">Q: 如何处理模板中的空值或缺失值？</h4>
            <p className="faq-answer">
              A: 使用Java的Optional或三元运算符提供默认值：
              <code>Map.of("name", Optional.ofNullable(inputName).orElse("Guest"))</code>
              确保模板变量始终有值。
            </p>
          </div>

          <div className="faq-item">
            <h4 className="faq-question">Q: Prompt模板会影响Token使用量吗？</h4>
            <p className="faq-answer">
              A: 会。模板本身（包括固定文本和变量值）都会计入Token使用量。
              建议：保持模板简洁，只包含必要的信息，避免冗余描述。
            </p>
          </div>

          <div className="faq-item">
            <h4 className="faq-question">Q: 如何实现多语言支持？</h4>
            <p className="faq-answer">
              A: 为每种语言创建单独的模板，或使用条件渲染：
              <code>{"{% if language == 'zh' %}"} 欢迎 {"{% else %}"} Welcome {"{% endif %}"}</code>
              可以结合配置文件或数据库管理多语言模板。
            </p>
          </div>
        </div>
      </section>

      <SummarySection
        description="本节深入讲解了LangChain4j的Prompt模板系统："
        items={[
          '<strong>基础概念</strong>：PromptTemplate类、变量语法（{{it}}、{{variable}}、特殊变量）',
          '<strong>创建和使用</strong>：单个变量和多个变量的应用，使用Map传递值',
          '<strong>AiServices集成</strong>：@SystemMessage、@UserMessage、@V注解的使用',
          '<strong>高级特性</strong>：条件渲染、循环渲染、特殊变量自动填充',
          '<strong>实战案例</strong>：聊天机器人、RAG查询、代码生成器',
          '<strong>最佳实践</strong>：性能优化、模板设计原则、安全性考虑',
          '<strong>常见问题</strong>：变量替换问题、调试技巧、FAQ',
        ]}
        footer="🎉 恭喜你掌握了Prompt模板！继续学习Embedding模型，为构建RAG系统打下基础。"
      />
    </Layout>
  );
};

export default PromptTemplatesPage;
