import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import './MermaidChart.css';

interface MermaidChartProps {
  chart: string;
  config?: any;
}

let mermaidInitialized = false;

const MermaidChart = ({ chart, config }: MermaidChartProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mermaidInitialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: 'basis',
        },
        sequence: {
          useMaxWidth: true,
        },
        ...config,
      });
      mermaidInitialized = true;
    }
  }, [config]);

  useEffect(() => {
    if (ref.current && chart) {
      const uniqueId = 'chart-' + Math.random().toString(36).substring(7);
      
      const lines = chart.split('\n');
      const minIndent = Math.min(
        ...lines
          .filter(line => line.trim().length > 0)
          .map(line => {
            const match = line.match(/^(\s*)/);
            return match ? match[1].length : 0;
          })
      );
      
      let trimmedChart = lines
        .map(line => line.substring(minIndent))
        .join('\n')
        .trim();

      trimmedChart = trimmedChart.replace(/<br\s*\/?>/gi, '<br/>');

      mermaid.parse(trimmedChart, { suppressErrors: false })
        .then((parseResult) => {
          if (parseResult) {
            return mermaid.render(uniqueId, trimmedChart);
          }
          throw new Error('Parse result is empty');
        })
        .then((result) => {
          if (ref.current) {
            ref.current.innerHTML = result.svg;
          }
        })
        .catch((error) => {
          console.error('Mermaid rendering error:', error);
          console.error('Chart content:', trimmedChart);
          if (ref.current) {
            const errorMsg = error.message || String(error);
            ref.current.innerHTML = `<pre class="error" style="white-space: pre-wrap; font-size: 12px; color: #dc2626; background: #fef2f2; padding: 12px; border-radius: 8px;">图表加载失败:\n${errorMsg}\n\n图表内容:\n${trimmedChart.substring(0, 500)}...</pre>`;
          }
        });
    }
  }, [chart]);

  return (
    <div className="mermaid-chart-wrapper">
      <div ref={ref} className="mermaid-chart" />
    </div>
  );
};

export default MermaidChart;
