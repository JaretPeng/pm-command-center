import { NextResponse } from "next/server";

/** 部署/预览探活：不读磁盘，用于确认进程与路由可达 */
export function GET() {
  return NextResponse.json({ ok: true }, { status: 200 });
}
