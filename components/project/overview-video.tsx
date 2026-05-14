"use client";

import { useState } from "react";
import type { OverviewVideoBlock } from "@/types/domain";

function safeHttpsPageUrl(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  try {
    const u = new URL(t);
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    return u.toString();
  } catch {
    return null;
  }
}

function youtubeEmbedUrl(input: string): string | null {
  const trimmed = input.trim();
  if (/^[\w-]{11}$/.test(trimmed)) {
    return `https://www.youtube.com/embed/${trimmed}`;
  }
  try {
    const u = new URL(trimmed);
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace("/", "").split("/")[0];
      if (id && /^[\w-]{11}$/.test(id)) {
        return `https://www.youtube.com/embed/${id}`;
      }
    }
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v && /^[\w-]{11}$/.test(v)) {
        return `https://www.youtube.com/embed/${v}`;
      }
      const parts = u.pathname.split("/").filter(Boolean);
      const i = parts.indexOf("embed");
      if (i >= 0 && parts[i + 1] && /^[\w-]{11}$/.test(parts[i + 1])) {
        return `https://www.youtube.com/embed/${parts[i + 1]}`;
      }
    }
  } catch {
    return null;
  }
  return null;
}

export function OverviewVideoSection({
  block,
}: {
  block: OverviewVideoBlock;
}) {
  const [mediaError, setMediaError] = useState<string | null>(null);
  const youtubeEmbed =
    block.mode === "youtube" ? youtubeEmbedUrl(block.src) : null;
  const pageEmbed =
    block.mode === "embed" ? safeHttpsPageUrl(block.src) : null;

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      {block.title ? (
        <div className="border-b border-border px-5 py-3">
          <h3 className="text-sm font-semibold">{block.title}</h3>
          {block.caption ? (
            <p className="mt-1 text-xs text-muted-foreground">{block.caption}</p>
          ) : null}
        </div>
      ) : block.caption ? (
        <div className="border-b border-border px-5 py-3">
          <p className="text-xs text-muted-foreground">{block.caption}</p>
        </div>
      ) : null}

      <div className="p-4">
        {block.mode === "file" ? (
          <div className="space-y-2">
            <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
              <video
                className="h-full w-full object-contain"
                controls
                playsInline
                preload="none"
                poster={block.poster}
                src={block.src}
                onError={() =>
                  setMediaError(
                    `无法加载视频（404 或格式不支持）。请确认文件在 public 目录下且路径与 JSON 一致：${block.src}`,
                  )
                }
              >
                您的浏览器不支持 HTML5 视频。
              </video>
            </div>
            {mediaError ? (
              <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {mediaError}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                若只看到灰屏，多为文件较大（数百 MB）正在缓冲；也可{" "}
                <a
                  className="text-primary underline"
                  href={block.src}
                  target="_blank"
                  rel="noreferrer"
                >
                  新标签页直接打开视频文件
                </a>{" "}
                测试是否能访问。
              </p>
            )}
          </div>
        ) : block.mode === "embed" && pageEmbed ? (
          <div className="space-y-2">
            {/*
              不设 sandbox：飞书/wiki 内视频与登录态在过严 sandbox 下易失败。
              embed 的 src 来自项目数据，仅信任来源时使用。
            */}
            <div className="relative w-full overflow-hidden rounded-md bg-muted/30">
              <iframe
                title={block.title ?? "概览视频"}
                src={pageEmbed}
                className="block w-full border-0"
                style={{ minHeight: block.embedHeightPx ?? 480 }}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="clipboard-read; clipboard-write; fullscreen; autoplay"
              />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                若内嵌为空白或未自动播放，多为飞书登录态或浏览器策略限制；可在飞书内打开或先登录后再试。
              </p>
              <a
                href={pageEmbed}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-muted/50"
              >
                在飞书中打开
              </a>
            </div>
          </div>
        ) : block.mode === "embed" ? (
          <p className="text-sm text-destructive">
            无法解析嵌入地址，请填写以 https:// 开头的飞书/wiki 链接。
          </p>
        ) : youtubeEmbed ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
            <iframe
              title={block.title ?? "YouTube"}
              className="absolute inset-0 h-full w-full"
              src={youtubeEmbed}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <p className="text-sm text-destructive">
            无法解析 YouTube 地址，请填写 11 位视频 ID 或完整链接。
          </p>
        )}
      </div>
    </div>
  );
}
