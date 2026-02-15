import Layout from '../components/layout/Layout';
import { SectionHeader, CodeBlock, TipBox } from '../components/ui';

const TestingStrategiesPage = () => {
  return (
    <Layout>
      <div className="flex items-center gap-3 mb-8 text-sm">
        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">2025-02-14</span>
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">测试策略</span>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">中级难度</span>
      </div>

      <h1 className="text-5xl font-bold text-gray-900 mb-6">LangChain4j 测试策略</h1>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 测试概览</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100 rounded-xl p-6">
            <div className="text-3xl mb-3">🧪</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">单元测试</h3>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• JUnit 5</li>
              <li>• Mockito</li>
              <li>• 快速执行</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-6">
            <div className="text-3xl mb-3">🔗</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">集成测试</h3>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• Testcontainers</li>
              <li>• Spring Boot Test</li>
              <li>• 真实环境</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-teal-50 border border-green-100 rounded-xl p-6">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">端到端测试</h3>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• Selenium/Playwright</li>
              <li>• REST Assured</li>
              <li>• 完整流程</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-6">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Mock策略</h3>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• AI模型Mock</li>
              <li>• 向量数据库Stub</li>
              <li>• 外部API隔离</li>
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
              <li>• 掌握 LangChain4j 应用的单元测试方法</li>
              <li>• 学习集成测试和端到端测试策略</li>
              <li>• 理解如何 Mock AI 模型和外部依赖</li>
              <li>• 掌握测试覆盖率提升技巧</li>
              <li>• 学习持续集成中的自动化测试实践</li>
            </ul>
          </div>
        </div>
      </div>

      <section className="content-section">
        <SectionHeader number={1} title="单元测试" />

        <h3 className="text-xl font-semibold text-gray-900 mb-4">1.1 JUnit 5 + Mockito 测试</h3>
        <CodeBlock
          language="java"
          filename="ChatServiceTest.java"
          title="Java - 单元测试示例"
          code={`package com.example.langchain4j.service;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * ChatService 单元测试
 * 测试核心业务逻辑，不依赖真实AI模型
 */
@ExtendWith(MockitoExtension.class)
class ChatServiceTest {

    @Mock
    private ChatLanguageModel chatLanguageModel;

    @InjectMocks
    private ChatService chatService;

    private static final String TEST_MESSAGE = "测试消息";
    private static final String EXPECTED_RESPONSE = "这是一个测试回复";

    @BeforeEach
    void setUp() {
        // 在每个测试前设置Mock行为
        when(chatLanguageModel.generate(any(String.class)))
            .thenReturn(EXPECTED_RESPONSE);
    }

    @Test
    void chat_返回成功响应() {
        // Given
        String userMessage = TEST_MESSAGE;

        // When
        String response = chatService.chat(userMessage);

        // Then
        assertNotNull(response);
        assertEquals(EXPECTED_RESPONSE, response);
        verify(chatLanguageModel, times(1)).generate(eq(userMessage));
    }

    @Test
    void chat_空消息抛出异常() {
        // Given
        String emptyMessage = "";

        // When & Then
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> chatService.chat(emptyMessage)
        );

        assertEquals("消息不能为空", exception.getMessage());
        verify(chatLanguageModel, never()).generate(any());
    }

    @Test
    void chat_AI模型调用失败处理异常() {
        // Given
        when(chatLanguageModel.generate(any(String.class)))
            .thenThrow(new RuntimeException("AI服务不可用"));

        // When & Then
        assertThrows(
            ChatException.class,
            () -> chatService.chat(TEST_MESSAGE)
        );
    }

    @Test
    void chat_验证参数传递() {
        // Given
        String userMessage = "特定测试消息";
        when(chatLanguageModel.generate(eq(userMessage)))
            .thenReturn("预期响应");

        // When
        chatService.chat(userMessage);

        // Then
        ArgumentCaptor<String> captor = ArgumentCaptor.forClass(String.class);
        verify(chatLanguageModel).generate(captor.capture());
        assertEquals(userMessage, captor.getValue());
    }

    @Test
    void chat_多次调用独立处理() {
        // Given
        when(chatLanguageModel.generate(any(String.class)))
            .thenReturn("回复1")
            .thenReturn("回复2");

        // When
        String response1 = chatService.chat("消息1");
        String response2 = chatService.chat("消息2");

        // Then
        assertEquals("回复1", response1);
        assertEquals("回复2", response2);
        verify(chatLanguageModel, times(2)).generate(any());
    }
}

/**
 * ChatService 实现（简化）
 */
class ChatService {
    private final ChatLanguageModel chatLanguageModel;

    public ChatService(ChatLanguageModel chatLanguageModel) {
        this.chatLanguageModel = chatLanguageModel;
    }

    public String chat(String userMessage) {
        if (userMessage == null || userMessage.trim().isEmpty()) {
            throw new IllegalArgumentException("消息不能为空");
        }

        try {
            return chatLanguageModel.generate(userMessage);
        } catch (Exception e) {
            throw new ChatException("AI生成失败", e);
        }
    }
}

class ChatException extends RuntimeException {
    public ChatException(String message, Throwable cause) {
        super(message, cause);
    }
}`}
        />

        <TipBox type="success" title="单元测试最佳实践">
          <ul className="text-green-800 space-y-2 text-sm">
            <li>• <strong>隔离测试</strong>：每个测试独立，不依赖其他测试</li>
            <li>• <strong>快速执行</strong>：单元测试应该在几秒内完成</li>
            <li>• <strong>命名清晰</strong>：使用描述性的测试方法名</li>
            <li>• <strong>AAA模式</strong>：Arrange-Act-Assert 结构清晰</li>
            <li>• <strong>Mock外部依赖</strong>：不要调用真实的AI API</li>
          </ul>
        </TipBox>

        <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">1.2 Mock AI 模型</h3>
        <CodeBlock
          language="java"
          filename="MockChatModel.java"
          title="Java - Mock AI模型"
          code={`package com.example.langchain4j.test.util;

import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.output.Response;
import dev.langchain4j.model.output.TokenUsage;

import java.util.ArrayList;
import java.util.List;

/**
 * Mock ChatLanguageModel
 * 用于测试，避免调用真实AI API
 */
public class MockChatModel implements ChatLanguageModel {

    private final List<String> responses;
    private int callCount = 0;
    private TokenUsage tokenUsage;

    public MockChatModel(String... responses) {
        this.responses = new ArrayList<>(List.of(responses));
        this.tokenUsage = new TokenUsage(0, 0);
    }

    public MockChatModel() {
        this.responses = new ArrayList<>();
    }

    /**
     * 设置预定义的响应
     */
    public void addResponse(String response) {
        responses.add(response);
    }

    /**
     * 清除所有响应
     */
    public void clearResponses() {
        responses.clear();
        callCount = 0;
    }

    /**
     * 设置Token使用量
     */
    public void setTokenUsage(int inputTokens, int outputTokens) {
        this.tokenUsage = new TokenUsage(inputTokens, outputTokens);
    }

    @Override
    public String generate(String userMessage) {
        if (responses.isEmpty()) {
            return "Mock response for: " + userMessage;
        }
        
        String response = responses.get(callCount % responses.size());
        callCount++;
        return response;
    }

    @Override
    public Response<AiMessage> generate(List<ChatMessage> messages) {
        String lastMessage = messages.get(messages.size() - 1).text();
        String response = generate(lastMessage);
        
        return Response.from(
            AiMessage.from(response),
            tokenUsage
        );
    }

    @Override
    public TokenUsage estimateTokenCount(List<ChatMessage> messages) {
        int totalTokens = messages.stream()
            .mapToInt(msg -> msg.text().length() / 4)
            .sum();
        
        return new TokenUsage(totalTokens, totalTokens);
    }

    /**
     * 获取调用次数
     */
    public int getCallCount() {
        return callCount;
    }

    /**
     * 验证是否被调用
     */
    public void verifyCalled(int expectedCount) {
        if (callCount != expectedCount) {
            throw new AssertionError(
                "Expected " + expectedCount + " calls, but was " + callCount
            );
        }
    }

    /**
     * 静态工厂方法
     */
    public static MockChatModel withResponse(String response) {
        return new MockChatModel(response);
    }

    public static MockChatModel withResponses(String... responses) {
        return new MockChatModel(responses);
    }

    public static MockChatModel fixed() {
        return new MockChatModel("这是固定的Mock响应");
    }
}`}
        />
      </section>

      <section className="content-section">
        <SectionHeader number={2} title="集成测试" />

        <h3 className="text-xl font-semibold text-gray-900 mb-4">2.1 Spring Boot 集成测试</h3>
        <CodeBlock
          language="java"
          filename="ChatControllerIntegrationTest.java"
          title="Java - 集成测试"
          code={`package com.example.langchain4j.controller;

import com.example.langchain4j.model.ChatRequest;
import com.example.langchain4j.model.ChatResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * ChatController 集成测试
 * 测试HTTP端点，使用真实Spring Boot上下文
 */
@SpringBootTest
@AutoConfigureMockMvc
class ChatControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void chat_成功返回响应() throws Exception {
        // Given
        ChatRequest request = new ChatRequest("你好");

        // When & Then
        mockMvc.perform(post("/api/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").exists())
            .andExpect(jsonPath("$.timestamp").exists());
    }

    @Test
    void chat_空消息返回400() throws Exception {
        // Given
        ChatRequest request = new ChatRequest("");  // 空消息

        // When & Then
        mockMvc.perform(post("/api/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());
    }

    @Test
    void health_返回健康状态() throws Exception {
        mockMvc.perform(get("/api/chat/health"))
            .andExpect(status().isOk())
            .andExpect(content().string(containsString("Chat service is running")));
    }

    @Test
    void chat_接受JSON内容类型() throws Exception {
        ChatRequest request = new ChatRequest("测试");

        mockMvc.perform(post("/api/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    void chat_不支持的方法返回405() throws Exception {
        mockMvc.perform(get("/api/chat"))
            .andExpect(status().isMethodNotAllowed());
    }
}`}
        />

        <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">2.2 Testcontainers 测试</h3>
        <CodeBlock
          language="java"
          filename="RagServiceIntegrationTest.java"
          title="Java - Testcontainers"
          code={`package com.example.langchain4j.service;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;

import static org.junit.jupiter.api.Assertions.*;

/**
 * RagService 集成测试
 * 使用Testcontainers启动真实的PostgreSQL数据库
 */
@SpringBootTest
class RagServiceIntegrationTest {

    static PostgreSQLContainer<?> postgresContainer;

    @Autowired
    private RagService ragService;

    /**
     * 启动PostgreSQL容器
     */
    @BeforeAll
    static void setUpContainer() {
        postgresContainer = new PostgreSQLContainer<>(
            DockerImageName.parse("pgvector/pgvector:pg16")
                .asCompatibleSubstituteFor("postgres")
        )
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test")
            .withExposedPorts(5432);

        postgresContainer.start();

        // 设置Spring环境变量
        System.setProperty("DB_HOST", postgresContainer.getHost());
        System.setProperty("DB_PORT", String.valueOf(postgresContainer.getFirstMappedPort()));
    }

    /**
     * 停止PostgreSQL容器
     */
    @AfterAll
    static void tearDownContainer() {
        if (postgresContainer != null && postgresContainer.isRunning()) {
            postgresContainer.stop();
        }
    }

    @Test
    void ingestDocuments_成功存储() {
        // Given
        String documentContent = "这是一篇测试文档。";
        
        // When
        String documentId = ragService.ingestDocument(documentContent);

        // Then
        assertNotNull(documentId);
        assertTrue(documentId.startsWith("doc-"));
    }

    @Test
    void search_返回相关文档() {
        // Given
        String doc1 = "LangChain4j是一个Java库";
        String doc2 = "LangChain4j支持多种AI模型";
        
        ragService.ingestDocument(doc1);
        ragService.ingestDocument(doc2);

        // When
        List<SearchResult> results = ragService.search("AI模型", 2);

        // Then
        assertNotNull(results);
        assertFalse(results.isEmpty());
        assertTrue(results.get(0).getScore() > 0.5);
    }

    @Test
    void search_不存在的关键词返回空() {
        // Given
        String query = "不存在的内容xyz123";

        // When
        List<SearchResult> results = ragService.search(query, 5);

        // Then
        assertNotNull(results);
        assertTrue(results.isEmpty());
    }
}`}
        />

        <TipBox type="info" title="集成测试要点">
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>• <strong>真实环境</strong>：使用真实的数据库、消息队列等</li>
            <li>• <strong>Testcontainers</strong>：自动启动Docker容器</li>
            <li>• <strong>快速启动</strong>：容器复用，避免重复启动</li>
            <li>• <strong>数据隔离</strong>：每个测试独立的数据集</li>
            <li>• <strong>清理资源</strong>：测试后清理容器和数据</li>
          </ul>
        </TipBox>
      </section>

      <section className="content-section">
        <SectionHeader number={3} title="端到端测试" />

        <h3 className="text-xl font-semibold text-gray-900 mb-4">3.1 REST Assured API 测试</h3>
        <CodeBlock
          language="java"
          filename="ApiE2ETest.java"
          title="Java - E2E API测试"
          code={`package com.example.langchain4j.e2e;

import io.restassured.http.ContentType;
import io.restassured.response.ValidatableResponse;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.utility.DockerImageName;

import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

/**
 * API 端到端测试
 * 使用REST Assured测试完整的HTTP API
 */
class ApiE2ETest {

    static GenericContainer<?> appContainer;

    @BeforeAll
    static void startApp() {
        appContainer = new GenericContainer<>(
            DockerImageName.parse("langchain4j-app:latest")
        )
            .withExposedPorts(8080)
            .withEnv("OPENAI_API_KEY", "mock-key")
            .withEnv("DB_HOST", "postgres");

        appContainer.start();
        
        // 配置REST Assured
        baseURI = "http://" + appContainer.getHost();
        port = appContainer.getFirstMappedPort();
    }

    @Test
    void testCompleteChatFlow() {
        // 完整的聊天流程测试
        
        // 1. 发送聊天请求
        ValidatableResponse response = given()
            .contentType(ContentType.JSON)
            .body("{ \\"message\\": \\"你好\\" }")
        .when()
            .post("/api/chat")
        .then()
            .statusCode(200)
            .body("message", notNull())
            .body("timestamp", notNull());

        // 2. 验证响应
        String message = response.extract().path("message");
        assertTrue(message.length() > 0);
        assertFalse(message.contains("mock"));  // 不应该包含mock字样
    }

    @Test
    void testErrorHandling() {
        // 测试错误处理
        
        // 空消息
        given()
            .contentType(ContentType.JSON)
            .body("{ \\"message\\": \\"\\" }")
        .when()
            .post("/api/chat")
        .then()
            .statusCode(400)
            .body("message", containsString("不能为空"));

        // 无效JSON
        given()
            .contentType(ContentType.JSON)
            .body("{ invalid }")
        .when()
            .post("/api/chat")
        .then()
            .statusCode(400);

        // 不支持的HTTP方法
        given()
            .get("/api/chat")
        .then()
            .statusCode(405);
    }

    @Test
    void testRagFlow() {
        // 测试RAG流程
        
        // 1. 上传文档
        given()
            .contentType(ContentType.MULTIPART)
            .multiPart("file", "test.txt", "测试文档内容".getBytes())
        .when()
            .post("/api/documents")
        .then()
            .statusCode(201)
            .body("documentId", notNull());

        // 2. 等待处理完成
        given()
            .get("/api/documents/status/doc-123")
        .then()
            .statusCode(200)
            .body("status", is("completed"));

        // 3. 搜索文档
        given()
            .contentType(ContentType.JSON)
            .body("{ \\"query\\": \\"测试\\" }")
        .when()
            .post("/api/search")
        .then()
            .statusCode(200)
            .body("results", hasSize(greaterThan(0)));
    }
}`}
        />

        <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">3.2 Playwright UI 测试</h3>
        <CodeBlock
          language="java"
          filename="ChatUiE2ETest.java"
          title="Java - UI E2E测试"
          code={`package com.example.langchain4j.e2e;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.WaitForSelectorState;
import org.junit.jupiter.api.*;

import static org.junit.jupiter.api.Assertions.*;

/**
 * UI 端到端测试
 * 使用Playwright测试Web UI
 */
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class ChatUiE2ETest {

    private Browser browser;
    private Page page;
    private static final String APP_URL = "http://localhost:3000";

    @BeforeAll
    void setUp() {
        // 启动浏览器
        browser = BrowserType.CHROMIUM.launch(
            new BrowserType.LaunchOptions().setHeadless(false)
        );
        
        // 创建新页面
        page = browser.newPage();
        page.navigate(APP_URL);
    }

    @AfterAll
    void tearDown() {
        if (browser != null) {
            browser.close();
        }
    }

    @Test
    void testChatUI_完整流程() {
        // 1. 验证页面加载
        assertEquals("LangChain4j Chat", page.title());
        
        // 2. 输入消息
        page.fill("input#message-input", "你好");
        
        // 3. 点击发送按钮
        page.click("button#send-button");
        
        // 4. 等待AI响应
        page.waitForSelector(".ai-message", new WaitForSelectorState().setState("visible"));
        
        // 5. 验证AI消息显示
        String aiMessage = page.textContent(".ai-message");
        assertNotNull(aiMessage);
        assertFalse(aiMessage.isEmpty());
        
        // 6. 截图（用于调试）
        page.screenshot(new Page.ScreenshotOptions().setPath("screenshots/chat-test.png"));
    }

    @Test
    void testChatUI_输入验证() {
        // 1. 测试空消息
        page.fill("input#message-input", "");
        page.click("button#send-button");
        
        // 验证错误提示
        assertTrue(page.isVisible(".error-message"));
        
        // 2. 测试超长消息
        String longMessage = "A".repeat(5000);
        page.fill("input#message-input", longMessage);
        
        // 验证字符计数显示
        String countText = page.textContent(".char-count");
        assertTrue(countText.contains("5000/4000"));
    }

    @Test
    void testChatUI_历史记录() {
        // 1. 发送多条消息
        String[] messages = {"消息1", "消息2", "消息3"};
        
        for (String msg : messages) {
            page.fill("input#message-input", msg);
            page.click("button#send-button");
            page.waitForSelector(".ai-message");
        }
        
        // 2. 验证历史记录显示
        var chatMessages = page.locator(".chat-message");
        assertEquals(6, chatMessages.count());  // 3个用户消息 + 3个AI消息
        
        // 3. 验证消息顺序
        String firstUserMsg = chatMessages.nth(0).textContent();
        assertEquals("消息1", firstUserMsg);
    }

    @Test
    void testChatUI_响应式设计() {
        // 1. 测试桌面视图
        page.setViewportSize(1920, 1080);
        assertTrue(page.isVisible(".chat-container"));
        assertTrue(page.isVisible(".sidebar"));
        
        // 2. 测试移动视图
        page.setViewportSize(375, 667);
        assertFalse(page.isVisible(".sidebar"));  // 侧边栏隐藏
        assertTrue(page.isVisible(".mobile-menu-button"));
        
        // 3. 点击移动菜单
        page.click(".mobile-menu-button");
        assertTrue(page.isVisible(".sidebar.mobile-open"));
    }

    @Test
    void testChatUI_性能() {
        // 1. 测量页面加载时间
        long startTime = System.currentTimeMillis();
        page.reload();
        long loadTime = System.currentTimeMillis() - startTime;
        
        assertTrue(loadTime < 3000, "页面加载应该在3秒内完成");
        
        // 2. 测量消息发送时间
        page.fill("input#message-input", "测试");
        startTime = System.currentTimeMillis();
        page.click("button#send-button");
        page.waitForSelector(".ai-message");
        long responseTime = System.currentTimeMillis() - startTime;
        
        assertTrue(responseTime < 5000, "AI响应应该在5秒内完成");
    }
}`}
        />
      </section>

      <section className="content-section">
        <SectionHeader number={4} title="测试覆盖率与CI/CD" />

        <h3 className="text-xl font-semibold text-gray-900 mb-4">4.1 Maven 配置</h3>
        <CodeBlock
          language="xml"
          filename="pom.xml"
          title="XML - 测试插件配置"
          code={`<project>
    <build>
        <plugins>
            <!-- JaCoCo 代码覆盖率 -->
            <plugin>
                <groupId>org.jacoco</groupId>
                <artifactId>jacoco-maven-plugin</artifactId>
                <version>0.8.11</version>
                <executions>
                    <execution>
                        <goals>
                            <goal>prepare-agent</goal>
                        </goals>
                    </execution>
                    <execution>
                        <id>report</id>
                        <phase>test</phase>
                        <goals>
                            <goal>report</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>

            <!-- Surefire 单元测试 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.2.5</version>
                <configuration>
                    <includes>
                        <include>**/*Test.java</include>
                    </includes>
                    <excludes>
                        <exclude>**/*IntegrationTest.java</exclude>
                        <exclude>**/*E2ETest.java</exclude>
                    </excludes>
                </configuration>
            </plugin>

            <!-- Failsafe 集成测试 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-failsafe-plugin</artifactId>
                <version>3.2.5</version>
                <executions>
                    <execution>
                        <goals>
                            <goal>integration-test</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>

    <reporting>
        <plugins>
            <plugin>
                <groupId>org.jacoco</groupId>
                <artifactId>jacoco-maven-plugin</artifactId>
                <reportSets>
                    <reportSet>
                        <reports>
                            <report>html</report>
                            <report>xml</report>
                        </reports>
                    </reportSet>
                </reportSets>
            </plugin>
        </plugins>
    </reporting>
</project>`}
        />

        <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">4.2 GitHub Actions CI</h3>
        <CodeBlock
          language="yaml"
          filename=".github/workflows/ci.yml"
          title="YAML - CI/CD配置"
          code={`name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: pgvector/pgvector:pg16
        env:
          POSTGRES_DB: testdb
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - name: Checkout代码
        uses: actions/checkout@v3

      - name: 设置JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: 'maven'

      - name: 编译
        run: mvn clean compile -DskipTests

      - name: 单元测试
        run: mvn test

      - name: 集成测试
        run: mvn verify -DskipUTs
        env:
          DB_HOST: localhost
          DB_PORT: 5432

      - name: 生成覆盖率报告
        run: mvn jacoco:report

      - name: 上传覆盖率到Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./target/site/jacoco/jacoco.xml
          fail_ci_if_error: false

      - name: 构建Docker镜像
        run: docker build -t langchain4j-app:\${{ github.sha }} .

      - name: 运行E2E测试
        run: |
          docker run -d -p 8080:8080 \\
            -e OPENAI_API_KEY=test-key \\
            -e DB_HOST=host.docker.internal \\
            langchain4j-app:\${{ github.sha }}
          docker run --rm \\
            -v $(pwd)/tests:/tests \\
            maven:3.9-eclipse-temurin-17 \\
            mvn test -Dtest="*E2ETest"

  quality:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout代码
        uses: actions/checkout@v3

      - name: 设置JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: 运行Checkstyle
        run: mvn checkstyle:check

      - name: 运行SpotBugs
        run: mvn spotbugs:check

      - name: 运行PMD
        run: mvn pmd:check

      - name: SonarCloud扫描
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: \${{ secrets.SONAR_TOKEN }}
        run: mvn sonar:sonar

  security:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout代码
        uses: actions/checkout@v3

      - name: 运行OWASP Dependency Check
        run: mvn org.owasp:dependency-check-maven:check

      - name: Trivy漏洞扫描
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: 上传Trivy结果到GitHub Security
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'`}
        />

        <TipBox type="info" title="测试最佳实践">
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>• <strong>测试金字塔</strong>：70%单元测试，20%集成测试，10%E2E测试</li>
            <li>• <strong>快速反馈</strong>：单元测试在30秒内完成，集成测试在5分钟内</li>
            <li>• <strong>并行执行</strong>：使用多线程加速测试执行</li>
            <li>• <strong>覆盖率要求</strong>：核心模块&gt;80%，整体&gt;60%</li>
            <li>• <strong>持续集成</strong>：每次提交自动运行测试</li>
          </ul>
        </TipBox>
      </section>

      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">🎯 测试策略总结</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-white/20 rounded-lg p-5">
            <div className="text-2xl mb-3">🧪</div>
            <div className="font-semibold mb-2">单元测试</div>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• JUnit 5</li>
              <li>• Mockito</li>
              <li>• Mock AI模型</li>
            </ul>
          </div>
          <div className="border border-white/20 rounded-lg p-5">
            <div className="text-2xl mb-3">🔗</div>
            <div className="font-semibold mb-2">集成测试</div>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• Spring Boot Test</li>
              <li>• Testcontainers</li>
              <li>• 真实数据库</li>
            </ul>
          </div>
          <div className="border border-white/20 rounded-lg p-5">
            <div className="text-2xl mb-3">🎯</div>
            <div className="font-semibold mb-2">E2E测试</div>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• REST Assured</li>
              <li>• Playwright</li>
              <li>• 完整流程</li>
            </ul>
          </div>
          <div className="border border-white/20 rounded-lg p-5">
            <div className="text-2xl mb-3">📊</div>
            <div className="font-semibold mb-2">覆盖率</div>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• JaCoCo</li>
              <li>• SonarQube</li>
              <li>• Codecov</li>
            </ul>
          </div>
          <div className="border border-white/20 rounded-lg p-5">
            <div className="text-2xl mb-3">🔄</div>
            <div className="font-semibold mb-2">CI/CD</div>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• GitHub Actions</li>
              <li>• 自动化测试</li>
              <li>• Docker集成</li>
            </ul>
          </div>
          <div className="border border-white/20 rounded-lg p-5">
            <div className="text-2xl mb-3">🔒</div>
            <div className="font-semibold mb-2">安全测试</div>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• OWASP</li>
              <li>• Trivy</li>
              <li>• 依赖扫描</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-white/20">
          <p className="text-lg mb-2">📚 <strong>下一章：性能优化</strong></p>
          <p className="text-sm opacity-90">学习LangChain4j应用的性能优化技巧，包括缓存策略、异步处理、批量操作等</p>
          <a href="/performance-tuning" className="inline-block mt-3 px-6 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            继续学习 →
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default TestingStrategiesPage;
