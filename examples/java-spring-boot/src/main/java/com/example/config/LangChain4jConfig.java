package com.example.config;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

/**
 * LangChain4j 配置类
 *
 * 负责创建和配置 ChatModel Bean
 * 使用环境变量管理敏感信息（API Key）
 */
@Configuration
public class LangChain4jConfig {

    private static final Logger log = LoggerFactory.getLogger(LangChain4jConfig.class);

    @Value("${langchain4j.open-ai.api-key:${OPENAI_API_KEY:}}")
    private String apiKey;

    @Value("${langchain4j.open-ai.model-name:gpt-4o-mini}")
    private String modelName;

    @Value("${langchain4j.open-ai.temperature:0.7}")
    private Double temperature;

    @Value("${langchain4j.open-ai.max-tokens:2000}")
    private Integer maxTokens;

    @Value("${langchain4j.open-ai.timeout:PT60S}")
    private Duration timeout;

    /**
     * 创建 ChatLanguageModel Bean
     *
     * @return 配置好的 ChatLanguageModel 实例
     * @throws IllegalArgumentException 如果 API Key 未配置
     */
    @Bean
    public ChatLanguageModel chatLanguageModel() {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            throw new IllegalArgumentException(
                "OpenAI API Key 未配置。请设置环境变量 OPENAI_API_KEY 或在 application.yml 中配置 langchain4j.open-ai.api-key"
            );
        }

        log.info("初始化 ChatLanguageModel: model={}, temperature={}, maxTokens={}",
                 modelName, temperature, maxTokens);

        return OpenAiChatModel.builder()
            .apiKey(apiKey)
            .modelName(modelName)
            .temperature(temperature)
            .maxTokens(maxTokens)
            .timeout(timeout)
            .logRequests(true)
            .logResponses(true)
            .build();
    }
}
