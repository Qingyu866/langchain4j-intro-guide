export interface NavItem {
  label: string;
  path: string;
  pageId: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navigationData: NavGroup[] = [
  {
    title: '快速开始',
    items: [
      { label: '概览', path: '/', pageId: 'index' },
      { label: '环境准备', path: '/getting-started', pageId: 'getting-started' },
      { label: '核心概念', path: '/core-concepts', pageId: 'core-concepts' },
    ],
  },
  {
    title: '核心功能',
    items: [
      { label: 'Embedding 模型', path: '/embedding-models', pageId: 'embedding-models' },
      { label: 'Prompt 模板', path: '/prompt-templates', pageId: 'prompt-templates' },
      { label: '输出解析', path: '/output-parsers', pageId: 'output-parsers' },
      { label: 'Token 流式', path: '/token-stream', pageId: 'token-stream' },
      { label: 'Agent 深度解析', path: '/agent-deep-dive', pageId: 'agent-deep-dive' },
      { label: '模型提供商', path: '/model-providers', pageId: 'model-providers' },
      { label: '函数调用', path: '/function-calling-deep', pageId: 'function-calling-deep' },
      { label: '参数验证', path: '/constraint-validation', pageId: 'constraint-validation' },
      { label: '输出守护', path: '/output-guard', pageId: 'output-guard' },
      { label: '高级特性', path: '/advanced-features', pageId: 'advanced-features' },
      { label: '多模态', path: '/multimodal-full', pageId: 'multimodal-full' },
    ],
  },
  {
    title: 'RAG 完整指南',
    items: [
      { label: 'RAG 简介', path: '/rag-intro', pageId: 'rag-intro' },
      { label: 'RAG 环境搭建', path: '/rag-setup', pageId: 'rag-setup' },
      { label: 'RAG 实现', path: '/rag-implementation', pageId: 'rag-implementation' },
      { label: '文档分割', path: '/document-splitting', pageId: 'document-splitting' },
      { label: 'RAG 高级', path: '/rag-advanced', pageId: 'rag-advanced' },
      { label: 'RAG 完整指南', path: '/rag-complete', pageId: 'rag-complete' },
    ],
  },
  {
    title: '项目实战',
    items: [
      { label: '聊天机器人', path: '/project-chatbot', pageId: 'project-chatbot' },
      { label: 'AI助手', path: '/project-ai-assistant', pageId: 'project-ai-assistant' },
      { label: 'RAG知识库', path: '/project-rag-kb', pageId: 'project-rag-kb' },
      { label: '综合实战', path: '/practice', pageId: 'practice' },
    ],
  },
  {
    title: '最佳实践',
    items: [
      { label: '最佳实践', path: '/best-practices', pageId: 'best-practices' },
      { label: '测试策略', path: '/testing-strategies', pageId: 'testing-strategies' },
      { label: '性能优化', path: '/performance-tuning', pageId: 'performance-tuning' },
      { label: '性能基准测试', path: '/performance-benchmark', pageId: 'performance-benchmark' },
      { label: '深度解析', path: '/deep-dive', pageId: 'deep-dive' },
      { label: '错误处理', path: '/error-handling', pageId: 'error-handling' },
      { label: '内容审核', path: '/moderation-safety', pageId: 'moderation-safety' },
      { label: '安全深度分析', path: '/security-deep-dive', pageId: 'security-deep-dive' },
      { label: '故障排查', path: '/troubleshooting', pageId: 'troubleshooting' },
    ],
  },
  {
    title: '面试准备',
    items: [
      { label: '面试准备', path: '/interview-prep', pageId: 'interview-prep' },
    ],
  },
  {
    title: '其他',
    items: [
      { label: '向量搜索', path: '/search', pageId: 'search' },
      { label: '监听器', path: '/chat-listeners', pageId: 'chat-listeners' },
      { label: '常见问题', path: '/faq', pageId: 'faq' },
      { label: '成本优化', path: '/cost-optimization', pageId: 'cost-optimization' },
      { label: '生产环境配置', path: '/production-config', pageId: 'production-config' },
      { label: '部署上线', path: '/deployment', pageId: 'deployment' },
      { label: '框架集成', path: '/integrations', pageId: 'integrations' },
      { label: '实战示例', path: '/examples', pageId: 'examples' },
    ],
  },
];

export const footerLinks = {
  learning: [
    { label: '快速入门', path: '/getting-started' },
    { label: '核心概念', path: '/core-concepts' },
    { label: 'Embedding模型', path: '/embedding-models' },
    { label: 'Prompt模板', path: '/prompt-templates' },
    { label: '输出解析', path: '/output-parsers' },
    { label: '模型提供商', path: '/model-providers' },
    { label: 'Function Calling', path: '/function-calling-deep' },
    { label: '高级特性', path: '/advanced-features' },
    { label: '最佳实践', path: '/best-practices' },
    { label: '实战示例', path: '/examples' },
    { label: '框架集成', path: '/integrations' },
    { label: '问题排查', path: '/troubleshooting' },
  ],
  official: [
    { label: '官方文档', href: 'https://docs.langchain4j.dev', external: true },
    { label: 'GitHub', href: 'https://github.com/langchain4j/langchain4j', external: true },
    { label: '示例代码', href: 'https://github.com/langchain4j/langchain4j-examples', external: true },
  ],
  community: [
    { label: 'Discord', href: 'https://discord.gg/JzF7hqFKrE', external: true },
    { label: 'Twitter', href: 'https://twitter.com/langchain4j', external: true },
    { label: 'Stack Overflow', href: 'https://stackoverflow.com/questions/tagged/langchain4j', external: true },
  ],
};
