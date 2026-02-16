import Layout from '../components/layout/Layout';
import { Tag, SectionHeader, CodeBlockWithCopy, TipBox, MermaidChart } from '../components/ui';

const basicSplitterCode = `import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.DocumentSplitter;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingStore;

import static dev.langchain4j.data.document.splitter.DocumentSplitters.*;

/**
 * 基础文档分割示例
 */
public class BasicSplittingExample {

    private final EmbeddingModel embeddingModel;
    private final EmbeddingStore<TextSegment> embeddingStore;

    public void splitAndEmbed(String documentText) {
        // 方式1: 按字符数分割（最简单）
        DocumentSplitter characterSplitter = byCharacter(
            500,    // 每个段落的字符数
            50      // 段落之间的重叠字符数
        );

        // 方式2: 按段落分割（保留语义完整性）
        DocumentSplitter paragraphSplitter = byParagraph(
            500,    // 每个段落的最大字符数
            50,     // 段落之间的重叠字符数
            "\\n\\n"  // 段落分隔符（双换行）
        );

        // 方式3: 递归分割（推荐用于大多数场景）
        DocumentSplitter recursiveSplitter = recursive(
            500,    // 最大段落数
            50,     // 重叠字符数
            new CharacterTextSplitter()  // 基础分割器
        );

        // 选择一个分割器
        DocumentSplitter splitter = paragraphSplitter;

        // 加载文档
        Document document = Document.from(documentText);

        // 分割文档
        List<TextSegment> segments = splitter.split(document);

        // 为每个段落生成向量并存储
        for (TextSegment segment : segments) {
            // 生成嵌入向量
            Embedding embedding = embeddingModel.embed(segment).content();

            // 存储到向量数据库
            embeddingStore.add(
                UUID.randomUUID().toString(),  // ID
                segment,                        // 文本段落
                embedding                       // 向量
            );
        }

        System.out.println("文档分割完成，共 " + segments.size() + " 个段落");
    }
}`;

const advancedSplitterCode = `import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.DocumentSplitter;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.data.document.splitter.DocumentByParagraphSplitter;
import dev.langchain4j.data.document.splitter.DocumentByCharacterSplitter;
import dev.langchain4j.data.document.splitter.DocumentByLineSplitter;
import dev.langchain4j.data.document.splitter.DocumentBySentenceSplitter;
import dev.langchain4j.data.document.splitter.HierarchicalDocumentSplitter;
import dev.langchain4j.data.document.splitter.TextSplitter;

/**
 * 高级分割策略示例
 */
public class AdvancedSplittingExample {

    /**
     * 策略1: 按句子分割（适合新闻、文章）
     */
    public List<TextSegment> splitBySentence(Document document) {
        DocumentSplitter sentenceSplitter = new DocumentBySentenceSplitter(
            500,    // 每个段落的最大句子数
            50,     // 段落之间的重叠句子数
            20      // 每个句子的最小字符数
        );

        return sentenceSplitter.split(document);
    }

    /**
     * 策略2: 按行分割（适合代码、日志）
     */
    public List<TextSegment> splitByLine(Document document) {
        DocumentSplitter lineSplitter = new DocumentByLineSplitter(
            20,     // 每个段落的行数
            2       // 段落之间的重叠行数
        );

        return lineSplitter.split(document);
    }

    /**
     * 策略3: 分层分割（适合长文档）
     * 先按章节分割，再按段落分割
     */
    public List<TextSegment> splitHierarchically(Document document) {
        // 第一层：按章节分割（大的 Markdown 标题）
        TextSplitter chapterSplitter = new MarkdownHeaderTextSplitter(
            Set.of("#", "##", "###")  // 支持的标题级别
        );

        // 第二层：章节内按段落分割
        DocumentSplitter paragraphSplitter = new DocumentByParagraphSplitter(
            500, 50, "\n\n"
        );

        // 创建分层分割器
        DocumentSplitter hierarchicalSplitter = new HierarchicalDocumentSplitter(
            chapterSplitter,           // 第一层分割器
            (text) -> {                // 第二层分割器工厂
                Document subDoc = Document.from(text);
                return paragraphSplitter.split(subDoc);
            }
        );

        return hierarchicalSplitter.split(document);
    }

    /**
     * 策略4: 自定义分割器（按特定分隔符）
     */
    public static class CustomSeparatorSplitter implements DocumentSplitter {

        private final int maxSegmentSize;
        private final int overlapSize;
        private final String separator;

        public CustomSeparatorSplitter(
                int maxSegmentSize,
                int overlapSize,
                String separator) {
            this.maxSegmentSize = maxSegmentSize;
            this.overlapSize = overlapSize;
            this.separator = separator;
        }

        @Override
        public List<TextSegment> split(Document document) {
            String text = document.text();
            List<TextSegment> segments = new ArrayList<>();

            // 按自定义分隔符分割
            String[] parts = text.split(Pattern.quote(separator));

            StringBuilder currentSegment = new StringBuilder();
            int currentLength = 0;

            for (String part : parts) {
                if (currentLength + part.length() + separator.length() > maxSegmentSize) {
                    // 保存当前段落
                    if (currentSegment.length() > 0) {
                        segments.add(TextSegment.from(currentSegment.toString()));
                    }

                    // 开始新段落（包含重叠）
                    String overlap = extractOverlap(currentSegment.toString());
                    currentSegment = new StringBuilder(overlap);
                    currentLength = overlap.length();
                }

                currentSegment.append(part).append(separator);
                currentLength += part.length() + separator.length();
            }

            // 保存最后一段
            if (currentSegment.length() > 0) {
                segments.add(TextSegment.from(currentSegment.toString()));
            }

            return segments;
        }

        private String extractOverlap(String text) {
            if (text.length() <= overlapSize) {
                return text;
            }

            // 从末尾提取重叠部分
            return text.substring(text.length() - overlapSize);
        }
    }
}`;

const semanticSplitterCode = `import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.data.document.splitter.DocumentSplitter;

import java.util.ArrayList;
import java.util.List;

/**
 * 语义分割器
 * 基于句子相似度决定分割点
 */
public class SemanticDocumentSplitter implements DocumentSplitter {

    private final EmbeddingModel embeddingModel;
    private final int maxSegmentSize;
    private final int overlapSize;
    private final double similarityThreshold;

    public SemanticDocumentSplitter(
            EmbeddingModel embeddingModel,
            int maxSegmentSize,
            int overlapSize,
            double similarityThreshold) {
        this.embeddingModel = embeddingModel;
        this.maxSegmentSize = maxSegmentSize;
        this.overlapSize = overlapSize;
        this.similarityThreshold = similarityThreshold;
    }

    @Override
    public List<TextSegment> split(Document document) {
        List<String> sentences = extractSentences(document.text());
        List<TextSegment> segments = new ArrayList<>();

        List<String> currentSegment = new ArrayList<>();
        int currentLength = 0;

        for (int i = 0; i < sentences.size(); i++) {
            String sentence = sentences.get(i);

            // 检查是否超过最大长度
            if (currentLength + sentence.length() > maxSegmentSize &&
                !currentSegment.isEmpty()) {

                // 检查是否应该在此分割（语义边界）
                if (i < sentences.size() - 1) {
                    String nextSentence = sentences.get(i + 1);
                    double similarity = calculateSimilarity(
                        sentence,
                        nextSentence
                    );

                    // 如果相似度高，继续添加；否则分割
                    if (similarity < similarityThreshold) {
                        segments.add(createSegment(currentSegment));

                        // 创建重叠
                        currentSegment = createOverlap(currentSegment);
                        currentLength = calculateLength(currentSegment);
                    }
                }
            }

            currentSegment.add(sentence);
            currentLength += sentence.length();
        }

        // 添加最后一段
        if (!currentSegment.isEmpty()) {
            segments.add(createSegment(currentSegment));
        }

        return segments;
    }

    /**
     * 计算两个句子的余弦相似度
     */
    private double calculateSimilarity(String sentence1, String sentence2) {
        try {
            var embedding1 = embeddingModel.embed(sentence1).content();
            var embedding2 = embeddingModel.embed(sentence2).content();

            return cosineSimilarity(embedding1.vector(), embedding2.vector());
        } catch (Exception e) {
            // 如果嵌入失败，返回默认相似度
            return 0.0;
        }
    }

    /**
     * 计算余弦相似度
     */
    private double cosineSimilarity(float[] vec1, float[] vec2) {
        double dotProduct = 0.0;
        double norm1 = 0.0;
        double norm2 = 0.0;

        for (int i = 0; i < vec1.length; i++) {
            dotProduct += vec1[i] * vec2[i];
            norm1 += vec1[i] * vec1[i];
            norm2 += vec2[i] * vec2[i];
        }

        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }

    /**
     * 提取句子
     */
    private List<String> extractSentences(String text) {
        // 简单的句子分割（实际应用中应使用更复杂的NLP库）
        return List.of(text.split("[.!?]+"));
    }

    private TextSegment createSegment(List<String> sentences) {
        return TextSegment.from(String.join(" ", sentences));
    }

    private List<String> createOverlap(List<String> sentences) {
        // 保留最后几个句子作为重叠
        int overlapSentences = Math.min(overlapSize / 50, sentences.size());
        return sentences.subList(
            sentences.size() - overlapSentences,
            sentences.size()
        );
    }

    private int calculateLength(List<String> sentences) {
        return sentences.stream()
            .mapToInt(String::length)
            .sum() + sentences.size() - 1;  // 加空格
    }
}

/**
 * 使用示例
 */
public class SemanticSplittingUsage {

    private final EmbeddingModel embeddingModel;

    public void semanticallySplitDocument(Document document) {
        // 创建语义分割器
        SemanticDocumentSplitter splitter = new SemanticDocumentSplitter(
            embeddingModel,
            500,      // 最大段落大小
            50,       // 重叠大小
            0.7       // 相似度阈值（0-1）
        );

        // 分割文档
        List<TextSegment> segments = splitter.split(document);

        System.out.println("语义分割完成，共 " + segments.size() + " 个段落");

        // 输出分割结果
        for (int i = 0; i < segments.size(); i++) {
            TextSegment segment = segments.get(i);
            System.out.printf(
                "段落 %d: %d 字符%n%s%n...%n",
                i + 1,
                segment.text().length(),
                segment.text().substring(0, Math.min(100, segment.text().length()))
            );
        }
    }
}`;

const markdownSplitterCode = `import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.data.document.splitter.DocumentSplitter;
import dev.langchain4j.data.document.splitter.TextSplitter;

import java.util.*;
import java.util.regex.Pattern;

/**
 * Markdown 文档分割器
 * 保持 Markdown 结构的语义完整性
 */
public class MarkdownDocumentSplitter implements DocumentSplitter {

    private final int maxSegmentSize;
    private final int overlapSize;

    // Markdown 标题模式
    private static final Pattern HEADER_PATTERN = Pattern.compile("^(#{1,6})\\s+(.+)$");

    // 代码块模式
    private static final Pattern CODE_BLOCK_PATTERN = Pattern.compile("^\`\`\`[\\s\\S]*?^\`\`\`", Pattern.MULTILINE | Pattern.DOTALL);

    public MarkdownDocumentSplitter(int maxSegmentSize, int overlapSize) {
        this.maxSegmentSize = maxSegmentSize;
        this.overlapSize = overlapSize;
    }

    @Override
    public List<TextSegment> split(Document document) {
        String text = document.text();
        List<TextSegment> segments = new ArrayList<>();

        // 1. 提取所有 Markdown 标题作为自然分割点
        List<MarkdownSection> sections = extractMarkdownSections(text);

        // 2. 为每个章节创建段落
        List<String> currentSegmentContent = new ArrayList<>();
        int currentLength = 0;

        for (MarkdownSection section : sections) {
            int sectionLength = section.content().length();

            // 如果添加此章节会超过最大长度
            if (currentLength + sectionLength > maxSegmentSize && !currentSegmentContent.isEmpty()) {
                // 保存当前段落
                segments.add(TextSegment.from(String.join("\n\n", currentSegmentContent)));

                // 创建重叠（保留上一个章节的标题）
                if (!currentSegmentContent.isEmpty()) {
                    String lastSection = currentSegmentContent.get(currentSegmentContent.size() - 1);
                    currentSegmentContent = new ArrayList<>(List.of(lastSection));
                    currentLength = lastSection.length();
                } else {
                    currentSegmentContent.clear();
                    currentLength = 0;
                }
            }

            // 添加当前章节
            currentSegmentContent.add(section.header() + "\n\n" + section.content());
            currentLength += sectionLength;
        }

        // 添加最后一段
        if (!currentSegmentContent.isEmpty()) {
            segments.add(TextSegment.from(String.join("\n\n", currentSegmentContent)));
        }

        return segments;
    }

    /**
     * 提取 Markdown 章节
     */
    private List<MarkdownSection> extractMarkdownSections(String markdown) {
        List<MarkdownSection> sections = new ArrayList<>();

        String[] lines = markdown.split("\n");
        StringBuilder currentContent = new StringBuilder();
        String currentHeader = "# Root";  // 默认标题
        int currentLevel = 0;

        for (String line : lines) {
            var headerMatcher = HEADER_PATTERN.matcher(line);

            if (headerMatcher.find()) {
                // 保存上一个章节
                if (currentContent.length() > 0) {
                    sections.add(new MarkdownSection(
                        currentHeader,
                        currentContent.toString().trim()
                    ));
                }

                // 开始新章节
                currentHeader = line;
                currentLevel = headerMatcher.group(1).length();
                currentContent = new StringBuilder();
            } else {
                // 添加到当前章节内容
                currentContent.append(line).append("\n");
            }
        }

        // 保存最后一个章节
        if (currentContent.length() > 0) {
            sections.add(new MarkdownSection(
                currentHeader,
                currentContent.toString().trim()
            ));
        }

        return sections;
    }

    /**
     * Markdown 章节数据类
     */
    private record MarkdownSection(String header, String content) {}
}

/**
 * 使用示例
 */
public class MarkdownSplittingUsage {

    public void splitMarkdownDocument(String markdownContent) {
        // 创建 Markdown 分割器
        MarkdownDocumentSplitter splitter = new MarkdownDocumentSplitter(
            1000,   // 每个段落最大字符数
            100     // 段落之间的重叠字符数
        );

        // 创建文档
        Document document = Document.from(markdownContent);

        // 分割文档
        List<TextSegment> segments = splitter.split(document);

        System.out.println("Markdown 文档分割完成，共 " + segments.size() + " 个段落");

        // 输出每个段落的标题
        for (int i = 0; i < segments.size(); i++) {
            TextSegment segment = segments.get(i);
            String firstLine = segment.text().split("\n")[0];

            System.out.printf(
                "段落 %d: %s... (%d 字符)%n",
                i + 1,
                firstLine,
                segment.text().length()
            );
        }
    }
}`;

const codeSplitterCode = `import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.data.document.splitter.DocumentSplitter;

import java.util.*;
import java.util.regex.Pattern;

/**
 * 代码文档分割器
 * 保持代码块的完整性
 */
public class CodeDocumentSplitter implements DocumentSplitter {

    private final int maxSegmentSize;
    private final int overlapSize;
    private final boolean preserveCodeBlocks;

    // 代码块模式
    private static final Pattern CODE_BLOCK = Pattern.compile(
        "\`\`\`\\w*\\n[\\s\\S]*?\`\`\`",
        Pattern.DOTALL
    );

    public CodeDocumentSplitter(
            int maxSegmentSize,
            int overlapSize,
            boolean preserveCodeBlocks) {
        this.maxSegmentSize = maxSegmentSize;
        this.overlapSize = overlapSize;
        this.preserveCodeBlocks = preserveCodeBlocks;
    }

    @Override
    public List<TextSegment> split(Document document) {
        String text = document.text();
        List<TextSegment> segments = new ArrayList<>();

        if (preserveCodeBlocks) {
            // 策略1: 保持代码块完整
            segments = splitWithCodeBlocks(text);
        } else {
            // 策略2: 像普通文本一样分割
            segments = splitNormally(text);
        }

        return segments;
    }

    /**
     * 保持代码块完整的分割
     */
    private List<TextSegment> splitWithCodeBlocks(String text) {
        List<TextSegment> segments = new ArrayList<>();

        // 提取所有代码块的位置
        List<CodeBlockRange> codeBlocks = extractCodeBlocks(text);

        if (codeBlocks.isEmpty()) {
            // 没有代码块，正常分割
            return splitNormally(text);
        }

        // 按代码块分割文本
        int lastEnd = 0;
        StringBuilder currentSegment = new StringBuilder();

        for (CodeBlockRange block : codeBlocks) {
            // 添加代码块前的文本
            String beforeCode = text.substring(lastEnd, block.start());

            if (currentSegment.length() + beforeCode.length() > maxSegmentSize) {
                // 保存当前段落
                if (currentSegment.length() > 0) {
                    segments.add(TextSegment.from(currentSegment.toString()));
                    currentSegment = new StringBuilder();
                }
            }

            currentSegment.append(beforeCode);

            // 检查是否需要分割代码块
            String codeContent = text.substring(block.start(), block.end());

            if (codeContent.length() > maxSegmentSize) {
                // 代码块太长，需要分割
                if (currentSegment.length() > 0) {
                    segments.add(TextSegment.from(currentSegment.toString()));
                }

                // 分割大代码块
                List<TextSegment> codeSegments = splitLargeCodeBlock(codeContent);
                segments.addAll(codeSegments);

                currentSegment = new StringBuilder();
            } else {
                // 检查整体长度
                if (currentSegment.length() + codeContent.length() > maxSegmentSize) {
                    if (currentSegment.length() > 0) {
                        segments.add(TextSegment.from(currentSegment.toString()));
                        currentSegment = new StringBuilder();
                    }
                }

                currentSegment.append(codeContent);
            }

            lastEnd = block.end();
        }

        // 添加剩余文本
        if (lastEnd < text.length()) {
            String remaining = text.substring(lastEnd);
            currentSegment.append(remaining);
        }

        // 添加最后一段
        if (currentSegment.length() > 0) {
            segments.add(TextSegment.from(currentSegment.toString()));
        }

        return segments;
    }

    /**
     * 提取所有代码块的位置
     */
    private List<CodeBlockRange> extractCodeBlocks(String text) {
        List<CodeBlockRange> ranges = new ArrayList<>();
        java.util.regex.Matcher matcher = CODE_BLOCK.matcher(text);

        while (matcher.find()) {
            ranges.add(new CodeBlockRange(matcher.start(), matcher.end()));
        }

        return ranges;
    }

    /**
     * 分割大代码块
     */
    private List<TextSegment> splitLargeCodeBlock(String codeBlock) {
        List<TextSegment> segments = new ArrayList<>();

        // 移除代码块标记
        String code = codeBlock.replaceAll("^\`\`\`\\w*\\n|\`\`\`", "");

        // 按行分割
        String[] lines = code.split("\n");
        StringBuilder currentChunk = new StringBuilder();
        int currentLength = 0;

        for (String line : lines) {
            if (currentLength + line.length() > maxSegmentSize) {
                if (currentChunk.length() > 0) {
                    segments.add(TextSegment.from(currentChunk.toString()));
                    currentChunk = new StringBuilder();
                    currentLength = 0;
                }
            }

            currentChunk.append(line).append("\n");
            currentLength += line.length() + 1;
        }

        if (currentChunk.length() > 0) {
            segments.add(TextSegment.from(currentChunk.toString()));
        }

        return segments;
    }

    /**
     * 正常分割（不考虑代码块）
     */
    private List<TextSegment> splitNormally(String text) {
        // 使用字符分割
        List<TextSegment> segments = new ArrayList<>();
        int start = 0;

        while (start < text.length()) {
            int end = Math.min(start + maxSegmentSize, text.length());
            String segment = text.substring(start, end);
            segments.add(TextSegment.from(segment));

            start = end - overlapSize;
        }

        return segments;
    }

    /**
     * 代码块范围
     */
    private record CodeBlockRange(int start, int end) {}
}

/**
 * 使用示例
 */
public class CodeSplittingUsage {

    public void splitCodeDocument(String codeContent) {
        // 创建代码分割器（保持代码块完整）
        CodeDocumentSplitter splitter = new CodeDocumentSplitter(
            1500,   // 每个段落最大字符数
            200,    // 重叠字符数
            true    // 保持代码块完整
        );

        Document document = Document.from(codeContent);
        List<TextSegment> segments = splitter.split(document);

        System.out.println("代码文档分割完成，共 " + segments.size() + " 个段落");

        // 分析分割质量
        for (TextSegment segment : segments) {
            boolean hasCode = segment.text().contains("\`\`\`");
            boolean cutInMiddle = segment.text().startsWith("\`\`\`") &&
                                  !segment.text().endsWith("\`\`\`");

            System.out.printf(
                "段落: %d 字符, 包含代码块: %s, 完整代码块: %s%n",
                segment.text().length(),
                hasCode ? "是" : "否",
                !cutInMiddle ? "是" : "否"
            );
        }
    }
}`;

const metadataSplitterCode = `import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.DocumentType;
import dev.langchain4j.data.segment.Metadata;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.data.document.splitter.DocumentSplitter;

import java.time.LocalDateTime;
import java.util.*;

/**
 * 带元数据的文档分割器
 * 为每个段落添加丰富的元数据
 */
public class MetadataAwareDocumentSplitter implements DocumentSplitter {

    private final DocumentSplitter delegate;
    private final Map<String, String> globalMetadata;

    public MetadataAwareDocumentSplitter(
            DocumentSplitter delegate,
            Map<String, String> globalMetadata) {
        this.delegate = delegate;
        this.globalMetadata = globalMetadata;
    }

    @Override
    public List<TextSegment> split(Document document) {
        // 基础分割
        List<TextSegment> segments = delegate.split(document);

        // 为每个段落添加元数据
        List<TextSegment> enrichedSegments = new ArrayList<>();
        int segmentIndex = 0;

        for (TextSegment segment : segments) {
            Metadata metadata = Metadata.from(
                // 全局元数据
                globalMetadata,
                // 文档元数据
                "document_id", document.id(),
                "document_name", document.name(),
                "document_type", document.type().toString(),
                "document_url", document.url().orElse(""),
                // 段落元数据
                "segment_index", String.valueOf(segmentIndex),
                "segment_length", String.valueOf(segment.text().length()),
                "created_at", LocalDateTime.now().toString(),
                // 统计元数据
                "word_count", String.valueOf(countWords(segment.text())),
                "sentence_count", String.valueOf(countSentences(segment.text()))
            );

            // 创建带有元数据的新段落
            TextSegment enrichedSegment = TextSegment.from(
                segment.text(),
                metadata
            );

            enrichedSegments.add(enrichedSegment);
            segmentIndex++;
        }

        return enrichedSegments;
    }

    private int countWords(String text) {
        return text.split("\\s+").length;
    }

    private int countSentences(String text) {
        return text.split("[.!?]+").length;
    }
}

/**
 * 使用示例
 */
public class MetadataSplittingUsage {

    public void splitWithMetadata(Document document) {
        // 准备全局元数据
        Map<String, String> globalMetadata = new HashMap<>();
        globalMetadata.put("project", "LangChain4j Docs");
        globalMetadata.put("version", "1.0.0");
        globalMetadata.put("language", "zh-CN");
        globalMetadata.put("author", "AI Assistant");

        // 创建基础分割器
        DocumentSplitter baseSplitter = DocumentSplitters.recursive(
            500, 50
        );

        // 创建带元数据的分割器
        MetadataAwareDocumentSplitter splitter = new MetadataAwareDocumentSplitter(
            baseSplitter,
            globalMetadata
        );

        // 分割文档
        List<TextSegment> segments = splitter.split(document);

        // 查看元数据
        for (TextSegment segment : segments) {
            System.out.println("段落内容: " +
                segment.text().substring(0, Math.min(50, segment.text().length())) + "..."
            );
            System.out.println("元数据:");
            segment.metadata().asMap().forEach((key, value) ->
                System.out.println("  " + key + ": " + value)
            );
            System.out.println();
        }
    }
}`;

const splittingBestPracticesCode = `import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.data.document.splitter.DocumentSplitter;
import dev.langchain4j.model.embedding.EmbeddingModel;

import java.util.*;

/**
 * 文档分割最佳实践
 */
public class SplittingBestPractices {

    /**
     * 最佳实践1: 根据文档类型选择分割策略
     */
    public DocumentSplitter chooseSplitterByType(Document document) {
        String fileName = document.name().toLowerCase();
        String content = document.text().toLowerCase();

        // Markdown 文档
        if (fileName.endsWith(".md")) {
            return new MarkdownDocumentSplitter(1000, 100);
        }

        // 代码文件
        if (fileName.endsWith(".java") ||
            fileName.endsWith(".py") ||
            fileName.endsWith(".js")) {
            return new CodeDocumentSplitter(1500, 200, true);
        }

        // 新闻/文章（大量句子）
        if (content.contains("记者") || content.contains("报道")) {
            return new DocumentBySentenceSplitter(500, 50, 20);
        }

        // 日志文件
        if (content.contains("[ERROR]") || content.contains("[INFO]")) {
            return new DocumentByLineSplitter(20, 2);
        }

        // 默认：递归字符分割
        return DocumentSplitters.recursive(500, 50);
    }

    /**
     * 最佳实践2: 自适应分割（根据内容调整）
     */
    public List<TextSegment> adaptiveSplit(Document document, EmbeddingModel embeddingModel) {
        String text = document.text();

        // 根据文档长度选择策略
        if (text.length() < 1000) {
            // 短文档：不分割
            return List.of(TextSegment.from(text));
        } else if (text.length() < 10000) {
            // 中等文档：简单分割
            DocumentSplitter splitter = DocumentSplitters.recursive(800, 100);
            return splitter.split(document);
        } else {
            // 长文档：语义分割
            SemanticDocumentSplitter splitter = new SemanticDocumentSplitter(
                embeddingModel,
                500, 50, 0.7
            );
            return splitter.split(document);
        }
    }

    /**
     * 最佳实践3: 分割质量评估
     */
    public class SplittingQualityMetrics {

        private List<TextSegment> segments;

        public SplittingQualityMetrics(List<TextSegment> segments) {
            this.segments = segments;
        }

        /**
         * 计算平均段落长度
         */
        public double averageSegmentLength() {
            return segments.stream()
                .mapToInt(s -> s.text().length())
                .average()
                .orElse(0.0);
        }

        /**
         * 计算段落长度标准差
         */
        public double segmentLengthStdDev() {
            double avg = averageSegmentLength();
            double variance = segments.stream()
                .mapToDouble(s -> Math.pow(s.text().length() - avg, 2))
                .average()
                .orElse(0.0);
            return Math.sqrt(variance);
        }

        /**
         * 检测段落过短
         */
        public List<Integer> findTooShortSegments(int minLength) {
            List<Integer> indices = new ArrayList<>();

            for (int i = 0; i < segments.size(); i++) {
                if (segments.get(i).text().length() < minLength) {
                    indices.add(i);
                }
            }

            return indices;
        }

        /**
         * 检测段落过长
         */
        public List<Integer> findTooLongSegments(int maxLength) {
            List<Integer> indices = new ArrayList<>();

            for (int i = 0; i < segments.size(); i++) {
                if (segments.get(i).text().length() > maxLength) {
                    indices.add(i);
                }
            }

            return indices;
        }

        /**
         * 计算重叠利用率
         */
        public double overlapUtilization(int targetOverlap) {
            int actualOverlap = 0;
            int count = 0;

            for (int i = 1; i < segments.size(); i++) {
                String prev = segments.get(i - 1).text();
                String curr = segments.get(i).text();

                int overlap = calculateOverlap(prev, curr);
                actualOverlap += overlap;
                count++;
            }

            return count > 0 ? (double) actualOverlap / count / targetOverlap : 0.0;
        }

        private int calculateOverlap(String text1, String text2) {
            // 简单的重叠计算（前一个段落的末尾与后一个段落的开头）
            int maxOverlap = Math.min(200, text1.length() / 2, text2.length() / 2);
            int bestOverlap = 0;

            for (int i = 1; i <= maxOverlap; i++) {
                String suffix = text1.substring(text1.length() - i);
                String prefix = text2.substring(0, i);

                if (suffix.equals(prefix)) {
                    bestOverlap = i;
                }
            }

            return bestOverlap;
        }

        /**
         * 打印质量报告
         */
        public void printQualityReport() {
            System.out.println("=== 分割质量报告 ===");
            System.out.printf("段落总数: %d%n", segments.size());
            System.out.printf("平均长度: %.1f 字符%n", averageSegmentLength());
            System.out.printf("长度标准差: %.1f%n", segmentLengthStdDev());
            System.out.printf("重叠利用率: %.1f%%%n",
                overlapUtilization(50) * 100);

            List<Integer> tooShort = findTooShortSegments(100);
            if (!tooShort.isEmpty()) {
                System.out.println("过短段落: " + tooShort);
            }

            List<Integer> tooLong = findTooLongSegments(1000);
            if (!tooLong.isEmpty()) {
                System.out.println("过长段落: " + tooLong);
            }
        }
    }

    /**
     * 使用质量指标
     */
    public void evaluateSplitting(List<TextSegment> segments) {
        SplittingQualityMetrics metrics = new SplittingQualityMetrics(segments);
        metrics.printQualityReport();

        // 根据质量指标调整参数
        if (metrics.averageSegmentLength() < 200) {
            System.out.println("建议: 增加段落大小以提高检索质量");
        }

        if (metrics.segmentLengthStdDev() > 300) {
            System.out.println("建议: 使用语义分割使段落大小更均匀");
        }

        if (metrics.overlapUtilization(50) < 0.3) {
            System.out.println("建议: 增加重叠大小以保留更多上下文");
        }
    }
}`;

const DocumentSplittingPage = () => {
  return (
    <Layout>
      <div className="page-tags">
        <Tag variant="indigo">文档分割</Tag>
        <Tag variant="purple">RAG 核心</Tag>
        <Tag variant="green">检索优化</Tag>
      </div>

      <h1 className="page-title">Document Splitter</h1>
      <p className="page-description">
        深入理解 LangChain4j 的文档分割器，掌握 RAG 系统的核心技术。
      </p>

      <nav className="toc-nav">
        <h3 className="toc-title">目录</h3>
        <ol className="toc-list">
          <li className="toc-item"><span className="toc-number">1.</span> <a href="#overview" className="toc-link">分割概述</a></li>
          <li className="toc-item"><span className="toc-number">2.</span> <a href="#basic" className="toc-link">基础分割策略</a></li>
          <li className="toc-item"><span className="toc-number">3.</span> <a href="#advanced" className="toc-link">高级分割策略</a></li>
          <li className="toc-item"><span className="toc-number">4.</span> <a href="#semantic" className="toc-link">语义分割</a></li>
          <li className="toc-item"><span className="toc-number">5.</span> <a href="#specialized" className="toc-link">专门格式分割</a></li>
          <li className="toc-item"><span className="toc-number">6.</span> <a href="#metadata" className="toc-link">元数据处理</a></li>
          <li className="toc-item"><span className="toc-number">7.</span> <a href="#best-practices" className="toc-link">最佳实践</a></li>
        </ol>
      </nav>

      <section id="overview" className="content-section">
        <SectionHeader number={1} title="分割概述" />
        <p className="paragraph">
          Document Splitter 是 RAG 系统的核心组件，直接影响检索质量。合理的文档分割能够保持语义完整性，提高向量检索的准确性。
        </p>

        <h3 className="subsection-title">1.1 为什么需要文档分割</h3>
        <p className="text-gray-700 mb-4">LLM 的上下文窗口有限，必须将长文档分割成小段落：</p>

        <div className="grid-2col">
          <div className="card card-green">
            <h4 className="font-semibold text-green-800 mb-2">✅ 优势</h4>
            <ul className="text-green-700 text-sm space-y-1">
              <li>适应 LLM 上下文窗口</li>
              <li>提高检索精确度</li>
              <li>保持语义完整性</li>
              <li>支持并行处理</li>
            </ul>
          </div>
          <div className="card card-red">
            <h4 className="font-semibold text-red-800 mb-2">⚠️ 挑战</h4>
            <li className="text-red-700 text-sm">边界截断导致语义丢失</li>
            <li className="text-red-700 text-sm">段落太小缺乏上下文</li>
            <li className="text-red-700 text-sm">段落太大影响相关性</li>
            <li className="text-red-700 text-sm">重叠大小难以确定</li>
          </div>
        </div>

        <h3 className="subsection-title">1.2 文档分割流程</h3>
        <p className="text-gray-700 mb-4">完整的文档分割工作流程：</p>

        <MermaidChart chart={`
          graph TD
              A[原始文档] --> B[选择分割策略]
              B --> C{文档类型?}
              C -->|Markdown| D[Markdown 分割器]
              C -->|代码| E[代码分割器]
              C -->|普通文本| F[递归分割器]
              D --> G[分割成段落]
              E --> G
              F --> G
              G --> H[生成 Embedding]
              H --> I[存储到向量库]

              style B fill:#fef3c7
              style G fill:#d1fae5
              style I fill:#dbeafe
        `} />
      </section>

      <section id="basic" className="content-section">
        <SectionHeader number={2} title="基础分割策略" />
        <p className="paragraph">
          LangChain4j 提供了多种内置的文档分割器，适用于不同场景。
        </p>

        <h3 className="subsection-title">2.1 内置分割器</h3>
        <p className="text-gray-700 mb-4">最常用的三种基础分割器：</p>

        <CodeBlockWithCopy
          code={basicSplitterCode}
          language="java"
          filename="BasicSplitters.java"
        />

        <div className="grid-3col mb-6">
          <div className="card card-blue">
            <h4 className="font-semibold text-blue-800 mb-2">字符分割</h4>
            <p className="text-blue-700 text-sm mb-2">byCharacter()</p>
            <p className="text-blue-600 text-xs">适合任何文本，但可能截断语义</p>
          </div>
          <div className="card card-green">
            <h4 className="font-semibold text-green-800 mb-2">段落分割</h4>
            <p className="text-green-700 text-sm mb-2">byParagraph()</p>
            <p className="text-green-600 text-xs">保持段落完整性，推荐使用</p>
          </div>
          <div className="card card-purple">
            <h4 className="font-semibold text-purple-800 mb-2">递归分割</h4>
            <p className="text-purple-700 text-sm mb-2">recursive()</p>
            <p className="text-purple-600 text-xs">平衡大小和完整性，最常用</p>
          </div>
        </div>

        <TipBox variant="info" title="参数选择建议">
          <ul className="list-styled">
            <li><strong>segmentSize</strong>: 500-1000 字符（根据 Embedding 模型和内容调整）</li>
            <li><strong>overlapSize</strong>: 10-20% 的 segmentSize（保留上下文）</li>
            <li><strong>Markdown 文档</strong>: 使用段落分割，保持标题结构</li>
            <li><strong>代码文档</strong>: 使用更大的段落 (1000-2000)</li>
          </ul>
        </TipBox>
      </section>

      <section id="advanced" className="content-section">
        <SectionHeader number={3} title="高级分割策略" />
        <p className="paragraph">
          针对特定场景使用更高级的分割策略。
        </p>

        <h3 className="subsection-title">3.1 按句子、行、分层分割</h3>
        <p className="text-gray-700 mb-4">高级分割策略示例：</p>

        <CodeBlockWithCopy
          code={advancedSplitterCode}
          language="java"
          filename="AdvancedSplitters.java"
        />

        <h3 className="subsection-title">3.2 分割策略对比</h3>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>策略</th>
                <th>适用场景</th>
                <th>优点</th>
                <th>缺点</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>按句子</td>
                <td>新闻、文章</td>
                <td>保持句子完整</td>
                <td>可能产生很长的段落</td>
              </tr>
              <tr>
                <td>按行</td>
                <td>代码、日志</td>
                <td>每行独立</td>
                <td>上下文可能不足</td>
              </tr>
              <tr>
                <td>分层</td>
                <td>长文档、书籍</td>
                <td>保持结构层次</td>
                <td>实现复杂</td>
              </tr>
              <tr>
                <td>自定义</td>
                <td>特殊格式</td>
                <td>完全控制</td>
                <td>需要开发和维护</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="semantic" className="content-section">
        <SectionHeader number={4} title="语义分割" />
        <p className="paragraph">
          基于语义相似度的智能分割，保持语义边界完整。
        </p>

        <h3 className="subsection-title">4.1 语义分割原理</h3>
        <p className="text-gray-700 mb-4">使用 Embedding 计算句子相似度，在语义边界处分割：</p>

        <CodeBlockWithCopy
          code={semanticSplitterCode}
          language="java"
          filename="SemanticSplitter.java"
        />

        <TipBox variant="warning" title="性能考虑">
          <ul className="list-styled">
            <li><strong>计算开销</strong>: 语义分割需要多次调用 Embedding 模型</li>
            <li><strong>适用场景</strong>: 文档质量要求高的场景，如学术论文、技术文档</li>
            <li><strong>优化建议</strong>: 缓存 Embedding 结果，批量计算相似度</li>
            <li><strong>相似度阈值</strong>: 通常设置为 0.7-0.9，越高越保守</li>
          </ul>
        </TipBox>
      </section>

      <section id="specialized" className="content-section">
        <SectionHeader number={5} title="专门格式分割" />
        <p className="paragraph">
          针对特定文档格式（Markdown、代码）的专门分割器。
        </p>

        <h3 className="subsection-title">5.1 Markdown 文档分割</h3>
        <p className="text-gray-700 mb-4">保持 Markdown 标题结构的分割：</p>

        <CodeBlockWithCopy
          code={markdownSplitterCode}
          language="java"
          filename="MarkdownSplitter.java"
        />

        <h3 className="subsection-title">5.2 代码文档分割</h3>
        <p className="text-gray-700 mb-4">保持代码块完整性的分割：</p>

        <CodeBlockWithCopy
          code={codeSplitterCode}
          language="java"
          filename="CodeSplitter.java"
        />
      </section>

      <section id="metadata" className="content-section">
        <SectionHeader number={6} title="元数据处理" />
        <p className="paragraph">
          为每个段落添加丰富的元数据，提升检索效果。
        </p>

        <h3 className="subsection-title">6.1 元数据类型</h3>
        <p className="text-gray-700 mb-4">常见的元数据类型：</p>

        <div className="grid-2col mb-6">
          <div className="card card-blue">
            <h4 className="font-semibold text-blue-800 mb-2">文档元数据</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>document_id</li>
              <li>document_name</li>
              <li>document_type</li>
              <li>document_url</li>
              <li>created_at</li>
            </ul>
          </div>
          <div className="card card-green">
            <h4 className="font-semibold text-green-800 mb-2">段落元数据</h4>
            <ul className="text-green-700 text-sm space-y-1">
              <li>segment_index</li>
              <li>segment_length</li>
              <li>word_count</li>
              <li>sentence_count</li>
              <li>chapter_id</li>
            </ul>
          </div>
        </div>

        <h3 className="subsection-title">6.2 元数据应用</h3>
        <p className="text-gray-700 mb-4">使用元数据增强检索：</p>

        <CodeBlockWithCopy
          code={metadataSplitterCode}
          language="java"
          filename="MetadataSplitter.java"
        />
      </section>

      <section id="best-practices" className="content-section">
        <SectionHeader number={7} title="最佳实践" />
        <p className="paragraph">
          生产环境中文档分割的最佳实践。
        </p>

        <h3 className="subsection-title">7.1 分割质量评估</h3>
        <p className="text-gray-700 mb-4">评估分割质量的关键指标：</p>

        <CodeBlockWithCopy
          code={splittingBestPracticesCode}
          language="java"
          filename="SplittingQuality.java"
        />

        <h3 className="subsection-title">7.2 常见问题与解决方案</h3>
        <div className="space-y-4">
          <div className="info-card info-card-yellow">
            <h4 className="font-semibold text-yellow-900 mb-2">问题1: 段落太短</h4>
            <p className="text-yellow-800 mb-2"><strong>症状</strong>: 段落平均长度 &lt; 100 字符</p>
            <p className="text-yellow-700"><strong>解决方案</strong>: 增加 segmentSize，使用段落或递归分割</p>
          </div>

          <div className="info-card info-card-orange">
            <h4 className="font-semibold text-orange-900 mb-2">问题2: 段落太长</h4>
            <p className="text-orange-800 mb-2"><strong>症状</strong>: 段落平均长度 &gt; 1500 字符</p>
            <p className="text-orange-700"><strong>解决方案</strong>: 减小 segmentSize，使用语义分割</p>
          </div>

          <div className="info-card info-card-red">
            <h4 className="font-semibold text-red-900 mb-2">问题3: 语义被截断</h4>
            <p className="text-red-800 mb-2"><strong>症状</strong>: 句子在边界处被切断</p>
            <p className="text-red-700"><strong>解决方案</strong>: 增加 overlap，使用句子或段落分割</p>
          </div>

          <div className="info-card info-card-blue">
            <h4 className="font-semibold text-blue-900 mb-2">问题4: 检索效果差</h4>
            <p className="text-blue-800 mb-2"><strong>症状</strong>: 检索结果不相关</p>
            <p className="text-blue-700"><strong>解决方案</strong>: 使用语义分割，增加 overlap，优化 chunk 大小</p>
          </div>
        </div>

        <TipBox variant="success" title="分割策略选择指南">
          <ul className="list-styled">
            <li><strong>简单文档</strong>: 递归字符分割 (recursive)</li>
            <li><strong>结构化文档</strong>: 段落分割 (byParagraph)</li>
            <li><strong>Markdown</strong>: Markdown 分割器 (保持标题结构)</li>
            <li><strong>技术文档</strong>: 语义分割 (保持语义完整性)</li>
            <li><strong>代码文档</strong>: 代码分割器 (保持代码块完整)</li>
          </ul>
        </TipBox>
      </section>

      <section className="content-section">
        <div className="summary-card">
          <h3 className="text-2xl font-bold mb-4">本章小结</h3>
          <p className="mb-4">全面介绍了 LangChain4j 的 Document Splitter 机制。通过掌握文档分割，您可以：</p>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li><strong>提升检索质量</strong>：合理分割使向量检索更准确</li>
            <li><strong>保持语义完整</strong>：使用语义分割避免语义截断</li>
            <li><strong>适应文档类型</strong>：针对 Markdown、代码等使用专门分割器</li>
            <li><strong>元数据增强</strong>：添加丰富元数据提升检索效果</li>
            <li><strong>质量评估</strong>：使用指标评估分割质量并优化</li>
          </ul>
          <div className="border-t border-indigo-400 pt-6">
            <p className="text-sm opacity-80 mb-2">核心特性</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Tag variant="indigo">递归分割</Tag>
              <Tag variant="purple">语义分割</Tag>
              <Tag variant="blue">Markdown 分割</Tag>
              <Tag variant="green">元数据处理</Tag>
            </div>
            <p className="text-sm opacity-80 mb-2">技术栈</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Tag variant="cyan">LangChain4j</Tag>
              <Tag variant="indigo">Embedding Model</Tag>
              <Tag variant="purple">Vector Store</Tag>
            </div>
            <a href="/token-stream" className="text-white hover:text-indigo-200 transition-colors">
              下一章：Token Stream →
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DocumentSplittingPage;
