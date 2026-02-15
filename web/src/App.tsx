import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LazyPage } from './pages/index.tsx';
import './styles/main.css';

const routes = [
  '/',
  '/getting-started',
  '/core-concepts',
  '/embedding-models',
  '/prompt-templates',
  '/output-parsers',
  '/model-providers',
  '/function-calling-deep',
  '/advanced-features',
  '/multimodal-full',
  '/rag-intro',
  '/rag-setup',
  '/rag-implementation',
  '/rag-advanced',
  '/rag-complete',
  '/project-chatbot',
  '/project-ai-assistant',
  '/project-rag-kb',
  '/practice',
  '/best-practices',
  '/testing-strategies',
  '/performance-tuning',
  '/deep-dive',
  '/error-handling',
  '/moderation-safety',
  '/troubleshooting',
  '/interview-prep',
  '/search',
  '/chat-listeners',
  '/faq',
  '/cost-optimization',
  '/deployment',
  '/integrations',
  '/examples',
];

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((path) => (
          <Route
            key={path}
            path={path}
            element={<LazyPage path={path} />}
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
