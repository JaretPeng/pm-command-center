#!/bin/bash
# 双击启动开发模式（热更新；若卡顿请改用「打开预览.command」）
cd "$(dirname "$0")"
exec bash "./scripts/dev-server.sh"
