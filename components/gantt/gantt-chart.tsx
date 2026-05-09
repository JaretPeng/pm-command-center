"use client";

import { useMemo } from "react";
import type { GanttItem } from "@/types/domain";

function parse(iso: string) {
  return new Date(iso).getTime();
}

export function GanttChart({ items }: { items: GanttItem[] }) {
  const model = useMemo(() => {
    if (!items.length) return null;
    let min = Infinity;
    let max = -Infinity;
    for (const it of items) {
      const s = parse(it.start);
      const e = parse(it.end);
      min = Math.min(min, s);
      max = Math.max(max, e);
    }
    const span = Math.max(1, max - min);
    const lanes = Array.from(new Set(items.map((i) => i.lane)));
    const today = Date.now();
    const todayPct =
      today >= min && today <= max ? ((today - min) / span) * 100 : null;

    const bars = items.map((it) => {
      const s = parse(it.start);
      const e = parse(it.end);
      const left = ((s - min) / span) * 100;
      const width = Math.max(1, ((e - s) / span) * 100);
      const laneIndex = lanes.indexOf(it.lane);
      return { ...it, left, width, laneIndex };
    });

    const deps = items
      .flatMap((it) =>
        (it.dependencies ?? []).map((d) => {
          const from = bars.find((b) => b.id === d.from);
          const to = bars.find((b) => b.id === d.to);
          return from && to ? { from, to } : null;
        }),
      )
      .filter(Boolean) as { from: (typeof bars)[0]; to: (typeof bars)[0] }[];

    return { min, max, span, lanes, bars, todayPct, deps };
  }, [items]);

  if (!model) {
    return (
      <p className="text-sm text-muted-foreground">暂无甘特数据</p>
    );
  }

  const rowH = 44;
  const chartH = model.lanes.length * rowH + 48;

  return (
    <div className="glass-card overflow-hidden rounded-xl border">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <p className="text-sm font-semibold">企业级甘特视图</p>
          <p className="text-xs text-muted-foreground">
            泳道 · 进度 · 今日线 · 依赖示意
          </p>
        </div>
      </div>
      <div className="relative overflow-x-auto p-4">
        <svg
          width="100%"
          height={chartH}
          viewBox={`0 0 1000 ${chartH}`}
          preserveAspectRatio="none"
          className="min-w-[720px]"
        >
          <defs>
            <linearGradient id="barGrad" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.95" />
              <stop offset="100%" stopColor="hsl(199 89% 48%)" stopOpacity="0.85" />
            </linearGradient>
          </defs>

          {model.lanes.map((lane, li) => (
            <g key={lane}>
              <rect
                x="0"
                y={li * rowH}
                width="1000"
                height={rowH}
                fill={li % 2 === 0 ? "hsl(var(--muted) / 0.15)" : "transparent"}
              />
              <text
                x="8"
                y={li * rowH + 26}
                fill="hsl(var(--muted-foreground))"
                fontSize="12"
              >
                {lane}
              </text>
            </g>
          ))}

          {model.todayPct != null ? (
            <g>
              <line
                x1={(model.todayPct / 100) * 1000}
                x2={(model.todayPct / 100) * 1000}
                y1="0"
                y2={chartH}
                stroke="hsl(var(--destructive))"
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity="0.85"
              />
              <text
                x={(model.todayPct / 100) * 1000 + 4}
                y="14"
                fill="hsl(var(--destructive))"
                fontSize="11"
              >
                Today
              </text>
            </g>
          ) : null}

          {model.deps.slice(0, 4).map((d, i) => {
            const x1 = (d.from.left / 100) * 1000 + (d.from.width / 100) * 500;
            const y1 = d.from.laneIndex * rowH + rowH / 2;
            const x2 = (d.to.left / 100) * 1000;
            const y2 = d.to.laneIndex * rowH + rowH / 2;
            return (
              <path
                key={i}
                d={`M ${x1} ${y1} C ${x1 + 80} ${y1}, ${x2 - 80} ${y2}, ${x2} ${y2}`}
                fill="none"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.7"
              />
            );
          })}

          {model.bars.map((b) => {
            const y = b.laneIndex * rowH + 10;
            const x = (b.left / 100) * 1000;
            const w = Math.max(6, (b.width / 100) * 1000);
            const progW = (w * b.progress) / 100;
            return (
              <g key={b.id}>
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height="22"
                  rx="6"
                  fill="hsl(var(--muted) / 0.35)"
                  stroke="hsl(var(--border))"
                />
                <rect
                  x={x}
                  y={y}
                  width={progW}
                  height="22"
                  rx="6"
                  fill="url(#barGrad)"
                />
                <text
                  x={x + 8}
                  y={y + 15}
                  fill="hsl(var(--foreground))"
                  fontSize="11"
                  fontWeight="600"
                >
                  {b.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
