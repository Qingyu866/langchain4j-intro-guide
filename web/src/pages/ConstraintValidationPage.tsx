import Layout from '../components/layout/Layout';
import { Tag, SectionHeader, CodeBlockWithCopy, TipBox, MermaidChart } from '../components/ui';

const basicValidationCode = `import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.system.SystemMessage;
import dev.langchain4j.service.user.UserMessage;
import dev.langchain4j.service.validation.Validate;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;

interface Translator {
    @SystemMessage("你是一个专业的翻译员")
    @UserMessage("将以下文本翻译为 {{targetLang}}: {{text}}")
    String translate(
        @Validate(minLength = 1, maxLength = 5000) String text,
        @Validate(allowedValues = {"英语", "日语", "法语", "德语"}) String targetLang
    );
}

ChatLanguageModel model = OpenAiChatModel.builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .build();

Translator translator = AiServices.builder(Translator.class)
    .chatLanguageModel(model)
    .build();

// ✅ 有效调用
String result1 = translator.translate("Hello, world!", "日语");

// ❌ 抛出 ValidationException：text 超过最大长度
String result2 = translator.translate("A".repeat(5001), "英语");

// ❌ 抛出 ValidationException：targetLang 不在允许列表中
String result3 = translator.translate("Hello", "西班牙语");`;

const customValidatorCode = `import dev.langchain4j.service.validation.ValidationException;
import dev.langchain4j.service.validation.Validator;

/**
 * 自定义邮箱验证器
 */
public class EmailValidator implements Validator<String> {

    private static final Pattern EMAIL_PATTERN =
        Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");

    @Override
    public void validate(String value) throws ValidationException {
        if (value == null || value.trim().isEmpty()) {
            throw new ValidationException("邮箱地址不能为空");
        }

        if (!EMAIL_PATTERN.matcher(value).matches()) {
            throw new ValidationException(
                "邮箱地址格式不正确: " + value
            );
        }

        // 验证域名长度
        String domain = value.substring(value.indexOf("@") + 1);
        if (domain.length() > 255) {
            throw new ValidationException(
                "邮箱域名过长: " + domain
            );
        }
    }
}

// 使用自定义验证器
interface UserService {
    @UserMessage("发送验证邮件到 {{email}}")
    String sendVerificationEmail(
        @Validate(validator = EmailValidator.class) String email
    );
}`;

const complexValidationCode = `import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.validation.*;
import dev.langchain4j.data.message.ChatMessage;

/**
 * 用户注册DTO
 */
public record UserRegistration(
    String username,
    String email,
    String password,
    Integer age
) {}

/**
 * 复杂对象验证器
 */
public class UserRegistrationValidator implements Validator<UserRegistration> {

    private final PasswordValidator passwordValidator = new PasswordValidator();
    private final EmailValidator emailValidator = new EmailValidator();

    @Override
    public void validate(UserRegistration registration) throws ValidationException {
        // 用户名验证
        if (registration.username() == null ||
            registration.username().length() < 3 ||
            registration.username().length() > 20) {
            throw new ValidationException(
                "用户名长度必须在3-20个字符之间"
            );
        }

        // 用户名格式（只允许字母、数字、下划线）
        if (!registration.username().matches("^[a-zA-Z0-9_]+$")) {
            throw new ValidationException(
                "用户名只能包含字母、数字和下划线"
            );
        }

        // 邮箱验证
        emailValidator.validate(registration.email());

        // 密码验证
        passwordValidator.validate(registration.password());

        // 年龄验证
        if (registration.age() != null &&
            (registration.age() < 13 || registration.age() > 120)) {
            throw new ValidationException(
                "年龄必须在13-120岁之间"
            );
        }
    }
}

/**
 * 密码强度验证器
 */
public class PasswordValidator implements Validator<String> {

    @Override
    public void validate(String password) throws ValidationException {
        if (password == null || password.length() < 8) {
            throw new ValidationException(
                "密码长度至少为8个字符"
            );
        }

        if (password.length() > 128) {
            throw new ValidationException(
                "密码长度不能超过128个字符"
            );
        }

        // 必须包含大小写字母、数字
        if (!password.matches(".*[A-Z].*")) {
            throw new ValidationException(
                "密码必须包含至少一个大写字母"
            );
        }

        if (!password.matches(".*[a-z].*")) {
            throw new ValidationException(
                "密码必须包含至少一个小写字母"
            );
        }

        if (!password.matches(".*\\d.*")) {
            throw new ValidationException(
                "密码必须包含至少一个数字"
            );
        }

        // 检查常见弱密码
        String[] weakPasswords = {
            "password123", "admin123", "qwerty123"
        };
        for (String weak : weakPasswords) {
            if (password.toLowerCase().contains(weak)) {
                throw new ValidationException(
                    "密码不能包含常见弱密码模式"
                );
            }
        }
    }
}

// 使用复杂验证
interface RegistrationService {
    @UserMessage("创建用户账户: {{user}}")
    String register(
        @Validate(validator = UserRegistrationValidator.class)
        UserRegistration user
    );
}`;

const validationHandlingCode = `import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.validation.ValidationException;
import dev.langchain4j.model.chat.ChatLanguageModel;

interface Assistant {
    @Validate(minLength = 1, maxLength = 1000)
    String chat(String message);
}

ChatLanguageModel model = OpenAiChatModel.builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .build();

Assistant assistant = AiServices.builder(Assistant.class)
    .chatLanguageModel(model)
    .build();

// 方式1: try-catch 捕获验证异常
public String safeChat(String userInput) {
    try {
        return assistant.chat(userInput);
    } catch (ValidationException e) {
        // 记录验证失败
        logger.warn("输入验证失败: {}", e.getMessage());

        // 返回友好的错误提示
        return "输入内容长度必须在1-1000个字符之间";
    }
}

// 方式2: 提前验证（避免调用LLM）
public boolean validateBeforeChat(String message) {
    if (message == null || message.isEmpty()) {
        return false;
    }

    if (message.length() > 1000) {
        return false;
    }

    return true;
}

// 方式3: 全局异常处理器（Spring Boot）
@RestControllerAdvice
public class AiServiceExceptionHandler {

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            ValidationException ex) {

        ErrorResponse response = new ErrorResponse(
            "VALIDATION_ERROR",
            ex.getMessage(),
            LocalDateTime.now()
        );

        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(response);
    }
}

record ErrorResponse(
    String code,
    String message,
    LocalDateTime timestamp
) {}`;

const ragValidationCode = `import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.validation.Validate;
import dev.langchain4j.rag.query.Query;
import dev.langchain4j.rag.query.Transformer;

/**
 * RAG 查询验证器
 */
class QueryValidator implements Validator<Query> {

    @Override
    public void validate(Query query) throws ValidationException {
        String text = query.text();

        // 查询不能为空
        if (text == null || text.trim().isEmpty()) {
            throw new ValidationException("查询内容不能为空");
        }

        // 查询长度限制
        if (text.length() > 500) {
            throw new ValidationException(
                "查询长度不能超过500个字符"
            );
        }

        // 检查是否包含恶意模式
        String[] maliciousPatterns = {
            "DROP TABLE",
            "UNION SELECT",
            "<script>"
        };

        for (String pattern : maliciousPatterns) {
            if (text.toUpperCase().contains(pattern)) {
                throw new ValidationException(
                    "查询包含恶意内容"
                );
            }
        }

        // 查询语言检测（只支持中英文）
        if (!text.matches("^[\\u4e00-\\u9fa5a-zA-Z0-9\\s\\p{P}]+$")) {
            throw new ValidationException(
                "查询仅支持中文和英文"
            );
        }
    }
}

interface KnowledgeBase {
    @UserMessage("基于以下知识回答问题: {{query}}")
    String query(
        @Validate(validator = QueryValidator.class)
        Query query
    );
}

// 使用示例
KnowledgeBase kb = AiServices.builder(KnowledgeBase.class)
    .chatLanguageModel(model)
    .contentRetriever(retriever)
    .build();

// ✅ 有效查询
String answer1 = kb.query(new Query("什么是LangChain4j？"));

// ❌ 无效查询（抛出异常）
String answer2 = kb.query(new Query(""));  // 空
String answer3 = kb.query(new Query("A".repeat(501)));  // 太长
String answer4 = kb.query(new Query("DROP TABLE users;"));  // 恶意`;

const asyncValidationCode = `import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.validation.Validate;
import java.util.concurrent.CompletableFuture;

interface AsyncAssistant {
    @Validate(minLength = 1, maxLength = 1000)
    CompletableFuture<String> chatAsync(String message);
}

// 异步服务
AsyncAssistant asyncAssistant = AiServices.builder(AsyncAssistant.class)
    .chatLanguageModel(model)
    .build();

// 异步调用
public CompletableFuture<String> chatWithValidationAsync(
        String message,
        Consumer<String> onSuccess,
        Consumer<Throwable> onError) {

    return asyncAssistant.chatAsync(message)
        .thenAccept(onSuccess)
        .exceptionally(ex -> {
            // 处理验证异常
            if (ex.getCause() instanceof ValidationException) {
                onError.accept(ex.getCause());
            } else {
                onError.accept(ex);
            }
            return null;
        });
}

// 使用示例
chatWithValidationAsync(
    "Hello!",
    response -> System.out.println("回复: " + response),
    error -> System.err.println("错误: " + error.getMessage())
);`;

const ConstraintValidationPage = () => {
  return (
    <Layout>
      <div className="page-tags">
        <Tag variant="indigo">参数验证</Tag>
        <Tag variant="red">安全防护</Tag>
        <Tag variant="green">数据完整性</Tag>
      </div>

      <h1 className="page-title">Constraint Validation</h1>
      <p className="page-description">
        深入理解 LangChain4j 的参数约束验证机制，构建安全可靠的 AI 应用。
      </p>

      <nav className="toc-nav">
        <h3 className="toc-title">目录</h3>
        <ol className="toc-list">
          <li className="toc-item"><span className="toc-number">1.</span> <a href="#overview" className="toc-link">验证概述</a></li>
          <li className="toc-item"><span className="toc-number">2.</span> <a href="#basic" className="toc-link">基础验证</a></li>
          <li className="toc-item"><span className="toc-number">3.</span> <a href="#custom" className="toc-link">自定义验证器</a></li>
          <li className="toc-item"><span className="toc-number">4.</span> <a href="#complex" className="toc-link">复杂对象验证</a></li>
          <li className="toc-item"><span className="toc-number">5.</span> <a href="#handling" className="toc-link">错误处理</a></li>
          <li className="toc-item"><span className="toc-number">6.</span> <a href="#rag" className="toc-link">RAG 场景验证</a></li>
          <li className="toc-item"><span className="toc-number">7.</span> <a href="#best-practices" className="toc-link">最佳实践</a></li>
        </ol>
      </nav>

      <section id="overview" className="content-section">
        <SectionHeader number={1} title="验证概述" />
        <p className="paragraph">
          Constraint Validation 是 LangChain4j AiServices 的安全特性，用于在调用 LLM 之前验证方法参数，确保数据符合预期，避免无效或恶意请求到达 LLM。
        </p>

        <h3 className="subsection-title">1.1 为什么需要参数验证</h3>
        <p className="text-gray-700 mb-4">参数验证对于生产环境的 AI 应用至关重要：</p>

        <div className="grid-2col">
          <div className="card card-blue">
            <h4 className="font-semibold text-blue-800 mb-2">💰 成本控制</h4>
            <p className="text-blue-700 text-sm">避免无效请求浪费 LLM 配额和费用</p>
          </div>
          <div className="card card-green">
            <h4 className="font-semibold text-green-800 mb-2">🛡️ 安全防护</h4>
            <p className="text-green-700 text-sm">防止恶意输入和 Prompt Injection</p>
          </div>
          <div className="card card-purple">
            <h4 className="font-semibold text-purple-800 mb-2">✅ 数据完整性</h4>
            <p className="text-purple-700 text-sm">确保数据符合业务规则和格式要求</p>
          </div>
          <div className="card card-orange">
            <h4 className="font-semibold text-orange-800 mb-2">⚡ 性能优化</h4>
            <p className="text-orange-700 text-sm">提前拦截无效请求，减少 LLM 调用</p>
          </div>
        </div>

        <h3 className="subsection-title mt-6">1.2 验证工作流程</h3>
        <p className="text-gray-700 mb-4">完整的参数验证流程：</p>

        <MermaidChart chart={`
          graph TD
              A[👤 用户请求] --> B[🔍 参数验证]
              B --> C{数据有效?}
              C -->|❌ 无效| D[⚠️ 抛出 ValidationException]
              D --> E[📝 返回错误信息]
              C -->|✅ 有效| F[🤖 调用 LLM]
              F --> G[✅ 返回结果]

              style B fill:#fef3c7
              style D fill:#fecaca
              style F fill:#d1fae5
              style G fill:#dbeafe
        `} />
      </section>

      <section id="basic" className="content-section">
        <SectionHeader number={2} title="基础验证" />
        <p className="paragraph">
          使用 @Validate 注解进行基础的参数验证。
        </p>

        <h3 className="subsection-title">2.1 @Validate 注解属性</h3>
        <p className="text-gray-700 mb-4">@Validate 注解支持多种内置验证规则：</p>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>属性</th>
                <th>类型</th>
                <th>说明</th>
                <th>示例</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>minLength</td>
                <td>int</td>
                <td>最小长度</td>
                <td>@Validate(minLength = 1)</td>
              </tr>
              <tr>
                <td>maxLength</td>
                <td>int</td>
                <td>最大长度</td>
                <td>@Validate(maxLength = 5000)</td>
              </tr>
              <tr>
                <td>min</td>
                <td>double</td>
                <td>最小值</td>
                <td>@Validate(min = 0.0)</td>
              </tr>
              <tr>
                <td>max</td>
                <td>double</td>
                <td>最大值</td>
                <td>@Validate(max = 100.0)</td>
              </tr>
              <tr>
                <td>pattern</td>
                <td>String</td>
                <td>正则表达式</td>
                <td>@Validate(pattern = "^[a-zA-Z]+$")</td>
              </tr>
              <tr>
                <td>allowedValues</td>
                <td>String[]</td>
                <td>允许的值列表</td>
                <td>@Validate(allowedValues = &#123;"en", "zh"&#125;)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="subsection-title">2.2 基础验证示例</h3>
        <p className="text-gray-700 mb-4">使用内置验证规则进行参数验证：</p>

        <CodeBlockWithCopy
          code={basicValidationCode}
          language="java"
          filename="BasicValidationExample.java"
        />

        <TipBox variant="warning" title="验证时机">
          <p className="mb-2"><strong>重要提示</strong>：验证在方法调用时立即执行，发生在调用 LLM 之前。这意味着：</p>
          <ul className="list-styled">
            <li>验证失败时<strong>不会</strong>调用 LLM，节省成本</li>
            <li>验证失败抛出 <code>ValidationException</code></li>
            <li>必须捕获异常或让上层处理</li>
            <li>所有参数验证通过后才会构造 Prompt 并调用 LLM</li>
          </ul>
        </TipBox>
      </section>

      <section id="custom" className="content-section">
        <SectionHeader number={3} title="自定义验证器" />
        <p className="paragraph">
          对于复杂的验证逻辑，可以实现自定义验证器。
        </p>

        <h3 className="subsection-title">3.1 实现 Validator 接口</h3>
        <p className="text-gray-700 mb-4">创建自定义验证器需要实现 Validator 接口：</p>

        <CodeBlockWithCopy
          code={customValidatorCode}
          language="java"
          filename="CustomValidatorExample.java"
        />

        <h3 className="subsection-title">3.2 验证器设计原则</h3>
        <p className="text-gray-700 mb-4">设计良好的验证器应遵循以下原则：</p>

        <div className="grid-2col">
          <div className="card card-blue">
            <h4 className="font-semibold text-blue-800 mb-2">单一职责</h4>
            <p className="text-blue-700 text-sm">每个验证器只负责一种验证逻辑</p>
          </div>
          <div className="card card-green">
            <h4 className="font-semibold text-green-800 mb-2">明确错误信息</h4>
            <p className="text-green-700 text-sm">提供清晰的错误提示，便于定位问题</p>
          </div>
          <div className="card card-purple">
            <h4 className="font-semibold text-purple-800 mb-2">性能优先</h4>
            <p className="text-purple-700 text-sm">快速失败，先检查简单条件</p>
          </div>
          <div className="card card-orange">
            <h4 className="font-semibold text-orange-800 mb-2">无状态设计</h4>
            <p className="text-orange-700 text-sm">验证器应该是无状态的，可复用</p>
          </div>
        </div>

        <TipBox variant="info" title="验证器复用">
          <ul className="list-styled">
            <li><strong>组合验证器</strong>：一个验证器可以调用其他验证器</li>
            <li><strong>验证器链</strong>：按顺序执行多个验证器</li>
            <li><strong>条件验证</strong>：根据参数值决定是否执行某些验证</li>
            <li><strong>国际化</strong>：支持多语言的错误消息</li>
          </ul>
        </TipBox>
      </section>

      <section id="complex" className="content-section">
        <SectionHeader number={4} title="复杂对象验证" />
        <p className="paragraph">
          验证复杂对象（DTO、Record 等）的所有字段。
        </p>

        <h3 className="subsection-title">4.1 完整示例：用户注册验证</h3>
        <p className="text-gray-700 mb-4">验证包含多个字段的复杂对象：</p>

        <CodeBlockWithCopy
          code={complexValidationCode}
          language="java"
          filename="ComplexObjectValidation.java"
        />

        <TipBox variant="success" title="复杂验证最佳实践">
          <ul className="list-styled">
            <li><strong>分层验证</strong>：将复杂验证拆分为多个简单验证器</li>
            <li><strong>早期失败</strong>：先检查简单条件，再检查复杂条件</li>
            <li><strong>上下文信息</strong>：在错误消息中提供足够的上下文</li>
            <li><strong>可测试性</strong>：为每个验证器编写单元测试</li>
          </ul>
        </TipBox>
      </section>

      <section id="handling" className="content-section">
        <SectionHeader number={5} title="错误处理" />
        <p className="paragraph">
          优雅地处理验证失败异常。
        </p>

        <h3 className="subsection-title">5.1 异常处理策略</h3>
        <p className="text-gray-700 mb-4">三种常见的验证异常处理方式：</p>

        <CodeBlockWithCopy
          code={validationHandlingCode}
          language="java"
          filename="ValidationHandling.java"
        />

        <h3 className="subsection-title">5.2 错误响应设计</h3>
        <p className="text-gray-700 mb-4">提供友好的错误响应：</p>

        <div className="info-card info-card-blue">
          <h4 className="font-semibold text-blue-900 mb-3">错误响应最佳实践</h4>
          <ul className="text-blue-800 space-y-2">
            <li><strong>清晰的错误代码</strong>：使用标准化的错误码（VALIDATION_ERROR）</li>
            <li><strong>人类可读的消息</strong>：描述问题而不是技术细节</li>
            <li><strong>修复建议</strong>：告诉用户如何解决问题</li>
            <li><strong>请求ID</strong>：便于日志追踪和调试</li>
            <li><strong>时间戳</strong>：记录错误发生的时间</li>
          </ul>
        </div>
      </section>

      <section id="rag" className="content-section">
        <SectionHeader number={6} title="RAG 场景验证" />
        <p className="paragraph">
          在 RAG 应用中验证查询内容，确保安全和质量。
        </p>

        <h3 className="subsection-title">6.1 查询验证器</h3>
        <p className="text-gray-700 mb-4">验证 RAG 查询的完整性和安全性：</p>

        <CodeBlockWithCopy
          code={ragValidationCode}
          language="java"
          filename="RagQueryValidation.java"
        />

        <h3 className="subsection-title">6.2 RAG 验证考虑因素</h3>
        <p className="text-gray-700 mb-4">RAG 场景特有的验证要点：</p>

        <div className="grid-2col">
          <div className="card card-red">
            <h4 className="font-semibold text-red-800 mb-2">安全防护</h4>
            <ul className="text-red-700 text-sm space-y-1">
              <li>检测 SQL 注入模式</li>
              <li>检测 XSS 攻击向量</li>
              <li>检测 Prompt Injection</li>
              <li>过滤敏感关键词</li>
            </ul>
          </div>
          <div className="card card-yellow">
            <h4 className="font-semibold text-yellow-800 mb-2">质量保证</h4>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>最小查询长度</li>
              <li>最大查询长度</li>
              <li>语言检测</li>
              <li>字符编码验证</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="best-practices" className="content-section">
        <SectionHeader number={7} title="最佳实践" />
        <p className="paragraph">
          生产环境中使用 Constraint Validation 的最佳实践。
        </p>

        <h3 className="subsection-title">7.1 验证策略</h3>
        <div className="info-card info-card-gray mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">验证层级</h4>
          <ol className="list-styled">
            <li><strong>客户端验证</strong>：在 UI 层提供即时反馈</li>
            <li><strong>API 层验证</strong>：在 REST Controller 验证请求参数</li>
            <li><strong>Service 层验证</strong>：使用 @Validate 验证 LLM 参数</li>
            <li><strong>数据库验证</strong>：最后的防线，检查约束</li>
          </ol>
        </div>

        <h3 className="subsection-title">7.2 性能优化</h3>
        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>快速失败</strong>：先检查简单条件（长度、格式），再检查复杂条件</li>
          <li><strong>缓存正则</strong>：重复使用的正则表达式进行预编译</li>
          <li><strong>异步验证</strong>：对于耗时验证（如远程服务），考虑异步处理</li>
          <li><strong>条件验证</strong>：只在必要时执行昂贵的验证</li>
        </ul>

        <h3 className="subsection-title">7.3 测试覆盖</h3>
        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>边界测试</strong>：测试最小值、最大值、空值等边界条件</li>
          <li><strong>异常测试</strong>：确保验证失败时抛出正确的异常</li>
          <li><strong>集成测试</strong>：测试完整的验证流程</li>
          <li><strong>性能测试</strong>：确保验证不会成为性能瓶颈</li>
        </ul>

        <h3 className="subsection-title">7.4 异步验证</h3>
        <p className="text-gray-700 mb-4">对于异步 AI Service，验证机制同样适用：</p>

        <CodeBlockWithCopy
          code={asyncValidationCode}
          language="java"
          filename="AsyncValidationExample.java"
        />

        <TipBox variant="warning" title="安全警告">
          <ul className="list-styled">
            <li><strong>永远不要信任客户端</strong>：客户端验证可被绕过</li>
            <li><strong>验证所有输入</strong>：包括隐藏字段、Cookie、Header</li>
            <li><strong>最小权限原则</strong>：验证失败时只返回必要信息</li>
            <li><strong>日志记录</strong>：记录所有验证失败，便于安全审计</li>
          </ul>
        </TipBox>
      </section>

      <section className="content-section">
        <div className="summary-card">
          <h3 className="text-2xl font-bold mb-4">本章小结</h3>
          <p className="mb-4">全面介绍了 LangChain4j 的 Constraint Validation 机制。通过掌握参数验证，您可以：</p>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li><strong>提升安全性</strong>：防止无效和恶意输入到达 LLM</li>
            <li><strong>降低成本</strong>：提前拦截无效请求，减少 LLM 调用</li>
            <li><strong>改善体验</strong>：提供即时、友好的错误反馈</li>
            <li><strong>保证质量</strong>：确保数据符合业务规则和格式要求</li>
          </ul>
          <div className="border-t border-indigo-400 pt-6">
            <p className="text-sm opacity-80 mb-2">核心特性</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Tag variant="indigo">@Validate 注解</Tag>
              <Tag variant="purple">自定义验证器</Tag>
              <Tag variant="blue">异常处理</Tag>
              <Tag variant="green">RAG 验证</Tag>
            </div>
            <p className="text-sm opacity-80 mb-2">技术栈</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Tag variant="cyan">LangChain4j</Tag>
              <Tag variant="indigo">Spring Boot</Tag>
              <Tag variant="purple">Validator 接口</Tag>
            </div>
            <a href="/advanced-features" className="text-white hover:text-indigo-200 transition-colors">
              下一章：高级特性 →
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ConstraintValidationPage;
