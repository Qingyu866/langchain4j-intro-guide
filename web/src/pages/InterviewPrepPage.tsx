import Layout from '../components/layout/Layout';
import { Tag, SectionHeader, CodeBlock, TipBox } from '../components/ui';

const starProjectExperienceCode = `public class STARProjectExperience {

    public String describeProject() {
        String situation = "在一个企业知识库项目中，文档检索速度慢，影响用户体验。";
        String task = "优化向量检索性能，将查询时间从 3 秒降低到 500 毫秒。";
        String action = "重新设计向量索引策略，使用 HNSW 算法替代暴力搜索，添加二级索引（部门+文档类型）。";
        String result = "检索速度提升 83%，用户满意度提升 40%。";

        return String.format("S: %s\\nT: %s\\nA: %s\\nR: %s",
            situation, task, action, result);
    }
}`;

const simpleChatModelCode = `public class SimpleChatModel implements ChatLanguageModel {

    private final String baseUrl;
    private final int maxRetries;

    public SimpleChatModel(String baseUrl, int maxRetries) {
        this.baseUrl = baseUrl;
        this.maxRetries = maxRetries;
    }

    @Override
    public AiMessage generate(List<ChatMessage> messages) {
        int attempt = 0;
        while (attempt <= maxRetries) {
            try {
                String response = callLLMAPI(messages);
                return new AiMessage(response);
            } catch (Exception e) {
                if (++attempt < maxRetries) {
                    Thread.sleep(1000);
                    continue;
                }
                throw new RuntimeException("LLM 调用失败: " + e.getMessage());
            }
        }
    }

    private String callLLMAPI(List<ChatMessage> messages) {
        return "这是模拟的响应";
    }
}`;

const documentSearchToolCode = `public class DocumentSearchTool implements Tool {

    private final VectorStore vectorStore;

    public DocumentSearchTool(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    @Tool("搜索文档")
    public List<Document> search(String query, int topK) {
        List<Float> queryVector = embedText(query);
        List<Document> results = vectorStore.searchSimilar(queryVector, topK);
        return results.stream()
            .sorted((a, b) -> Float.compare(b.similarity, a.similarity))
            .map(doc -> doc.toMap())
            .collect(Collectors.toList());
    }

    private List<Float> embedText(String text) {
        return Arrays.stream(new float[128]);
    }
}`;

const InterviewPrepPage = () => {
  return (
    <Layout>
      <div className="page-tags">
        <Tag variant="indigo">面试准备</Tag>
        <Tag variant="orange">面试技巧</Tag>
        <Tag variant="green">实战演练</Tag>
      </div>

      <h1 className="page-title">面试准备</h1>
      <p className="page-description">
        全面掌握 LangChain4j 面试知识点和技巧，顺利通过面试。
      </p>

      <nav className="toc-nav">
        <h3 className="toc-title">目录</h3>
        <ol className="toc-list">
          <li className="toc-item"><span className="toc-number">1.</span> <a href="#types" className="toc-link">面试题型分类</a></li>
          <li className="toc-item"><span className="toc-number">2.</span> <a href="#knowledge" className="toc-link">核心知识点</a></li>
          <li className="toc-item"><span className="toc-number">3.</span> <a href="#techniques" className="toc-link">模拟面试技巧</a></li>
          <li className="toc-item"><span className="toc-number">4.</span> <a href="#practice" className="toc-link">实战演练</a></li>
        </ol>
      </nav>

      <section id="types" className="content-section">
        <SectionHeader number={1} title="面试题型分类" />
        <p className="paragraph">
          了解 LangChain4j 面试中常见的题型，针对性准备。
        </p>

        <h3 className="subsection-title">1.1 概念理解题</h3>
        <p className="text-gray-700 mb-4">考察对 LangChain4j 核心概念的理解深度：</p>

        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>核心组件</strong>: ChatLanguageModel、Tool、Memory、Chain 的作用和关系</li>
          <li><strong>函数调用</strong>: Function Calling 的原理和应用场景</li>
          <li><strong>RAG 原理</strong>: 检索增强生成的原理和优势</li>
          <li><strong>向量数据库</strong>: 向量存储和相似度搜索</li>
          <li><strong>流式输出</strong>: StreamingChatModel 的工作原理</li>
        </ul>

        <h3 className="subsection-title">1.2 代码实现题</h3>
        <p className="text-gray-700 mb-4">考察实际编码能力，需要手写完整实现：</p>

        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>自定义 ChatModel</strong>: 实现一个简单的 LLM 适配器</li>
          <li><strong>自定义 Tool</strong>: 实现一个工具并集成到 AI 服务中</li>
          <li><strong>Memory 管理</strong>: 实现对话历史的存储和检索</li>
          <li><strong>RAG 链</strong>: 实现完整的 RAG 流程</li>
        </ul>

        <h3 className="subsection-title">1.3 架构设计题</h3>
        <p className="text-gray-700 mb-4">考察系统设计和架构能力：</p>

        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>系统分层</strong>: 展示层、服务层、数据层的划分</li>
          <li><strong>扩展性设计</strong>: 如何设计灵活的扩展点</li>
          <li><strong>并发处理</strong>: 如何处理高并发场景</li>
          <li><strong>容错设计</strong>: 如何实现故障转移和降级</li>
        </ul>

        <h3 className="subsection-title">1.4 场景题</h3>
        <p className="text-gray-700 mb-4">结合实际业务场景考察问题解决能力：</p>

        <div className="grid-2col">
          <div className="card card-indigo">
            <h4 className="font-semibold text-indigo-800 mb-2">高并发场景</h4>
            <p className="text-indigo-700 text-sm">同时处理 1000+ 请求的架构设计</p>
          </div>
          <div className="card card-purple">
            <h4 className="font-semibold text-purple-800 mb-2">大 Token 场景</h4>
            <p className="text-purple-700 text-sm">处理超长文档的优化策略</p>
          </div>
        </div>
      </section>

      <section id="knowledge" className="content-section">
        <SectionHeader number={2} title="核心知识点" />
        <p className="paragraph">
          以下是 LangChain4j 面试中的高频核心知识点：
        </p>

        <div className="grid-2col">
          <div className="card card-blue">
            <h4 className="font-semibold text-blue-800 mb-2">ChatLanguageModel</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li> generate() 和 generateAsync() 方法</li>
              <li> 流式输出和批量处理</li>
              <li> Builder 模式的配置方式</li>
              <li> 超时和重试机制</li>
            </ul>
          </div>
          <div className="card card-green">
            <h4 className="font-semibold text-green-800 mb-2">Tool</h4>
            <ul className="text-green-700 text-sm space-y-1">
              <li> ToolSpecification 的定义</li>
              <li> @Tool 注解的使用</li>
              <li> 参数验证和类型转换</li>
              <li> 工具执行的错误处理</li>
            </ul>
          </div>
          <div className="card card-purple">
            <h4 className="font-semibold text-purple-800 mb-2">Memory</h4>
            <ul className="text-purple-700 text-sm space-y-1">
              <li> MessageWindow 和 TokenChatMemory</li>
              <li> 持久化存储策略</li>
              <li> 上下文窗口管理</li>
              <li> 跨会话的内存共享</li>
            </ul>
          </div>
          <div className="card card-orange">
            <h4 className="font-semibold text-orange-800 mb-2">Chain</h4>
            <ul className="text-orange-700 text-sm space-y-1">
              <li> Chain 接口的设计</li>
              <li> 顺序执行和条件跳转</li>
              <li> 分支和循环</li>
              <li> 与 Tool 的集成</li>
            </ul>
          </div>
          <div className="card card-pink">
            <h4 className="font-semibold text-pink-800 mb-2">Function Calling</h4>
            <ul className="text-pink-700 text-sm space-y-1">
              <li> 函数定义和描述</li>
              <li> 自动参数匹配</li>
              <li> 并发函数调用</li>
              <li> 返回结果处理</li>
            </ul>
          </div>
          <div className="card card-cyan">
            <h4 className="font-semibold text-cyan-800 mb-2">RAG</h4>
            <ul className="text-cyan-700 text-sm space-y-1">
              <li> 文档切分策略</li>
              <li> 向量化和存储</li>
              <li> 相似度检索</li>
              <li> 上下文组装</li>
            </ul>
          </div>
        </div>

        <h3 className="subsection-title">2.1 最佳实践</h3>
        <p className="text-gray-700 mb-4">生产环境中的最佳实践：</p>

        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>错误处理</strong>: 完善的异常处理和重试机制</li>
          <li><strong>性能优化</strong>: 连接池、缓存、批量处理</li>
          <li><strong>安全实践</strong>: API Key 管理、内容审核、数据加密</li>
          <li><strong>监控日志</strong>: 结构化日志、性能监控、告警通知</li>
          <li><strong>测试覆盖</strong>: 单元测试、集成测试、E2E 测试</li>
        </ul>
      </section>

      <section id="techniques" className="content-section">
        <SectionHeader number={3} title="模拟面试技巧" />
        <p className="paragraph">
          掌握模拟面试的技巧，提升面试表现。
        </p>

        <h3 className="subsection-title">3.1 自我介绍策略</h3>
        <p className="text-gray-700 mb-4">自我介绍是面试的第一印象，需要精心准备：</p>

        <TipBox variant="info" title="三段式介绍法">
          <p className="mb-2">将自我介绍分为三个部分：</p>
          <ol className="list-styled">
            <li><strong>第一部分</strong>: 个人基本信息（姓名、教育背景、工作经验）</li>
            <li><strong>第二部分</strong>: 技术专长和项目经验</li>
            <li><strong>第三部分</strong>: 对职位的理解和职业规划</li>
          </ol>
        </TipBox>

        <h3 className="subsection-title">3.2 项目经验介绍</h3>
        <p className="text-gray-700 mb-4">用 STAR 法（Situation, Task, Action, Result）描述项目经验：</p>

        <CodeBlock
          code={starProjectExperienceCode}
          language="java"
          filename="STARProjectExperience.java"
        />

        <h3 className="subsection-title">3.3 技术难点准备</h3>
        <p className="text-gray-700 mb-4">提前准备可能的技术难点和应对策略：</p>

        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>Token 超限</strong>: 如何处理超长文档（截断、分批处理）</li>
          <li><strong>并发冲突</strong>: 如何处理内存竞争和数据一致性</li>
          <li><strong>性能瓶颈</strong>: 如何优化响应时间和资源使用</li>
          <li><strong>错误恢复</strong>: 如何实现优雅的故障转移和降级</li>
        </ul>
      </section>

      <section id="practice" className="content-section">
        <SectionHeader number={4} title="实战演练" />
        <p className="paragraph">
          通过完整的面试流程演示，提升实战能力。
        </p>

        <h3 className="subsection-title">4.1 完整面试流程</h3>
        <p className="text-gray-700 mb-4">一个完整的 LangChain4j 面试流程包含以下环节：</p>

        <div className="info-card info-card-blue">
          <h4 className="font-semibold text-blue-800 mb-3">面试流程图</h4>
          <div className="text-blue-700 text-sm space-y-2">
            <p>1. <strong>自我介绍（3 分钟）</strong></p>
            <p>2. <strong>项目经验（5-10 分钟）</strong></p>
            <p>3. <strong>技术问题（15-20 分钟）</strong></p>
            <p>4. <strong>代码题（15-20 分钟）</strong></p>
            <p>5. <strong>系统设计题（10-15 分钟）</strong></p>
            <p>6. <strong>HR 问题（5-10 分钟）</strong></p>
            <p>7. <strong>反问环节（5-10 分钟）</strong></p>
            <p>8. <strong>结束语（2-3 分钟）</strong></p>
          </div>
        </div>

        <h3 className="subsection-title">4.2 代码评审技巧</h3>
        <p className="text-gray-700 mb-4">面试中的代码编写技巧：</p>

        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>先思考后编写</strong>: 先在脑海中设计接口和实现逻辑</li>
          <li><strong>先写测试用例</strong>: 考虑边界条件和异常情况</li>
          <li><strong>边说边写</strong>: 大声说明设计思路，展示思考过程</li>
          <li><strong>代码简洁</strong>: 避免过度设计，保持代码简洁清晰</li>
          <li><strong>注释清晰</strong>: 关键逻辑添加注释，但不过度注释</li>
        </ul>

        <h3 className="subsection-title">4.3 代码题示例</h3>
        <p className="text-gray-700 mb-4">以下是两道典型的 LangChain4j 代码题示例：</p>

        <p className="text-gray-700 mb-2 font-medium">面试题 1: 实现自定义 ChatModel</p>
        <p className="text-gray-600 text-sm mb-4">要求：支持同步和异步调用，带重试机制</p>

        <CodeBlock
          code={simpleChatModelCode}
          language="java"
          filename="SimpleChatModel.java"
        />

        <p className="text-gray-700 mb-2 font-medium mt-6">面试题 2: 实现自定义 Tool</p>
        <p className="text-gray-600 text-sm mb-4">要求：支持关键词搜索、模糊搜索、结果分页</p>

        <CodeBlock
          code={documentSearchToolCode}
          language="java"
          filename="DocumentSearchTool.java"
        />
      </section>

      <section className="content-section">
        <div className="summary-card">
          <h3 className="text-2xl font-bold mb-4">本章小结</h3>
          <p className="mb-4">全面介绍了 LangChain4j 面试的准备策略和实战技巧。通过掌握这些技能，您可以：</p>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li><strong>系统准备</strong>：有针对性地复习核心知识点，形成知识体系</li>
            <li><strong>模拟演练</strong>：通过模拟面试提升实战能力</li>
            <li><strong>项目经验</strong>：用 STAR 法清晰描述项目成果</li>
            <li><strong>代码技巧</strong>：边写边说，展示设计思路</li>
            <li><strong>心态调整</strong>：保持自信，展示解决问题的能力</li>
          </ul>
          <div className="border-t border-indigo-400 pt-6">
            <p className="text-sm opacity-80 mb-2">核心特性</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Tag variant="indigo">题型分类</Tag>
              <Tag variant="purple">核心知识点</Tag>
              <Tag variant="blue">模拟技巧</Tag>
              <Tag variant="green">实战演练</Tag>
            </div>
            <p className="text-sm opacity-80 mb-2">技术栈</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Tag variant="cyan">LangChain4j</Tag>
              <Tag variant="indigo">Spring Boot</Tag>
              <Tag variant="purple">PostgreSQL</Tag>
              <Tag variant="blue">Redis</Tag>
            </div>
            <a href="/practice" className="text-white hover:text-indigo-200 transition-colors">
              下一章：实战练习 →
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default InterviewPrepPage;
