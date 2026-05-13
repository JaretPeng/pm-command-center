#!/bin/bash
# 双击本文件会在终端里启动本地网站；出现 “Ready” 后再用 Safari 打开 http://127.0.0.1:3000
set -e
cd "$(dirname "$0")"
echo ""
echo ">>> PM Command Center — 本地开发服务"
echo ">>> 请保持本窗口打开；看到 Ready 后，在 Safari 地址栏输入："
echo ">>>    http://127.0.0.1:3000"
echo ">>> 若 3000 被占用，请先关掉其它项目，或运行：npm run dev:3001"
echo ""
exec npm run dev
