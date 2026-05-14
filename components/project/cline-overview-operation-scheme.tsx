"use client";

import type { ReactNode } from "react";

/**
 * C 线项目总览 · Operation Scheme：价值探索 ↔ 待办枢纽 → 快速验证 → 指标闭环。
 * 四色分区（红 / 橙 / 黄 / 蓝），布局为纵向分块，避免文字与形状重叠。
 */

function Node({
  children,
  tone,
  className = "",
}: {
  children: ReactNode;
  tone: "red" | "orange" | "yellow" | "blue";
  className?: string;
}) {
  const ring =
    tone === "red"
      ? "border-red-500/70 bg-red-500/[0.08] text-red-950 dark:border-red-400/60 dark:bg-red-500/15 dark:text-red-50"
      : tone === "orange"
        ? "border-orange-500/70 bg-orange-500/[0.08] text-orange-950 dark:border-orange-400/60 dark:bg-orange-500/15 dark:text-orange-50"
        : tone === "yellow"
          ? "border-amber-400/80 bg-amber-400/[0.12] text-amber-950 dark:border-amber-300/60 dark:bg-amber-400/12 dark:text-amber-50"
          : "border-blue-600/70 bg-blue-600/[0.08] text-blue-950 dark:border-blue-400/60 dark:bg-blue-500/15 dark:text-blue-50";
  return (
    <div
      className={`flex min-h-[3.25rem] max-w-[220px] items-center justify-center rounded-xl border-2 px-3 py-2.5 text-center text-xs font-medium leading-snug shadow-sm sm:min-h-[3.5rem] sm:max-w-[240px] sm:text-[13px] ${ring} ${className}`}
    >
      {children}
    </div>
  );
}

function Edge({ label, vertical }: { label: string; vertical?: boolean }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center text-[10px] font-medium text-muted-foreground sm:text-[11px] ${
        vertical ? "min-h-[2rem] flex-col gap-0.5 py-1" : "min-w-[3rem] flex-col gap-0.5 px-1 sm:min-w-14"
      }`}
    >
      {vertical ? (
        <>
          <span className="text-lg leading-none text-foreground/40">↓</span>
          <span className="max-w-[5rem] text-center leading-tight">{label}</span>
        </>
      ) : (
        <>
          <span className="max-w-[4rem] text-center leading-tight text-foreground/85">{label}</span>
          <span className="text-lg leading-none text-foreground/35">→</span>
        </>
      )}
    </div>
  );
}

function SectionTitle({
  tone,
  title,
  subtitle,
}: {
  tone: "red" | "orange" | "yellow" | "blue";
  title: string;
  subtitle?: string;
}) {
  const bar =
    tone === "red"
      ? "bg-red-500"
      : tone === "orange"
        ? "bg-orange-500"
        : tone === "yellow"
          ? "bg-amber-400"
          : "bg-blue-600";
  return (
    <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 shrink-0 rounded-full ${bar}`} aria-hidden />
        <h4 className="text-sm font-semibold tracking-tight">{title}</h4>
      </div>
      {subtitle ? (
        <p className="text-[11px] text-muted-foreground sm:text-xs">{subtitle}</p>
      ) : null}
    </div>
  );
}

type PathCol = {
  edgeFromBacklog: string;
  input: string;
  midLabel: string;
  output: string;
  intoMetrics: string;
};

const PATH_COLUMNS: PathCol[] = [
  {
    edgeFromBacklog: "获客",
    input: "营销活动",
    midLabel: "招生",
    output: "学员",
    intoMetrics: "参课",
  },
  {
    edgeFromBacklog: "运营策略",
    input: "商品、定价整体策略",
    midLabel: "对齐",
    output: "策略与资源共识",
    intoMetrics: "—",
  },
  {
    edgeFromBacklog: "分班排课",
    input: "招生调控分班、排课规则",
    midLabel: "分班排课",
    output: "学员—老师关系",
    intoMetrics: "—",
  },
  {
    edgeFromBacklog: "教务",
    input: "服务 SOP",
    midLabel: "培训、学习",
    output: "辅导、销售动作",
    intoMetrics: "辅导、转化",
  },
  {
    edgeFromBacklog: "班课",
    input: "课程内容",
    midLabel: "配置录入",
    output: "线上课程",
    intoMetrics: "授课",
  },
  {
    edgeFromBacklog: "教学 / 产研",
    input: "可交付软件包",
    midLabel: "部署",
    output: "运行的线上服务",
    intoMetrics: "运行",
  },
];

export function ClineOverviewOperationSchemeDiagram() {
  return (
    <div className="space-y-10">
      {/* 价值探索 — 红 */}
      <section className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-4 sm:p-5">
        <SectionTitle
          tone="red"
          title="价值探索"
          subtitle="从问题锚定到方案精炼，再回到待办提问"
        />
        <div className="flex flex-col items-center gap-4 lg:flex-row lg:flex-wrap lg:justify-center lg:gap-x-2 lg:gap-y-4">
          <Node tone="red">本质问题或业务目标</Node>
          <Edge label="锚定" />
          <Node tone="red">可描述现状及目标的指标</Node>
          <Edge label="共创" />
          <Node tone="red">解决方案</Node>
          <Edge label="精炼" />
          <div className="hidden text-muted-foreground lg:block">→</div>
        </div>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          精炼后进入下方「待办事项」；待办经复盘后以「提问」回到左侧起点，形成探索闭环。
        </p>
      </section>

      {/* 待办枢纽 — 橙 */}
      <section className="rounded-2xl border border-orange-500/25 bg-orange-500/[0.04] p-4 sm:p-5">
        <SectionTitle tone="orange" title="待办枢纽" subtitle="承接探索与执行的中枢" />
        <div className="flex flex-col items-center gap-4">
          <Node tone="orange" className="max-w-[min(100%,320px)] min-h-[4rem] text-sm">
            待办事项
          </Node>
          <div className="flex w-full max-w-md flex-col items-center gap-1 text-center text-[11px] text-muted-foreground">
            <span className="text-base leading-none text-orange-600/70 dark:text-orange-400/80">
              ↑
            </span>
            <span>
              <span className="font-medium text-foreground/90">提问</span>
              ：指标与业务反馈回到价值探索，校正目标与指标口径
            </span>
          </div>
        </div>
      </section>

      {/* 快速验证 — 黄（输入）→ 蓝（产出） */}
      <section className="rounded-2xl border border-amber-400/25 bg-amber-400/[0.04] p-4 sm:p-5">
        <SectionTitle
          tone="yellow"
          title="快速验证"
          subtitle="自待办分流至多轨执行，再汇总至指标"
        />
        <p className="mb-4 text-[11px] text-muted-foreground sm:text-xs">
          自「待办事项」出发的六条并行路径（黄=执行输入与动作，蓝=可观测产出）。
        </p>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {PATH_COLUMNS.map((col) => (
            <div
              key={col.input}
              className="flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-background/40 p-3"
            >
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                待办 → {col.edgeFromBacklog}
              </p>
              <Node tone="yellow">{col.input}</Node>
              <Edge label={col.midLabel} vertical />
              <Node tone="blue">{col.output}</Node>
              {col.intoMetrics !== "—" ? (
                <Edge label={col.intoMetrics} vertical />
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {/* 指标与决策闭环 — 蓝 */}
      <section className="rounded-2xl border border-blue-600/25 bg-blue-600/[0.05] p-4 sm:p-5">
        <SectionTitle tone="blue" title="指标数据与闭环" subtitle="汇总运行态，反哺待办排序" />
        <div className="flex flex-col items-center gap-6 md:flex-row md:flex-wrap md:justify-center md:gap-8">
          <Node tone="blue" className="max-w-[280px]">
            指标数据
          </Node>
          <div className="flex flex-col items-center gap-1 text-center md:flex-row md:items-center md:gap-3">
            <span className="text-2xl text-blue-600/60 dark:text-blue-400/70 md:rotate-0 md:text-xl">
              →
            </span>
            <div className="text-[11px] font-medium text-muted-foreground md:max-w-[120px]">
              决策：排期 / 取舍 / 资源再分配
            </div>
            <span className="text-2xl text-blue-600/60 dark:text-blue-400/70 md:text-xl">
              →
            </span>
          </div>
          <Node tone="orange" className="max-w-[280px]">
            回到「待办事项」
          </Node>
        </div>
        <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
          运行、授课、辅导转化、参课等多源信号汇入指标层，经决策后更新待办，与上方「价值探索」闭环衔接。
        </p>
      </section>
    </div>
  );
}
