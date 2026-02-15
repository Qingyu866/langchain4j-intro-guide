import { lazy, Suspense } from 'react';
import type { ComponentType } from 'react';
import Layout from '../components/layout/Layout';

const HomePage = lazy(() => import('./HomePage'));
const GettingStartedPage = lazy(() => import('./GettingStartedPage'));
const CoreConceptsPage = lazy(() => import('./CoreConceptsPage'));
const EmbeddingModelsPage = lazy(() => import('./EmbeddingModelsPage'));
const PromptTemplatesPage = lazy(() => import('./PromptTemplatesPage'));
const OutputParsersPage = lazy(() => import('./OutputParsersPage'));
const ModelProvidersPage = lazy(() => import('./ModelProvidersPage'));
const FunctionCallingPage = lazy(() => import('./FunctionCallingPage'));
const AdvancedFeaturesPage = lazy(() => import('./AdvancedFeaturesPage'));
const MultimodalPage = lazy(() => import('./MultimodalPage'));
const RagIntroPage = lazy(() => import('./RagIntroPage'));
const RagSetupPage = lazy(() => import('./RagSetupPage'));
const RagImplementationPage = lazy(() => import('./RagImplementationPage'));
const RagAdvancedPage = lazy(() => import('./RagAdvancedPage'));
const RagCompletePage = lazy(() => import('./RagCompletePage'));
const ProjectChatbotPage = lazy(() => import('./ProjectChatbotPage'));
const ProjectAiAssistantPage = lazy(() => import('./ProjectAiAssistantPage'));
const ProjectRagKbPage = lazy(() => import('./ProjectRagKbPage'));
const PracticePage = lazy(() => import('./PracticePage'));
const BestPracticesPage = lazy(() => import('./BestPracticesPage'));
const TestingStrategiesPage = lazy(() => import('./TestingStrategiesPage'));
const PerformanceTuningPage = lazy(() => import('./PerformanceTuningPage'));
const DeepDivePage = lazy(() => import('./DeepDivePage'));
const ErrorHandlingPage = lazy(() => import('./ErrorHandlingPage'));
const ModerationSafetyPage = lazy(() => import('./ModerationSafetyPage'));
const TroubleshootingPage = lazy(() => import('./TroubleshootingPage'));
const InterviewPrepPage = lazy(() => import('./InterviewPrepPage'));
const SearchPage = lazy(() => import('./SearchPage'));
const ChatListenersPage = lazy(() => import('./ChatListenersPage'));
const FaqPage = lazy(() => import('./FaqPage'));
const CostOptimizationPage = lazy(() => import('./CostOptimizationPage'));
const DeploymentPage = lazy(() => import('./DeploymentPage'));
const IntegrationsPage = lazy(() => import('./IntegrationsPage'));
const ExamplesPage = lazy(() => import('./ExamplesPage'));

const LoadingFallback = () => (
  <Layout>
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">加载中...</p>
      </div>
    </div>
  </Layout>
);

export const pageComponents: Record<string, ComponentType> = {
  '/': HomePage,
  '/getting-started': GettingStartedPage,
  '/core-concepts': CoreConceptsPage,
  '/embedding-models': EmbeddingModelsPage,
  '/prompt-templates': PromptTemplatesPage,
  '/output-parsers': OutputParsersPage,
  '/model-providers': ModelProvidersPage,
  '/function-calling-deep': FunctionCallingPage,
  '/advanced-features': AdvancedFeaturesPage,
  '/multimodal-full': MultimodalPage,
  '/rag-intro': RagIntroPage,
  '/rag-setup': RagSetupPage,
  '/rag-implementation': RagImplementationPage,
  '/rag-advanced': RagAdvancedPage,
  '/rag-complete': RagCompletePage,
  '/project-chatbot': ProjectChatbotPage,
  '/project-ai-assistant': ProjectAiAssistantPage,
  '/project-rag-kb': ProjectRagKbPage,
  '/practice': PracticePage,
  '/best-practices': BestPracticesPage,
  '/testing-strategies': TestingStrategiesPage,
  '/performance-tuning': PerformanceTuningPage,
  '/deep-dive': DeepDivePage,
  '/error-handling': ErrorHandlingPage,
  '/moderation-safety': ModerationSafetyPage,
  '/troubleshooting': TroubleshootingPage,
  '/interview-prep': InterviewPrepPage,
  '/search': SearchPage,
  '/chat-listeners': ChatListenersPage,
  '/faq': FaqPage,
  '/cost-optimization': CostOptimizationPage,
  '/deployment': DeploymentPage,
  '/integrations': IntegrationsPage,
  '/examples': ExamplesPage,
};

export const LazyPage = ({ path }: { path: string }) => {
  const PageComponent = pageComponents[path];
  
  if (!PageComponent) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">页面未找到</h1>
          <p className="text-gray-600 mb-8">该页面不存在，请检查 URL 是否正确。</p>
          <a href="/" className="btn btn-primary">返回首页</a>
        </div>
      </Layout>
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <PageComponent />
    </Suspense>
  );
};
