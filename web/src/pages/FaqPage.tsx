import Layout from '../components/layout/Layout';
import { Tag, SectionHeader, MermaidChart } from '../components/ui';

const FaqPage = () => {
  return (
    <Layout>
      <div className="page-tags">
        <Tag variant="indigo">常见问题</Tag>
        <Tag variant="purple">问答</Tag>
        <Tag variant="green">快速参考</Tag>
      </div>

      <h1 className="page-title">常见问题</h1>
      <p className="page-description">
        LangChain4j 开发过程中的常见问题解答和最佳实践。
      </p>

      <nav className="toc-nav">
        <h3 className="toc-title">目录</h3>
        <ol className="toc-list">
          <li className="toc-item"><span className="toc-number">1.</span> <a href="#basics" className="toc-link">基础概念</a></li>
          <li className="toc-item"><span className="toc-number">2.</span> <a href="#embedding" className="toc-link">嵌入模型</a></li>
          <li className="toc-item"><span className="toc-number">3.</span> <a href="#rag" className="toc-link">RAG 相关</a></li>
          <li className="toc-item"><span className="toc-number">4.</span> <a href="#function" className="toc-link">函数调用</a></li>
          <li className="toc-item"><span className="toc-number">5.</span> <a href="#performance" className="toc-link">性能与优化</a></li>
          <li className="toc-item"><span className="toc-number">6.</span> <a href="#deployment" className="toc-link">生产部署</a></li>
        </ol>
      </nav>

      <section id="basics" className="content-section">
        <SectionHeader number={1} title="基础概念" />

        <div className="space-y-6">
          <div className="info-card info-card-gray">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Q: LangChain4j 与 LangChain 有什么区别？</h3>
            <p className="text-gray-700"><strong>A:</strong> LangChain4j 是 LangChain 的 Java 实现，专门为 Java 生态系统设计。主要区别：</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-gray-600">
              <li><strong>编程语言</strong>：LangChain4j 是 Java，原版 LangChain 是 Python</li>
              <li><strong>类型安全</strong>：LangChain4j 提供强类型 API，编译时检查</li>
              <li><strong>企业集成</strong>：更好地与 Spring Boot 等 Java 企业框架集成</li>
              <li><strong>性能</strong>：Java 的 JVM 优化提供更好的并发性能</li>
            </ul>
          </div>

          <div className="info-card info-card-gray">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Q: 如何选择合适的 ChatLanguageModel？</h3>
            <p className="text-gray-700"><strong>A:</strong> 根据需求和场景选择：</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-gray-600">
              <li><strong>快速原型</strong>：使用 HuggingFace 本地模型，免费且无需 API Key</li>
              <li><strong>高质量输出</strong>：使用 OpenAI GPT-4 或 Anthropic Claude</li>
              <li><strong>成本敏感</strong>：使用 GPT-3.5-turbo 或开源模型</li>
              <li><strong>数据隐私</strong>：使用本地部署的开源模型</li>
              <li><strong>中文优化</strong>：考虑使用专门训练的中文模型</li>
            </ul>
          </div>

          <div className="info-card info-card-gray">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Q: LangChain4j 支持哪些模型提供商？</h3>
            <p className="text-gray-700"><strong>A:</strong> LangChain4j 支持主流的 AI 模型提供商：</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-gray-600">
              <li><strong>OpenAI</strong>：GPT-4、GPT-3.5-turbo、Embeddings</li>
              <li><strong>Anthropic</strong>：Claude-3-opus、Claude-3-sonnet、Claude-3-haiku</li>
              <li><strong>Google</strong>：Gemini Pro、Gemini Ultra</li>
              <li><strong>HuggingFace</strong>：各种开源模型（Llama 2、Mistral、Falcon 等）</li>
              <li><strong>Azure OpenAI</strong>：企业级 OpenAI 服务</li>
              <li><strong>本地模型</strong>：Ollama、LocalAI 等本地推理引擎</li>
            </ul>
          </div>

          <div className="info-card info-card-gray">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Q: 什么是 Chain？</h3>
            <p className="text-gray-700"><strong>A:</strong> Chain 是 LangChain4j 的核心概念，表示将多个 AI 组件串联起来形成工作流：</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-gray-600">
              <li><strong>简单 Chain</strong>：单个操作（如文本生成、向量检索）</li>
              <li><strong>顺序 Chain</strong>：多个操作按顺序执行</li>
              <li><strong>条件 Chain</strong>：根据条件选择不同路径</li>
              <li><strong>循环 Chain</strong>：重复执行直到满足条件</li>
            </ul>
          </div>
        </div>

        <h3 className="subsection-title">1.1 问题分类体系</h3>
        <p className="text-gray-700 mb-4">常见问题的知识体系结构：</p>

        <MermaidChart chart={`
          mindmap
            root((LangChain4j FAQ))
              基础概念
                框架对比
                模型选择
                核心概念
              嵌入模型
                向量原理
                模型选择
                相似度计算
                分块策略
              RAG相关
                RAG原理
                向量数据库
                检索优化
              函数调用
                调用原理
                工具设计
              性能优化
                性能提升
                成本控制
              生产部署
                部署方案
                安全管理
        `} />
      </section>

      <section id="embedding" className="content-section">
        <SectionHeader number={2} title="嵌入模型" />

        <div className="space-y-6">
          <div className="info-card info-card-gray">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Q: 嵌入向量是什么？</h3>
            <p className="text-gray-700"><strong>A:</strong> 嵌入向量是将文本、图像等数据转换为数值向量的表示方法：</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-gray-600">
              <li><strong>数值表示</strong>：通常为浮点数数组（如 [0.1, -0.3, 0.8, ...]）</li>
              <li><strong>语义相似</strong>：语义相近的文本在向量空间中距离更近</li>
              <li><strong>维度固定</strong>：同一个模型生成的向量维度相同（如 1536 维）</li>
              <li><strong>用于检索</strong>：通过计算向量相似度实现语义搜索</li>
            </ul>
          </div>

          <div className="info-card info-card-gray">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Q: 如何选择嵌入模型？</h3>
            <p className="text-gray-700"><strong>A:</strong> 根据语言、性能和场景选择：</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-gray-600">
              <li><strong>多语言</strong>：OpenAI text-embedding-ada-002、Cohere embed-multilingual-v3</li>
              <li><strong>纯中文</strong>：text2vec、bge-large-zh 等中文模型</li>
              <li><strong>高性能</strong>：HuggingFace 的 small 或 base 模型</li>
              <li><strong>高精度</strong>：OpenAI text-embedding-3-large、Cohere embed-english-v3</li>
              <li><strong>本地部署</strong>：sentence-transformers 模型</li>
            </ul>
          </div>

          <div className="info-card info-card-gray">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Q: 如何计算向量相似度？</h3>
            <p className="text-gray-700"><strong>A:</strong> 常用的向量相似度计算方法：</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-gray-600">
              <li><strong>余弦相似度</strong>：最常用，值域 [-1, 1]，1 表示完全相同</li>
              <li><strong>欧氏距离</strong>：向量空间的直线距离，值越小越相似</li>
              <li><strong>点积</strong>：未归一化的余弦相似度，计算更高效</li>
              <li><strong>曼哈顿距离</strong>：各维度绝对差之和，对异常值更鲁棒</li>
            </ul>
            <p className="text-gray-700 mt-3"><strong>推荐</strong>：大多数情况下使用余弦相似度，除非向量已经归一化，则使用点积。</p>
          </div>

          <div className="info-card info-card-gray">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Q: 文本分块（Chunking）策略有哪些？</h3>
            <p className="text-gray-700"><strong>A:</strong> 常见的文本分块策略：</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-gray-600">
              <li><strong>固定大小</strong>：按字符数切分（如 1000 字符），简单但可能截断语义</li>
              <li><strong>递归分块</strong>：优先按段落、句子等自然边界切分，保持语义完整性</li>
              <li><strong>语义分块</strong>：基于句子相似度确定切分点，更精确但计算成本高</li>
              <li><strong>文档结构分块</strong>：利用 Markdown、HTML 等标记语言的结构信息</li>
            </ul>
            <p className="text-gray-700 mt-3"><strong>推荐</strong>：递归分块是大多数场景的最佳选择，平衡了性能和效果。</p>
          </div>
        </div>
      </section>

      <section id="rag" className="content-section">
        <SectionHeader number={3} title="RAG 相关" />

        <div className="space-y-6">
          <div className="info-card info-card-gray">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Q: 什么是 RAG？</h3>
            <p className="text-gray-700"><strong>A:</strong> RAG（Retrieval-Augmented Generation，检索增强生成）是一种结合知识检索和 LLM 生成的技术：</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-gray-600">
              <li><strong>问题</strong>：用户提出问题</li>
              <li><strong>检索</strong>：从知识库中检索相关文档</li>
              <li><strong>增强</strong>：将检索到的文档作为上下文添加到 Prompt 中</li>
              <li><strong>生成</strong>：LLM 基于上下文生成准确答案</li>
            </ul>
            <p className="text-gray-700 mt-3"><strong>优势</strong>：减少幻觉、提供最新信息、可解释性强、成本可控。</p>
          </div>

          <div className="info-card info-card-gray">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Q: 如何选择向量数据库？</h3>
            <p className="text-gray-700"><strong>A:</strong> 根据需求和场景选择向量数据库：</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-gray-600">
              <li><strong>PostgreSQL + PGVector</strong>：已有 PostgreSQL 环境，易集成，性能中等</li>
              <li><strong>Pinecone</strong>：全托管，易用，性能优秀，但成本较高</li>
              <li><strong>Weaviate</strong>：开源，支持多种数据类型，可本地部署</li>
              <li><strong>Milvus</strong>：高性能，适合大规模向量检索，开源</li>
              <li><strong>Qdrant</strong>：轻量级，易于部署，性能好</li>
            </ul>
            <p className="text-gray-700 mt-3"><strong>推荐</strong>：学习和中小型项目使用 PGVector，生产环境考虑 Pinecone 或 Milvus。</p>
          </div>

          <div className="info-card info-card-gray">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Q: 如何提高 RAG 检索质量？</h3>
            <p className="text-gray-700"><strong>A:</strong> 提高检索质量的常用策略：</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-gray-600">
              <li><strong>优化分块</strong>：使用递归分块，设置合理的 chunk size 和 overlap</li>
              <li><strong>混合检索</strong>：结合向量检索和关键词检索（BM25）</li>
              <li><strong>重排序</strong>：使用 Cross-Encoder 对检索结果重新排序</li>
              <li><strong>查询扩展</strong>：使用 LLM 扩展或改写用户查询</li>
              <li><strong>元数据过滤</strong>：利用文档元数据进行精准筛选</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="function" className="content-section">
        <SectionHeader number={4} title="函数调用" />

        <div className="space-y-6">
          <div className="info-card info-card-gray">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Q: 什么是函数调用（Function Calling）？</h3>
            <p className="text-gray-700"><strong>A:</strong> 函数调用允许 LLM 调用外部工具和 API，扩展其能力：</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-gray-600">
              <li><strong>定义工具</strong>：使用 @Tool 注解定义可调用函数</li>
              <li><strong>参数描述</strong>：为函数参数提供清晰的描述</li>
              <li><strong>模型决策</strong>：LLM 自动决定是否调用哪个函数</li>
              <li><strong>执行调用</strong>：框架自动执行函数并返回结果</li>
              <li><strong>生成答案</strong>：LLM 基于函数结果生成最终回答</li>
            </ul>
          </div>

          <div className="info-card info-card-gray">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Q: 如何设计良好的工具函数？</h3>
            <p className="text-gray-700"><strong>A:</strong> 设计工具函数的最佳实践：</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-gray-600">
              <li><strong>单一职责</strong>：每个函数只做一件事</li>
              <li><strong>清晰命名</strong>：函数名应准确描述其功能</li>
              <li><strong>详细描述</strong>：使用 @Tool 注解提供清晰的函数说明</li>
              <li><strong>参数描述</strong>：为每个参数提供 @ToolParam 描述</li>
              <li><strong>类型明确</strong>：使用强类型参数，避免模糊类型</li>
              <li><strong>错误处理</strong>：妥善处理异常，返回有意义的错误信息</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="performance" className="content-section">
        <SectionHeader number={5} title="性能与优化" />

        <div className="space-y-6">
          <div className="info-card info-card-gray">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Q: 如何提高 LangChain4j 应用性能？</h3>
            <p className="text-gray-700"><strong>A:</strong> 性能优化的关键策略：</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-gray-600">
              <li><strong>缓存</strong>：缓存嵌入向量、API 响应、检索结果</li>
              <li><strong>批处理</strong>：批量调用嵌入模型和聊天模型</li>
              <li><strong>异步</strong>：使用异步 API 提高并发性能</li>
              <li><strong>连接池</strong>：配置 HTTP 连接池减少连接开销</li>
              <li><strong>选择合适的模型</strong>：使用更小更快的模型满足需求</li>
              <li><strong>向量索引</strong>：为向量数据库创建合适的索引</li>
            </ul>
          </div>

          <div className="info-card info-card-gray">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Q: 如何降低 LangChain4j 成本？</h3>
            <p className="text-gray-700"><strong>A:</strong> 降低成本的策略：</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-gray-600">
              <li><strong>模型选择</strong>：使用更便宜的模型（如 GPT-3.5-turbo）</li>
              <li><strong>缓存复用</strong>：缓存相似查询的结果</li>
              <li><strong>本地模型</strong>：使用开源模型替代 API 调用</li>
              <li><strong>精简 Prompt</strong>：减少不必要的上下文和说明</li>
              <li><strong>批量处理</strong>：批量请求降低 API 调用次数</li>
              <li><strong>监控成本</strong>：实时监控 API 使用量和费用</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="deployment" className="content-section">
        <SectionHeader number={6} title="生产部署" />

        <div className="space-y-6">
          <div className="info-card info-card-gray">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Q: 如何部署 LangChain4j 应用？</h3>
            <p className="text-gray-700"><strong>A:</strong> 生产环境部署建议：</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-gray-600">
              <li><strong>容器化</strong>：使用 Docker 容器化应用</li>
              <li><strong>Kubernetes</strong>：使用 K8s 进行编排和扩展</li>
              <li><strong>配置管理</strong>：使用环境变量或配置中心管理敏感信息</li>
              <li><strong>日志聚合</strong>：使用 ELK 或类似方案收集日志</li>
              <li><strong>监控告警</strong>：监控 API 调用、延迟、错误率</li>
              <li><strong>负载均衡</strong>：使用 Nginx 或云厂商负载均衡</li>
            </ul>
          </div>

          <div className="info-card info-card-gray">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Q: 如何保护 API Key？</h3>
            <p className="text-gray-700"><strong>A:</strong> API Key 安全管理策略：</p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-gray-600">
              <li><strong>环境变量</strong>：使用环境变量存储敏感信息</li>
              <li><strong>密钥管理</strong>：使用 AWS Secrets Manager、Azure Key Vault 等服务</li>
              <li><strong>访问控制</strong>：限制 API Key 的访问权限和使用范围</li>
              <li><strong>定期轮换</strong>：定期更换 API Key</li>
              <li><strong>不提交代码</strong>：确保 .gitignore 包含 .env 文件</li>
              <li><strong>审计日志</strong>：记录所有 API Key 的使用情况</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="summary-card">
          <h3 className="text-2xl font-bold mb-4">本节小结</h3>
          <p className="mb-4">本节涵盖了 LangChain4j 开发过程中的常见问题，包括：</p>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li><strong>基础概念</strong>：LangChain4j 与 LangChain 的区别、模型选择、Chain 概念</li>
            <li><strong>嵌入模型</strong>：嵌入向量原理、模型选择、相似度计算、分块策略</li>
            <li><strong>RAG 相关</strong>：RAG 原理、向量数据库选择、检索质量优化</li>
            <li><strong>函数调用</strong>：函数调用原理、工具设计、错误处理</li>
            <li><strong>性能与优化</strong>：性能优化策略、成本控制、并发处理</li>
            <li><strong>生产部署</strong>：部署方案、API Key 管理、监控告警</li>
          </ul>
          <div className="border-t border-indigo-400 pt-6">
            <p className="text-sm opacity-80 mb-2">获取帮助</p>
            <div className="grid-3col">
              <div className="border border-white/30 rounded-lg p-3">
                <h4 className="font-semibold mb-1">官方文档</h4>
                <p className="text-sm opacity-80">docs.langchain4j.dev</p>
              </div>
              <div className="border border-white/30 rounded-lg p-3">
                <h4 className="font-semibold mb-1">Discord</h4>
                <p className="text-sm opacity-80">加入社区讨论</p>
              </div>
              <div className="border border-white/30 rounded-lg p-3">
                <h4 className="font-semibold mb-1">GitHub Issues</h4>
                <p className="text-sm opacity-80">报告问题</p>
              </div>
            </div>
            <a href="/cost-optimization" className="text-white hover:text-indigo-200 transition-colors mt-4 inline-block">
              下一章：成本优化 →
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FaqPage;
