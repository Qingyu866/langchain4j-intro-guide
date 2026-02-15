#!/usr/bin/env python3
"""批量更新所有HTML文件的简化版本"""

import os
from pathlib import Path

# 项目根目录
PROJECT_DIR = Path("/Users/qingyu/langchain4j-intro")

# 要修改的文件列表
HTML_FILES = [
    "core-concepts.html",
    "embedding-models.html",
    "output-parsers.html",
    "model-providers.html",
    "function-calling-deep.html",
    "advanced-features.html",
    "multimodal-full.html",
    "rag-intro.html",
    "rag-setup.html",
    "rag-implementation.html",
    "rag-advanced.html",
    "rag-complete.html",
    "project-chatbot.html",
    "project-ai-assistant.html",
    "project-rag-kb.html",
    "practice.html",
    "testing-strategies.html",
    "performance-tuning.html",
    "best-practices.html",
    "deep-dive.html",
    "error-handling.html",
    "moderation-safety.html",
    "troubleshooting.html",
    "interview-prep.html",
    "search.html",
    "chat-listeners.html",
    "faq.html",
    "cost-optimization.html",
    "deployment.html",
    "integrations.html",
    "examples.html"
]

def process_file(file_path):
    """处理单个HTML文件 - 使用简单的字符串替换"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # 1. 移除 Google Fonts 引用（保留styles.css）
        if '<link rel="preconnect" href="https://fonts.googleapis.com">' in content:
            lines = content.split('\n')
            new_lines = []
            skip = False
            for line in lines:
                if '<link rel="preconnect" href="https://fonts.googleapis.com">' in line:
                    skip = True
                elif skip and 'fonts.gstatic.com' in line:
                    continue
                elif skip and 'https://fonts.googleapis.com/css2?family=Inter' in line:
                    skip = False
                    continue
                else:
                    new_lines.append(line)
            content = '\n'.join(new_lines)
        
        # 2. 页面容器
        content = content.replace(
            '<div class="flex min-h-screen">',
            '<div class="page-container">'
        )
        
        # 3. 侧边栏
        content = content.replace(
            '<aside class="w-[280px] fixed h-screen bg-white border-r border-gray-200 overflow-y-auto pb-8">',
            '<aside class="sidebar">'
        )
        
        # 4. 侧边栏内容
        content = content.replace(
            '<div class="p-6">',
            '<div class="sidebar-content">'
        )
        
        # 5. Logo区域
        content = content.replace(
            '<div class="flex items-center gap-3 mb-8">',
            '<div class="sidebar-logo">'
        )
        
        # 6. Logo图标
        content = content.replace(
            '<div class="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">',
            '<div class="sidebar-logo-icon">'
        )
        
        # 7. 导航分组标题
        content = content.replace(
            '<h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">',
            '<h3 class="sidebar-nav-title">'
        )
        
        # 8. 导航分组
        # 先处理带标题的情况
        while '<div>\n        <h3 class="sidebar-nav-title">' in content:
            content = content.replace(
                '<div>\n        <h3 class="sidebar-nav-title">',
                '<div class="sidebar-nav-group">\n        <h3 class="sidebar-nav-title">'
            )
        
        # 9. 导航列表
        content = content.replace(
            '<ul class="space-y-1">',
            '<ul class="sidebar-nav-list">'
        )
        
        # 10. 移除注释的CSS类
        content = content.replace(
            '<!-- class="block px-4 py-2.5 text-sm bg-indigo-50 text-indigo-700 font-medium rounded-md transition-all text-center" -->',
            ''
        )
        
        # 11. 主内容区域
        content = content.replace(
            '<main class="flex-1 ml-[280px]">',
            '<main class="main-content">'
        )
        
        # 12. 内容包装器
        content = content.replace(
            '<div class="max-w-7xl mx-auto px-8 py-12">',
            '<div class="content-wrapper">'
        )
        
        # 13. 移除Tailwind CDN
        if 'cdn.tailwindcss.com' in content:
            import re
            content = re.sub(r'<script src="https://cdn\.tailwindcss\.com"></script>\s*', '', content)
            content = re.sub(r'<script>\s*tailwind\.config\s*=\s*\{[\s\S]*?\}\s*</script>\s*', '', content)
        
        # 14. 处理body标签
        content = content.replace(
            '<body class="bg-white text-gray-800 antialiased">',
            '<body>'
        )
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ 已更新: {file_path.name}")
        else:
            print(f"ℹ 无需更新: {file_path.name}")
            
    except Exception as e:
        print(f"✗ 处理失败: {file_path.name} - {e}")
        import traceback
        traceback.print_exc()

def main():
    """主函数"""
    print("开始批量更新HTML文件...")
    print("=" * 60)
    
    # 处理所有文件
    for filename in HTML_FILES:
        file_path = PROJECT_DIR / filename
        if file_path.exists():
            process_file(file_path)
        else:
            print(f"✗ 文件不存在: {filename}")
    
    print("=" * 60)
    print("批量更新完成！")

if __name__ == "__main__":
    main()
