import { useState, useEffect, useRef, type ReactNode } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-docker';
import './CodeBlockWithCopy.css';

interface CodeBlockWithCopyProps {
  code?: string;
  language?: string;
  filename?: string;
  title?: string;
  children?: ReactNode;
}

/**
 * 代码块组件（带复制功能和语法高亮）
 * 支持一键复制代码，显示文件名和语言
 * 支持两种用法：
 * 1. <CodeBlockWithCopy code={...} />
 * 2. <CodeBlockWithCopy filename="...">{children}</CodeBlockWithCopy>
 */
const CodeBlockWithCopy = ({ code, language = 'java', filename, title, children }: CodeBlockWithCopyProps) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  // 支持 children 形式：提取内容作为 code
  const content = code || (typeof children === 'string' ? children : String(children));

  // 语法高亮
  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [content, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
      // 降级方案：使用传统方法
      fallbackCopy(content);
    }
  };

  // Clipboard API 降级方案
  const fallbackCopy = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('降级复制也失败:', err);
    }
    document.body.removeChild(textarea);
  };

  return (
    <div className="code-block-wrapper">
      <div className="code-header">
        {(title || filename) && (
          <span className="code-filename">{title || filename}</span>
        )}
        {!title && !filename && <span className="code-language">{language.toUpperCase()}</span>}
        <button
          onClick={handleCopy}
          className="copy-button"
          aria-label="复制代码"
        >
          {copied ? '✓ 已复制' : '📋 复制'}
        </button>
      </div>
      <pre className="code-content">
        <code ref={codeRef} className={`language-${language}`}>{content}</code>
      </pre>
    </div>
  );
};

export default CodeBlockWithCopy;
