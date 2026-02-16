import Layout from '../components/layout/Layout';
import { Tag, SectionHeader, CodeBlockWithCopy, TipBox } from '../components/ui';

const hybridModelCode = `public class HybridModelStrategy {

    private final ChatLanguageModel fastModel;   // GPT-3.5-turbo
    private final ChatLanguageModel qualityModel;  // GPT-4
    private final ChatLanguageModel codeModel;    // Claude-3-sonnet

    /**
     * 根据任务类型选择合适的模型
     */
    public String generate(TaskType type, String prompt) {
        return switch (type) {
            case SIMPLE_QA, SUMMARY -> fastModel.generate(prompt).content();
            case COMPLEX_REASONING -> qualityModel.generate(prompt).content();
            case CODE_GENERATION -> codeModel.generate(prompt).content();
            default -> fastModel.generate(prompt).content();
        };
    }
}`;

const cacheServiceCode = `@Service
public class CacheService {

    private final CacheManager cacheManager;
    private final EmbeddingModel embeddingModel;

    /**
     * 带缓存的生成方法
     */
    public String generateWithCache(String prompt, ChatLanguageModel model) {
        String cacheKey = DigestUtils.md5Hex(prompt);
        
        // 尝试从缓存获取
        String cachedResult = cacheManager.get(cacheKey, String.class);
        if (cachedResult != null) {
            return cachedResult;
        }

        // 缓存未命中，调用模型
        String result = model.generate(prompt).content();
        
        // 存入缓存，设置 1 小时过期
        cacheManager.put(cacheKey, result, Duration.ofHours(1));
        
        return result;
    }
}`;

const modelConfigCode = `public class ModelConfig {

    /**
     * 按任务类型配置 Token 限制
     */
    public static int getMaxTokens(TaskType type) {
        return switch (type) {
            case SIMPLE_QA -> 256;      // 简单问答：短答案
            case SUMMARY -> 512;      // 摘要：中等长度
            case CODE_GENERATION -> 1024;  // 代码：需要更多 Token
            case COMPLEX_REASONING -> 2048;  // 复杂推理：长答案
            default -> 512;
        };
    }
}`;

const batchEmbeddingCode = `public class BatchEmbedding {

    private final EmbeddingModel embeddingModel;
    private static final int BATCH_SIZE = 100;

    /**
     * 批量嵌入文本
     */
    public List<Embedding> embedBatch(List<String> texts) {
        List<Embedding> allEmbeddings = new ArrayList<>();
        
        // 分批处理
        for (int i = 0; i < texts.size(); i += BATCH_SIZE) {
            int end = Math.min(i + BATCH_SIZE, texts.size());
            List<String> batch = texts.subList(i, end);
            
            // 批量调用嵌入 API
            List<Embedding> batchEmbeddings = 
                embeddingModel.embedAll(batch).content();
            
            allEmbeddings.addAll(batchEmbeddings);
        }
        
        return allEmbeddings;
    }
}`;

const budgetMonitorCode = `@Component
public class BudgetMonitor {

    private static final BigDecimal MONTHLY_BUDGET = new BigDecimal("100");
    private static final BigDecimal WARNING_THRESHOLD = MONTHLY_BUDGET.multiply(new BigDecimal("0.8"));
    
    private BigDecimal currentCost = BigDecimal.ZERO;

    /**
     * 记录 API 调用成本并检查预算
     */
    public synchronized void recordCost(BigDecimal cost) {
        currentCost = currentCost.add(cost);
        
        // 检查是否超过警告阈值
        if (currentCost.compareTo(WARNING_THRESHOLD) >= 0) {
            sendAlert("预算警告：已使用 " + currentCost + "/100 美元");
        }
        
        // 检查是否超过总预算
        if (currentCost.compareTo(MONTHLY_BUDGET) >= 0) {
            sendAlert("预算超支：" + currentCost + "/100 美元");
            // 可选择暂停服务或降级
        }
    }
}`;

const CostOptimizationPage = () => {
  return (
    <Layout>
      <div className="page-tags">
        <Tag variant="indigo">成本优化</Tag>
        <Tag variant="purple">性能优化</Tag>
        <Tag variant="green">最佳实践</Tag>
      </div>

      <h1 className="page-title">成本优化</h1>
      <p className="page-intro">LangChain4j 应用成本分析与优化策略</p>

      <nav className="toc-nav">
        <h3 className="toc-title">目录</h3>
        <ol className="toc-list">
          <li className="toc-item"><span className="toc-number">1.</span> <a href="#成本分析概述" className="toc-link">成本分析概述</a></li>
          <li className="toc-item"><span className="toc-number">2.</span> <a href="#模型选择策略" className="toc-link">模型选择策略</a></li>
          <li className="toc-item"><span className="toc-number">3.</span> <a href="#缓存与复用" className="toc-link">缓存与复用</a></li>
          <li className="toc-item"><span className="toc-number">4.</span> <a href="#Token优化" className="toc-link">Token 优化</a></li>
          <li className="toc-item"><span className="toc-number">5.</span> <a href="#向量化成本优化" className="toc-link">向量化成本优化</a></li>
          <li className="toc-item"><span className="toc-number">6.</span> <a href="#监控与预算控制" className="toc-link">监控与预算控制</a></li>
        </ol>
      </nav>

      <section id="成本分析概述" className="content-section">
        <SectionHeader number={1} title="成本分析概述" />
        
        <h3 className="subsection-title">1.1 AI 应用成本构成</h3>
        <p className="paragraph">LangChain4j 应用的主要成本来源包括：</p>

        <div className="grid-2col">
          <div className="info-card info-card-blue">
            <h4 className="font-semibold mb-2">API 调用成本</h4>
            <p className="text-sm mb-2">LLM API 调用（最大成本项）</p>
            <ul className="text-sm space-y-1 opacity-80">
              <li> 输入 Token：$0.005/1K tokens (GPT-3.5)</li>
              <li> 输出 Token：$0.015/1K tokens (GPT-3.5)</li>
              <li> GPT-4：成本为 GPT-3.5 的 10-20 倍</li>
            </ul>
          </div>
          <div className="info-card info-card-green">
            <h4 className="font-semibold mb-2">嵌入模型成本</h4>
            <p className="text-sm mb-2">文本向量嵌入（中等成本）</p>
            <ul className="text-sm space-y-1 opacity-80">
              <li> OpenAI embeddings：$0.0001/1K tokens</li>
              <li> 本地模型：零 API 成本，但需要硬件</li>
              <li> HuggingFace：按使用量或免费层级</li>
            </ul>
          </div>
          <div className="info-card info-card-purple">
            <h4 className="font-semibold mb-2">向量数据库成本</h4>
            <p className="text-sm mb-2">向量存储和检索（可变成本）</p>
            <ul className="text-sm space-y-1 opacity-80">
              <li> Pinecone：$70/月起步</li>
              <li> PGVector：PostgreSQL 基础成本</li>
              <li> Milvus：开源免费，需自行部署</li>
            </ul>
          </div>
          <div className="info-card" style={{ background: '#fff7ed', borderColor: '#fed7aa' }}>
            <h4 className="font-semibold mb-2">基础设施成本</h4>
            <p className="text-sm mb-2">服务器、存储、带宽（固定成本）</p>
            <ul className="text-sm space-y-1 opacity-80">
              <li> 云服务器：$20-200/月</li>
              <li> GPU 实例：$300-1000/月（本地模型）</li>
              <li> 存储、CDN、带宽</li>
            </ul>
          </div>
        </div>

        <TipBox type="tip" title="成本优化优先级">
          <p className="mb-4">按照成本影响和优化难度排序：</p>
          <ol className="list-decimal list-inside space-y-2">
            <li><strong>模型选择</strong>（高影响，低难度）- 选择合适的模型是最有效的优化手段</li>
            <li><strong>缓存策略</strong>（高影响，中难度） - 缓存重复请求可节省 50-80% 成本</li>
            <li><strong>Token 优化</strong>（中影响，低难度） - 精简 Prompt 和响应长度</li>
            <li><strong>批处理</strong>（中影响，中难度） - 批量处理降低 API 调用开销</li>
            <li><strong>本地模型</strong>（高影响，高难度） - 完全消除 API 成本，但需要硬件投入</li>
          </ol>
        </TipBox>
      </section>

      <section id="模型选择策略" className="content-section">
        <SectionHeader number={2} title="模型选择策略" />
        
        <h3 className="subsection-title">2.1 按场景选择模型</h3>
        <p className="paragraph">不同场景适合不同的模型组合：</p>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>场景</th>
                <th>推荐模型</th>
                <th>成本估算</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>简单问答</td>
                <td>GPT-3.5-turbo</td>
                <td>$0.002/1K tokens</td>
                <td>快速响应，成本最低</td>
              </tr>
              <tr>
                <td>复杂推理</td>
                <td>GPT-4 / Claude-3</td>
                <td>$0.03-0.12/1K tokens</td>
                <td>高准确度，但成本高</td>
              </tr>
              <tr>
                <td>代码生成</td>
                <td>Claude-3-sonnet</td>
                <td>$0.03/1K tokens</td>
                <td>代码质量最佳</td>
              </tr>
              <tr>
                <td>摘要生成</td>
                <td>GPT-3.5-turbo</td>
                <td>$0.002/1K tokens</td>
                <td>长文本处理，成本敏感</td>
              </tr>
              <tr>
                <td>中文场景</td>
                <td>Qwen / Baichuan</td>
                <td>本地部署</td>
                <td>中文优化，开源免费</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="subsection-title">2.2 混合模型策略</h3>
        <p className="paragraph">在应用中混合使用多个模型以平衡成本和质量：</p>

        <CodeBlockWithCopy code={hybridModelCode} language="java" filename="HybridModelStrategy.java" />

        <TipBox type="success" title="成本节省效果">
          <ul className="space-y-2">
            <li> 混合使用 GPT-3.5 和 GPT-4，可节省 <strong>60-80%</strong> 成本</li>
            <li> 简单任务使用快速模型，复杂任务使用高质量模型</li>
            <li> 根据查询复杂度动态选择模型</li>
          </ul>
        </TipBox>
      </section>

      <section id="缓存与复用" className="content-section">
        <SectionHeader number={3} title="缓存与复用" />
        
        <h3 className="subsection-title">3.1 缓存策略</h3>
        <p className="paragraph">有效的缓存可以显著降低 API 调用次数和成本：</p>

        <div className="space-y-6">
          <div className="info-card info-card-blue">
            <h4 className="font-semibold mb-3">语义缓存（Semantic Caching）</h4>
            <p className="mb-3">缓存相似的查询，即使文本不完全相同：</p>
            <ul className="text-sm space-y-1 opacity-80">
              <li> 将查询转换为向量</li>
              <li> 计算与缓存查询的余弦相似度</li>
              <li> 相似度 &gt; 0.95 则返回缓存结果</li>
              <li> 节省率：30-70%</li>
            </ul>
          </div>

          <div className="info-card info-card-purple">
            <h4 className="font-semibold mb-3">精确缓存（Exact Caching）</h4>
            <p className="mb-3">完全相同的查询直接返回缓存：</p>
            <ul className="text-sm space-y-1 opacity-80">
              <li> 使用 Redis 或内存缓存</li>
              <li> 设置合理的过期时间（如 1 小时）</li>
              <li> 适用于重复率高的场景</li>
              <li> 节省率：50-90%</li>
            </ul>
          </div>

          <div className="info-card info-card-green">
            <h4 className="font-semibold mb-3">向量缓存</h4>
            <p className="mb-3">缓存嵌入向量，避免重复计算：</p>
            <ul className="text-sm space-y-1 opacity-80">
              <li> 缓存文档和查询的嵌入向量</li>
              <li> 使用文本哈希作为缓存键</li>
              <li> 节省嵌入模型 API 调用成本</li>
              <li> 节省率：80-95%（文本重复场景）</li>
            </ul>
          </div>
        </div>

        <h3 className="subsection-title">3.2 缓存实现</h3>
        <CodeBlockWithCopy code={cacheServiceCode} language="java" filename="CacheService.java" />
      </section>

      <section id="Token优化" className="content-section">
        <SectionHeader number={4} title="Token 优化" />
        
        <h3 className="subsection-title">4.1 Prompt 优化</h3>
        <p className="paragraph">精简 Prompt 可以大幅减少输入 Token 成本：</p>

        <div className="space-y-6">
          <div className="info-card" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
            <h4 className="font-semibold mb-3">❌ 避免：冗长的 Prompt</h4>
            <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-sm overflow-x-auto">
              "请仔细阅读下面的文档内容，然后根据文档中的信息，针对用户提出的问题，给出一个详细、准确、有条理的答案。答案应该包含引用，并且要确保准确性。如果文档中没有相关信息，请明确说明。"
            </pre>
          </div>

          <div className="info-card info-card-green">
            <h4 className="font-semibold mb-3">✅ 推荐：简洁的 Prompt</h4>
            <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-sm overflow-x-auto">
              "基于以下文档回答问题。如果没有相关信息，请说明。"
            </pre>
            <p className="mt-3 text-sm">节省约 80% 的 Token</p>
          </div>
        </div>

        <h3 className="subsection-title">4.2 输出长度控制</h3>
        <p className="paragraph">设置合理的 maxTokens 避免不必要的成本：</p>

        <CodeBlockWithCopy code={modelConfigCode} language="java" filename="ModelConfig.java" />
      </section>

      <section id="向量化成本优化" className="content-section">
        <SectionHeader number={5} title="向量化成本优化" />
        
        <h3 className="subsection-title">5.1 嵌入模型选择</h3>
        <p className="paragraph">不同嵌入模型的成本差异巨大：</p>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>模型</th>
                <th>成本</th>
                <th>维度</th>
                <th>适用场景</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>OpenAI text-embedding-3-small</td>
                <td>$0.00002/1K tokens</td>
                <td>1536</td>
                <td>通用场景</td>
              </tr>
              <tr>
                <td>OpenAI text-embedding-3-large</td>
                <td>$0.00013/1K tokens</td>
                <td>3072</td>
                <td>高精度需求</td>
              </tr>
              <tr>
                <td>HuggingFace sentence-transformers</td>
                <td>免费（本地）</td>
                <td>768</td>
                <td>大规模、低成本</td>
              </tr>
              <tr>
                <td>Jina AI embeddings</td>
                <td>$0.000002/1K tokens</td>
                <td>768</td>
                <td>超低成本</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="subsection-title">5.2 批处理优化</h3>
        <p className="paragraph">批量处理文档可降低 API 调用开销：</p>

        <CodeBlockWithCopy code={batchEmbeddingCode} language="java" filename="BatchEmbedding.java" />
      </section>

      <section id="监控与预算控制" className="content-section">
        <SectionHeader number={6} title="监控与预算控制" />
        
        <h3 className="subsection-title">6.1 成本监控指标</h3>
        <p className="paragraph">监控关键指标以控制成本：</p>

        <div className="grid-2col">
          <div className="info-card info-card-blue">
            <h4 className="font-semibold mb-2">API 调用次数</h4>
            <p className="text-sm opacity-80">每天/每周的 API 调用总量</p>
          </div>
          <div className="info-card info-card-green">
            <h4 className="font-semibold mb-2">Token 使用量</h4>
            <p className="text-sm opacity-80">输入/输出 Token 数量及成本</p>
          </div>
          <div className="info-card info-card-purple">
            <h4 className="font-semibold mb-2">缓存命中率</h4>
            <p className="text-sm opacity-80">缓存成功命中占总请求的比例</p>
          </div>
          <div className="info-card" style={{ background: '#fff7ed', borderColor: '#fed7aa' }}>
            <h4 className="font-semibold mb-2">平均响应成本</h4>
            <p className="text-sm opacity-80">每次请求的平均 API 成本</p>
          </div>
        </div>

        <h3 className="subsection-title">6.2 预算警报</h3>
        <p className="paragraph">设置预算阈值并触发警报：</p>

        <CodeBlockWithCopy code={budgetMonitorCode} language="java" filename="BudgetMonitor.java" />

        <TipBox type="info" title="成本优化总结">
          <ul className="space-y-2">
            <li><strong>模型选择</strong>：合理选择模型可节省 60-80% 成本</li>
            <li><strong>缓存策略</strong>：缓存可节省 50-90% 重复请求成本</li>
            <li><strong>Token 优化</strong>：精简 Prompt 和设置 maxTokens 可节省 20-50%</li>
            <li><strong>批处理</strong>：批量处理降低 API 调用开销</li>
            <li><strong>监控预警</strong>：实时监控成本，设置预算限制</li>
          </ul>
        </TipBox>
      </section>

      <div className="summary-card">
        <h3 className="summary-title">本节小结</h3>
        <p className="mb-4">本节完整介绍了 LangChain4j 应用的成本优化策略，包括：</p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li><strong>成本分析</strong>：API 调用、嵌入模型、向量数据库、基础设施成本构成</li>
          <li><strong>模型选择</strong>：按场景选择模型、混合模型策略</li>
          <li><strong>缓存策略</strong>：语义缓存、精确缓存、向量缓存</li>
          <li><strong>Token 优化</strong>：Prompt 精简、输出长度控制</li>
          <li><strong>向量化优化</strong>：嵌入模型选择、批处理优化</li>
          <li><strong>监控与预算</strong>：关键指标监控、预算警报设置</li>
        </ul>
        <div className="summary-footer">
          <p className="summary-next">下一步</p>
          <a href="/deployment" className="summary-link">
            下一章：部署与运维 →
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default CostOptimizationPage;
