import Layout from '../components/layout/Layout';
import { SectionHeader, CodeBlockWithCopy, TipBox, MermaidChart } from '../components/ui';

const RagImplementationPage = () => {
  return (
    <Layout>
      <div className="flex items-center gap-3 mb-8 text-sm">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">RAG</span>
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">完整实现</span>
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">~45分钟</span>
      </div>

      <h1 className="text-5xl font-bold text-gray-900 mb-6">RAG实现</h1>
      <p className="text-xl text-gray-600 mb-8 leading-relaxed">
        深入学习RAG系统的完整实现，掌握从文档加载到AI生成的完整流水线。
      </p>

      <div className="bg-gray-50 rounded-lg p-6 mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">📚 本章学习目标</h2>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start gap-3">
            <span className="text-green-600 text-xl font-bold">✓</span>
            <span><strong>掌握文档加载器的使用方法</strong></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 text-xl font-bold">✓</span>
            <span><strong>理解文本分块策略和最佳实践</strong></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 text-xl font-bold">✓</span>
            <span><strong>实现Embedding生成和存储</strong></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 text-xl font-bold">✓</span>
            <span><strong>构建检索器和相似度计算</strong></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 text-xl font-bold">✓</span>
            <span><strong>实现上下文注入和Prompt构建</strong></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 text-xl font-bold">✓</span>
            <span><strong>创建完整的RAG Pipeline</strong></span>
          </li>
        </ul>
      </div>

      <section className="content-section">
        <SectionHeader number={1} title="RAG架构概览" />

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            在深入代码实现之前，先理解RAG系统的整体架构，各组件如何协作。
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">1</div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">文档摄入层</p>
                <p className="text-gray-600 text-sm">DocumentLoader加载 → TextSplitter分块 → EmbeddingModel向量化 → EmbeddingStore存储</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">2</div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">检索层</p>
                <p className="text-gray-600 text-sm">查询转为Embedding → VectorStore检索 → ContentRetriever返回Top-N结果</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">3</div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">生成层</p>
                <p className="text-gray-600 text-sm">检索结果注入Prompt → ChatLanguageModel生成回答 → 返回给用户</p>
              </div>
            </div>
          </div>
        </div>

        <MermaidChart chart={`
          graph TB
              subgraph "📥 文档摄入层"
                  A1[📄 原始文档] --> A2[📖 DocumentLoader]
                  A2 --> A3[✂️ TextSplitter]
                  A3 --> A4[🔢 EmbeddingModel]
                  A4 --> A5[(💾 EmbeddingStore)]
              end

              subgraph "🔍 检索层"
                  B1[❓ 用户查询] --> B2[🔢 EmbeddingModel]
                  B2 --> B3[🎯 相似度搜索]
                  B3 --> A5
                  A5 --> B4[📋 ContentRetriever]
                  B4 --> B5["Top-N 结果"]
              end

              subgraph "🤖 生成层"
                  B5 --> C1[📝 Prompt Template]
                  C1 --> C2[💬 ChatLanguageModel]
                  C2 --> C3[✅ 最终回答]
              end

              style A5 fill:#f3e5f5
              style C2 fill:#fff3e0
              style C3 fill:#e8f5e9
        `} />

        <TipBox type="info" title="关键设计决策">
          <ul className="space-y-1 text-sm">
            <li><strong>分块大小</strong>：固定大小（512/1024/2048 tokens）或语义分块</li>
            <li><strong>检索数量</strong>：Top-K策略，通常返回3-5个最相关结果</li>
            <li><strong>向量维度</strong>：OpenAI text-embedding-3-small: 1536维</li>
            <li><strong>上下文管理</strong>：控制总Token数，避免超出LLM上下文限制</li>
          </ul>
        </TipBox>
      </section>

      <section className="content-section">
        <SectionHeader number={2} title="文档加载（Document Loading）" />

        <p className="text-gray-600 mb-6">
          DocumentLoader是RAG流程的第一步，负责从各种数据源加载原始文档。
        </p>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">支持的文档格式</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-2">📄</div>
              <p className="text-sm text-gray-600">文件系统</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-2">📡</div>
              <p className="text-sm text-gray-600">云存储</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-2">🌐</div>
              <p className="text-sm text-gray-600">网络爬虫</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-2">🔗</div>
              <p className="text-sm text-gray-600">代码库</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-2">🌐</div>
              <p className="text-sm text-gray-600">URL源</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-2">📦</div>
              <p className="text-sm text-gray-600">Classpath</p>
            </div>
          </div>
        </div>

        <CodeBlockWithCopy
          language="java"
          filename="DocumentLoadingExample.java"
          title="Java - 文档加载"
          code={`import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.DocumentLoader;
import dev.langchain4j.data.document.loader.FileSystemDocumentLoader;

public class DocumentLoadingExample {
    public static void main(String[] args) throws Exception {
        // 1. 创建文件系统加载器
        DocumentLoader loader = FileSystemDocumentLoader.builder()
                .build();

        // 2. 加载单个文件
        List<Document> singleDoc = loader.load("documents/manual.pdf");

        // 3. 加载整个目录
        List<Document> allDocs = loader.load("documents/");

        // 4. 加载多个文件
        List<Document> multiDocs = loader.load(
            "docs/intro.pdf",
            "docs/guide.pdf",
            "docs/api.pdf"
        );

        System.out.println("=== 文档加载示例 ===");
        System.out.println("单文件: " + singleDoc.size() + " 个文档");
        System.out.println("目录: " + allDocs.size() + " 个文档");
        System.out.println("多文件: " + multiDocs.size() + " 个文档");
    }
}`}
        />

        <TipBox type="success" title="加载器配置选项">
          <ul className="space-y-1 text-sm">
            <li><strong>编码检测</strong>：自动识别文件编码（UTF-8、GBK等）</li>
            <li><strong>分批加载</strong>：大文件分批加载，避免内存溢出</li>
            <li><strong>递归目录</strong>：递归加载整个目录树</li>
            <li><strong>元数据提取</strong>：从文件名、路径、大小等提取信息</li>
          </ul>
        </TipBox>
      </section>

      <section className="content-section">
        <SectionHeader number={3} title="文本分块（Text Splitting）" />

        <p className="text-gray-600 mb-6">
          文档分块是RAG系统的关键步骤，直接影响检索质量。合理的分块策略能让检索更精准、上下文更连贯。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">📏 固定大小分块</h4>
            <p className="text-gray-600 text-sm mb-3">按照固定的Token数量切分</p>
            <ul className="space-y-2 text-gray-600 text-sm list-disc list-inside">
              <li><strong>Token数量</strong>：通常使用512、1024或2048</li>
              <li><strong>重叠大小</strong>：50-200 tokens重叠保证语义完整性</li>
              <li><strong>段落边界</strong>：优先在段落换行处切分</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">📊 评估指标</h4>
            <p className="text-gray-600 text-sm mb-3">如何评估分块效果？</p>
            <ul className="space-y-2 text-gray-600 text-sm list-disc list-inside">
              <li><strong>检索准确率</strong>：分块后检索相关内容的召回率</li>
              <li><strong>回答质量</strong>：上下文完整性的影响</li>
              <li><strong>Token效率</strong>：分块大小的Token利用率</li>
            </ul>
          </div>
        </div>

        <CodeBlockWithCopy
          language="java"
          filename="FixedSizeSplitterExample.java"
          title="Java - 固定大小分块"
          code={`import dev.langchain4j.data.document.DocumentSplitter;
import dev.langchain4j.data.document.splitter.DocumentByLineSplitter;
import dev.langchain4j.data.segment.TextSegment;

public class FixedSizeSplitterExample {
    private static final int MAX_TOKENS_PER_CHUNK = 500;

    public static void main(String[] args) {
        // 1. 创建行级分块器
        DocumentSplitter splitter = DocumentByLineSplitter.builder()
                .maxSegmentSize(MAX_TOKENS_PER_CHUNK)
                .maxOverlapSize(50)  // 允许50 tokens重叠
                .build();

        // 2. 加载文档
        DocumentLoader loader = FileSystemDocumentLoader.builder().build();
        List<Document> documents = loader.load("documents/manual.pdf");

        // 3. 分块处理
        List<TextSegment> segments = splitter.split(documents.get(0));

        System.out.println("=== 固定大小分块示例 ===");
        System.out.println("原始文档: " + documents.get(0).text().length() + " 个字符");
        System.out.println("分块数量: " + segments.size() + " 个片段");
        System.out.println("每段约: " + MAX_TOKENS_PER_CHUNK + " tokens");
        
        // 打印前3个片段
        for (int i = 0; i < Math.min(3, segments.size()); i++) {
            System.out.println("\\n--- 片段 " + (i+1) + " ---");
            System.out.println("内容: " + segments.get(i).text());
            System.out.println("长度: " + segments.get(i).text().length());
        }
    }
}`}
        />

        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-5 rounded-r-lg mt-6">
          <h4 className="font-bold text-indigo-900 mb-2">🏗️ LangChain4j分块器</h4>
          <ul className="space-y-2 text-indigo-800 text-sm">
            <li><strong>DocumentByParagraphSplitter</strong>：按段落分块，适合长文本文档</li>
            <li><strong>DocumentByLineSplitter</strong>：按行固定大小，适合代码文件</li>
            <li><strong>DocumentByCharacterSplitter</strong>：按字符数固定大小，最灵活</li>
            <li><strong>DocumentByRecursiveCharacterSplitter</strong>：递归分块，适合结构化内容</li>
          </ul>
        </div>
      </section>

      <section className="content-section">
        <SectionHeader number={4} title="Embedding生成" />

        <p className="text-gray-600 mb-6">
          将文本分块转换为向量表示，使计算机能够计算语义相似度。
        </p>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Embedding模型选择</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="font-semibold text-blue-900 mb-2">text-embedding-3-small</div>
              <p className="text-sm text-blue-800"><strong>维度</strong>：1536维</p>
              <p className="text-sm text-blue-800"><strong>成本</strong>：$0.0001 / 1K tokens</p>
              <p className="text-sm text-blue-800"><strong>适用</strong>：通用场景，性价比高</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="font-semibold text-purple-900 mb-2">text-embedding-3-large</div>
              <p className="text-sm text-purple-800"><strong>维度</strong>：3072维</p>
              <p className="text-sm text-purple-800"><strong>成本</strong>：$0.00013 / 1K tokens</p>
              <p className="text-sm text-purple-800"><strong>适用</strong>：需要更高精度</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="font-semibold text-green-900 mb-2">multilingual-e5-large</div>
              <p className="text-sm text-green-800"><strong>维度</strong>：1024维</p>
              <p className="text-sm text-green-800"><strong>成本</strong>：开源免费</p>
              <p className="text-sm text-green-800"><strong>适用</strong>：多语言场景</p>
            </div>
          </div>
        </div>

        <CodeBlockWithCopy
          language="java"
          filename="EmbeddingGenerationExample.java"
          title="Java - Embedding生成"
          code={`import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.openai.OpenAiEmbeddingModel;

public class EmbeddingGenerationExample {
    private static final String API_KEY = System.getenv("OPENAI_API_KEY");

    public static void main(String[] args) {
        System.out.println("=== Embedding生成示例 ===");
        
        try {
            // 1. 创建Embedding模型
            EmbeddingModel embeddingModel = OpenAiEmbeddingModel.builder()
                .apiKey(API_KEY)
                .modelName("text-embedding-3-small")
                .dimensions(1536)
                .build();
            
            System.out.println("✓ Embedding模型创建成功");
            
            // 2. 准备文本数据
            List<String> texts = List.of(
                "LangChain4j是一个强大的Java AI开发框架",
                "它支持多种模型提供商",
                "RAG可以让AI访问私有数据",
                "LangChain4j简化了开发流程"
            );
            
            System.out.println("\\n开始生成Embeddings...");
            
            // 3. 批量生成Embeddings
            List<TextSegment> segments = texts.stream()
                .map(TextSegment::from)
                .toList();
            
            List<Embedding> embeddings = embeddingModel.embedAll(segments);
            
            System.out.println("\\n✓ 总共生成 " + embeddings.size() + " 个Embeddings");
            System.out.println("✓ 每个Embedding约 1536维浮点数");
            
        } catch (Exception e) {
            System.err.println("✗ 错误: " + e.getMessage());
        }
    }
}`}
        />

        <TipBox type="success" title="优化技巧">
          <ul className="space-y-1 text-sm">
            <li><strong>批量处理</strong>：一次生成多个Embedding，提高效率</li>
            <li><strong>缓存结果</strong>：相同文本的Embedding可以缓存避免重复生成</li>
            <li><strong>异步生成</strong>：对于大量数据，使用异步API</li>
            <li><strong>维度优化</strong>：1536维适合大多数场景，减少维度节省成本</li>
          </ul>
        </TipBox>
      </section>

      <section className="content-section">
        <SectionHeader number={5} title="向量存储（Vector Storage）" />

        <p className="text-gray-600 mb-6">
          向量数据库负责存储和快速检索Embedding向量。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">🌲 Pinecone（托管服务）</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><strong>优点</strong>：无需运维，自动扩展</li>
              <li><strong>缺点</strong>：数据在云端，网络延迟</li>
              <li><strong>适用</strong>：生产环境，快速原型</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">🗄️ Chroma（本地部署）</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><strong>优点</strong>：数据完全本地，无网络延迟</li>
              <li><strong>缺点</strong>：需要自行运维</li>
              <li><strong>适用</strong>：数据隐私敏感，开发测试</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">🐘 PGVector</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><strong>优点</strong>：PostgreSQL扩展，成熟稳定</li>
              <li><strong>缺点</strong>：需要安装扩展</li>
              <li><strong>适用</strong>：已有PostgreSQL基础设施</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">💾 InMemory</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><strong>优点</strong>：零配置，快速开发</li>
              <li><strong>缺点</strong>：数据不持久</li>
              <li><strong>适用</strong>：原型开发，单元测试</li>
            </ul>
          </div>
        </div>

        <TipBox type="info" title="选择建议">
          <ul className="space-y-1 text-sm">
            <li><strong>快速原型</strong>：InMemory或Pinecone - 易上手</li>
            <li><strong>数据隐私</strong>：Chroma或PGVector - 完全本地</li>
            <li><strong>大规模</strong>：Milvus或Pinecone - 极致性能</li>
          </ul>
        </TipBox>
      </section>

      <section className="content-section">
        <SectionHeader number={6} title="检索（Retrieval）" />

        <p className="text-gray-600 mb-6">
          检索是RAG的核心环节，根据用户查询找到最相关的文档段。
        </p>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">检索流程详解</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">1</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">查询向量化</div>
                <p className="text-gray-600 text-sm">将用户查询转为Embedding向量</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">2</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">相似度计算</div>
                <p className="text-gray-600 text-sm">计算查询向量与存储向量的余弦相似度</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold flex-shrink-0">3</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">结果排序</div>
                <p className="text-gray-600 text-sm">按相似度从高到低排序，返回Top-K结果</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold flex-shrink-0">4</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">上下文组装</div>
                <p className="text-gray-600 text-sm">将Top-K结果组装成Prompt上下文</p>
              </div>
            </div>
          </div>
        </div>

        <CodeBlockWithCopy
          language="java"
          filename="RetrievalService.java"
          title="Java - 检索服务"
          code={`import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.content.retriever.EmbeddingStoreContentRetriever;
import dev.langchain4j.rag.query.Query;

public class RetrievalService {
    private final EmbeddingStoreContentRetriever retriever;
    private final ChatLanguageModel chatModel;

    public RetrievalService(
        EmbeddingStoreContentRetriever retriever, 
        ChatLanguageModel chatModel
    ) {
        this.retriever = retriever;
        this.chatModel = chatModel;
    }

    public String search(String query) {
        // 1. 创建查询对象
        Query queryObj = Query.from(query);

        // 2. 执行检索
        List<TextSegment> results = retriever.retrieve(queryObj);

        // 3. 组装上下文
        StringBuilder context = new StringBuilder();
        context.append("相关文档：\\n");
        for (int i = 0; i < results.size(); i++) {
            context.append("- ").append(results.get(i).text()).append("\\n");
        }

        // 4. 生成回答
        String prompt = context.toString()
            + "\\n\\n问题：" + query
            + "\\n\\n请基于以上文档回答：";

        return chatModel.generate(prompt);
    }
}`}
        />

        <TipBox type="success" title="高级检索技巧">
          <ul className="space-y-1 text-sm">
            <li><strong>混合检索</strong>：结合向量检索和关键词检索，提高精度</li>
            <li><strong>重排序</strong>：使用专门的Rerank模型优化结果质量</li>
            <li><strong>多路查询</strong>：用不同策略检索并行后融合</li>
            <li><strong>阈值调整</strong>：根据反馈动态调整相似度阈值</li>
          </ul>
        </TipBox>
      </section>

      <section className="content-section">
        <SectionHeader number={7} title="完整RAG Pipeline" />

        <p className="text-gray-600 mb-6">
          将前面所有组件组合起来，构建一个完整的RAG系统。
        </p>

        <CodeBlockWithCopy
          language="java"
          filename="CompleteRAGSystem.java"
          title="Java - 完整RAG系统"
          code={`import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.loader.FileSystemDocumentLoader;
import dev.langchain4j.data.document.splitter.DocumentByLineSplitter;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.content.retriever.EmbeddingStoreContentRetriever;
import dev.langchain4j.store.embedding.inmemory.InMemoryEmbeddingStore;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.service.AiServices;

public class CompleteRAGSystem {

    private static final String DOCUMENT_PATH = "documents";
    private static final String OPENAI_API_KEY = System.getenv("OPENAI_API_KEY");
    private static final int TOP_K = 5;

    public static void main(String[] args) {
        System.out.println("=== RAG系统启动 ===");
        
        try {
            // 步骤1: 加载文档
            System.out.println("\\n[步骤1] 加载和处理文档...");
            DocumentLoader loader = FileSystemDocumentLoader.builder().build();
            List<Document> documents = loader.load(DOCUMENT_PATH);
            System.out.println("✓ 加载 " + documents.size() + " 个文档");

            // 步骤2: 分块处理
            System.out.println("\\n[步骤2] 文档分块...");
            DocumentByLineSplitter splitter = DocumentByLineSplitter.builder()
                .maxSegmentSize(500)
                .maxOverlapSize(50)
                .build();
            List<TextSegment> segments = splitter.split(documents.get(0));

            // 步骤3: 生成Embeddings
            System.out.println("\\n[步骤3] 生成Embeddings...");
            EmbeddingModel embeddingModel = OpenAiEmbeddingModel.builder()
                .apiKey(OPENAI_API_KEY)
                .modelName("text-embedding-3-small")
                .dimensions(1536)
                .build();

            List<Embedding> embeddings = embeddingModel.embedAll(segments);
            System.out.println("✓ 生成 " + embeddings.size() + " 个Embeddings");

            // 步骤4: 创建向量存储
            System.out.println("\\n[步骤4] 创建向量存储...");
            InMemoryEmbeddingStore<TextSegment> store = new InMemoryEmbeddingStore<>();
            System.out.println("✓ 向量存储创建成功");

            // 步骤5: 创建检索器
            System.out.println("\\n[步骤5] 创建检索器...");
            ContentRetriever retriever = EmbeddingStoreContentRetriever.builder()
                .embeddingModel(embeddingModel)
                .embeddingStore(store)
                .maxResults(TOP_K)
                .build();
            System.out.println("✓ 检索器创建成功");

            // 步骤6: 创建Chat模型
            System.out.println("\\n[步骤6] 创建Chat模型...");
            ChatLanguageModel chatModel = OpenAiChatModel.builder()
                .apiKey(OPENAI_API_KEY)
                .modelName("gpt-4")
                .build();
            System.out.println("✓ Chat模型创建成功");

            // 步骤7: 创建AI Service
            System.out.println("\\n[步骤7] 创建AI Service...");
            interface RagService {
                String chat(String message);
            }

            RagService service = AiServices.builder(RagService.class)
                .chatLanguageModel(chatModel)
                .contentRetriever(retriever)
                .build();

            // 步骤8: 测试查询
            System.out.println("\\n[步骤8] 测试查询...");
            String testQuery = "什么是LangChain4j的RAG能力？";
            String answer = service.chat(testQuery);
            
            System.out.println("\\n=== RAG回答 ===");
            System.out.println(answer);
            
        } catch (Exception e) {
            System.err.println("✗ 错误: " + e.getMessage());
        }
    }
}`}
        />
      </section>

      <section className="content-section">
        <SectionHeader number={8} title="性能优化" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">⚡ 检索优化</h4>
            <ul className="space-y-2 text-gray-600 text-sm list-disc list-inside">
              <li><strong>缓存</strong>：缓存常用查询的检索结果</li>
              <li><strong>并行检索</strong>：同时查询多个向量数据库</li>
              <li><strong>索引优化</strong>：为向量数据库添加合适的索引</li>
              <li><strong>批量查询</strong>：一次检索多个查询</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">💾 生成优化</h4>
            <ul className="space-y-2 text-gray-600 text-sm list-disc list-inside">
              <li><strong>批量处理</strong>：积累多个文本后一次性生成</li>
              <li><strong>异步处理</strong>：使用异步API提高吞吐量</li>
              <li><strong>模型选择</strong>：small比large便宜很多</li>
              <li><strong>维度优化</strong>：1536维在精度和成本间平衡</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">🎨 上下文管理</h4>
            <ul className="space-y-2 text-gray-600 text-sm list-disc list-inside">
              <li><strong>Top-K选择</strong>：使用3-5个结果</li>
              <li><strong>上下文压缩</strong>：长文档摘要后嵌入</li>
              <li><strong>重排序过滤</strong>：用Rerank过滤低质量结果</li>
              <li><strong>流式输出</strong>：边检索边生成</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">📝 数据质量</h4>
            <ul className="space-y-2 text-gray-600 text-sm list-disc list-inside">
              <li><strong>数据清洗</strong>：清理HTML标签、特殊字符</li>
              <li><strong>去重</strong>：移除重复文档</li>
              <li><strong>标准化</strong>：统一格式</li>
              <li><strong>版本管理</strong>：记录文档版本</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="summary-box">
        <h2 className="text-2xl font-bold mb-4">🎯 本章总结</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">核心组件</h4>
            <ul className="space-y-1 text-sm list-disc list-inside">
              <li>DocumentLoader：加载文档</li>
              <li>DocumentSplitter：分割文本</li>
              <li>EmbeddingModel：生成向量</li>
              <li>EmbeddingStore：存储向量</li>
              <li>ContentRetriever：检索内容</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">关键步骤</h4>
            <ul className="space-y-1 text-sm list-disc list-inside">
              <li>文档加载 → 分块 → 向量化</li>
              <li>存储到向量数据库</li>
              <li>查询向量化 → 相似度检索</li>
              <li>上下文注入 → LLM生成</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t">
          <a href="/rag-advanced" className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            继续学习 RAG高级技巧 →
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default RagImplementationPage;
