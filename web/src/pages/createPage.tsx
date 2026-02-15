import Layout from '../components/layout/Layout';
import { Tag, CodeBlock, SectionHeader } from '../components/ui';

interface PageConfig {
  title: string;
  description: string;
  tags?: { text: string; variant: 'indigo' | 'purple' | 'green' | 'blue' }[];
  sections: {
    number: number;
    title: string;
    content: string;
    code?: { filename: string; content: string }[];
  }[];
  nextLink?: { href: string; text: string };
}

const createPage = (config: PageConfig) => {
  return () => (
    <Layout>
      {config.tags && (
        <div className="page-tags">
          {config.tags.map((tag, index) => (
            <Tag key={index} variant={tag.variant}>{tag.text}</Tag>
          ))}
        </div>
      )}
      
      <h1 className="page-title">{config.title}</h1>
      <p className="page-description">{config.description}</p>

      {config.sections.map((section) => (
        <section key={section.number} className="content-section">
          <SectionHeader number={section.number} title={section.title} />
          <p className="paragraph">{section.content}</p>
          {section.code?.map((codeBlock, index) => (
            <CodeBlock key={index} filename={codeBlock.filename}>
              {codeBlock.content}
            </CodeBlock>
          ))}
        </section>
      ))}

      {config.nextLink && (
        <section className="content-section">
          <div className="text-center">
            <a href={config.nextLink.href} className="btn btn-primary btn-lg">
              {config.nextLink.text} →
            </a>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default createPage;
