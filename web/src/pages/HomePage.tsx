import Layout from '../components/layout/Layout';
import { Tag, LearningPathCard, FeatureItem, CodeBlockWithCopy, SectionHeader, SummarySection } from '../components/ui';

const HomePage = () => {
  const learningPaths = [
    { icon: '🚀', title: '快速入门', description: '5 分钟上手 LangChain4j，完成环境搭建并编写第一个 AI 应用。适合完全没有接触过框架的新手。', meta: '⏱️ 15 分钟 • 新手必读', href: '/getting-started' },
    { icon: '🧩', title: '核心概念', description: '深入理解 ChatModel、AI Services、ChatMemory、RAG 等核心概念，掌握框架的设计哲学。', meta: '📖 核心基础 • 必须掌握', href: '/core-concepts' },
    { icon: '🔢', title: 'Embedding模型', description: '掌握Embedding模型与向量化技术，理解文本语义、相似度计算，为RAG系统打下基础。', meta: '🧠 向量化 • RAG基础', href: '/embedding-models' },
    { icon: '📝', title: 'Prompt模板', description: '学习Prompt模板系统与提示词工程，构建高效、可维护的提示词，提升AI应用质量。', meta: '💡 提示词工程 • 模板系统', href: '/prompt-templates' },
    { icon: '📊', title: '输出解析', description: '掌握结构化输出解析，将LLM的文本输出转换为Java对象，构建数据驱动应用。', meta: '🔧 结构化 • 类型安全', href: '/output-parsers' },
    { icon: '🔌', title: '模型提供商', description: '20+ LLM提供商配置大全，支持OpenAI、Anthropic、Azure、HuggingFace等，轻松切换模型。', meta: '🚀 20+提供商 • 统一API', href: '/model-providers' },
    { icon: '⚡', title: 'Function Calling', description: '深入理解Function Calling机制，让AI调用Java方法，构建强大的智能体和自动化系统。', meta: '🤖 工具调用 • 智能体', href: '/function-calling-deep' },
    { icon: '⚡', title: '高级特性', description: '探索工具调用、智能体、流式响应、结构化输出等高级特性，构建更强大的 AI 应用。', meta: '🔧 进阶内容 • 提升技能', href: '/advanced-features' },
    { icon: '🖼️', title: '多模态能力', description: '掌握LangChain4j的多模态能力，处理图像、文本等多种数据类型，构建更强大的AI应用。', meta: '🎨 视觉理解 • 多模态RAG', href: '/multimodal-full' },
    { icon: '🧪', title: '测试完整指南', description: '掌握AI应用测试策略，通过Mock测试、集成测试、性能测试，确保应用质量与稳定性。', meta: '✅ 质量保证 • 测试策略', href: '/testing-strategies' },
    { icon: '⚡', title: '性能调优', description: '优化AI应用性能，通过模型选择、缓存机制、RAG优化等手段，提升响应速度、降低成本。', meta: '🚀 速度优化 • 成本控制', href: '/performance-tuning' },
    { icon: '✨', title: '最佳实践', description: '学习生产环境的最佳实践，包括错误处理、监控、性能优化、成本控制等关键知识。', meta: '🏭 生产 ready • 避免踩坑', href: '/best-practices' },
    { icon: '💻', title: '实战示例', description: '通过完整的实战项目学习，包括聊天机器人、RAG 知识库、AI Agent 等真实应用场景。', meta: '🎯 动手实践 • 完整代码', href: '/examples' },
    { icon: '🔬', title: '深度解析', description: '深入框架内部，理解 AI Services 代理机制、RAG 工作流程、Agentic AI 决策过程等实现原理。', meta: '🔍 源码级 • 架构设计', href: '/deep-dive' },
  ];

  const features = [
    { icon: '🔗', title: '统一 API', description: '支持 20+ LLM 提供商和 30+ 向量数据库，无缝切换无需改代码' },
    { icon: '🤖', title: 'AI Services', description: '声明式接口设计，类似 Spring Data JPA，大幅简化开发' },
    { icon: '🧠', title: 'RAG 支持', description: '完整的检索增强生成能力，轻松构建知识库问答系统' },
    { icon: '🛠️', title: '工具调用', description: '让 AI 调用 Java 方法，构建能够执行实际任务的智能体' },
    { icon: '💬', title: '聊天记忆', description: '内置多种记忆策略，轻松实现多轮对话和上下文管理' },
    { icon: '🌱', title: '框架集成', description: '与 Spring Boot、Quarkus、Helidon 深度集成' },
  ];

  const codeExample = `// 1. 定义 AI Service 接口
interface Assistant {
    String chat(String message);
}

// 2. 创建并配置
Assistant assistant = AiServices.builder(Assistant.class)
    .chatLanguageModel(OpenAiChatModel.builder()
        .apiKey(System.getenv("OPENAI_API_KEY"))
        .build())
    .build();

// 3. 使用
String answer = assistant.chat("Hello!");
System.out.println(answer);`;

  return (
    <Layout>
      <div className="page-tags">
        <Tag variant="indigo">📚 完整学习指南</Tag>
        <Tag variant="purple">🚀 从入门到精通</Tag>
        <Tag variant="green">💡 最佳实践</Tag>
      </div>

      <h1 className="page-title">
        掌握 <span className="text-indigo-600">LangChain4j</span><br />Java AI 开发框架
      </h1>
      <p className="page-description">
        为新人打造的完整学习路径，从基础概念到高级特性，帮助你快速上手并发挥出 LangChain4j 的全部潜力。
      </p>

      <section className="content-section">
        <SectionHeader number={1} title="学习路径" />
        <div className="cards-grid">
          {learningPaths.map((path, index) => (
            <LearningPathCard key={index} {...path} />
          ))}
        </div>
      </section>

      <section className="content-section">
        <SectionHeader number={2} title="为什么选择 LangChain4j" />
        <div className="feature-list">
          {features.map((feature, index) => (
            <FeatureItem key={index} {...feature} />
          ))}
        </div>
      </section>

      <section className="content-section">
        <SectionHeader number={3} title="快速预览" />
        <p className="section-intro">只需几行代码即可开始</p>
        <CodeBlockWithCopy filename="MyFirstAIApp.java">{codeExample}</CodeBlockWithCopy>
        <div className="text-center">
          <a href="/getting-started" className="btn btn-primary btn-lg">
            📖 查看完整入门教程
          </a>
        </div>
      </section>

      <SummarySection
        description="本节介绍了 LangChain4j 的完整学习路径："
        items={[
          '<strong>学习路径</strong>：从快速入门到深度解析的完整学习路线',
          '<strong>为什么选择 LangChain4j</strong>：统一 API、AI Services、RAG 支持、工具调用等核心优势',
          '<strong>快速预览</strong>：几行代码即可上手，简单易用',
        ]}
        footer="🎉 准备好开始学习了吗？从「快速入门」开始你的 LangChain4j 之旅！"
      />
    </Layout>
  );
};

export default HomePage;
