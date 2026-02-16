import Layout from '../components/layout/Layout';
import { Tag, CodeBlockWithCopy, SectionHeader, TipBox, MermaidChart } from '../components/ui';

const GettingStartedPage = () => {
  const pomXml = `<?xml version="1.0" encoding="UTF-8"?>
<project>
    <modelVersion>4.0.0</modelVersion>
    
    <groupId>com.example</groupId>
    <artifactId>langchain4j-demo</artifactId>
    <version>1.0-SNAPSHOT</version>
    
    <dependencies>
        <dependency>
            <groupId>dev.langchain4j</groupId>
            <artifactId>langchain4j</artifactId>
            <version>0.50.0</version>
        </dependency>
    </dependencies>
</project>`;

  const mainApplication = `package com.example.langchain4j;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;

@SpringBootApplication
public class MainApplication {

    private ChatLanguageModel chatModel = OpenAiChatModel.builder()
            .apiKey("your-api-key-here")
            .modelName("gpt-3.5-turbo")
            .temperature(0.7)
            .build();

    @GetMapping("/chat")
    public String chat(@RequestParam("message") message) {
        return chatModel.generate(message);
    }
}`;

  const helloWorld = `import org.springframework.boot.autoconfigure.SpringBootApplication;
import dev.langchain4j.model.openai.OpenAiChatModel;

@SpringBootApplication
public class MainApplication {
    public static void main(String[] args) {
        ChatLanguageModel model = OpenAiChatModel.builder()
                .apiKey("your-api-key-here")
                .modelName("gpt-3.5-turbo")
                .build();
        
        System.out.println(model.generate("Hello, LangChain4j!"));
    }
}`;

  const chatController = `package com.example.langchain4j;

import dev.langchain4j.model.chat.ChatLanguageModel;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatLanguageModel chatModel;

    private List<String> messageHistory = new ArrayList<>();

    @PostMapping("/send")
    public String sendMessage(@RequestBody MessageRequest request) {
        messageHistory.add(request.getMessage());
        
        String response = chatModel.generate(messageHistory);
        
        messageHistory.add(response);
        
        return new ChatResponse(response);
    }

    @GetMapping("/history")
    public List<ChatMessage> getHistory() {
        return messageHistory;
    }

    @DeleteMapping("/history")
    public void clearHistory() {
        messageHistory.clear();
    }
}`;

  return (
    <Layout>
      <div className="page-tags">
        <Tag variant="green">5分钟</Tag>
        <Tag variant="indigo">新手友好</Tag>
      </div>

      <h1 className="page-title">快速入门 LangChain4j</h1>
      <p className="page-intro">从零开始，5分钟内创建你的第一个 LangChain4j AI 应用</p>

      <nav className="toc-nav">
        <h3 className="toc-nav-title">目录</h3>
        <ol className="toc-list">
          <li className="toc-item"><span className="toc-number">1.</span> <a href="#环境准备" className="toc-link">环境准备</a></li>
          <li className="toc-item"><span className="toc-number">2.</span> <a href="#创建项目" className="toc-link">创建项目</a></li>
          <li className="toc-item"><span className="toc-number">3.</span> <a href="#第一个示例" className="toc-link">第一个示例：Hello World</a></li>
          <li className="toc-item"><span className="toc-number">4.</span> <a href="#聊天功能" className="toc-link">聊天功能</a></li>
          <li className="toc-item"><span className="toc-number">5.</span> <a href="#下一步" className="toc-link">下一步</a></li>
        </ol>
      </nav>

      <section id="环境准备" className="content-section">
        <SectionHeader number={1} title="环境准备" />

        <h3 className="subsection-title">1.1 系统要求</h3>
        <p className="paragraph">在开始之前，请确保你的开发环境满足以下要求：</p>

        <div className="grid-2col">
          <div className="card-blue">
            <h4 className="card-title-blue">Java 环境</h4>
            <ul className="list-styled list-blue">
              <li> JDK 17 或更高</li>
              <li> Maven 3.8.x 或 Gradle 8.x</li>
              <li> IDE（IntelliJ IDEA、Eclipse、VS Code 等）</li>
            </ul>
          </div>
          <div className="card-green">
            <h4 className="card-title-green">API Key</h4>
            <ul className="list-styled list-green">
              <li> OpenAI API Key（推荐用于快速开始）</li>
              <li> 或者 Huggingface.co Access Token（免费替代方案）</li>
              <li>获取方式：<a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="link-external">OpenAI</a></li>
            </ul>
          </div>
        </div>

        <h3 className="subsection-title">1.2 项目依赖</h3>
        <p className="paragraph">创建 Maven 或 Gradle 项目并添加 LangChain4j 依赖：</p>

        <CodeBlockWithCopy language="xml" filename="pom.xml" code={pomXml} />

        <h3 className="subsection-title">1.3 快速开始选项</h3>
        <p className="paragraph">根据你的场景选择最快的开始方式：</p>

        <div className="grid-3col">
          <div className="card-purple">
            <h4 className="card-title-purple">🚀 使用 Spring Initializr</h4>
            <p className="card-description-purple">快速生成 Spring Boot 项目脚手架</p>
            <a href="https://start.spring.io" target="_blank" rel="noopener noreferrer" className="link-external">Spring Initializr</a>
          </div>
          <div className="card-blue">
            <h4 className="card-title-blue">📦 使用 Huggingface</h4>
            <p className="card-description-blue">免费的开源模型，无需 API Key</p>
            <a href="https://huggingface.co/docs/langchain4j" target="_blank" rel="noopener noreferrer" className="link-external">Huggingface 指南</a>
          </div>
          <div className="card-green">
            <h4 className="card-title-green">🎯 本地测试</h4>
            <p className="card-description-green">使用本地模型（Llama2、mistral）完全离线</p>
          </div>
        </div>

        <h3 className="subsection-title mt-6">1.4 快速开始流程</h3>
        <p className="paragraph mb-4">从环境准备到第一个AI应用的完整步骤：</p>

        <MermaidChart chart={`
          graph LR
              A[📋 环境准备] --> B[🔑 获取 API Key]
              B --> C[📦 创建项目]
              C --> D[🔧 添加依赖]
              D --> E[💻 编写代码]
              E --> F[🚀 运行应用]

              style A fill:#e3f2fd
              style C fill:#f3e5f5
              style E fill:#fff3e0
              style F fill:#e8f5e9
        `} />
      </section>

      <section id="创建项目" className="content-section">
        <SectionHeader number={2} title="创建项目" />

        <h3 className="subsection-title">2.1 项目结构</h3>
        <p className="paragraph">推荐的 LangChain4j 项目结构：</p>

        <div className="card-info">
          <pre className="code-text">{`langchain4j-demo/
├── src/main/java/          # Java 源代码
├── src/main/resources/       # 配置文件
│   ├── application.yml         # Spring Boot 配置
│   └── application-dev.yml    # 开发环境配置
├── src/test/java/           # 测试代码
├── pom.xml                # Maven 配置
└── Dockerfile              # 容器化配置`}</pre>
        </div>

        <h3 className="subsection-title">2.2 Main 类</h3>
        <p className="paragraph">创建主启动类：</p>

        <CodeBlockWithCopy language="java" filename="MainApplication.java" code={mainApplication} />

        <TipBox type="info" title="项目结构说明">
          <ul className="tip-box-list">
            <li><strong>主类</strong>：使用 @SpringBootApplication 标记，配置自动配置</li>
            <li><strong>依赖管理</strong>：通过 pom.xml 管理 LangChain4j 依赖</li>
            <li><strong>配置文件</strong>：application.yml 用于环境区分</li>
            <li><strong>分层结构</strong>：controller、service、config 等</li>
          </ul>
        </TipBox>
      </section>

      <section id="第一个示例" className="content-section">
        <SectionHeader number={3} title="第一个示例：Hello World" />

        <p className="paragraph">最简单的 LangChain4j 应用，只需 30 行代码：</p>

        <div className="code-preview">
          <div className="code-preview-header">
            <span className="code-badge code-badge-green">MainApplication.java</span>
          </div>
          <div className="code-preview-content">
            <CodeBlockWithCopy language="java" code={helloWorld} />
            <span className="code-keyword">输出：</span>
            <pre className="code-output">Hello, LangChain4j!</pre>
          </div>
        </div>

        <TipBox type="info" title="代码说明">
          <ul className="tip-box-list">
            <li><strong>模型创建</strong>：使用 Builder 模式链式配置模型</li>
            <li><strong>生成调用</strong>：generate() 方法返回完整的 AI 回答</li>
            <li><strong>可扩展</strong>：后续可以轻松添加更多功能（上下文、监听器等）</li>
          </ul>
        </TipBox>
      </section>

      <section id="聊天功能" className="content-section">
        <SectionHeader number={4} title="聊天功能" />

        <p className="paragraph">扩展应用，支持真正的聊天对话：</p>

        <CodeBlockWithCopy language="java" filename="ChatController.java" code={chatController} />

        <TipBox type="success" title="功能说明">
          <ul className="tip-box-list">
            <li><strong>多轮对话</strong>：自动维护对话历史</li>
            <li><strong>流式 API</strong>：/send 端点添加，/history 端点查询</li>
            <li><strong>会话隔离</strong>：每个用户独立的历史</li>
          </ul>
        </TipBox>
      </section>

      <section id="下一步" className="content-section">
        <SectionHeader number={5} title="下一步" />

        <p className="paragraph">恭喜你已完成第一个 LangChain4j 应用！接下来可以学习：</p>

        <div className="grid-2col">
          <div className="card-purple">
            <h4 className="card-title-purple">📖 学习核心概念</h4>
            <p className="card-description-purple">了解 ChatLanguageModel、EmbeddingModel 等核心接口</p>
            <a href="/core-concepts" className="link-external">核心概念 →</a>
          </div>
          <div className="card-blue">
            <h4 className="card-title-blue">🎨 学习嵌入模型</h4>
            <p className="card-description-blue">掌握文本向量和向量相似度</p>
            <a href="/embedding-models" className="link-external">嵌入模型 →</a>
          </div>
          <div className="card-green">
            <h4 className="card-title-green">🚀 尝试函数调用</h4>
            <p className="card-description-green">让 AI 调用外部工具</p>
            <a href="/function-calling-deep" className="link-external">函数调用 →</a>
          </div>
          <div className="card-orange">
            <h4 className="card-title-orange">🎯 学习高级特性</h4>
            <p className="card-description-orange">多模态、流式 API 等</p>
            <a href="/advanced-features" className="link-external">高级特性 →</a>
          </div>
        </div>

        <div className="summary-section summary-gradient">
          <h3>本节小结</h3>
          <p>本节帮助你快速上手 LangChain4j：</p>
          <ul>
            <li><strong>环境准备</strong>：JDK 17+、API Key、项目结构</li>
            <li><strong>Hello World</strong>：最简单的 30 行代码示例</li>
            <li><strong>聊天功能</strong>：多轮对话的实现</li>
            <li><strong>可扩展性</strong>：易于添加更多高级功能</li>
          </ul>
          <div className="border-top">
            <p>下一步</p>
            <a href="/core-concepts" className="link-light">
              核心概念 →
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default GettingStartedPage;
