#!/usr/bin/env python3
"""批量更新所有HTML文件，将Tailwind类替换为语义化CSS类"""

import os
import re
from pathlib import Path

# 项目根目录
PROJECT_DIR = Path("/Users/qingyu/langchain4j-intro")

# 要修改的文件列表（排除已修改的）
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

# 替换规则
REPLACEMENTS = [
    # 头部替换
    (
        r'''(<head>.*?)(\s*<link rel="preconnect"[^>]*>\s*)*\s*<link href="https://fonts\.googleapis\.com/css2\?family=Inter.*?</link>\s*''',
        r'\1',
        re.DOTALL
    ),
    
    # 页面容器
    (r'''<div class="flex min-h-screen">''', '''<div class="page-container">'''),
    
    # 侧边栏
    (r'''<aside class="w-\[280px\] fixed h-screen bg-white border-r border-gray-200 overflow-y-auto pb-8">''', '''<aside class="sidebar">'''),
    
    # 侧边栏内容
    (r'''<div class="p-6">''', '''<div class="sidebar-content">'''),
    
    # Logo区域
    (r'''<div class="flex items-center gap-3 mb-8">''', '''<div class="sidebar-logo">'''),
    
    # Logo图标
    (r'''<div class="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">''', '''<div class="sidebar-logo-icon">'''),
    
    # 导航分组
    (r'''<div>
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">''', '''<div class="sidebar-nav-group">
        <h3 class="sidebar-nav-title">'''),
    
    (r'''<h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">''', '''<h3 class="sidebar-nav-title">'''),
    
    # 导航列表
    (r'''<ul class="space-y-1">''', '''<ul class="sidebar-nav-list">'''),
    
    # 导航链接
    (r'''<a href="[^"]*" class="nav-link block px-4 py-2\.5 text-sm text-gray-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-all" data-page="[^"]*">''', '''<a href="\\1" class="sidebar-nav-link" data-page="\\2">'''),
    
    (r'''<a href="([^"]*)" class="nav-link block px-4 py-2\.5 text-sm text-gray-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-all" data-page="([^"]*)">''', '''<a href="\\1" class="sidebar-nav-link" data-page="\\2">'''),
    
    # 移除注释的CSS类
    (r'''<!-- class="block px-4 py-2\.5 text-sm bg-indigo-50 text-indigo-700 font-medium rounded-md transition-all text-center" -->''', ''''''),
    
    # 主内容区域
    (r'''<main class="flex-1 ml-\[280px\]">''', '''<main class="main-content">'''),
    
    # 内容包装器
    (r'''<div class="max-w-7xl mx-auto px-8 py-12">''', '''<div class="content-wrapper">''')
]

def process_file(file_path):
    """处理单个HTML文件"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # 应用所有替换规则
        for pattern, replacement, *flags in REPLACEMENTS:
            flags_val = flags[0] if flags else 0
            content = re.sub(pattern, replacement, content, flags=flags_val)
        
        # 确保移除了多余的Tailwind CDN引用
        if 'cdn.tailwindcss.com' in content:
            content = re.sub(r'<script src="https://cdn\.tailwindcss\.com"></script>\s*', '', content)
            content = re.sub(r'<script>\s*tailwind\.config\s*=\s*\{[\s\S]*?\}\s*</script>\s*', '', content)
        
        # 替换<body class="...">为<body>
        content = re.sub(r'<body class="[^"]*">', '<body>', content)
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ 已更新: {file_path.name}")
        else:
            print(f"ℹ 无需更新: {file_path.name}")
            
    except Exception as e:
        print(f"✗ 处理失败: {file_path.name} - {e}")

def main():
    """主函数"""
    print("开始批量更新HTML文件...")
    print("=" * 60)
    
    # 确保styles.css存在
    if not (PROJECT_DIR / "styles.css").exists():
        print("⚠ 警告: styles.css 文件不存在！")
    
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
