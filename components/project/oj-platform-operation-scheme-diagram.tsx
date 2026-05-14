"use client";

import type { ReactNode } from "react";

/** 《猿编程OJ运营方案》核心：练习供给 → 办赛增长 → 激励与社区 → 私域与商务回流 */

function Box({
  children,
  tone,
  className = "",
}: {
  children: ReactNode;
  tone: "emerald" | "sky" | "violet" | "amber" | "rose";
  className?: string;
}) {
  const ring =
    tone === "emerald"
      ? "border-emerald-600/55 bg-emerald-500/[0.08] text-emerald-950 dark:border-emerald-400/50 dark:bg-emerald-500/12 dark:text-emerald-50"
      : tone === "sky"
        ? "border-sky-600/55 bg-sky-500/[0.08] text-sky-950 dark:border-sky-400/50 dark:bg-sky-500/12 dark:text-sky-50"
        : tone === "violet"
          ? "border-violet-600/55 bg-violet-500/[0.08] text-violet-950 dark:border-violet-400/50 dark:bg-violet-500/12 dark:text-violet-50"
          : tone === "amber"
            ? "border-amber-500/60 bg-amber-400/[0.12] text-amber-950 dark:border-amber-400/50 dark:bg-amber-400/10 dark:text-amber-50"
            : "border-rose-500/55 bg-rose-500/[0.08] text-rose-950 dark:border-rose-400/50 dark:bg-rose-500/12 dark:text-rose-50";
  return (
    <div
      className={`flex min-h-[3.1rem] max-w-[13.5rem] items-center justify-center rounded-xl border-2 px-2.5 py-2 text-center text-[11px] font-medium leading-snug shadow-sm sm:min-h-[3.35rem] sm:max-w-[15rem] sm:text-xs ${ring} ${className}`}
    >
      {children}
    </div>
  );
}

function Arrow({ label, dir = "right" }: { label?: string; dir?: "right" | "down" }) {
  return (
    <div
      className={`flex shrink-0 flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-muted-foreground ${
        dir === "down" ? "min-h-[1.75rem]" : "min-w-[2.25rem] px-0.5 sm:min-w-10"
      }`}
    >
      {dir === "right" ? (
        <>
          {label ? (
            <span className="max-w-[3.25rem] text-center leading-tight text-foreground/80">
              {label}
            </span>
          ) : null}
          <span className="text-base leading-none text-foreground/35 sm:text-lg">→</span>
        </>
      ) : (
        <>
          <span className="text-base leading-none text-foreground/35 sm:text-lg">↓</span>
          {label ? (
            <span className="max-w-[4.5rem] text-center leading-tight">{label}</span>
          ) : null}
        </>
      )}
    </div>
  );
}

export function OjPlatformOperationSchemeDiagram() {
  return (
    <div className="space-y-6">
      <p className="text-center text-[11px] text-muted-foreground sm:text-xs">
        示意：方案「〇、核心结论」中的平台运营主线与资源回流（非排期甘特）
      </p>

      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4 sm:p-5">
        <h4 className="mb-3 text-center text-xs font-semibold text-emerald-900 dark:text-emerald-100 sm:text-sm">
          练习与内容供给
        </h4>
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-1">
          <Box tone="emerald">题单矩阵 · 知识点至 CSP-S</Box>
          <Arrow label="题解" />
          <Box tone="emerald">精选 / 真题 / 周赛合集</Box>
          <Arrow label="审核" />
          <Box tone="emerald">新题规范 · 验题 SOP · 评审组</Box>
        </div>
      </div>

      <div className="rounded-2xl border border-sky-500/25 bg-sky-500/[0.05] p-4 sm:p-5">
        <h4 className="mb-3 text-center text-xs font-semibold text-sky-950 dark:text-sky-50 sm:text-sm">
          办赛与增长脉冲
        </h4>
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-1">
          <Box tone="sky">新手 / CSP-J / CSP-S / NOI 分组</Box>
          <Arrow />
          <Box tone="sky">周赛 · 月赛 · 模考日历</Box>
          <Arrow label="推广" />
          <Box tone="sky">公众号 · B 站 · 校队 · 学员分层</Box>
        </div>
      </div>

      <div className="rounded-2xl border border-violet-500/25 bg-violet-500/[0.05] p-4 sm:p-5">
        <h4 className="mb-3 text-center text-xs font-semibold text-violet-950 dark:text-violet-50 sm:text-sm">
          激励 · 社区 · 活动
        </h4>
        <div className="flex flex-col items-center gap-3">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-1">
            <Box tone="violet">积分（水平）与 Rating</Box>
            <Arrow />
            <Box tone="violet">金币 · 商城（二期）</Box>
            <Arrow />
            <Box tone="violet">悬赏问答 · 专栏话题</Box>
          </div>
          <Arrow dir="down" label="轻运营" />
          <Box tone="violet" className="max-w-[min(100%,22rem)]">
            活动：教研定期分享 → NOI 获奖者讲座 → GESP / CSP 备赛分享
          </Box>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-500/25 bg-amber-400/[0.06] p-4 sm:p-5">
        <h4 className="mb-3 text-center text-xs font-semibold text-amber-950 dark:text-amber-50 sm:text-sm">
          团队 · 私域 · 商务回流
        </h4>
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-1">
          <Box tone="amber">校队 · 作者 · 班主任建团队</Box>
          <Arrow />
          <Box tone="amber">QQ 矩阵：总群 / 高段 / 内测</Box>
          <Arrow />
          <Box tone="amber">金牌合作 · 公立校 · 机构联名 · CCF</Box>
        </div>
      </div>

      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.04] p-3 sm:p-4">
        <p className="text-center text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
          数据监测（注册 / 活跃 / 提交 / 赛况）与成本节奏（教研出题、奖金池、API、运营编制）闭合到周会与「进度管理」sheet，详见下文「成本与时间线」板块。
        </p>
      </div>
    </div>
  );
}
