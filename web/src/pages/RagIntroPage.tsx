import Layout from '../components/layout/Layout';
import { SectionHeader, TipBox } from '../components/ui';

const RagIntroPage = () => {
  return (
    <Layout>
      <div className="flex items-center gap-3 mb-8 text-sm">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">RAG</span>
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">核心概念</span>
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">~30分钟</span>
      </div>

      <h1 className="text-5xl font-bold text-gray-900 mb-6">RAG简介</h1>
      <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-4xl">
        深入理解检索增强生成（RAG）的核心概念、工作原理和应用场景，为学习后续RAG实现打下坚实基础。
      </p>

      <div className="bg-gray-50 rounded-lg p-6 mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">📚 本章学习目标</h2>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start gap-3">
            <span className="text-green-600 text-2xl font-bold">✓</span>
            <span className="flex-1"><strong className="text-gray-900">理解RAG的核心概念和工作原理</strong></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 text-2xl font-bold">✓</span>
            <span className="flex-1"><strong className="text-gray-900">掌握RAG与传统微调的区别</strong></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 text-2xl font-bold">✓</span>
            <span className="flex-1"><strong className="text-gray-900">熟悉RAG的5步工作流程</strong></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 text-2xl font-bold">✓</span>
            <span className="flex-1"><strong className="text-gray-900">了解RAG的典型应用场景</strong></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 text-2xl font-bold">✓</span>
            <span className="flex-1"><strong className="text-gray-900">认识RAG的优势和挑战</strong></span>
          </li>
        </ul>
      </div>

      <section id="what-is-rag" className="content-section">
        <SectionHeader number={1} title="什么是RAG？" />

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3">RAG定义</h3>
          <p className="text-gray-700 mb-4 text-lg leading-relaxed">
            <strong className="text-indigo-600">检索增强生成（Retrieval-Augmented Generation，RAG）</strong>是一种将信息检索与生成式AI结合的技术。
            通过在将用户问题发送给LLM之前，先从外部知识库中检索相关信息，然后将这些信息作为上下文注入到提示词中，
            让LLM基于检索到的事实生成更准确的回答。
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-4 text-xl flex items-center gap-2">
            <span className="text-blue-600">🔄</span>
            RAG工作流程
          </h4>
          <p className="text-gray-600 mb-4">
            RAG系统由5个核心步骤组成，形成一个完整的"检索-增强-生成"流水线。
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0 text-lg shadow-md">1</div>
              <div className="flex-1">
                <div className="font-bold text-gray-900 text-lg mb-1">文档摄入（Ingestion）</div>
                <p className="text-gray-600 text-base">加载原始文档，进行清理、分块、生成Embedding向量</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0 text-lg shadow-md">2</div>
              <div className="flex-1">
                <div className="font-bold text-gray-900 text-lg mb-1">向量存储（Vector Storage）</div>
                <p className="text-gray-600 text-base">将Embedding向量和对应的文本段存入向量数据库</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-bold flex-shrink-0 text-lg shadow-md">3</div>
              <div className="flex-1">
                <div className="font-bold text-gray-900 text-lg mb-1">相似度检索（Retrieval）</div>
                <p className="text-gray-600 text-base">将用户查询转为Embedding，搜索最相似的文本段</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold flex-shrink-0 text-lg shadow-md">4</div>
              <div className="flex-1">
                <div className="font-bold text-gray-900 text-lg mb-1">上下文注入（Augmentation）</div>
                <p className="text-gray-600 text-base">将检索到的相关信息注入到Prompt中</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-bold flex-shrink-0 text-lg shadow-md">5</div>
              <div className="flex-1">
                <div className="font-bold text-gray-900 text-lg mb-1">增强生成（Generation）</div>
                <p className="text-gray-600 text-base">LLM基于增强的Prompt生成准确回答</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg">
          <h4 className="font-bold text-blue-900 mb-2">💡 核心理念</h4>
          <p className="text-blue-800 text-base leading-relaxed">
            RAG的本质是"授人以渔"：不改变LLM的内在能力，而是通过外部知识库扩展其认知边界，使其能够访问训练数据之外的信息。
            这让AI从"知道一切但可能产生幻觉"变成"知道有限但基于事实"。
          </p>
        </div>
      </section>

      <section id="why-rag" className="content-section">
        <SectionHeader number={2} title="为什么需要RAG？" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h4 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              传统LLM的局限
            </h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">✗</span>
                <span><strong>知识截止</strong>：LLM的训练数据有截止时间，无法访问训练后的新知识</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">✗</span>
                <span><strong>无法访问私有数据</strong>：公司内部文档、用户数据等无法被LLM访问</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">✗</span>
                <span><strong>容易产生幻觉</strong>：可能编造不存在的信息，准确性无法保证</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">✗</span>
                <span><strong>缺乏领域知识</strong>：对特定领域（医疗、法律、金融）的理解不足</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">✗</span>
                <span><strong>计算资源消耗高</strong>：需要超大参数模型，成本昂贵</span>
              </li>
            </ul>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h4 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">✅</span>
              RAG的解决方案
            </h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>实时更新知识</strong>：无需重新训练，直接添加新文档到向量数据库</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>访问私有/专有数据</strong>：企业内部文档、产品手册等可安全本地存储</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>减少LLM幻觉</strong>：基于检索的事实，避免AI胡编乱造</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>提高可解释性</strong>：可追溯回答来源，增强用户信任</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>成本效益高</strong>：比微调便宜，适合中小规模应用</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>数据隐私和安全</strong>：私有数据可本地存储，无需上传到公有云</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 mb-6">
          <h4 className="font-bold text-yellow-900 mb-2">💡 什么时候选择RAG？</h4>
          <p className="text-yellow-800 text-base">
            RAG最适合需要频繁更新知识、访问私有数据、对准确性要求高的场景。如企业知识库、法律检索、医疗诊断等。
          </p>
        </div>
      </section>

      <section id="rag-vs-finetuning" className="content-section">
        <SectionHeader number={3} title="RAG vs 微调" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="border border-gray-200 rounded-xl p-6 bg-white hover:shadow-lg transition-shadow">
            <h4 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              RAG
            </h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <span><strong>实时更新知识</strong>：无需重新训练，直接添加新文档</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <span><strong>低成本</strong>：相比微调，检索成本更低</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <span><strong>可解释性</strong>：可追溯回答来源，提高可信度</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <span><strong>数据隐私</strong>：私有数据可本地存储</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <span><strong>灵活扩展</strong>：轻松支持多种知识源</span>
              </li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-xl p-6 bg-white hover:shadow-lg transition-shadow">
            <h4 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🔧</span>
              微调（Fine-tuning）
            </h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span><strong>深度融合</strong>：知识内化到模型中</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">✓</span>
                <span><strong>推理效率高</strong>：无需检索步骤，响应更快</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-600">✗</span>
                <span><strong>成本高昂</strong>：需要大量计算资源和训练数据</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-600">✗</span>
                <span><strong>知识更新慢</strong>：新增知识需重新训练模型</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-600">✗</span>
                <span><strong>难以解释</strong>：黑盒模型，无法追溯回答来源</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-5 mb-6">
          <h4 className="font-bold text-indigo-900 mb-2">🤝 混合策略</h4>
          <p className="text-indigo-800 text-base">
            在实际应用中，RAG和微调可以结合使用：通过微调让模型掌握领域知识，通过RAG补充实时信息和新文档，
            发挥各自优势，获得最佳效果。
          </p>
        </div>
      </section>

      <section id="core-components" className="content-section">
        <SectionHeader number={4} title="RAG核心组件" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">📄</div>
            <h4 className="font-bold text-gray-900 mb-2">文档加载器</h4>
            <p className="text-gray-600 text-sm">从各种来源加载文档</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">✂️</div>
            <h4 className="font-bold text-gray-900 mb-2">文本分块器</h4>
            <p className="text-gray-600 text-sm">将长文档切分成可管理的小块</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">🔢</div>
            <h4 className="font-bold text-gray-900 mb-2">Embedding模型</h4>
            <p className="text-gray-600 text-sm">将文本转换为向量表示</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">🗄️</div>
            <h4 className="font-bold text-gray-900 mb-2">向量数据库</h4>
            <p className="text-gray-600 text-sm">存储和检索向量相似度</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">🔍</div>
            <h4 className="font-bold text-gray-900 mb-2">检索器</h4>
            <p className="text-gray-600 text-sm">基于相似度搜索相关文档段</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">💬</div>
            <h4 className="font-bold text-gray-900 mb-2">提示词模板</h4>
            <p className="text-gray-600 text-sm">将检索结果组装到LLM Prompt中</p>
          </div>
        </div>

        <TipBox type="info" title="LangChain4j中的RAG组件">
          <p className="text-blue-800 text-sm">
            LangChain4j提供了完整的RAG组件支持，包括DocumentLoader、TextSplitter、EmbeddingModel、InMemoryVectorStore等，
            可以快速搭建RAG系统。详细代码实现请参考<a href="/rag-implementation" className="text-indigo-600 hover:underline">RAG实现</a>章节。
          </p>
        </TipBox>
      </section>

      <section id="use-cases" className="content-section">
        <SectionHeader number={5} title="典型应用场景" />

        <div className="space-y-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="text-4xl">💼</div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-2">企业知识库问答</h4>
                <p className="text-gray-600 text-base">
                  基于公司内部文档、手册、政策等提供准确问答，员工可以快速获取信息。
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="text-4xl">📖</div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-2">技术文档检索</h4>
                <p className="text-gray-600 text-base">
                  快速搜索API文档、SDK文档、代码示例，帮助开发者快速解决问题。
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="text-4xl">⚖️</div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-2">法律文档分析</h4>
                <p className="text-gray-600 text-base">
                  基于法律条文、案例库提供专业咨询，支持律师快速查找相关法律依据。
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🏥</div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-2">医疗诊断辅助</h4>
                <p className="text-gray-600 text-base">
                  结合医学文献和病例数据库辅助诊断，提供参考意见和治疗建议。
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="text-4xl">📚</div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-2">学术文献检索</h4>
                <p className="text-gray-600 text-base">
                  搜索论文、引用、研究方法等，辅助学术研究和文献综述。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="advantages" className="content-section">
        <SectionHeader number={6} title="RAG优势" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <div className="text-3xl mb-3">📊</div>
            <h4 className="font-bold text-green-900 mb-2">解决知识截止</h4>
            <p className="text-green-800 text-sm">访问训练数据之外的信息</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <div className="text-3xl mb-3">🎯</div>
            <h4 className="font-bold text-green-900 mb-2">减少幻觉</h4>
            <p className="text-green-800 text-sm">基于检索事实，减少胡编乱造</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <div className="text-3xl mb-3">🔍</div>
            <h4 className="font-bold text-green-900 mb-2">可解释性</h4>
            <p className="text-green-800 text-sm">可追溯回答来源，提高可信度</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <div className="text-3xl mb-3">⚡</div>
            <h4 className="font-bold text-green-900 mb-2">实时更新</h4>
            <p className="text-green-800 text-sm">无需重训，直接添加新文档</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <div className="text-3xl mb-3">💰</div>
            <h4 className="font-bold text-green-900 mb-2">成本效益</h4>
            <p className="text-green-800 text-sm">比微调便宜，适合中小规模应用</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <div className="text-3xl mb-3">🔐</div>
            <h4 className="font-bold text-green-900 mb-2">数据隐私</h4>
            <p className="text-green-800 text-sm">私有数据可本地存储</p>
          </div>
        </div>
      </section>

      <section id="challenges" className="content-section">
        <SectionHeader number={7} title="RAG挑战与解决方案" />

        <div className="space-y-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-red-900 mb-3">⚠️ 挑战：检索质量</h4>
            <p className="text-gray-600 mb-3 text-base">
              检索质量直接影响回答质量，不相关或过时的信息会降低准确性。
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
              <h5 className="font-bold text-blue-900 mb-2">💡 解决方案</h5>
              <ul className="space-y-1 text-blue-800 text-sm">
                <li> 使用多种检索策略（向量+关键词混合）</li>
                <li> 优化分块策略（语义分块、固定大小）</li>
                <li> 添加重排序（Rerank）优化结果质量</li>
                <li> 调整相似度阈值，平衡精度和召回率</li>
              </ul>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-red-900 mb-3">⚠️ 挑战：上下文窗口限制</h4>
            <p className="text-gray-600 mb-3 text-base">
              LLM的上下文窗口有限制，无法塞入太多检索结果。
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
              <h5 className="font-bold text-blue-900 mb-2">💡 解决方案</h5>
              <ul className="space-y-1 text-blue-800 text-sm">
                <li> 智能选择最相关的N个结果（Top-k策略）</li>
                <li> 使用压缩技术减少Token消耗</li>
                <li> 实现多轮检索，逐步获取信息</li>
                <li> 将长文档摘要后再嵌入</li>
              </ul>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-red-900 mb-3">⚠️ 挑战：延迟增加</h4>
            <p className="text-gray-600 mb-3 text-base">
              检索+生成两步，响应时间会变长，影响用户体验。
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
              <h5 className="font-bold text-blue-900 mb-2">💡 解决方案</h5>
              <ul className="space-y-1 text-blue-800 text-sm">
                <li> 使用流式检索，边检索边生成</li>
                <li> 缓存常用查询的检索结果</li>
                <li> 选择高性能向量数据库（Pinecone、Weaviate）</li>
                <li> 并行处理多个查询请求</li>
                <li> 优化Embedding生成批处理</li>
              </ul>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold text-red-900 mb-3">⚠️ 挑战：分块策略</h4>
            <p className="text-gray-600 mb-3 text-base">
              文档分块方式影响检索效果，需要精心设计。
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
              <h5 className="font-bold text-blue-900 mb-2">💡 解决方案</h5>
              <ul className="space-y-1 text-blue-800 text-sm">
                <li> 固定大小分块（如512、1024 tokens）</li>
                <li> 段落分块，保持语义完整性</li>
                <li> 重叠分块（50-200 tokens重叠）</li>
                <li> 语义分块，基于语义边界切分</li>
                <li> 递归分块，先分大段落再分句子</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="content-section">
        <SectionHeader number={8} title="常见问题" />
        
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md">
            <h4 className="font-bold text-gray-900 mb-2">Q: RAG适合什么场景？</h4>
            <p className="text-gray-700">
              A: 需要访问私有数据、知识库频繁更新、需要准确性和可解释性的场景。如企业知识库、技术文档检索、法律医疗咨询等。
            </p>
          </div>
          <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md">
            <h4 className="font-bold text-gray-900 mb-2">Q: RAG会替代微调吗？</h4>
            <p className="text-gray-700">
              A: 不会，两者可以互补。RAG提供实时信息和可解释性，微调提供领域知识和推理效率。最佳实践是两者结合使用。
            </p>
          </div>
          <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md">
            <h4 className="font-bold text-gray-900 mb-2">Q: RAG的成本如何控制？</h4>
            <p className="text-gray-700">
              A: 主要成本来自Embedding生成和LLM调用。可以通过缓存检索结果、使用更小的模型、批处理Embedding等方式优化成本。
            </p>
          </div>
          <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md">
            <h4 className="font-bold text-gray-900 mb-2">Q: 如何评估RAG系统效果？</h4>
            <p className="text-gray-700">
              A: 可以使用检索准确率（Recall）、精确率（Precision）、F1分数等指标评估。也可以通过人工评估回答质量、用户满意度调查等方式。
            </p>
          </div>
        </div>
      </section>

      <div className="text-center mt-12">
        <a href="/rag-setup" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-all shadow-md">
          继续学习 RAG环境搭建 →
        </a>
      </div>
    </Layout>
  );
};

export default RagIntroPage;
