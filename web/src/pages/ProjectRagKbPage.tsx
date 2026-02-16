import Layout from '../components/layout/Layout';
import { SectionHeader, CodeBlockWithCopy, TipBox, MermaidChart } from '../components/ui';

const ProjectRagKbPage = () => {
  return (
    <Layout>
      <div className="flex items-center gap-3 mb-8 text-sm">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">实战项目</span>
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">RAG知识库</span>
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">~45分钟</span>
      </div>

      <h1 className="text-5xl font-bold text-gray-900 mb-6">RAG知识库项目实战</h1>
      <p className="text-xl text-gray-600 mb-8 leading-relaxed">
        本章将带你从头构建一个完整的企业级RAG知识库系统。
        我们将使用Spring Boot作为后端框架，整合LangChain4j的RAG能力，
        构建一个可生产部署的知识问答应用。
      </p>

      <div className="bg-gray-50 rounded-lg p-6 mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 项目概览</h2>
        <p className="text-gray-700 mb-4">
          本项目将构建一个完整的知识库系统，包含以下功能：
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="text-2xl mb-3">📄</div>
            <h4 className="font-semibold text-gray-900 mb-2">文档管理</h4>
            <ul className="text-gray-700 text-sm space-y-1 list-disc list-inside">
              <li>文档上传（支持PDF、Word、TXT）</li>
              <li>自动分块和索引</li>
              <li>元数据管理（作者、日期、标签）</li>
              <li>文档版本控制</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="text-2xl mb-3">🔍</div>
            <h4 className="font-semibold text-gray-900 mb-2">智能检索</h4>
            <ul className="text-gray-700 text-sm space-y-1 list-disc list-inside">
              <li>语义搜索（向量相似度）</li>
              <li>关键词搜索（全文检索）</li>
              <li>元数据过滤（按类别、时间）</li>
              <li>混合检索（向量+关键词）</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="text-2xl mb-3">💬</div>
            <h4 className="font-semibold text-gray-900 mb-2">问答对话</h4>
            <ul className="text-gray-700 text-sm space-y-1 list-disc list-inside">
              <li>多轮对话管理</li>
              <li>上下文引用（标注来源）</li>
              <li>相似问题推荐</li>
              <li>答案收藏和导出</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="text-2xl mb-3">⚙️</div>
            <h4 className="font-semibold text-gray-900 mb-2">系统管理</h4>
            <ul className="text-gray-700 text-sm space-y-1 list-disc list-inside">
              <li>API密钥管理</li>
              <li>模型配置</li>
              <li>使用统计和监控</li>
              <li>权限控制</li>
            </ul>
          </div>
        </div>
      </div>

      <section className="content-section">
        <SectionHeader number={1} title="项目架构设计" />
        
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 mb-6">
          <h3 className="subsection-title-sm">技术栈选型</h3>
          <div className="grid-3col">
            <div className="card">
              <div className="subsection-title">后端框架</div>
              <div className="text-2xl mb-2">Spring Boot</div>
              <div className="card-description">3.2.x，成熟的Java生态</div>
            </div>
            <div className="card">
              <div className="subsection-title">AI框架</div>
              <div className="text-2xl mb-2">LangChain4j</div>
              <div className="card-description">统一的RAG API</div>
            </div>
            <div className="card">
              <div className="subsection-title">向量数据库</div>
              <div className="text-2xl mb-2">PGVector</div>
              <div className="card-description">PostgreSQL扩展，开源免费</div>
            </div>
          </div>
        </div>

        <CodeBlockWithCopy
          language="java"
          filename="ProjectStructure.java"
          title="Java - 项目结构"
          code={`package com.example.ragkb;

/**
 * 项目整体结构
 * 采用分层架构：Controller -> Service -> Repository
 */
public class ProjectStructure {

    // ========== 项目分层 ==========

    // 1. Controller层
    // - 接收HTTP请求
    // - 参数验证
    // - 调用Service层
    // - 返回响应
    // - 异常处理

    // 2. Service层
    // - 业务逻辑实现
    // - 调用LangChain4j进行RAG
    // - 事务管理
    // - 缓存控制

    // 3. Repository层
    // - 数据访问抽象
    // - 向量存储操作
    // - 元数据查询

    // 4. 配置层
    // - API密钥管理
    // - 模型参数配置
    // - 数据源配置

    // ========== 包结构 ==========

    // com.example.ragkb.controller
    // com.example.ragkb.service
    // com.example.ragkb.repository
    // com.example.ragkb.config
    // com.example.ragkb.model
    // com.example.ragkb.exception

    // ========== 关键设计原则 ==========

    // 单一职责：每个类只负责一个功能
    // 依赖倒置：高层依赖低层
    // 开闭原则：对扩展开放，对修改封闭
    // 接口隔离：面向接口编程
}`}
        />

        <TipBox type="success" title="架构设计原则">
          <ul className="space-y-1 text-sm">
            <li><strong>可扩展性</strong>：模块化设计，便于添加新功能</li>
            <li><strong>可测试性</strong>：清晰分层，便于单元测试和集成测试</li>
            <li><strong>可维护性</strong>：代码结构清晰，易于理解和修改</li>
            <li><strong>性能优先</strong>：异步处理、批量操作、缓存优化</li>
          </ul>
        </TipBox>

        <h3 className="subsection-title mt-6">1.1 RAG知识库系统架构</h3>
        <p className="paragraph mb-4">完整的RAG知识库系统各组件如何协作：</p>

        <MermaidChart chart={`
          graph TB
              subgraph "📄 文档摄取层"
                  A1[PDF Parser]
                  A2[Word Parser]
                  A3[Text Splitter]
                  A1 --> A4[Embedding Model]
                  A2 --> A4
                  A3 --> A4
              end

              subgraph "💾 存储层"
                  B1[(PGVector)]
                  B2[(PostgreSQL)]
                  A4 --> B1
                  B1 --> B2
              end

              subgraph "🔍 检索层"
                  C1[Vector Search]
                  C2[Metadata Filter]
                  C3[Hybrid Search]
                  C1 --> B1
                  C2 --> B2
                  C1 --> C3
              end

              subgraph "🤖 生成层"
                  D1[RAG Service]
                  D2[Chat LLM]
                  C3 --> D1
                  D1 --> D2
              end

              subgraph "🎨 API层"
                  E1[Document API]
                  E2[Search API]
                  E3[Chat API]
                  E1 --> A1
                  E2 --> C1
                  E3 --> D1
              end

              style A4 fill:#f3e5f5
              style B1 fill:#e3f2fd
              style D2 fill:#fff3e0
        `} />
      </section>

      <section className="content-section">
        <SectionHeader number={2} title="后端API开发" />

        <h3 className="text-2xl font-semibold text-gray-900 mb-4">2.1 Spring Boot项目初始化</h3>
        <CodeBlockWithCopy
          language="java"
          filename="RagKnowledgeBaseApplication.java"
          title="Java - Spring Boot主类"
          code={`package com.example.ragkb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * RAG知识库应用主类
 * 启用异步处理和定时任务
 */
@SpringBootApplication
@EnableAsync  // 启用异步支持
public class RagKnowledgeBaseApplication {

    public static void main(String[] args) {
        SpringApplication.run(RagKnowledgeBaseApplication.class, args);
    }

    /**
     * 配置LangChain4j相关Bean
     */
    @Bean
    public LangChain4jConfig langChain4jConfig() {
        return new LangChain4jConfig();
    }
}`}
        />

        <h3 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">2.2 配置文件</h3>
        <CodeBlockWithCopy
          language="yaml"
          filename="application.yml"
          title="YAML - 应用配置"
          code={`server:
  port: 8080
  servlet:
    context-path: /api

spring:
  application:
    name: rag-knowledge-base

  # 数据库配置
  datasource:
    url: jdbc:postgresql://localhost:5432/rag_kb
    username: rag_user
    password: \${DB_PASSWORD:your_password}
    driver-class: org.postgresql.Driver
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5

  # JPA配置
  jpa:
    hibernate:
      ddl-auto: update  # 自动更新表结构
      show-sql: false
      properties:
        hibernate:
          dialect: org.hibernate.dialect.PostgreSQLDialect
          format_sql: true

  # 文件上传配置
  servlet:
    multipart:
      max-file-size: 50MB
      max-request-size: 50MB

# LangChain4j配置
langchain4j:
  # OpenAI配置
  openai:
    api-key: \${OPENAI_API_KEY:your_api_key}
    chat-model: gpt-4o-mini
    embedding-model: text-embedding-3-small
    temperature: 0.3
    max-tokens: 2000

  # 检索配置
  retrieval:
    max-results: 5
    min-score: 0.6
    top-k: 5
    chunk-size: 500
    overlap: 50

  # 缓存配置
  cache:
    enabled: true
    ttl: 3600  # 1小时
    max-size: 1000

# 文档存储配置
document:
  storage-path: \${DOCUMENT_STORAGE_PATH:./documents}
  allowed-formats: pdf,docx,doc,txt,md
  max-file-size: 10485760  # 10MB

# 监控配置
monitoring:
  enabled: true
  log-level: INFO
  metrics:
    enabled: true`}
        />

        <h3 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">2.3 LangChain4j配置类</h3>
        <CodeBlockWithCopy
          language="java"
          filename="LangChain4jConfig.java"
          title="Java - LangChain4j配置"
          code={`package com.example.ragkb.config;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.openai.OpenAiChatModelName;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.openai.OpenAiEmbeddingModel;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.content.retriever.EmbeddingStoreContentRetriever;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.inmemory.InMemoryEmbeddingStore;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * LangChain4j配置类
 * 管理所有LLM和检索相关组件的初始化
 */
@Configuration
public class LangChain4jConfig {

    @Value("\${langchain4j.openai.api-key}")
    private String openaiApiKey;

    @Value("\${langchain4j.openai.chat-model:gpt-4o-mini}")
    private String chatModelName;

    @Value("\${langchain4j.openai.embedding-model:text-embedding-3-small}")
    private String embeddingModelName;

    @Value("\${langchain4j.retrieval.max-results:5}")
    private int maxResults;

    @Value("\${langchain4j.retrieval.min-score:0.6}")
    private double minScore;

    /**
     * 聊天语言模型Bean
     * 用于生成回答
     */
    @Bean
    public ChatLanguageModel chatLanguageModel() {
        return OpenAiChatModel.builder()
                .apiKey(openaiApiKey)
                .modelName(OpenAiChatModelName.fromString(chatModelName))
                .temperature(0.3)  // 降低温度提高准确性
                .maxTokens(2000)
                .build();
    }

    /**
     * Embedding模型Bean
     * 用于生成文本向量
     */
    @Bean
    public EmbeddingModel embeddingModel() {
        return OpenAiEmbeddingModel.builder()
                .apiKey(openaiApiKey)
                .modelName(embeddingModelName)
                .build();
    }

    /**
     * In-memory向量存储
     * 生产环境建议使用PGVector等持久化存储
     */
    @Bean
    public EmbeddingStore<String> inMemoryEmbeddingStore() {
        return new InMemoryEmbeddingStore<>();
    }

    /**
     * 内容检索器
     * 用于执行向量相似度搜索
     */
    @Bean
    public ContentRetriever contentRetriever(
            EmbeddingStore<String> embeddingStore,
            EmbeddingModel embeddingModel
    ) {
        return EmbeddingStoreContentRetriever.builder()
                .embeddingStore(embeddingStore)
                .embeddingModel(embeddingModel)
                .maxResults(maxResults)
                .minScore(minScore)
                .build();
    }
}`}
        />

        <h3 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">2.4 RAG服务实现</h3>
        <CodeBlockWithCopy
          language="java"
          filename="RagService.java"
          title="Java - RAG服务"
          code={`package com.example.ragkb.service;

import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.query.Query;
import dev.langchain4j.service.AiServices;

import org.springframework.stereotype.Service;

import java.util.List;

/**
 * RAG服务类
 * 封装LangChain4j的检索增强生成逻辑
 */
@Service
public class RagService {

    private final ContentRetriever retriever;

    /**
     * AI Service接口
     * 使用LangChain4j的高级API，自动管理ChatMemory
     */
    interface KnowledgeAssistant {
        String ask(String question);
    }

    public RagService(ContentRetriever retriever) {
        this.retriever = retriever;
    }

    /**
     * 使用AI Service进行问答
     * 自动管理对话上下文和检索
     */
    public KnowledgeAssistant createKnowledgeAssistant() {
        return AiServices.builder(KnowledgeAssistant.class)
                .retriever(retriever)  // 自动检索相关文档
                .chatLanguageModel(bean -> {
                    // 从Spring容器注入ChatModel
                    return bean;
                })
                .build();
    }

    /**
     * 直接使用检索器（不使用AI Service）
     * 更细粒度的控制
     */
    public List<TextSegment> retrieveDocuments(String query) {
        return retriever.retrieve(Query.from(query));
    }

    /**
     * 带元数据过滤的检索
     */
    public List<TextSegment> retrieveDocumentsWithFilter(
            String query,
            String category,
            Integer limit
    ) {
        // TODO: 实现元数据过滤逻辑
        return retriever.retrieve(Query.from(query));
    }
}`}
        />

        <h3 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">2.5 文档控制器</h3>
        <CodeBlockWithCopy
          language="java"
          filename="DocumentController.java"
          title="Java - 文档API"
          code={`package com.example.ragkb.controller;

import com.example.ragkb.dto.DocumentUploadResponse;
import com.example.ragkb.service.DocumentService;
import com.example.ragkb.service.RagService;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 文档管理控制器
 * 提供文档上传、查询、删除等API
 */
@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*")
public class DocumentController {

    private final DocumentService documentService;
    private final RagService ragService;

    public DocumentController(DocumentService documentService, RagService ragService) {
        this.documentService = documentService;
        this.ragService = ragService;
    }

    /**
     * 上传文档
     * POST /api/documents/upload
     */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentUploadResponse> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "category", required = false) String category
    ) {
        try {
            DocumentUploadResponse response = documentService.uploadDocument(file, category);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            DocumentUploadResponse errorResponse = new DocumentUploadResponse();
            errorResponse.setSuccess(false);
            errorResponse.setMessage("文档上传失败: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * 批量上传文档
     * POST /api/documents/batch-upload
     */
    @PostMapping(value = "/batch-upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<DocumentUploadResponse>> batchUploadDocuments(
            @RequestParam("files") List<MultipartFile> files
    ) {
        List<DocumentUploadResponse> responses = documentService.batchUploadDocuments(files);
        return ResponseEntity.ok(responses);
    }

    /**
     * 查询文档列表
     * GET /api/documents
     */
    @GetMapping
    public ResponseEntity<List<DocumentInfo>> listDocuments(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "category", required = false) String category
    ) {
        List<DocumentInfo> documents = documentService.listDocuments(page, size, category);
        return ResponseEntity.ok(documents);
    }

    /**
     * 删除文档
     * DELETE /api/documents/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.ok().build();
    }

    /**
     * 文档搜索
     * GET /api/documents/search
     */
    @GetMapping("/search")
    public ResponseEntity<List<SearchResult>> searchDocuments(
            @RequestParam("q") String query,
            @RequestParam(value = "category", required = false) String category
    ) {
        List<SearchResult> results = ragService.searchDocuments(query, category);
        return ResponseEntity.ok(results);
    }
}`}
        />
      </section>

      <section className="content-section">
        <SectionHeader number={3} title="前端界面实现" />

        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-6">
          <h3 className="subsection-title-sm">技术栈</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-2xl mb-2">⚛️</div>
              <h4 className="font-semibold text-gray-900 mb-2">React</h4>
              <ul className="text-gray-700 text-sm space-y-1 list-disc list-inside">
                <li>组件化开发</li>
                <li>响应式设计</li>
                <li>状态管理（Redux/Context）</li>
                <li>丰富的UI组件库</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-2xl mb-2">🎨</div>
              <h4 className="font-semibold text-gray-900 mb-2">Tailwind CSS</h4>
              <ul className="text-gray-700 text-sm space-y-1 list-disc list-inside">
                <li>实用优先CSS框架</li>
                <li>快速开发</li>
                <li>统一的设计语言</li>
                <li>优秀的响应式支持</li>
              </ul>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900 mb-4">3.1 主要页面组件</h3>
        <CodeBlockWithCopy
          language="tsx"
          filename="App.tsx"
          title="React - 主页面"
          code={`import React, { useState, useEffect } from 'react';
import axios from 'axios';

// TypeScript接口定义
interface Document {
  id: number;
  name: string;
  size: number;
  uploadDate: string;
  category: string;
}

interface SearchResult {
  documentId: number;
  documentName: string;
  excerpt: string;
  score: number;
}

/**
 * 主页面组件
 * 包含文档上传、列表显示、搜索功能
 */
const App: React.FC = () => {
  // 状态管理
  const [query, setQuery] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  /**
   * 加载文档列表
   */
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const response = await axios.get<Document[]>('/api/documents');
      setDocuments(response.data);
    } catch (error) {
      console.error('加载文档失败:', error);
      alert('加载文档失败，请稍后重试');
    }
  };

  /**
   * 上传文档
   */
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (selectedCategory !== 'all') {
        formData.append('category', selectedCategory);
      }

      const response = await axios.post<DocumentUploadResponse>(
        '/api/documents/upload',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      if (response.data.success) {
        // 上传成功，刷新文档列表
        await loadDocuments();
        alert('文档上传成功！');
      } else {
        alert('上传失败: ' + response.data.message);
      }
    } catch (error) {
      console.error('上传失败:', error);
      alert('上传失败: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  /**
   * 搜索文档
   */
  const handleSearch = async () => {
    if (!query.trim()) {
      await loadDocuments();
      return;
    }

    try {
      const response = await axios.get<SearchResult[]>(
        \`/api/documents/search?q=\${encodeURIComponent(query)}\`
      );
      setDocuments(response.data);
    } catch (error) {
      console.error('搜索失败:', error);
      alert('搜索失败，请稍后重试');
    }
  };

  /**
   * 删除文档
   */
  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个文档吗？')) return;

    try {
      await axios.delete(\`/api/documents/\${id}\`);
      await loadDocuments();
      alert('文档删除成功！');
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              📚 RAG知识库
            </h1>

            <div className="flex items-center gap-4">
              {/* 搜索框 */}
              <div className="flex-1">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="搜索文档..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleSearch}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  搜索
                </button>
              </div>

              {/* 类别过滤 */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">全部分类</option>
                <option value="tech">技术文档</option>
                <option value="product">产品手册</option>
                <option value="legal">法律文档</option>
              </select>
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 文档上传区域 */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">上传文档</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                onChange={handleUpload}
                accept=".pdf,.doc,.docx,.txt,.md"
                disabled={uploading}
                className="w-full"
              />
              <p className="mt-2 text-gray-600">
                {uploading ? '上传中...' : '点击或拖拽文件上传'}
              </p>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mt-4 px-4 py-2 border border-gray-300 rounded-lg"
                disabled={uploading}
              >
                <option value="all">全部分类</option>
                <option value="tech">技术文档</option>
                <option value="product">产品手册</option>
                <option value="legal">法律文档</option>
              </select>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;`}
        />

        <h3 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">3.2 问答界面组件</h3>
        <CodeBlockWithCopy
          language="tsx"
          filename="ChatInterface.tsx"
          title="React - 问答组件"
          code={`import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

/**
 * 消息接口
 */
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Array<{
    documentId: number;
    documentName: string;
    excerpt: string;
  }>;
}

/**
 * 聊天界面组件
 * 支持多轮对话、引用来源
 */
const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * 自动滚动到底部
   */
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  /**
   * 发送消息
   */
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    setLoading(true);

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await axios.post<{ message: string; sources: any[] }>(
        '/api/chat/ask',
        { question: input }
      );

      // 添加助手消息
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.message,
        timestamp: new Date(),
        sources: response.data.sources || [],
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('发送消息失败:', error);
      
      // 添加错误消息
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: '抱歉，我遇到了一些问题。请稍后重试。',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 渲染来源引用
   */
  const renderSources = (sources?: Message['sources']) => {
    if (!sources || sources.length === 0) return null;

    return (
      <div className="mt-2 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm font-semibold text-blue-900 mb-2">参考来源:</p>
        <ul className="space-y-1">
          {sources.map((source, index) => (
            <li key={index} className="text-sm">
              <a href={\`/documents/\${source.documentId}\`} 
                 className="text-blue-600 hover:underline">
                {source.documentName} (相关度: {(source.score * 100).toFixed(1)}%)
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* 消息列表 */}
      <div className="h-96 overflow-y-auto p-4 mb-4">
        {messages.map((message, index) => (
            <div
              key={message.id}
              className={\`flex \${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4\`}
            >
              <div
                className={\`max-w-[70%] rounded-lg p-4 \${
                  message.role === 'user' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }\`}
              >
                <div className="text-xs text-gray-500 mb-1">
                  {message.timestamp.toLocaleString()}
                </div>
                {message.role === 'assistant' && renderSources(message.sources)}
                <p className="text-sm leading-relaxed">
                  {message.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 输入区域 */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="输入您的问题..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? '发送中...' : '发送'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;`}
        />

        <TipBox type="info" title="前端优化建议">
          <ul className="space-y-1 text-sm">
            <li><strong>代码分割</strong>：使用Webpack/Vite进行代码分割</li>
            <li><strong>懒加载</strong>：React.lazy()延迟加载非关键组件</li>
            <li><strong>虚拟滚动</strong>：react-window对于长列表</li>
            <li><strong>请求缓存</strong>：axios拦截器统一处理API请求</li>
          </ul>
        </TipBox>
      </section>

      <section className="content-section">
        <SectionHeader number={4} title="数据库配置" />

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="subsection-title-sm">PostgreSQL + PGVector设置</h3>
          <p className="text-gray-700 mb-4">
            我们使用PostgreSQL的pgvector扩展作为向量数据库。以下是安装和配置步骤：
          </p>
        </div>

        <CodeBlockWithCopy
          language="sql"
          filename="setup_pgvector.sql"
          title="SQL - PGVector扩展"
          code={`-- 安装PGVector扩展
-- 注意：需要PostgreSQL 14或更高版本
CREATE EXTENSION IF NOT EXISTS vector;

-- 创建向量表
CREATE TABLE IF NOT EXISTS document_embeddings (
    id BIGSERIAL PRIMARY KEY,
    document_id BIGINT NOT NULL,
    segment_index INTEGER NOT NULL,
    text_segment TEXT NOT NULL,
    embedding vector(1536) NOT NULL,  -- text-embedding-3-small维度
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建向量索引
-- IVFFlat适合精确搜索
-- HNSW适合大规模数据
CREATE INDEX ON document_embeddings 
USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);  -- 创建IVF列表，提高查询性能

-- 创建文档元数据表
CREATE TABLE IF NOT EXISTS documents (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    size BIGINT NOT NULL,
    category VARCHAR(50),
    content_type VARCHAR(100),
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'completed',
    error_message TEXT
);

-- 创建元数据索引
CREATE INDEX idx_documents_category ON documents(category);
CREATE INDEX idx_documents_upload_date ON documents(upload_date);
CREATE INDEX idx_documents_status ON documents(status);

-- 创建向量相似度搜索函数
-- 返回最相似的embedding及其关联的文本段
CREATE OR REPLACE FUNCTION search_similar(
    query_vector vector(1536),
    top_n INTEGER DEFAULT 5,
    min_similarity FLOAT DEFAULT 0.7
) RETURNS TABLE (
    document_id BIGINT,
    segment_index INTEGER,
    similarity FLOAT
) AS $$
BEGIN
    SELECT
        de.document_id,
        de.segment_index,
        1 - (embedding <=> query_vector) AS similarity
    FROM document_embeddings de
    WHERE 1 - (embedding <=> query_vector) >= min_similarity
    ORDER BY embedding <=> query_vector
    LIMIT top_n;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器自动更新updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_embeddings
BEFORE UPDATE ON document_embeddings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();`}
        />

        <TipBox type="warning" title="性能优化提示">
          <ul className="space-y-1 text-sm">
            <li><strong>索引选择</strong>：IVFFlat vs HNSW根据数据规模选择</li>
            <li><strong>分片策略</strong>：对于超大数据集，考虑分片存储</li>
            <li><strong>连接池</strong>：配置合理的最大连接数和超时</li>
            <li><strong>定期维护</strong>：VACUUM ANALYZE定期清理和统计</li>
          </ul>
        </TipBox>
      </section>

      <section className="content-section">
        <SectionHeader number={5} title="API密钥管理" />

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="subsection-title-sm">安全密钥管理策略</h3>
          <p className="text-gray-700 mb-4">
            API密钥不应硬编码在代码中，应通过环境变量或专门的密钥管理服务获取：
          </p>
        </div>

        <CodeBlockWithCopy
          language="java"
          filename="ApiKeyManager.java"
          title="Java - 密钥管理"
          code={`package com.example.ragkb.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * API密钥管理器
 * 从环境变量和密钥存储中安全获取API密钥
 */
@Component
public class ApiKeyManager {

    // 优先级：环境变量 > 配置文件 > 数据库存储
    private static final String[] SOURCES = {
        "OPENAI_API_KEY",
        "DATABASE_PASSWORD",
        "DOCUMENT_STORAGE_PATH"
    };

    private final Map<String, String> keysCache = new HashMap<>();

    /**
     * 从环境变量获取密钥
     */
    @Value("\${OPENAI_API_KEY:}")
    private String envApiKey;

    /**
     * 从配置服务获取密钥
     * TODO: 实现从远程密钥管理服务获取
     */
    @Value("\${OPENAI_API_KEY:}")
    private String configApiKey;

    /**
     * 获取OpenAI API密钥
     * 按优先级从不同来源获取
     */
    public String getOpenAiApiKey() {
        // 1. 首先从环境变量获取
        String key = envApiKey;

        // 2. 检查是否是占位符，表示未设置
        if ("your-api-key".equals(key)) {
            throw new IllegalStateException(
                "OPENAI_API_KEY环境变量未设置！请设置有效API密钥。"
            );
        }

        keysCache.put("OPENAI_API_KEY", key);
        return key;
    }

    /**
     * 获取数据库密码
     */
    @Value("\${DATABASE_PASSWORD:}")
    private String dbPassword;

    public String getDbPassword() {
        if ("your-password".equals(dbPassword)) {
            throw new IllegalStateException("DATABASE_PASSWORD未配置！");
        }
        return dbPassword;
    }

    /**
     * 获取所有配置的密钥（用于调试）
     */
    public Map<String, String> getAllKeys() {
        Map<String, String> allKeys = new HashMap<>();
        allKeys.put("OPENAI_API_KEY", getOpenAiApiKey());
        allKeys.put("DATABASE_PASSWORD", getDbPassword());
        return allKeys;
    }

    /**
     * 验证密钥格式
     */
    public boolean validateApiKey(String key) {
        // OpenAI API密钥格式：sk-开头
        return key != null && key.startsWith("sk-") && key.length() >= 20;
    }

    /**
     * 生成测试密钥（仅用于开发环境）
     */
    public String generateTestKey() {
        return "sk-test-" + System.currentTimeMillis();
    }
}`}
        />

        <TipBox type="success" title="最佳实践">
          <ul className="space-y-1 text-sm">
            <li><strong>环境隔离</strong>：开发/测试/生产使用不同的密钥</li>
            <li><strong>密钥轮换</strong>：定期更换API密钥，降低泄露风险</li>
            <li><strong>最小权限</strong>：只授予必要的权限范围</li>
            <li><strong>审计日志</strong>：记录密钥使用情况</li>
            <li><strong>密钥加密</strong>：使用KMS（密钥管理服务）加密存储</li>
          </ul>
        </TipBox>
      </section>

      <section className="content-section">
        <SectionHeader number={6} title="部署和监控" />

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="subsection-title-sm">Docker容器化部署</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-2xl mb-2">🐳</div>
              <h4 className="font-semibold text-gray-900 mb-2">Dockerfile</h4>
              <pre className="text-xs bg-gray-900 text-gray-100 rounded p-3 overflow-x-auto">{`FROM openjdk:17-slim
WORKDIR /app
COPY target/rag-knowledge-base-*.jar app.jar

# 环境变量
ENV SPRING_PROFILES_ACTIVE=prod
ENV OPENAI_API_KEY=\${OPENAI_API_KEY}
ENV DB_PASSWORD=\${DB_PASSWORD}
ENV DOCUMENT_STORAGE_PATH=/app/documents

# JVM参数
ENV JAVA_OPTS="-Xmx2g -Xms512m -XX:+UseG1GC"

# 暴露端口
EXPOSE 8080

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s \\
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# 启动应用
ENTRYPOINT ["java", "-jar", "app.jar"]`}</pre>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-2xl mb-2">🚀</div>
              <h4 className="font-semibold text-gray-900 mb-2">Docker Compose</h4>
              <pre className="text-xs bg-gray-900 text-gray-100 rounded p-3 overflow-x-auto">{`version: '3.8'

services:
  rag-knowledge-base:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - OPENAI_API_KEY=\${OPENAI_API_KEY}
      - DB_PASSWORD=\${DB_PASSWORD}
      - DOCUMENT_STORAGE_PATH=./data/documents
    volumes:
      - ./data/documents:/app/documents
      - postgres-data:/var/lib/postgresql/data
    depends_on:
      - postgres
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  postgres:
    image: pgvector/pgvector:pg16
    environment:
      - POSTGRES_PASSWORD=\${DB_PASSWORD}
      - POSTGRES_DB=rag_kb
      - POSTGRES_USER=rag_user
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped`}</pre>
            </div>
          </div>
        </div>

        <CodeBlockWithCopy
          language="yaml"
          filename="application-prod.yml"
          title="YAML - 监控配置"
          code={`management:
  endpoints:
    web:
      exposure:
        include: health,metrics,info
  endpoint:
    health:
      show-details: always
  metrics:
    export:
      prometheus:
        enabled: true
  tags:
    application: \${spring.application.name}

spring:
  application:
    name: rag-knowledge-base

logging:
  level:
    com.example.ragkb: INFO
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"

# 自定义指标
metrics:
  export:
    prometheus:
      enabled: true
  tags:
    application: \${spring.application.name}
  enable:
    rag:
      query-time: true
      retrieval-count: true
      embedding-count: true
      document-count: true
      error-rate: true`}
        />

        <TipBox type="info" title="监控指标">
          <ul className="space-y-1 text-sm">
            <li><strong>查询性能</strong>：平均响应时间、P95、P99</li>
            <li><strong>检索质量</strong>：召回率、准确率、相似度分布</li>
            <li><strong>系统健康</strong>：API可用性、数据库连接数、文档索引大小</li>
            <li><strong>使用统计</strong>：日查询量、活跃用户数、热门查询词</li>
            <li><strong>成本监控</strong>：Token消耗、API调用次数、费用追踪</li>
          </ul>
        </TipBox>
      </section>

      <div className="summary-box">
        <h3 className="text-2xl font-bold mb-4">🎯 项目总结</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">核心功能</h4>
            <ul className="space-y-1 text-sm list-disc list-inside">
              <li>✅ 文档上传和管理</li>
              <li>✅ 向量化存储和检索</li>
              <li>✅ 智能问答对话</li>
              <li>✅ 元数据过滤</li>
              <li>✅ 安全密钥管理</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">技术栈</h4>
            <ul className="space-y-1 text-sm list-disc list-inside">
              <li>Spring Boot 3.2.x</li>
              <li>LangChain4j RAG API</li>
              <li>PostgreSQL + PGVector</li>
              <li>React + Tailwind CSS</li>
              <li>Docker 容器化</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t">
          <p className="text-sm">
            本章完成了一个完整的RAG知识库项目实战。涵盖了从项目架构、后端开发、前端实现到部署监控的全流程。
          </p>
          <p className="text-sm">
            下一章我们将学习如何构建AI助手项目，包含更复杂的Agent能力和工具调用。
          </p>
          <a href="/project-ai-assistant" className="inline-block mt-3 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            继续学习 →
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectRagKbPage;
