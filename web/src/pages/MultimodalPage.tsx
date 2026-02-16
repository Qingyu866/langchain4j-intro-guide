import Layout from '../components/layout/Layout';
import { SectionHeader, CodeBlockWithCopy, TipBox } from '../components/ui';

const MultimodalPage = () => {
  return (
    <Layout>
      <div className="flex items-center gap-3 mb-8 text-sm">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">多模态AI</span>
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">进阶</span>
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">~15分钟</span>
      </div>

      <h1 className="text-5xl font-bold text-gray-900 mb-6">多模态能力</h1>
      <p className="text-xl text-gray-600 mb-8 leading-relaxed">
        LangChain4j提供了强大的多模态AI能力，让你的应用不仅能理解文本，还能处理图像、音频等多种数据类型。
        本章将深入探讨多模态模型的集成、使用方法以及多模态RAG系统的构建。
      </p>

      <div className="bg-gray-50 rounded-lg p-6 mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 本章目录</h2>
        <ol className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 font-mono">1.</span>
            <span><a href="#overview" className="text-indigo-600 hover:underline">多模态AI概述</a></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 font-mono">2.</span>
            <span><a href="#image-generation" className="text-indigo-600 hover:underline">图像生成能力</a></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 font-mono">3.</span>
            <span><a href="#image-understanding" className="text-indigo-600 hover:underline">图像理解能力</a></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 font-mono">4.</span>
            <span><a href="#chat-multimodal" className="text-indigo-600 hover:underline">多模态对话</a></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 font-mono">5.</span>
            <span><a href="#multimodal-rag" className="text-indigo-600 hover:underline">多模态RAG系统</a></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-600 font-mono">6.</span>
            <span><a href="#best-practices" className="text-indigo-600 hover:underline">最佳实践与优化</a></span>
          </li>
        </ol>
      </div>

      <section id="overview" className="content-section">
        <SectionHeader number={1} title="多模态AI概述" />

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 mb-6">
          <h3 className="subsection-title-sm">什么是多模态AI？</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            多模态AI是指能够理解和处理多种类型数据（如文本、图像、音频、视频等）的AI系统。
            与仅能处理文本的传统LLM不同，多模态模型可以：
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span><strong>理解图像内容</strong>：分析图片中的物体、场景、文字等</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span><strong>生成图像</strong>：根据文本描述创建图像</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span><strong>跨模态推理</strong>：结合文本和图像信息进行综合分析</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span><strong>多模态对话</strong>：在对话中处理图片和文本混合输入</span>
            </li>
          </ul>
        </div>

        <div className="grid-2col">
          <div className="card">
            <div className="text-2xl mb-3">🖼️</div>
            <h4 className="subsection-title">图像生成</h4>
            <p className="card-description">使用DALL-E、Imagen等模型，将文本转换为精美的图像</p>
          </div>
          <div className="card">
            <div className="text-2xl mb-3">👁️</div>
            <h4 className="subsection-title">图像理解</h4>
            <p className="card-description">使用GPT-4V、Claude-3等模型，分析图像内容并生成描述</p>
          </div>
          <div className="card">
            <div className="text-2xl mb-3">🔄</div>
            <h4 className="subsection-title">多模态对话</h4>
            <p className="card-description">在聊天中同时处理文本和图像，实现自然交互</p>
          </div>
          <div className="card">
            <div className="text-2xl mb-3">📚</div>
            <h4 className="subsection-title">多模态RAG</h4>
            <p className="card-description">检索和生成结合，支持图像、文档等多模态数据</p>
          </div>
        </div>

        <TipBox type="info" title="应用场景">
          <p className="text-blue-800">
            多模态能力可以应用于众多场景：智能客服（分析用户上传的截图）、内容审核（识别图片中的不当内容）、
            图像检索（根据图片描述搜索相关图像）、文档分析（从PDF提取图文信息）、创意设计（AI辅助绘图）等。
          </p>
        </TipBox>
      </section>

      <section id="image-generation" className="content-section">
        <SectionHeader number={2} title="图像生成能力" />

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 mb-6">
          <h4 className="font-semibold text-yellow-900 mb-2">⚠️ 重要提示</h4>
          <p className="text-yellow-800 text-sm">
            图像生成功能需要单独的API和不同的模型（如DALL-E、Imagen等），
            与文本生成模型不同。请确保你有相应的API密钥和权限。
          </p>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900 mb-4">2.1 基础图像生成</h3>
        <p className="text-gray-700 mb-4">
          LangChain4j提供了统一的图像生成API，支持多种图像生成模型。
          以下是一个使用OpenAI DALL-E 3生成图像的示例：
        </p>

        <CodeBlockWithCopy
          language="java"
          filename="ImageGenerationExample.java"
          title="Java - DALL-E图像生成"
          code={`import dev.langchain4j.data.image.Image;
import dev.langchain4j.model.image.ImageModel;
import dev.langchain4j.model.openai.OpenAiImageModel;
import dev.langchain4j.model.output.Response;

import static dev.langchain4j.model.openai.OpenAiImageModelName.DALL_E_3;

/**
 * 图像生成基础示例
 * 演示如何使用DALL-E 3生成图像
 */
public class ImageGenerationExample {

    public static void main(String[] args) {
        // 1. 创建图像模型
        ImageModel imageModel = OpenAiImageModel.builder()
                .apiKey("your-api-key")
                .modelName(DALL_E_3)
                .size("1024x1024")
                .quality("standard")
                .style("vivid")
                .build();

        // 2. 生成图像
        String prompt = "一只在宇宙中漂浮的猫，赛博朋克风格，霓虹灯效果";
        Response<Image> response = imageModel.generate(prompt);

        // 3. 处理响应
        Image image = response.content();
        System.out.println("生成图像的URL: " + image.url());

        // 可选：下载图像到本地
        if (image.url() != null) {
            downloadImage(image.url(), "generated-cat.png");
        }
    }

    private static void downloadImage(String imageUrl, String fileName) {
        try {
            Path targetPath = Paths.get(fileName);
            System.out.println("图像已保存到: " + targetPath.toAbsolutePath());
        } catch (Exception e) {
            System.err.println("下载图像失败: " + e.getMessage());
        }
    }
}`}
        />

        <TipBox type="success" title="关键参数说明">
          <ul className="text-green-800 space-y-1 text-sm">
            <li><strong>modelName</strong>: 使用的图像模型（DALL_E_3, DALL_E_2等）</li>
            <li><strong>size</strong>: 图像尺寸（256x256, 512x512, 1024x1024, 1792x1024等）</li>
            <li><strong>quality</strong>: 图像质量（standard标准，hd高清）</li>
            <li><strong>style</strong>: 生成风格（vivid生动，natural自然）</li>
            <li><strong>n</strong>: 生成图像数量（默认为1，最大为10）</li>
          </ul>
        </TipBox>

        <h3 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">2.2 Google Imagen集成</h3>
        <CodeBlockWithCopy
          language="java"
          filename="ImagenGenerationExample.java"
          title="Java - Imagen图像生成"
          code={`import dev.langchain4j.data.image.Image;
import dev.langchain4j.model.image.ImageModel;
import dev.langchain4j.model.google.GoogleImageModel;
import dev.langchain4j.model.output.Response;

/**
 * Google Imagen图像生成示例
 */
public class ImagenGenerationExample {

    public static void main(String[] args) {
        // 1. 创建Imagen模型
        ImageModel imageModel = GoogleImageModel.builder()
                .apiKey("your-google-api-key")
                .modelName("imagen-3.0-generate-001")
                .build();

        // 2. 生成图像
        String prompt = "一幅展现春天的油画，色彩鲜艳，细节丰富";
        Response<Image> response = imageModel.generate(prompt);

        // 3. 处理响应
        if (response.content() != null) {
            System.out.println("生成成功！");
            System.out.println("图像URL: " + response.content().url());
        }
    }
}`}
        />

        <h3 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">2.3 高级图像生成配置</h3>
        <CodeBlockWithCopy
          language="java"
          filename="AdvancedImageGeneration.java"
          title="Java - 高级图像生成"
          code={`import dev.langchain4j.data.image.Image;
import dev.langchain4j.model.image.ImageModel;
import dev.langchain4j.model.openai.OpenAiImageModel;
import dev.langchain4j.model.output.Response;

import java.util.List;

import static dev.langchain4j.model.openai.OpenAiImageModelName.DALL_E_3;

/**
 * 高级图像生成配置示例
 */
public class AdvancedImageGeneration {

    public static void main(String[] args) {
        ImageModel imageModel = OpenAiImageModel.builder()
                .apiKey("your-api-key")
                .modelName(DALL_E_3)
                .size("1792x1024")
                .quality("hd")
                .style("vivid")
                .responseFormat("b64_json")
                .build();

        String prompt = """
            一幅未来城市的全景图，
            高楼大厦直插云霄，
            飞行汽车穿梭其中，
            全息广告牌闪烁，
            赛博朋克风格，
            电影级光效
            """;

        // 生成多张图像
        int numberOfImages = 2;
        List<Response<Image>> responses = imageModel.generate(prompt, numberOfImages);

        // 处理每张图像
        for (int i = 0; i < responses.size(); i++) {
            Response<Image> response = responses.get(i);
            Image image = response.content();
            System.out.printf("图像 %d: %s%n", i + 1,
                image.url() != null ? image.url() : "[Base64数据]");
        }
    }
}`}
        />

        <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-lg">
          <h4 className="font-semibold text-red-900 mb-2">⚠️ 成本与限制</h4>
          <p className="text-red-800 text-sm">
            图像生成API通常比文本生成API昂贵。DALL-E 3的高清图像（1024x1024）每次调用可能成本$0.04-$0.08。
            建议在开发时使用小尺寸（256x256）进行测试，生产环境再使用高分辨率。
            同时注意API调用频率限制（RPM）。
          </p>
        </div>
      </section>

      <section id="image-understanding" className="content-section">
        <SectionHeader number={3} title="图像理解能力" />

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mb-6">
          <h3 className="subsection-title-sm">支持的视觉模型</h3>
          <p className="text-gray-700 mb-4">
            LangChain4j支持多种多模态模型，可以理解图像内容并生成文本描述：
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="font-semibold text-gray-900 mb-2">GPT-4 Vision</div>
              <p className="text-sm text-gray-600">OpenAI的视觉模型，强大的图像理解能力</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="font-semibold text-gray-900 mb-2">Claude-3 Vision</div>
              <p className="text-sm text-gray-600">Anthropic的多模态模型，细节分析出色</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="font-semibold text-gray-900 mb-2">Gemini Pro Vision</div>
              <p className="text-sm text-gray-600">Google的多模态模型，成本效益高</p>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900 mb-4">3.1 基础图像分析</h3>
        <CodeBlockWithCopy
          language="java"
          filename="ImageUnderstandingExample.java"
          title="Java - 图像理解"
          code={`import dev.langchain4j.data.image.Image;
import dev.langchain4j.data.message.ImageContent;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.output.Response;

/**
 * 图像理解基础示例
 * 演示如何让AI分析图像内容
 */
public class ImageUnderstandingExample {

    public static void main(String[] args) {
        // 1. 创建支持视觉的聊天模型
        ChatLanguageModel visionModel = OpenAiChatModel.builder()
                .apiKey("your-api-key")
                .modelName("gpt-4o")
                .build();

        // 2. 创建图像内容（可以是URL或Base64）
        Image image = Image.from("https://example.com/image.jpg");

        // 3. 创建包含图像的用户消息
        UserMessage userMessage = UserMessage.from(
                ImageContent.from(image),
                "请详细描述这张图片中的内容"
        );

        // 4. 发送给模型
        Response<AiMessage> response = visionModel.generate(userMessage);

        // 5. 获取分析结果
        System.out.println("AI分析结果:");
        System.out.println(response.content().text());
    }
}`}
        />

        <h3 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">3.2 从本地文件加载图像</h3>
        <CodeBlockWithCopy
          language="java"
          filename="LocalImageExample.java"
          title="Java - 本地图像处理"
          code={`import dev.langchain4j.data.image.Image;
import dev.langchain4j.data.message.ImageContent;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

/**
 * 从本地文件加载图像示例
 */
public class LocalImageExample {

    public static void main(String[] args) throws IOException {
        ChatLanguageModel visionModel = OpenAiChatModel.builder()
                .apiKey("your-api-key")
                .modelName("gpt-4o")
                .build();

        // 1. 读取本地图像文件
        Path imagePath = Paths.get("path/to/your/image.jpg");
        byte[] imageBytes = Files.readAllBytes(imagePath);

        // 2. 转换为Base64编码
        String base64Image = Base64.getEncoder()
                .encodeToString(imageBytes);

        // 3. 创建Image对象，指定MIME类型
        String mimeType = Files.probeContentType(imagePath);
        Image image = Image.from("data:" + mimeType + ";base64," + base64Image);

        // 4. 创建用户消息
        UserMessage userMessage = UserMessage.from(
                ImageContent.from(image),
                "这张图片里有什么？请列出所有主要物体"
        );

        // 5. 发送给模型分析
        var response = visionModel.generate(userMessage);
        System.out.println(response.content().text());
    }
}`}
        />

        <h3 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">3.3 提取结构化信息</h3>
        <CodeBlockWithCopy
          language="java"
          filename="StructuredExtraction.java"
          title="Java - 结构化数据提取"
          code={`import dev.langchain4j.data.image.Image;
import dev.langchain4j.data.message.ImageContent;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;

/**
 * 从图像提取结构化信息示例
 */
public class StructuredExtraction {

    public static void main(String[] args) {
        ChatLanguageModel visionModel = OpenAiChatModel.builder()
                .apiKey("your-api-key")
                .modelName("gpt-4o")
                .build();

        Image image = Image.from("https://example.com/invoice.jpg");

        // 提示词要求JSON格式的结构化输出
        UserMessage userMessage = UserMessage.from(
                ImageContent.from(image),
                """
                请分析这张发票，并以JSON格式返回以下信息：
                {
                    "invoice_number": "发票号码",
                    "date": "日期",
                    "total_amount": "总金额",
                    "vendor": "供应商名称",
                    "line_items": [
                        {"item": "商品名称", "quantity": 数量, "price": 价格}
                    ]
                }

                只返回JSON，不要其他文本。
                """
        );

        var response = visionModel.generate(userMessage);
        String result = response.content().text();

        System.out.println("提取的发票信息:");
        System.out.println(result);
    }
}`}
        />

        <div className="grid-2col">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
            <h4 className="font-semibold text-blue-900 mb-3">💡 常见应用场景</h4>
            <ul className="text-blue-800 space-y-2 text-sm">
              <li>• OCR文档识别（发票、收据、身份证）</li>
              <li>• 产品缺陷检测（制造业质检）</li>
              <li>• 医疗影像分析（X光片、CT扫描）</li>
              <li>• 图像内容审核（识别不当内容）</li>
              <li>• 电商商品分类（自动标注）</li>
            </ul>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-5">
            <h4 className="font-semibold text-orange-900 mb-3">⚠️ 性能优化建议</h4>
            <ul className="text-orange-800 space-y-2 text-sm">
              <li>• 压缩图像分辨率（减少Token消耗）</li>
              <li>• 裁剪感兴趣区域（降低复杂度）</li>
              <li>• 使用小模型进行初筛（节省成本）</li>
              <li>• 缓存图像嵌入（避免重复分析）</li>
              <li>• 批量处理而非单张分析</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="chat-multimodal" className="content-section">
        <SectionHeader number={4} title="多模态对话" />

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="subsection-title-sm">对话中的多模态支持</h3>
          <p className="text-gray-700 mb-4">
            LangChain4j的ChatModel支持在对话中混合使用文本和图像。你可以：
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">1.</span>
              <span>在UserMessage中同时包含文本和ImageContent</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">2.</span>
              <span>在多轮对话中保持上下文</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">3.</span>
              <span>让AI根据图像内容进行推理和回答</span>
            </li>
          </ul>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900 mb-4">4.1 多轮图像对话示例</h3>
        <CodeBlockWithCopy
          language="java"
          filename="MultimodalChat.java"
          title="Java - 多轮多模态对话"
          code={`import dev.langchain4j.data.image.Image;
import dev.langchain4j.data.message.*;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.openai.OpenAiChatModelName;

import java.util.ArrayList;
import java.util.List;

/**
 * 多模态对话示例
 * 演示如何在对话中混合使用文本和图像
 */
public class MultimodalChat {

    public static void main(String[] args) {
        ChatLanguageModel model = OpenAiChatModel.builder()
                .apiKey("your-api-key")
                .modelName(OpenAiChatModelName.GPT_4O)
                .build();

        // 第一轮：发送图片
        System.out.println("=== 第一轮 ===");
        List<ChatMessage> messages1 = new ArrayList<>();
        Image chartImage = Image.from("https://example.com/sales-chart.jpg");

        messages1.add(UserMessage.from(
                ImageContent.from(chartImage),
                "请分析这张销售图表的主要趋势"
        ));

        Response<AiMessage> response1 = model.generate(messages1);
        System.out.println("AI: " + response1.content().text());
        messages1.add(response1.content());

        // 第二轮：追问细节
        System.out.println("\\n=== 第二轮 ===");
        List<ChatMessage> messages2 = new ArrayList<>(messages1);
        messages2.add(UserMessage.from(
                "图表中的第3个月份的数据是多少？为什么会出现这个峰值？"
        ));

        Response<AiMessage> response2 = model.generate(messages2);
        System.out.println("AI: " + response2.content().text());

        // 第三轮：上传新图片并关联讨论
        System.out.println("\\n=== 第三轮 ===");
        List<ChatMessage> messages3 = new ArrayList<>(messages2);
        Image competitorChart = Image.from("https://example.com/competitor-chart.jpg");

        messages3.add(UserMessage.from(
                ImageContent.from(competitorChart),
                "对比这两张图表，我们的产品有什么优势？"
        ));

        Response<AiMessage> response3 = model.generate(messages3);
        System.out.println("AI: " + response3.content().text());
    }
}`}
        />

        <h3 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">4.2 AI Service中的多模态</h3>
        <CodeBlockWithCopy
          language="java"
          filename="MultimodalService.java"
          title="Java - AI Service多模态"
          code={`import dev.langchain4j.data.image.Image;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.memory.ChatMemoryProvider;
import dev.langchain4j.service.memory.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;

/**
 * 使用AI Service处理多模态对话
 */
public class MultimodalService {

    interface ImageAssistant {
        String analyzeImage(String imageDescription);
        String followUpQuestion(String question);
    }

    public static void main(String[] args) {
        // 1. 创建支持视觉的模型
        ChatLanguageModel model = OpenAiChatModel.builder()
                .apiKey("your-api-key")
                .modelName("gpt-4o")
                .build();

        // 2. 配置ChatMemory保持对话历史
        MessageWindowChatMemory chatMemory = MessageWindowChatMemory.withMaxMessages(10);
        ChatMemoryProvider memoryProvider = (memoryId) -> chatMemory;

        // 3. 创建AI Service
        ImageAssistant assistant = AiServices.builder(ImageAssistant.class)
                .chatLanguageModel(model)
                .chatMemoryProvider(memoryProvider)
                .build();

        // 4. 模拟用户上传图片
        String imageDescription = "用户上传了一张包含多个产品的照片";
        System.out.println("用户：上传了一张图片 - " + imageDescription);
        String response1 = assistant.analyzeImage(imageDescription);
        System.out.println("AI：" + response1);

        // 5. 后续问答
        String question = "第一个产品的价格是多少？";
        System.out.println("用户：" + question);
        String response2 = assistant.followUpQuestion(question);
        System.out.println("AI：" + response2);
    }
}`}
        />

        <TipBox type="success" title="最佳实践">
          <ul className="text-green-800 space-y-1 text-sm">
            <li><strong>提示词设计</strong>：明确告诉AI图像的内容和你的目标，避免歧义</li>
            <li><strong>图像质量</strong>：确保上传的图像清晰度足够，关键信息可见</li>
            <li><strong>上下文保持</strong>：在多轮对话中合理管理ChatMemory，避免Token超限</li>
            <li><strong>错误处理</strong>：图像上传可能失败，要有优雅的错误处理和重试机制</li>
          </ul>
        </TipBox>
      </section>

      <section id="multimodal-rag" className="content-section">
        <SectionHeader number={5} title="多模态RAG系统" />

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 mb-6">
          <h3 className="subsection-title-sm">什么是多模态RAG？</h3>
          <p className="text-gray-700 mb-4">
            传统RAG系统主要处理文本数据，而多模态RAG可以：
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span><strong>检索图像</strong>：根据文本或图像查询相似的图像</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span><strong>跨模态检索</strong>：用图像查询文本，或用文本查询图像</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span><strong>混合检索</strong>：同时检索文本和图像，综合生成回答</span>
            </li>
          </ul>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900 mb-4">5.1 图像RAG架构</h3>
        <div className="bg-gray-100 rounded-lg p-6 mb-6">
          <div className="font-mono text-sm space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-blue-600 text-white rounded text-xs">输入</span>
              <span>用户查询（文本或图像）</span>
            </div>
            <div className="text-center text-gray-400">↓</div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-purple-600 text-white rounded text-xs">嵌入</span>
              <span>使用多模态嵌入模型转换为向量</span>
            </div>
            <div className="text-center text-gray-400">↓</div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-green-600 text-white rounded text-xs">检索</span>
              <span>从向量数据库检索相似的图像/文本</span>
            </div>
            <div className="text-center text-gray-400">↓</div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-orange-600 text-white rounded text-xs">生成</span>
              <span>将检索结果输入LLM生成回答</span>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900 mb-4">5.2 图像RAG实现示例</h3>
        <CodeBlockWithCopy
          language="java"
          filename="ImageRagExample.java"
          title="Java - 图像RAG系统"
          code={`import dev.langchain4j.data.image.Image;
import dev.langchain4j.data.message.*;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.query.Query;

import java.util.List;

/**
 * 图像RAG系统示例
 * 演示如何检索相关图像并生成回答
 */
public class ImageRagExample {

    interface ImageRetriever extends ContentRetriever {
        List<RetrievedImage> retrieveByImage(Image queryImage);
        List<RetrievedImage> retrieveByText(String textQuery);
    }

    public static void main(String[] args) {
        // 1. 创建视觉模型
        ChatLanguageModel visionModel = OpenAiChatModel.builder()
                .apiKey("your-api-key")
                .modelName("gpt-4o")
                .build();

        // 2. 创建图像检索器
        ImageRetriever retriever = createImageRetriever();

        // 3. 用户输入文本查询
        String userQuery = "我想找一张有蓝天白云的风景照";
        System.out.println("用户查询: " + userQuery);

        // 4. 检索相关图像
        List<RetrievedImage> retrievedImages = retriever.retrieveByText(userQuery);
        System.out.println("检索到 " + retrievedImages.size() + " 张相关图像");

        // 5. 构建包含检索结果的Prompt
        StringBuilder contextBuilder = new StringBuilder();
        contextBuilder.append("以下是一些相关图像的描述：\\n\\n");

        for (int i = 0; i < retrievedImages.size() && i < 3; i++) {
            RetrievedImage img = retrievedImages.get(i);
            contextBuilder.append(String.format(
                    "图像 %d: %s (URL: %s)\\n",
                    i + 1, img.description(), img.url()
            ));
        }

        contextBuilder.append("\\n用户问题: ").append(userQuery);

        // 6. 生成回答
        List<ChatMessage> messages = List.of(
                UserMessage.from(contextBuilder.toString())
        );

        var response = visionModel.generate(messages);
        System.out.println("\\nAI回答:");
        System.out.println(response.content().text());
    }

    private static ImageRetriever createImageRetriever() {
        // 实际实现需要：
        // 1. 图像嵌入模型（如CLIP）
        // 2. 向量数据库（如Milvus、Pinecone）
        // 3. 相似度搜索
        return new ImageRetriever() {
            @Override
            public List<RetrievedImage> retrieve(Query query) {
                return List.of();
            }
        };
    }

    static class RetrievedImage {
        private final String url;
        private final String description;
        private final double score;

        public RetrievedImage(String url, String description, double score) {
            this.url = url;
            this.description = description;
            this.score = score;
        }

        public String url() { return url; }
        public String description() { return description; }
        public double score() { return score; }
    }
}`}
        />

        <div className="grid-2col mt-6">
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-5 rounded-r-lg">
            <h4 className="font-semibold text-indigo-900 mb-2">💡 多模态RAG优势</h4>
            <ul className="text-indigo-800 space-y-1 text-sm">
              <li><strong>更丰富的检索</strong>：不仅检索文本，还能检索图像、表格等</li>
              <li><strong>更好的理解</strong>：视觉信息能提供文本无法表达的上下文</li>
              <li><strong>跨模态查询</strong>：可以用图像找图像，或文本找图像</li>
              <li><strong>提升准确率</strong>：多源信息融合，减少幻觉</li>
            </ul>
          </div>
          <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-lg">
            <h4 className="font-semibold text-red-900 mb-2">⚠️ 技术挑战</h4>
            <ul className="text-red-800 space-y-1 text-sm">
              <li><strong>多模态嵌入</strong>：需要能处理图像+文本的嵌入模型（如CLIP）</li>
              <li><strong>存储成本</strong>：图像嵌入向量比文本大得多</li>
              <li><strong>检索速度</strong>：大规模图像向量检索性能优化</li>
              <li><strong>Context窗口</strong>：多张图像+文本可能超过LLM的Token限制</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="best-practices" className="content-section">
        <SectionHeader number={6} title="最佳实践与优化" />

        <h3 className="text-2xl font-semibold text-gray-900 mb-4">6.1 性能优化策略</h3>
        <div className="grid-2col">
          <div className="border border-gray-200 rounded-lg p-5">
            <h4 className="font-semibold text-gray-900 mb-3">🚀 图像处理优化</h4>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li><strong>分辨率控制</strong>：最大边长不超过2048像素</li>
              <li><strong>格式选择</strong>：使用WebP而非PNG，减少大小</li>
              <li><strong>懒加载</strong>：只在需要时加载高分辨率图像</li>
              <li><strong>缓存机制</strong>：缓存分析结果，避免重复调用</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <h4 className="font-semibold text-gray-900 mb-3">💰 成本优化</h4>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li><strong>模型选择</strong>：GPT-4o-mini比GPT-4o便宜60%</li>
              <li><strong>批量处理</strong>：一次处理多张图而非单张</li>
              <li><strong>预筛选</strong>：用低成本模型先过滤</li>
              <li><strong>Token预算</strong>：设置maxTokens避免超支</li>
            </ul>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">6.2 安全与合规</h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 mb-6">
          <h4 className="font-semibold text-yellow-900 mb-3">⚠️ 多模态安全注意事项</h4>
          <ul className="text-yellow-800 space-y-2 text-sm">
            <li><strong>内容过滤</strong>：使用OpenAI的Moderation API过滤不当内容</li>
            <li><strong>隐私保护</strong>：不要上传包含PII（个人身份信息）的图像</li>
            <li><strong>水印检测</strong>：识别并处理带水印的图像</li>
            <li><strong>版权合规</strong>：确保有权利上传和分析图像</li>
            <li><strong>数据本地化</strong>：敏感数据确保存储在合规区域</li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">🎯 本章总结</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">核心概念</h4>
              <ul className="space-y-1 text-sm opacity-90">
                <li>• 多模态AI支持文本、图像、音频等多种数据</li>
                <li>• 图像生成使用ImageModel（DALL-E、Imagen）</li>
                <li>• 图像理解使用ChatModel（GPT-4V、Claude-3）</li>
                <li>• 多模态RAG支持图像检索和跨模态查询</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">关键API</h4>
              <ul className="space-y-1 text-sm font-mono opacity-90">
                <li>• ImageModel.generate()</li>
                <li>• UserMessage.from(ImageContent, text)</li>
                <li>• Image.from(url/base64)</li>
                <li>• ContentRetriever（自定义检索器）</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-sm opacity-90">
              下一章我们将学习如何构建完整的RAG知识库系统，包括文档加载、嵌入生成、向量存储和智能检索。
            </p>
            <a href="/rag-complete" className="inline-block mt-3 px-6 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              继续学习 →
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MultimodalPage;
