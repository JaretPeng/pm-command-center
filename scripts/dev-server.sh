#!/usr/bin/env bash
# 启动本地开发服务：释放 3000 端口、等待就绪、可选打开浏览器
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"
cd "$ROOT"
PORT="${PORT:-3000}"
OPEN_BROWSER="${OPEN_BROWSER:-0}"
HOST_URL="http://localhost:${PORT}"

free_port() {
  local pids
  pids="$(lsof -ti "tcp:${PORT}" -sTCP:LISTEN 2>/dev/null || true)"
  if [ -n "${pids}" ]; then
    echo ""
    echo ">>> 释放端口 ${PORT}（结束旧 Node 进程）..."
    kill -9 ${pids} 2>/dev/null || true
    sleep 1
  fi
}

wait_for_health() {
  local i url
  url="${HOST_URL}/health"
  echo ">>> 等待服务就绪: ${url}"
  i=1
  while [ "$i" -le 90 ]; do
    if curl -fsS --max-time 2 "${url}" >/dev/null 2>&1; then
      echo ">>> 服务已就绪（${i}s）"
      return 0
    fi
    sleep 1
    i=$((i + 1))
  done
  echo ">>> 警告：健康检查超时，请查看终端是否出现 Ready / Compiled"
  return 1
}

free_port

echo ""
echo ">>> PM Command Center — 本地开发"
echo ">>> 请在 Safari 打开: ${HOST_URL}"
echo ">>> 不要用 http://127.0.0.1:${PORT}（易触发 Next 跨源与 Safari 加载失败）"
echo ">>> 保持本窗口打开；首次打开子项目页可能需编译 10–20 秒"
echo ""

export WATCHPACK_POLLING=true
npm run dev -- --port "${PORT}" &
DEV_PID=$!

trap 'kill "${DEV_PID}" 2>/dev/null || true' EXIT INT TERM

if wait_for_health; then
  if [ "${OPEN_BROWSER}" = "1" ]; then
    open "${HOST_URL}" 2>/dev/null || true
  fi
fi

wait "${DEV_PID}"
