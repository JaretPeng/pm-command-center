"use client";

import type { TimelineEmbedBlock } from "@/types/domain";

function safeEmbedUrl(raw: string): string | null {
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

export function TimelineEmbedSection({
  block,
}: {
  block: TimelineEmbedBlock;
}) {
  const src = safeEmbedUrl(block.embedUrl);
  if (!src) return null;

  const h = block.heightPx ?? 560;

  return (
    <div className="glass-card mb-6 overflow-hidden rounded-xl border border-border">
      {(block.title || block.caption) && (
        <div className="border-b border-border px-4 py-3">
          {block.title ? (
            <h3 className="text-sm font-semibold">{block.title}</h3>
          ) : null}
          {block.caption ? (
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {block.caption}
            </p>
          ) : null}
        </div>
      )}
      <div className="relative w-full bg-muted/30">
        <iframe
          title={block.title ?? "甘特嵌入"}
          src={src}
          className="w-full border-0"
          style={{ minHeight: h }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </div>
      <p className="border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
        若此处为空白，多为石墨禁止第三方 iframe 嵌入；请改用石墨导出表格后更新{" "}
        <code className="rounded bg-muted px-1">data/projects/&lt;slug&gt;.json</code>{" "}
        中的 <code className="rounded bg-muted px-1">gantt</code> 数组。
      </p>
    </div>
  );
}
