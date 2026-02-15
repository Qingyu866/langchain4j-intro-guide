package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * LangChain4j Spring Boot 示例应用
 *
 * 该应用演示了如何使用LangChain4j与Spring Boot集成
 * 包含基本的聊天机器人、工具调用和RAG功能示例
 *
 * @author LangChain4j Examples
 * @version 1.0.0
 */
@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
        System.out.println("\n========================================");
        System.out.println("LangChain4j Spring Boot Examples 启动成功!");
        System.out.println("访问 http://localhost:8080 查看示例");
        System.out.println("========================================\n");
    }
}
