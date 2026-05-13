"use client";

import Link from "next/link";
import {
  Box,
  ChevronRight,
  Code2,
  FileText,
  HelpCircle,
  Terminal,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import type { HeroCurriculumIcon, HeroCurriculumStrip } from "@/types/domain";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<HeroCurriculumIcon, LucideIcon> = {
  terminal: Terminal,
  code: Code2,
  trendingUp: TrendingUp,
  box: Box,
  fileText: FileText,
  helpCircle: HelpCircle,
};

export function HeroCurriculumStripBlock({ strip }: { strip: HeroCurriculumStrip }) {
  const { title, moreLabel = "MORE", moreHref, modules } = strip;

  return (
    <div
      className={cn(
        "mt-5 rounded-2xl border border-primary/10 p-4 shadow-sm",
        "bg-gradient-to-br from-sky-50/90 via-indigo-50/70 to-violet-100/50",
        "dark:from-sky-950/40 dark:via-indigo-950/35 dark:to-violet-950/30 dark:border-white/10",
      )}
    >
      <div className="relative mb-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <span className="w-4 shrink-0" aria-hidden />
        <h2 className="text-center text-base font-bold tracking-tight text-sky-950 dark:text-sky-100">
          {title}
        </h2>
        <div className="flex justify-end">
          {moreHref ? (
            <Link
              href={moreHref}
              className="inline-flex items-center gap-0.5 text-xs font-semibold uppercase tracking-wide text-sky-700 transition hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-100"
            >
              {moreLabel}
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          ) : (
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold uppercase tracking-wide text-sky-700/80 dark:text-sky-400/90">
              {moreLabel}
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
        {modules.map((m) => {
          const Icon = ICON_MAP[m.icon] ?? Box;
          return (
            <div
              key={m.code}
              className={cn(
                "relative flex min-h-[132px] flex-col overflow-hidden rounded-xl px-2 pb-10 pt-3 text-center",
                "bg-gradient-to-b from-sky-500 via-indigo-500 to-violet-600 text-white shadow-md",
                "dark:from-sky-600 dark:via-indigo-600 dark:to-violet-700",
              )}
            >
              <p className="relative z-[1] text-lg font-bold leading-none">{m.code}</p>
              <p className="relative z-[1] mt-2 text-[10.5px] font-medium leading-snug text-white/95">
                <span className="text-white">{m.line1}</span>
                {m.line2 ? (
                  <>
                    <span className="text-white/55"> / </span>
                    <span className="font-normal text-white/90">{m.line2}</span>
                  </>
                ) : null}
              </p>
              <Icon
                className="pointer-events-none absolute -bottom-1 left-1/2 h-14 w-14 -translate-x-1/2 text-white/25"
                strokeWidth={1.25}
                aria-hidden
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
