import Layout from '../components/layout/Layout';
import { SectionHeader, CodeBlockWithCopy, TipBox } from '../components/ui';

const RagSetupPage = () => {
  return (
    <Layout>
      <div className="flex items-center gap-3 mb-8 text-sm">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">RAG</span>
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">环境搭建</span>
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">~30分钟</span>
      </div>

      <h1 className="text-5xl font-bold text-gray-900 mb-6">RAG环境搭建</h1>
      <p className="text-xl text-gray-600 mb-8 leading-relaxed">
        搭建RAG开发环境，配置必要的依赖和工具，为后续实现做准备。
      </p>

      <div className="bg-gray-50 rounded-lg p-6 mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">📚 本章学习目标</h2>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start gap-3">
            <span className="text-green-600 text-xl font-bold">✓</span>
            <span><strong>配置Maven依赖</strong></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 text-xl font-bold">✓</span>
            <span><strong>设置环境变量</strong></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 text-xl font-bold">✓</span>
            <span><strong>选择并配置向量数据库</strong></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 text-xl font-bold">✓</span>
            <span><strong>创建项目结构</strong></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 text-xl font-bold">✓</span>
            <span><strong>验证Hello World示例</strong></span>
          </li>
        </ul>
      </div>

      <section className="content-section">
        <SectionHeader number={1} title="Maven依赖配置" />

        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-3">添加LangChain4j依赖</h3>
          <p className="text-gray-600 mb-4">在pom.xml中添加LangChain4j核心依赖</p>
        </div>

        <CodeBlockWithCopy
          language="xml"
          filename="pom.xml"
          title="Maven配置"
          code={`<dependencies>
    <!-- 核心模块 -->
    <dependency>
        <groupId>dev.langchain4j</groupId>
        <artifactId>langchain4j-core</artifactId>
        <version>0.35.0</version>
    </dependency>

    <!-- 向量存储 -->
    <dependency>
        <groupId>dev.langchain4j</groupId>
        <artifactId>langchain4j-pinecone</artifactId>
        <version>0.35.0</version>
    </dependency>

    <!-- OpenAI模型 -->
    <dependency>
        <groupId>dev.langchain4j</groupId>
        <artifactId>langchain4j-open-ai</artifactId>
        <version>0.35.0</version>
    </dependency>
</dependencies>`}
        />

        <TipBox type="info" title="版本说明">
          <ul className="space-y-1 text-sm">
            <li><strong>langchain4j-core</strong>：核心模块，包含DocumentLoader、TextSplitter、EmbeddingModel等</li>
            <li><strong>langchain4j-pinecone</strong>：Pinecone向量数据库集成（可选）</li>
            <li><strong>langchain4j-open-ai</strong>：OpenAI模型集成，支持GPT-4、GPT-3.5等模型</li>
            <li>访问 <a href="https://docs.langchain4j.dev" className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">官方文档</a> 获取最新版本</li>
          </ul>
        </TipBox>
      </section>

      <section className="content-section">
        <SectionHeader number={2} title="环境变量配置" />

        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-3">API密钥配置</h3>
          <p className="text-gray-600 mb-4">创建.env文件存储API密钥，确保安全性和灵活性</p>
        </div>

        <CodeBlockWithCopy
          language="bash"
          filename=".env"
          title="环境变量文件"
          code={`# OpenAI配置
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 模型配置（可选）
OPENAI_MODEL=gpt-4
OPENAI_TEMPERATURE=0.7
OPENAI_MAX_TOKENS=2000

# 向量数据库配置
PINECONE_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxx-xxxx
PINECONE_ENVIRONMENT=production
PINECONE_INDEX=langchain4j-demo`}
        />

        <TipBox type="warning" title="安全提示">
          <ul className="space-y-1 text-sm">
            <li><strong>永远不要</strong>将.env文件提交到Git仓库</li>
            <li>使用.env.example作为模板提交</li>
            <li>不同环境（开发、测试、生产）使用不同的密钥</li>
            <li>定期轮换API密钥</li>
          </ul>
        </TipBox>

        <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">.env.example示例</h3>
        <CodeBlockWithCopy
          language="bash"
          filename=".env.example"
          title="模板文件"
          code={`# OpenAI配置
OPENAI_API_KEY=your-openai-api-key-here

# 模型配置（可选）
OPENAI_MODEL=gpt-4
OPENAI_TEMPERATURE=0.7
OPENAI_MAX_TOKENS=2000

# 向量数据库配置
PINECONE_API_KEY=your-pinecone-api-key-here
PINECONE_ENVIRONMENT=production
PINECONE_INDEX=your-index-name
PINECONE_DIMENSION=1536`}
        />

        <TipBox type="success" title="Java环境变量读取">
          <CodeBlockWithCopy
            language="java"
            filename="Environment.java"
            title="配置类"
            code={`import java.util.Properties;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;

public class Environment {
    private static final Properties props = new Properties();

    static {
        try (InputStream is = Files.newInputStream(
                Paths.get(".env"))) {
            props.load(is);
        } catch (Exception e) {
            // 处理异常
        }
    }

    public static String get(String key) {
        return props.getProperty(key, "");
    }

    public static String getOpenAiApiKey() {
        return get("OPENAI_API_KEY");
    }

    public static String getPineconeApiKey() {
        return get("PINECONE_API_KEY");
    }

    public static String getPineconeIndex() {
        return get("PINECONE_INDEX");
    }
}`}
          />
        </TipBox>
      </section>

      <section className="content-section">
        <SectionHeader number={3} title="向量数据库选择与配置" />

        <TipBox type="info" title="向量数据库选择指南">
          <p className="text-blue-800 text-sm">
            选择向量数据库时，需要考虑性能、成本、可用性、扩展性等因素。
          </p>
        </TipBox>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="text-3xl mb-3">🌲</div>
            <h4 className="font-bold text-gray-900 mb-2">Pinecone</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><strong>特点</strong>：托管服务、高性能、易集成</li>
              <li><strong>适用</strong>：生产环境、快速原型、中小规模应用</li>
              <li><strong>成本</strong>：按检索次数和存储计费，起步成本低</li>
              <li><strong>优点</strong>：无需运维、自动扩展、全球CDN加速</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="text-3xl mb-3">🗄️</div>
            <h4 className="font-bold text-gray-900 mb-2">Chroma</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><strong>特点</strong>：开源、本地部署、可持久化</li>
              <li><strong>适用</strong>：数据隐私敏感、需要本地控制、开发测试</li>
              <li><strong>成本</strong>：完全免费</li>
              <li><strong>优点</strong>：数据完全本地、无网络延迟、可自定义</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="text-3xl mb-3">🟢</div>
            <h4 className="font-bold text-gray-900 mb-2">Weaviate</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><strong>特点</strong>：高性能、模块化、支持多模态</li>
              <li><strong>适用</strong>：大规模应用、需要高级功能、多模态数据</li>
              <li><strong>成本</strong>：有免费层，付费版功能更强</li>
              <li><strong>优点</strong>：GraphQL API、灵活的过滤、对象存储集成</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="text-3xl mb-3">🟡</div>
            <h4 className="font-bold text-gray-900 mb-2">Milvus</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><strong>特点</strong>：高性能向量检索、支持GPU加速</li>
              <li><strong>适用</strong>：超大规模数据、需要极致性能、本地部署</li>
              <li><strong>成本</strong>：开源免费，需要自行部署运维</li>
              <li><strong>优点</strong>：支持10亿级向量、毫秒级响应、支持分布式</li>
            </ul>
          </div>
        </div>

        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-5 rounded-r-lg mt-6">
          <h4 className="font-bold text-indigo-900 mb-2">🏗️ 推荐方案</h4>
          <p className="text-indigo-800 text-sm">
            本指南使用Pinecone作为示例，因为它易于上手且适合学习。您可以根据实际需求选择其他数据库。
          </p>
        </div>
      </section>

      <section className="content-section">
        <SectionHeader number={4} title="项目结构" />

        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-3">推荐项目结构</h3>
          <p className="text-gray-600 mb-4">清晰的项目结构有助于代码组织和团队协作</p>
        </div>

        <CodeBlockWithCopy
          language="plaintext"
          filename="项目结构"
          title="目录结构"
          code={`langchain4j-rag-demo/
├── src/
│   ├── main/
│   │   └── java/
│   │       └── com/example/rag/
│   │           ├── Main.java
│   │           ├── config/
│   │           │   └── Environment.java
│   │           ├── loader/
│   │           │   └── DocumentLoader.java
│   │           ├── splitter/
│   │           │   └── TextSplitter.java
│   │           ├── embedding/
│   │           │   └── EmbeddingService.java
│   │           └── retriever/
│   │               └── VectorRetriever.java
├── resources/
│   └── application.properties
├── documents/
│   └── sample.txt
├── .env
├── .env.example
└── pom.xml`}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h4 className="font-bold text-gray-900 mb-3">📁 src/main/java</h4>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li>主Java源码目录，所有业务逻辑代码</li>
              <li><strong>config/</strong>：配置类（Environment、配置加载）</li>
              <li><strong>loader/</strong>：文档加载器</li>
              <li><strong>splitter/</strong>：文本分块器</li>
              <li><strong>embedding/</strong>：Embedding服务</li>
              <li><strong>retriever/</strong>：检索器实现</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h4 className="font-bold text-gray-900 mb-3">📂 resources/</h4>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li>配置文件和资源文件</li>
              <li><strong>application.properties</strong>：Spring Boot配置</li>
              <li><strong>logback.xml</strong>：日志配置</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h4 className="font-bold text-gray-900 mb-3">📄 documents/</h4>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li>文档存储目录</li>
              <li>存放待处理的原始文档</li>
              <li><strong>支持格式</strong>：TXT、PDF、MD、JSON</li>
              <li><strong>组织方式</strong>：按主题、日期或类型分类</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h4 className="font-bold text-gray-900 mb-3">🔧 配置文件</h4>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li>项目根目录配置文件</li>
              <li><strong>.env</strong>：环境变量（本地开发密钥）</li>
              <li><strong>.env.example</strong>：环境变量模板（Git提交）</li>
              <li><strong>.gitignore</strong>：Git忽略规则，保护敏感信息</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="content-section">
        <SectionHeader number={5} title="Hello World验证" />

        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-3">验证环境配置</h3>
          <p className="text-gray-600">
            创建一个简单的RAG系统，验证所有配置是否正确。
          </p>
        </div>

        <CodeBlockWithCopy
          language="java"
          filename="HelloWorldRAG.java"
          title="完整示例"
          code={`import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.loader.FileSystemDocumentLoader;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.openai.OpenAiEmbeddingModel;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.openai.OpenAiChatModelName;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.content.retriever.EmbeddingStoreContentRetriever;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.inmemory.InMemoryEmbeddingStore;

import java.util.List;

public class HelloWorldRAG {

    private static final String API_KEY = System.getenv("OPENAI_API_KEY");

    public static void main(String[] args) {
        System.out.println("=== RAG Hello World ===");
        
        try {
            // 1. 创建Embedding模型
            EmbeddingModel embeddingModel = OpenAiEmbeddingModel.builder()
                .apiKey(API_KEY)
                .modelName("text-embedding-3-small")
                .build();
            
            System.out.println("✓ Embedding模型创建成功");
            
            // 2. 加载示例文档
            DocumentLoader loader = FileSystemDocumentLoader.builder()
                .build();
            
            List<Document> documents = loader.load("documents/sample.txt");
            
            System.out.println("✓ 文档加载成功，共 " + documents.size() + " 个文档");
            
            // 3. 创建向量存储（内存存储）
            EmbeddingStore<TextSegment> store = new InMemoryEmbeddingStore<>();
            
            System.out.println("✓ 向量存储创建成功");
            
            // 4. 创建检索器
            ContentRetriever retriever = EmbeddingStoreContentRetriever.builder()
                .embeddingModel(embeddingModel)
                .embeddingStore(store)
                .maxResults(3)
                .build();
            
            System.out.println("✓ 检索器创建成功");
            
            // 5. 创建Chat模型
            ChatLanguageModel chatModel = OpenAiChatModel.builder()
                .apiKey(API_KEY)
                .modelName(OpenAiChatModelName.GPT_4)
                .build();
            
            System.out.println("✓ Chat模型创建成功");
            
            // 6. 创建AI Service
            Assistant assistant = AiServices.builder(Assistant.class)
                .chatLanguageModel(chatModel)
                .contentRetriever(retriever)
                .build();
            
            System.out.println("✓ RAG系统创建成功\\n");
            
            // 7. 测试查询
            String question = "什么是LangChain4j？";
            System.out.println("\\n测试查询: " + question);
            String answer = assistant.chat(question);
            
            System.out.println("\\n=== RAG回答 ===");
            System.out.println(answer);
            
        } catch (Exception e) {
            System.err.println("✗ 错误: " + e.getMessage());
            e.printStackTrace();
        }
    }
}

interface Assistant {
    String chat(String message);
}`}
        />

        <TipBox type="success" title="运行步骤">
          <ul className="space-y-1 text-sm">
            <li><strong>步骤1</strong>：创建.env和documents目录</li>
            <li><strong>步骤2</strong>：在documents中创建sample.txt，写入测试文档</li>
            <li><strong>步骤3</strong>：编译并运行HelloWorldRAG.java</li>
            <li><strong>预期输出</strong>：看到各个组件创建成功的日志和最终回答</li>
          </ul>
        </TipBox>
      </section>

      <section className="content-section">
        <SectionHeader number={6} title="常见问题" />

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md">
            <h4 className="font-bold text-gray-900 mb-2">Q: Maven依赖下载失败？</h4>
            <p className="text-gray-700">
              A: 检查网络连接，确认Maven镜像源。可以尝试使用阿里云镜像或清除本地缓存。
            </p>
          </div>
          <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md">
            <h4 className="font-bold text-gray-900 mb-2">Q: .env文件读取失败？</h4>
            <p className="text-gray-700">
              A: 确保.env文件格式正确，每行一个变量，等号后无空格。检查文件编码是否为UTF-8。
            </p>
          </div>
          <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md">
            <h4 className="font-bold text-gray-900 mb-2">Q: API密钥无效？</h4>
            <p className="text-gray-700">
              A: 确认API密钥有效且未过期。检查账户余额是否充足。确保密钥格式正确（OpenAI以sk-开头）。
            </p>
          </div>
          <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md">
            <h4 className="font-bold text-gray-900 mb-2">Q: Pinecone连接失败？</h4>
            <p className="text-gray-700">
              A: 检查Pinecone环境名称和索引名称是否正确。确认API密钥有效。检查网络连接。
            </p>
          </div>
        </div>
      </section>

      <section className="content-section">
        <SectionHeader number={7} title="最佳实践" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h4 className="font-bold text-gray-900 mb-3">🔒 安全实践</h4>
            <ul className="space-y-2 text-gray-600 text-sm list-disc list-inside">
              <li>使用环境变量管理敏感信息</li>
              <li>永远不要提交.env到版本控制</li>
              <li>定期轮换API密钥</li>
              <li>限制API密钥的权限范围</li>
              <li>生产环境使用专用密钥</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h4 className="font-bold text-gray-900 mb-3">⚡ 性能优化</h4>
            <ul className="space-y-2 text-gray-600 text-sm list-disc list-inside">
              <li>使用批量Embedding生成</li>
              <li>实现检索结果缓存</li>
              <li>选择合适的向量维度（1536是常用值）</li>
              <li>使用更小的模型进行检索</li>
              <li>限制每次检索的文档数量</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h4 className="font-bold text-gray-900 mb-3">📝 开发建议</h4>
            <ul className="space-y-2 text-gray-600 text-sm list-disc list-inside">
              <li>先在内存向量数据库上测试原型</li>
              <li>使用日志记录调试RAG流程</li>
              <li>实现分步测试，先测试各组件</li>
              <li>添加检索质量监控指标</li>
              <li>编写单元测试验证检索结果</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="text-center mt-12">
        <a href="/rag-implementation" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-all shadow-md">
          继续学习 RAG实现 →
        </a>
      </div>
    </Layout>
  );
};

export default RagSetupPage;
