#!/usr/bin/env bash
# 稳定预览：先 build 再 start（比 dev 模式不易卡死）
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PORT:-3000}"
URL="http://localhost:${PORT}"
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"

cd "$ROOT"

if ! command -v npm >/dev/null 2>&1; then
  echo ""
  echo ">>> 错误：未找到 npm，请先安装 Node.js"
  echo ">>> https://nodejs.org/"
  echo ""
  read -r -p "按回车关闭…" _
  exit 1
fi

echo ""
echo ">>> PM Command Center 预览"
echo ">>> 项目目录: $ROOT"
echo ""

# 只结束监听 3000 的 node，不误杀 Safari 连接
LISTENERS="$(lsof -ti "tcp:${PORT}" -sTCP:LISTEN 2>/dev/null || true)"
if [ -n "$LISTENERS" ]; then
  echo ">>> 释放端口 ${PORT}..."
  kill -9 $LISTENERS 2>/dev/null || true
  sleep 1
fi

if [ ! -d "$ROOT/.next" ]; then
  echo ">>> 首次启动需要构建（约 1 分钟），请稍候..."
  npm run build
else
  echo ">>> 使用已有构建；若页面异常可删除 .next 后重试"
fi

echo ">>> 启动预览服务: ${URL}"
echo ">>> 保持本窗口打开；关闭窗口即停止网站"
echo ""

npx next start --hostname localhost --port "${PORT}" &
SRV_PID=$!

cleanup() { kill "$SRV_PID" 2>/dev/null || true; }
trap cleanup EXIT INT TERM

for i in $(seq 1 60); do
  if curl -fsS --max-time 2 "${URL}/health" >/dev/null 2>&1; then
    echo ">>> 已就绪，正在打开浏览器..."
    open "${URL}" 2>/dev/null || true
    echo ">>> 若浏览器未打开，请手动访问: ${URL}"
    wait "$SRV_PID"
    exit 0
  fi
  sleep 1
done

echo ">>> 启动超时，请查看上方是否有报错"
wait "$SRV_PID"
