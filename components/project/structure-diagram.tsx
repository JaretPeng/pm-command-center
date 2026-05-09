"use client";

import { useId } from "react";
import type { ProjectStructure } from "@/types/domain";

export function StructureDiagram({ structure }: { structure: ProjectStructure }) {
  const uid = useId();
  const mid = `arrow-${uid}`;
  const positions: Record<string, { x: number; y: number }> = {};
  structure.nodes.forEach((n, i) => {
    const angle = (i / structure.nodes.length) * Math.PI * 2 - Math.PI / 2;
    positions[n.id] = {
      x: 260 + Math.cos(angle) * 180,
      y: 160 + Math.sin(angle) * 110,
    };
  });

  return (
    <div className="glass-card rounded-xl border p-4">
      <p className="text-sm font-semibold">项目结构图</p>
      <p className="text-xs text-muted-foreground">
        节点 · 依赖 · 协同关系（示意）
      </p>
      <svg viewBox="0 0 520 320" className="mt-4 h-auto w-full">
        <defs>
          <marker
            id={mid}
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 z" fill="hsl(var(--muted-foreground))" opacity="0.6" />
          </marker>
        </defs>
        {structure.edges.map((e, i) => {
          const a = positions[e.from];
          const b = positions[e.to];
          if (!a || !b) return null;
          return (
            <line
              key={`${e.from}-${e.to}-${i}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="hsl(var(--border))"
              strokeWidth="2"
              markerEnd={`url(#${mid})`}
            />
          );
        })}
        {structure.nodes.map((n) => {
          const p = positions[n.id];
          if (!p) return null;
          return (
            <g key={n.id}>
              <rect
                x={p.x - 78}
                y={p.y - 28}
                width="156"
                height="56"
                rx="12"
                fill="hsl(var(--card))"
                stroke="hsl(var(--border))"
              />
              <text
                x={p.x}
                y={p.y - 4}
                textAnchor="middle"
                fill="hsl(var(--foreground))"
                fontSize="13"
                fontWeight="600"
              >
                {n.label}
              </text>
              {n.sublabel ? (
                <text
                  x={p.x}
                  y={p.y + 14}
                  textAnchor="middle"
                  fill="hsl(var(--muted-foreground))"
                  fontSize="11"
                >
                  {n.sublabel}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
