#!/usr/bin/env python3
"""
自动化脚本：将所有页面的 CodeBlock 替换为 CodeBlockWithCopy
"""

import os
import re
from pathlib import Path

def process_file(file_path: Path) -> bool:
    """
    处理单个 TSX 文件，替换 CodeBlock 为 CodeBlockWithCopy
    """
    try:
        content = file_path.read_text(encoding='utf-8')
        original_content = content

        # 1. 检查是否已导入 CodeBlockWithCopy
        has_import = 'CodeBlockWithCopy' in content

        # 2. 如果已有 CodeBlockWithCopy 导入，说明已处理过
        if 'CodeBlockWithCopy' in content and 'import' in content[:500]:
            return False

        # 3. 添加导入（如果还没有）
        if not has_import:
            # 查找 import 行并添加
            import_pattern = r"(import\s*\{[^}]*CodeBlock[^}]*\}\s*from\s*'../components/ui')"
            if re.search(import_pattern, content):
                content = re.sub(
                    import_pattern,
                    r"\1\nimport { CodeBlockWithCopy } from '../components/ui'",
                    content
                )

        # 4. 替换 CodeBlock 为 CodeBlockWithCopy（保留属性）
        # <CodeBlock language="..." filename="..." code={...} />
        # <CodeBlockWithCopy language="..." filename="..." code={...} />

        # 替换自闭合标签
        content = re.sub(
            r'<CodeBlock\s+',
            '<CodeBlockWithCopy ',
            content
        )

        # 替换闭合标签
        content = re.sub(
            r'</CodeBlock>',
            '</CodeBlockWithCopy>',
            content
        )

        # 5. 如果内容有变化，写回文件
        if content != original_content:
            file_path.write_text(content, encoding='utf-8')
            print(f"✓ 已更新: {file_path.name}")
            return True
        else:
            return False

    except Exception as e:
        print(f"✗ 错误处理 {file_path.name}: {e}")
        return False

def main():
    """主函数"""
    pages_dir = Path('src/pages')

    if not pages_dir.exists():
        print(f"错误: 找不到目录 {pages_dir}")
        return

    # 查找所有 .tsx 文件
    tsx_files = list(pages_dir.glob('*.tsx'))

    if not tsx_files:
        print("未找到任何 TSX 文件")
        return

    print(f"找到 {len(tsx_files)} 个页面文件")
    print("=" * 50)

    updated_count = 0
    for file_path in tsx_files:
        if process_file(file_path):
            updated_count += 1

    print("=" * 50)
    print(f"完成！共更新 {updated_count} 个文件")
    print("\n建议运行以下命令验证:")
    print("  npm run build")

if __name__ == '__main__':
    main()
