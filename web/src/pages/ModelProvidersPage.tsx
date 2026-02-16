import Layout from '../components/layout/Layout';
import { Tag, CodeBlockWithCopy, SectionHeader, TipBox, SummarySection, MermaidChart } from '../components/ui';

const ModelProvidersPage = () => {
  const openaiConfig = `import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.chat.ChatLanguageModel;
import static dev.langchain4j.model.openai.OpenAiChatModel.builder;

// 创建GPT-3.5模型
ChatLanguageModel gpt35 = builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .modelName("gpt-3.5-turbo")
    .temperature(0.7)
    .maxTokens(2000)
    .timeout(Duration.ofSeconds(30))
    .build();

// 创建GPT-4模型
ChatLanguageModel gpt4 = builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .modelName("gpt-4")
    .temperature(0.3)
    .maxTokens(4000)
    .timeout(Duration.ofSeconds(60))
    .build();

String response = gpt35.generate("Hello, LangChain4j!");
System.out.println(response);`;

  const anthropicConfig = `import dev.langchain4j.model.anthropic.AnthropicChatModel;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.anthropic.AnthropicStreamingChatModel;
import static dev.langchain4j.model.anthropic.AnthropicChatModel.builder;

// 创建Claude 3模型
AnthropicChatModel claude3 = builder()
    .apiKey(System.getenv("ANTHROPIC_API_KEY"))
    .modelName(CLAUDE_3_SONNET_4_20240514)
    .maxTokens(2000)
    .temperature(0.7)
    .timeout(Duration.ofSeconds(30))
    .build();

// 创建流式Claude模型
AnthropicStreamingChatModel claude3Streaming = builder()
    .apiKey(System.getenv("ANTHROPIC_API_KEY"))
    .modelName(CLAUDE_3_SONNET_4_20240514)
    .maxTokens(4000)
    .temperature(0.3)
    .build();

// 使用流式响应
claude3Streaming.generate("Explain quantum computing.", new StreamingResponseHandler() {
    @Override
    public void onPartialResponse(String partialResponse) {
        System.out.print(partialResponse);
    }

    @Override
    public void onCompleteResponse(String completeResponse) {
        System.out.println("\\n--- COMPLETE ---");
    }

    @Override
    public void onError(Throwable error) {
        System.err.println("Error: " + error.getMessage());
    }
});`;

  const azureConfig = `import dev.langchain4j.model.azure.AzureOpenAiChatModel;
import dev.langchain4j.model.chat.ChatLanguageModel;
import static dev.langchain4j.model.azure.AzureOpenAiChatModel.builder;

// 创建Azure OpenAI模型
ChatLanguageModel azureGpt35 = builder()
    .apiKey(System.getenv("AZURE_OPENAI_API_KEY"))
    .endpoint("https://your-resource.openai.azure.com")
    .deploymentName("gpt-35-turbo")
    .apiVersion("2024-02-15-preview")
    .temperature(0.7)
    .maxTokens(2000)
    .timeout(Duration.ofSeconds(30))
    .build();

String response = azureGpt35.generate("Hello from Azure!");
System.out.println(response);`;

  const huggingfaceConfig = `import dev.langchain4j.model.huggingface.HuggingFaceChatModel;
import dev.langchain4j.model.chat.ChatLanguageModel;
import static dev.langchain4j.model.huggingface.HuggingFaceChatModel.builder;

// 创建Hugging Face模型
ChatLanguageModel hfModel = builder()
    .accessToken(System.getenv("HUGGINGFACE_ACCESS_TOKEN"))
    .modelId("meta-llama/Meta-Llama-3-8B-Instruct")
    .temperature(0.7)
    .maxTokens(2000)
    .timeout(Duration.ofSeconds(30))
    .build();

String response = hfModel.generate("Hello from Hugging Face!");
System.out.println(response);`;

  const googleGeminiConfig = `import dev.langchain4j.model.google.GeminiChatModel;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.google.GeminiStreamingChatModel;
import static dev.langchain4j.model.google.GeminiChatModel.builder;

// 创建Gemini模型
GeminiChatModel gemini = builder()
    .apiKey(System.getenv("GOOGLE_API_KEY"))
    .modelName("gemini-pro")
    .temperature(0.7)
    .maxTokens(2000)
    .timeout(Duration.ofSeconds(30))
    .build();

String response = gemini.generate("Hello, Google!");
System.out.println(response);`;

  const amazonBedrockConfig = `import dev.langchain4j.model.bedrock.BedrockAnthropicMessageChatModel;
import dev.langchain4j.model.chat.ChatLanguageModel;
import static dev.langchain4j.model.bedrock.BedrockAnthropicMessageChatModel.builder;

// 创建Amazon Bedrock模型
BedrockAnthropicMessageChatModel bedrock = builder()
    .credentials(ProviderCredentials.builder()
        .accessKeyId(System.getenv("AWS_ACCESS_KEY_ID"))
        .secretAccessKey(System.getenv("AWS_SECRET_ACCESS_KEY"))
        .region(Region.US_EAST_1)
        .build())
    .model(ANTHROPIC_CLAUDE_V2)
    .temperature(0.7)
    .maxTokens(2000)
    .maxRetries(3)
    .build();

String response = bedrock.generate("Hello from Bedrock!");
System.out.println(response);`;

  const unifiedInterface = `import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.service.AiServices;

// 定义通用的AI Service接口
interface ChatService {
    String chat(String message);
}

// 工厂方法：根据配置选择提供商
public class ChatServiceFactory {
    public static ChatService createChatService(String provider) {
        ChatLanguageModel model;

        switch (provider.toLowerCase()) {
            case "openai":
                model = OpenAiChatModel.builder()
                    .apiKey(System.getenv("OPENAI_API_KEY"))
                    .modelName("gpt-3.5-turbo")
                    .build();
                break;

            case "anthropic":
                model = AnthropicChatModel.builder()
                    .apiKey(System.getenv("ANTHROPIC_API_KEY"))
                    .modelName(CLAUDE_3_SONNET_4_20240514)
                    .build();
                break;

            case "azure":
                model = AzureOpenAiChatModel.builder()
                    .apiKey(System.getenv("AZURE_OPENAI_API_KEY"))
                    .endpoint("https://your-resource.openai.azure.com")
                    .build();
                break;

            default:
                throw new IllegalArgumentException("Unknown provider: " + provider);
        }

        return AiServices.builder(ChatService.class)
            .chatLanguageModel(model)
            .build();
    }
}

// 使用
ChatService service = ChatServiceFactory.createChatService("openai");
String response = service.chat("Hello, unified API!");
System.out.println(response);`;

  const costComparison = `/* 模型提供商成本对比（2025年2月数据）
 * 价格以美元/百万tokens为单位
 * 实际价格可能因模型版本、地区、批量购买等因素而异
 */

public class ModelCostComparison {

    public static void main(String[] args) {
        System.out.println("=== LangChain4j 模型提供商成本对比 ===\\n");

        System.out.println("1. OpenAI GPT系列");
        System.out.println("-".repeat(60));
        System.out.printf("%-20s %-25s %10s %12s %12s%n", 
            "模型", "输入", "输出", "$/1M tokens");
        System.out.printf("%-20s %-25s %10s %12s%n",
            "gpt-4", "$0.50", "$2.50");
        System.out.printf("%-20s %-25s %10s %12s%n",
            "gpt-4-turbo", "$0.50", "$0.30");
        System.out.printf("%-20s %-25s %10s %12s%n",
            "gpt-35-turbo", "$0.15", "$0.002");
        System.out.printf("%-20s %-25s %10s %12s%n",
            "gpt-4", "$30.00", "$60.00");
        System.out.printf("%-20s %-25s %10s %12s%n",
            "gpt-4-turbo", "$0.50", "$15.00");

        System.out.println("\\n2. Anthropic Claude系列");
        System.out.println("-".repeat(60));
        System.out.printf("%-20s %-25s %10s %12s%n",
            "模型", "输入", "输出", "$/1M tokens");
        System.out.printf("%-20s %-25s %10s %12s%n",
            "claude-3-haiku", "$0.25", "$1.25");
        System.out.printf("%-20s %-25s %10s %12s%n",
            "claude-3-sonnet", "$3.00", "$15.00");
        System.out.printf("%-20s %-25s %10s %12s%n",
            "claude-3-opus", "$15.00", "$75.00");

        System.out.println("\\n3. 其他提供商对比");
        System.out.println("-".repeat(60));
        System.out.printf("%-25s %-20s %10s %12s%n",
            "提供商", "主要模型", "成本定位");
        System.out.printf("%-25s %-20s %10s %12s%n",
            "Hugging Face", "Llama 3, Mistral", "免费/低成本");
        System.out.printf("%-25s %-20s %10s %12s%n",
            "Google", "Gemini Pro", "中高");
        System.out.printf("%-25s %-20s %10s %12s%n",
            "Azure OpenAI", "GPT系列", "企业折扣");
        System.out.printf("%-25s %-20s %10s %12s%n",
            "Amazon Bedrock", "Claude, Titan", "企业折扣");
    }
}`;

  const bestPractices = `import dev.langchain4j.model.chat.ChatLanguageModel;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

// ✅ 好的做法：使用环境变量管理API Key
public class GoodKeyManagement {
    private static final Map<String, String> CACHE = new ConcurrentHashMap<>();

    public static String getApiKey(String provider) {
        // 先从环境变量读取
        String apiKey = System.getenv(provider.toUpperCase() + "_API_KEY");

        // 支持开发环境覆盖
        if (apiKey == null && CACHE.containsKey(provider)) {
            apiKey = CACHE.get(provider);
        }

        if (apiKey == null) {
            throw new IllegalStateException(
                "API Key not found for provider: " + provider);
        }

        return apiKey;
    }
}

// ❌ 不好的做法：硬编码API Key
public class BadKeyManagement {
    // 硬编码API Key，容易泄露到版本控制
    private static final String OPENAI_API_KEY = "sk-abc123...";

    public ChatLanguageModel createModel() {
        return OpenAiChatModel.builder()
            .apiKey(OPENAI_API_KEY)  // ❌ 不安全
            .build();
    }
}

// ✅ 配置管理最佳实践
public class ConfigurationBestPractices {

    // 1. 使用配置文件（application.yml）
    private static final String CONFIG_FILE = "application.yml";

    public static void loadConfiguration() {
        // 从配置文件加载提供商设置
        // provider: openai
        // model: gpt-3.5-turbo
        // temperature: 0.7
        // ...
    }

    // 2. 环境区分（dev/test/prod）
    public static String getApiKey(String provider, String environment) {
        String envSuffix = environment.toUpperCase();
        return System.getenv(provider + "_API_KEY_" + envSuffix);
    }

    // 3. 多提供商配置
    public static void configureMultipleProviders() {
        Map<String, String> providers = Map.of(
            "primary", "openai",      // 主要使用
            "secondary", "anthropic",  // 备用
            "tertiary", "azure"     // 其他
        );
        // 根据场景选择不同的提供商
    }

    // 4. 配额和限流处理
    public static void handleRateLimiting(ChatLanguageModel model) {
        try {
            // 正常调用
            model.generate("Hello!");

        } catch (RateLimitException e) {
            // 指数退避重试
            Thread.sleep(1000);  // 等待1秒
            model.generate("Hello!");  // 重试

        } catch (QuotaExceededException e) {
            // 配额用尽时的降级策略
            System.err.println("Quota exceeded, switching to fallback provider");
        }
    }
}`;

  return (
    <Layout>
      <div className="page-tags">
        <Tag variant="indigo">20+ 提供商</Tag>
        <Tag variant="purple">统一 API</Tag>
        <Tag variant="green">灵活切换</Tag>
      </div>

      <h1 className="page-title">模型提供商</h1>
      <p className="page-description">
        LangChain4j 支持 20+ LLM 提供商和 30+ 向量数据库，统一的 API 让模型切换变得轻而易举。
      </p>

      <nav className="toc-nav">
        <h3 className="toc-nav-title">目录</h3>
        <ol className="toc-list">
          <li className="toc-item"><span className="toc-number">1.</span> <a href="#OpenAI" className="toc-link">OpenAI</a></li>
          <li className="toc-item"><span className="toc-number">2.</span> <a href="#Anthropic" className="toc-link">Anthropic</a></li>
          <li className="toc-item"><span className="toc-number">3.</span> <a href="#Azure-OpenAI" className="toc-link">Azure OpenAI</a></li>
          <li className="toc-item"><span className="toc-number">4.</span> <a href="#Hugging-Face" className="toc-link">Hugging Face</a></li>
          <li className="toc-item"><span className="toc-number">5.</span> <a href="#Google-Gemini" className="toc-link">Google Gemini</a></li>
          <li className="toc-item"><span className="toc-number">6.</span> <a href="#Amazon-Bedrock" className="toc-link">Amazon Bedrock</a></li>
          <li className="toc-item"><span className="toc-number">7.</span> <a href="#其他提供商" className="toc-link">其他提供商</a></li>
          <li className="toc-item"><span className="toc-number">8.</span> <a href="#切换策略" className="toc-link">切换策略</a></li>
          <li className="toc-item"><span className="toc-number">9.</span> <a href="#成本对比" className="toc-link">成本对比</a></li>
          <li className="toc-item"><span className="toc-number">10.</span> <a href="#最佳实践" className="toc-link">最佳实践</a></li>
        </ol>
      </nav>

      <section id="OpenAI" className="content-section">
        <SectionHeader number={1} title="OpenAI" />

        <h3 className="subsection-title">1.1 配置概述</h3>
        <p className="paragraph">
          OpenAI 是最流行的 LLM 提供商之一，LangChain4j 完整支持 GPT-3.5 和 GPT-4 系列。
        </p>

        <CodeBlockWithCopy language="java" filename="OpenAIConfig.java" code={openaiConfig} />

        <TipBox type="info" title="OpenAI模型特点">
          <ul className="tip-box-list">
            <li><strong>GPT-3.5-turbo</strong>：快速、性价比高，适合大多数应用</li>
            <li><strong>GPT-4</strong>：更强大、支持复杂任务，成本较高</li>
            <li><strong>Builder模式</strong>：支持链式配置，代码简洁</li>
            <li><strong>超时控制</strong>：可设置请求超时时间</li>
            <li><strong>Temperature</strong>：控制输出随机性（0.0-2.0）</li>
          </ul>
        </TipBox>
      </section>

      <section id="Anthropic" className="content-section">
        <SectionHeader number={2} title="Anthropic" />

        <h3 className="subsection-title">2.1 Claude模型配置</h3>
        <p className="paragraph">
          Anthropic 提供的 Claude 系列模型以出色的推理能力和代码质量著称。
        </p>

        <CodeBlockWithCopy language="java" filename="AnthropicConfig.java" code={anthropicConfig} />

        <TipBox type="success" title="Claude优势">
          <ul className="tip-box-list">
            <li><strong>推理能力强</strong>：在复杂任务中表现优秀</li>
            <li><strong>代码生成质量</strong>：生成的代码更可靠</li>
            <li><strong>流式支持</strong>：支持TokenStream实时输出</li>
            <li><strong>大上下文窗口</strong>：支持更长的对话历史</li>
            <li><strong>安全性高</strong>：严格的内容审核机制</li>
          </ul>
        </TipBox>
      </section>

      <section id="Azure-OpenAI" className="content-section">
        <SectionHeader number={3} title="Azure OpenAI" />

        <h3 className="subsection-title">3.1 企业级部署</h3>
        <p className="paragraph">
          Azure OpenAI 提供 OpenAI 模型的企业级部署方案，适合需要高可靠性和数据隐私的企业应用。
        </p>

        <CodeBlockWithCopy language="java" filename="AzureConfig.java" code={azureConfig} />

        <TipBox type="warning" title="Azure特性">
          <ul className="tip-box-list">
            <li><strong>数据隐私</strong>：数据保留在Azure区域，不离开企业网络</li>
            <li><strong>SLA保证</strong>：99.9% 可用性保证</li>
            <li><strong>企业集成</strong>：与Azure AD、Entra ID集成</li>
            <li><strong>区域部署</strong>：可选择部署到全球不同区域</li>
            <li><strong>批量折扣</strong>：企业用户通常享受批量折扣</li>
          </ul>
        </TipBox>
      </section>

      <section id="Hugging-Face" className="content-section">
        <SectionHeader number={4} title="Hugging Face" />

        <h3 className="subsection-title">4.1 开源模型</h3>
        <p className="paragraph">
          Hugging Face 提供大量开源模型，可以免费使用或本地部署，适合预算有限或需要离线运行的项目。
        </p>

        <CodeBlockWithCopy language="java" filename="HuggingFaceConfig.java" code={huggingfaceConfig} />

        <TipBox type="info" title="Hugging Face优势">
          <ul className="tip-box-list">
            <li><strong>免费使用</strong>：许多模型可以免费调用（有配额限制）</li>
            <li><strong>本地部署</strong>：支持完全离线运行</li>
            <li><strong>开源生态</strong>：大量社区模型可供选择</li>
            <li><strong>隐私保护</strong>：数据无需发送到第三方</li>
            <li><strong>成本控制</strong>：完全控制API调用成本</li>
          </ul>
        </TipBox>
      </section>

      <section id="Google-Gemini" className="content-section">
        <SectionHeader number={5} title="Google Gemini" />

        <h3 className="subsection-title">5.1 多模态能力</h3>
        <p className="paragraph">
          Google Gemini 提供强大的多模态能力，支持文本、图像、代码等多种输入输出。
        </p>

        <CodeBlockWithCopy language="java" filename="GeminiConfig.java" code={googleGeminiConfig} />

        <div className="info-card info-card-blue">
          <h4 className="card-title-blue">Gemini优势</h4>
          <ul className="list-styled list-blue">
            <li><strong>多模态</strong>：同时处理文本、图像、视频</li>
            <li><strong>长上下文</strong>：支持超长文本输入（100万+ tokens）</li>
            <li><strong>高速响应</strong>：Google云基础设施保证低延迟</li>
            <li><strong>API集成</strong>：易于与其他Google服务集成</li>
          </ul>
        </div>
      </section>

      <section id="Amazon-Bedrock" className="content-section">
        <SectionHeader number={6} title="Amazon Bedrock" />

        <h3 className="subsection-title">6.1 企业AI服务</h3>
        <p className="paragraph">
          Amazon Bedrock 提供多种模型（Claude、Titan、Llama），通过统一的AWS基础设施提供服务。
        </p>

        <CodeBlockWithCopy language="java" filename="BedrockConfig.java" code={amazonBedrockConfig} />

        <TipBox type="success" title="Bedrock优势">
          <ul className="tip-box-list">
            <li><strong>多模型支持</strong>：一次集成多种AI模型</li>
            <li><strong>AWS生态</strong>：与Lambda、S3、DynamoDB等服务深度集成</li>
            <li><strong>安全合规</strong>：符合SOC2、HIPAA等企业级安全标准</li>
            <li><strong>区域部署</strong>：支持多个AWS区域部署</li>
            <li><strong>企业定价</strong>：按使用量计费，企业折扣</li>
          </ul>
        </TipBox>
      </section>

      <section id="其他提供商" className="content-section">
        <SectionHeader number={7} title="其他提供商" />

        <div className="grid-2col">
          <div className="card">
            <h4 className="card-title">Cohere</h4>
            <p className="card-description">专注于生成任务的模型</p>
            <div className="code-inline">builder().apiKey("...").build()</div>
          </div>
          <div className="card">
            <h4 className="card-title">Mistral AI</h4>
            <p className="card-description">欧洲开源模型，性能出色</p>
            <div className="code-inline">builder().modelName("mistral-medium").build()</div>
          </div>
          <div className="card">
            <h4 className="card-title">Ollama</h4>
            <p className="card-description">本地模型运行框架</p>
            <div className="code-inline">builder().baseUrl("http://localhost:11434").build()</div>
          </div>
          <div className="card-green">
            <h4 className="card-title-green">更多提供商</h4>
            <p className="card-description-green">持续更新，支持更多</p>
            <ul className="list-styled">
              <li>Replicate - AI模型API平台</li>
              <li>Together AI - 开源模型平台</li>
              <li>Perplexity - 推理能力出色</li>
              <li>DeepSeek - 中文优化模型</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="切换策略" className="content-section">
        <SectionHeader number={8} title="切换策略" />

        <h3 className="subsection-title">8.1 统一接口抽象</h3>
        <p className="paragraph">
          通过工厂模式实现提供商切换，业务代码无需关心底层实现：
        </p>

        <CodeBlockWithCopy language="java" filename="UnifiedInterface.java" code={unifiedInterface} />

        <TipBox type="success" title="设计优势">
          <ul className="tip-box-list">
            <li><strong>代码复用</strong>：业务逻辑只写一次</li>
            <li><strong>易于测试</strong>：可以轻松mock进行单元测试</li>
            <li><strong>快速切换</strong>：运行时或通过配置切换提供商</li>
            <li><strong>成本优化</strong>：根据业务需求选择最优提供商</li>
            <li><strong>A/B测试</strong>：对比不同模型的效果和成本</li>
          </ul>
        </TipBox>

        <h3 className="subsection-title">8.2 配置管理</h3>
        <p className="paragraph">
          合理管理API Key和配置是生产环境的关键：
        </p>

        <CodeBlockWithCopy language="java" filename="Configuration.java" code={bestPractices} />

        <TipBox type="warning" title="配置管理最佳实践">
          <ul className="tip-box-list">
            <li><strong>环境变量</strong>：使用环境变量而非硬编码</li>
            <li><strong>配置文件</strong>：application.yml/properties统一管理</li>
            <li><strong>环境区分</strong>：dev/test/prod不同配置</li>
            <li><strong>密钥轮换</strong>：定期轮换API Key提高安全性</li>
            <li><strong>监控告警</strong>：监控配额使用，设置告警阈值</li>
            <li><strong>权限控制</strong>：最小化API Key的权限范围</li>
          </ul>
        </TipBox>

        <h3 className="subsection-title mt-6">8.3 提供商选择流程</h3>
        <p className="paragraph mb-4">如何根据场景选择合适的模型提供商：</p>

        <MermaidChart chart={`
          graph TD
              A[🎯 需求分析] --> B{任务类型}
              B -->|简单对话| C[OpenAI GPT-3.5]
              B -->|复杂推理| D[Anthropic Claude]
              B -->|代码生成| E[OpenAI GPT-4]
              B -->|预算有限| F[Hugging Face]

              C --> G{成本考量}
              D --> G
              E --> G
              F --> H[本地部署]

              G -->|高频使用| I[使用最便宜的]
              G -->|质量优先| J[使用最强的]

              I --> K[配置工厂模式]
              J --> K
              H --> K

              K --> L[✅ 统一接口调用]

              style A fill:#e3f2fd
              style L fill:#e8f5e9
        `} />
      </section>

      <section id="成本对比" className="content-section">
        <SectionHeader number={9} title="成本对比" />

        <h3 className="subsection-title">9.1 价格对比</h3>
        <p className="paragraph">
          不同提供商的成本差异很大，根据使用场景选择合适的模型：
        </p>

        <CodeBlockWithCopy language="java" filename="CostComparison.java" code={costComparison} />

        <div className="info-card info-card-purple">
          <h4 className="card-title-purple">选择建议</h4>
          <ul className="list-styled list-purple">
            <li><strong>成本敏感</strong>：高频、批量处理选低价模型</li>
            <li><strong>质量优先</strong>：复杂任务选高质量模型</li>
            <li><strong>混合策略</strong>：简单任务用快速模型，复杂任务用强大模型</li>
            <li><strong>开源选项</strong>：预算有限时考虑Hugging Face开源模型</li>
            <li><strong>批量优惠</strong>：利用批量处理和批量购买的折扣</li>
          </ul>
        </div>
      </section>

      <section id="最佳实践" className="content-section">
        <SectionHeader number={10} title="最佳实践" />

        <h3 className="subsection-title">10.1 生产环境部署</h3>
        <p className="paragraph">
          在生产环境中使用模型提供商时的最佳实践：
        </p>

        <div className="grid-2col">
          <div className="card-green">
            <h4 className="card-title-green">✅ 推荐做法</h4>
            <ul className="list-styled list-green">
              <li>使用统一的AI Services接口</li>
              <li>配置提供商切换机制</li>
              <li>实现错误重试和退避策略</li>
              <li>监控API配额和使用量</li>
              <li>设置合理的超时时间</li>
              <li>实现降级策略（主提供商故障时）</li>
            </ul>
          </div>
          <div className="card-red">
            <h4 className="card-title-red">❌ 避免的问题</h4>
            <ul className="list-styled list-red">
              <li>硬编码API Key到代码中</li>
              <li>将API Key提交到版本控制</li>
              <li>没有错误处理直接调用API</li>
              <li>不设置超时，导致无限等待</li>
              <li>单一提供商依赖，没有备用方案</li>
            </ul>
          </div>
        </div>

        <h3 className="subsection-title">10.2 测试策略</h3>
        <p className="paragraph">
          确保应用在不同提供商下都能正常工作：
        </p>

        <div className="info-card info-card-yellow">
          <h4 className="card-title-yellow">测试要点</h4>
          <ul className="list-styled list-yellow">
            <li><strong>集成测试</strong>：测试所有支持的提供商</li>
            <li><strong>成本测试</strong>：验证不同模型的Token使用和成本</li>
            <li><strong>性能测试</strong>：对比响应时间、吞吐量</li>
            <li><strong>边界测试</strong>：测试超长文本、特殊字符等边界情况</li>
            <li><strong>故障切换</strong>：测试主提供商故障时的降级流程</li>
          </ul>
        </div>
      </section>

      <SummarySection
        description="本节详细介绍了LangChain4j的模型提供商支持："
        items={[
          '<strong>主流提供商</strong>：OpenAI、Anthropic Claude、Azure OpenAI、Hugging Face、Google Gemini',
          '<strong>其他提供商</strong>：Amazon Bedrock、Cohere、Mistral AI等',
          '<strong>切换策略</strong>：统一接口抽象、工厂模式、配置管理',
          '<strong>成本对比</strong>：价格对比表、选择建议、成本优化',
          '<strong>最佳实践</strong>：生产环境部署、测试策略、错误处理',
        ]}
        footer="🎉 恭喜你了解了模型提供商！继续学习高级特性，探索Agent、RAG等更强大的功能。"
      />
    </Layout>
  );
};

export default ModelProvidersPage;
