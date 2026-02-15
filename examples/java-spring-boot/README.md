# LangChain4j Spring Boot 示例

这是一组生产就绪的 LangChain4j 示例项目，演示如何与 Spring Boot 集成。

## 📋 目录结构

```
examples/java-spring-boot/
├── src/
│   ├── main/
│   │   ├── java/com/example/
│   │   │   ├── Application.java           # 应用入口
│   │   │   ├── assistant/                 # AI 服务接口
│   │   │   ├── config/                   # 配置类
│   │   │   ├── controller/                # REST API 控制器
│   │   │   └── tools/                   # 自定义工具
│   │   └── resources/
│   │       └── application.yml            # 应用配置
│   └── test/
│       └── java/com/example/assistant/
│           └── ChatServiceUnitTest.java   # 单元测试
├── pom.xml                               # Maven 配置
└── README.md                             # 本文件
```

## 🚀 快速开始

### 前置要求

- Java 17 或更高版本
- Maven 3.8+
- OpenAI API Key（或其他支持的 LLM 提供商）

### 设置环境变量

创建 `.env` 文件或设置环境变量：

```bash
export OPENAI_API_KEY=your-api-key-here
```

或者修改 `application.yml` 文件：

```yaml
langchain4j:
  open-ai:
    api-key: your-api-key-here
```

### 运行应用

```bash
# 编译
mvn clean compile

# 运行
mvn spring-boot:run
```

应用启动后，访问以下端点：

- `http://localhost:8080/api/chat/health` - 健康检查
- `http://localhost:8080/api/chat` - 聊天接口
- `http://localhost:8080/api/chat/summarize` - 文本总结接口

### 测试 API

使用 curl 测试聊天接口：

```bash
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "你好"}'
```

响应示例：

```json
{
  "message": "你好",
  "response": "你好！有什么可以帮助你的吗？"
}
```

## 🧪 运行测试

### 运行单元测试

```bash
mvn test
```

### 跳过集成测试

```bash
mvn test -DskipTests=false
```

### 运行测试并生成覆盖率报告

```bash
mvn clean test jacoco:report
```

覆盖率报告将在 `target/site/jacoco/index.html` 生成。

## 📚 示例说明

### 1. 基础聊天机器人

演示了最简单的 LangChain4j 使用方式：

- 使用 `@AiService` 注解定义 AI 服务接口
- 使用 `@SystemMessage` 定义系统提示词
- 基本的聊天功能

相关文件：
- `assistant/Assistant.java` - AI 服务接口
- `controller/ChatController.java` - REST API 控制器

### 2. 配置管理

展示了生产级的配置方式：

- 使用环境变量管理敏感信息
- 集中化的配置文件
- 可配置的模型参数（temperature, max-tokens）

相关文件：
- `config/LangChain4jConfig.java` - LangChain4j 配置
- `resources/application.yml` - 应用配置

### 3. 错误处理和日志

展示了生产级的错误处理和日志记录：

- 使用 SLF4J 进行结构化日志记录
- 适当的异常处理
- 输入验证

## 🔧 配置选项

在 `application.yml` 中可以配置以下选项：

| 配置项 | 说明 | 默认值 |
|---------|------|--------|
| `langchain4j.open-ai.api-key` | OpenAI API Key | 环境变量 `OPENAI_API_KEY` |
| `langchain4j.open-ai.model-name` | 使用的模型名称 | `gpt-4o-mini` |
| `langchain4j.open-ai.temperature` | 温度参数 (0.0-1.0) | `0.7` |
| `langchain4j.open-ai.max-tokens` | 最大响应 tokens | `2000` |
| `langchain4j.open-ai.timeout` | 请求超时时间 | `PT60S` |

## 🛠️ 开发指南

### 添加新的 AI 服务

1. 定义接口：

```java
@AiService
public interface MyAssistant {
    @SystemMessage("You are a helpful assistant")
    String help(String question);
}
```

2. 在 Controller 中使用：

```java
@RestController
public class MyController {
    private final MyAssistant assistant;

    public MyController(MyAssistant assistant) {
        this.assistant = assistant;
    }

    @PostMapping("/help")
    public String help(@RequestBody String question) {
        return assistant.help(question);
    }
}
```

### 添加工具（Tool）

1. 创建工具类：

```java
public class Calculator {
    @Tool("Add two numbers")
    double add(@P("First number") double a, @P("Second number") double b) {
        return a + b;
    }
}
```

2. 在 AI 服务中注册：

```java
Assistant assistant = AiServices.builder(Assistant.class)
    .chatLanguageModel(model)
    .tools(new Calculator())
    .build();
```

## 📖 参考文档

- [LangChain4j 官方文档](https://docs.langchain4j.dev/)
- [Spring Boot 集成指南](https://docs.langchain4j.dev/tutorials/spring-boot-integration)
- [项目主页](../../index.html)

## 🐛 故障排除

### 问题：API Key 错误

**错误信息：** `InvalidApiKeyException`

**解决方案：**
- 检查环境变量 `OPENAI_API_KEY` 是否设置
- 确保 API Key 有效且有足够的额度

### 问题：连接超时

**错误信息：** `RequestTimeoutException`

**解决方案：**
- 在 `application.yml` 中增加超时时间：`timeout: PT120S`
- 检查网络连接

## 📄 许可证

本项目仅供学习和演示使用。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

如有问题，请访问 [项目主页](../../index.html) 或提交 Issue。
