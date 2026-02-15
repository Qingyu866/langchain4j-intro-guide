import Layout from '../components/layout/Layout';
import { Tag, CodeBlock, SectionHeader, TipBox, SummarySection } from '../components/ui';

const EmbeddingModelsPage = () => {
  const basicEmbedding = `import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.openai.OpenAiEmbeddingModel;
import static dev.langchain4j.model.openai.OpenAiEmbeddingModel.builder;

// 创建OpenAI Embedding模型
EmbeddingModel model = builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .modelName("text-embedding-3-small")
    .build();

// 生成单个文本的embedding
String text = "Hello LangChain4j!";
Embedding embedding = model.embed(text).content();
float[] vector = embedding.vector();

System.out.println("Vector dimension: " + vector.length);
System.out.println("First 3 values: " + vector[0] + ", " + vector[1] + ", " + vector[2]);`;

  const batchEmbedding = `import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.openai.OpenAiEmbeddingModel;
import java.util.List;

EmbeddingModel model = builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .build();

// 准备多个文本段
List<TextSegment> segments = List.of(
    TextSegment.from("Machine learning is fascinating."),
    TextSegment.from("Deep learning is a subset of machine learning."),
    TextSegment.from("Neural networks power modern AI.")
);

// 批量生成embedding（更高效）
List<Embedding> embeddings = model.embedAll(segments).content();

// 输出结果
for (int i = 0; i < embeddings.size(); i++) {
    Embedding emb = embeddings.get(i);
    System.out.println("Segment " + i + ": vector length = " + emb.vectorAsList().size());
}`;

  const similarityCalculation = `import dev.langchain4j.data.embedding.Embedding;
import java.util.List;

// 余弦相似度计算
public class SimilarityCalculator {

    public static double cosineSimilarity(float[] vectorA, float[] vectorB) {
        // 点积
        double dotProduct = 0.0;
        for (int i = 0; i < vectorA.length; i++) {
            dotProduct += vectorA[i] * vectorB[i];
        }

        // 向量范数（长度）
        double normA = 0.0;
        double normB = 0.0;
        for (int i = 0; i < vectorA.length; i++) {
            normA += Math.pow(vectorA[i], 2);
            normB += Math.pow(vectorB[i], 2);
        }
        normA = Math.sqrt(normA);
        normB = Math.sqrt(normB);

        // 余弦相似度 = 点积 / (范数A * 范数B)
        return dotProduct / (normA * normB);
    }

    public static void findMostSimilar(String query,
                                  List<Embedding> embeddings,
                                  List<String> texts) {
        // 假设query已经转换为embedding
        float[] queryVector = /* 从query生成embedding */;

        double maxSimilarity = -1.0;
        int bestIndex = -1;

        for (int i = 0; i < embeddings.size(); i++) {
            float[] docVector = embeddings.get(i).vector();
            double similarity = cosineSimilarity(queryVector, docVector);

            if (similarity > maxSimilarity) {
                maxSimilarity = similarity;
                bestIndex = i;
            }
        }

        System.out.println("最相似的文本:");
        System.out.println(texts.get(bestIndex));
        System.out.println("相似度: " + maxSimilarity);
    }
}`;

  const ragBasic = `import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.openai.OpenAiEmbeddingModel;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.content.retriever.EmbeddingStoreContentRetriever;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.EmbeddingStoreIngestor;
import static dev.langchain4j.model.openai.OpenAiChatModel.builder;
import static dev.langchain4j.model.openai.OpenAiEmbeddingModel.builder;

// 1. 创建embedding模型
EmbeddingModel embeddingModel = builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .modelName("text-embedding-3-small")
    .build();

// 2. 创建向量存储（这里使用内存存储）
EmbeddingStore<TextSegment> embeddingStore = new InMemoryEmbeddingStore<>();

// 3. 导入文档并生成embedding
List<TextSegment> documents = List.of(
    TextSegment.from("LangChain4j is a Java framework for LLMs."),
    TextSegment.from("It provides unified API for 20+ model providers."),
    TextSegment.from("Supports RAG, AI Services, and tools.")
);

EmbeddingStoreIngestor ingestor = EmbeddingStoreIngestor.builder()
    .embeddingModel(embeddingModel)
    .embeddingStore(embeddingStore)
    .build();

ingestor.ingest(documents);

// 4. 创建内容检索器
ContentRetriever retriever = EmbeddingStoreContentRetriever.builder()
    .embeddingModel(embeddingModel)
    .embeddingStore(embeddingStore)
    .maxResults(3)  // 返回最相关的3个文档
    .build();

// 5. 检索相关文档
List<TextSegment> relevantDocs = retriever.retrieve(
    TextSegment.from("What features does LangChain4j provide?")
);

// 6. 使用检索到的文档生成回答
ChatLanguageModel chatModel = builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .build();

String context = relevantDocs.stream()
    .map(TextSegment::text)
    .reduce("", (acc, doc) -> acc + "\\n" + doc);

String prompt = """
    Based on the following context, answer the question:

    Context:
    %s

    Question: What features does LangChain4j provide?

    If the context doesn't contain the answer, say "I don't have enough information."
    """.formatted(context);

String answer = chatModel.generate(prompt);
System.out.println(answer);`;

  const performanceOptimization = `import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import java.util.List;

// ❌ 不好的做法：逐个生成embedding
public class BadEmbeddingStrategy {
    public void processDocuments(List<TextSegment> documents) {
        EmbeddingModel model = /* 获取模型实例 */;
        for (TextSegment doc : documents) {
            // 每个文档单独调用API，效率低
            model.embed(doc);
        }
    }
}

// ✅ 好的做法：批量生成embedding
public class GoodEmbeddingStrategy {
    public void processDocuments(List<TextSegment> documents) {
        EmbeddingModel model = /* 获取模型实例 */;

        // 一次性生成所有embedding
        List<Embedding> embeddings = model.embedAll(documents).content();

        // 存储到向量数据库
        for (int i = 0; i < embeddings.size(); i++) {
            TextSegment doc = documents.get(i);
            Embedding embedding = embeddings.get(i);
            // 存储embeddingStore.add(doc, embedding);
        }
    }
}

// ✅ 缓存策略
public class CachedEmbeddingStrategy {
    private final EmbeddingModel model;
    private final EmbeddingStore<TextSegment> embeddingStore;

    // 先检查是否已有embedding
    public Embedding getOrCreateEmbedding(TextSegment text) {
        List<Embedding> existing = embeddingStore.findRelevant(text, 1);

        if (!existing.isEmpty()) {
            // 没有才生成新的embedding
            return model.embed(text).content();
        }

        // 返回已有的embedding
        return existing.get(0);
    }
}`;

  const troubleshooting = `// 问题1：向量维度不匹配

// 错误场景：混用不同embedding模型
EmbeddingModel modelA = OpenAiEmbeddingModel.builder()
    .modelName("text-embedding-3-small")  // 1536维
    .build();

EmbeddingModel modelB = OpenAiEmbeddingModel.builder()
    .modelName("text-embedding-3-large")  // 3072维
    .build();

// 存储到同一个向量库时会导致相似度计算错误

// ✅ 正确做法：统一使用相同的模型
EmbeddingModel model = OpenAiEmbeddingModel.builder()
    .modelName("text-embedding-3-small")  // 始终一致
    .build();

// ------------------------------------------------

// 问题2：内存不足

// 错误代码：一次性加载太多文档
List<TextSegment> hugeList = loadAllDocuments();  // 假设有10万条
List<Embedding> allEmbeddings = model.embedAll(hugeList);  // OOM错误

// ✅ 正确做法：分批处理
List<TextSegment> allDocs = loadAllDocuments();
int batchSize = 1000;

for (int i = 0; i < allDocs.size(); i += batchSize) {
    int end = Math.min(i + batchSize, allDocs.size());
    List<TextSegment> batch = allDocs.subList(i, end);

    List<Embedding> batchEmbeddings = model.embedAll(batch).content();
    // 存储到向量数据库
    storeBatch(batchEmbeddings);
}

// ------------------------------------------------

// 问题3：相似度计算错误

// ❌ 错误：直接使用欧几里得距离（不适用于高维向量）
public double badSimilarity(float[] a, float[] b) {
    double sum = 0.0;
    for (int i = 0; i < a.length; i++) {
        sum += Math.pow(a[i] - b[i], 2);
    }
    return Math.sqrt(sum);  // 高维空间不准确
}

// ✅ 正确：使用余弦相似度（标准化，适合高维）
public double goodSimilarity(float[] a, float[] b) {
    double dotProduct = 0.0;
    double normA = 0.0;
    double normB = 0.0;

    for (int i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}`;

  return (
    <Layout>
      <div className="page-tags">
        <Tag variant="indigo">Embedding模型</Tag>
        <Tag variant="purple">向量化技术</Tag>
        <Tag variant="green">RAG基础</Tag>
      </div>

      <h1 className="page-title">Embedding模型</h1>
      <p className="page-description">
        掌握Embedding模型与向量化技术，理解文本语义、相似度计算，为RAG系统打下基础。
      </p>

      <nav className="toc-nav">
        <h3 className="toc-nav-title">目录</h3>
        <ol className="toc-list">
          <li className="toc-item"><span className="toc-number">1.</span> <a href="#基础概念" className="toc-link">基础概念</a></li>
          <li className="toc-item"><span className="toc-number">2.</span> <a href="#EmbeddingModel接口" className="toc-link">EmbeddingModel接口</a></li>
          <li className="toc-item"><span className="toc-number">3.</span> <a href="#主流模型" className="toc-link">主流模型</a></li>
          <li className="toc-item"><span className="toc-number">4.</span> <a href="#相似度计算" className="toc-link">相似度计算</a></li>
          <li className="toc-item"><span className="toc-number">5.</span> <a href="#RAG应用" className="toc-link">RAG应用基础</a></li>
          <li className="toc-item"><span className="toc-number">6.</span> <a href="#最佳实践" className="toc-link">最佳实践</a></li>
          <li className="toc-item"><span className="toc-number">7.</span> <a href="#常见问题" className="toc-link">常见问题</a></li>
        </ol>
      </nav>

      <section id="基础概念" className="content-section">
        <SectionHeader number={1} title="基础概念" />

        <h3 className="subsection-title">1.1 什么是Embedding</h3>
        <p className="paragraph">
          Embedding（嵌入）是将文本、图像等内容转换为高维向量数字的技术。这个向量表示保留了内容的语义信息，使得计算机可以计算不同内容之间的相似度。
        </p>

        <div className="info-card info-card-blue">
          <h4 className="card-title-blue">为什么需要Embedding？</h4>
          <ul className="list-styled list-blue">
            <li><strong>语义理解</strong>：计算机无法直接理解文本含义，但可以计算向量距离</li>
            <li><strong>相似度搜索</strong>：通过向量距离找到语义相似的内容</li>
            <li><strong>RAG基础</strong>：检索增强生成依赖向量检索</li>
            <li><strong>高效存储</strong>：向量可以高效索引和检索</li>
          </ul>
        </div>

        <h3 className="subsection-title">1.2 向量空间</h3>
        <p className="paragraph">
          Embedding将文本映射到高维空间中的点。在这个空间中，语义相似的文本距离更近。
        </p>

        <div className="grid-2col">
          <div className="card">
            <h4 className="card-title">文本示例</h4>
            <ul className="list-styled">
              <li>"cat"（猫）</li>
              <li>"dog"（狗）</li>
              <li>"computer"（电脑）</li>
              <li>"car"（汽车）</li>
            </ul>
          </div>
          <div className="card-green">
            <h4 className="card-title-green">向量空间可视化</h4>
            <p className="card-description-green">
              在向量空间中：
            </p>
            <ul className="list-styled list-green">
              <li>"cat" 和 "dog" 距离较近（都是动物）</li>
              <li>"cat" 和 "computer" 距离较远</li>
              <li>"computer" 和 "car" 距离中等（都是科技产品）</li>
            </ul>
          </div>
        </div>

        <h3 className="subsection-title">1.3 向量维度</h3>
        <p className="paragraph">
          Embedding向量的维度决定了它能表示多少信息。维度越高，理论上能表示越细粒度的语义，但计算成本也越高。
        </p>

        <div className="info-card info-card-purple">
          <h4 className="card-title-purple">常见维度对比</h4>
          <table className="styled-table">
            <thead>
              <tr>
                <th>模型</th>
                <th>维度</th>
                <th>特点</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>text-embedding-3-small</td>
                <td>1536</td>
                <td>快速、成本低</td>
              </tr>
              <tr>
                <td>text-embedding-3-large</td>
                <td>3072</td>
                <td>语义丰富、成本较高</td>
              </tr>
              <tr>
                <td>HuggingFace sentence-transformers</td>
                <td>384-768</td>
                <td>开源、可本地运行</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="EmbeddingModel接口" className="content-section">
        <SectionHeader number={2} title="EmbeddingModel接口" />

        <h3 className="subsection-title">2.1 接口方法</h3>
        <p className="paragraph">
          EmbeddingModel是LangChain4j的核心接口，定义了将文本转换为embedding的标准方法。
        </p>

        <CodeBlock language="java" filename="BasicEmbeddingExample.java" code={basicEmbedding} />

        <TipBox type="info" title="主要方法说明">
          <ul className="tip-box-list">
            <li><strong>embed(String text)</strong>：将单个文本转换为embedding</li>
            <li><strong>embed(TextSegment segment)</strong>：将文本段转换为embedding</li>
            <li><strong>embedAll(List&lt;TextSegment&gt;)</strong>：批量转换多个文本段</li>
            <li><strong>dimension()</strong>：返回embedding的向量维度</li>
            <li><strong>modelName()</strong>：返回底层模型名称</li>
          </ul>
        </TipBox>

        <h3 className="subsection-title">2.2 批量Embedding</h3>
        <p className="paragraph">
          对于大量文档，使用批量Embedding可以显著提高效率：
        </p>

        <CodeBlock language="java" filename="BatchEmbeddingExample.java" code={batchEmbedding} />

        <TipBox type="success" title="批量处理优势">
          <ul className="tip-box-list">
            <li><strong>减少API调用</strong>：一次调用处理多个文档</li>
            <li><strong>降低延迟</strong>：避免多个单独请求的网络开销</li>
            <li><strong>成本优化</strong>：批量处理通常有折扣</li>
            <li><strong>适用场景</strong>：文档索引、大规模数据处理</li>
          </ul>
        </TipBox>
      </section>

      <section id="主流模型" className="content-section">
        <SectionHeader number={3} title="主流模型" />

        <h3 className="subsection-title">3.1 OpenAI Embedding</h3>
        <p className="paragraph">
          OpenAI提供的text-embedding模型是最常用的选择之一，支持多种维度和性能级别。
        </p>

        <div className="grid-2col">
          <div className="card-blue">
            <h4 className="card-title-blue">text-embedding-3-small</h4>
            <ul className="list-styled list-blue">
              <li><strong>维度</strong>：1536</li>
              <li><strong>性能</strong>：快</li>
              <li><strong>成本</strong>：低</li>
              <li><strong>适用</strong>：大多数RAG场景</li>
            </ul>
          </div>
          <div className="card-blue">
            <h4 className="card-title-blue">text-embedding-3-large</h4>
            <ul className="list-styled list-blue">
              <li><strong>维度</strong>：3072</li>
              <li><strong>性能</strong>：中等</li>
              <li><strong>成本</strong>：较高</li>
              <li><strong>适用</strong>：需要更高精度</li>
            </ul>
          </div>
        </div>

        <h3 className="subsection-title">3.2 HuggingFace Embedding</h3>
        <p className="paragraph">
          HuggingFace提供大量开源的embedding模型，可以免费使用或本地部署。
        </p>

        <div className="info-card info-card-green">
          <h4 className="card-title-green">常用HuggingFace模型</h4>
          <ul className="list-styled list-green">
            <li><strong>sentence-transformers/all-MiniLM-L6-v2</strong>：384维，速度快</li>
            <li><strong>sentence-transformers/all-mpnet-base-v2</strong>：768维，平衡性好</li>
            <li><strong>BAAI/bge-m3</strong>：1024维，中文优化</li>
            <li><strong>优势</strong>：免费、可离线运行、多语言支持</li>
          </ul>
        </div>

        <h3 className="subsection-title">3.3 模型选择建议</h3>
        <p className="paragraph">根据不同场景选择合适的embedding模型：</p>

        <div className="grid-3col">
          <div className="card-purple">
            <h4 className="card-title-purple">🚀 速度优先</h4>
            <p className="card-description-purple">实时应用、高并发</p>
            <div className="code-inline">text-embedding-3-small</div>
          </div>
          <div className="card-purple">
            <h4 className="card-title-purple">⚖️ 平衡优先</h4>
            <p className="card-description-purple">大多数RAG场景</p>
            <div className="code-inline">sentence-transformers/mpnet</div>
          </div>
          <div className="card-purple">
            <h4 className="card-title-purple">🎯 精度优先</h4>
            <p className="card-description-purple">复杂查询、专业领域</p>
            <div className="code-inline">text-embedding-3-large</div>
          </div>
        </div>
      </section>

      <section id="相似度计算" className="content-section">
        <SectionHeader number={4} title="相似度计算" />

        <h3 className="subsection-title">4.1 余弦相似度</h3>
        <p className="paragraph">
          余弦相似度是计算向量相似度最常用的方法，它计算两个向量之间的夹角余弦值，范围在[-1, 1]之间，值越接近1表示越相似。
        </p>

        <CodeBlock language="java" filename="CosineSimilarity.java" code={similarityCalculation} />

        <TipBox type="info" title="为什么选择余弦相似度？">
          <ul className="tip-box-list">
            <li><strong>标准化</strong>：只关心向量方向，不受长度影响</li>
            <li><strong>高效</strong>：计算复杂度O(n)</li>
            <li><strong>适合高维</strong>：在高维向量空间表现良好</li>
            <li><strong>直观</strong>：值域[-1, 1]易于理解</li>
          </ul>
        </TipBox>

        <h3 className="subsection-title">4.2 其他相似度方法</h3>
        <p className="paragraph">除了余弦相似度，还有其他计算方法：</p>

        <div className="grid-2col">
          <div className="card">
            <h4 className="card-title">欧几里得距离</h4>
            <p className="card-description">计算向量之间的直线距离</p>
            <div className="code-inline">d = √(Σ(ai - bi)²)</div>
            <p className="card-description">适合低维数据</p>
          </div>
          <div className="card">
            <h4 className="card-title">点积</h4>
            <p className="card-description">向量点乘积</p>
            <div className="code-inline">d = a · b</div>
            <p className="card-description">需要向量先归一化</p>
          </div>
        </div>
      </section>

      <section id="RAG应用" className="content-section">
        <SectionHeader number={5} title="RAG应用基础" />

        <h3 className="subsection-title">5.1 RAG工作流程</h3>
        <p className="paragraph">
          检索增强生成（RAG）结合了信息检索和LLM生成能力，是构建知识库问答系统的核心技术。
        </p>

        <div className="info-card info-card-indigo">
          <h4 className="card-title-indigo">RAG五个步骤</h4>
          <ol className="list-styled list-indigo">
            <li><strong>文档准备</strong>：将文档切分为适当的文本段</li>
            <li><strong>生成Embedding</strong>：使用EmbeddingModel将文本段转换为向量</li>
            <li><strong>存储向量</strong>：将embedding存储到向量数据库</li>
            <li><strong>检索相关文档</strong>：根据查询embedding找到最相似的文档</li>
            <li><strong>生成回答</strong>：将检索到的文档和问题一起发送给LLM</li>
          </ol>
        </div>

        <h3 className="subsection-title">5.2 完整RAG示例</h3>
        <p className="paragraph">
          使用LangChain4j构建完整的RAG系统：
        </p>

        <CodeBlock language="java" filename="RAGCompleteExample.java" code={ragBasic} />

        <TipBox type="success" title="RAG最佳实践">
          <ul className="tip-box-list">
            <li><strong>控制上下文</strong>：只使用Top-K最相关的文档</li>
            <li><strong>文档切片</strong>：将长文档切分为语义完整的小段</li>
            <li><strong>元数据过滤</strong>：使用metadata缩小检索范围</li>
            <li><strong>重排序</strong>：对检索结果进行二次排序</li>
            <li><strong>评估测试</strong>：使用RAGAS评估检索质量</li>
          </ul>
        </TipBox>
      </section>

      <section id="最佳实践" className="content-section">
        <SectionHeader number={6} title="最佳实践" />

        <h3 className="subsection-title">6.1 性能优化</h3>
        <p className="paragraph">
          优化Embedding相关的性能可以显著提升系统效率：
        </p>

        <CodeBlock language="java" filename="PerformanceOptimization.java" code={performanceOptimization} />

        <div className="info-card info-card-purple">
          <h4 className="card-title-purple">性能优化要点</h4>
          <ul className="list-styled list-purple">
            <li><strong>批量处理</strong>：使用embedAll而非多次embed调用</li>
            <li><strong>缓存策略</strong>：避免重复生成相同的embedding</li>
            <li><strong>分批加载</strong>：大量文档时分批处理避免OOM</li>
            <li><strong>异步处理</strong>：对于在线模型，使用异步API调用</li>
            <li><strong>模型选择</strong>：根据需求选择合适维度的模型</li>
          </ul>
        </div>

        <h3 className="subsection-title">6.2 向量数据库选择</h3>
        <p className="paragraph">
          选择合适的向量数据库对RAG系统的性能至关重要：
        </p>

        <div className="grid-2col">
          <div className="card-green">
            <h4 className="card-title-green">轻量级场景</h4>
            <ul className="list-styled list-green">
              <li>InMemoryEmbeddingStore</li>
              <li>适合：测试、原型、小规模</li>
              <li>优势：零配置、快速</li>
            </ul>
          </div>
          <div className="card-blue">
            <h4 className="card-title-blue">生产环境</h4>
            <ul className="list-styled list-blue">
              <li>Pinecone、Weaviate、Milvus</li>
              <li>适合：大规模、高并发</li>
              <li>优势：可扩展、持久化</li>
            </ul>
          </div>
        </div>

        <h3 className="subsection-title">6.3 成本控制</h3>
        <p className="paragraph">
          合理控制Embedding相关的成本：
        </p>

        <div className="info-card info-card-yellow">
          <h4 className="card-title-yellow">成本优化建议</h4>
          <ul className="list-styled list-yellow">
            <li><strong>模型选择</strong>：优先使用small模型而非large模型</li>
            <li><strong>缓存机制</strong>：避免重复生成相同内容的embedding</li>
            <li><strong>批量折扣</strong>：利用批量处理的优惠价格</li>
            <li><strong>本地模型</strong>：考虑使用HuggingFace开源模型</li>
            <li><strong>监控分析</strong>：定期分析embedding使用量和成本</li>
          </ul>
        </div>
      </section>

      <section id="常见问题" className="content-section">
        <SectionHeader number={7} title="常见问题" />

        <h3 className="subsection-title">7.1 故障排查</h3>
        <p className="paragraph">
          Embedding使用中的常见问题和解决方案：
        </p>

        <CodeBlock language="java" filename="Troubleshooting.java" code={troubleshooting} />

        <TipBox type="warning" title="常见错误总结">
          <ul className="tip-box-list">
            <li><strong>向量维度不匹配</strong>：混用不同模型导致检索失败</li>
            <li><strong>内存溢出</strong>：一次性处理太多文档</li>
            <li><strong>相似度计算错误</strong>：使用欧几里得距离而非余弦相似度</li>
            <li><strong>API配额限制</strong>：超出调用速率限制</li>
          </ul>
        </TipBox>

        <h3 className="subsection-title">7.2 FAQ</h3>
        <div className="faq-section">
          <div className="faq-item">
            <h4 className="faq-question">Q: Embedding的维度越高越好吗？</h4>
            <p className="faq-answer">
              A: 不一定。更高的维度可以表示更多信息，但也会增加存储空间、计算成本和延迟。
              建议：根据实际场景选择，大多数RAG应用1536维已经足够。
            </p>
          </div>

          <div className="faq-item">
            <h4 className="faq-question">Q: 如何选择适合中文的embedding模型？</h4>
            <p className="faq-answer">
              A: 推荐使用专门针对中文训练的模型，如：
              - BAAI/bge系列（北京智源研究院）
              - m3e-base（Massive Multilingual Text Embedding）
              - 这些模型在中文语义理解上表现更好。
            </p>
          </div>

          <div className="faq-item">
            <h4 className="faq-question">Q: RAG系统需要多少文档才能工作？</h4>
            <p className="faq-answer">
              A: 没有固定要求，但建议：
              - 小规模测试：100-1000篇文档
              - 中等规模：1000-10000篇
              - 生产环境：根据查询量和质量要求调整
              重要：文档质量和相关性比数量更重要。
            </p>
          </div>

          <div className="faq-item">
            <h4 className="faq-question">Q: 如何评估Embedding的质量？</h4>
            <p className="faq-answer">
              A: 可以通过以下方法评估：
              - 检索准确率：Top-K结果的相关性
              - RAGAS评估：检索增强生成的质量指标
              - 人工抽样：随机检查检索结果的合理性
              - A/B测试：对比不同模型的效果
            </p>
          </div>

          <div className="faq-item">
            <h4 className="faq-question">Q: Embedding可以用于多模态吗？</h4>
            <p className="faq-answer">
              A: 可以。除了文本embedding，还有：
              - 图像embedding（CLIP等模型）
              - 音频embedding
              - 多模态embedding（同时处理文本和图像）
              LangChain4j支持TextSegment，可以扩展用于其他模态。
            </p>
          </div>
        </div>
      </section>

      <SummarySection
        description="本节深入讲解了LangChain4j的Embedding模型："
        items={[
          '<strong>基础概念</strong>：Embedding原理、向量空间、语义理解',
          '<strong>EmbeddingModel接口</strong>：embed、embedAll、dimension等方法',
          '<strong>主流模型</strong>：OpenAI、HuggingFace等embedding模型对比',
          '<strong>相似度计算</strong>：余弦相似度实现和应用',
          '<strong>RAG应用</strong>：完整的RAG流程实现示例',
          '<strong>最佳实践</strong>：性能优化、向量数据库选择、成本控制',
          '<strong>常见问题</strong>：故障排查和FAQ解答',
        ]}
        footer="🎉 恭喜你掌握了Embedding模型！继续学习核心概念，深入了解ChatModel和AiServices。"
      />
    </Layout>
  );
};

export default EmbeddingModelsPage;
