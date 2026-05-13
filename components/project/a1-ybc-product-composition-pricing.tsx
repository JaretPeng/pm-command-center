"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

const ROWS: {
  id: string;
  label: string;
  before: ReactNode;
  after: ReactNode;
}[] = [
  {
    id: "period",
    label: "对应期次",
    before: "A1 5 期及之前期次",
    after: "A1 6 期及之后期次",
  },
  {
    id: "price",
    label: "售价",
    before: (
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground line-through">原价 ¥4798</p>
        <p className="text-sm font-bold tabular-nums text-slate-800 dark:text-slate-100 sm:text-base">
          实付 ¥4198
        </p>
      </div>
    ),
    after: (
      <div className="space-y-1">
        <p className="text-xs text-orange-950/55 line-through dark:text-orange-100/45">
          原价 ¥4898
        </p>
        <p className="text-sm font-bold tabular-nums text-orange-700 dark:text-orange-300 sm:text-base">
          实付 ¥4298
        </p>
      </div>
    ),
  },
  {
    id: "course",
    label: "课程",
    before: (
      <span className="whitespace-pre-line">
        {"17 次直播课\n共 34 课时"}
      </span>
    ),
    after: (
      <span className="whitespace-pre-line">
        {"17 次直播课 · 共 34 课时\n"}
        <span className="font-medium text-orange-800 dark:text-orange-200">
          新增 4 个硬件案例教学
        </span>
      </span>
    ),
  },
  {
    id: "materials",
    label: "随材",
    before: "CCF 官方练习册",
    after: (
      <ul className="list-none space-y-1 text-[11px] leading-snug sm:text-[12px]">
        <li>
          <span className="font-medium">YBC 硬件箱</span>
          <span className="text-muted-foreground"> · 外宣 ¥899</span>
        </li>
        <li>
          <span className="font-medium">YBC 自研学习手册</span>
          <span className="text-muted-foreground"> · 外宣 ¥99</span>
        </li>
      </ul>
    ),
  },
  {
    id: "bonus",
    label: "赠课",
    before: <span className="text-muted-foreground">—</span>,
    after: (
      <div className="space-y-1.5 text-[11px] leading-snug sm:text-[12px]">
        <p className="font-medium text-orange-900 dark:text-orange-100">7 课时赠课</p>
        <ul className="list-disc space-y-0.5 pl-3 text-muted-foreground marker:text-orange-400 sm:pl-3.5">
          <li>
            《算法发明家》4 课时
            <span className="text-muted-foreground/90">（外宣 ¥299）</span>
          </li>
          <li>
            《算法思维课 · 思维启迪》3 课时
            <span className="text-muted-foreground/90">（外宣 ¥199）</span>
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "exam",
    label: "赛考权益",
    before: (
      <span className="whitespace-pre-line text-[11px] leading-relaxed sm:text-[12px]">
        {
          "AICE C++ 考级一级\n1 次考前指导课 + 4 次正课\n共 9 课时"
        }
      </span>
    ),
    after: (
      <div className="space-y-2.5 text-[11px] leading-snug sm:text-xs sm:leading-relaxed">
        <div className="rounded-md border border-orange-500/25 bg-orange-500/[0.06] px-2 py-2 dark:bg-orange-950/20 sm:px-2.5 sm:py-2.5">
          <p className="font-semibold leading-snug text-orange-950 dark:text-orange-50">
            权益 1 · 青少年软件编程等级考试 C++ 一级
          </p>
          <p className="mt-1 text-xs text-muted-foreground">A1 完课后送考</p>
          <ul className="mt-2 list-disc space-y-0.5 pl-4 text-muted-foreground">
            <li>1 次考前指导课（30min）</li>
            <li>4 次备考课（70min/次），共 9 课时</li>
          </ul>
        </div>
        <div className="rounded-md border border-amber-500/25 bg-amber-500/[0.06] px-2 py-2 dark:bg-amber-950/20 sm:px-2.5 sm:py-2.5">
          <p className="font-semibold leading-snug text-amber-950 dark:text-amber-50">
            权益 2 · 信息素养大赛 C++ 赛项
          </p>
          <p className="mt-1 text-xs text-muted-foreground">A2 完课后送考</p>
          <ul className="mt-2 list-disc space-y-0.5 pl-4 text-muted-foreground">
            <li>1 次赛前指导课（30min）</li>
            <li>3 次备考直播课（70min/次），共 7 课时</li>
          </ul>
        </div>
      </div>
    ),
  },
];

export function A1YbcProductCompositionPricing() {
  return (
    <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-xl border border-border/70 bg-gradient-to-b from-card to-muted/15 shadow-md ring-1 ring-black/[0.04] dark:from-card dark:to-muted/10 dark:ring-white/[0.05]">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse text-left text-xs sm:text-sm">
          <colgroup>
            <col className="w-[17%]" />
            <col className="w-[36%]" />
            <col className="w-[47%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-border/80">
              <th
                scope="col"
                className="bg-gradient-to-b from-sky-600 to-blue-900 px-2 py-2.5 text-[10px] font-bold uppercase tracking-wide text-white sm:px-2.5 sm:py-3 sm:text-xs"
              >
                维度
              </th>
              <th
                scope="col"
                className="bg-gradient-to-r from-slate-600 to-slate-800 px-2 py-2.5 text-center text-white sm:px-3 sm:py-3"
              >
                <span className="block text-[9px] font-semibold uppercase tracking-wider text-white/70 sm:text-[10px]">
                  迭代前
                </span>
                <span className="mt-0.5 block text-[11px] font-semibold leading-tight sm:mt-1 sm:text-xs">
                  A1（无硬件版）
                </span>
              </th>
              <th
                scope="col"
                className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 px-2 py-2.5 text-center text-white sm:px-3 sm:py-3"
              >
                <span className="flex items-center justify-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-white/85 sm:text-[10px]">
                  <Sparkles className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" aria-hidden />
                  迭代后
                </span>
                <span className="mt-0.5 block text-[11px] font-semibold leading-tight sm:mt-1 sm:text-xs">
                  A1（YBC 硬件版）
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <tr
                key={row.id}
                className={cn(
                  "border-b border-border/60 transition-colors",
                  i % 2 === 0 ? "bg-muted/10" : "bg-muted/[0.04]",
                )}
              >
                <th
                  scope="row"
                  className={cn(
                    "break-words border-r border-border/50 bg-gradient-to-r from-sky-600 to-blue-800 px-2 py-2 text-[10px] font-semibold leading-snug text-white sm:px-2.5 sm:py-2.5 sm:text-xs",
                    i % 2 === 1 && "from-sky-700 to-blue-950",
                  )}
                >
                  {row.label}
                </th>
                <td className="break-words align-top border-r border-border/40 px-2 py-2 text-[11px] leading-snug text-foreground/90 sm:px-2.5 sm:py-2.5 sm:text-[13px] sm:leading-relaxed">
                  {row.before}
                </td>
                <td className="break-words align-top bg-gradient-to-br from-primary/[0.04] via-orange-500/[0.05] to-amber-500/[0.04] px-2 py-2 text-[11px] leading-snug sm:px-2.5 sm:py-2.5 sm:text-[13px] sm:leading-relaxed">
                  {row.after}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t border-border/60 bg-muted/30 px-3 py-2 text-center text-[10px] leading-relaxed text-muted-foreground sm:px-4 sm:py-2.5 sm:text-xs">
        定价与权益以售卖定稿为准；外宣价值仅作市场沟通参考。
      </p>
    </div>
  );
}
