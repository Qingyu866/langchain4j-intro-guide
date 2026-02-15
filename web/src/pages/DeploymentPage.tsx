import Layout from '../components/layout/Layout';
import { Tag, SectionHeader, CodeBlock, TipBox } from '../components/ui';

const dockerfileCode = `# 基础镜像：使用 JDK 17
FROM openjdk:17-jdk-slim AS builder

# 设置工作目录
WORKDIR /app

# 复制 Maven 配置文件
COPY pom.xml .

# 构建 Spring Boot 应用（依赖下载和编译）
RUN mvn clean package -DskipTests

# 多阶段构建：使用更小的运行时镜像
FROM openjdk:17-jre-slim

# 创建应用目录和非 root 用户
WORKDIR /app
RUN groupadd -r appuser && useradd -r -g appuser appuser

# 从构建阶段复制 JAR 文件
COPY --from=builder /app/target/*.jar app.jar

# 设置文件权限
RUN chown -R appuser:appuser /app

# 切换到非 root 用户
USER appuser

# 暴露端口
EXPOSE 8080

# 启动应用
ENTRYPOINT ["java", "-jar", "app.jar"]`;

const dockerComposeCode = `version: '3.8'

services:
  # LangChain4j 应用
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=production
      - OPENAI_API_KEY=\$\{OPENAI_API_KEY}
      - POSTGRES_URL=jdbc:postgresql://postgres:5432/langchain4j
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  # PostgreSQL 数据库
  postgres:
    image: pgvector/pgvector:pg16
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=langchain4j
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  # Redis 缓存
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

volumes:
  postgres_data:
  redis_data:`;

const deploymentCode = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: langchain4j-app
  labels:
    app: langchain4j
spec:
  replicas: 3  # 3 个副本
  selector:
    matchLabels:
      app: langchain4j
  template:
    metadata:
      labels:
        app: langchain4j
    spec:
      containers:
      - name: langchain4j
        image: your-registry/langchain4j:latest
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "production"
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: openai-api-key
              key: api-key
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 60
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: langchain4j-service
spec:
  selector:
    app: langchain4j
  ports:
  - protocol: TCP
    port: 8080
    targetPort: 8080
  type: LoadBalancer`;

const configMapCode = `# ConfigMap: 应用配置
apiVersion: v1
kind: ConfigMap
metadata:
  name: langchain4j-config
data:
  application.yml: |
    spring:
      datasource:
        url: jdbc:postgresql://postgres-service:5432/langchain4j
        username: postgres
      redis:
        host: redis-service
        port: 6379
---
# Secret: 敏感信息
apiVersion: v1
kind: Secret
metadata:
  name: openai-api-key
type: Opaque
stringData:
  api-key: sk-proj-xxx  # base64 编码`;

const githubActionsCode = `name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Set up JDK 17
      uses: actions/setup-java@v4
      with:
        java-version: '17'
        distribution: 'temurin'
    - name: Build with Maven
      run: mvn clean package -DskipTests
    - name: Run Tests
      run: mvn test
    - name: Build Docker Image
      run: docker build -t langchain4j:\$\{{ github.sha }} .
    - name: Push to Registry
      if: github.ref == 'refs/heads/main'
      run: |
        echo \$\{{ secrets.REGISTRY_PASSWORD }} | docker login -u \$\{{ secrets.REGISTRY_USER }} --password-stdin
        docker push langchain4j:\$\{{ github.sha }}`;

const alertingRulesCode = `groups:
  - name: api_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(api_error_total[5m]) > 0.05  # 5分钟内错误率 > 5%
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "API 错误率过高: {{ $value }}"

      - alert: HighLatency
        expr: histogram_quantile(0.95)(api_latency_seconds[5m]) > 5  # P95 延迟 > 5 秒
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "API 延迟过高: {{ $value }}s"

      - alert: BudgetExceeded
        expr: sum(api_cost_total[30d]) > 100  # 月度成本 > 100 美元
        for: 30d
        labels:
          severity: critical
        annotations:
          summary: "预算超支: {{ $value }} 美元"`;

const DeploymentPage = () => {
  return (
    <Layout>
      <div className="page-tags">
        <Tag variant="indigo">部署与运维</Tag>
        <Tag variant="purple">生产环境</Tag>
        <Tag variant="green">Docker</Tag>
      </div>

      <h1 className="page-title">部署与运维</h1>
      <p className="page-intro">LangChain4j 应用的生产环境部署与运维指南</p>

      <nav className="toc-nav">
        <h3 className="toc-title">目录</h3>
        <ol className="toc-list">
          <li className="toc-item"><span className="toc-number">1.</span> <a href="#容器化部署" className="toc-link">容器化部署</a></li>
          <li className="toc-item"><span className="toc-number">2.</span> <a href="#Kubernetes编排" className="toc-link">Kubernetes 编排</a></li>
          <li className="toc-item"><span className="toc-number">3.</span> <a href="#CI_CD流程" className="toc-link">CI/CD 流程</a></li>
          <li className="toc-item"><span className="toc-number">4.</span> <a href="#监控告警与日志" className="toc-link">监控告警与日志</a></li>
        </ol>
      </nav>

      <section id="容器化部署" className="content-section">
        <SectionHeader number={1} title="容器化部署" />
        
        <h3 className="subsection-title">1.1 Docker 镜像构建</h3>
        <p className="paragraph">使用 Docker 容器化 LangChain4j 应用，实现环境一致性和易于部署：</p>

        <CodeBlock code={dockerfileCode} language="dockerfile" filename="Dockerfile" />

        <h3 className="subsection-title">1.2 Docker Compose 编排</h3>
        <p className="paragraph">使用 Docker Compose 管理多容器应用：</p>

        <CodeBlock code={dockerComposeCode} language="yaml" filename="docker-compose.yml" />
      </section>

      <section id="Kubernetes编排" className="content-section">
        <SectionHeader number={2} title="Kubernetes 编排" />
        
        <h3 className="subsection-title">2.1 Deployment 配置</h3>
        <p className="paragraph">在 Kubernetes 中部署 LangChain4j 应用：</p>

        <CodeBlock code={deploymentCode} language="yaml" filename="deployment.yaml" />

        <h3 className="subsection-title">2.2 配置管理</h3>
        <p className="paragraph">使用 Kubernetes ConfigMap 和 Secret 管理配置：</p>

        <CodeBlock code={configMapCode} language="yaml" filename="config.yaml" />
      </section>

      <section id="CI_CD流程" className="content-section">
        <SectionHeader number={3} title="CI/CD 流程" />
        
        <h3 className="subsection-title">3.1 GitHub Actions CI</h3>
        <p className="paragraph">自动化构建和测试流程：</p>

        <CodeBlock code={githubActionsCode} language="yaml" filename=".github/workflows/ci.yml" />

        <h3 className="subsection-title">3.2 自动化部署到 K8s</h3>
        <p className="paragraph">构建完成后自动部署到 Kubernetes：</p>

        <div className="info-card info-card-green">
          <h4 className="font-semibold mb-3">部署步骤</h4>
          <ol className="list-decimal list-inside space-y-2">
            <li><strong>构建镜像</strong>：CI 流程构建并推送 Docker 镜像到镜像仓库</li>
            <li><strong>更新部署</strong>：使用 `kubectl set image` 更新 Deployment 镜像版本</li>
            <li><strong>滚动更新</strong>：Kubernetes 自动执行滚动更新，零停机部署</li>
            <li><strong>健康检查</strong>：验证新 Pod 健康状态</li>
            <li><strong>回滚</strong>：如果检测到问题，自动回滚到上一个稳定版本</li>
          </ol>
        </div>
      </section>

      <section id="监控告警与日志" className="content-section">
        <SectionHeader number={4} title="监控告警与日志" />
        
        <h3 className="subsection-title">4.1 Prometheus 监控</h3>
        <p className="paragraph">使用 Prometheus 收集应用指标：</p>

        <div className="info-card info-card-blue">
          <h4 className="font-semibold mb-3">关键监控指标</h4>
          <ul className="space-y-2">
            <li><strong>API 调用次数</strong>：每分钟/小时的 API 调用总量</li>
            <li><strong>响应时间</strong>：API 请求的平均、P95、P99 延迟</li>
            <li><strong>错误率</strong>：API 调用失败率（目标 &lt; 1%）</li>
            <li><strong>Token 使用量</strong>：输入/输出 Token 数量和成本</li>
            <li><strong>缓存命中率</strong>：缓存成功的请求比例</li>
            <li><strong>JVM 指标</strong>：堆内存、GC 次数、线程数</li>
          </ul>
        </div>

        <h3 className="subsection-title">4.2 Grafana 仪表板</h3>
        <p className="paragraph">使用 Grafana 可视化监控数据：</p>

        <div className="grid-3col">
          <div className="info-card info-card-purple">
            <h4 className="font-semibold mb-2">API 仪表板</h4>
            <p className="text-sm opacity-80">API 调用、响应时间、错误率</p>
          </div>
          <div className="info-card info-card-green">
            <h4 className="font-semibold mb-2">成本仪表板</h4>
            <p className="text-sm opacity-80">Token 使用、API 费用、预算对比</p>
          </div>
          <div className="info-card" style={{ background: '#fff7ed', borderColor: '#fed7aa' }}>
            <h4 className="font-semibold mb-2">系统仪表板</h4>
            <p className="text-sm opacity-80">CPU、内存、网络 I/O</p>
          </div>
        </div>

        <h3 className="subsection-title">4.3 告警规则</h3>
        <p className="paragraph">设置合理的告警阈值：</p>

        <CodeBlock code={alertingRulesCode} language="yaml" filename="alerting-rules.yml" />

        <h3 className="subsection-title">4.4 日志聚合</h3>
        <p className="paragraph">使用 ELK（Elasticsearch + Logstash + Kibana）或类似方案：</p>

        <div className="info-card info-card-gray">
          <h4 className="font-semibold mb-3">日志收集策略</h4>
          <ul className="space-y-2">
            <li><strong>结构化日志</strong>：使用 JSON 格式记录日志，便于查询和分析</li>
            <li><strong>日志级别</strong>：生产环境使用 INFO 级别，开发环境使用 DEBUG</li>
            <li><strong>关联追踪</strong>：为每个请求分配唯一的 trace ID</li>
            <li><strong>保留策略</strong>：日志保留 7-30 天，根据需求调整</li>
            <li><strong>敏感信息</strong>：过滤掉 API Key、用户密码等敏感信息</li>
          </ul>
        </div>

        <TipBox type="info" title="部署最佳实践">
          <ul className="space-y-2">
            <li><strong>多环境隔离</strong>：开发、测试、生产环境完全隔离</li>
            <li><strong>渐进式部署</strong>：使用蓝绿部署或金丝雀发布</li>
            <li><strong>配置管理</strong>：使用 ConfigMap/Secret 管理配置，避免硬编码</li>
            <li><strong>健康检查</strong>：配置 liveness 和 readiness 探针</li>
            <li><strong>资源限制</strong>：设置 CPU 和内存 requests/limits</li>
            <li><strong>监控告警</strong>：监控关键指标，设置合理告警阈值</li>
            <li><strong>备份策略</strong>：定期备份数据库和配置</li>
          </ul>
        </TipBox>
      </section>

      <div className="summary-card">
        <h3 className="summary-title">本节小结</h3>
        <p className="mb-4">本节完整介绍了 LangChain4j 应用的部署与运维策略，包括：</p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li><strong>容器化部署</strong>：Docker 镜像构建、Docker Compose 多容器编排</li>
          <li><strong>Kubernetes 编排</strong>：Deployment 配置、Service 暴露、ConfigMap/Secret 管理</li>
          <li><strong>CI/CD 流程</strong>：GitHub Actions 自动化构建、测试、部署</li>
          <li><strong>监控告警</strong>：Prometheus 指标收集、Grafana 可视化、告警规则</li>
          <li><strong>日志聚合</strong>：ELK 日志收集、结构化日志、日志保留策略</li>
        </ul>
        <div className="summary-footer">
          <p className="summary-next">下一步</p>
          <a href="/integrations" className="summary-link">
            下一章：框架集成 →
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default DeploymentPage;
