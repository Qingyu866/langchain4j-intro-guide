#!/usr/bin/env python3
"""
全面重构HTML文件的CSS样式
将所有内联样式类替换为语义化类名
"""

import os
import re
import glob

def refactor_all_styles(content):
    """应用所有重构规则"""
    
    # ============================================
    # 1. 侧边栏样式
    # ============================================
    content = re.sub(
        r'<svg class="w-6 h-6 text-white"',
        '<svg class="sidebar-logo-svg"',
        content
    )
    content = re.sub(
        r'<h1 class="font-bold text-gray-900">LangChain4j</h1>',
        '<h1 class="sidebar-logo-title">LangChain4j</h1>',
        content
    )
    content = re.sub(
        r'<p class="text-xs text-gray-500">入门指南</p>',
        '<p class="sidebar-logo-subtitle">入门指南</p>',
        content
    )
    
    # ============================================
    # 2. 页面头部样式
    # ============================================
    content = re.sub(
        r'<p class="text-xl text-gray-600 mb-8"',
        '<p class="page-intro"',
        content
    )
    content = re.sub(
        r'<p class="text-xl text-gray-700 mb-6"',
        '<p class="section-intro"',
        content
    )
    
    # ============================================
    # 3. 按钮样式
    # ============================================
    content = re.sub(
        r'<div class="flex gap-4 mb-10">',
        '<div class="btn-group">',
        content
    )
    
    # ============================================
    # 4. 代码预览样式
    # ============================================
    content = re.sub(r'<div class="code-block">', '<div class="code-preview">', content)
    content = re.sub(r'<div class="code-header">', '<div class="code-preview-header">', content)
    content = re.sub(r'<div class="code-dots">', '<div class="code-preview-dots">', content)
    content = re.sub(r'<div class="code-dot red"></div>', '<div class="code-preview-dot code-preview-dot-red"></div>', content)
    content = re.sub(r'<div class="code-dot yellow"></div>', '<div class="code-preview-dot code-preview-dot-yellow"></div>', content)
    content = re.sub(r'<div class="code-dot green"></div>', '<div class="code-preview-dot code-preview-dot-green"></div>', content)
    content = re.sub(r'<span class="code-filename">', '<span class="code-preview-filename">', content)
    content = re.sub(r'<div class="code-body">', '<div class="code-preview-content">', content)
    
    # ============================================
    # 5. 代码高亮样式
    # ============================================
    content = re.sub(r'<span class="text-purple-400">', '<span class="code-keyword">', content)
    content = re.sub(r'<span class="text-yellow-300">', '<span class="code-class">', content)
    content = re.sub(r'<span class="text-blue-400">', '<span class="code-function">', content)
    content = re.sub(r'<span class="text-green-400">', '<span class="code-string">', content)
    content = re.sub(r'<span class="text-green-300">', '<span class="code-string">', content)
    
    # ============================================
    # 6. 目录导航样式
    # ============================================
    content = re.sub(
        r'<ol class="space-y-2 text-sm text-gray-700">',
        '<ol class="toc-list">',
        content
    )
    content = re.sub(
        r'<li class="flex items-start gap-2"><span class="text-indigo-600 font-medium">(\d+)\.</span>',
        r'<li class="toc-item"><span class="toc-number">\1.</span>',
        content
    )
    content = re.sub(
        r'<a href="([^"]+)" class="hover:text-indigo-600 transition-colors">([^<]+)</a>',
        r'<a href="\1" class="toc-link">\2</a>',
        content
    )
    
    # ============================================
    # 7. 卡片标题样式
    # ============================================
    content = re.sub(
        r'<h4 class="card-title card-title-blue">',
        '<h4 class="card-title-blue">',
        content
    )
    content = re.sub(
        r'<h4 class="card-title card-title-green">',
        '<h4 class="card-title-green">',
        content
    )
    content = re.sub(
        r'<h4 class="card-title card-title-purple">',
        '<h4 class="card-title-purple">',
        content
    )
    content = re.sub(
        r'<h4 class="card-title card-title-orange">',
        '<h4 class="card-title-orange">',
        content
    )
    
    # ============================================
    # 8. 列表样式
    # ============================================
    content = re.sub(
        r'<ul class="text-blue-700 space-y-1">',
        '<ul class="list-styled list-blue">',
        content
    )
    content = re.sub(
        r'<ul class="text-green-700 space-y-1">',
        '<ul class="list-styled list-green">',
        content
    )
    content = re.sub(
        r'<ul class="text-gray-700 space-y-1">',
        '<ul class="list-styled list-gray">',
        content
    )
    
    # ============================================
    # 9. 标题样式
    # ============================================
    content = re.sub(
        r'<h3 class="text-xl font-semibold text-gray-900 mb-4">',
        '<h3 class="subsection-title">',
        content
    )
    content = re.sub(
        r'<h3 class="text-lg font-semibold text-gray-900 mb-3">',
        '<h3 class="subsection-title-sm">',
        content
    )
    
    # ============================================
    # 10. 段落样式
    # ============================================
    content = re.sub(
        r'<p class="text-gray-700 mb-6">',
        '<p class="paragraph">',
        content
    )
    content = re.sub(
        r'<p class="text-gray-600 mb-4">',
        '<p class="paragraph-secondary">',
        content
    )
    
    # ============================================
    # 11. 代码块文件名样式
    # ============================================
    content = re.sub(
        r'<div class="absolute top-0 right-0 px-3 py-1 bg-gray-800 text-gray-400 text-xs font-medium rounded-bl-md">([^<]+)</div>',
        r'<div class="code-filename-badge">\1</div>',
        content
    )
    content = re.sub(
        r'<div class="relative mb-6">',
        '<div class="code-wrapper">',
        content
    )
    
    # ============================================
    # 12. 网格布局样式
    # ============================================
    content = re.sub(
        r'<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">',
        '<div class="grid-2col">',
        content
    )
    content = re.sub(
        r'<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">',
        '<div class="grid-3col">',
        content
    )
    
    # ============================================
    # 13. 链接样式
    # ============================================
    content = re.sub(
        r'<a href="([^"]*)" target="_blank" class="text-blue-600 hover:underline">',
        r'<a href="\1" target="_blank" class="link-external">',
        content
    )
    
    return content

def refactor_file(file_path):
    """重构单个文件"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    content = refactor_all_styles(content)
    
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"已更新: {file_path}")
        return True
    else:
        print(f"无需更新: {file_path}")
        return False

def main():
    """主函数"""
    html_files = glob.glob('/Users/qingyu/langchain4j-intro/*.html')
    
    # 排除模板文件
    html_files = [f for f in html_files if 'TEMPLATE' not in f and 'FIXED' not in f]
    
    updated_count = 0
    for file_path in html_files:
        if refactor_file(file_path):
            updated_count += 1
    
    print(f"\n总计更新 {updated_count} 个文件")

if __name__ == '__main__':
    main()
