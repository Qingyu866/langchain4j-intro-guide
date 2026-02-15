#!/usr/bin/env python3
"""全面批量更新所有HTML文件"""

import os
import re
from pathlib import Path

# 项目根目录
PROJECT_DIR = Path("/Users/qingyu/langchain4j-intro")

# 获取所有HTML文件
def get_all_html_files():
    html_files = []
    for file in PROJECT_DIR.glob("*.html"):
        if file.name not in ["NAVIGATION_FIXED.html", "UNIFIED_NAV_TEMPLATE.html"]:
            html_files.append(file.name)
    return sorted(html_files)

# 完整的替换映射表
REPLACEMENTS = [
    # ========== 头部替换 ==========
    # 移除 Tailwind CDN
    (r'<script src="https://cdn\.tailwindcss\.com"></script>\s*', '', re.MULTILINE),
    (r'<script>\s*tailwind\.config\s*=\s*\{[\s\S]*?\}\s*</script>\s*', '', re.MULTILINE),
    
    # 移除 Google Fonts（styles.css已包含）
    (r'<link rel="preconnect" href="https://fonts\.googleapis\.com">\s*', '', re.MULTILINE),
    (r'<link rel="preconnect" href="https://fonts\.gstatic\.com"[^>]*>\s*', '', re.MULTILINE),
    (r'<link href="https://fonts\.googleapis\.com/css2\?family=Inter[^>]*>\s*', '', re.MULTILINE),
    
    # 确保有 styles.css 引用
    (r'<head>', r'<head>\n    <link rel="stylesheet" href="styles.css">', re.MULTILINE),
    
    # ========== 布局替换 ==========
    (r'<body class="[^"]*">', r'<body>'),
    (r'<div class="flex min-h-screen">', r'<div class="page-container">'),
    
    # ========== 侧边栏替换 ==========
    (r'<aside class="w-\[280px\] fixed h-screen bg-white border-r border-gray-200 overflow-y-auto(?:\s+[^"]*)?">', r'<aside class="sidebar">'),
    (r'<div class="p-6">', r'<div class="sidebar-content">'),
    (r'<div class="flex items-center gap-3 mb-8">', r'<div class="sidebar-logo">'),
    (r'<div class="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">', r'<div class="sidebar-logo-icon">'),
    (r'<div>\s*<h1 class="font-bold text-gray-900">', r'<div>\n        <h1 class="sidebar-logo-title">'),
    (r'<p class="text-xs text-gray-500">', r'<p class="sidebar-logo-subtitle">'),
    
    # 导航分组
    (r'<div>\s*<h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">', 
     r'<div class="sidebar-nav-group">\n        <h3 class="sidebar-nav-title">'),
    (r'<h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">', r'<h3 class="sidebar-nav-title">'),
    (r'<ul class="space-y-1">', r'<ul class="sidebar-nav-list">'),
    
    # 导航链接 - 需要处理两种情况
    (r'<a href="([^"]+)" class="nav-link block px-4 py-2\.5 text-sm text-gray-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-all" data-page="([^"]+)">',
     r'<a href="\1" class="sidebar-nav-link" data-page="\2">'),
    
    # ========== 主内容区域替换 ==========
    (r'<main class="flex-1 ml-\[280px\]">', r'<main class="main-content">'),
    (r'<div class="max-w-7xl mx-auto px-8 py-12">', r'<div class="content-wrapper">'),
    
    # ========== 常用工具