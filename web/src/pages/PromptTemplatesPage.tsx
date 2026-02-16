import Layout from '../components/layout/Layout';
import { Tag, CodeBlockWithCopy, SectionHeader, TipBox, SummarySection } from '../components/ui';

const PromptTemplatesPage = () => {
  const basicTemplate = `import dev.langchain4j.model.input.PromptTemplate;

public class BasicTemplateExample {
    public static void main(String[] args) {
        // 创建简单的Prompt模板
        PromptTemplate template = PromptTemplate.from(
            "Hello, {{name}}! Welcome to {{location}}."
        );

        // 使用单个变量（{{it}}）
        PromptTemplate singleVarTemplate = PromptTemplate.from(
            "Please summarize: {{it}}"
        );
        
        System.out.println("Templates created successfully");
    }
}`;

  const applySingleVar = `import dev.langchain4j.model.input.Prompt;
import dev.langchain4j.model.input.PromptTemplate;
import java.util.HashMap;
import java.util.Map;

public class ApplySingleVarExample {
    public static void main(String[] args) {
        PromptTemplate template = PromptTemplate.from(
            "Translate the following text to French: {{it}}"
        );

        // 方式1：直接传值（用于{{it}}变量）
        Prompt prompt1 = template.apply("Hello, how are you?");
        System.out.println(prompt1.text());

        // 方式2：使用Map
        Map<String, Object> variables = new HashMap<>();
        variables.put("it", "Good morning!");
        Prompt prompt2 = template.apply(variables);
        System.out.println(prompt2.text());
    }
}`;

  const applyMultipleVars = `import dev.langchain4j.model.input.Prompt;
import dev.langchain4j.model.input.PromptTemplate;
import java.util.HashMap;
import java.util.Map;

public class ApplyMultipleVarsExample {
    public static void main(String[] args) {
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
    }
}`;

  const systemUserTemplate = `import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;

public class SystemUserTemplateExample {

    interface Translator {
        @SystemMessage("You are a professional translator fluent in {{target_language}}")
        @UserMessage("Translate the following text to {{target_language}}: {{text}}")
        String translate(@V("text") String text, @V("target_language") String targetLanguage);
    }

    public static void main(String[] args) {
        ChatLanguageModel model = OpenAiChatModel.builder()
            .apiKey(System.getenv("OPENAI_API_KEY"))
            .modelName("gpt-3.5-turbo")
            .build();

        Translator translator = AiServices.builder(Translator.class)
            .chatLanguageModel(model)
            .build();

        String result = translator.translate("Hello, world!", "Spanish");
        System.out.println(result);
    }
}`;

  const conditionalTemplate = `import dev.langchain4j.model.input.Prompt;
import dev.langchain4j.model.input.PromptTemplate;
import java.util.HashMap;
import java.util.Map;

public class ConditionalTemplateExample {
    public static void main(String[] args) {
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
        System.out.println(prompt2.text());
    }
}`;

  const loopTemplate = `import dev.langchain4j.model.input.Prompt;
import dev.langchain4j.model.input.PromptTemplate;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

public class LoopTemplateExample {
    public static void main(String[] args) {
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
    }
}`;

  const chatbotTemplate = `import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;

public class ChatbotTemplateExample {

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

    public static void main(String[] args) {
        ChatLanguageModel model = OpenAiChatModel.builder()
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

        System.out.println(response);
    }
}`;

  const ragTemplate = `import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.input.Prompt;
import dev.langchain4j.model.input.PromptTemplate;
import dev.langchain4j.model.openai.OpenAiChatModel;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RagTemplateExample {
    public static void main(String[] args) {
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
        List<String> documentTexts = List.of(
            "LangChain4j is a Java framework for LLMs.",
            "It provides unified API for multiple providers."
        );

        Map<String, Object> variables = new HashMap<>();
        variables.put("question", "What are the benefits of using LangChain4j?");
        variables.put("documents", documentTexts);

        Prompt prompt = ragTemplate.apply(variables);

        ChatLanguageModel model = OpenAiChatModel.builder()
            .apiKey(System.getenv("OPENAI_API_KEY"))
            .build();

        String answer = model.generate(prompt.text());
        System.out.println(answer);
    }
}`;

  const codeGenTemplate = `import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;

public class CodeGenTemplateExample {

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

    public static void main(String[] args) {
        ChatLanguageModel model = OpenAiChatModel.builder()
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

        System.out.println(code);
    }
}`;

  const performanceOptimization = `import dev.langchain4j.model.input.Prompt;
import dev.langchain4j.model.input.PromptTemplate;
import java.util.HashMap;
import java.util.Map;

public class PerformanceOptimization {

    // ❌ 不好的做法：每次调用都创建新模板
    public static class BadTemplateManager {
        public Prompt getPrompt(String userInput) {
            // 每次都创建新实例，效率低
            return PromptTemplate.from("Process: {{it}}").apply(userInput);
        }
    }

    // ✅ 好的做法：复用模板实例
    public static class GoodTemplateManager {
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
    public static class TemplateConstants {
        public static final PromptTemplate WELCOME_TEMPLATE =
            PromptTemplate.from("Welcome to {{app_name}}!");

        public static final PromptTemplate ERROR_TEMPLATE =
            PromptTemplate.from("Error: {{error_message}}. Code: {{error_code}}");
    }
}`;

  const troubleshooting = `import dev.langchain4j.model.input.Prompt;
import dev.langchain4j.model.input.PromptTemplate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

public class Troubleshooting {

    public static void main(String[] args) {
        // 问题1：模板中的变量未正确替换
        PromptTemplate template = PromptTemplate.from("Hello, {{name}}!");
        
        // ❌ 错误代码
        // Map<String, Object> wrongVars = new HashMap<>();
        // wrongVars.put("userName", "John"); // 键名错误
        
        // ✅ 正确代码
        Map<String, Object> variables = new HashMap<>();
        variables.put("name", "John"); // 键名必须与模板变量名一致
        Prompt prompt = template.apply(variables);
        System.out.println(prompt.text());

        // 问题2：空值处理
        String inputName = null;
        
        // ✅ 提供默认值
        Map<String, Object> safeVars = new HashMap<>();
        safeVars.put("name", Optional.ofNullable(inputName).orElse("Guest"));
        Prompt safePrompt = template.apply(safeVars);
        System.out.println(safePrompt.text());
    }
}`;

  return (
    <Layout>
      <div className="page-tags">
        <Tag variant="indigo">Prompt模板</Tag>
        <Tag variant="purple">变量替换</Tag>
        <Tag variant="green">模板引擎</Tag>
      </div>

      <h1 className="page-title">Prompt 模板</h1>
      <p className="page-description">
        掌握LangChain4j的Prompt模板系统，学习如何创建动态、可复用的提示词模板，提升AI应用的灵活性和可维护性。
      </p>

      <nav className="toc-nav">
        <h3 className="toc-nav-title">目录</h3>
        <ol className="toc-list">
          <li className="toc-item"><span className="toc-number">1.</span> <a href="#基础概念" className="toc-link">基础概念</a></li>
          <li className="toc-item"><span className="toc-number">2.</span> <a href="#创建和使用模板" className="toc-link">创建和使用模板</a></li>
          <li className="toc-item"><span className="toc-number">3.</span> <a href="#AiServices集成" className="toc-link">AiServices集成</a></li>
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
          Prompt模板是一种预定义的提示词结构，支持变量替换，使得同一个模板可以生成不同的提示词。
        </p>

        <CodeBlockWithCopy language="java" filename="BasicTemplateExample.java" code={basicTemplate} />

        <h3 className="subsection-title">1.2 变量语法</h3>
        <p className="paragraph">LangChain4j支持多种变量语法：</p>

        <div className="grid-3col">
          <div className="card-indigo">
            <h4 className="card-title-indigo">{"{{it}}"}</h4>
            <p className="card-description-indigo">单变量快捷方式</p>
            <div className="code-inline">template.apply("value")</div>
          </div>
          <div className="card-blue">
            <h4 className="card-title-blue">{"{{name}}"}</h4>
            <p className="card-description-blue">命名变量</p>
            <div className="code-inline">variables.put("name", "John")</div>
          </div>
          <div className="card-green">
            <h4 className="card-title-green">特殊变量</h4>
            <p className="card-description-green">自动填充</p>
            <div className="code-inline">{"{{current_date}}"}</div>
          </div>
        </div>
      </section>

      <section id="创建和使用模板" className="content-section">
        <SectionHeader number={2} title="创建和使用模板" />

        <h3 className="subsection-title">2.1 使用单个变量（{"{{it}}"}）</h3>
        <p className="paragraph">最简单的使用场景，只有一个变量的模板：</p>

        <CodeBlockWithCopy language="java" filename="ApplySingleVarExample.java" code={applySingleVar} />

        <h3 className="subsection-title">2.2 使用多个变量</h3>
        <p className="paragraph">使用Map传递多个变量值：</p>

        <CodeBlockWithCopy language="java" filename="ApplyMultipleVarsExample.java" code={applyMultipleVars} />

        <TipBox type="tip" title="变量命名建议">
          <ul className="tip-box-list">
            <li>使用有意义的变量名，如{"{{user_name}}"}而非{"{{n}}"} </li>
            <li>保持命名风格一致，推荐使用snake_case</li>
            <li>避免使用保留字和特殊字符</li>
          </ul>
        </TipBox>
      </section>

      <section id="AiServices集成" className="content-section">
        <SectionHeader number={3} title="AiServices集成" />

        <h3 className="subsection-title">3.1 @SystemMessage 和 @UserMessage</h3>
        <p className="paragraph">在AiServices中使用注解定义模板：</p>

        <CodeBlockWithCopy language="java" filename="SystemUserTemplateExample.java" code={systemUserTemplate} />

        <h3 className="subsection-title">3.2 方法参数映射</h3>
        <p className="paragraph">方法参数与模板变量的映射规则：</p>

        <CodeBlockWithCopy
          language="java"
          filename="MyService.java"
          code={`interface MyService {
    @UserMessage("Process {{item}} with {{option}} enabled")
    String process(
        @V("item") String item,         // → {{item}}
        @V("option") boolean option,    // → {{option}}
        String unmarkedParam            // 不映射到任何变量
    );
}`}
        />

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
        <p className="paragraph">使用if/else指令根据条件显示不同内容：</p>

        <CodeBlockWithCopy language="java" filename="ConditionalTemplateExample.java" code={conditionalTemplate} />

        <h3 className="subsection-title">4.2 循环渲染</h3>
        <p className="paragraph">使用for指令遍历列表：</p>

        <CodeBlockWithCopy language="java" filename="LoopTemplateExample.java" code={loopTemplate} />

        <h3 className="subsection-title">4.3 特殊变量</h3>
        <p className="paragraph">LangChain4j提供自动填充的特殊变量：</p>

        <div className="grid-3col">
          <div className="card-indigo">
            <h4 className="card-title-indigo">{"{{current_date}}"}</h4>
            <p className="card-description-indigo">当前日期：LocalDate.now()</p>
            <div className="code-inline">格式：2025-02-16</div>
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

        <CodeBlockWithCopy language="java" filename="ChatbotTemplateExample.java" code={chatbotTemplate} />

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

        <CodeBlockWithCopy language="java" filename="RagTemplateExample.java" code={ragTemplate} />

        <h3 className="subsection-title">5.3 代码生成器</h3>
        <p className="paragraph">使用模板生成代码：</p>

        <CodeBlockWithCopy language="java" filename="CodeGenTemplateExample.java" code={codeGenTemplate} />
      </section>

      <section id="最佳实践" className="content-section">
        <SectionHeader number={6} title="最佳实践" />

        <h3 className="subsection-title">6.1 性能优化</h3>
        <p className="paragraph">优化Prompt模板的性能和资源使用：</p>

        <CodeBlockWithCopy language="java" filename="PerformanceOptimization.java" code={performanceOptimization} />

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
      </section>

      <section id="常见问题" className="content-section">
        <SectionHeader number={7} title="常见问题" />

        <h3 className="subsection-title">7.1 变量未正确替换</h3>
        <p className="paragraph">最常见的问题之一，变量名不匹配导致替换失败：</p>

        <CodeBlockWithCopy language="java" filename="Troubleshooting.java" code={troubleshooting} />

        <h3 className="subsection-title">7.2 FAQ</h3>
        <div className="faq-section">
          <div className="faq-item">
            <h4 className="faq-question">Q: 模板变量和AI Services的@V注解有什么区别？</h4>
            <p className="faq-answer">
              A: 模板变量用于PromptTemplate.apply()，@V注解用于AiServices方法参数绑定。两者功能相似但使用场景不同。
            </p>
          </div>

          <div className="faq-item">
            <h4 className="faq-question">Q: 可以在一个模板中使用多次相同的变量吗？</h4>
            <p className="faq-answer">
              A: 可以。同一个变量可以在模板中多次出现，apply时会全部替换为相同的值。
            </p>
          </div>

          <div className="faq-item">
            <h4 className="faq-question">Q: 如何处理模板中的空值或缺失值？</h4>
            <p className="faq-answer">
              A: 使用Java的Optional或三元运算符提供默认值，确保模板变量始终有值。
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
          '<strong>最佳实践</strong>：性能优化、模板设计原则',
        ]}
        footer="🎉 恭喜你掌握了Prompt模板！继续学习Embedding模型，为构建RAG系统打下基础。"
      />
    </Layout>
  );
};

export default PromptTemplatesPage;
