"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const ZERO_LINE: { code: string; title: string }[] = [
  { code: "A1", title: "语法入门与程序结构" },
  { code: "A2", title: "语法进阶与基础算法" },
  { code: "A3", title: "数据结构与高级算法" },
  { code: "A4", title: "算法设计与程序优化" },
  { code: "A5", title: "算法应用强化" },
  { code: "A6", title: "高级算法进阶" },
  { code: "A7", title: "图论算法与数据结构优化" },
  { code: "A8", title: "问题建模与求解策略" },
];

function StepCard({
  code,
  title,
  variant,
}: {
  code: string;
  title: string;
  variant: "sky" | "rose";
}) {
  const isSky = variant === "sky";
  return (
    <div
      className={cn(
        "flex min-w-[7.5rem] max-w-[10rem] shrink-0 flex-col rounded-xl border-2 px-2.5 py-2 text-center shadow-sm",
        isSky
          ? "border-sky-500/90 bg-gradient-to-b from-sky-50 to-sky-100/90 text-sky-950 dark:border-sky-400/80 dark:from-sky-950/50 dark:to-sky-900/30 dark:text-sky-50"
          : "border-rose-500/90 bg-gradient-to-b from-rose-50 to-rose-100/90 text-rose-950 dark:border-rose-400/80 dark:from-rose-950/50 dark:to-rose-900/30 dark:text-rose-50",
      )}
    >
      <span className="text-sm font-bold tracking-tight">{code}</span>
      <span className="mt-1 text-[11px] font-medium leading-snug text-foreground/90">{title}</span>
    </div>
  );
}

export function CourseSystemPlanningDiagram() {
  return (
    <div className="mt-4 space-y-6">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-sky-600 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm dark:bg-sky-500">
            零基础线
          </span>
          <span className="text-xs text-muted-foreground">A1 起逐级进阶至 A8</span>
        </div>
        <div className="overflow-x-auto pb-1 pt-1 [-webkit-overflow-scrolling:touch]">
          <div className="flex min-w-min items-stretch justify-start gap-1 pr-2 md:gap-1.5">
            {ZERO_LINE.map((n, i) => (
              <div key={n.code} className="flex items-stretch gap-1 md:gap-1.5">
                <StepCard {...n} variant="sky" />
                {i < ZERO_LINE.length - 1 ? (
                  <div className="flex shrink-0 items-center text-sky-600/80 dark:text-sky-400">
                    <ArrowRight className="h-4 w-4 md:h-5 md:w-5" strokeWidth={2.25} aria-hidden />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-rose-300/70 bg-rose-50/40 p-4 dark:border-rose-500/40 dark:bg-rose-950/20">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-rose-600 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm dark:bg-rose-500">
            非零基础线
          </span>
          <span className="text-xs text-muted-foreground">具备基础学员，自 A+1 汇入主干</span>
        </div>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <StepCard code="A+1" title="语法基础" variant="rose" />
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300">
            <ArrowRight className="h-4 w-4 shrink-0 sm:hidden" aria-hidden />
            <span className="hidden text-sm font-medium sm:inline">→</span>
            <span className="text-sm font-medium">自 A3 起与零基础线合并</span>
            <ArrowRight className="hidden h-4 w-4 shrink-0 sm:inline" aria-hidden />
            <span className="rounded-md border border-rose-400/60 bg-white/80 px-2 py-1 text-xs font-semibold text-rose-800 dark:bg-rose-950/60 dark:text-rose-100">
              A3
            </span>
          </div>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        路径说明：零基础线依次完成 A1→A2→…→A8；非零基础线完成 A+1 后从{" "}
        <strong className="text-foreground">A3（数据结构与高级算法）</strong> 接入同一进阶序列。
      </p>
    </div>
  );
}
