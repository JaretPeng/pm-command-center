"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { TopBar, type TopBarFilterState } from "@/components/layout/top-bar";
import { CommandPalette } from "@/components/layout/command-palette";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { ProjectCard } from "@/components/dashboard/project-card";
import { GlobalTimeline } from "@/components/dashboard/global-timeline";
import { RiskAlerts } from "@/components/dashboard/risk-alerts";
import { ViewModeToggle } from "@/components/dashboard/view-mode-toggle";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  computeHeaderStats,
  computeKpis,
  collectExecutiveSignals,
  collectDeliverySignals,
} from "@/lib/dashboard-stats";
import {
  filterSummaries,
  milestonesInHorizon,
  type DashboardFilters,
} from "@/lib/filters";
import { flattenTags } from "@/lib/search";
import type { ProjectDetail, ProjectSummary } from "@/types/domain";
import { useViewMode } from "@/hooks/use-view-mode";

export function DashboardClient({
  summaries,
  projects,
  pmName,
  pmTitle,
}: {
  summaries: ProjectSummary[];
  projects: ProjectDetail[];
  pmName: string;
  pmTitle: string;
}) {
  const [commandOpen, setCommandOpen] = useState(false);
  const [listQuery, setListQuery] = useState("");
  const { mode, setMode, ready } = useViewMode();

  const tags = useMemo(() => flattenTags(summaries), [summaries]);

  const [filterState, setFilterState] = useState<TopBarFilterState>({
    status: "all",
    risk: "any",
    tag: "all",
    horizon: "all",
  });

  const dashboardFilters: DashboardFilters = useMemo(
    () => ({
      query: listQuery,
      status: filterState.status,
      risk: filterState.risk,
      tag: filterState.tag,
      horizon: filterState.horizon,
    }),
    [filterState, listQuery],
  );

  const filteredSummaries = useMemo(
    () => filterSummaries(summaries, dashboardFilters),
    [summaries, dashboardFilters],
  );

  const filteredProjects = useMemo(() => {
    const slugs = new Set(filteredSummaries.map((s) => s.slug));
    return projects.filter((p) => slugs.has(p.slug));
  }, [projects, filteredSummaries]);

  const headerStats = computeHeaderStats(filteredSummaries);
  const kpis = computeKpis(filteredSummaries, filteredProjects, filterState.horizon);
  const ms = milestonesInHorizon(filteredProjects, filterState.horizon);

  const execSignals = collectExecutiveSignals(filteredProjects);
  const deliverySignals = collectDeliverySignals(filteredProjects);

  const riskBuckets = filteredProjects.map((p) => ({
    slug: p.slug,
    projectName: p.name,
    items: p.risks,
  }));

  return (
    <>
      <CommandPalette
        projects={projects}
        open={commandOpen}
        onOpenChange={setCommandOpen}
      />
      <TopBar
        pmName={pmName}
        title={pmTitle}
        stats={{
          total: headerStats.total,
          active: headerStats.active,
          done: headerStats.done,
          riskProjects: headerStats.riskProjects,
          milestoneOpen: headerStats.milestoneOpen,
        }}
        onOpenCommand={() => setCommandOpen(true)}
        tags={tags}
        filterState={filterState}
        onFilterChange={setFilterState}
      />
      <div className="border-b border-border bg-muted/30 px-4 py-3 sm:px-6">
        <Input
          value={listQuery}
          onChange={(e) => setListQuery(e.target.value)}
          placeholder="筛选项目列表（名称 / 类型 / 标签 / Owner）"
          className="mx-auto max-w-xl"
        />
      </div>
      <main className="mx-auto w-full max-w-[1600px] flex-1 space-y-6 px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              PM 项目总驾驶舱
            </h2>
            <p className="text-sm text-muted-foreground">
              全局经营 · 里程碑聚合 · 风险前置 · 指挥塔视图
            </p>
          </div>
          {ready ? (
            <ViewModeToggle mode={mode} onChange={setMode} />
          ) : (
            <div className="h-9 w-[240px] rounded-lg bg-muted/30" />
          )}
        </div>

        <KpiGrid kpis={kpis} mode={mode} />

        {mode === "executive" ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-4 lg:grid-cols-3"
          >
            {execSignals.slice(0, 3).map((s, idx) => (
              <Card key={`${s.slug}-${idx}`} className="glass-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">{s.project}</p>
                    <p className="mt-1 font-semibold">{s.title}</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {s.description}
                    </p>
                  </div>
                  {s.metric ? (
                    <Badge variant="secondary" className="shrink-0">
                      {s.metric}
                    </Badge>
                  ) : null}
                </div>
              </Card>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-4 lg:grid-cols-2"
          >
            <Card className="glass-card p-4">
              <h3 className="text-sm font-semibold">执行视角 · Blockers</h3>
              <div className="mt-3 space-y-2">
                {deliverySignals.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    当前无阻塞信号（示例数据）
                  </p>
                ) : (
                  deliverySignals.map((d) => (
                    <div
                      key={d.slug}
                      className="rounded-lg border bg-muted/15 px-3 py-2 text-sm"
                    >
                      <span className="font-medium">{d.name}</span>
                      <span className="ml-2 text-muted-foreground">
                        blockers {d.blockers} · at-risk {d.atRisk}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </Card>
            <Card className="glass-card p-4">
              <h3 className="text-sm font-semibold">执行视角 · 本周期里程碑</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                在「{filterState.horizon === "all" ? "全部" : filterState.horizon === "month" ? "近 30 天" : "近 90 天"}」内共{" "}
                <span className="font-medium text-foreground">{ms.length}</span> 个节点
              </p>
            </Card>
          </motion.div>
        )}

        <div>
          <div className="mb-3 flex items-end justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">项目总览</h3>
              <p className="text-xs text-muted-foreground">
                卡片矩阵 · 点击进入项目详情
              </p>
            </div>
            <Badge variant="outline">{filteredSummaries.length} / {summaries.length}</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {filteredSummaries.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i} />
            ))}
          </div>
        </div>

        <GlobalTimeline milestones={ms} />

        <div>
          <h3 className="mb-3 text-sm font-semibold">风险预警</h3>
          <RiskAlerts summaries={filteredSummaries} risks={riskBuckets} />
        </div>
      </main>
    </>
  );
}
