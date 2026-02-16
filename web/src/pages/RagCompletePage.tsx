import Layout from '../components/layout/Layout';
import { SectionHeader, CodeBlockWithCopy, TipBox } from '../components/ui';

const RagCompletePage = () => {
  return (
    <Layout>
      <div className="flex items-center gap-3 mb-8 text-sm">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">RAG</span>
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">核心</span>
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">~30分钟</span>
      </div>

      <h1 className="text-5xl font-bold text-gray-900 mb-6">RAG完整指南</h1>
      <p className="text-xl text-gray-600 mb-8 leading-relaxed">
        检索索增强生成（RAG）是让大语言模型访问私有数据和领域知识的关键技术。
        本章将深入探讨RAG的核心概念、实现步骤、最佳实践以及如何使用LangChain4j构建生产级RAG系统。
      </p>

      <div className="bg-gray-50 rounded-lg p-6 mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 本章目录</h2>
        <ol className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 font-mono">1.</span>
            <span><a href="#overview" className="text-indigo-600 hover:underline">RAG基础概念</a></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 font-mono">2.</span>
            <span><a href="#document-loading" className="text-indigo-600 hover:underline">文档加载与处理</a></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 font-mono">3.</span>
            <span><a href="#chunking" className="text-indigo-600 hover:underline">文本分块策略</a></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 font-mono">4.</span>
            <span><a href="#embeddings" className="text-indigo-600 hover:underline">Embedding生成</a></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 font-mono">5.</span>
            <span><a href="#vector-store" className="text-indigo-600 hover:underline">向量数据库集成</a></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 font-mono">6.</span>
            <span><a href="#retrieval" className="text-indigo-600 hover:underline">检索算法与策略</a></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 font-mono">7.</span>
            <span><a href="#rag-pipeline" className="text-indigo-600 hover:underline">完整RAG流水线</a></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 font-mono">8.</span>
            <span><a href="#advanced-rag" className="text-indigo-600 hover:underline">高级RAG技巧</a></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 font-mono">9.</span>
            <span><a href="#best-practices" className="text-indigo-600 hover:underline">最佳实践与优化</a></span>
          </li>
        </ol>
      </div>

      <section id="overview" className="content-section">
        <SectionHeader number={1} title="RAG基础概念" />

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 mb-6">
          <h3 className="subsection-title-sm">什么是RAG？</h3>
          <p className="text-gray-700 mb-4">
            <strong>检索增强生成（Retrieval-Augmented Generation，RAG）</strong>是一种技术，
            通过在将用户问题发送给LLM之前，先从外部数据源检索相关信息，然后将这些信息注入到提示词中。
            这样可以让LLM访问它训练数据之外的私有、实时或特定领域的知识。
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4 text-xl">RAG工作流程</h4>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">1</div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">文档摄入（Ingestion）</div>
                <p className="text-gray-600 text-sm mt-1">加载原始文档，进行清理、分块、生成Embedding</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">2</div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">向量存储（Vector Storage）</div>
                <p className="text-gray-600 text-sm mt-1">将Embedding向量和对应的文本段存入向量数据库</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold flex-shrink-0">3</div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">相似度检索（Retrieval）</div>
                <p className="text-gray-600 text-sm mt-1">将用户查询转换为Embedding，搜索最相似的文本段</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold flex-shrink-0">4</div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">增强生成（Augmented Generation）</div>
                <p className="text-gray-600 text-sm mt-1">将检索到的相关信息注入Prompt，让LLM生成准确回答</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid-2col">
          <div className="border border-gray-200 rounded-lg p-5 hover:border-indigo-300 transition-colors">
            <div className="text-2xl mb-3">✅</div>
            <h4 className="font-semibold text-gray-900 mb-2">RAG优势</h4>
            <ul className="space-y-2 text-gray-700 text-sm list-disc list-inside">
              <li>访问私有/专有数据</li>
              <li>减少LLM幻觉（虚假信息）</li>
              <li>实时更新知识（无需重新训练）</li>
              <li>可解释性强（追溯回答来源）</li>
              <li>成本效益高（比微调便宜）</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-5 hover:border-indigo-300 transition-colors">
            <div className="text-2xl mb-3">⚠️</div>
            <h4 className="font-semibold text-gray-900 mb-2">RAG挑战</h4>
            <ul className="space-y-2 text-gray-700 text-sm list-disc list-inside">
              <li>检索质量直接影响回答质量</li>
              <li>上下文窗口限制（Token超限）</li>
              <li>分块策略需要调优</li>
              <li>延迟增加（检索+生成两步）</li>
              <li>复杂问题难以检索</li>
            </ul>
          </div>
        </div>

        <TipBox type="info" title="应用场景">
          <p className="text-blue-800">
            RAG适用于各种场景：企业知识库问答、法律文档检索、医疗诊断辅助、
            代码文档搜索、产品说明书查询、学术文献分析、个人笔记助手等。
            任何需要让AI访问特定知识库的场景都可以使用RAG。
          </p>
        </TipBox>
      </section>

      <section id="document-loading" className="content-section">
        <SectionHeader number={2} title="文档加载与处理" />

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="subsection-title-sm">LangChain4j文档加载器</h3>
          <p className="text-gray-700 mb-4">
            LangChain4j提供了多种DocumentLoader，可以方便地从各种来源加载文档：
          </p>
          <div className="grid-3col">
            <div className="card">
              <div className="subsection-title">文件系统</div>
              <p className="card-description">从本地文件系统加载</p>
            </div>
            <div className="card">
              <div className="subsection-title">云存储</div>
              <p className="card-description">S3、Azure、GCS等</p>
            </div>
            <div className="card">
              <div className="subsection-title">网络爬虫</div>
              <p className="card-description">Selenium、Playwright</p>
            </div>
            <div className="card">
              <div className="subsection-title">代码库</div>
              <p className="card-description">GitHub、GitLab等</p>
            </div>
            <div className="card">
              <div className="subsection-title">URL</div>
              <p className="card-description">直接从URL加载</p>
            </div>
            <div className="card">
              <div className="subsection-title">Classpath</div>
              <p className="card-description">从classpath资源加载</p>
            </div>
          </div>
        </div>

        <CodeBlockWithCopy
          language="java"
          filename="FileSystemDocumentLoader.java"
          title="Java - FileSystem文档加载"
          code={`import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.DocumentLoader;
import dev.langchain4j.data.document.DocumentSplitter;
import dev.langchain4j.data.document.splitter.DocumentByParagraphSplitter;
import dev.langchain4j.data.document.splitter.DocumentByLineSplitter;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.openai.OpenAiEmbeddingModel;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

public class FileSystemDocumentLoader {

    public static void main(String[] args) throws Exception {
        Path documentsPath = Paths.get("path/to/your/documents");
        DocumentLoader loader = new DocumentLoader(documentsPath);

        System.out.println("正在加载文档...");
        List<Document> documents = loader.load();

        System.out.println("加载了 " + documents.size() + " 个文档");
        documents.forEach(doc -> System.out.println(
                " - " + doc.text().substring(0, Math.min(50, doc.text().length())) + "..."
        ));

        DocumentSplitter paragraphSplitter = new DocumentByParagraphSplitter();

        System.out.println("\\n按段落分割文档...");
        List<TextSegment> segments = paragraphSplitter.split(documents);

        System.out.println("分割成 " + segments.size() + " 个文本段");
        segments.forEach(seg -> System.out.println(
                " - 段落长度: " + seg.text().length() + " 字符"
        ));

        EmbeddingModel embeddingModel = OpenAiEmbeddingModel.builder()
                .apiKey("your-openai-api-key")
                .modelName("text-embedding-3-small")
                .build();

        System.out.println("\\n生成Embeddings...");
    }
}`}
        />

        <TipBox type="success" title="文档加载最佳实践">
          <ul className="space-y-1 text-sm">
            <li><strong>元数据丰富化</strong>：保存文件路径、修改时间、作者等，便于后续过滤</li>
            <li><strong>文本清理</strong>：去除HTML标签、特殊字符、多余空白</li>
            <li><strong>编码处理</strong>：统一使用UTF-8编码，处理乱码</li>
            <li><strong>异常处理</strong>：捕获并记录加载失败的文件</li>
            <li><strong>增量更新</strong>：支持增量加载，避免全量重新加载</li>
          </ul>
        </TipBox>
      </section>

      <section id="chunking" className="content-section">
        <SectionHeader number={3} title="文本分块策略" />

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 mb-6">
          <h4 className="font-semibold text-yellow-900 mb-2">⚠️ 为什么需要分块？</h4>
          <p className="text-yellow-800 text-sm">
            LLM的上下文窗口有限，无法一次性处理整个文档。此外，Embedding模型也有长度限制。
            分块可以让检索更精确（查询只匹配相关部分），同时避免超出Token限制。
          </p>
        </div>

        <div className="grid-2col">
          <div className="border border-gray-200 rounded-lg p-5">
            <h4 className="font-semibold text-gray-900 mb-2">固定大小分块</h4>
            <p className="text-sm text-gray-600 mb-3">按固定字符数或Token数分割</p>
            <ul className="space-y-1 text-gray-700 text-sm">
              <li> 简单快速</li>
              <li> 可能在句子中间切断</li>
              <li> 适合：代码、日志文件</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <h4 className="font-semibold text-gray-900 mb-2">段落/章节分块</h4>
            <p className="text-sm text-gray-600 mb-3">按段落、章节等自然单位分割</p>
            <ul className="space-y-1 text-gray-700 text-sm">
              <li> 保持语义完整</li>
              <li> 适合：文章、文档</li>
              <li> 可能导致块大小不均</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <h4 className="font-semibold text-gray-900 mb-2">重叠分块</h4>
            <p className="text-sm text-gray-600 mb-3">块之间有重叠部分</p>
            <ul className="space-y-1 text-gray-700 text-sm">
              <li> 减少信息丢失</li>
              <li> 提高检索召回率</li>
              <li> 增加Token消耗</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <h4 className="font-semibold text-gray-900 mb-2">语义分块</h4>
            <p className="text-sm text-gray-600 mb-3">根据语义相似度智能分块</p>
            <ul className="space-y-1 text-gray-700 text-sm">
              <li> 质量最佳</li>
              <li> 需要额外计算</li>
              <li> 速度较慢</li>
            </ul>
          </div>
        </div>

        <CodeBlockWithCopy
          language="java"
          filename="ChunkingStrategies.java"
          title="Java - 文本分块策略"
          code={`import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.DocumentSplitter;
import dev.langchain4j.data.document.splitter.DocumentByCharacterSplitter;
import dev.langchain4j.data.document.splitter.DocumentByLineSplitter;
import dev.langchain4j.data.document.splitter.DocumentByParagraphSplitter;
import dev.langchain4j.data.segment.TextSegment;

import java.util.List;

public class ChunkingStrategies {

    public static void main(String[] args) {
        String sampleText = """
            LangChain4j是一个强大的Java库，
            它简化了将大语言模型集成到Java应用中的过程。
            支持多种模型提供商和向量数据库。
            可以轻松实现RAG（检索增强生成）系统。
            在企业应用中表现优异。
            """;

        System.out.println("=== 策略1: 固定字符数分块 ===");
        DocumentSplitter charSplitter = new DocumentByCharacterSplitter(100, 10);
        List<TextSegment> charChunks = charSplitter.split(
                Document.from(sampleText)
        );

        System.out.println("分块数: " + charChunks.size());
        charChunks.forEach((chunk, index) -> System.out.printf(
                "块 %d (长度:%d): %s...%n",
                index + 1, chunk.text().length(), chunk.text().substring(0, 50)
        ));

        System.out.println("\\n=== 策略2: 按段落分块 ===");
        DocumentSplitter paragraphSplitter = new DocumentByParagraphSplitter();
        List<TextSegment> paragraphChunks = paragraphSplitter.split(
                Document.from(sampleText)
        );

        System.out.println("分块数: " + paragraphChunks.size());
        paragraphChunks.forEach((chunk, index) -> System.out.printf(
                "块 %d (长度:%d): %s%n",
                index + 1, chunk.text().length(), chunk.text()
        ));

        System.out.println("\\n=== 策略3: 按行分块 ===");
        DocumentSplitter lineSplitter = new DocumentByLineSplitter();
        List<TextSegment> lineChunks = lineSplitter.split(
                Document.from(sampleText)
        );

        System.out.println("分块数: " + lineChunks.size());
        lineChunks.forEach((chunk, index) -> System.out.printf(
                "块 %d: %s%n",
                index + 1, chunk.text()
        ));
    }
}`}
        />

        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-5 rounded-r-lg">
          <h4 className="font-semibold text-indigo-900 mb-2">💡 分块策略选择指南</h4>
          <table className="w-full text-sm text-indigo-800">
            <thead>
              <tr className="border-b border-indigo-300">
                <th className="text-left py-2">场景</th>
                <th className="text-left py-2">推荐策略</th>
                <th className="text-left py-2">块大小</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-indigo-200">
                <td className="py-2">技术文档</td>
                <td className="py-2">段落 + 重叠</td>
                <td className="py-2">500-1000</td>
              </tr>
              <tr className="border-b border-indigo-200">
                <td className="py-2">学术论文</td>
                <td className="py-2">章节 + 重叠</td>
                <td className="py-2">1000-2000</td>
              </tr>
              <tr className="border-b border-indigo-200">
                <td className="py-2">代码文件</td>
                <td className="py-2">函数/类 + 重叠</td>
                <td className="py-2">200-500</td>
              </tr>
              <tr>
                <td className="py-2">聊天记录</td>
                <td className="py-2">对话 + 重叠</td>
                <td className="py-2">300-800</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="embeddings" className="content-section">
        <SectionHeader number={4} title="Embedding生成" />

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="subsection-title-sm">什么是Embedding？</h3>
          <p className="text-gray-700 mb-4">
            <strong>Embedding（嵌入）</strong>是将文本、图像等数据转换为数值向量的过程。
            这些向量在高维空间中保留了数据的语义信息，相似的文本在向量空间中距离较近。
            Embedding是向量检索的核心，使得机器可以计算语义相似度。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="font-semibold text-gray-900 mb-2">文本向量</div>
              <p className="text-sm text-gray-600">将句子/段落转换为数值向量</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="font-semibold text-gray-900 mb-2">语义相似度</div>
              <p className="text-sm text-gray-600">相似概念的向量距离更近</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="font-semibold text-gray-900 mb-2">向量检索</div>
              <p className="text-sm text-gray-600">通过距离计算找到最相关内容</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="font-semibold text-gray-900 mb-2">多语言支持</div>
              <p className="text-sm text-gray-600">跨语言语义对齐</p>
            </div>
          </div>
        </div>

        <CodeBlockWithCopy
          language="java"
          filename="EmbeddingGeneration.java"
          title="Java - Embedding生成"
          code={`import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.openai.OpenAiEmbeddingModel;

import java.util.List;
import java.util.ArrayList;

public class EmbeddingGeneration {

    public static void main(String[] args) {
        EmbeddingModel embeddingModel = OpenAiEmbeddingModel.builder()
                .apiKey("your-openai-api-key")
                .modelName("text-embedding-3-small")
                .build();

        List<TextSegment> segments = createSampleSegments();

        System.out.println("为 " + segments.size() + " 个文本段生成Embeddings...");

        List<Embedding> embeddings = embeddingModel.embedAll(segments);

        System.out.println("\\n生成完成！Embedding信息:");
        for (int i = 0; i < embeddings.size(); i++) {
            Embedding embedding = embeddings.get(i);
            TextSegment segment = segments.get(i);

            System.out.printf("\\n=== 文本段 %d ===%n", i + 1);
            System.out.println("文本: " + segment.text());
            System.out.println("向量维度: " + embedding.vector().length);
        }
    }

    private static List<TextSegment> createSampleSegments() {
        List<TextSegment> segments = new ArrayList<>();

        segments.add(TextSegment.from(
                "LangChain4j是一个Java库，用于简化大语言模型的集成。"
        ));

        segments.add(TextSegment.from(
                "它支持多种模型提供商，包括OpenAI、Google、Hugging Face等。"
        ));

        segments.add(TextSegment.from(
                "开发者可以使用LangChain4j快速构建AI应用。"
        ));

        segments.add(TextSegment.from(
                "该框架提供统一的API，避免学习特定供应商的API。"
        ));

        segments.add(TextSegment.from(
                "LangChain4j被广泛应用于企业级AI应用中。"
        ));

        return segments;
    }
}`}
        />

        <h3 className="text-2xl font-semibold text-gray-900 mb-4">4.2 不同模型对比</h3>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-50">
                <th className="text-left py-3 font-semibold">模型</th>
                <th className="text-left py-3 font-semibold">维度</th>
                <th className="text-left py-3 font-semibold">速度</th>
                <th className="text-left py-3 font-semibold">质量</th>
                <th className="text-left py-3 font-semibold">成本</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-3 font-medium">text-embedding-3-small</td>
                <td className="py-3">1536</td>
                <td className="py-3 text-green-600">⚡ 快</td>
                <td className="py-3">中等</td>
                <td className="py-3 text-green-600">$0.00002/1K tokens</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 font-medium">text-embedding-3-large</td>
                <td className="py-3">3072</td>
                <td className="py-3">⚡</td>
                <td className="py-3 text-green-600">🌟 高</td>
                <td className="py-3 text-yellow-600">$0.00013/1K tokens</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 font-medium">text-embedding-ada-002</td>
                <td className="py-3">1536</td>
                <td className="py-3 text-green-600">⚡⚡ 快</td>
                <td className="py-3">较低</td>
                <td className="py-3 text-green-600">$0.0001/1K tokens</td>
              </tr>
              <tr>
                <td className="py-3 font-medium">multilingual-e5-large</td>
                <td className="py-3">1024</td>
                <td className="py-3">⚡</td>
                <td className="py-3">高（多语言）</td>
                <td className="py-3 text-green-600">$0.00002/1K tokens</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="vector-store" className="content-section">
        <SectionHeader number={5} title="向量数据库集成" />

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="subsection-title-sm">LangChain4j支持的向量数据库</h3>
          <p className="text-gray-700 mb-4">
            LangChain4j提供了统一的EmbeddingStore接口，支持30+种向量数据库：
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="font-semibold text-gray-900 mb-2">In-memory</div>
              <p className="text-sm text-gray-600">内存存储（原型用）</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="font-semibold text-gray-900 mb-2">PGVector</div>
              <p className="text-sm text-gray-600">PostgreSQL</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="font-semibold text-gray-900 mb-2">Milvus</div>
              <p className="text-sm text-gray-600">开源向量数据库</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="font-semibold text-gray-900 mb-2">Pinecone</div>
              <p className="text-sm text-gray-600">托管向量数据库</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="font-semibold text-gray-900 mb-2">Chroma</div>
              <p className="text-sm text-gray-600">轻量向量数据库</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="font-semibold text-gray-900 mb-2">Qdrant</div>
              <p className="text-sm text-gray-600">高性能向量数据库</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="font-semibold text-gray-900 mb-2">Elasticsearch</div>
              <p className="text-sm text-gray-600">企业搜索引擎</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="font-semibold text-gray-900 mb-2">Redis</div>
              <p className="text-sm text-gray-600">缓存+向量</p>
            </div>
          </div>
        </div>

        <CodeBlockWithCopy
          language="java"
          filename="InMemoryStoreExample.java"
          title="Java - In-memory存储"
          code={`import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.openai.OpenAiEmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.inmemory.InMemoryEmbeddingStore;
import dev.langchain4j.store.embedding.filter.Filter;

import java.util.List;
import java.util.ArrayList;

public class InMemoryStoreExample {

    public static void main(String[] args) {
        EmbeddingStore<TextSegment> embeddingStore = new InMemoryEmbeddingStore<>();

        EmbeddingModel embeddingModel = OpenAiEmbeddingModel.builder()
                .apiKey("your-api-key")
                .modelName("text-embedding-3-small")
                .build();

        List<TextSegment> segments = createSegments();

        System.out.println("生成并存储Embeddings...");
        for (TextSegment segment : segments) {
            Embedding embedding = embeddingModel.embed(segment.text()).content();

            String id = embeddingStore.add(
                    embedding,
                    segment,
                    Filter.from("category", "tech")
                           .put("language", "zh-CN")
            ).id();

            System.out.println("已存储: " + id + " - " + segment.text().substring(0, 30) + "...");
        }

        System.out.println("\\n执行相似度搜索...");
        List<EmbeddingMatch<TextSegment>> results = embeddingStore.findRelevant(
                "Java框架",
                2,
                0.7
        );

        System.out.println("搜索结果:");
        for (EmbeddingMatch<TextSegment> match : results) {
            System.out.printf(
                    "  相似度: %.3f | 文本: %s%n",
                    match.score(),
                    match.embedded().text().substring(0, 50) + "..."
            );
        }

        System.out.println("\\n按元数据过滤...");
        Filter filter = Filter.metadataKey("category").isEqualTo("tech");
        List<EmbeddingMatch<TextSegment>> filteredResults = embeddingStore.findRelevant(
                "Java开发",
                3,
                0.6,
                filter
        );

        System.out.println("过滤后结果数: " + filteredResults.size());
    }

    private static List<TextSegment> createSegments() {
        List<TextSegment> segments = new ArrayList<>();
        segments.add(TextSegment.from("LangChain4j是Java的开源AI框架"));
        segments.add(TextSegment.from("它简化了LLM的集成工作"));
        segments.add(TextSegment.from("支持多种模型提供商"));
        segments.add(TextSegment.from("提供统一的API接口"));
        segments.add(TextSegment.from("适用于企业级应用"));
        return segments;
    }
}`}
        />

        <TipBox type="success" title="向量数据库选择建议">
          <ul className="space-y-1 text-sm">
            <li><strong>开发/原型</strong>：使用InMemoryEmbeddingStore</li>
            <li><strong>小规模生产</strong>：PGVector（PostgreSQL扩展）或Redis</li>
            <li><strong>中等规模</strong>：Chroma、Qdrant、Weaviate</li>
            <li><strong>大规模生产</strong>：Pinecone、Milvus、Elasticsearch</li>
            <li><strong>评估因素</strong>：性能、成本、运维复杂度、社区支持</li>
          </ul>
        </TipBox>
      </section>

      <section id="retrieval" className="content-section">
        <SectionHeader number={6} title="检索算法与策略" />

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="subsection-title-sm">检索质量决定RAG效果</h3>
          <p className="text-gray-700 mb-4">
            检索是RAG系统的核心，高质量的检索才能让LLM生成准确回答。
            LangChain4j提供了ContentRetriever接口和多种检索策略。
          </p>
        </div>

        <CodeBlockWithCopy
          language="java"
          filename="VectorRetrieverExample.java"
          title="Java - 向量检索"
          code={`import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.content.retriever.EmbeddingStoreContentRetriever;
import dev.langchain4j.rag.query.Query;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.inmemory.InMemoryEmbeddingStore;
import dev.langchain4j.store.embedding.filter.Filter;

import java.util.List;

public class VectorRetrieverExample {

    public static void main(String[] args) {
        EmbeddingStore<TextSegment> embeddingStore = prepareEmbeddingStore();
        dev.langchain4j.model.embedding.EmbeddingModel embeddingModel = OpenAiEmbeddingModel.builder()
                .apiKey("your-api-key")
                .modelName("text-embedding-3-small")
                .build();

        ContentRetriever retriever = EmbeddingStoreContentRetriever.builder()
                .embeddingStore(embeddingStore)
                .embeddingModel(embeddingModel)
                .maxResults(5)
                .minScore(0.6)
                .build();

        String userQuery = "如何使用LangChain4j构建RAG系统？";
        System.out.println("用户查询: " + userQuery);
        System.out.println("\\n检索相关内容...");

        List<TextSegment> relevantSegments = retriever.retrieve(
                Query.from(userQuery)
        );

        System.out.println("\\n检索到 " + relevantSegments.size() + " 个相关片段:");
        for (int i = 0; i < relevantSegments.size(); i++) {
            TextSegment segment = relevantSegments.get(i);
            System.out.printf("\\n=== 结果 %d ===%n", i + 1);
            System.out.println("文本: " + segment.text());
            if (segment.metadata() != null) {
                System.out.println("元数据: " + segment.metadata().asMap());
            }
        }
    }

    private static EmbeddingStore<TextSegment> prepareEmbeddingStore() {
        EmbeddingStore<TextSegment> store = new InMemoryEmbeddingStore<>();
        dev.langchain4j.model.embedding.EmbeddingModel model = OpenAiEmbeddingModel.builder()
                .apiKey("your-api-key")
                .modelName("text-embedding-3-small")
                .build();

        List<TextSegment> segments = createSampleSegments();

        for (TextSegment segment : segments) {
            store.add(model.embed(segment.text()).content(), segment);
        }

        return store;
    }

    private static List<TextSegment> createSampleSegments() {
        return List.of(
                TextSegment.from("LangChain4j是Java的开源AI框架").with("category", "tech"),
                TextSegment.from("支持多种模型提供商").with("category", "tech"),
                TextSegment.from("提供统一的API接口").with("category", "tech"),
                TextSegment.from("适用于企业级应用").with("category", "tech")
        );
    }
}`}
        />

        <TipBox type="info" title="检索优化技巧">
          <ul className="space-y-2 text-sm">
            <li><strong>查询扩展</strong>：将用户查询重写为更丰富的表达</li>
            <li><strong>元数据过滤</strong>：提前过滤不相关的内容</li>
            <li><strong>阈值调整</strong>：根据反馈动态调整相似度阈值</li>
            <li><strong>结果去重</strong>：合并重复或高度相似的结果</li>
            <li><strong>上下文融合</strong>：将不同检索结果的信息智能组合</li>
          </ul>
        </TipBox>
      </section>

      <section id="rag-pipeline" className="content-section">
        <SectionHeader number={7} title="完整RAG流水线" />

        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-6">
          <h3 className="subsection-title-sm">端到端RAG实现</h3>
          <p className="text-gray-700 mb-4">
            现在让我们将前面的组件组合起来，构建一个完整的RAG系统。
            该系统将：
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">1.</span>
              <span>从文件系统加载文档</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">2.</span>
              <span>将文档分割成段落</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">3.</span>
              <span>生成Embedding向量</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">4.</span>
              <span>存储到向量数据库</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">5.</span>
              <span>检索相关内容</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">6.</span>
              <span>使用检索上下文生成回答</span>
            </li>
          </ul>
        </div>

        <CodeBlockWithCopy
          language="java"
          filename="CompleteRAGSystem.java"
          title="Java - 完整RAG系统"
          code={`import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.DocumentLoader;
import dev.langchain4j.data.document.DocumentSplitter;
import dev.langchain4j.data.document.splitter.DocumentByParagraphSplitter;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.openai.OpenAiChatModelName;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.content.retriever.EmbeddingStoreContentRetriever;
import dev.langchain4j.rag.query.Query;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.inmemory.InMemoryEmbeddingStore;
import dev.langchain4j.model.embedding.EmbeddingModel;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

public class CompleteRAGSystem {

    private static final String DOCUMENT_PATH = "path/to/documents";
    private static final String OPENAI_API_KEY = "your-api-key";

    public static void main(String[] args) throws Exception {
        System.out.println("第1步：加载和处理文档");
        List<Document> documents = loadAndProcessDocuments();

        System.out.println("\\n第2步：生成Embeddings");
        EmbeddingStore<TextSegment> embeddingStore = createEmbeddingStore(documents);

        System.out.println("\\n第3步：创建检索器");
        ContentRetriever retriever = createRetriever(embeddingStore);

        System.out.println("\\n第4步：初始化语言模型");
        ChatLanguageModel llm = OpenAiChatModel.builder()
                .apiKey(OPENAI_API_KEY)
                .modelName(OpenAiChatModelName.GPT_4O_MINI)
                .temperature(0.3)
                .build();

        System.out.println("\\n第5步：启动RAG问答系统");
        runRAGQueryLoop(retriever, llm);
    }

    private static List<Document> loadAndProcessDocuments() throws Exception {
        Path docsPath = Paths.get(DOCUMENT_PATH);
        DocumentLoader loader = new DocumentLoader(docsPath);
        List<Document> documents = loader.load();

        System.out.println("  加载了 " + documents.size() + " 个文档");

        DocumentSplitter splitter = new DocumentByParagraphSplitter();
        List<TextSegment> segments = splitter.split(documents);

        System.out.println("  分割成 " + segments.size() + " 个文本段");
        return documents;
    }

    private static EmbeddingStore<TextSegment> createEmbeddingStore(
            List<Document> documents
    ) {
        EmbeddingStore<TextSegment> store = new InMemoryEmbeddingStore<>();
        EmbeddingModel embeddingModel = OpenAiEmbeddingModel.builder()
                .apiKey(OPENAI_API_KEY)
                .modelName("text-embedding-3-small")
                .build();

        DocumentSplitter splitter = new DocumentByParagraphSplitter();
        List<TextSegment> segments = splitter.split(documents);

        for (TextSegment segment : segments) {
            store.add(
                    embeddingModel.embed(segment.text()).content(),
                    segment.with("document_id", segment.id())
            );
        }

        System.out.println("  已存储 " + segments.size() + " 个Embedding向量");
        return store;
    }

    private static ContentRetriever createRetriever(
            EmbeddingStore<TextSegment> embeddingStore
    ) {
        EmbeddingModel embeddingModel = OpenAiEmbeddingModel.builder()
                .apiKey(OPENAI_API_KEY)
                .modelName("text-embedding-3-small")
                .build();

        return EmbeddingStoreContentRetriever.builder()
                .embeddingStore(embeddingStore)
                .embeddingModel(embeddingModel)
                .maxResults(5)
                .minScore(0.6)
                .build();
    }

    private static void runRAGQueryLoop(
            ContentRetriever retriever,
            ChatLanguageModel llm
    ) {
        while (true) {
            System.out.println("\\n" + "=".repeat(50));
            System.out.print("请输入您的问题（输入'exit'退出）: ");
            java.util.Scanner scanner = new java.util.Scanner(System.in);
            String userQuery = scanner.nextLine().trim();

            if (userQuery.equalsIgnoreCase("exit")) {
                System.out.println("再见！");
                break;
            }

            if (userQuery.isEmpty()) {
                continue;
            }

            System.out.println("\\n正在检索相关内容...");
            long startTime = System.currentTimeMillis();

            List<TextSegment> relevantSegments = retriever.retrieve(
                    Query.from(userQuery)
            );

            long retrievalTime = System.currentTimeMillis() - startTime;
            System.out.println("检索完成，耗时: " + retrievalTime + "ms");
            System.out.println("找到 " + relevantSegments.size() + " 个相关片段");

            String augmentedPrompt = buildAugmentedPrompt(userQuery, relevantSegments);

            System.out.println("\\n生成回答...");
            startTime = System.currentTimeMillis();

            AiMessage aiResponse = llm.generate(UserMessage.from(augmentedPrompt));
            long generationTime = System.currentTimeMillis() - startTime;

            System.out.println("\\n=== AI回答 ===");
            System.out.println(aiResponse.text());
            System.out.println("\\n生成耗时: " + generationTime + "ms");
            System.out.println("总耗时: " + (retrievalTime + generationTime) + "ms");
        }
    }

    private static String buildAugmentedPrompt(
            String userQuery,
            List<TextSegment> relevantSegments
    ) {
        if (relevantSegments.isEmpty()) {
            return "用户问题：" + userQuery + "\\n\\n请根据你的知识回答。";
        }

        StringBuilder contextBuilder = new StringBuilder();
        contextBuilder.append("以下是从知识库中检索到的相关信息：\\n\\n");

        for (int i = 0; i < relevantSegments.size(); i++) {
            TextSegment segment = relevantSegments.get(i);
            contextBuilder.append(String.format(
                    "[片段 %d]\\n%s\\n\\n",
                    i + 1,
                    segment.text()
            ));
        }

        contextBuilder.append("---\\n\\n");
        contextBuilder.append("基于以上信息，请回答用户问题：");
        contextBuilder.append(userQuery);

        contextBuilder.append("\\n\\n要求：");
        contextBuilder.append("1. 如果信息足够，直接回答");
        contextBuilder.append("2. 如果信息不足，请说明");
        contextBuilder.append("3. 回答要准确、简洁");

        return contextBuilder.toString();
    }
}`}
        />
      </section>

      <section id="advanced-rag" className="content-section">
        <SectionHeader number={8} title="高级RAG技巧" />

        <h3 className="text-2xl font-semibold text-gray-900 mb-4">8.1 查询重写（Query Rewriting）</h3>
        <p className="text-gray-700 mb-4">
          直接使用用户查询可能效果不佳，可以通过重写查询来提升检索质量：
        </p>

        <CodeBlockWithCopy
          language="java"
          filename="QueryRewriting.java"
          title="Java - 查询重写"
          code={`import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;

import java.util.List;

public class QueryRewriting {

    private static ChatLanguageModel rewriteModel;

    public static void main(String[] args) {
        rewriteModel = OpenAiChatModel.builder()
                .apiKey("your-api-key")
                .modelName("gpt-4o-mini")
                .temperature(0.2)
                .build();

        String originalQuery = "LangChain4j怎么用";
        System.out.println("原始查询: " + originalQuery);

        List<String> queryVariants = generateQueryVariants(originalQuery);
        System.out.println("\\n查询变体:");
        queryVariants.forEach(variant -> System.out.println("  - " + variant));

        String formalQuery = rewriteFormally(originalQuery);
        System.out.println("\\n正式改写: " + formalQuery);

        List<String> keywords = extractKeywords(originalQuery);
        System.out.println("\\n关键词: " + keywords);
    }

    private static List<String> generateQueryVariants(String query) {
        String prompt = """
            为以下查询生成3-5个不同的变体，用于提升检索质量：
            原始查询: %s

            要求：
            1. 保持原意不变
            2. 使用不同的表达方式
            3. 包含同义词
            4. 每行一个变体

            只返回变体，不要解释。
            """.formatted(query);

        String response = rewriteModel.generate(prompt).content().text();

        return List.of(response.split("\\\\n"));
    }

    private static String rewriteFormally(String query) {
        String prompt = """
            将以下查询改写为更正式、更完整的表达：
            原始查询: %s

            要求：
            1. 使用完整术语
            2. 增加必要的上下文
            3. 改写要简洁明了

            只返回改写后的查询。
            """.formatted(query);

        return rewriteModel.generate(prompt).content().text();
    }

    private static List<String> extractKeywords(String query) {
        String prompt = """
            从以下查询中提取3-5个关键术语：
            查询: %s

            要求：
            1. 提取最重要的概念
            2. 去除停用词（如的、怎么、如何）
            3. 每行一个关键词
            4. 保持术语的原样

            只返回关键词，每行一个。
            """.formatted(query);

        String response = rewriteModel.generate(prompt).content().text();
        return List.of(response.split("\\\\n"));
    }
}`}
        />

        <h3 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">8.2 元数据增强与过滤</h3>
        <CodeBlockWithCopy
          language="java"
          filename="MetadataFiltering.java"
          title="Java - 元数据过滤"
          code={`import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.content.retriever.EmbeddingStoreContentRetriever;
import dev.langchain4j.rag.query.Query;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.inmemory.InMemoryEmbeddingStore;
import dev.langchain4j.store.embedding.filter.Filter;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.openai.OpenAiEmbeddingModel;

import java.time.LocalDate;
import java.util.List;

public class MetadataFiltering {

    public static void main(String[] args) {
        EmbeddingStore<TextSegment> store = createStoreWithMetadata();

        System.out.println("=== 场景1: 按类别过滤 ===");
        ContentRetriever techRetriever = EmbeddingStoreContentRetriever.builder()
                .embeddingStore(store)
                .embeddingModel(createEmbeddingModel())
                .maxResults(5)
                .filter(Filter.metadataKey("category").isEqualTo("tech"))
                .build();

        List<TextSegment> techResults = techRetriever.retrieve(
                Query.from("Java开发")
        );
        System.out.println("技术文档结果数: " + techResults.size());

        System.out.println("\\n=== 场景2: 按时间范围过滤 ===");
        LocalDate startDate = LocalDate.of(2024, 1, 1);
        LocalDate endDate = LocalDate.of(2024, 12, 31);

        ContentRetriever dateRetriever = EmbeddingStoreContentRetriever.builder()
                .embeddingStore(store)
                .embeddingModel(createEmbeddingModel())
                .maxResults(5)
                .filter(
                        Filter.metadataKey("created_date").isGreaterThanOrEqualTo(startDate.toString())
                                .and(Filter.metadataKey("created_date").isLessThanOrEqualTo(endDate.toString()))
                )
                .build();

        List<TextSegment> dateResults = dateRetriever.retrieve(
                Query.from("新功能")
        );
        System.out.println("2024年文档结果数: " + dateResults.size());

        System.out.println("\\n=== 场景3: 组合过滤 ===");
        ContentRetriever combinedRetriever = EmbeddingStoreContentRetriever.builder()
                .embeddingStore(store)
                .embeddingModel(createEmbeddingModel())
                .maxResults(5)
                .filter(
                        Filter.metadataKey("category").isEqualTo("tech")
                                .and(Filter.metadataKey("language").isEqualTo("zh-CN"))
                                .and(Filter.metadataKey("is_public").isEqualTo("true"))
                )
                .build();

        List<TextSegment> combinedResults = combinedRetriever.retrieve(
                Query.from("API文档")
        );
        System.out.println("组合过滤结果数: " + combinedResults.size());
    }

    private static EmbeddingStore<TextSegment> createStoreWithMetadata() {
        EmbeddingStore<TextSegment> store = new InMemoryEmbeddingStore<>();
        EmbeddingModel model = createEmbeddingModel();

        List<TextSegment> segments = List.of(
                TextSegment.from("LangChain4j API文档")
                        .with("category", "tech")
                        .with("language", "zh-CN")
                        .with("created_date", "2024-06-15")
                        .with("is_public", "true"),
                TextSegment.from("企业最佳实践指南")
                        .with("category", "tech")
                        .with("language", "zh-CN")
                        .with("created_date", "2024-08-20")
                        .with("is_public", "true"),
                TextSegment.from("错误处理手册")
                        .with("category", "tech")
                        .with("language", "zh-CN")
                        .with("created_date", "2024-10-05")
                        .with("is_public", "false")
        );

        for (TextSegment segment : segments) {
            store.add(model.embed(segment.text()).content(), segment);
        }

        return store;
    }

    private static EmbeddingModel createEmbeddingModel() {
        return OpenAiEmbeddingModel.builder()
                .apiKey("your-api-key")
                .modelName("text-embedding-3-small")
                .build();
    }
}`}
        />
      </section>

      <section id="best-practices" className="content-section">
        <SectionHeader number={9} title="最佳实践与优化" />

        <div className="grid-2col">
          <div className="border border-gray-200 rounded-lg p-5">
            <h4 className="font-semibold text-gray-900 mb-2">🚀 Embedding优化</h4>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li><strong>批量处理</strong>：使用embedAll()而非多次embed()</li>
              <li><strong>模型选择</strong>：开发用small，生产用large</li>
              <li><strong>缓存策略</strong>：缓存已生成Embedding</li>
              <li><strong>维度缩减</strong>：考虑使用PCA降维（高级）</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <h4 className="font-semibold text-gray-900 mb-2">🔍 检索优化</h4>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li><strong>元数据过滤</strong>：提前过滤不相关内容</li>
              <li><strong>查询优化</strong>：查询重写、多路查询</li>
              <li><strong>并行检索</strong>：同时检索多个子查询</li>
              <li><strong>重排序</strong>：使用Cross-Encoder精炼</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <h4 className="font-semibold text-gray-900 mb-2">⚡ 生成优化</h4>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li><strong>上下文压缩</strong>：去除冗余信息</li>
              <li><strong>Prompt优化</strong>：精简指令模板</li>
              <li><strong>流式输出</strong>：提升用户体验</li>
              <li><strong>模型选择</strong>：根据场景选择合适模型</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <h4 className="font-semibold text-gray-900 mb-2">💰 成本控制</h4>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li><strong>Token预算</strong>：设置maxTokens限制</li>
              <li><strong>模型分级</strong>：简单用mini，复杂用full</li>
              <li><strong>缓存结果</strong>：缓存相同查询的回答</li>
              <li><strong>按需检索</strong>：避免不必要的向量搜索</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mt-8">
          <h3 className="text-2xl font-bold mb-4 text-gray-900">🎯 本章总结</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-gray-800">核心概念</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li> RAG让LLM访问私有数据</li>
                <li> 文档加载→分块→Embedding→存储</li>
                <li> 检索→增强生成是核心流程</li>
                <li> LangChain4j提供统一的RAG API</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-gray-800">关键组件</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li> DocumentLoader：加载文档</li>
                <li> DocumentSplitter：分割文本</li>
                <li> EmbeddingModel：生成向量</li>
                <li> EmbeddingStore：存储向量</li>
                <li> ContentRetriever：检索内容</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-700">
              下一章我们将学习如何构建一个完整的RAG知识库项目，包括前端界面、后端API、部署配置等。
            </p>
            <a href="/project-rag-kb" className="inline-block mt-3 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              继续学习 →
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default RagCompletePage;
