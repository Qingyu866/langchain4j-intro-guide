import Layout from '../components/layout/Layout';
import { CodeBlockWithCopy, MermaidChart } from '../components/ui';

const basicAgentExample = `
package com.example.agent.basic;

import dev.langchain4j.agent.tool.Tool;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;

/**
 * 基础 Agent 示例
 * 展示如何创建具有工具调用能力的 AI Agent
 */
public class BasicAgentExample {

    // 定义工具：获取当前时间
    public static class TimeTools {

        @Tool("获取当前时间")
        public String getCurrentTime() {
            return java.time.LocalDateTime.now().toString();
        }

        @Tool("获取指定时区的当前时间")
        public String getTimeInZone(String timezone) {
            return java.time.ZonedDateTime.now(
                java.time.ZoneId.of(timezone)
            ).toString();
        }
    }

    public static void main(String[] args) {
        // 创建 ChatModel
        ChatLanguageModel model = OpenAiChatModel.builder()
                .apiKey("your-api-key")
                .modelName("gpt-4")
                .temperature(0.7)
                .build();

        // 构建 Agent
        Assistant assistant = AiServices.builder(Assistant.class)
                .chatLanguageModel(model)
                .tools(new TimeTools())  // 注册工具
                .build();

        // 使用 Agent
        String response = assistant.chat("现在几点了？");
        System.out.println(response);
    }

    // 定义 Agent 接口
    interface Assistant {
        String chat(@UserMessage String message);
    }
}
`.trim();

const multiToolAgentExample = `
package com.example.agent.multitool;

import dev.langchain4j.agent.tool.Tool;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import java.util.List;
import java.util.Map;

/**
 * 多工具 Agent 示例
 * Agent 可以使用多个工具完成复杂任务
 */
public class MultiToolAgentExample {

    // 工具集 1：计算工具
    public static class CalculatorTools {

        @Tool("计算两个数的和")
        public double add(double a, double b) {
            return a + b;
        }

        @Tool("计算两个数的乘积")
        public double multiply(double a, double b) {
            return a * b;
        }

        @Tool("计算数字列表的平均值")
        public double average(List<Double> numbers) {
            return numbers.stream()
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0.0);
        }
    }

    // 工具集 2：字符串工具
    public static class StringTools {

        @Tool("将字符串转换为大写")
        public String toUpperCase(String text) {
            return text.toUpperCase();
        }

        @Tool("统计字符串长度")
        public int stringLength(String text) {
            return text.length();
        }

        @Tool("反转字符串")
        public String reverseString(String text) {
            return new StringBuilder(text).reverse().toString();
        }
    }

    // 工具集 3：数据查询工具（模拟）
    public static class DatabaseTools {

        @Tool("查询用户信息")
        public String getUserInfo(String userId) {
            // 模拟数据库查询
            return Map.of(
                "id", userId,
                "name", "张三",
                "email", "zhangsan@example.com",
                "role", "admin"
            ).toString();
        }

        @Tool("查询订单状态")
        public String getOrderStatus(String orderId) {
            // 模拟订单查询
            return Map.of(
                "orderId", orderId,
                "status", "已发货",
                "amount", 299.99
            ).toString();
        }
    }

    public static void main(String[] args) {
        ChatLanguageModel model = OpenAiChatModel.builder()
                .apiKey("your-api-key")
                .modelName("gpt-4")
                .build();

        // 注册多个工具集
        MultiToolAssistant assistant = AiServices.builder(MultiToolAssistant.class)
                .chatLanguageModel(model)
                .tools(new CalculatorTools())
                .tools(new StringTools())
                .tools(new DatabaseTools())
                .build();

        // 复杂查询：需要多个工具协作
        String question = """
            请帮我：
            1. 计算 123 和 456 的和
            2. 将结果字符串反转
            3. 查询用户 user123 的信息
            """;

        String response = assistant.process(question);
        System.out.println(response);
    }

    interface MultiToolAssistant {
        String process(@UserMessage String query);
    }
}
`.trim();

const agentWithMemoryExample = `
package com.example.agent.memory;

import dev.langchain4j.agent.tool.Tool;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.MemoryId;
import dev.langchain4j.memory.ChatMemory;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.data.message.AiMessage;

/**
 * 带记忆的 Agent 示例
 * Agent 可以记住对话历史和用户特定信息
 */
public class AgentWithMemoryExample {

    public static class WeatherTools {

        @Tool("获取指定城市的天气")
        public String getWeather(String city) {
            // 模拟天气查询
            return Map.of(
                "city", city,
                "temperature", "25°C",
                "condition", "晴",
                "humidity", "60%"
            ).toString();
        }
    }

    public static void main(String[] args) {
        ChatLanguageModel model = OpenAiChatModel.builder()
                .apiKey("your-api-key")
                .modelName("gpt-4")
                .build();

        // 为每个用户/会话创建独立的记忆
        ChatMemory chatMemory = MessageWindowChatMemory.withMaxMessages(20);

        MemoryAssistant assistant = AiServices.builder(MemoryAssistant.class)
                .chatLanguageModel(model)
                .tools(new WeatherTools())
                .chatMemory(chatMemory)
                .build();

        String userId = "user_12345";

        // 第一轮对话
        String response1 = assistant.chat(
            userId,
            "我叫张三，住在北京"
        );
        System.out.println("助手: " + response1);

        // 第二轮：Agent 记住了用户信息
        String response2 = assistant.chat(
            userId,
            "我住的城市天气怎么样？"
        );
        System.out.println("助手: " + response2);

        // 第三轮：Agent 记得用户的名字
        String response3 = assistant.chat(
            userId,
            "我喜欢的天气类型是什么？"
        );
        System.out.println("助手: " + response3);
    }

    interface MemoryAssistant {
        String chat(
            @MemoryId String userId,
            @UserMessage String message
        );
    }
}
`.trim();

const agentChainExample = `
package com.example.agent.chain;

import dev.langchain4j.agent.tool.Tool;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Agent 链式调用示例
 * 多个 Agent 协作完成复杂任务
 */
public class AgentChainExample {

    // Agent 1: 数据收集 Agent
    public static class DataCollectorAgent {

        @Tool("搜索产品信息")
        public String searchProduct(String productName) {
            // 模拟产品搜索
            return Map.of(
                "name", productName,
                "price", 299.99,
                "rating", 4.5,
                "reviews", 1234,
                "stock", 50
            ).toString();
        }

        @Tool("获取竞品价格")
        public String getCompetitorPrice(String productName) {
            return Map.of(
                "competitor", "竞品A",
                "price", 279.99,
                "competitor", "竞品B",
                "price", 319.99
            ).toString();
        }
    }

    // Agent 2: 数据分析 Agent
    public static class DataAnalystAgent {

        @Tool("分析价格竞争力")
        public String analyzePriceCompetitiveness(double ourPrice, String competitorData) {
            // 价格分析逻辑
            return "我们的价格处于中等水平，有竞争力";
        }

        @Tool("评估产品评分")
        public String evaluateRating(double rating, int reviewCount) {
            if (rating >= 4.5 && reviewCount > 1000) {
                return "产品评分优秀，用户满意度高";
            } else if (rating >= 4.0) {
                return "产品评分良好";
            } else {
                return "产品评分需要改进";
            }
        }
    }

    // Agent 3: 决策 Agent
    public static class DecisionMakerAgent {

        @Tool("生成营销建议")
        public String generateMarketingAdvice(
            String priceAnalysis,
            String ratingEvaluation,
            String productInfo
        ) {
            return String.format("""
                基于分析结果，建议：
                1. %s
                2. %s
                3. 产品信息：%s

                营销策略：突出高评分优势，价格可以强调性价比
                """, priceAnalysis, ratingEvaluation, productInfo);
        }
    }

    public static void main(String[] args) {
        ChatLanguageModel model = OpenAiChatModel.builder()
                .apiKey("your-api-key")
                .modelName("gpt-4")
                .build();

        // 构建三个 Agent
        DataCollector collector = AiServices.builder(DataCollector.class)
                .chatLanguageModel(model)
                .tools(new DataCollectorAgent())
                .build();

        DataAnalyst analyst = AiServices.builder(DataAnalyst.class)
                .chatLanguageModel(model)
                .tools(new DataAnalystAgent())
                .build();

        DecisionMaker decisionMaker = AiServices.builder(DecisionMaker.class)
                .chatLanguageModel(model)
                .tools(new DecisionMakerAgent())
                .build();

        // 链式调用
        String productName = "智能手表 Pro";

        // 步骤 1: 数据收集
        String productData = collector.collect(productName);
        System.out.println("数据收集:\\n" + productData);

        // 步骤 2: 数据分析
        String analysis = analyst.analyze(productData);
        System.out.println("\\n数据分析:\\n" + analysis);

        // 步骤 3: 决策
        String decision = decisionMaker.makeDecision(analysis);
        System.out.println("\\n决策建议:\\n" + decision);
    }

    interface DataCollector {
        String collect(@UserMessage String productName);
    }

    interface DataAnalyst {
        String analyze(@UserMessage String data);
    }

    interface DecisionMaker {
        String makeDecision(@UserMessage String analysis);
    }
}
`.trim();

const agentRagExample = `
package com.example.agent.rag;

import dev.langchain4j.agent.tool.Tool;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.EmbeddingStoreIngestor;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.openai.OpenAiEmbeddingModel;
import java.util.List;

/**
 * RAG Agent 示例
 * 结合检索增强生成的知识型 Agent
 */
public class AgentRagExample {

    // 知识库查询工具
    public static class KnowledgeBaseTools {

        private final EmbeddingStore<TextSegment> vectorStore;
        private final EmbeddingModel embeddingModel;

        public KnowledgeBaseTools(
            EmbeddingStore<TextSegment> vectorStore,
            EmbeddingModel embeddingModel
        ) {
            this.vectorStore = vectorStore;
            this.embeddingModel = embeddingModel;
        }

        @Tool("从知识库中搜索相关文档")
        public String searchKnowledge(String query) {
            // 将查询转换为向量
            float[] queryVector = embeddingModel.embed(query).content().vector();

            // 检索相关文档
            List<TextSegment> relevantDocs = vectorStore.findRelevant(
                queryVector,
                3  // top-3
            );

            // 构建结果
            StringBuilder result = new StringBuilder();
            result.append("找到 ").append(relevantDocs.size()).append(" 篇相关文档:\\n\\n");

            for (int i = 0; i < relevantDocs.size(); i++) {
                TextSegment doc = relevantDocs.get(i);
                result.append("【文档").append(i + 1).append("】\\n");
                result.append(doc.text()).append("\\n\\n");
            }

            return result.toString();
        }

        @Tool("获取特定主题的详细文档")
        public String getDetailedDocumentation(String topic) {
            // 根据主题检索更详细的文档
            return searchKnowledge(topic + " 详细指南 教程");
        }
    }

    // 代码查询工具
    public static class CodeRepositoryTools {

        @Tool("搜索代码示例")
        public String searchCodeExample(String functionality) {
            // 模拟代码库搜索
            return String.format("""
                // %s 的代码示例

                public class Example {
                    public void demonstrate%s() {
                        // 实现代码
                        System.out.println("Demonstrating %s");
                    }
                }
                """, functionality, functionality, functionality);
        }
    }

    public static void main(String[] args) {
        ChatLanguageModel chatModel = OpenAiChatModel.builder()
                .apiKey("your-api-key")
                .modelName("gpt-4")
                .build();

        EmbeddingModel embeddingModel = OpenAiEmbeddingModel.builder()
                .apiKey("your-api-key")
                .build();

        EmbeddingStore<TextSegment> vectorStore = /* 初始化向量存储 */;

        // 构建 RAG Agent
        KnowledgeAssistant assistant = AiServices.builder(KnowledgeAssistant.class)
                .chatLanguageModel(chatModel)
                .tools(new KnowledgeBaseTools(vectorStore, embeddingModel))
                .tools(new CodeRepositoryTools())
                .build();

        // 查询示例
        String question = "如何使用 LangChain4j 实现 RAG？请提供代码示例";

        String answer = assistant.answer(question);
        System.out.println(answer);
    }

    interface KnowledgeAssistant {
        @SystemMessage("""
            你是一个技术专家助手，可以访问：
            1. 详细的技术文档知识库
            2. 代码示例库

            在回答问题时，请：
            - 首先从知识库检索相关文档
            - 结合多个来源的信息
            - 提供准确的代码示例
            - 标注信息来源
            """)
        String answer(@UserMessage String question);
    }
}
`.trim();

const agentOrchestrationExample = `
package com.example.agent.orchestration;

import dev.langchain4j.agent.tool.Tool;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import java.util.Map;
import java.util.HashMap;

/**
 * Agent 编排示例
 * 使用路由 Agent 动态调用专业 Agent
 */
public class AgentOrchestrationExample {

    // 路由 Agent：判断任务类型
    public static class RouterAgent {

        @Tool("分析任务类型")
        public String analyzeTaskType(String task) {
            // 任务分类逻辑
            if (task.contains("计算") || task.contains("数学")) {
                return "CALCULATION";
            } else if (task.contains("天气") || task.contains("温度")) {
                return "WEATHER";
            } else if (task.contains("搜索") || task.contains("查询")) {
                return "SEARCH";
            } else {
                return "GENERAL";
            }
        }
    }

    // 专业 Agent 1: 计算专家
    public static class CalculationExpert {

        @Tool("执行数学计算")
        public String calculate(String expression) {
            // 简化的计算器
            return "计算结果: " + expression;
        }
    }

    // 专业 Agent 2: 天气专家
    public static class WeatherExpert {

        @Tool("查询天气")
        public String getWeather(String city) {
            return city + "今天晴，温度 25°C";
        }
    }

    // 专业 Agent 3: 搜索专家
    public static class SearchExpert {

        @Tool("网络搜索")
        public String search(String keyword) {
            return "关于 '" + keyword + "' 的搜索结果...";
        }
    }

    // 编排器
    public static class AgentOrchestrator {

        private final ChatLanguageModel model;
        private final RouterAgent router;
        private final Map<String, Object> experts;

        public AgentOrchestrator(ChatLanguageModel model) {
            this.model = model;
            this.router = new RouterAgent();
            this.experts = new HashMap<>();

            // 注册专家 Agent
            experts.put("CALCULATION", new CalculationExpert());
            experts.put("WEATHER", new WeatherExpert());
            experts.put("SEARCH", new SearchExpert());
            experts.put("GENERAL", new GeneralExpert());
        }

        public String process(String task) {
            // 1. 路由：分析任务类型
            String taskType = router.analyzeTaskType(task);
            System.out.println("任务类型: " + taskType);

            // 2. 调用对应的专业 Agent
            Object expert = experts.get(taskType);

            // 3. 使用专业 Agent 处理
            ExpertAgent agent = AiServices.builder(ExpertAgent.class)
                    .chatLanguageModel(model)
                    .tools(expert)
                    .build();

            return agent.handle(task);
        }
    }

    public static void main(String[] args) {
        ChatLanguageModel model = OpenAiChatModel.builder()
                .apiKey("your-api-key")
                .modelName("gpt-4")
                .build();

        AgentOrchestrator orchestrator = new AgentOrchestrator(model);

        // 测试不同类型的任务
        String[] tasks = {
            "帮我计算 123 乘 456",
            "北京今天天气怎么样",
            "搜索 LangChain4j 的最新版本"
        };

        for (String task : tasks) {
            System.out.println("\\n任务: " + task);
            String result = orchestrator.process(task);
            System.out.println("结果: " + result);
            System.out.println("-".repeat(50));
        }
    }

    interface ExpertAgent {
        String handle(@UserMessage String task);
    }

    static class GeneralExpert {
        @Tool("通用对话")
        public String chat(String message) {
            return "我理解了你的问题：" + message;
        }
    }
}
`.trim();

const AgentDeepDivePage = () => {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Agent 深度解析</h1>
          <p className="text-xl text-gray-600">
            从基础到高级：构建强大的 AI Agent 应用
          </p>
        </div>

        {/* 导航 */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
          <nav className="space-y-1">
            <a href="#overview" className="block text-blue-700 hover:text-blue-900">概述</a>
            <a href="#basic-agent" className="block text-blue-700 hover:text-blue-900">基础 Agent</a>
            <a href="#multi-tool" className="block text-blue-700 hover:text-blue-900">多工具 Agent</a>
            <a href="#agent-memory" className="block text-blue-700 hover:text-blue-900">带记忆的 Agent</a>
            <a href="#agent-chain" className="block text-blue-700 hover:text-blue-900">Agent 链</a>
            <a href="#rag-agent" className="block text-blue-700 hover:text-blue-900">RAG Agent</a>
            <a href="#orchestration" className="block text-blue-700 hover:text-blue-900">Agent 编排</a>
            <a href="#best-practices" className="block text-blue-700 hover:text-blue-900">最佳实践</a>
          </nav>
        </div>

        {/* 概述 */}
        <section id="overview" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">什么是 Agent？</h2>

          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">核心概念</h3>
            <div className="prose max-w-none text-gray-700 space-y-4">
              <p>
                <strong>AI Agent</strong> 是能够自主感知环境、做出决策并执行行动以实现目标的智能系统。
                LangChain4j 通过 <code className="bg-gray-100 px-2 py-1 rounded">@Tool</code> 注解和
                <code className="bg-gray-100 px-2 py-1 rounded">AiServices</code> 构建强大的 Agent 应用。
              </p>

              <h4 className="font-semibold text-gray-900 mt-6 mb-3">Agent 的核心能力</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>工具调用（Function Calling）：</strong>根据任务需求选择并调用合适的工具</li>
                <li><strong>推理决策：</strong>分析问题、拆解任务、制定执行计划</li>
                <li><strong>记忆管理：</strong>记住对话历史和用户特定信息</li>
                <li><strong>多轮交互：</strong>支持复杂的对话式交互</li>
                <li><strong>自主协作：</strong>多个 Agent 协作完成复杂任务</li>
              </ul>

              <h4 className="font-semibold text-gray-900 mt-6 mb-3">典型应用场景</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>智能客服：自动回答客户问题，处理查询</li>
                <li>代码助手：理解需求、生成代码、调试优化</li>
                <li>数据分析：查询数据、生成报表、提供洞察</li>
                <li>工作流自动化：审批、调度、通知等</li>
                <li>研究助手：检索文献、整理信息、撰写报告</li>
              </ul>
            </div>
          </div>

          {/* Agent 架构图 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Agent 架构</h3>
            <MermaidChart chart={`
graph TB
    A[用户输入] --> B[LLM 推理引擎]
    B --> C{需要工具?}
    C -->|是| D[工具选择]
    D --> E[工具执行]
    E --> F[结果返回]
    F --> B
    C -->|否| G[直接响应]
    B --> G
    G --> H[输出给用户]

    B -.->|访问| I[记忆系统]
    I --> B

    style A fill:#e3f2fd
    style H fill:#4caf50
    style I fill:#fff3e0
            `} />
          </div>
        </section>

        {/* 基础 Agent */}
        <section id="basic-agent" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">基础 Agent</h2>

          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">创建第一个 Agent</h3>
            <div className="prose max-w-none text-gray-700 mb-4">
              <p>
                通过 <code className="bg-gray-100 px-2 py-1 rounded">@Tool</code> 注解定义工具，
                <code className="bg-gray-100 px-2 py-1 rounded">AiServices</code> 构建 Agent。
              </p>
            </div>
            <CodeBlockWithCopy
              language="java"
              code={basicAgentExample}
            />

            <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500">
              <h4 className="font-semibold text-green-900 mb-2">关键点说明</h4>
              <ul className="list-disc pl-5 text-green-800 space-y-1">
                <li><strong>@Tool：</strong>标注工具方法，参数描述会被 LLM 理解</li>
                <li><strong>AiServices.builder：</strong>流式构建 Agent</li>
                <li><strong>.tools()：</strong>注册工具实例</li>
                <li><strong>接口定义：</strong>声明式定义 Agent 行为</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 多工具 Agent */}
        <section id="multi-tool" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">多工具 Agent</h2>

          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">注册多个工具集</h3>
            <div className="prose max-w-none text-gray-700 mb-4">
              <p>
                Agent 可以同时使用多个工具集，根据任务需求智能选择合适的工具。
              </p>
            </div>
            <CodeBlockWithCopy
              language="java"
              code={multiToolAgentExample}
            />
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <h4 className="font-semibold text-blue-900 mb-2">工具设计建议</h4>
            <ul className="list-disc pl-5 text-blue-800 space-y-1">
              <li><strong>单一职责：</strong>每个工具只做一件事，命名清晰</li>
              <li><strong>详细描述：</strong>@Tool 的描述要准确说明功能</li>
              <li><strong>类型明确：</strong>参数和返回值类型要明确</li>
              <li><strong>错误处理：</strong>工具内部要有异常处理</li>
              <li><strong>分组管理：</strong>相关工具放在同一个类中</li>
            </ul>
          </div>
        </section>

        {/* 带记忆的 Agent */}
        <section id="agent-memory" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">带记忆的 Agent</h2>

          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">ChatMemory 集成</h3>
            <div className="prose max-w-none text-gray-700 mb-4">
              <p>
                通过 <code className="bg-gray-100 px-2 py-1 rounded">ChatMemory</code> 和
                <code className="bg-gray-100 px-2 py-1 rounded">@MemoryId</code> 为每个用户/会话维护独立的对话历史。
              </p>
            </div>
            <CodeBlockWithCopy
              language="java"
              code={agentWithMemoryExample}
            />
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">记忆类型对比</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">特点</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">适用场景</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">MessageWindowChatMemory</td>
                    <td className="px-6 py-4 text-sm text-gray-500">保留最近 N 条消息</td>
                    <td className="px-6 py-4 text-sm text-gray-500">短对话、有限上下文</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">TokenWindowChatMemory</td>
                    <td className="px-6 py-4 text-sm text-gray-500">限制 Token 总数</td>
                    <td className="px-6 py-4 text-sm text-gray-500">长对话、成本控制</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">ChatMemoryVectorizer</td>
                    <td className="px-6 py-4 text-sm text-gray-500">向量检索历史</td>
                    <td className="px-6 py-4 text-sm text-gray-500">长历史、语义检索</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Agent 链 */}
        <section id="agent-chain" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Agent 链式调用</h2>

          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">多个 Agent 协作</h3>
            <div className="prose max-w-none text-gray-700 mb-4">
              <p>
                将复杂任务拆分为多个阶段，每个阶段由专门的 Agent 处理，前一个 Agent 的输出作为下一个 Agent 的输入。
              </p>
            </div>
            <CodeBlockWithCopy
              language="java"
              code={agentChainExample}
            />
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Agent 链工作流程</h3>
            <MermaidChart chart={`
graph LR
    A[原始任务] --> B[数据收集 Agent]
    B --> C[数据]
    C --> D[数据分析 Agent]
    D --> E[分析结果]
    E --> F[决策 Agent]
    F --> G[最终方案]

    style A fill:#e3f2fd
    style G fill:#4caf50
            `} />

            <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-500">
              <h4 className="font-semibold text-yellow-900 mb-2">链式调用模式</h4>
              <ul className="list-disc pl-5 text-yellow-800 space-y-1">
                <li><strong>顺序链：</strong>Agent 按顺序执行，上一步输出作为下一步输入</li>
                <li><strong>并行链：</strong>多个 Agent 同时工作，最后汇总结果</li>
                <li><strong>条件链：</strong>根据中间结果动态选择下一个 Agent</li>
                <li><strong>循环链：</strong>Agent 循环执行直到满足条件</li>
              </ul>
            </div>
          </div>
        </section>

        {/* RAG Agent */}
        <section id="rag-agent" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">RAG Agent</h2>

          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">知识增强的 Agent</h3>
            <div className="prose max-w-none text-gray-700 mb-4">
              <p>
                结合向量数据库和工具调用，构建可以检索私有知识的 Agent。
              </p>
            </div>
            <CodeBlockWithCopy
              language="java"
              code={agentRagExample}
            />
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">RAG Agent 架构</h3>
            <MermaidChart chart={`
graph TB
    A[用户查询] --> B[Agent]
    B --> C{需要信息?}
    C -->|是| D[向量检索]
    D --> E[相关文档]
    E --> F[LLM 生成]
    F --> G[答案]
    C -->|否| F
    G --> H[返回用户]

    style A fill:#e3f2fd
    style H fill:#4caf50
            `} />
          </div>
        </section>

        {/* Agent 编排 */}
        <section id="orchestration" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Agent 编排</h2>

          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">动态路由 Agent</h3>
            <div className="prose max-w-none text-gray-700 mb-4">
              <p>
                使用路由 Agent 分析任务类型，动态调用专业 Agent 处理。
              </p>
            </div>
            <CodeBlockWithCopy
              language="java"
              code={agentOrchestrationExample}
            />
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
            <h4 className="font-semibold text-purple-900 mb-2">编排模式</h4>
            <ul className="list-disc pl-5 text-purple-800 space-y-1">
              <li><strong>路由模式：</strong>一个中心 Agent 负责分发任务</li>
              <li><strong>层级模式：</strong>Agent 有明确的上下级关系</li>
              <li><strong>网状模式：</strong>Agent 之间可以相互通信协作</li>
              <li><strong>委员会模式：</strong>多个 Agent 共同决策，投票或讨论</li>
            </ul>
          </div>
        </section>

        {/* 最佳实践 */}
        <section id="best-practices" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">最佳实践</h2>

          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">1. 工具设计原则</h3>
              <CodeBlockWithCopy
                language="java"
                code={`// 好的工具设计
public static class WellDesignedTools {

    // ✅ 单一职责，命名清晰
    @Tool("计算两个日期之间的天数")
    public long daysBetween(LocalDate start, LocalDate end) {
        return ChronoUnit.DAYS.between(start, end);
    }

    // ✅ 参数类型明确
    @Tool("发送邮件给指定用户")
    public String sendEmail(
        String recipientEmail,  // 邮箱地址
        String subject,         // 邮件主题
        String body            // 邮件正文
    ) {
        // 实现发送逻辑
        return "邮件已发送";
    }

    // ❌ 避免：职责不清晰
    @Tool("处理数据")
    public Object process(Object data) {
        // 太模糊，LLM 不知道如何使用
        return null;
    }
}`}
              />
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">2. 错误处理与重试</h3>
              <CodeBlockWithCopy
                language="java"
                code={`public static class RobustTools {

    private static final int MAX_RETRIES = 3;

    @Tool("调用外部 API")
    public String callExternalApi(String endpoint) {
        int attempts = 0;
        Exception lastException = null;

        while (attempts < MAX_RETRIES) {
            try {
                // 尝试调用
                return httpClient.get(endpoint);
            } catch (Exception e) {
                lastException = e;
                attempts++;
                if (attempts < MAX_RETRIES) {
                    // 等待后重试
                    Thread.sleep(1000 * attempts);
                }
            }
        }

        // 所有重试都失败
        throw new RuntimeException(
            "API 调用失败，已重试 " + MAX_RETRIES + " 次",
            lastException
        );
    }
}`}
              />
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">3. 性能优化</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">工具缓存</h4>
                  <p className="text-sm text-blue-800">
                    对相同参数的工具调用结果进行缓存，避免重复执行
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">并行执行</h4>
                  <p className="text-sm text-green-800">
                    独立工具调用可以并行执行，提升响应速度
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">批量处理</h4>
                  <p className="text-sm text-purple-800">
                    设计支持批量操作的工具，减少调用次数
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">超时控制</h4>
                  <p className="text-sm text-orange-800">
                    为工具调用设置超时，防止长时间阻塞
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">4. 安全考虑</h3>
              <CodeBlockWithCopy
                language="java"
                code={`public static class SecureTools {

    @Tool("删除文件")
    public String deleteFile(String filePath) {
        // ✅ 参数验证
        if (filePath == null || filePath.trim().isEmpty()) {
            throw new IllegalArgumentException("文件路径不能为空");
        }

        // ✅ 路径安全检查
        Path path = Paths.get(filePath).normalize();
        if (path.startsWith("/etc/") || path.startsWith("C:\\\\Windows\\\\")) {
            throw new SecurityException("不允许删除系统文件");
        }

        // ✅ 权限检查
        if (!hasPermission(path)) {
            throw new SecurityException("没有权限删除此文件");
        }

        // ✅ 操作审计
        auditLog("DELETE_FILE", path.toString());

        Files.deleteIfExists(path);
        return "文件已删除: " + path;
    }

    @Tool("执行系统命令")
    public String executeCommand(String command) {
        // ❌ 危险：避免直接执行命令
        // Runtime.getRuntime().exec(command);

        // ✅ 安全：使用白名单
        List<String> allowedCommands = List.of("ls", "pwd", "whoami");
        String[] parts = command.split(" ");
        if (!allowedCommands.contains(parts[0])) {
            throw new SecurityException("命令不被允许: " + parts[0]);
        }

        // 执行逻辑...
        return "命令执行结果";
    }
}`}
              />
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <h4 className="font-semibold text-red-900 mb-2">常见陷阱</h4>
              <ul className="list-disc pl-5 text-red-800 space-y-1">
                <li><strong>工具过多：</strong>注册太多工具会增加 LLM 决策难度，建议 &lt;20 个</li>
                <li><strong>依赖循环：</strong>工具之间避免循环依赖</li>
                <li><strong>状态管理：</strong>工具应该是无状态的，状态通过记忆管理</li>
                <li><strong>错误吞没：</strong>工具错误应该明确抛出，而不是返回 null</li>
                <li><strong>过度设计：</strong>不是所有任务都需要 Agent，简单场景直接调用 LLM</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 总结 */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">总结</h2>
            <div className="space-y-3">
              <p>
                Agent 是 LangChain4j 的核心高级特性，通过 <code className="bg-white/20 px-2 py-1 rounded">@Tool</code> 和
                <code className="bg-white/20 px-2 py-1 rounded">AiServices</code> 构建强大的 AI 应用。
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>基础：使用 @Tool 注解定义工具，AiServices 构建 Agent</li>
                <li>多工具：注册多个工具集，Agent 智能选择</li>
                <li>记忆：通过 ChatMemory 和 @MemoryId 管理对话历史</li>
                <li>链式调用：多个 Agent 协作完成复杂任务</li>
                <li>RAG 增强：结合向量检索，访问私有知识</li>
                <li>动态编排：路由 Agent 动态分发任务到专业 Agent</li>
                <li>注意工具设计、错误处理、性能优化和安全考虑</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default AgentDeepDivePage;
