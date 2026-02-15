#!/bin/bash

# 批量改造HTML页面为飞书文档风格

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# 侧边栏导航模板
NAV_TEMPLATE='
<a href="index.html" class="logo">
    <div class="logo-icon">⚡</div>
    <span class="logo-text">LangChain4j</span>
</a>

<div class="nav-section">
    <div class="nav-section-title">入门</div>
    <ul class="nav-links">
        <li><a href="index.html" id="nav-index">首页</a></li>
        <li><a href="getting-started.html" id="nav-getting-started">快速入门</a></li>
        <li><a href="core-concepts.html" id="nav-core-concepts">核心概念</a></li>
    </ul>
</div>

<div class="nav-section">
    <div class="nav-section-title">基础</div>
    <ul class="nav-links">
        <li><a href="embedding-models.html" id="nav-embedding-models">Embedding模型</a></li>
        <li><a href="prompt-templates.html" id="nav-prompt-templates">Prompt模板</a></li>
        <li><a href="output-parsers.html" id="nav-output-parsers">输出解析</a></li>
        <li><a href="model-providers.html" id="nav-model-providers">模型提供商</a></li>
    </ul>
</div>

<div class="nav-section">
    <div class="nav-section-title">进阶</div>
    <ul class="nav-links">
        <li><a href="function-calling-deep.html" id="nav-function-calling-deep">Function Calling</a></li>
        <li><a href="advanced-features.html" id="nav-advanced-features">高级特性</a></li>
        <li><a href="multimodal-full.html" id="nav-multimodal-full">多模态能力</a></li>
        <li><a href="project-rag-kb.html" id="nav-project-rag-kb">RAG知识库</a></li>
        <li><a href="project-ai-assistant.html" id="nav-project-ai-assistant">AI助手</a></li>
        <li><a href="project-chatbot.html" id="nav-project-chatbot">聊天机器人</a></li>
    </ul>
</div>

<div class="nav-section">
    <div class="nav-section-title">实践</div>
    <ul class="nav-links">
        <li><a href="best-practices.html" id="nav-best-practices">最佳实践</a></li>
        <li><a href="examples.html" id="nav-examples">实战示例</a></li>
        <li><a href="integrations.html" id="nav-integrations">框架集成</a></li>
        <li><a href="testing-strategies.html" id="nav-testing-strategies">测试策略</a></li>
        <li><a href="performance-tuning.html" id="nav-performance-tuning">性能调优</a></li>
    </ul>
</div>

<div class="nav-section">
    <div class="nav-section-title">其他</div>
    <ul class="nav-links">
        <li><a href="deep-dive.html" id="nav-deep-dive">深度解析</a></li>
        <li><a href="error-handling.html" id="nav-error-handling">错误处理</a></li>
        <li><a href="moderation-safety.html" id="nav-moderation-safety">内容审核</a></li>
        <li><a href="troubleshooting.html" id="nav-troubleshooting">问题排查</a></li>
        <li><a href="interview-prep.html" id="nav-interview-prep">面试准备</a></li>
        <li><a href="practice.html" id="nav-practice">练习项目</a></li>
    </ul>
</div>

<div class="nav-section">
    <ul class="nav-links">
        <li><a href="https://docs.langchain4j.dev" target="_blank">📖 官方文档</a></li>
        <li><a href="https://github.com/langchain4j/langchain4j" target="_blank">🔗 GitHub</a></li>
    </ul>
</div>
'

# HTML文件列表
HTML_FILES=(
    "index.html"
    "getting-started.html"
    "core-concepts.html"
    "embedding-models.html"
    "prompt-templates.html"
    "output-parsers.html"
    "model-providers.html"
    "function-calling-deep.html"
    "advanced-features.html"
    "multimodal-full.html"
    "multimodal.html"
    "project-rag-kb.html"
    "project-ai-assistant.html"
    "project-chatbot.html"
    "best-practices.html"
    "examples.html"
    "integrations.html"
    "testing-strategies.html"
    "performance-tuning.html"
    "deep-dive.html"
    "error-handling.html"
    "moderation-safety.html"
    "troubleshooting.html"
    "interview-prep.html"
    "practice.html"
    "search.html"
    "faq.html"
    "deployment.html"
    "cost-optimization.html"
    "chat-listeners.html"
    "rag-complete.html"
)

echo "开始批量改造HTML页面..."
echo ""

# 处理每个HTML文件
for html_file in "${HTML_FILES[@]}"; do
    if [ ! -f "$html_file" ]; then
        echo "⚠️  跳过: $html_file (文件不存在)"
        continue
    fi

    echo "📝 处理: $html_file"

    # 提取文件名（不含.html后缀）
    base_name=$(basename "$html_file" .html)

    # 创建临时文件
    temp_file=$(mktemp)

    # 开始处理
    awk -v nav="$NAV_TEMPLATE" -v base="$base_name" '
        BEGIN { in_head = 0; in_style = 0; in_body = 0; printed_head = 0; need_layout = 0 }

        # 标记进入head
        /<head>/ { in_head = 1 }

        # 在head中添加styles.css引入（在第一个link标签后）
        in_head && /<link.*stylesheet/ && !printed_head {
            print "    <link rel=\"stylesheet\" href=\"styles.css\">"
            printed_head = 1
        }

        # 跳过style标签内容
        /<style>/ { in_style = 1; next }
        in_style && /<\/style>/ { in_style = 0; next }
        in_style { next }

        # 移除旧的styles.css引入（如果存在）
        /<link.*styles\.css/ { next }

        # 标记进入body
        /<body[^>]*>/ {
            in_body = 1
            print $0
            print "<div class=\"layout-container\">"
            print "<aside class=\"sidebar\">"
            print nav
            print "</aside>"
            print "<main class=\"main-content\">"
            next
        }

        # 处理body结束
        /<\/body>/ {
            in_body = 0
            print "</main>"
            print "</div>"
            print "<script>"
            print "// Copy code functionality"
            print "function copyCode(button) {"
            print "    const codeBlock = button.closest(\".code-block\");"
            print "    const codeElement = codeBlock.querySelector(\"code\");"
            print "    if (!codeElement) return;"
            print ""
            print "    const text = codeElement.innerText;"
            print ""
            print "    navigator.clipboard.writeText(text).then(() => {"
            print "        const originalHTML = button.innerHTML;"
            print "        button.innerHTML = \"✓ 已复制\";"
            print "        button.classList.add(\"copied\");"
            print ""
            print "        setTimeout(() => {"
            print "            button.innerHTML = originalHTML;"
            print "            button.classList.remove(\"copied\");"
            print "        }, 2000);"
            print "    }).catch(err => {"
            print "        console.error(\"Copy failed:\", err);"
            print "        button.innerHTML = \"✗ 失败\";"
            print "        setTimeout(() => {"
            print "            button.innerHTML = originalHTML;"
            print "        }, 2000);"
            print "    });"
            print "}"
            print ""
            print "document.addEventListener(\"DOMContentLoaded\", function() {"
            print "    const currentFile = \"" base "\";"
            print "    const navLinks = document.querySelectorAll(\".nav-links a\");"
            print "    navLinks.forEach(link => {"
            print "        if (link.id === \"nav-\" + currentFile) {"
            print "            link.classList.add(\"active\");"
            print "        }"
            print "    });"
            print ""
            print "    const codeBlocks = document.querySelectorAll(\".code-block\");"
            print "    codeBlocks.forEach(block => {"
            print "        const header = block.querySelector(\".code-header\");"
            print "        if (header && !header.querySelector(\".code-copy\")) {"
            print "            const copyBtn = document.createElement(\"button\");"
            print "            copyBtn.className = \"code-copy\";"
            print "            copyBtn.setAttribute(\"onclick\", \"copyCode(this)\");"
            print "            copyBtn.setAttribute(\"title\", \"复制代码\");"
            print "            copyBtn.innerHTML = \"<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z\"/></svg>复制\";"
            print "            header.appendChild(copyBtn);"
            print "        }"
            print "    });"
            print "});"
            print "</script>"
            print $0
            next
        }

        # 打印其他内容
        { print $0 }
    ' "$html_file" > "$temp_file"

    # 替换原文件
    mv "$temp_file" "$html_file"

    echo "✅ 完成: $html_file"
done

echo ""
echo "🎉 所有HTML文件改造完成！"
echo ""
echo "使用方法："
echo "1. 打开任意HTML文件查看效果"
echo "2. 侧边栏会自动高亮当前页面"
echo "3. 所有页面共享同一套样式"
