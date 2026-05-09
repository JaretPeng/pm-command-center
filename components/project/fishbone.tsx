"use client";

import type { RetrospectiveDeepDive } from "@/types/domain";

export function FishboneDiagram({ dive }: { dive: RetrospectiveDeepDive }) {
  const spineY = 140;
  const headX = 760;

  return (
    <div className="glass-card rounded-xl border p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold">{dive.title}</p>
          <p className="text-xs text-muted-foreground">鱼骨图 · Root Cause</p>
        </div>
      </div>
      <div className="mt-4 overflow-x-auto">
        <svg viewBox="0 0 840 280" className="min-w-[720px] h-auto w-full">
          <defs>
            <linearGradient id="fishbone-spine" x1="0" x2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
              <stop offset="100%" stopColor="hsl(199 89% 48%)" stopOpacity="0.35" />
            </linearGradient>
          </defs>

          <text x="40" y="40" fill="hsl(var(--foreground))" fontSize="13" fontWeight="700">
            {dive.fishbone.problemStatement}
          </text>

          <line
            x1="120"
            y1={spineY}
            x2={headX}
            y2={spineY}
            stroke="url(#fishbone-spine)"
            strokeWidth="6"
            strokeLinecap="round"
          />

          <polygon
            points={`${headX},${spineY - 10} ${headX + 26},${spineY} ${headX},${spineY + 10}`}
            fill="hsl(var(--primary))"
            opacity="0.85"
          />

          {dive.fishbone.branches.map((b, i) => {
            const top = i % 2 === 0;
            const x0 = 170 + i * 105;
            const y0 = spineY;
            const x1 = x0 + (top ? -40 : -40);
            const y1 = top ? 70 : 210;
            return (
              <g key={b.category}>
                <line
                  x1={x0}
                  y1={y0}
                  x2={x1}
                  y2={y1}
                  stroke="hsl(var(--border))"
                  strokeWidth="2"
                />
                <rect
                  x={x1 - 70}
                  y={top ? y1 - 44 : y1}
                  width="140"
                  height="44"
                  rx="10"
                  fill="hsl(var(--card))"
                  stroke="hsl(var(--border))"
                />
                <text
                  x={x1}
                  y={top ? y1 - 22 : y1 + 18}
                  textAnchor="middle"
                  fill="hsl(var(--foreground))"
                  fontSize="12"
                  fontWeight="600"
                >
                  {b.category}
                </text>
                <text
                  x={x1}
                  y={top ? y1 - 6 : y1 + 34}
                  textAnchor="middle"
                  fill="hsl(var(--muted-foreground))"
                  fontSize="10"
                >
                  {b.causes.slice(0, 2).join(" · ")}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
