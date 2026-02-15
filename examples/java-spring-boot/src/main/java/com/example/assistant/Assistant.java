package com.example.assistant;

import dev.langchain4j.service.system.SystemMessage;
import dev.langchain4j.service.spring.AiService;

/**
 * AI 助手接口 - 使用 LangChain4j 的声明式 AI 服务
 *
 * 这个接口演示了 LangChain4j 的核心概念：
 * - @AiService: 声明式AI服务，LangChain4j自动生成实现
 * - @SystemMessage: 定义AI助手的行为和角色
 *
 * 使用方式：
 * Assistant assistant = AiServices.builder(Assistant.class)
 *     .chatModel(chatModel)
 *     .build();
 *
 * String response = assistant.chat("你好");
 */
@AiService
public interface Assistant {

    /**
     * 与AI助手进行对话
     *
     * @param userMessage 用户的消息
     * @return AI助手的回复
     */
    @SystemMessage("你是一个友好、专业的AI助手。用中文回答用户的问题，保持简洁和准确。")
    String chat(String userMessage);

    /**
     * 让AI助手总结文本
     *
     * @param text 需要总结的文本
     * @return 文本的总结
     */
    @SystemMessage("请用中文简洁地总结以下文本，不超过100字")
    String summarize(String text);
}
