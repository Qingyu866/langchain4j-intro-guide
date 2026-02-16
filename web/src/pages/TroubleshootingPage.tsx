import Layout from '../components/layout/Layout';
import { Tag, SectionHeader, CodeBlock, TipBox, MermaidChart } from '../components/ui';

const debugLoggingCode = `package com.example.langchain4j.debug;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DebugLogging {

    private static final Logger logger = LoggerFactory.getLogger(DebugLogging.class);

    public static void enableDebugLogging() {
        System.setProperty("dev.langchain4j.logging.level", "DEBUG");
        logger.info("调试日志已启用");
    }

    public static void logRequestDetails(String prompt, String modelName) {
        logger.debug("请求详情 - Prompt: {}, Model: {}", prompt, modelName);
    }
}`;

const troubleshootingWorkflowCode = `package com.example.langchain4j.troubleshooting;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.data.message.UserMessage;

public class TroubleshootingWorkflow {

    public static void troubleshoot(ChatLanguageModel model, String problem) {
        
        // 步骤 1: 识别问题现象
        String symptom = identifySymptom(problem);
        System.out.println("[步骤1] 问题现象: " + symptom);
        
        // 步骤 2: 诊断过程
        String diagnosis = diagnoseProblem(symptom, model);
        System.out.println("[步骤2] 诊断结果: " + diagnosis);
        
        // 步骤 3: 分析根因
        String rootCause = analyzeRootCause(diagnosis);
        System.out.println("[步骤3] 根本原因: " + rootCause);
        
        // 步骤 4: 提出解决方案
        String solution = proposeSolution(rootCause);
        System.out.println("[步骤4] 解决方案: " + solution);
        
        // 步骤 5: 预防措施
        String prevention = definePrevention(rootCause);
        System.out.println("[步骤5] 预防措施: " + prevention);
    }

    private static String identifySymptom(String problem) {
        return "响应时间超过 30 秒";
    }

    private static String diagnoseProblem(String symptom, ChatLanguageModel model) {
        return "网络延迟高或超时设置过短";
    }

    private static String analyzeRootCause(String diagnosis) {
        return "超时配置不合理或网络不稳定";
    }

    private static String proposeSolution(String rootCause) {
        return "增加超时时间至 60 秒，添加重试机制";
    }

    private static String definePrevention(String rootCause) {
        return "监控响应时间，设置合理的超时阈值";
    }
}`;

const TroubleshootingPage = () => {
  return (
    <Layout>
      <div className="page-tags">
        <Tag variant="indigo">故障排查</Tag>
        <Tag variant="orange">问题诊断</Tag>
        <Tag variant="red">调试技巧</Tag>
      </div>

      <h1 className="page-title">故障排查</h1>
      <p className="page-description">
        常见问题诊断与调试指南，快速定位和解决问题。
      </p>

      <nav className="toc-nav">
        <h3 className="toc-title">目录</h3>
        <ol className="toc-list">
          <li className="toc-item"><span className="toc-number">1.</span> <a href="#diagnosis" className="toc-link">常见问题诊断</a></li>
          <li className="toc-item"><span className="toc-number">2.</span> <a href="#debug" className="toc-link">调试技巧</a></li>
          <li className="toc-item"><span className="toc-number">3.</span> <a href="#performance" className="toc-link">性能问题排查</a></li>
          <li className="toc-item"><span className="toc-number">4.</span> <a href="#error-handling" className="toc-link">错误处理排查</a></li>
          <li className="toc-item"><span className="toc-number">5.</span> <a href="#config" className="toc-link">配置问题排查</a></li>
          <li className="toc-item"><span className="toc-number">6.</span> <a href="#example" className="toc-link">实战案例</a></li>
        </ol>
      </nav>

      <section id="diagnosis" className="content-section">
        <SectionHeader number={1} title="常见问题诊断" />
        <p className="paragraph">
          本节介绍 LangChain4j 应用中常见的各种问题及其诊断方法。
        </p>

        <h3 className="subsection-title">1.1 网络连接问题</h3>
        <p className="text-gray-700 mb-4">网络连接失败是常见问题，可能的原因和解决方案：</p>

        <div className="grid-2col">
          <div className="card card-blue">
            <h4 className="font-semibold text-blue-800 mb-2">问题现象</h4>
            <p className="text-blue-700 text-sm">连接超时、DNS 解析失败、HTTP 错误</p>
          </div>
          <div className="card card-green">
            <h4 className="font-semibold text-green-800 mb-2">可能原因</h4>
            <ul className="text-green-700 text-sm space-y-1">
              <li> 网络配置错误（代理、防火墙）</li>
              <li> API 服务端不可用</li>
              <li> 超时设置过短</li>
            </ul>
          </div>
        </div>

        <h3 className="subsection-title">1.2 认证失败问题</h3>
        <p className="text-gray-700 mb-4">API Key 认证失败的常见原因：</p>

        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>API Key 无效</strong>: 检查 API Key 是否正确复制</li>
          <li><strong>API Key 过期</strong>: 重新生成或更新 API Key</li>
          <li><strong>权限不足</strong>: 检查 API Key 的访问权限</li>
          <li><strong>配额超限</strong>: 检查账户余额和使用量</li>
        </ul>

        <h3 className="subsection-title">1.3 性能问题</h3>
        <p className="text-gray-700 mb-4">响应慢、内存占用高是性能问题的典型表现：</p>

        <div className="grid-2col">
          <div className="card card-yellow">
            <h4 className="font-semibold text-yellow-800 mb-2">响应慢</h4>
            <p className="text-yellow-700 text-sm">单次请求超过 10 秒</p>
          </div>
          <div className="card card-orange">
            <h4 className="font-semibold text-orange-800 mb-2">内存占用高</h4>
            <p className="text-orange-700 text-sm">JVM 内存占用超过 80%</p>
          </div>
        </div>
      </section>

      <section id="debug" className="content-section">
        <SectionHeader number={2} title="调试技巧" />
        <p className="paragraph">
          使用以下调试技巧快速定位问题：
        </p>

        <h3 className="subsection-title">2.1 故障排查流程</h3>
        <p className="text-gray-700 mb-4">系统化的故障排查五步法：</p>

        <MermaidChart chart={`
          graph TD
              A[❓ 问题现象] --> B[🔍 诊断过程]
              B --> C[🔬 分析根因]
              C --> D[💡 解决方案]
              D --> E[🛡️ 预防措施]

              style A fill:#fef2f2
              style B fill:#fef3c7
              style C fill:#e0f2fe
              style D fill:#f0fdf4
              style E fill:#e8f5e9
        `} />

        <h3 className="subsection-title">2.1 启用调试日志</h3>
        <p className="text-gray-700 mb-4">启用详细的调试日志输出，查看请求和响应详情：</p>

        <CodeBlock
          code={debugLoggingCode}
          language="java"
          filename="DebugLogging.java"
        />

        <h3 className="subsection-title">2.2 断点调试</h3>
        <p className="text-gray-700 mb-4">使用 IDE 的断点调试功能，逐步跟踪代码执行：</p>

        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>关键位置设置断点</strong>: 在 API 调用前后设置断点</li>
          <li><strong>查看变量值</strong>: 检查请求参数和响应内容</li>
          <li><strong>条件断点</strong>: 只在特定条件下暂停</li>
          <li><strong>表达式求值</strong>: 动态计算表达式值</li>
        </ul>

        <h3 className="subsection-title">2.3 请求响应日志</h3>
        <p className="text-gray-700 mb-4">记录完整的请求和响应内容：</p>

        <TipBox variant="info" title="调试建议">
          <ul className="list-styled">
            <li>启用详细日志记录</li>
            <li>使用断点调试</li>
            <li>检查请求和响应内容</li>
            <li>逐步简化问题场景</li>
          </ul>
        </TipBox>
      </section>

      <section id="performance" className="content-section">
        <SectionHeader number={3} title="性能问题排查" />
        <p className="paragraph">
          使用以下方法排查和解决性能问题：
        </p>

        <h3 className="subsection-title">3.1 响应时间分析</h3>
        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>监控 P95/P99 响应时间</strong>: 使用 APM 工具监控</li>
          <li><strong>分析慢请求</strong>: 记录响应时间超过阈值的请求</li>
          <li><strong>优化超时配置</strong>: 根据实际响应时间调整超时设置</li>
        </ul>

        <h3 className="subsection-title">3.2 连接池配置</h3>
        <p className="text-gray-700 mb-4">优化 HTTP 连接池配置提升性能：</p>

        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>最大连接数</strong>: 设置合理的最大连接数（通常 20-50）</li>
          <li><strong>连接超时</strong>: 设置合理的连接超时（通常 5-10 秒）</li>
          <li><strong>空闲连接回收</strong>: 及时回收空闲连接</li>
        </ul>

        <h3 className="subsection-title">3.3 内存优化</h3>
        <p className="text-gray-700 mb-4">优化内存使用，避免内存泄漏：</p>

        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>减少批处理大小</strong>: 降低单次处理的数据量</li>
          <li><strong>优化文档切分</strong>: 使用更小的文档片段</li>
          <li><strong>增加 JVM 内存</strong>: 调整 -Xmx 参数</li>
          <li><strong>使用流式处理</strong>: 避免一次性加载大量数据</li>
        </ul>
      </section>

      <section id="error-handling" className="content-section">
        <SectionHeader number={4} title="错误处理排查" />
        <p className="paragraph">
          系统地排查和处理错误：
        </p>

        <h3 className="subsection-title">4.1 异常堆栈分析</h3>
        <p className="text-gray-700 mb-4">通过分析异常堆栈定位问题根源：</p>

        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>查看顶层异常</strong>: 关注最外层的异常类型</li>
          <li><strong>查看异常原因</strong>: 检查 cause 属性获取根本原因</li>
          <li><strong>定位异常位置</strong>: 查看堆栈中的类名和方法名</li>
        </ul>

        <h3 className="subsection-title">4.2 日志聚合工具</h3>
        <p className="text-gray-700 mb-4">使用专业的日志聚合工具分析错误：</p>

        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>ELK Stack</strong>: Elasticsearch + Logstash + Kibana</li>
          <li><strong>Splunk</strong>: 企业级日志分析平台</li>
          <li><strong>Grafana</strong>: 配合 Prometheus 进行可视化监控</li>
        </ul>
      </section>

      <section id="config" className="content-section">
        <SectionHeader number={5} title="配置问题排查" />
        <p className="paragraph">
          排查和优化各种配置问题：
        </p>

        <h3 className="subsection-title">5.1 API Key 配置</h3>
        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>环境变量</strong>: 使用环境变量存储 API Key，避免硬编码</li>
          <li><strong>配置验证</strong>: 启动时验证 API Key 有效性</li>
          <li><strong>密钥轮换</strong>: 定期轮换 API Key 提升安全性</li>
        </ul>

        <h3 className="subsection-title">5.2 超时设置</h3>
        <p className="text-gray-700 mb-4">合理配置超时参数平衡响应速度和稳定性：</p>

        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li><strong>连接超时</strong>: 5-10 秒（网络不稳定时适当延长）</li>
          <li><strong>读取超时</strong>: 根据模型复杂度调整（GPT-4: 60 秒，GPT-3.5: 30 秒）</li>
          <li><strong>重试超时</strong>: 考虑重试总时长（超时次数 × 单次超时）</li>
        </ul>
      </section>

      <section id="example" className="content-section">
        <SectionHeader number={6} title="实战案例：完整的故障排查流程" />
        <p className="paragraph">
          本节通过完整的实战案例，演示故障排查的完整流程。
        </p>

        <CodeBlock
          code={troubleshootingWorkflowCode}
          language="java"
          filename="TroubleshootingWorkflow.java"
        />

        <TipBox variant="success" title="故障排查 5 步法">
          <ul className="list-styled">
            <li><strong>步骤 1</strong>: 识别问题现象 - 明确问题的具体表现</li>
            <li><strong>步骤 2</strong>: 诊断过程 - 收集相关信息进行分析</li>
            <li><strong>步骤 3</strong>: 分析根因 - 找出问题的根本原因</li>
            <li><strong>步骤 4</strong>: 提出解决方案 - 制定具体的修复方案</li>
            <li><strong>步骤 5</strong>: 预防措施 - 防止问题再次发生</li>
          </ul>
        </TipBox>
      </section>

      <section className="content-section">
        <div className="summary-card">
          <h3 className="text-2xl font-bold mb-4">本章小结</h3>
          <p className="mb-4">全面介绍了故障排查的方法和技巧。通过掌握这些技能，您可以：</p>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li><strong>快速定位</strong>：系统地定位问题根源，避免盲目试错</li>
            <li><strong>高效调试</strong>：使用调试工具和日志快速发现问题</li>
            <li><strong>优化性能</strong>：识别性能瓶颈，提升应用响应速度</li>
            <li><strong>预防问题</strong>：通过监控和日志预防潜在问题</li>
          </ul>
          <div className="border-t border-indigo-400 pt-6">
            <p className="text-sm opacity-80 mb-2">核心特性</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Tag variant="indigo">问题诊断</Tag>
              <Tag variant="purple">调试技巧</Tag>
              <Tag variant="blue">性能分析</Tag>
              <Tag variant="green">日志聚合</Tag>
              <Tag variant="orange">配置优化</Tag>
            </div>
            <p className="text-sm opacity-80 mb-2">技术栈</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Tag variant="cyan">LangChain4j</Tag>
              <Tag variant="indigo">SLF4J</Tag>
              <Tag variant="purple">ELK</Tag>
              <Tag variant="blue">APM</Tag>
            </div>
            <a href="/interview-prep" className="text-white hover:text-indigo-200 transition-colors">
              下一章：面试准备 →
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TroubleshootingPage;
