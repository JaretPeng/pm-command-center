"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/** A 线班型：产品构成与定价（项目总览 · Operation Scheme 专用，数据来自运营定价对照表） */
const STAGES = [
  {
    code: "A1",
    line: "A" as const,
    priceOrig: "¥4798",
    priceSale: "¥4198",
    sessions:
      "共 17 课次；每课次 2 讲课单位（70 分钟）；合计约 34 小时",
    materials:
      "第 1–5 讲：外购 CCF 书 1 本；第 6 讲起：自研学习手册 1 本",
    bonus:
      "录播 7 节：①「算法发明家」约 4h；②「算法思维课 · 思维启迪」约 3h",
  },
  {
    code: "A2",
    line: "A" as const,
    priceOrig: "¥4998",
    priceSale: "¥4998",
    sessions:
      "共 17 课次；每课次 3 讲课单位（110 分钟）；合计约 51 小时",
    materials:
      "第 1 讲：学生用书无货；第 2 讲起：自研学习手册 1 本",
    bonus: "录播 6 节：「算法思维课 · 思维进阶」约 6h",
  },
  {
    code: "A3",
    line: "A" as const,
    priceOrig: "¥4998",
    priceSale: "¥4998",
    sessions:
      "共 17 课次；每课次 3 讲课单位（110 分钟）；合计约 51 小时",
    materials:
      "第 1–4 讲：外购 CCF 书 1 本；第 5 讲起：电子版学习手册 1 本",
    bonus: "录播 6 节：「算法思维课 · 思维提升」约 6h",
  },
  {
    code: "A4",
    line: "A" as const,
    priceOrig: "¥4998",
    priceSale: "¥4998",
    sessions:
      "共 17 课次；每课次 3 讲课单位（110 分钟）；合计约 51 小时",
    materials: "电子版学习手册 1 本（自第 1 讲起）",
    bonus: "录播 3 节：「算法思维课 · 思维突破」约 3h",
  },
  {
    code: "A5",
    line: "A" as const,
    priceOrig: "¥4998",
    priceSale: "¥4998",
    sessions:
      "共 17 课次；每课次 3 讲课单位（110 分钟）；合计约 51 小时",
    materials: "电子版学习手册 1 本（自第 1 讲起）",
    bonus: "录播 3 节：「算法思维课 · 思维挑战」约 3h",
  },
  {
    code: "A6",
    line: "A" as const,
    priceOrig: "¥4998",
    priceSale: "¥4998",
    sessions:
      "共 20 课次；每课次 3 讲课单位（110 分钟）；合计约 60 小时",
    materials: "暂无",
    bonus: "暂无",
  },
  {
    code: "A7",
    line: "A" as const,
    priceOrig: "¥4998",
    priceSale: "¥4998",
    sessions:
      "共 20 课次；每课次 3 讲课单位（110 分钟）；合计约 60 小时",
    materials: "暂无",
    bonus: "暂无",
  },
  {
    code: "A8",
    line: "A" as const,
    priceOrig: "¥4998",
    priceSale: "¥4998",
    sessions:
      "共 20 课次；每课次 3 讲课单位（110 分钟）；合计约 60 小时",
    materials: "暂无",
    bonus: "暂无",
  },
  {
    code: "A+1",
    line: "A+" as const,
    priceOrig: "¥4998",
    priceSale: "¥4998",
    sessions:
      "共 17 课次；每课次 3 讲课单位（110 分钟）；合计约 51 小时",
    materials: "自研学习手册 1 本",
    bonus:
      "录播 10 节：①「算法发明家」约 4h；②「算法思维课 · 思维探索」约 6h",
  },
] as const;

const ROWS = [
  { id: "price", label: "价格" },
  { id: "sessions", label: "课次与课时" },
  { id: "materials", label: "随材" },
  { id: "bonus", label: "赠课" },
] as const;

function headerCellClass(s: (typeof STAGES)[number]): string {
  if (s.line === "A+") {
    return cn(
      "bg-gradient-to-b from-orange-500 to-rose-600 text-white shadow-inner",
      "dark:from-orange-600 dark:to-rose-700",
    );
  }
  return cn(
    "bg-gradient-to-b from-sky-400/90 to-blue-600 text-white shadow-inner",
    "dark:from-sky-500 dark:to-blue-800",
  );
}

function rowLabelClass(ri: number): string {
  return cn(
    "flex items-center bg-gradient-to-r from-blue-800 to-blue-950 px-2 py-2.5 text-[11px] font-semibold leading-snug text-amber-50 sm:text-xs",
    "dark:from-blue-950 dark:to-slate-950",
    ri % 2 === 1 && "from-blue-900 to-blue-950",
  );
}

function bodyCellClass(
  rowId: (typeof ROWS)[number]["id"],
  s: (typeof STAGES)[number],
  ri: number,
): string {
  const stripe = ri % 2 === 1;
  const base = cn(
    "px-2 py-2.5 text-[10px] leading-snug sm:text-[11px]",
    s.line === "A+"
      ? "border-l-2 border-orange-400/80"
      : s.code === "A8"
        ? "border-r-2 border-dashed border-orange-400/60"
        : "",
  );

  if (rowId === "price") {
    return cn(
      base,
      stripe
        ? "bg-sky-100/90 text-blue-950 dark:bg-sky-950/50 dark:text-sky-100"
        : "bg-blue-50 text-blue-950 dark:bg-blue-950/40 dark:text-blue-50",
    );
  }
  if (rowId === "sessions") {
    return cn(
      base,
      stripe
        ? "bg-orange-100/95 text-orange-950 dark:bg-orange-950/45 dark:text-orange-50"
        : "bg-amber-50 text-amber-950 dark:bg-amber-950/35 dark:text-amber-50",
    );
  }
  if (rowId === "materials") {
    return cn(
      base,
      stripe
        ? "bg-sky-50 text-sky-950 dark:bg-sky-950/35 dark:text-sky-100"
        : "bg-cyan-50/90 text-cyan-950 dark:bg-cyan-950/30 dark:text-cyan-50",
    );
  }
  return cn(
    base,
    stripe
      ? "bg-rose-50 text-rose-950 dark:bg-rose-950/40 dark:text-rose-50"
      : "bg-red-50/80 text-red-950 dark:bg-red-950/35 dark:text-red-50",
  );
}

export function AlineProductCompositionPricing() {
  return (
    <Card className="overflow-hidden border-2 border-blue-400/45 bg-gradient-to-br from-blue-50/95 via-orange-50/85 to-rose-50/90 p-0 shadow-lg shadow-blue-500/15 ring-1 ring-orange-300/30 dark:border-blue-500/30 dark:from-blue-950/50 dark:via-orange-950/25 dark:to-rose-950/35 dark:shadow-orange-900/20 dark:ring-orange-500/20">
      <div className="border-b border-border/80 bg-background px-4 py-3 sm:px-5">
        <h3 className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
          产品构成与定价
        </h3>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[920px] p-3 sm:p-4">
          <div
            className="grid gap-px overflow-hidden rounded-t-xl border-2 border-blue-400/50 bg-blue-500/30 shadow-sm dark:border-blue-500/40"
            style={{
              gridTemplateColumns: `minmax(5.5rem,6.5rem) repeat(${STAGES.length}, minmax(7.5rem,1fr))`,
            }}
          >
            <div className="bg-gradient-to-br from-blue-800 to-blue-950 px-2 py-2.5 text-center text-[10px] font-bold uppercase tracking-wide text-amber-100 sm:text-xs dark:from-blue-950 dark:to-slate-950">
              维度
            </div>
            {STAGES.map((s) => (
              <div
                key={s.code}
                className={cn("relative px-2 py-2.5 text-center", headerCellClass(s))}
              >
                <span className="text-sm font-bold tabular-nums tracking-tight">
                  {s.code}
                </span>
                <span className="mt-0.5 block text-[9px] font-semibold text-white/90">
                  {s.line === "A+" ? "A+ 线" : "A 线"}
                </span>
              </div>
            ))}
          </div>

          <div className="overflow-hidden rounded-b-xl border-2 border-t-0 border-blue-400/50 dark:border-blue-500/40">
            {ROWS.map((row, ri) => (
              <div
                key={row.id}
                className="grid gap-px bg-blue-500/25 dark:bg-blue-400/20"
                style={{
                  gridTemplateColumns: `minmax(5.5rem,6.5rem) repeat(${STAGES.length}, minmax(7.5rem,1fr))`,
                }}
              >
                <div className={rowLabelClass(ri)}>{row.label}</div>
                {STAGES.map((s) => (
                  <div
                    key={`${row.id}-${s.code}`}
                    className={cn(
                      bodyCellClass(row.id, s, ri),
                      row.id === "price" || row.id === "bonus"
                        ? "font-medium"
                        : "text-muted-foreground dark:text-opacity-90",
                    )}
                  >
                    {row.id === "price" ? (
                      <div className="space-y-1">
                        <p className="text-[10px] text-blue-800/70 line-through dark:text-blue-200/60">
                          原价 {s.priceOrig}
                        </p>
                        <p className="text-sm font-bold tabular-nums text-orange-600 dark:text-orange-400">
                          实际 {s.priceSale}
                        </p>
                      </div>
                    ) : null}
                    {row.id === "sessions" ? (
                      <p className="whitespace-pre-line text-orange-950/95 dark:text-orange-50/95">
                        {s.sessions}
                      </p>
                    ) : null}
                    {row.id === "materials" ? (
                      <p className="whitespace-pre-line text-sky-950/95 dark:text-sky-50/95">
                        {s.materials}
                      </p>
                    ) : null}
                    {row.id === "bonus" ? (
                      <p className="whitespace-pre-line text-rose-950/95 dark:text-rose-50/95">
                        {s.bonus}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
