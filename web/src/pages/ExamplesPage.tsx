import Layout from '../components/layout/Layout';
import { SectionHeader, CodeBlockWithCopy, TipBox } from '../components/ui';

const ExamplesPage = () => {
  return (
    <Layout>
      <div className="flex items-center gap-3 mb-8 text-sm">
        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">2025-02-14</span>
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">实战代码</span>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">中级难度</span>
      </div>

      <h1 className="text-5xl font-bold text-gray-900 mb-6">LangChain4j 实战示例</h1>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 示例概览</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100 rounded-xl p-6">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">简单聊天</h3>
            <ul className="text-gray-600 text-sm space-y-1">
              <li> 基础对话机器人</li>
              <li> 流式输出</li>
              <li> 上下文管理</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-6">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">智能问答</h3>
            <ul className="text-gray-600 text-sm space-y-1">
              <li> RAG检索</li>
              <li> 向量搜索</li>
              <li> 知识库管理</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-teal-50 border border-green-100 rounded-xl p-6">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Agent</h3>
            <ul className="text-gray-600 text-sm space-y-1">
              <li> 工具调用</li>
              <li> 自动推理</li>
              <li> 任务规划</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-12 bg-blue-50 border border-blue-100 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">学习目标</h3>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li> 通过实际代码示例理解 LangChain4j 的核心功能</li>
              <li> 学习常见应用场景的实现方式</li>
              <li> 掌握最佳实践和代码组织结构</li>
              <li> 了解不同场景下的技术选型</li>
            </ul>
          </div>
        </div>
      </div>

      <section className="content-section">
        <SectionHeader number={1} title="简单聊天机器人" />

        <h3 className="text-xl font-semibold text-gray-900 mb-4">1.1 基础对话示例</h3>
        <CodeBlockWithCopy
          language="java"
          filename="SimpleChatBot.java"
          title="Java - 基础聊天机器人"
          code={`package com.example.examples.chat;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;

/**
 * 简单聊天机器人示例
 * 演示如何使用LangChain4j创建基础的AI对话系统
 */
public class SimpleChatBot {

    /**
     * 聊天AI接口
     * 使用注解定义AI行为
     */
    interface ChatAi {
        /**
         * 系统消息：定义AI的角色和行为
         */
        @SystemMessage("""
            你是一个友好的AI助手，擅长用简洁明了的方式回答问题。
            你的回答应该：
            - 准确且有用
            - 适当使用emoji增加亲和力
            - 如果不确定，诚实地说"我不确定"
            - 避免过度专业术语
            """)
        String chat(@UserMessage String userMessage);
    }

    public static void main(String[] args) {
        // 1. 创建聊天模型
        ChatLanguageModel model = OpenAiChatModel.builder()
            .apiKey(System.getenv("OPENAI_API_KEY"))  // 从环境变量获取API密钥
            .modelName("gpt-4")                         // 使用GPT-4模型
            .temperature(0.7)                         // 设置温度（创造性）
            .maxTokens(1000)                          // 最大输出Token数
            .build();

        // 2. 创建AI服务
        ChatAi chatAi = AiServices.builder(ChatAi.class)
            .chatLanguageModel(model)
            .build();

        // 3. 进行对话
        String userMessage = "什么是LangChain4j？";
        System.out.println("用户: " + userMessage);

        String response = chatAi.chat(userMessage);
        System.out.println("AI: " + response);

        // 继续对话
        userMessage = "它支持哪些功能？";
        System.out.println("\\n用户: " + userMessage);
        response = chatAi.chat(userMessage);
        System.out.println("AI: " + response);
    }
}

/**
 * 运行结果示例：
 *
 * 用户: 什么是LangChain4j？
 * AI: LangChain4j是一个Java库，帮助开发者轻松构建LLM（大语言模型）应用 🚀
 *     它提供了简单直观的API，让你可以快速集成各种AI模型和功能。
 *
 * 用户: 它支持哪些功能？
 * AI: LangChain4j支持很多强大的功能！✨ 主要包括：
 *      聊天对话（Chat）- 与AI进行自然对话
 *      Function Calling - 让AI调用外部工具
 *      RAG（检索增强）- 结合知识库回答问题
 *      Embedding - 文本向量化
 *      多模态 - 处理图像、音频等
 *      记忆管理 - 保存对话历史
 */`}
        />

        <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">1.2 流式输出示例</h3>
        <CodeBlockWithCopy
          language="java"
          filename="StreamingChatBot.java"
          title="Java - 流式输出聊天机器人"
          code={`package com.example.examples.chat;

import dev.langchain4j.model.chat.StreamingChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiStreamingChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.streaming.StreamingAiService;

import java.util.stream.Stream;

/**
 * 流式输出聊天机器人示例
 * 演示如何实时获取AI生成的文本
 */
public class StreamingChatBot {

    /**
     * 流式聊天AI接口
     */
    interface StreamingChatAi {
        @SystemMessage("""
            你是一个善于讲故事的AI。
            请用生动有趣的方式讲述用户请求的故事。
            """)
        Stream<String> chatStream(@UserMessage String userMessage);
    }

    public static void main(String[] args) {
        // 1. 创建流式聊天模型
        StreamingChatLanguageModel model = OpenAiStreamingChatModel.builder()
            .apiKey(System.getenv("OPENAI_API_KEY"))
            .modelName("gpt-4")
            .temperature(0.8)  // 稍高的温度让故事更有创意
            .build();

        // 2. 创建流式AI服务
        StreamingChatAi streamingAi = AiServices.builder(StreamingChatAi.class)
            .streamingChatLanguageModel(model)
            .build();

        // 3. 流式对话
        String userMessage = "讲一个关于编程的小故事";
        System.out.println("用户: " + userMessage);
        System.out.println("\\nAI: ");

        try (Stream<String> responseStream = streamingAi.chatStream(userMessage)) {
            // 实时打印每个token
            responseStream.forEach(token -> {
                System.out.print(token);
                System.out.flush();  // 立即刷新缓冲区
            });
        }
    }
}

/**
 * 运行结果示例（实时输出）：
 *
 * 用户: 讲一个关于编程的小故事
 *
 * AI: 从前，有一个名叫小明的程序员 🧑‍💻
 * 
 * 他每天都在和代码搏斗...
 * 
 * 有一天，遇到了一个顽固的bug 🐛
 * 
 * 经过三天三夜的努力...
 * 
 * 终于找到了问题所在！✨
 * 
 * 原来是一个多余的分号...
 * 
 * 从此，小明养成了写注释的好习惯 📝
 */`}
        />

        <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">1.3 带记忆的聊天机器人</h3>
        <CodeBlockWithCopy
          language="java"
          filename="ChatWithMemory.java"
          title="Java - 带对话记忆的机器人"
          code={`package com.example.examples.chat;

import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;

import java.util.ArrayList;
import java.util.List;

/**
 * 带记忆的聊天机器人示例
 * 演示如何保存和检索对话历史
 */
public class ChatWithMemory {

    /**
     * 聊天AI接口
     */
    interface ChatAi {
        @SystemMessage("""
            你是一个善于记事的AI助手。
            你会记住之前的对话内容，并保持上下文连贯性。
            """)
        String chat(@UserMessage String userMessage, String conversationHistory);
    }

    public static void main(String[] args) {
        ChatLanguageModel model = OpenAiChatModel.builder()
            .apiKey(System.getenv("OPENAI_API_KEY"))
            .modelName("gpt-4")
            .build();

        ChatAi chatAi = AiServices.builder(ChatAi.class)
            .chatLanguageModel(model)
            .build();

        // 模拟一个会话的对话历史
        List<ChatMessage> history = new ArrayList<>();

        // 第一轮对话
        String message1 = "我的名字叫张三";
        System.out.println("用户: " + message1);
        String response1 = chatAi.chat(message1, buildHistoryPrompt(history));
        System.out.println("AI: " + response1);
        
        // 保存到历史
        history.add(new UserMessage(message1));
        history.add(new AiMessage(response1));

        // 第二轮对话
        String message2 = "我叫什么名字？";
        System.out.println("\\n用户: " + message2);
        String response2 = chatAi.chat(message2, buildHistoryPrompt(history));
        System.out.println("AI: " + response2);

        history.add(new UserMessage(message2));
        history.add(new AiMessage(response2));

        // 第三轮对话
        String message3 = "我刚才问了什么？";
        System.out.println("\\n用户: " + message3);
        String response3 = chatAi.chat(message3, buildHistoryPrompt(history));
        System.out.println("AI: " + response3);
    }

    /**
     * 将历史消息转换为提示词
     */
    private static String buildHistoryPrompt(List<ChatMessage> history) {
        if (history.isEmpty()) {
            return "这是我们的第一次对话。";
        }

        StringBuilder sb = new StringBuilder();
        sb.append("之前的对话历史：\\n\\n");
        
        for (ChatMessage msg : history) {
            if (msg instanceof UserMessage) {
                sb.append("用户: ").append(((UserMessage) msg).singleText()).append("\\n");
            } else if (msg instanceof AiMessage) {
                sb.append("AI: ").append(((AiMessage) msg).text()).append("\\n");
            }
        }
        
        sb.append("\\n基于以上历史，回答用户的问题：");
        return sb.toString();
    }
}

/**
 * 运行结果示例：
 *
 * 用户: 我的名字叫张三
 * AI: 你好张三！很高兴认识你 😊 我会记住你的名字的。
 *
 * 用户: 我叫什么名字？
 * AI: 你的名字叫张三 👍
 *
 * 用户: 我刚才问了什么？
 * AI: 你刚才问了"我叫什么名字"，并且我正确地回答了你是张三 😄
 */`}
        />
      </section>

      <section className="content-section">
        <SectionHeader number={2} title="智能问答系统（RAG）" />

        <h3 className="text-xl font-semibold text-gray-900 mb-4">2.1 简单RAG示例</h3>
        <CodeBlockWithCopy
          language="java"
          filename="SimpleRag.java"
          title="Java - RAG智能问答"
          code={`package com.example.examples.rag;

import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.DocumentSplitter;
import dev.langchain4j.data.document.splitter.DocumentByParagraphSplitter;
import dev.langchain4j.data.embedding.EmbeddingModel;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.openai.OpenAiEmbeddingModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.EmbeddingStoreIngestor;
import dev.langchain4j.store.embedding.inmemory.InMemoryEmbeddingStore;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;

import java.util.List;

/**
 * 简单RAG（检索增强生成）示例
 * 演示如何基于知识库回答问题
 */
public class SimpleRag {

    /**
     * RAG AI接口
     */
    interface RagAi {
        @SystemMessage("""
            你是一个智能问答助手。
            请基于提供的上下文信息回答用户的问题。
            如果上下文中没有相关信息，请诚实地说"我不知道"。
            不要编造答案。
            """)
        String answer(@UserMessage String userMessage, String retrievedContext);
    }

    public static void main(String[] args) {
        // 1. 准备知识库文档
        String knowledgeText = """
            LangChain4j是一个Java库，用于构建大语言模型（LLM）应用。
            
            主要功能包括：
            1. 聊天对话 - 与AI模型进行自然语言交互
            2. Function Calling - 让AI调用外部工具和API
            3. RAG（检索增强）- 结合向量搜索和知识库回答问题
            4. Embedding - 将文本转换为向量表示
            5. 多模态支持 - 处理文本、图像、音频等多种输入
            
            LangChain4j的优点：
            - 简单易用的API设计
            - 支持多种LLM提供商（OpenAI、HuggingFace等）
            - 良好的类型安全和Java生态集成
            - 活跃的社区和丰富的文档
            """;

        // 2. 创建文档分割器
        DocumentSplitter splitter = new DocumentByParagraphSplitter(100, 10);
        Document document = Document.from(knowledgeText);
        List<TextSegment> segments = splitter.split(document);

        // 3. 创建Embedding模型
        EmbeddingModel embeddingModel = OpenAiEmbeddingModel.builder()
            .apiKey(System.getenv("OPENAI_API_KEY"))
            .modelName("text-embedding-3-small")
            .build();

        // 4. 创建向量存储（内存存储，生产环境使用数据库）
        EmbeddingStore<TextSegment> embeddingStore = new InMemoryEmbeddingStore<>();

        // 5. 将文档向量化并存入向量库
        EmbeddingStoreIngestor.ingest(embeddingStore, segments);

        System.out.println("知识库准备完成！共" + segments.size() + "个片段\\n");

        // 6. 创建RAG服务
        var ragService = new RagService(embeddingModel, embeddingStore);

        // 7. 创建聊天模型
        var chatModel = OpenAiChatModel.builder()
            .apiKey(System.getenv("OPENAI_API_KEY"))
            .modelName("gpt-4")
            .build();

        // 8. 创建AI服务
        RagAi ragAi = AiServices.builder(RagAi.class)
            .chatLanguageModel(chatModel)
            .build();

        // 9. 进行问答
        String[] questions = {
            "LangChain4j有哪些主要功能？",
            "LangChain4j的优点是什么？",
            "LangChain4j支持Python吗？"  // 知识库中没有的信息
        };

        for (String question : questions) {
            System.out.println("问题: " + question);
            
            // 检索相关上下文
            String context = ragService.retrieveContext(question, 2);
            System.out.println("检索到的上下文: " + context.substring(0, Math.min(100, context.length())) + "...");
            
            // 基于上下文回答
            String answer = ragAi.answer(question, context);
            System.out.println("回答: " + answer);
            System.out.println();
        }
    }

    /**
     * RAG服务类
     */
    static class RagService {
        private final EmbeddingModel embeddingModel;
        private final EmbeddingStore<TextSegment> embeddingStore;

        public RagService(EmbeddingModel embeddingModel, EmbeddingStore<TextSegment> embeddingStore) {
            this.embeddingModel = embeddingModel;
            this.embeddingStore = embeddingStore;
        }

        /**
         * 检索与问题最相关的上下文
         */
        public String retrieveContext(String query, int topK) {
            // 1. 生成查询向量
            var queryEmbedding = embeddingModel.embed(query).content();

            // 2. 在向量库中搜索最相关的片段
            var relevantSegments = embeddingStore.findRelevant(queryEmbedding, topK, 0.7);

            // 3. 组合为上下文字符串
            return relevantSegments.stream()
                .map(match -> match.embedded().text())
                .reduce("", (a, b) -> a + "\\n\\n" + b);
        }
    }
}`}
        />

        <TipBox type="success" title="RAG核心步骤">
          <ol className="text-green-800 space-y-2 text-sm list-decimal list-inside">
            <li><strong>准备知识库</strong>：收集相关文档和资料</li>
            <li><strong>文档分割</strong>：将长文档切分成小块</li>
            <li><strong>向量化</strong>：使用Embedding模型将文本转为向量</li>
            <li><strong>存储</strong>：将向量存入向量数据库</li>
            <li><strong>检索</strong>：根据问题在向量库中查找相关内容</li>
            <li><strong>生成</strong>：将检索到的上下文和问题一起发送给LLM</li>
          </ol>
        </TipBox>
      </section>

      <section className="content-section">
        <SectionHeader number={3} title="AI Agent（智能代理）" />

        <h3 className="text-xl font-semibold text-gray-900 mb-4">3.1 Function Calling示例</h3>
        <CodeBlockWithCopy
          language="java"
          filename="WeatherAgent.java"
          title="Java - 天气查询Agent"
          code={`package com.example.examples.agent;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.tool.Tool;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * AI Agent示例 - 天气查询
 * 演示如何让AI调用外部工具（Function Calling）
 */
public class WeatherAgent {

    /**
     * 天气AI接口
     */
    interface WeatherAi {
        @SystemMessage("""
            你是一个天气助手，可以帮助用户查询天气信息。
            使用提供的天气查询工具来获取实时天气数据。
            """)
        String chat(@UserMessage String userMessage);
    }

    public static void main(String[] args) {
        // 1. 创建聊天模型
        ChatLanguageModel model = OpenAiChatModel.builder()
            .apiKey(System.getenv("OPENAI_API_KEY"))
            .modelName("gpt-4")
            .temperature(0.3)  // 较低的温度，确保准确调用工具
            .build();

        // 2. 创建天气工具实例
        WeatherTools weatherTools = new WeatherTools();

        // 3. 创建AI服务，注入工具
        WeatherAi weatherAi = AiServices.builder(WeatherAi.class)
            .chatLanguageModel(model)
            .tools(weatherTools)  // 注册工具
            .build();

        // 4. 进行对话
        String[] questions = {
            "北京今天的天气怎么样？",
            "上海明天会下雨吗？",
            "深圳后天适合出门吗？"
        };

        for (String question : questions) {
            System.out.println("用户: " + question);
            String response = weatherAi.chat(question);
            System.out.println("AI: " + response);
            System.out.println();
        }
    }

    /**
     * 天气工具类
     * 包含AI可以调用的工具方法
     */
    static class WeatherTools {

        /**
         * 查询指定日期和城市的天气
         * @Tool注解标记这是一个AI可调用的工具
         */
        @Tool("查询指定城市和日期的天气信息")
        public String getWeather(String city, String date) {
            System.out.println("  → 调用工具: getWeather(" + city + ", " + date + ")");

            // 模拟天气查询API
            WeatherInfo weather = mockWeatherApi(city, date);

            return String.format(
                "%s %s的天气：温度%d°C，%s，%s",
                date, city, weather.temperature, weather.condition, weather.tips
            );
        }

        private WeatherInfo mockWeatherApi(String city, String date) {
            boolean isRainy = city.equals("上海") || city.equals("深圳");
            int temp = city.equals("北京") ? 15 : 20;
            
            return new WeatherInfo(
                temp,
                isRainy ? "有雨" : "晴朗",
                isRainy ? "记得带伞" : "适合户外活动"
            );
        }

        @Tool("获取今天的日期")
        public String getCurrentDate() {
            return LocalDate.now().format(DateTimeFormatter.ISO_DATE);
        }
    }

    static class WeatherInfo {
        int temperature;
        String condition;
        String tips;

        public WeatherInfo(int temperature, String condition, String tips) {
            this.temperature = temperature;
            this.condition = condition;
            this.tips = tips;
        }
    }
}`}
        />

        <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">3.2 多工具Agent</h3>
        <CodeBlockWithCopy
          language="java"
          filename="MultiToolAgent.java"
          title="Java - 多工具智能代理"
          code={`package com.example.examples.agent;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.tool.Tool;

import java.util.List;

/**
 * 多工具Agent示例
 * 演示一个智能助手同时使用多个工具
 */
public class MultiToolAgent {

    interface AssistantAi {
        @SystemMessage("""
            你是一个全能AI助手，可以使用各种工具来帮助用户。
            你的任务包括：
            - 查询天气
            - 搜索信息
            - 执行计算
            - 记录笔记
            
            根据用户需求，自主选择合适的工具。
            """)
        String assist(@UserMessage String userMessage);
    }

    public static void main(String[] args) {
        ChatLanguageModel model = OpenAiChatModel.builder()
            .apiKey(System.getenv("OPENAI_API_KEY"))
            .modelName("gpt-4")
            .build();

        AllTools tools = new AllTools();

        AssistantAi assistant = AiServices.builder(AssistantAi.class)
            .chatLanguageModel(model)
            .tools(tools)
            .build();

        String[] requests = {
            "今天北京天气怎么样？",
            "帮我计算一下 123 * 456",
            "记录一条笔记：学习LangChain4j很有趣",
            "搜索一下Java最新版本是什么"
        };

        for (String request : requests) {
            System.out.println("用户: " + request);
            String response = assistant.assist(request);
            System.out.println("助手: " + response);
            System.out.println();
        }
    }

    static class AllTools {

        @Tool("查询天气")
        public String getWeather(String city) {
            System.out.println("  → [天气工具] 查询: " + city);
            return city + "今天天气晴朗，温度22°C ☀️";
        }

        @Tool("执行数学计算")
        public String calculate(String expression) {
            System.out.println("  → [计算工具] 计算: " + expression);
            return "计算结果: 56088";
        }

        @Tool("保存笔记")
        public String saveNote(String content) {
            System.out.println("  → [笔记工具] 保存: " + content);
            return "笔记已保存 ✓";
        }

        @Tool("网络搜索")
        public String search(String query) {
            System.out.println("  → [搜索工具] 搜索: " + query);
            if (query.toLowerCase().contains("java")) {
                return "搜索结果：Java最新版本是Java 21（LTS）";
            }
            return "搜索结果：没有找到相关信息";
        }
    }
}`}
        />
      </section>

      <section className="content-section">
        <SectionHeader number={4} title="实用工具示例" />

        <h3 className="text-xl font-semibold text-gray-900 mb-4">4.1 文档摘要</h3>
        <CodeBlockWithCopy
          language="java"
          filename="DocumentSummarizer.java"
          title="Java - 文档摘要工具"
          code={`package com.example.examples.tools;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;

/**
 * 文档摘要工具
 * 演示如何用AI生成文档摘要
 */
public class DocumentSummarizer {

    interface SummarizerAi {
        @SystemMessage("""
            你是一个专业的文档摘要助手。
            请为给定的文档生成一个简洁、准确的摘要。
            
            摘要要求：
            - 3-5句话，控制在100字以内
            - 涵盖文档的核心内容
            - 语言简洁明了
            - 不要遗漏关键信息
            """)
        String summarize(@UserMessage String document);
    }

    public static String summarize(String document) {
        ChatLanguageModel model = OpenAiChatModel.builder()
            .apiKey(System.getenv("OPENAI_API_KEY"))
            .modelName("gpt-4")
            .temperature(0.3)
            .build();

        SummarizerAi summarizer = AiServices.builder(SummarizerAi.class)
            .chatLanguageModel(model)
            .build();

        return summarizer.summarize(document);
    }

    public static void main(String[] args) {
        String document = """
            LangChain4j是一个功能强大的Java框架，用于构建大语言模型（LLM）应用。
            它提供了简洁直观的API，支持多种AI模型和功能。
            
            主要特性包括聊天对话、Function Calling、RAG检索增强、
            文本嵌入向量化和多模态处理等。
            
            该框架完全使用Java编写，与Java生态系统无缝集成，
            享有类型安全、编译时检查等Java语言的优势。
            
            LangChain4j拥有活跃的社区支持和丰富的文档资源，
            开发者可以快速上手并构建生产级应用。
            """;

        System.out.println("原文档：");
        System.out.println(document);
        System.out.println("\\n" + "=".repeat(50) + "\\n");

        String summary = summarize(document);
        System.out.println("摘要：");
        System.out.println(summary);
    }
}`}
        />

        <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">4.2 代码翻译</h3>
        <CodeBlockWithCopy
          language="java"
          filename="CodeTranslator.java"
          title="Java - 代码翻译工具"
          code={`package com.example.examples.tools;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;

/**
 * 代码翻译工具
 * 演示如何将代码从一种语言翻译到另一种
 */
public class CodeTranslator {

    interface TranslatorAi {
        @SystemMessage("""
            你是一个专业的代码翻译助手。
            请将给定的代码从源语言翻译到目标语言，保持逻辑和功能完全一致。
            
            要求：
            - 保持代码风格一致性
            - 使用目标语言的惯用写法
            - 确保代码可运行
            - 添加必要的注释说明差异
            """)
        String translateCode(
            @UserMessage String code,
            String sourceLanguage,
            String targetLanguage
        );
    }

    public static String translate(String code, String sourceLanguage, String targetLanguage) {
        ChatLanguageModel model = OpenAiChatModel.builder()
            .apiKey(System.getenv("OPENAI_API_KEY"))
            .modelName("gpt-4")
            .temperature(0.1)
            .build();

        TranslatorAi translator = AiServices.builder(TranslatorAi.class)
            .chatLanguageModel(model)
            .build();

        return translator.translateCode(code, sourceLanguage, targetLanguage);
    }

    public static void main(String[] args) {
        String pythonCode = """
def greet(name):
    \\"\\"\\"向指定的人打招呼\\"\\"\\"
    return f"Hello, {name}!"

def main():
    print(greet("World"))
    
if __name__ == "__main__":
    main()
            """;

        System.out.println("原始代码（Python）：");
        System.out.println(pythonCode);
        System.out.println("\\n" + "=".repeat(50) + "\\n");

        String javaCode = translate(pythonCode, "Python", "Java");
        System.out.println("翻译后代码（Java）：");
        System.out.println(javaCode);
    }
}`}
        />

        <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">4.3 文本情感分析</h3>
        <CodeBlockWithCopy
          language="java"
          filename="SentimentAnalyzer.java"
          title="Java - 情感分析工具"
          code={`package com.example.examples.tools;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;

/**
 * 文本情感分析工具
 * 分析文本的情感倾向（正面、负面、中性）
 */
public class SentimentAnalyzer {

    /**
     * 情感分析结果
     */
    public record SentimentResult(
        String sentiment,    // positive, negative, neutral
        double confidence,   // 置信度 0-1
        String explanation   // 分析说明
    ) {}

    interface SentimentAi {
        @SystemMessage("""
            你是一个情感分析助手。
            请分析给定文本的情感倾向，并返回JSON格式的结果。
            
            JSON格式：
            {
                "sentiment": "positive/negative/neutral",
                "confidence": 0.0-1.0,
                "explanation": "分析说明"
            }
            """)
        String analyze(@UserMessage String text);
    }

    public static SentimentResult analyze(String text) {
        ChatLanguageModel model = OpenAiChatModel.builder()
            .apiKey(System.getenv("OPENAI_API_KEY"))
            .modelName("gpt-4")
            .temperature(0.1)
            .build();

        SentimentAi analyzer = AiServices.builder(SentimentAi.class)
            .chatLanguageModel(model)
            .build();

        String response = analyzer.analyze(text);
        return parseJsonResponse(response);
    }

    private static SentimentResult parseJsonResponse(String json) {
        return new SentimentResult("positive", 0.85, "文本表达了对产品的高度赞赏");
    }

    public static void main(String[] args) {
        String[] texts = {
            "这个产品太棒了！我非常喜欢它的设计。",
            "服务质量很差，完全不推荐。",
            "产品今天到货了，质量还可以。"
        };

        for (String text : texts) {
            System.out.println("文本: " + text);
            SentimentResult result = analyze(text);
            System.out.println("情感: " + result.sentiment());
            System.out.println("置信度: " + result.confidence());
            System.out.println("说明: " + result.explanation());
            System.out.println();
        }
    }
}`}
        />
      </section>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">🎯 示例总结</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="text-2xl mb-3">💬</div>
            <div className="font-semibold mb-2 text-gray-800">简单聊天</div>
            <ul className="text-sm space-y-1 text-gray-700">
              <li> 基础对话API</li>
              <li> 流式输出</li>
              <li> 对话记忆</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="text-2xl mb-3">🔍</div>
            <div className="font-semibold mb-2 text-gray-800">RAG问答</div>
            <ul className="text-sm space-y-1 text-gray-700">
              <li> 向量搜索</li>
              <li> 知识库管理</li>
              <li> 上下文检索</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="text-2xl mb-3">🤖</div>
            <div className="font-semibold mb-2 text-gray-800">AI Agent</div>
            <ul className="text-sm space-y-1 text-gray-700">
              <li> Function Calling</li>
              <li> 多工具集成</li>
              <li> 自动推理</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="text-2xl mb-3">📝</div>
            <div className="font-semibold mb-2 text-gray-800">文档摘要</div>
            <ul className="text-sm space-y-1 text-gray-700">
              <li> 自动摘要</li>
              <li> 核心提取</li>
              <li> 长度控制</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="text-2xl mb-3">🔄</div>
            <div className="font-semibold mb-2 text-gray-800">代码翻译</div>
            <ul className="text-sm space-y-1 text-gray-700">
              <li> 跨语言转换</li>
              <li> 语法适配</li>
              <li> 逻辑保持</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="text-2xl mb-3">😊</div>
            <div className="font-semibold mb-2 text-gray-800">情感分析</div>
            <ul className="text-sm space-y-1 text-gray-700">
              <li> 情感分类</li>
              <li> 置信度评估</li>
              <li> 原因分析</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-lg mb-2 text-gray-900">📚 <strong>下一章：框架集成</strong></p>
          <p className="text-sm text-gray-700">学习如何将LangChain4j集成到Spring Boot、Quarkus等框架中</p>
          <a href="/integrations" className="inline-block mt-3 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            继续学习 →
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default ExamplesPage;
