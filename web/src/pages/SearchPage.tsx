import Layout from '../components/layout/Layout';
import { Tag, CodeBlockWithCopy, SectionHeader } from '../components/ui';

const SearchPage = () => {
  const embeddingStoreCode = `package com.example.langchain4j.search;

import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.EmbeddingMatch;
import org.springframework.stereotype.Service;
import jakarta.inject.Inject;

@Service
public class EmbeddingStoreService {

    private final EmbeddingModel embeddingModel;
    private final EmbeddingStore<TextSegment> embeddingStore;

    @Inject
    public EmbeddingStoreService(EmbeddingModel embeddingModel,
                               EmbeddingStore<TextSegment> embeddingStore) {
        this.embeddingModel = embeddingModel;
        this.embeddingStore = embeddingStore;
    }

    public void addDocument(String id, String content) {
        TextSegment segment = TextSegment.from(content);
        Embedding embedding = embeddingModel.embed(segment).content();
        embeddingStore.add(id, segment, embedding);
    }

    public List<String> search(String query, int maxResults, double minScore) {
        Embedding queryEmbedding = embeddingModel.embed(query).content();
        List<EmbeddingMatch<TextSegment>> matches = 
            embeddingStore.findRelevant(queryEmbedding, maxResults, minScore);
        return matches.stream()
            .map(match -> match.embedded().text())
            .toList();
    }

    public void deleteDocument(String id) {
        embeddingStore.remove(id);
    }
}`;

  const basicSearchCode = `@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final EmbeddingStore<TextSegment> embeddingStore;
    private final EmbeddingModel embeddingModel;

    @GetMapping("/documents")
    public SearchResult searchDocuments(
            @RequestParam "query" String query,
            @RequestParam(defaultValue = "5") int limit) {
        List<String> results = embeddingStoreService.search(query, limit, 0.0);
        return new SearchResult(query, results);
    }
}`;

  const batchSearchCode = `List<String> queries = List.of(
    "如何使用 LangChain4j?",
    "向量检索的原理是什么？",
    "什么是 RAG？"
);

Map<String, List<String>> results = queries.parallelStream()
    .collect(
        Collectors.toMap(
            query -> Map.entry(
                query, 
                embeddingStoreService.search(query, 5, 0.0)
            )
        )
    );

results.forEach((query, docs) -> {
    System.out.println("Query: " + query);
    docs.forEach(doc -> System.out.println("  - " + doc));
});`;

  return (
    <Layout>
      <div className="page-tags">
        <Tag variant="indigo">搜索功能</Tag>
        <Tag variant="purple">向量检索</Tag>
        <Tag variant="green">语义搜索</Tag>
      </div>

      <h1 className="page-title">向量搜索</h1>
      <p className="page-intro">LangChain4j 的向量检索和语义搜索实现</p>

      <nav className="toc-nav">
        <h3>目录</h3>
        <ol className="toc-list">
          <li className="toc-item"><span className="toc-number">1.</span> <a href="#向量检索概述" className="toc-link">向量检索概述</a></li>
          <li className="toc-item"><span className="toc-number">2.</span> <a href="#EmbeddingStore接口" className="toc-link">EmbeddingStore 接口</a></li>
          <li className="toc-item"><span className="toc-number">3.</span> <a href="#向量检索实现" className="toc-link">向量检索实现</a></li>
          <li className="toc-item"><span className="toc-number">4.</span> <a href="#混合检索" className="toc-link">混合检索</a></li>
          <li className="toc-item"><span className="toc-number">5.</span> <a href="#最佳实践" className="toc-link">最佳实践</a></li>
        </ol>
      </nav>

      <section id="向量检索概述" className="content-section">
        <SectionHeader number={1} title="向量检索概述" />
        
        <h3 className="subsection-title">1.1 向量检索原理</h3>
        <p className="paragraph">向量检索是基于向量相似度的语义搜索技术：</p>

        <div className="grid-2col">
          <div className="card-blue">
            <h4 className="card-title-blue">向量嵌入</h4>
            <p className="card-description-blue">将文本转换为高维向量表示</p>
            <ul className="list-styled list-blue text-xs">
              <li>相似语义的文本在向量空间中距离相近</li>
              <li>使用 Embedding 模型生成向量</li>
              <li>向量维度通常为 768-3072</li>
            </ul>
          </div>
          <div className="card-green">
            <h4 className="card-title-green">相似度计算</h4>
            <p className="card-description-green">计算查询向量与文档向量的相似度</p>
            <ul className="list-styled list-green text-xs">
              <li>余弦相似度：最常用，值域 [-1, 1]</li>
              <li>欧氏距离：向量空间直线距离</li>
              <li>点积：未归一化向量的余弦相似度</li>
            </ul>
          </div>
          <div className="card-purple">
            <h4 className="card-title-purple">返回结果</h4>
            <p className="card-description-purple">按相似度排序返回最相关的文档</p>
            <ul className="text-xs" style={{color: '#7e22ce'}}>
              <li>返回前 K 个最相似的结果</li>
              <li>包含文档内容和相似度分数</li>
              <li>可设置最小相似度阈值过滤</li>
            </ul>
          </div>
          <div className="card-orange">
            <h4 className="card-title-orange">性能优势</h4>
            <p className="card-description-orange">相比关键词搜索的性能优势</p>
            <ul className="text-xs" style={{color: '#c2410c'}}>
              <li>理解语义而非字面匹配</li>
              <li>处理多语言和多义词</li>
              <li>可扩展到百万级文档</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="EmbeddingStore接口" className="content-section">
        <SectionHeader number={2} title="EmbeddingStore 接口" />
        
        <h3 className="subsection-title">2.1 核心 API 方法</h3>
        <p className="paragraph">EmbeddingStore 是 LangChain4j 的向量存储接口，支持多种实现：</p>

        <CodeBlockWithCopy filename="EmbeddingStoreExample.java">{embeddingStoreCode}</CodeBlockWithCopy>

        <h3 className="subsection-title">2.2 支持的向量数据库</h3>
        <p className="paragraph">LangChain4j 支持多种向量数据库实现：</p>

        <div className="table-container">
          <table className="w-full text-left border-collapse border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-gray-500 border-b">数据库</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-500 border-b">类型</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-500 border-b">规模</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-500 border-b">适用场景</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="px-6 py-3">InMemory EmbeddingStore</td>
                <td className="px-6 py-3">内存</td>
                <td className="px-6 py-3">小（&lt;10K）</td>
                <td className="px-6 py-3">开发、测试、原型</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="px-6 py-3">PGVector</td>
                <td className="px-6 py-3">数据库</td>
                <td className="px-6 py-3">中（10K-1M）</td>
                <td className="px-6 py-3">小型生产、已有 PostgreSQL</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="px-6 py-3">Pinecone</td>
                <td className="px-6 py-3">云服务</td>
                <td className="px-6 py-3">大（&gt;1M）</td>
                <td className="px-6 py-3">快速原型、生产环境</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="px-6 py-3">Weaviate</td>
                <td className="px-6 py-3">开源/云服务</td>
                <td className="px-6 py-3">大（&gt;1M）</td>
                <td className="px-6 py-3">需要高级功能、本地部署</td>
              </tr>
              <tr>
                <td className="px-6 py-3">Milvus</td>
                <td className="px-6 py-3">开源</td>
                <td className="px-6 py-3">超大（&gt;10M）</td>
                <td className="px-6 py-3">大规模生产、高性能需求</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="向量检索实现" className="content-section">
        <SectionHeader number={3} title="向量检索实现" />
        
        <h3 className="subsection-title">3.1 基础检索</h3>
        <p className="paragraph">最简单的向量检索实现：</p>
        <CodeBlockWithCopy filename="BasicSearchExample.java">{basicSearchCode}</CodeBlockWithCopy>

        <h3 className="subsection-title">3.2 批量检索</h3>
        <p className="paragraph">批量检索多个查询：</p>
        <CodeBlockWithCopy filename="BatchSearchExample.java">{batchSearchCode}</CodeBlockWithCopy>
      </section>

      <section id="混合检索" className="content-section">
        <SectionHeader number={4} title="混合检索" />
        
        <h3 className="subsection-title">4.1 混合检索原理</h3>
        <p className="paragraph">结合向量检索和关键词检索提高准确性：</p>

        <div className="grid-2col">
          <div className="card-blue">
            <h4 className="card-title-blue">向量检索</h4>
            <p className="card-description-blue mb-2">基于语义相似度的搜索</p>
            <ul className="list-styled list-blue text-xs">
              <li>优势：理解语义、处理多义词</li>
              <li>劣势：可能错过精确匹配</li>
              <li>使用：OpenAI embeddings、Cohere</li>
            </ul>
          </div>
          <div className="card-green">
            <h4 className="card-title-green">关键词检索</h4>
            <p className="card-description-green mb-2">基于 BM25 等算法的搜索</p>
            <ul className="list-styled list-green text-xs">
              <li>优势：精确匹配、快速</li>
              <li>劣势：无法理解语义</li>
              <li>使用：Elasticsearch、Lucene</li>
            </ul>
          </div>
        </div>

        <h3 className="subsection-title">4.2 结果融合</h3>
        <p className="paragraph">将两种检索结果合并并重新排序：</p>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h4 className="text-xl font-bold mb-2 text-blue-900">融合策略</h4>
          <ul className="space-y-3 text-blue-800">
            <li><strong>加权平均</strong>：vector_results * 0.6 + keyword_results * 0.4</li>
            <li><strong>倒排融合（RRF）</strong>：vector_rank + keyword_rank</li>
            <li><strong>重排序</strong>：使用 Cross-Encoder 重新排序</li>
            <li><strong>最小阈值</strong>：两种方法都返回结果才融合</li>
          </ul>
        </div>
      </section>

      <section id="最佳实践" className="content-section">
        <SectionHeader number={5} title="最佳实践" />
        
        <div className="space-y-6">
          <div className="info-card">
            <h4 className="font-semibold text-gray-900 mb-3">🎯 向量优化</h4>
            <ul className="text-gray-700 space-y-2">
              <li><strong>归一化向量</strong>：使用 L2 归一化提高余弦相似度计算效率</li>
              <li><strong>选择合适的维度</strong>：在精度和性能之间平衡（通常 768-1536 维）</li>
              <li><strong>批量处理</strong>：批量向量化减少 API 调用次数</li>
              <li><strong>缓存向量</strong>：缓存常用文档的向量避免重复计算</li>
            </ul>
          </div>

          <div className="info-card">
            <h4 className="font-semibold text-gray-900 mb-3">⚡ 性能优化</h4>
            <ul className="text-gray-700 space-y-2">
              <li><strong>索引优化</strong>：为向量数据库创建合适的索引（如 HNSW）</li>
              <li><strong>连接池</strong>：复用数据库连接减少连接开销</li>
              <li><strong>异步处理</strong>：使用异步 API 提高并发性能</li>
              <li><strong>分片策略</strong>：大规模数据集使用分片提高吞吐量</li>
            </ul>
          </div>

          <div className="info-card">
            <h4 className="font-semibold text-gray-900 mb-3">🔍 检索优化</h4>
            <ul className="text-gray-700 space-y-2">
              <li><strong>Top-K 优化</strong>：根据场景选择合适的 K 值（通常 3-10）</li>
              <li><strong>相似度阈值</strong>：设置最小相似度阈值过滤低质量结果</li>
              <li><strong>元数据过滤</strong>：使用文档元数据精确筛选结果</li>
              <li><strong>查询扩展</strong>：使用 LLM 扩展或改写用户查询</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-8">
        <h3 className="text-2xl font-bold mb-4 text-gray-900">本节小结</h3>
        <p className="mb-4 text-gray-700">本节完整介绍了 LangChain4j 的向量检索功能，包括：</p>
        <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
          <li><strong>向量检索概述</strong>：向量嵌入原理、相似度计算、返回结果</li>
          <li><strong>EmbeddingStore 接口</strong>：核心 API 方法、支持的向量数据库</li>
          <li><strong>向量检索实现</strong>：基础检索、批量检索、代码示例</li>
          <li><strong>混合检索</strong>：向量检索 + 关键词检索、结果融合策略</li>
          <li><strong>最佳实践</strong>：向量优化、性能优化、检索优化</li>
        </ul>
        <div className="border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-600 mb-2">下一步</p>
          <a href="/chat-listeners" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors">
            下一章：聊天监听器 →
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;
