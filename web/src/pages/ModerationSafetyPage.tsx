import Layout from '../components/layout/Layout';
import { Tag, SectionHeader, CodeBlock, TipBox } from '../components/ui';

const keywordFilterCode = `package com.example.langchain4j.moderation;

import java.util.List;
import java.util.Set;
import java.util.HashSet;

public class KeywordFilter {

    private final Set<String> blockedWords;
    private final boolean caseSensitive;

    public KeywordFilter(List<String> words, boolean caseSensitive) {
        this.blockedWords = new HashSet<>();
        for (String word : words) {
            blockedWords.add(caseSensitive ? word : word.toLowerCase());
        }
        this.caseSensitive = caseSensitive;
    }

    public boolean containsBlockedWord(String content) {
        String textToCheck = caseSensitive ? content : content.toLowerCase();
        
        for (String word : blockedWords) {
            if (textToCheck.contains(word)) {
                return true;
            }
        }
        return false;
    }
}`;

const openAiModerationCode = `package com.example.langchain4j.moderation;

import dev.langchain4j.model.openai.OpenAiModerationModel;

public class OpenAIModeration {

    private final OpenAiModerationModel moderationModel;

    public OpenAIModeration(String apiKey) {
        this.moderationModel = OpenAiModerationModel.builder()
            .apiKey(apiKey)
            .build();
    }

    public boolean isContentSafe(String content) {
        var result = moderationModel.moderate(content);
        return !result.isFlagged();
    }
}`;

const moderationServiceCode = `package com.example.langchain4j.service;

import dev.langchain4j.model.chat.ChatLanguageModel;

public class ModerationService {

    private final ChatLanguageModel model;
    private final KeywordFilter keywordFilter;
    private final OpenAIModeration openAIModeration;

    public ModerationService(ChatLanguageModel model, String openaiApiKey) {
        this.model = model;
        this.keywordFilter = new KeywordFilter(List.of("暴力", "恐怖", "自杀"), false);
        this.openAIModeration = new OpenAIModeration(openaiApiKey);
    }

    public String generateWithModeration(String prompt) {
        // 1. 预审核用户输入
        if (keywordFilter.containsBlockedWord(prompt)) {
            return "您的内容违反了内容政策，请修改后重试。";
        }

        try {
            // 2. 调用 LLM 生成响应
            String response = model.generate(prompt).content();

            // 3. 后审核输出内容
            if (!openAIModeration.isContentSafe(response)) {
                return "抱歉，我无法生成该内容。";
            }

            return response;

        } catch (Exception e) {
            return "服务暂时不可用，请稍后重试。";
        }
    }
}`;

const ModerationSafetyPage = () => {
  return (
    <Layout>
      <div className="page-tags">
        <Tag variant="indigo">内容审核</Tag>
        <Tag variant="red">安全防护</Tag>
        <Tag variant="green">合规管理</Tag>
      </div>

      <h1 className="page-title">内容审核</h1>
      <p className="page-description">
        构建安全的 AI 应用，保护用户和平台。
      </p>

      <nav className="toc-nav">
        <h3 className="toc-title">目录</h3>
        <ol className="toc-list">
          <li className="toc-item"><span className="toc-number">1.</span> <a href="#overview" className="toc-link">内容审核概述</a></li>
          <li className="toc-item"><span className="toc-number">2.</span> <a href="#pre-moderation" className="toc-link">预审核</a></li>
          <li className="toc-item"><span className="toc-number">3.</span> <a href="#post-moderation" className="toc-link">后审核</a></li>
          <li className="toc-item"><span className="toc-number">4.</span> <a href="#api-integration" className="toc-link">内容审核 API 集成</a></li>
          <li className="toc-item"><span className="toc-number">5.</span> <a href="#best-practices" className="toc-link">安全最佳实践</a></li>
          <li className="toc-item"><span className="toc-number">6.</span> <a href="#example" className="toc-link">实战示例</a></li>
        </ol>
      </nav>

      <section id="overview" className="content-section">
        <SectionHeader number={1} title="内容审核概述" />
        <p className="paragraph">
          内容审核是构建安全 AI 应用的关键环节。本节介绍内容审核的重要性、常见风险类型和 LangChain4j 的审核能力。
        </p>

        <h3 className="subsection-title">1.1 为什么需要内容审核</h3>
        <p className="text-gray-700 mb-4">内容审核对于 AI 应用至关重要：</p>

        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>法律合规</strong>: 遵守各国法律法规（如 GDPR、COPPA）</li>
          <li><strong>平台政策</strong>: 符合应用商店和支付平台的内容政策</li>
          <li><strong>品牌保护</strong>: 维护品牌声誉，避免负面舆论</li>
          <li><strong>用户保护</strong>: 保护用户免受有害内容的影响</li>
          <li><strong>风险管控</strong>: 降低法律风险和运营风险</li>
        </ul>

        <h3 className="subsection-title">1.2 常见的内容风险</h3>
        <p className="text-gray-700 mb-4">需要重点关注以下风险类型：</p>

        <div className="grid-2col">
          <div className="card card-red">
            <h4 className="font-semibold text-red-800 mb-2">仇恨言论</h4>
            <p className="text-red-700 text-sm">针对种族、宗教、性别等的歧视性言论</p>
          </div>
          <div className="card card-orange">
            <h4 className="font-semibold text-orange-800 mb-2">暴力内容</h4>
            <p className="text-orange-700 text-sm">描述暴力、恐怖主义、自残的内容</p>
          </div>
          <div className="card card-pink">
            <h4 className="font-semibold text-pink-800 mb-2">色情内容</h4>
            <p className="text-pink-700 text-sm">成人内容、露骨的性暗示</p>
          </div>
          <div className="card card-yellow">
            <h4 className="font-semibold text-yellow-800 mb-2">欺诈信息</h4>
            <p className="text-yellow-700 text-sm">诈骗、虚假信息、钓鱼链接</p>
          </div>
        </div>
      </section>

      <section id="pre-moderation" className="content-section">
        <SectionHeader number={2} title="预审核" />
        <p className="paragraph">
          预审核在用户输入提交给 LLM 之前进行，可以拦截潜在的有害内容。
        </p>

        <h3 className="subsection-title">2.1 关键词过滤</h3>
        <p className="text-gray-700 mb-4">使用关键词列表快速拦截明显违规的内容：</p>

        <CodeBlock
          code={keywordFilterCode}
          language="java"
          filename="KeywordFilter.java"
        />

        <h3 className="subsection-title">2.2 正则表达式过滤</h3>
        <p className="text-gray-700 mb-4">使用正则表达式匹配更复杂的模式：</p>

        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>URL 检测</strong>: 检测并过滤可疑链接</li>
          <li><strong>电话号码</strong>: 检测并脱敏电话号码</li>
          <li><strong>邮箱地址</strong>: 检测并脱敏邮箱地址</li>
          <li><strong>身份证号</strong>: 检测并脱敏身份证号</li>
        </ul>
      </section>

      <section id="post-moderation" className="content-section">
        <SectionHeader number={3} title="后审核" />
        <p className="paragraph">
          后审核在 LLM 输出内容后进行，确保输出符合内容政策。
        </p>

        <h3 className="subsection-title">3.1 自动化审核</h3>
        <p className="text-gray-700 mb-4">使用 AI 模型自动审核输出内容：</p>

        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>快速审核</strong>: 使用轻量级审核模型</li>
          <li><strong>高准确率</strong>: 结合多个审核维度</li>
          <li><strong>实时处理</strong>: 不影响用户体验</li>
        </ul>

        <h3 className="subsection-title">3.2 人工审核</h3>
        <p className="text-gray-700 mb-4">对高风险内容进行人工审核：</p>

        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>优先级队列</strong>: 根据风险等级排序</li>
          <li><strong>审核工具</strong>: 提供便捷的审核界面</li>
          <li><strong>审核记录</strong>: 记录审核决策和理由</li>
        </ul>
      </section>

      <section id="api-integration" className="content-section">
        <SectionHeader number={4} title="内容审核 API 集成" />
        <p className="paragraph">
          集成第三方内容审核 API，提供专业的审核能力。
        </p>

        <h3 className="subsection-title">4.1 OpenAI Moderation API</h3>
        <p className="text-gray-700 mb-4">使用 OpenAI 的 Moderation API 进行内容审核：</p>

        <CodeBlock
          code={openAiModerationCode}
          language="java"
          filename="OpenAIModeration.java"
        />

        <TipBox variant="info" title="OpenAI Moderation API 特点">
          <ul className="list-styled">
            <li><strong>多维度检测</strong>: 仇恨、暴力、色情、自残等多个维度</li>
            <li><strong>实时响应</strong>: 毫秒级响应速度</li>
            <li><strong>持续更新</strong>: 审核规则持续优化更新</li>
            <li><strong>免费额度</strong>: 提供一定的免费调用额度</li>
          </ul>
        </TipBox>
      </section>

      <section id="best-practices" className="content-section">
        <SectionHeader number={5} title="安全最佳实践" />
        <p className="paragraph">
          遵循安全最佳实践，构建安全可靠的 AI 应用。
        </p>

        <h3 className="subsection-title">5.1 最小权限原则</h3>
        <p className="text-gray-700 mb-4">只授予必要的权限，减少安全风险：</p>

        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>API Key 管理</strong>: 使用环境变量存储敏感信息</li>
          <li><strong>权限隔离</strong>: 不同功能使用不同的权限级别</li>
          <li><strong>定期轮换</strong>: 定期更新 API Key 和密码</li>
        </ul>

        <h3 className="subsection-title">5.2 数据加密</h3>
        <p className="text-gray-700 mb-4">对敏感数据进行加密保护：</p>

        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>传输加密</strong>: 使用 HTTPS/TLS 加密网络通信</li>
          <li><strong>存储加密</strong>: 使用 AES 等算法加密数据库</li>
          <li><strong>密钥管理</strong>: 使用专业的密钥管理服务</li>
        </ul>

        <h3 className="subsection-title">5.3 用户隐私保护</h3>
        <p className="text-gray-700 mb-4">保护用户隐私，符合隐私法规：</p>

        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>数据最小化</strong>: 只收集必要的用户数据</li>
          <li><strong>匿名化处理</strong>: 对用户数据进行匿名化处理</li>
          <li><strong>用户同意</strong>: 明确告知数据用途，获取用户同意</li>
          <li><strong>数据删除</strong>: 提供用户删除个人数据的途径</li>
        </ul>
      </section>

      <section id="example" className="content-section">
        <SectionHeader number={6} title="实战示例：完整的内容审核流程" />
        <p className="paragraph">
          本节将所有审核和安全策略整合到一个完整的示例中。
        </p>

        <CodeBlock
          code={moderationServiceCode}
          language="java"
          filename="ModerationService.java"
        />
      </section>

      <section className="content-section">
        <div className="summary-card">
          <h3 className="text-2xl font-bold mb-4">本章小结</h3>
          <p className="mb-4">全面介绍了内容审核与安全策略。通过掌握这些技巧，您可以：</p>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li><strong>预防风险</strong>：通过预审核拦截潜在有害内容</li>
            <li><strong>保护用户</strong>：确保用户不会接触到违规内容</li>
            <li><strong>合规运营</strong>：满足法律和平台政策要求</li>
            <li><strong>降低成本</strong>：减少因违规内容导致的罚款和下架</li>
          </ul>
          <div className="border-t border-indigo-400 pt-6">
            <p className="text-sm opacity-80 mb-2">核心特性</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Tag variant="indigo">预审核</Tag>
              <Tag variant="purple">后审核</Tag>
              <Tag variant="blue">API集成</Tag>
              <Tag variant="green">数据加密</Tag>
              <Tag variant="orange">隐私保护</Tag>
            </div>
            <p className="text-sm opacity-80 mb-2">技术栈</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Tag variant="cyan">LangChain4j</Tag>
              <Tag variant="indigo">OpenAI Moderation API</Tag>
            </div>
            <a href="/troubleshooting" className="text-white hover:text-indigo-200 transition-colors">
              下一章：故障排查 →
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ModerationSafetyPage;
