import type { ReactNode } from 'react';
import CodeBlockWithCopy from './CodeBlockWithCopy';
import MermaidChart from './MermaidChart';

interface CodeBlockProps {
  filename?: string;
  children?: string;
  code?: string;
  language?: string;
  title?: string;
}

export const CodeBlock = ({ filename, children, code }: CodeBlockProps) => {
  const content = code || children || '';
  return (
    <div className="code-preview">
      <div className="code-preview-header">
        <div className="code-preview-dots">
          <div className="code-preview-dot code-preview-dot-red"></div>
          <div className="code-preview-dot code-preview-dot-yellow"></div>
          <div className="code-preview-dot code-preview-dot-green"></div>
        </div>
        {filename && <span className="code-preview-filename">{filename}</span>}
      </div>
      <div className="code-preview-content">
        <pre><code>{content}</code></pre>
      </div>
    </div>
  );
};

// 导出带复制功能的代码块组件
export { CodeBlockWithCopy };

interface TagProps {
  variant?: 'indigo' | 'purple' | 'green' | 'blue' | 'yellow' | 'orange' | 'cyan' | 'pink' | 'red';
  children: ReactNode;
}

export const Tag = ({ variant = 'indigo', children }: TagProps) => {
  return (
    <span className={`page-tag ${variant}`}>
      {children}
    </span>
  );
};

interface TipBoxProps {
  variant?: 'blue' | 'green' | 'yellow' | 'indigo' | 'info' | 'warning' | 'tip' | 'success';
  type?: 'blue' | 'green' | 'yellow' | 'indigo' | 'info' | 'warning' | 'tip' | 'success';
  title?: string;
  children: ReactNode;
}

export const TipBox = ({ variant = 'blue', type, title, children }: TipBoxProps) => {
  const boxType = type || variant;
  return (
    <div className={`tip-box tip-box-${boxType}`}>
      {title && <h4 className="tip-box-title">{title}</h4>}
      {children}
    </div>
  );
};

interface CardProps {
  icon: string;
  title: string;
  description: string;
  meta?: string;
  href?: string;
}

export const LearningPathCard = ({ icon, title, description, meta, href }: CardProps) => {
  const content = (
    <>
      <div className="learning-path-card-icon">{icon}</div>
      <div className="learning-path-card-title">{title}</div>
      <div className="learning-path-card-description">{description}</div>
      {meta && <div className="learning-path-card-meta">{meta}</div>}
    </>
  );

  if (href) {
    return (
      <a href={href} className="learning-path-card">
        {content}
      </a>
    );
  }

  return <div className="learning-path-card">{content}</div>;
};

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

export const FeatureItem = ({ icon, title, description }: FeatureItemProps) => {
  return (
    <div className="feature-list-item">
      <div className="feature-list-icon">{icon}</div>
      <div className="feature-list-content">
        <h4 className="feature-list-title">{title}</h4>
        <p className="feature-list-description">{description}</p>
      </div>
    </div>
  );
};

interface SectionHeaderProps {
  number: number;
  title: string;
}

export const SectionHeader = ({ number, title }: SectionHeaderProps) => {
  return (
    <div className="section-header">
      <span className="circular-number">{number}</span>
      <h2>{title}</h2>
    </div>
  );
};

interface TocNavProps {
  items: { href: string; label: string }[];
}

export const TocNav = ({ items }: TocNavProps) => {
  return (
    <nav className="toc-nav">
      <h3>目录</h3>
      <ol>
        {items.map((item, index) => (
          <li key={index}>
            <a href={item.href}>{item.label}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
};

interface SummarySectionProps {
  title?: string;
  description?: string;
  items: string[];
  footer?: string;
}

export const SummarySection = ({ title = '本节小结', description, items, footer }: SummarySectionProps) => {
  return (
    <div className="summary-section">
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      <ul>
        {items.map((item, index) => (
          <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </ul>
      {footer && (
        <div className="border-top">
          <p>{footer}</p>
        </div>
      )}
    </div>
  );
};

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  href?: string;
  children: ReactNode;
  size?: 'normal' | 'lg';
}

export const Button = ({ variant = 'primary', href, children, size = 'normal' }: ButtonProps) => {
  const className = `btn btn-${variant}${size === 'lg' ? ' btn-lg' : ''}`;
  
  if (href) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return <button className={className}>{children}</button>;
};

export const ButtonGroup = ({ children }: { children: ReactNode }) => {
  return <div className="btn-group">{children}</div>;
};

// 导出 MermaidChart 图表组件
export { MermaidChart };

