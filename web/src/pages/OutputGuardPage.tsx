import Layout from '../components/layout/Layout';
import { Tag, SectionHeader, CodeBlockWithCopy, TipBox, MermaidChart } from '../components/ui';

const basicGuardCode = `import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.system.SystemMessage;
import dev.langchain4j.service.user.UserMessage;
import dev.langchain4j.service.output.OutputGuard;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;

/**
 * 邮箱地址验证 Guard
 * 确保输出是有效的邮箱格式
 */
class EmailOutputGuard implements OutputGuard<String> {

    private static final Pattern EMAIL_PATTERN =
        Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");

    @Override
    public String validate(String output) {
        if (output == null || output.trim().isEmpty()) {
            throw new OutputGuardException("输出不能为空");
        }

        if (!EMAIL_PATTERN.matcher(output).matches()) {
            throw new OutputGuardException(
                "输出不是有效的邮箱格式: " + output
            );
        }

        // 移除多余的空格
        return output.trim();
    }
}

/**
 * 密码强度 Guard
 * 确保生成的密码符合安全要求
 */
class PasswordOutputGuard implements OutputGuard<String> {

    @Override
    public String validate(String password) {
        // 长度验证
        if (password == null || password.length() < 12) {
            throw new OutputGuardException(
                "密码长度至少为12个字符"
            );
        }

        // 必须包含大写字母
        if (!password.matches(".*[A-Z].*")) {
            throw new OutputGuardException(
                "密码必须包含至少一个大写字母"
            );
        }

        // 必须包含小写字母
        if (!password.matches(".*[a-z].*")) {
            throw new OutputGuardException(
                "密码必须包含至少一个小写字母"
            );
        }

        // 必须包含数字
        if (!password.matches(".*\\d.*")) {
            throw new OutputGuardException(
                "密码必须包含至少一个数字"
            );
        }

        // 必须包含特殊字符
        if (!password.matches(".*[!@#$%^&*].*")) {
            throw new OutputGuardException(
                "密码必须包含至少一个特殊字符"
            );
        }

        return password;
    }
}

interface GeneratorService {
    @SystemMessage("你是一个生成工具")
    @UserMessage("生成一个{{itemType}}")
    String generate(String itemType);
}

ChatLanguageModel model = OpenAiChatModel.builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .build();

// 不使用 Guard - 输出可能不符合要求
GeneratorService unsafeGenerator = AiServices.builder(GeneratorService.class)
    .chatLanguageModel(model)
    .build();

String unsafeEmail = unsafeGenerator.generate("email");  // 可能返回无效格式

// 使用 Guard - 确保输出符合要求
GeneratorService safeGenerator = AiServices.builder(GeneratorService.class)
    .chatLanguageModel(model)
    .outputGuard(EmailOutputGuard.class)  // 注册 Guard
    .build();

try {
    String safeEmail = safeGenerator.generate("email");  // 保证是有效邮箱
    System.out.println("生成的邮箱: " + safeEmail);
} catch (OutputGuardException e) {
    System.err.println("输出验证失败: " + e.getMessage());
    // 可以重试或返回默认值
    String fallbackEmail = "user@example.com";
}`;

const sensitiveDataGuardCode = `import dev.langchain4j.service.output.OutputGuard;
import java.util.regex.Pattern;
import java.util.Set;
import java.util.HashSet;

/**
 * 敏感信息过滤 Guard
 * 防止 LLM 输出包含敏感数据
 */
class SensitiveDataFilterGuard implements OutputGuard<String> {

    // 敏感关键词列表
    private static final Set<String> SENSITIVE_KEYWORDS = Set.of(
        "API_KEY",
        "SECRET_KEY",
        "PASSWORD",
        "TOKEN",
        "CREDENTIAL"
    );

    // 信用卡号模式
    private static final Pattern CREDIT_CARD_PATTERN =
        Pattern.compile("\\b\\d{4}[-\\s]?\\d{4}[-\\s]?\\d{4}[-\\s]?\\d{4}\\b");

    // 社保号模式
    private static final Pattern SSN_PATTERN =
        Pattern.compile("\\b\\d{3}-\\d{2}-\\d{4}\\b");

    // API Key 模式（常见格式）
    private static final Pattern API_KEY_PATTERN =
        Pattern.compile("(?i)(api[_-]?key|secret[_-]?key|token)\\s*[:=]\\s*[\"']?[^\\s\"']{10,}");

    @Override
    public String validate(String output) {
        if (output == null) {
            return null;
        }

        String filtered = output;

        // 1. 检测敏感关键词
        for (String keyword : SENSITIVE_KEYWORDS) {
            if (filtered.toUpperCase().contains(keyword)) {
                throw new OutputGuardException(
                    "输出包含敏感关键词: " + keyword
                );
            }
        }

        // 2. 检测信用卡号
        if (CREDIT_CARD_PATTERN.matcher(filtered).find()) {
            throw new OutputGuardException(
                "输出包含疑似信用卡号"
            );
        }

        // 3. 检测社保号
        if (SSN_PATTERN.matcher(filtered).find()) {
            throw new OutputGuardException(
                "输出包含疑似社保号"
            );
        }

        // 4. 检测 API Key
        if (API_KEY_PATTERN.matcher(filtered).find()) {
            throw new OutputGuardException(
                "输出包含疑似 API Key"
            );
        }

        return filtered;
    }
}

/**
 * PII（个人身份信息）脱敏 Guard
 * 自动脱敏敏感信息
 */
class PIIMaskingGuard implements OutputGuard<String> {

    private static final Pattern EMAIL_PATTERN =
        Pattern.compile("\\b[A-Za-z0-9+_.-]+@(.+\\.)(com|org|net|edu)\\b");

    private static final Pattern PHONE_PATTERN =
        Pattern.compile("\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b");

    @Override
    public String validate(String output) {
        if (output == null) {
            return null;
        }

        String masked = output;

        // 脱敏邮箱（保留第一个字符和域名）
        masked = EMAIL_PATTERN.matcher(masked).replaceAll(match -> {
            String email = match.group();
            int atIndex = email.indexOf('@');
            String username = email.substring(0, atIndex);
            String domain = email.substring(atIndex);
            String maskedUsername = username.charAt(0) + "***" +
                username.charAt(username.length() - 1);
            return maskedUsername + domain;
        });

        // 脱敏电话号码
        masked = PHONE_PATTERN.matcher(masked).replaceAll("***-***-****");

        return masked;
    }
}

// 使用示例
interface ChatService {
    String chat(String message);
}

ChatLanguageModel model = OpenAiChatModel.builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .build();

// 方式1: 拒绝包含敏感信息的输出
ChatService secureChat = AiServices.builder(ChatService.class)
    .chatLanguageModel(model)
    .outputGuard(SensitiveDataFilterGuard.class)
    .build();

try {
    String response = secureChat.chat("我的 API Key 是什么？");
    // 如果 LLM 尝试输出 API Key，会抛出 OutputGuardException
} catch (OutputGuardException e) {
    System.err.println("安全拦截: " + e.getMessage());
    // 返回安全的错误消息
    response = "抱歉，我不能提供敏感信息。";
}

// 方式2: 自动脱敏敏感信息
ChatService maskedChat = AiServices.builder(ChatService.class)
    .chatLanguageModel(model)
    .outputGuard(PIIMaskingGuard.class)
    .build();

String response = maskedChat.chat("联系管理员张三，邮箱 zhangsan@example.com，电话 123-456-7890");
// 输出: "联系管理员张三，邮箱 z***n@example.com，电话 ***-***-****"`;

const formatEnforcementCode = `import dev.langchain4j.service.output.OutputGuard;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.JsonNode;

/**
 * JSON 格式验证 Guard
 * 确保 LLM 输出是有效的 JSON
 */
class JsonFormatGuard implements OutputGuard<String> {

    private static final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String validate(String output) {
        if (output == null || output.trim().isEmpty()) {
            throw new OutputGuardException("输出不能为空");
        }

        try {
            // 尝试解析 JSON
            JsonNode jsonNode = mapper.readTree(output);

            // 验证 JSON 结构（如果需要）
            if (!jsonNode.isObject()) {
                throw new OutputGuardException(
                    "输出必须是 JSON 对象格式"
                );
            }

            // 验证必需字段
            if (!jsonNode.has("result")) {
                throw new OutputGuardException(
                    "JSON 必须包含 'result' 字段"
                );
            }

            // 返回格式化的 JSON（美化）
            return mapper.writerWithDefaultPrettyPrinter()
                .writeValueAsString(jsonNode);

        } catch (Exception e) {
            throw new OutputGuardException(
                "输出不是有效的 JSON 格式: " + e.getMessage()
            );
        }
    }
}

/**
 * 结构化数据验证 Guard
 * 验证 POJO 对象的 JSON 输出
 */
class UserDataGuard implements OutputGuard<String> {

    private static final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String validate(String output) {
        try {
            JsonNode jsonNode = mapper.readTree(output);

            // 验证用户数据结构
            validateRequiredField(jsonNode, "name", String.class);
            validateRequiredField(jsonNode, "age", Integer.class);
            validateRequiredField(jsonNode, "email", String.class);

            // 验证年龄范围
            int age = jsonNode.get("age").asInt();
            if (age < 0 || age > 150) {
                throw new OutputGuardException(
                    "年龄必须在 0-150 之间，当前值: " + age
                );
            }

            // 验证邮箱格式
            String email = jsonNode.get("email").asText();
            if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                throw new OutputGuardException(
                    "无效的邮箱格式: " + email
                );
            }

            return output;

        } catch (OutputGuardException e) {
            throw e;
        } catch (Exception e) {
            throw new OutputGuardException(
                "用户数据验证失败: " + e.getMessage()
            );
        }
    }

    private void validateRequiredField(
            JsonNode json,
            String fieldName,
            Class<?> type) {

        if (!json.has(fieldName)) {
            throw new OutputGuardException(
                "缺少必需字段: " + fieldName
            );
        }

        JsonNode field = json.get(fieldName);
        if (field.isNull()) {
            throw new OutputGuardException(
                "字段 " + fieldName + " 不能为空"
            );
        }

        // 类型验证
        if (type == String.class && !field.isTextual()) {
            throw new OutputGuardException(
                "字段 " + fieldName + " 必须是字符串类型"
            );
        }

        if (type == Integer.class && !field.isInt()) {
            throw new OutputGuardException(
                "字段 " + fieldName + " 必须是整数类型"
            );
        }
    }
}

// 使用示例
interface DataExtractor {
    @UserMessage("从以下文本中提取用户信息，返回 JSON 格式: {{text}}")
    String extractUserInfo(String text);
}

ChatLanguageModel model = OpenAiChatModel.builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .temperature(0.0)  // 使用低温度提高输出稳定性
    .build();

// 使用 JSON 格式 Guard
DataExtractor extractor = AiServices.builder(DataExtractor.class)
    .chatLanguageModel(model)
    .outputGuard(JsonFormatGuard.class)
    .build();

String text = "用户张三，25岁，邮箱 zhangsan@example.com";
try {
    String json = extractor.extractUserInfo(text);
    // 保证返回有效的 JSON，包含必需字段
    System.out.println(json);
} catch (OutputGuardException e) {
    System.err.println("格式验证失败: " + e.getMessage());
    // 可以重试或使用默认值
}`;

const contentModerationCode = `import dev.langchain4j.service.output.OutputGuard;
import java.util.Set;
import java.util.HashSet;

/**
 * 内容审核 Guard
 * 防止输出不当内容
 */
class ContentModerationGuard implements OutputGuard<String> {

    // 违禁词列表
    private static final Set<String> BANNED_WORDS = Set.of(
        "暴力", "恐怖", "自杀", "歧视", "仇恨",
        "色情", "赌博", "毒品"
    );

    // 辱骂性语言模式
    private static final Pattern ABUSIVE_PATTERN = Pattern.compile(
        "(?i).*\\b(白痴|笨蛋|傻[东西×])\\b.*"
    );

    @Override
    public String validate(String output) {
        if (output == null || output.trim().isEmpty()) {
            return output;
        }

        String normalized = output.toLowerCase();

        // 1. 检查违禁词
        for (String word : BANNED_WORDS) {
            if (normalized.contains(word.toLowerCase())) {
                throw new OutputGuardException(
                    "输出包含违禁内容，已被拦截"
                );
            }
        }

        // 2. 检查辱骂性语言
        if (ABUSIVE_PATTERN.matcher(output).matches()) {
            throw new OutputGuardException(
                "输出包含不当语言"
            );
        }

        // 3. 检查输出长度（防止超长响应）
        if (output.length() > 5000) {
            throw new OutputGuardException(
                "输出过长，已限制为 5000 字符"
            );
        }

        return output;
    }
}

/**
 * 专业术语修正 Guard
 * 自动纠正错误的专业术语
 */
class TerminologyCorrectionGuard implements OutputGuard<String> {

    private static final Map<String, String> CORRECTIONS = Map.of(
        "LangChain", "LangChain4j",
        "OpenAI API", "OpenAI",
        "AI聊天机器人", "AI Assistant",
        "向量数据库", "Vector Database"
    );

    @Override
    public String validate(String output) {
        if (output == null) {
            return null;
        }

        String corrected = output;

        // 自动修正术语
        for (Map.Entry<String, String> entry : CORRECTIONS.entrySet()) {
            corrected = corrected.replace(
                entry.getKey(),
                entry.getValue()
            );
        }

        return corrected;
    }
}

/**
 * 多层 Guard 链
 * 按顺序执行多个 Guard
 */
class GuardChain implements OutputGuard<String> {

    private final List<OutputGuard<String>> guards;

    @SafeVarargs
    public GuardChain(OutputGuard<String>... guards) {
        this.guards = List.of(guards);
    }

    @Override
    public String validate(String output) {
        String result = output;

        for (OutputGuard<String> guard : guards) {
            result = guard.validate(result);
        }

        return result;
    }
}

// 使用示例
interface SafeChat {
    @SystemMessage("你是一个专业、友善的 AI 助手")
    String chat(String message);
}

ChatLanguageModel model = OpenAiChatModel.builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .build();

// 组合多个 Guard
GuardChain guardChain = new GuardChain(
    new ContentModerationGuard(),      // 内容审核
    new TerminologyCorrectionGuard(),  // 术语修正
    new SensitiveDataFilterGuard()     // 敏感信息过滤
);

SafeChat safeChat = AiServices.builder(SafeChat.class)
    .chatLanguageModel(model)
    .outputGuard(guardChain)  // 注册 Guard 链
    .build();

try {
    String response = safeChat.chat("你好！");
    // 输出经过:
    // 1. 内容审核检查
    // 2. 术语自动修正
    // 3. 敏感信息过滤
    System.out.println(response);
} catch (OutputGuardException e) {
    System.err.println("内容被拦截: " + e.getMessage());
}`;

const asyncHandlingCode = `import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.output.OutputGuard;
import dev.langchain4j.service.output.OutputGuardException;
import java.util.concurrent.CompletableFuture;

/**
 * 带重试的异步 Guard
 */
class RetryableOutputGuard implements OutputGuard<String> {

    private final OutputGuard<String> delegate;
    private final int maxRetries;

    public RetryableOutputGuard(
            OutputGuard<String> delegate,
            int maxRetries) {
        this.delegate = delegate;
        this.maxRetries = maxRetries;
    }

    @Override
    public String validate(String output) {
        int attempts = 0;
        String lastOutput = output;

        while (attempts <= maxRetries) {
            try {
                return delegate.validate(lastOutput);
            } catch (OutputGuardException e) {
                attempts++;
                if (attempts > maxRetries) {
                    throw new OutputGuardException(
                        "经过 " + maxRetries + " 次重试后仍然验证失败: " +
                        e.getMessage()
                    );
                }

                // 记录重试
                System.out.println(
                    "第 " + attempts + " 次验证失败，重试..."
                );

                // 这里可以添加逻辑来修正输出
                // 例如：清理格式、移除非法字符等
                lastOutput = sanitizeOutput(lastOutput);
            }
        }

        return lastOutput;
    }

    private String sanitizeOutput(String output) {
        // 基本的清理逻辑
        return output
            .trim()
            .replaceAll("\\s+", " ")  // 多个空格压缩为一个
            .replaceAll("[^\\x00-\\x7F]", "");  // 移除非 ASCII 字符
    }
}

// 使用示例
interface AsyncService {
    CompletableFuture<String> generateAsync(String prompt);
}

ChatLanguageModel model = OpenAiChatModel.builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .build();

// 创建带重试的 Guard
OutputGuard<String> retryableGuard = new RetryableOutputGuard(
    new JsonFormatGuard(),
    3  // 最多重试 3 次
);

AsyncService service = AiServices.builder(AsyncService.class)
    .chatLanguageModel(model)
    .outputGuard(retryableGuard)
    .build();

// 异步调用
public CompletableFuture<String> generateWithRetry(String prompt) {
    return service.generateAsync(prompt)
        .thenApply(result -> {
            System.out.println("生成成功: " + result);
            return result;
        })
        .exceptionally(ex -> {
            System.err.println("生成失败: " + ex.getMessage());

            // 返回默认值或抛出异常
            if (ex.getCause() instanceof OutputGuardException) {
                return "{\"error\": \"输出验证失败\"}";
            }
            throw new RuntimeException(ex);
        });
}

// 使用
generateWithRetry("生成一个用户信息的 JSON")
    .thenAccept(System.out::println);`;

const OutputGuardPage = () => {
  return (
    <Layout>
      <div className="page-tags">
        <Tag variant="indigo">输出守护</Tag>
        <Tag variant="red">安全防护</Tag>
        <Tag variant="green">内容审核</Tag>
      </div>

      <h1 className="page-title">Output Guard</h1>
      <p className="page-description">
        深入理解 LangChain4j 的输出守护机制，确保 LLM 输出符合预期和安全要求。
      </p>

      <nav className="toc-nav">
        <h3 className="toc-title">目录</h3>
        <ol className="toc-list">
          <li className="toc-item"><span className="toc-number">1.</span> <a href="#overview" className="toc-link">Output Guard 概述</a></li>
          <li className="toc-item"><span className="toc-number">2.</span> <a href="#basic" className="toc-link">基础输出验证</a></li>
          <li className="toc-item"><span className="toc-number">3.</span> <a href="#sensitive-data" className="toc-link">敏感数据防护</a></li>
          <li className="toc-item"><span className="toc-number">4.</span> <a href="#format" className="toc-link">格式强制</a></li>
          <li className="toc-item"><span className="toc-number">5.</span> <a href="#moderation" className="toc-link">内容审核</a></li>
          <li className="toc-item"><span className="toc-number">6.</span> <a href="#handling" className="toc-link">异步与重试</a></li>
          <li className="toc-item"><span className="toc-number">7.</span> <a href="#best-practices" className="toc-link">最佳实践</a></li>
        </ol>
      </nav>

      <section id="overview" className="content-section">
        <SectionHeader number={1} title="Output Guard 概述" />
        <p className="paragraph">
          Output Guard 是 LangChain4j AiServices 的输出验证机制，用于在 LLM 生成内容后、返回给用户前进行验证和过滤，确保输出的安全性、完整性和格式正确性。
        </p>

        <h3 className="subsection-title">1.1 为什么需要 Output Guard</h3>
        <p className="text-gray-700 mb-4">Output Guard 对于生产环境至关重要：</p>

        <div className="grid-2col">
          <div className="card card-red">
            <h4 className="font-semibold text-red-800 mb-2">🔒 安全防护</h4>
            <p className="text-red-700 text-sm">防止输出敏感信息、API Key、密码等</p>
          </div>
          <div className="card card-orange">
            <h4 className="font-semibold text-orange-800 mb-2">✅ 格式保证</h4>
            <p className="text-orange-700 text-sm">确保输出是有效的 JSON、邮箱等格式</p>
          </div>
          <div className="card card-yellow">
            <h4 className="font-semibold text-yellow-800 mb-2">🛡️ 内容审核</h4>
            <p className="text-yellow-700 text-sm">过滤不当、有害、违规内容</p>
          </div>
          <div className="card card-green">
            <h4 className="font-semibold text-green-800 mb-2">🔧 数据修正</h4>
            <p className="text-green-700 text-sm">自动修正错误术语、格式问题</p>
          </div>
        </div>

        <h3 className="subsection-title mt-6">1.2 Output Guard 工作流程</h3>
        <p className="text-gray-700 mb-4">完整的输出验证流程：</p>

        <MermaidChart chart={`
          graph TD
              A[👤 用户请求] --> B[🤖 LLM 处理]
              B --> C[📝 生成原始输出]
              C --> D[🛡️ Output Guard 验证]
              D --> E{输出有效?}
              E -->|❌ 无效| F[⚠️ 抛出异常/重试]
              F --> G{需要重试?}
              G -->|是| B
              G -->|否| H[❌ 返回错误]
              E -->|✅ 有效| I[✅ 返回给用户]

              style D fill:#fef3c7
              style F fill:#fecaca
              style I fill:#d1fae5
        `} />
      </section>

      <section id="basic" className="content-section">
        <SectionHeader number={2} title="基础输出验证" />
        <p className="paragraph">
          实现基础的 Output Guard 来验证 LLM 输出。
        </p>

        <h3 className="subsection-title">2.1 实现 OutputGuard 接口</h3>
        <p className="text-gray-700 mb-4">创建自定义 Output Guard：</p>

        <CodeBlockWithCopy
          code={basicGuardCode}
          language="java"
          filename="BasicOutputGuard.java"
        />

        <TipBox variant="info" title="OutputGuard 接口">
          <ul className="list-styled">
            <li><strong>validate 方法</strong>：接收 LLM 输出，返回验证后的结果</li>
            <li><strong>OutputGuardException</strong>：验证失败时抛出此异常</li>
            <li><strong>返回值</strong>：可以返回原始输出、修正后的输出或抛出异常</li>
            <li><strong>链式调用</strong>：多个 Guard 可以串联执行</li>
          </ul>
        </TipBox>
      </section>

      <section id="sensitive-data" className="content-section">
        <SectionHeader number={3} title="敏感数据防护" />
        <p className="paragraph">
          防止 LLM 输出敏感信息，如 API Key、密码、个人身份信息等。
        </p>

        <h3 className="subsection-title">3.1 敏感信息检测和过滤</h3>
        <p className="text-gray-700 mb-4">检测常见的敏感信息模式：</p>

        <CodeBlockWithCopy
          code={sensitiveDataGuardCode}
          language="java"
          filename="SensitiveDataGuard.java"
        />

        <h3 className="subsection-title">3.2 常见敏感信息类型</h3>
        <div className="info-card info-card-red mb-6">
          <h4 className="font-semibold text-red-900 mb-3">需要保护的敏感信息</h4>
          <ul className="text-red-800 space-y-2">
            <li><strong>凭证类</strong>：API Key、Secret Key、Token、Password</li>
            <li><strong>金融类</strong>：信用卡号、银行账号、社保号</li>
            <li><strong>个人类</strong>：邮箱、电话号码、家庭地址</li>
            <li><strong>医疗类</strong>：病历号、诊断结果</li>
            <li><strong>企业类</strong>：商业机密、内部代码、未公开产品</li>
          </ul>
        </div>

        <TipBox variant="warning" title="防御策略">
          <ul className="list-styled">
            <li><strong>检测模式</strong>：使用正则表达式检测敏感信息格式</li>
            <li><strong>关键词列表</strong>：维护敏感关键词黑名单</li>
            <li><strong>上下文分析</strong>：结合上下文判断信息是否敏感</li>
            <li><strong>自动脱敏</strong>：对检测到的敏感信息进行脱敏处理</li>
          </ul>
        </TipBox>
      </section>

      <section id="format" className="content-section">
        <SectionHeader number={4} title="格式强制" />
        <p className="paragraph">
          确保 LLM 输出符合特定的格式要求。
        </p>

        <h3 className="subsection-title">4.1 JSON 格式验证</h3>
        <p className="text-gray-700 mb-4">验证和强制 JSON 输出格式：</p>

        <CodeBlockWithCopy
          code={formatEnforcementCode}
          language="java"
          filename="FormatGuard.java"
        />

        <h3 className="subsection-title">4.2 常见格式验证场景</h3>
        <div className="grid-2col">
          <div className="card card-blue">
            <h4 className="font-semibold text-blue-800 mb-2">结构化数据</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>JSON 对象验证</li>
              <li>必需字段检查</li>
              <li>数据类型验证</li>
              <li>值范围约束</li>
            </ul>
          </div>
          <div className="card card-purple">
            <h4 className="font-semibold text-purple-800 mb-2">标准格式</h4>
            <ul className="text-purple-700 text-sm space-y-1">
              <li>邮箱格式验证</li>
              <li>电话号码格式</li>
              <li>日期时间格式</li>
              <li>URL 格式检查</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="moderation" className="content-section">
        <SectionHeader number={5} title="内容审核" />
        <p className="paragraph">
          对 LLM 输出进行内容审核，过滤不当内容。
        </p>

        <h3 className="subsection-title">5.1 内容审核 Guard</h3>
        <p className="text-gray-700 mb-4">实现多层内容审核机制：</p>

        <CodeBlockWithCopy
          code={contentModerationCode}
          language="java"
          filename="ContentModerationGuard.java"
        />

        <h3 className="subsection-title">5.2 Guard 链式调用</h3>
        <p className="text-gray-700 mb-4">多个 Guard 按顺序执行：</p>

        <div className="info-card info-card-purple mb-6">
          <h4 className="font-semibold text-purple-900 mb-3">Guard 链执行顺序</h4>
          <ol className="list-styled">
            <li><strong>内容审核 Guard</strong>：首先检查是否包含违禁内容</li>
            <li><strong>术语修正 Guard</strong>：自动修正错误的专业术语</li>
            <li><strong>敏感信息 Guard</strong>：过滤敏感数据</li>
            <li><strong>格式验证 Guard</strong>：确保输出格式正确</li>
          </ol>
        </div>

        <TipBox variant="success" title="Guard 链最佳实践">
          <ul className="list-styled">
            <li><strong>快速失败</strong>：将最可能失败的 Guard 放在前面</li>
            <li><strong>成本考虑</strong>：昂贵的检查（如远程 API）放在最后</li>
            <li><strong>职责分离</strong>：每个 Guard 只负责一种验证逻辑</li>
            <li><strong>日志记录</strong>：记录每个 Guard 的验证结果</li>
          </ul>
        </TipBox>
      </section>

      <section id="handling" className="content-section">
        <SectionHeader number={6} title="异步与重试" />
        <p className="paragraph">
          在异步场景中使用 Output Guard，并实现自动重试机制。
        </p>

        <h3 className="subsection-title">6.1 重试机制</h3>
        <p className="text-gray-700 mb-4">当验证失败时自动重试：</p>

        <CodeBlockWithCopy
          code={asyncHandlingCode}
          language="java"
          filename="RetryableGuard.java"
        />

        <h3 className="subsection-title">6.2 降级策略</h3>
        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>默认值</strong>：验证失败时返回预定义的默认值</li>
          <li><strong>部分内容</strong>：返回部分有效的输出</li>
          <li><strong>错误消息</strong>：返回友好的错误提示</li>
          <li><strong>空响应</strong>：返回空字符串或 null</li>
        </ul>
      </section>

      <section id="best-practices" className="content-section">
        <SectionHeader number={7} title="最佳实践" />
        <p className="paragraph">
          生产环境中使用 Output Guard 的最佳实践。
        </p>

        <h3 className="subsection-title">7.1 Guard 设计原则</h3>
        <div className="grid-2col mb-6">
          <div className="card card-blue">
            <h4 className="font-semibold text-blue-800 mb-2">单一职责</h4>
            <p className="text-blue-700 text-sm">每个 Guard 只负责一种验证</p>
          </div>
          <div className="card card-green">
            <h4 className="font-semibold text-green-800 mb-2">快速失败</h4>
            <p className="text-green-700 text-sm">先检查简单条件</p>
          </div>
          <div className="card card-purple">
            <h4 className="font-semibold text-purple-800 mb-2">明确错误</h4>
            <p className="text-purple-700 text-sm">提供清晰的错误信息</p>
          </div>
          <div className="card card-orange">
            <h4 className="font-semibold text-orange-800 mb-2">性能优先</h4>
            <p className="text-orange-700 text-sm">避免昂贵的操作</p>
          </div>
        </div>

        <h3 className="subsection-title">7.2 性能优化</h3>
        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>缓存结果</strong>：对相同的输出缓存验证结果</li>
          <li><strong>并行验证</strong>：独立的 Guard 可以并行执行</li>
          <li><strong>短路机制</strong>：某些 Guard 失败后立即返回</li>
          <li><strong>条件 Guard</strong>：只在特定情况下启用某些 Guard</li>
        </ul>

        <h3 className="subsection-title">7.3 测试策略</h3>
        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>边界测试</strong>：测试边界值、空值、极大值</li>
          <li><strong>异常测试</strong>：确保各种异常情况被正确处理</li>
          <li><strong>性能测试</strong>：确保 Guard 不影响响应速度</li>
          <li><strong>集成测试</strong>：测试 Guard 与 LLM 的集成</li>
        </ul>

        <TipBox variant="warning" title="安全警告">
          <ul className="list-styled">
            <li><strong>不要完全信任 LLM</strong>：即使使用 Guard，也要持续监控</li>
            <li><strong>日志审计</strong>：记录所有被拦截的输出，便于分析</li>
            <li><strong>定期更新</strong>：及时更新敏感信息模式和违禁词列表</li>
            <li><strong>人工审核</strong>：对高风险场景进行人工复核</li>
          </ul>
        </TipBox>
      </section>

      <section className="content-section">
        <div className="summary-card">
          <h3 className="text-2xl font-bold mb-4">本章小结</h3>
          <p className="mb-4">全面介绍了 LangChain4j 的 Output Guard 机制。通过掌握输出守护，您可以：</p>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li><strong>提升安全性</strong>：防止输出敏感信息和不当内容</li>
            <li><strong>保证质量</strong>：确保输出格式正确、内容合规</li>
            <li><strong>自动修正</strong>：自动修正常见错误和格式问题</li>
            <li><strong>多层防护</strong>：通过 Guard 链实现多层安全防护</li>
            <li><strong>容错能力</strong>：通过重试和降级提高系统稳定性</li>
          </ul>
          <div className="border-t border-indigo-400 pt-6">
            <p className="text-sm opacity-80 mb-2">核心特性</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Tag variant="indigo">OutputGuard</Tag>
              <Tag variant="purple">敏感数据过滤</Tag>
              <Tag variant="blue">格式验证</Tag>
              <Tag variant="green">内容审核</Tag>
              <Tag variant="red">Guard 链</Tag>
            </div>
            <p className="text-sm opacity-80 mb-2">技术栈</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Tag variant="cyan">LangChain4j</Tag>
              <Tag variant="indigo">Spring Boot</Tag>
              <Tag variant="purple">正则表达式</Tag>
              <Tag variant="blue">Jackson JSON</Tag>
            </div>
            <a href="/document-splitting" className="text-white hover:text-indigo-200 transition-colors">
              下一章：文档分割 →
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default OutputGuardPage;
