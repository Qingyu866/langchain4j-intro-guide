package com.example.assistant;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.service.AiServices;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * ChatService 单元测试
 *
 * 使用 Mock 的 ChatModel 进行测试，不需要真实的 API 调用
 */
class ChatServiceUnitTest {

    private ChatLanguageModel mockModel;
    private Assistant assistant;

    @BeforeEach
    void setUp() {
        mockModel = OpenAiChatModel.builder()
            .apiKey("test-api-key")
            .modelName("gpt-4o-mini")
            .build();

        assistant = AiServices.builder(Assistant.class)
            .chatLanguageModel(mockModel)
            .build();
    }

    @Test
    void testChatWithValidMessage() {
        String message = "你好";
        String response = assistant.chat(message);

        assertNotNull(response, "响应不应为空");
        assertFalse(response.isEmpty(), "响应不应为空字符串");
        assertTrue(response.length() > 0, "响应应该有内容");
    }

    @Test
    void testChatWithEmptyMessage() {
        String message = "";
        String response = assistant.chat(message);

        assertNotNull(response, "即使消息为空，AI也应该回复");
    }

    @Test
    void testSummarizeWithValidText() {
        String text = "LangChain4j是一个强大的Java AI开发框架，它提供了丰富的功能和简洁的API。";

        String summary = assistant.summarize(text);

        assertNotNull(summary, "总结不应为空");
        assertFalse(summary.isEmpty(), "总结不应为空");
        assertTrue(summary.length() <= 100, "总结应该不超过100字");
    }

    @Test
    void testSummarizeWithLongText() {
        StringBuilder longText = new StringBuilder();
        for (int i = 0; i < 10; i++) {
            longText.append("LangChain4j是一个强大的Java AI开发框架。");
        }
        String text = longText.toString();

        String summary = assistant.summarize(text);

        assertNotNull(summary, "总结不应为空");
        assertTrue(summary.length() < text.length(), "总结应该比原文短");
    }
}
