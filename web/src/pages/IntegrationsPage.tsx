import Layout from '../components/layout/Layout';
import { SectionHeader, CodeBlockWithCopy, TipBox } from '../components/ui';

const IntegrationsPage = () => {
  return (
    <Layout>
      <div className="flex items-center gap-3 mb-8 text-sm">
        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">2025-02-14</span>
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">框架集成</span>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">中级难度</span>
      </div>

      <h1 className="text-5xl font-bold text-gray-900 mb-6">LangChain4j 框架集成</h1>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 集成概览</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-teal-50 border border-green-100 rounded-xl p-6">
            <div className="text-3xl mb-3">🍃</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Spring Boot</h3>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• 自动配置</li>
              <li>• 依赖注入</li>
              <li>• AOP支持</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 rounded-xl p-6">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quarkus</h3>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• CDI集成</li>
              <li>• 原生镜像</li>
              <li>• 快速启动</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
            <div className="text-3xl mb-3">🔄</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">消息队列</h3>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• Kafka集成</li>
              <li>• RabbitMQ</li>
              <li>• 异步处理</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-6">
            <div className="text-3xl mb-3">💾</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">数据存储</h3>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• PostgreSQL</li>
              <li>• Redis缓存</li>
              <li>• 向量数据库</li>
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
              <li>• 掌握 LangChain4j 与 Spring Boot 的深度集成</li>
              <li>• 学习 Quarkus 原生集成和优化</li>
              <li>• 理解消息队列异步处理模式</li>
              <li>• 掌握 Redis 缓存集成策略</li>
              <li>• 了解向量数据库最佳实践</li>
            </ul>
          </div>
        </div>
      </div>

      <section className="content-section">
        <SectionHeader number={1} title="Spring Boot 集成" />

        <h3 className="text-xl font-semibold text-gray-900 mb-4">1.1 依赖配置</h3>
        <CodeBlockWithCopy
          language="xml"
          filename="pom.xml"
          title="Maven依赖"
          code={`<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
    </parent>

    <groupId>com.example</groupId>
    <artifactId>langchain4j-spring-boot</artifactId>
    <version>1.0.0</version>

    <properties>
        <java.version>17</java.version>
        <langchain4j.version>0.36.2</langchain4j.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring Boot Data JPA -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- Spring Boot Data Redis -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>

        <!-- LangChain4j Spring Boot Starter -->
        <dependency>
            <groupId>dev.langchain4j</groupId>
            <artifactId>langchain4j-spring-boot-starter</artifactId>
            <version>\${langchain4j.version}</version>
        </dependency>

        <!-- LangChain4j OpenAI -->
        <dependency>
            <groupId>dev.langchain4j</groupId>
            <artifactId>langchain4j-open-ai</artifactId>
            <version>\${langchain4j.version}</version>
        </dependency>

        <!-- PostgreSQL Driver -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
        </dependency>

        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>`}
        />

        <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">1.2 application.yml配置</h3>
        <CodeBlockWithCopy
          language="yaml"
          filename="application.yml"
          title="应用配置"
          code={`spring:
  application:
    name: langchain4j-app

  # 数据库配置
  datasource:
    url: jdbc:postgresql://localhost:5432/langchain4j
    username: postgres
    password: \${DB_PASSWORD}
    driver-class-name: org.postgresql.Driver

  # JPA配置
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect

  # Redis配置
  data:
    redis:
      host: localhost
      port: 6379
      password: \${REDIS_PASSWORD}
      database: 0
      timeout: 5000ms

  # 缓存配置
  cache:
    type: redis
    redis:
      time-to-live: 3600000  # 1小时

# LangChain4j配置
langchain4j:
  # OpenAI配置
  open-ai:
    chat-model:
      api-key: \${OPENAI_API_KEY}
      model-name: gpt-4
      temperature: 0.7
      max-tokens: 1000
      timeout: 60s
    embedding-model:
      api-key: \${OPENAI_API_KEY}
      model-name: text-embedding-3-small
      dimension: 1536

# 服务器配置
server:
  port: 8080

# 日志配置
logging:
  level:
    com.example: DEBUG
    dev.langchain4j: INFO
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} - %msg%n"

# Actuator监控
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  metrics:
    export:
      prometheus:
        enabled: true`}
        />

        <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">1.3 AI服务组件</h3>
        <CodeBlockWithCopy
          language="java"
          filename="ChatService.java"
          title="Spring Bean定义"
          code={`package com.example.langchain4j.service;

import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.spring.AiService;
import org.springframework.stereotype.Service;

/**
 * 聊天AI服务
 * 使用@AiService注解自动注册为Spring Bean
 */
@Service
@AiService
public class ChatService {

    /**
     * 系统消息：定义AI的角色和行为
     */
    @SystemMessage("""
        你是一个友好的AI助手。
        用简洁、有用的方式回答用户问题。
        如果不确定，诚实地说"我不知道"。
        """)
    
    /**
     * 聊天方法
     * @param userMessage 用户消息
     * @return AI回复
     */
    public String chat(String userMessage);
}

/**
 * RAG服务
 * 结合向量搜索和知识库
 */
@Service
@AiService
public class RagService {

    @SystemMessage("""
        你是一个智能问答助手。
        请基于提供的上下文信息回答用户的问题。
        如果上下文中没有相关信息，请诚实地说"我不知道"。
        不要编造答案。
        """)
    
    /**
     * 基于上下文回答问题
     */
    public String answer(String question, String context);
}`}
        />

        <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">1.4 控制器层</h3>
        <CodeBlockWithCopy
          language="java"
          filename="ChatController.java"
          title="REST API"
          code={`package com.example.langchain4j.controller;

import com.example.langchain4j.model.ChatRequest;
import com.example.langchain4j.model.ChatResponse;
import com.example.langchain4j.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

/**
 * 聊天控制器
 * 提供REST API接口
 */
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    /**
     * 发送聊天消息
     */
    @PostMapping
    public ResponseEntity<ChatResponse> chat(
        @Valid @RequestBody ChatRequest request
    ) {
        String response = chatService.chat(request.getMessage());
        
        return ResponseEntity.ok(ChatResponse.builder()
            .message(response)
            .timestamp(System.currentTimeMillis())
            .build());
    }

    /**
     * 健康检查
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Chat service is running");
    }
}

/**
 * 请求模型
 */
@Data
class ChatRequest {
    @NotBlank(message = "消息不能为空")
    @Size(max = 4000, message = "消息长度不能超过4000字符")
    private String message;
}

/**
 * 响应模型
 */
@Data
@Builder
class ChatResponse {
    private String message;
    private long timestamp;
}`}
        />

        <TipBox type="success" title="Spring Boot集成优势">
          <ul className="text-green-800 space-y-1 text-sm">
            <li><strong>自动配置</strong>：langchain4j-spring-boot-starter自动配置所有组件</li>
            <li><strong>依赖注入</strong>：使用@Autowired或构造函数注入AI服务</li>
            <li><strong>配置外部化</strong>：通过application.yml管理所有配置</li>
            <li><strong>健康检查</strong>：集成Spring Boot Actuator监控</li>
          </ul>
        </TipBox>
      </section>

      <section className="content-section">
        <SectionHeader number={2} title="Quarkus 集成" />

        <h3 className="text-xl font-semibold text-gray-900 mb-4">2.1 依赖配置</h3>
        <CodeBlockWithCopy
          language="xml"
          filename="pom.xml"
          title="Quarkus Maven配置"
          code={`<?xml version="1.0"?>
<project>
    <modelVersion>4.0.0</modelVersion>
    
    <groupId>com.example</groupId>
    <artifactId>langchain4j-quarkus</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    
    <properties>
        <compiler-plugin.version>3.11.0</compiler-plugin.version>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <langchain4j.version>0.36.2</langchain4j.version>
        <quarkus.platform.artifact-id>quarkus-bom</quarkus.platform.artifact-id>
        <quarkus.platform.group-id>io.quarkus.platform</quarkus.platform.group-id>
    </properties>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>\${quarkus.platform.group-id}</groupId>
                <artifactId>\${quarkus.platform.artifact-id}</artifactId>
                <version>3.8.1</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <dependencies>
        <!-- Quarkus REST -->
        <dependency>
            <groupId>io.quarkus</groupId>
            <artifactId>quarkus-rest-jackson</artifactId>
        </dependency>

        <!-- Quarkus Hibernate ORM -->
        <dependency>
            <groupId>io.quarkus</groupId>
            <artifactId>quarkus-hibernate-orm</artifactId>
        </dependency>

        <!-- Quarkus PostgreSQL -->
        <dependency>
            <groupId>io.quarkus</groupId>
            <artifactId>quarkus-jdbc-postgresql</artifactId>
        </dependency>

        <!-- LangChain4j -->
        <dependency>
            <groupId>dev.langchain4j</groupId>
            <artifactId>langchain4j-open-ai</artifactId>
            <version>\${langchain4j.version}</version>
        </dependency>

        <!-- LangChain4j Quarkus Extension -->
        <dependency>
            <groupId>io.quarkiverse.langchain4j</groupId>
            <artifactId>quarkus-langchain4j-openai</artifactId>
            <version>0.15.0</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>io.quarkus</groupId>
                <artifactId>quarkus-maven-plugin</artifactId>
                <version>3.8.1</version>
                <executions>
                    <execution>
                        <goals>
                            <goal>build</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>`}
        />

        <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">2.2 application.properties</h3>
        <CodeBlockWithCopy
          language="properties"
          filename="application.properties"
          title="Quarkus配置"
          code={`# Application配置
quarkus.application.name=langchain4j-quarkus
quarkus.http.port=8080

# OpenAI配置
quarkus.langchain4j.openai.api-key=\${OPENAI_API_KEY}
quarkus.langchain4j.openai.chat-model.model-name=gpt-4
quarkus.langchain4j.openai.chat-model.temperature=0.7
quarkus.langchain4j.openai.chat-model.max-tokens=1000

# 数据库配置
quarkus.datasource.jdbc.url=jdbc:postgresql://localhost:5432/langchain4j
quarkus.datasource.username=postgres
quarkus.datasource.password=\${DB_PASSWORD}
quarkus.datasource.db-kind=postgresql

# Hibernate ORM配置
quarkus.hibernate-orm.database.generation=update
quarkus.hibernate-orm.log.sql=true

# 日志配置
quarkus.log.level=INFO
quarkus.log.category."com.example".level=DEBUG
quarkus.log.category."dev.langchain4j".level=INFO

# 构建配置（原生镜像）
quarkus.native.enabled=false
quarkus.package.type=fast-jar`}
        />

        <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">2.3 CDI Bean定义</h3>
        <CodeBlockWithCopy
          language="java"
          filename="ChatService.java"
          title="CDI Bean"
          code={`package com.example.langchain4j.service;

import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.spring.AiService;
import io.quarkus.langchain4j.RegisterAiService;
import jakarta.enterprise.context.ApplicationScoped;

/**
 * 聊天服务
 * 使用@ApplicationScoped注解注册为CDI Bean
 */
@ApplicationScoped
@RegisterAiService
public class ChatService {

    @SystemMessage("""
        你是一个友好的AI助手。
        用简洁、有用的方式回答用户问题。
        """)
    
    public String chat(@UserMessage String userMessage);
}

/**
 * REST资源
 */
@ApplicationScoped
@Path("/api/chat")
public class ChatResource {

    @Inject
    ChatService chatService;

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response chat(ChatRequest request) {
        String response = chatService.chat(request.getMessage());
        
        return Response.ok(ChatResponse.builder()
            .message(response)
            .timestamp(System.currentTimeMillis())
            .build())
            .build();
    }

    @GET
    @Path("/health")
    @Produces(MediaType.TEXT_PLAIN)
    public String health() {
        return "Chat service is running";
    }
}

/**
 * 请求DTO
 */
public record ChatRequest(String message) {}

/**
 * 响应DTO
 */
public record ChatResponse(String message, long timestamp) {}`}
        />

        <TipBox type="info" title="Quarkus优势">
          <ul className="text-blue-800 space-y-1 text-sm">
            <li><strong>原生编译</strong>：编译为本地可执行文件，启动时间&lt;0.1秒</li>
            <li><strong>低内存占用</strong>：原生镜像内存占用仅为JVM的1/10</li>
            <li><strong>快速开发</strong>：开发模式下支持热重载</li>
            <li><strong>云原生</strong>：完美适配Kubernetes和Serverless</li>
          </ul>
        </TipBox>
      </section>

      <section className="content-section">
        <SectionHeader number={3} title="消息队列集成" />

        <h3 className="text-xl font-semibold text-gray-900 mb-4">3.1 Kafka异步处理</h3>
        <CodeBlockWithCopy
          language="java"
          filename="KafkaConfig.java"
          title="Kafka配置"
          code={`package com.example.langchain4j.config;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Kafka配置
 */
@Configuration
@EnableKafka
public class KafkaConfig {

    @Value("\${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    /**
     * 生产者配置
     */
    @Bean
    public ProducerFactory<String, String> producerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        config.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        config.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        config.put(ProducerConfig.ACKS_CONFIG, "all");
        config.put(ProducerConfig.RETRIES_CONFIG, 3);
        return new DefaultKafkaProducerFactory<>(config);
    }

    @Bean
    public KafkaTemplate<String, String> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }

    /**
     * 消费者配置
     */
    @Bean
    public ConsumerFactory<String, String> consumerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        config.put(ConsumerConfig.GROUP_ID_CONFIG, "langchain4j-group");
        config.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        config.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        config.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        return new DefaultKafkaConsumerFactory<>(config);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, String> kafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, String> factory = 
            new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        return factory;
    }
}`}
        />

        <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">3.2 Kafka生产者与消费者</h3>
        <CodeBlockWithCopy
          language="java"
          filename="KafkaProducerService.java"
          title="消息生产与消费"
          code={`package com.example.langchain4j.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

/**
 * Kafka生产者服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaProducerService {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 发送聊天请求
     */
    public void sendChatRequest(String topic, String requestId, ChatRequest request) {
        try {
            String message = objectMapper.writeValueAsString(request);
            kafkaTemplate.send(topic, requestId, message);
            
            log.info("消息已发送: topic={}, requestId={}", topic, requestId);
        } catch (Exception e) {
            log.error("发送消息失败: topic={}, requestId={}", topic, requestId, e);
            throw new RuntimeException("发送消息失败", e);
        }
    }
}

/**
 * Kafka消费者服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaConsumerService {

    private final ChatService chatService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 监听聊天请求主题
     */
    @KafkaListener(
        topics = "chat-requests",
        groupId = "langchain4j-group",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void processChatRequest(
        @Payload String message,
        @Header(KafkaHeaders.RECEIVED_KEY) String requestId,
        Acknowledgment acknowledgment
    ) {
        log.info("收到消息: requestId={}", requestId);

        try {
            // 1. 解析请求
            ChatRequest request = objectMapper.readValue(message, ChatRequest.class);
            
            // 2. 调用AI生成回复
            String response = chatService.chat(request.getMessage());
            
            // 3. 处理响应
            processResponse(requestId, response);
            
            // 4. 手动提交偏移量
            if (acknowledgment != null) {
                acknowledgment.acknowledge();
            }
            
            log.info("消息处理完成: requestId={}", requestId);
            
        } catch (Exception e) {
            log.error("处理消息失败: requestId={}", requestId, e);
        }
    }

    private void processResponse(String requestId, String response) {
        log.debug("AI回复: requestId={}, response={}", requestId, response);
    }
}

/**
 * 异步聊天控制器
 */
@RestController
@RequestMapping("/api/chat")
public class AsyncChatController {

    private final KafkaProducerService kafkaProducerService;

    @PostMapping("/async")
    public ResponseEntity<Map<String, String>> asyncChat(
        @RequestBody ChatRequest request
    ) {
        String requestId = UUID.randomUUID().toString();
        
        kafkaProducerService.sendChatRequest("chat-requests", requestId, request);
        
        return ResponseEntity.ok(Map.of(
            "requestId", requestId,
            "status", "processing",
            "message", "请求已提交，正在处理中"
        ));
    }
}`}
        />
      </section>

      <section className="content-section">
        <SectionHeader number={4} title="数据存储集成" />

        <h3 className="text-xl font-semibold text-gray-900 mb-4">4.1 PostgreSQL向量存储</h3>
        <CodeBlockWithCopy
          language="java"
          filename="PgVectorConfig.java"
          title="PGVector配置"
          code={`package com.example.langchain4j.config;

import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.pgvector.PgVectorEmbeddingStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import jakarta.sql.DataSource;

/**
 * PGVector配置
 * 将向量存储在PostgreSQL中
 */
@Configuration
public class PgVectorConfig {

    @Value("\${pgvector.host}")
    private String host;

    @Value("\${pgvector.port}")
    private int port;

    @Value("\${pgvector.database}")
    private String database;

    @Value("\${pgvector.user}")
    private String user;

    @Value("\${pgvector.password}")
    private String password;

    @Value("\${pgvector.table}")
    private String table;

    /**
     * 创建PGVector嵌入存储
     */
    @Bean
    public PgVectorEmbeddingStore embeddingStore(DataSource dataSource) {
        return PgVectorEmbeddingStore.builder()
            .host(host)
            .port(port)
            .database(database)
            .user(user)
            .password(password)
            .table(table)
            .dimension(1536)  // OpenAI text-embedding-3-small的维度
            .createTable(true)  // 自动创建表
            .dropTableFirst(false)
            .build();
    }
}`}
        />

        <h3 className="text-xl font-semibold text-gray-900 mb-4 mt-8">4.2 Redis缓存集成</h3>
        <CodeBlockWithCopy
          language="java"
          filename="RedisCacheService.java"
          title="Redis缓存服务"
          code={`package com.example.langchain4j.service;

import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingMatch;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;

/**
 * Redis缓存服务
 * 缓存Embedding和搜索结果
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RedisCacheService {

    private final RedisTemplate<String, Object> redisTemplate;

    private static final String EMBEDDING_PREFIX = "embedding:";
    private static final String SEARCH_PREFIX = "search:";
    private static final long CACHE_TTL_HOURS = 1;

    /**
     * 缓存Embedding
     */
    public void cacheEmbedding(String text, double[] embedding) {
        String key = EMBEDDING_PREFIX + generateKey(text);
        redisTemplate.opsForValue().set(key, embedding, CACHE_TTL_HOURS, TimeUnit.HOURS);
        log.debug("Embedding已缓存: key={}", key);
    }

    /**
     * 获取缓存的Embedding
     */
    public double[] getCachedEmbedding(String text) {
        String key = EMBEDDING_PREFIX + generateKey(text);
        double[] embedding = (double[]) redisTemplate.opsForValue().get(key);
        
        if (embedding != null) {
            log.debug("命中Embedding缓存: key={}", key);
        }
        
        return embedding;
    }

    /**
     * 缓存搜索结果
     */
    public void cacheSearchResults(String query, List<EmbeddingMatch<TextSegment>> results) {
        String key = SEARCH_PREFIX + generateKey(query);
        redisTemplate.opsForValue().set(key, results, 30, TimeUnit.MINUTES);
        log.debug("搜索结果已缓存: key={}, results={}", key, results.size());
    }

    /**
     * 获取缓存的搜索结果
     */
    public List<EmbeddingMatch<TextSegment>> getCachedSearchResults(String query) {
        String key = SEARCH_PREFIX + generateKey(query);
        @SuppressWarnings("unchecked")
        List<EmbeddingMatch<TextSegment>> results = 
            (List<EmbeddingMatch<TextSegment>>) redisTemplate.opsForValue().get(key);
        
        if (results != null) {
            log.debug("命中搜索结果缓存: key={}, results={}", key, results.size());
        }
        
        return results;
    }

    private String generateKey(String text) {
        return String.valueOf(text.hashCode());
    }

    public void clearCache(String prefix) {
        Set<String> keys = redisTemplate.keys(prefix + "*");
        if (keys != null && !keys.isEmpty()) {
            redisTemplate.delete(keys);
            log.info("清除缓存: prefix={}, count={}", prefix, keys.size());
        }
    }
}

/**
 * RAG服务集成缓存
 */
@Service
public class RagServiceWithCache {

    private final RedisCacheService cacheService;
    private final EmbeddingStore<TextSegment> embeddingStore;
    private final EmbeddingModel embeddingModel;

    public List<EmbeddingMatch<TextSegment>> search(String query, int topK) {
        // 1. 检查搜索结果缓存
        List<EmbeddingMatch<TextSegment>> cached = cacheService.getCachedSearchResults(query);
        if (cached != null) {
            return cached;
        }

        // 2. 生成查询向量
        double[] queryEmbedding = embeddingModel.embed(query).content();

        // 3. 搜索向量库
        List<EmbeddingMatch<TextSegment>> results = 
            embeddingStore.findRelevant(queryEmbedding, topK);

        // 4. 缓存结果
        cacheService.cacheSearchResults(query, results);

        return results;
    }
}`}
        />
      </section>

      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">🎯 集成总结</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-white/20 rounded-lg p-5">
            <div className="text-2xl mb-3">🍃</div>
            <div className="font-semibold mb-2">Spring Boot</div>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• @AiService自动注册</li>
              <li>• 依赖注入</li>
              <li>• 配置外部化</li>
              <li>• Actuator监控</li>
            </ul>
          </div>
          <div className="border border-white/20 rounded-lg p-5">
            <div className="text-2xl mb-3">⚡</div>
            <div className="font-semibold mb-2">Quarkus</div>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• CDI集成</li>
              <li>• 原生编译</li>
              <li>• 快速启动</li>
              <li>• 低内存占用</li>
            </ul>
          </div>
          <div className="border border-white/20 rounded-lg p-5">
            <div className="text-2xl mb-3">🔄</div>
            <div className="font-semibold mb-2">Kafka</div>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• 异步消息处理</li>
              <li>• 解耦系统</li>
              <li>• 消息持久化</li>
              <li>• 可扩展性</li>
            </ul>
          </div>
          <div className="border border-white/20 rounded-lg p-5">
            <div className="text-2xl mb-3">💾</div>
            <div className="font-semibold mb-2">PostgreSQL</div>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• PGVector扩展</li>
              <li>• 向量存储</li>
              <li>• 数据持久化</li>
              <li>• 事务支持</li>
            </ul>
          </div>
          <div className="border border-white/20 rounded-lg p-5">
            <div className="text-2xl mb-3">🔴</div>
            <div className="font-semibold mb-2">Redis</div>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• 缓存Embedding</li>
              <li>• 缓存搜索结果</li>
              <li>• 会话管理</li>
              <li>• 分布式锁</li>
            </ul>
          </div>
          <div className="border border-white/20 rounded-lg p-5">
            <div className="text-2xl mb-3">🔐</div>
            <div className="font-semibold mb-2">安全实践</div>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• API密钥管理</li>
              <li>• 环境变量</li>
              <li>• 访问控制</li>
              <li>• 数据加密</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-white/20">
          <p className="text-lg mb-2">📚 <strong>下一章：测试策略</strong></p>
          <p className="text-sm opacity-90">学习LangChain4j应用的测试策略，包括单元测试、集成测试和端到端测试</p>
          <a href="/testing-strategies" className="inline-block mt-3 px-6 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            继续学习 →
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default IntegrationsPage;
