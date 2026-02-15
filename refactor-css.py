#!/usr/bin/env python3
"""
批量重构HTML文件的CSS样式
将内联样式类替换为语义化类名
"""

import os
import re
import glob

def refactor_sidebar_styles(content):
    """重构侧边栏样式"""
    # 替换 sidebar logo SVG 样式
    content = re.sub(
        r'<svg class="w-6 h-6 text-white"',
        '<svg class="sidebar-logo-svg"',
        content
    )
    
    # 替换 sidebar logo 标题样式
    content = re.sub(
        r'<h1 class="font-bold text-gray-900">LangChain4j</h1>',
        '<h1 class="sidebar-logo-title">LangChain4j</h1>',
        content
    )
    
    # 替换 sidebar logo 副标题样式
    content = re.sub(
        r'<p class="text-xs text-gray-500">入门指南</p>',
        '<p class="sidebar-logo-subtitle">入门指南</p>',
        content
    )
    
    return content

def refactor_button_styles(content):
    """重构按钮样式"""
    # 替换按钮组样式
    content = re.sub(
        r'<div class="flex gap-4 mb-10">',
        '<div class="btn-group">',
        content
    )
    return content

def refactor_code_preview_styles(content):
    """重构代码预览样式"""
    # 替换代码块样式
    content = re.sub(
        r'<div class="code-block">',
        '<div class="code-preview">',
        content
    )
    
    content = re.sub(
        r'<div class="code-header">',
        '<div class="code-preview-header">',
        content
    )
    
    content = re.sub(
        r'<div class="code-dots">',
        '<div class="code-preview-dots">',
        content
    )
    
    content = re.sub(
        r'<div class="code-dot red"></div>',
        '<div class="code-preview-dot code-preview-dot-red"></div>',
        content
    )
    
    content = re.sub(
        r'<div class="code-dot yellow"></div>',
        '<div class="code-preview-dot code-preview-dot-yellow"></div>',
        content
    )
    
    content = re.sub(
        r'<div class="code-dot green"></div>',
        '<div class="code-preview-dot code-preview-dot-green"></div>',
        content
    )
    
    content = re.sub(
        r'<span class="code-filename">',
        '<span class="code-preview-filename">',
        content
    )
    
    content = re.sub(
        r'<div class="code-body">',
        '<div class="code-preview-content">',
        content
    )
    
    return content

def refactor_code_highlight_styles(content):
    """重构代码高亮样式"""
    # 替换代码高亮颜色类
    content = re.sub(r'<span class="text-purple-400">', '<span class="code-keyword">', content)
    content = re.sub(r'<span class="text-yellow-300">', '<span class="code-class">', content)
    content = re.sub(r'<span class="text-blue-400">', '<span class="code-function">', content)
    content = re.sub(r'<span class="text-green-400">', '<span class="code-string">', content)
    
    return content

def refactor_file(file_path):
    """重构单个文件"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # 应用所有重构规则
    content = refactor_sidebar_styles(content)
    content = refactor_button_styles(content)
    content = refactor_code_preview_styles(content)
    content = refactor_code_highlight_styles(content)
    
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
