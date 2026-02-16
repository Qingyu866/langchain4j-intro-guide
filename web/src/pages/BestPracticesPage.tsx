import Layout from '../components/layout/Layout';
import { Tag, CodeBlockWithCopy, SectionHeader } from '../components/ui';

const BestPracticesPage = () => {
  const projectStructure = `src/main/java/com/example/langchain4j/
├── config/                    # 配置层
│   ├── AiModelConfig.java    # AI模型配置
│   ├── EmbeddingConfig.java  # Embedding配置
│   ├── VectorStoreConfig.java # 向量存储配置
│   └── CacheConfig.java      # 缓存配置
│
├── model/                     # 数据模型层
│   ├── dto/                  # 数据传输对象
│   ├── entity/               # 数据库实体
│   └── vo/                   # 视图对象
│
├── repository/                # 数据访问层
│   ├── DocumentRepository.java
│   ├── ChatRepository.java
│   └── UserRepository.java
│
├── service/                   # 业务逻辑层
│   ├── chat/                 # 聊天服务
│   ├── rag/                  # RAG服务
│   └── ai/                   # AI服务
│
├── controller/                # 控制器层
├── exception/                 # 异常处理
└── util/                      # 工具类`;

  const chatService = `package com.example.langchain4j.service.chat.impl;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final AiAgent aiAgent;
    private final MemoryService memoryService;

    @Override
    public ChatResponse chat(ChatRequest request) {
        log.debug("处理聊天请求: sessionId={}", request.getSessionId());

        try {
            // 1. 获取历史对话上下文
            String context = memoryService.getContext(request.getSessionId());

            // 2. 调用AI生成响应
            String response = aiAgent.generate(
                request.getMessage(),
                context,
                request.getModel()
            );

            // 3. 保存对话历史
            memoryService.saveMessage(
                request.getSessionId(),
                request.getUserId(),
                request.getMessage(),
                response
            );

            return ChatResponse.builder()
                .sessionId(request.getSessionId())
                .message(response)
                .build();

        } catch (Exception e) {
            log.error("聊天处理失败", e);
            throw new ChatException("AI处理失败", e);
        }
    }
}`;

  const httpClientConfig = `@Configuration
public class HttpClientConfig {

    @Value("\${openai.api.timeout.connect:10}")
    private int connectTimeout;

    @Value("\${openai.api.timeout.read:60}")
    private int readTimeout;

    @Bean
    public OkHttpClient okHttpClient() {
        return new OkHttpClient.Builder()
            .connectionPool(new ConnectionPool(
                5,      // 最大空闲连接数
                300,    // 保持存活时间（秒）
                TimeUnit.SECONDS
            ))
            .connectTimeout(connectTimeout, TimeUnit.SECONDS)
            .readTimeout(readTimeout, TimeUnit.SECONDS)
            .addInterceptor(new RetryInterceptor())
            .build();
    }

    @Bean
    public OpenAiChatModel chatLanguageModel(OkHttpClient httpClient) {
        return OpenAiChatModel.builder()
            .apiKey(System.getenv("OPENAI_API_KEY"))
            .modelName("gpt-4")
            .client(httpClient)
            .build();
    }
}`;

  const errorHandling = `@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AiServiceException.class)
    public ResponseEntity<ErrorResponse> handleAiException(AiServiceException e) {
        log.error("AI服务异常", e);
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
            .body(ErrorResponse.of("AI服务暂时不可用，请稍后重试"));
    }

    @ExceptionHandler(RateLimitExceededException.class)
    public ResponseEntity<ErrorResponse> handleRateLimit(RateLimitExceededException e) {
        log.warn("API限流: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
            .body(ErrorResponse.of("请求过于频繁，请稍后重试"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception e) {
        log.error("未知异常", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ErrorResponse.of("服务器内部错误"));
    }
}`;

  const securityConfig = `@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/**").authenticated()
            )
            .addFilterBefore(new RateLimitFilter(), UsernamePasswordAuthenticationFilter.class)
            .addFilterAfter(new InputSanitizationFilter(), RateLimitFilter.class);
        return http.build();
    }
}

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final RateLimiter rateLimiter = RateLimiter.create(10.0); // 10 req/s

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain chain) {
        if (!rateLimiter.tryAcquire()) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            return;
        }
        chain.doFilter(request, response);
    }
}`;

  return (
    <Layout>
      <div className="flex items-center gap-2 mb-4">
        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">2025-02-14</span>
        <Tag variant="green">生产实践</Tag>
        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">高级难度</span>
      </div>

      <h1 className="text-5xl font-bold text-gray-900 mb-6">LangChain4j 最佳实践</h1>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 章节概览</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100 rounded-xl p-6">
            <div className="text-3xl mb-3">🏗️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">架构设计</h3>
            <ul className="text-gray-600 text-sm space-y-1">
              <li> 分层架构模式</li>
              <li> 服务拆分原则</li>
              <li> 模块化设计</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-6">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">性能优化</h3>
            <ul className="text-gray-600 text-sm space-y-1">
              <li> 连接池管理</li>
              <li> 批量处理</li>
              <li> 缓存策略</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-teal-50 border border-green-100 rounded-xl p-6">
            <div className="text-3xl mb-3">🛡️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">安全实践</h3>
            <ul className="text-gray-600 text-sm space-y-1">
              <li> API密钥管理</li>
              <li> 输入验证</li>
              <li> 内容过滤</li>
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
              <li> 掌握 LangChain4j 应用的架构设计原则</li>
              <li> 学习性能优化技巧和最佳实践</li>
              <li> 理解错误处理和容错机制</li>
              <li> 掌握安全防护和合规要求</li>
              <li> 学习监控、日志和调试技巧</li>
              <li> 了解测试策略和CI/CD集成</li>
            </ul>
          </div>
        </div>
      </div>

      <section className="mb-16">
        <SectionHeader number={1} title="架构设计原则" />
        
        <h3 className="subsection-title">1.1 分层架构</h3>
        <CodeBlockWithCopy filename="项目结构">{projectStructure}</CodeBlockWithCopy>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-50 border border-green-100 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-green-600">✅</span> 推荐做法
            </h4>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li> <strong>清晰的职责分离</strong>：Controller负责请求处理，Service负责业务逻辑</li>
              <li> <strong>面向接口编程</strong>：Service层定义接口，便于测试和扩展</li>
              <li> <strong>配置集中管理</strong>：所有AI模型配置统一放在config包</li>
              <li> <strong>异常统一处理</strong>：使用全局异常处理器统一返回</li>
            </ul>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-red-600">❌</span> 避免的做法
            </h4>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li> <strong>在Controller中直接调用AI模型</strong>：应该通过Service层封装</li>
              <li> <strong>硬编码API密钥</strong>：应使用环境变量或配置管理服务</li>
              <li> <strong>Service之间循环依赖</strong>：通过共享Service解耦</li>
              <li> <strong>异常吞掉或直接返回</strong>：应该记录日志并转换错误响应</li>
            </ul>
          </div>
        </div>

        <h3 className="subsection-title">1.2 服务拆分示例</h3>
        <CodeBlockWithCopy filename="ChatServiceImpl.java">{chatService}</CodeBlockWithCopy>
      </section>

      <section className="mb-16">
        <SectionHeader number={2} title="性能优化" />
        
        <h3 className="subsection-title">2.1 连接池管理</h3>
        <CodeBlockWithCopy filename="HttpClientConfig.java">{httpClientConfig}</CodeBlockWithCopy>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3">🔌 连接池配置</h4>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li> 最大空闲连接数：5</li>
              <li> 保持存活时间：300秒</li>
              <li> 连接超时：10秒</li>
              <li> 读取超时：60秒</li>
            </ul>
          </div>
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3">📦 批量处理</h4>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li> 批量向量化文档</li>
              <li> 批量插入向量数据库</li>
              <li> 批量API调用</li>
              <li> 减少网络开销</li>
            </ul>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3">💾 缓存策略</h4>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li> 缓存常用Prompt模板</li>
              <li> 缓存Embedding结果</li>
              <li> 缓存相似查询结果</li>
              <li> 使用Redis分布式缓存</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <SectionHeader number={3} title="错误处理" />
        
        <h3 className="subsection-title">3.1 全局异常处理</h3>
        <CodeBlockWithCopy filename="GlobalExceptionHandler.java">{errorHandling}</CodeBlockWithCopy>

        <div className="bg-amber-50 border border-amber-100 rounded-lg p-6 mb-8">
          <h4 className="font-semibold text-gray-900 mb-3">⚠️ 常见错误类型</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="text-gray-700 space-y-2 text-sm">
              <li> <strong>AiServiceException</strong> - AI服务异常</li>
              <li> <strong>RateLimitExceededException</strong> - API限流</li>
              <li> <strong>TokenLimitExceededException</strong> - Token超限</li>
            </ul>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li> <strong>ModelNotFoundException</strong> - 模型不存在</li>
              <li> <strong>InvalidRequestException</strong> - 请求无效</li>
              <li> <strong>TimeoutException</strong> - 请求超时</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <SectionHeader number={4} title="安全实践" />
        
        <h3 className="subsection-title">4.1 API密钥管理</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-50 border border-green-100 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-green-600">✅</span> 安全做法
            </h4>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li> 使用环境变量存储API密钥</li>
              <li> 使用Vault等密钥管理服务</li>
              <li> 定期轮换API密钥</li>
              <li> 不同环境使用不同密钥</li>
            </ul>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-red-600">❌</span> 危险做法
            </h4>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li> 硬编码API密钥在代码中</li>
              <li> 提交密钥到版本控制</li>
              <li> 在日志中打印密钥</li>
              <li> 在前端暴露密钥</li>
            </ul>
          </div>
        </div>

        <h3 className="subsection-title">4.2 安全配置</h3>
        <CodeBlockWithCopy filename="SecurityConfig.java">{securityConfig}</CodeBlockWithCopy>
      </section>

      <section className="mb-16">
        <SectionHeader number={5} title="监控与日志" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3">📊 监控指标</h4>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li> API调用次数和成功率</li>
              <li> 平均响应时间</li>
              <li> Token使用量</li>
              <li> 错误率和错误类型</li>
              <li> 缓存命中率</li>
            </ul>
          </div>
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3">📝 日志规范</h4>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li> 记录请求ID便于追踪</li>
              <li> 记录用户ID和会话ID</li>
              <li> 记录模型名称和参数</li>
              <li> 记录Token消耗量</li>
              <li> 敏感信息脱敏处理</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <SectionHeader number={6} title="测试策略" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3">🧪 单元测试</h4>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li> Mock LLM响应</li>
              <li> 测试业务逻辑</li>
              <li> 测试异常处理</li>
            </ul>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3">🔗 集成测试</h4>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li> 测试真实API调用</li>
              <li> 测试数据库操作</li>
              <li> 测试缓存功能</li>
            </ul>
          </div>
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3">⚡ 性能测试</h4>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li> 并发压力测试</li>
              <li> 响应时间测试</li>
              <li> 内存使用测试</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">🎯 最佳实践总结</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="text-2xl mb-3">🏗️</div>
            <h4 className="font-semibold mb-2 text-gray-800">架构设计</h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li> 分层架构清晰</li>
              <li> 服务职责单一</li>
              <li> 接口抽象合理</li>
              <li> 配置集中管理</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="text-2xl mb-3">⚡</div>
            <h4 className="font-semibold mb-2 text-gray-800">性能优化</h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li> 连接池复用</li>
              <li> 批量处理请求</li>
              <li> 合理使用缓存</li>
              <li> 异步处理耗时操作</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="text-2xl mb-3">🛡️</div>
            <h4 className="font-semibold mb-2 text-gray-800">安全防护</h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li> 密钥安全存储</li>
              <li> 输入验证过滤</li>
              <li> 速率限制保护</li>
              <li> 日志脱敏处理</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-lg mb-2 text-gray-900">📚 <strong>下一章：测试策略</strong></p>
          <p className="text-sm text-gray-700">深入学习LangChain4j应用的测试方法和策略</p>
        </div>
      </div>
    </Layout>
  );
};

export default BestPracticesPage;
