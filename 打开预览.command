#!/bin/bash
# 双击此文件启动预览（无需 cd，不会找错目录）
cd "$(dirname "$0")"
exec bash "./scripts/preview-server.sh"
