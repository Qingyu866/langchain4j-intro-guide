package com.example.controller;

import com.example.assistant.Assistant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 聊天控制器
 *
 * 提供RESTful API端点与AI助手交互
 * 包含错误处理和日志记录
 */
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private static final Logger log = LoggerFactory.getLogger(ChatController.class);

    private final Assistant assistant;

    public ChatController(Assistant assistant) {
        this.assistant = assistant;
    }

    /**
     * 简单的聊天端点
     *
     * POST /api/chat
     * {
     *   "message": "你好"
     * }
     *
     * @param request 包含用户消息的请求体
     * @return AI助手的回复
     */
    @PostMapping
    public Map<String, String> chat(@RequestBody Map<String, String> request) {
        String message = request.get("message");

        if (message == null || message.trim().isEmpty()) {
            log.warn("收到空消息");
            throw new IllegalArgumentException("消息不能为空");
        }

        try {
            log.info("处理用户消息: {}", message);
            String response = assistant.chat(message);
            log.info("AI回复: {}", response);

            Map<String, String> result = new HashMap<>();
            result.put("message", message);
            result.put("response", response);
            return result;

        } catch (Exception e) {
            log.error("处理聊天请求时出错: message={}", message, e);
            throw new RuntimeException("处理请求失败，请稍后重试", e);
        }
    }

    /**
     * 文本总结端点
     *
     * POST /api/chat/summarize
     * {
     *   "text": "长文本内容..."
     * }
     *
     * @param request 包含需要总结的文本
     * @return 总结后的文本
     */
    @PostMapping("/summarize")
    public Map<String, String> summarize(@RequestBody Map<String, String> request) {
        String text = request.get("text");

        if (text == null || text.trim().isEmpty()) {
            log.warn("收到空文本");
            throw new IllegalArgumentException("文本不能为空");
        }

        try {
            log.info("总结文本，长度: {} 字符", text.length());
            String summary = assistant.summarize(text);
            log.info("总结完成，长度: {} 字符", summary.length());

            Map<String, String> result = new HashMap<>();
            result.put("original", text);
            result.put("summary", summary);
            return result;

        } catch (Exception e) {
            log.error("总结文本时出错: textLength={}", text.length(), e);
            throw new RuntimeException("总结失败，请稍后重试", e);
        }
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok", "service", "langchain4j-chat");
    }
}
