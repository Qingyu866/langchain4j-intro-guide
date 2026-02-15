#!/usr/bin/env python3
"""
批量更新HTML文件的CSS引用
将所有HTML文件的CSS引用从单一文件更新为模块化结构
"""

import os
import re
import glob

def update_css_reference(file_path):
    """更新单个HTML文件的CSS引用"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 检查是否已经更新
    if 'css/main.css' in content:
        print(f"跳过 (已更新): {file_path}")
        return False
    
    # 替换CSS引用
    # 匹配 <link rel="stylesheet" href="styles.css">
    pattern = r'<link rel="stylesheet" href="styles\.css">'
    replacement = '''<!-- 模块化CSS -->
    <link rel="stylesheet" href="css/main.css">'''
    
    new_content = re.sub(pattern, replacement, content)
    
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"已更新: {file_path}")
        return True
    else:
        print(f"无需更新: {file_path}")
        return False

def main():
    """主函数"""
    # 获取所有HTML文件
    html_files = glob.glob('/Users/qingyu/langchain4j-intro/*.html')
    
    updated_count = 0
    for file_path in html_files:
        if update_css_reference(file_path):
            updated_count += 1
    
    print(f"\n总计更新 {updated_count} 个文件")

if __name__ == '__main__':
    main()
