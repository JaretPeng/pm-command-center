"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { healthLabel, healthBadgeClass } from "@/lib/health";
import { cn } from "@/lib/utils";
import type { ProjectDetail } from "@/types/domain";
import { formatDate } from "@/lib/utils";
import { AlertTriangle, CalendarRange, Flag, Target } from "lucide-react";
import { HeroCurriculumStripBlock } from "@/components/project/hero-curriculum-strip";

export function ProjectHero({ project }: { project: ProjectDetail }) {
  /** Recharts 在 SSR / React 19 下易触发测量与 react-is 相关错误，首屏仅在客户端挂载后再渲染图表 */
  const [chartsMounted, setChartsMounted] = useState(false);
  useEffect(() => {
    setChartsMounted(true);
  }, []);

  const dynamics = project.heroDynamics;
  const pie = [
    { name: "完成", value: project.progress },
    { name: "剩余", value: Math.max(0, 100 - project.progress) },
  ];
  const COLORS = ["hsl(var(--primary))", "hsl(var(--muted))"];

  const risks = project.risks ?? [];
  const riskOpen = risks.filter(
    (r) => r.severity === "high" || r.severity === "critical",
  ).length;

  const dynamicsPie =
    dynamics != null
      ? [
          { name: "进行中", value: dynamics.inProgress, fill: "hsl(24 95% 48%)" },
          { name: "已完结", value: dynamics.completed, fill: "hsl(220 9% 46%)" },
          { name: "待启动", value: dynamics.pending, fill: "hsl(221 83% 53%)" },
        ]
      : [];
  const dynamicsTotal = dynamicsPie.reduce((s, d) => s + d.value, 0);
  const dynamicsChartData =
    dynamicsTotal > 0
      ? dynamicsPie
      : [{ name: "暂无", value: 1, fill: "hsl(220 13% 85%)" }];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-4 lg:grid-cols-[3fr_1fr]"
    >
      <Card className="glass-card gradient-border relative w-full min-w-0 overflow-hidden p-5 sm:p-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-semibold tracking-tight leading-snug text-[calc(1.5rem*0.9)]">
              {project.name}
            </h1>
            <Badge>{project.status}</Badge>
            <Badge variant="outline">{project.phase}</Badge>
            <Badge variant="outline" className={healthBadgeClass(project.health)}>
              {healthLabel(project.health)}
            </Badge>
          </div>
          {project.heroNarrative && project.heroNarrative.length > 0 ? (
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem] sm:leading-7">
              {project.heroNarrative.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          ) : null}
          {project.heroCurriculumStrip ? (
            <HeroCurriculumStripBlock strip={project.heroCurriculumStrip} />
          ) : null}
          {!(project.heroNarrative && project.heroNarrative.length > 0) ? (
            <>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {project.executiveSummary}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border bg-muted/20 p-3">
                  <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Target className="h-3.5 w-3.5" />
                    项目目标
                  </p>
                  <ul className="mt-2 space-y-1 text-sm">
                    {(project.objectives ?? []).slice(0, 3).map((o) => (
                      <li key={o}>· {o}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border bg-muted/20 p-3">
                  <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Flag className="h-3.5 w-3.5" />
                    关键成果
                  </p>
                  <ul className="mt-2 space-y-1 text-sm">
                    {(project.keyOutcomes ?? []).slice(0, 3).map((o) => (
                      <li key={o}>· {o}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
            {project.heroDateCaption?.trim() ? (
              <span className="inline-flex items-center gap-1">
                <CalendarRange className="h-3.5 w-3.5" />
                {project.heroDateCaption.trim()}
              </span>
            ) : (
              <>
                <span className="inline-flex items-center gap-1">
                  <CalendarRange className="h-3.5 w-3.5" />
                  {formatDate(project.startDate)}
                  {project.endDate ? ` — ${formatDate(project.endDate)}` : ""}
                </span>
                <span>负责人 · {project.owner}</span>
                {project.version ? <span>版本 · {project.version}</span> : null}
                <span
                  className={cn(
                    "inline-flex items-center gap-1",
                    project.riskLevel === "high" || project.riskLevel === "critical"
                      ? "text-red-600"
                      : "",
                  )}
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  风险 · {project.riskLevel.toUpperCase()}
                </span>
              </>
            )}
          </div>
        </div>
      </Card>

      <Card className="glass-card min-w-0 w-full p-4">
        {dynamics ? (
          <>
            <p className="text-sm font-semibold">项目动态</p>
            <div className="relative mt-2 h-[200px] w-full">
              {chartsMounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dynamicsChartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={52}
                      outerRadius={76}
                      paddingAngle={dynamicsTotal > 0 ? 2 : 0}
                      stroke="none"
                    >
                      {dynamicsChartData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <RTooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div
                  className="h-full w-full rounded-md bg-muted/40"
                  aria-hidden
                />
              )}
              {dynamicsTotal > 0 ? (
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                  <p className="text-2xl font-semibold tabular-nums leading-none">{dynamicsTotal}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">项目合计</p>
                </div>
              ) : (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <p className="text-xs text-muted-foreground">暂无分布数据</p>
                </div>
              )}
            </div>
            <div className="mt-1 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: "hsl(24 95% 48%)" }}
                />
                进行中
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: "hsl(220 9% 46%)" }}
                />
                已完结
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: "hsl(221 83% 53%)" }}
                />
                待启动
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-3 border-t pt-3 text-center text-xs">
              <div>
                <p className="text-muted-foreground">进行中项目</p>
                <p className="text-lg font-semibold tabular-nums text-orange-600 dark:text-orange-400">
                  {dynamics.inProgress}
                  <span className="text-xs font-normal text-muted-foreground">个</span>
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">已完结项目</p>
                <p className="text-lg font-semibold tabular-nums text-muted-foreground">
                  {dynamics.completed}
                  <span className="text-xs font-normal text-muted-foreground">个</span>
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">待启动项目</p>
                <p className="text-lg font-semibold tabular-nums text-blue-600 dark:text-blue-400">
                  {dynamics.pending}
                  <span className="text-xs font-normal text-muted-foreground">个</span>
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">项目风险</p>
                <p
                  className={cn(
                    "text-lg font-semibold tabular-nums",
                    dynamics.risk > 0 ? "text-amber-600 dark:text-amber-400" : "",
                  )}
                >
                  {dynamics.risk}
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold">完成度</p>
            <div className="mt-2 h-[200px] w-full">
              {chartsMounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pie}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={52}
                      outerRadius={76}
                      paddingAngle={2}
                    >
                      {pie.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <RTooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div
                  className="h-full w-full rounded-md bg-muted/40"
                  aria-hidden
                />
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 border-t pt-3 text-center text-xs">
              <div>
                <p className="text-muted-foreground">完成</p>
                <p className="text-lg font-semibold">{project.progress}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">里程碑</p>
                <p className="text-lg font-semibold">{project.milestoneCount}</p>
              </div>
              <div>
                <p className="text-muted-foreground">风险</p>
                <p className="text-lg font-semibold">{riskOpen}</p>
              </div>
            </div>
          </>
        )}
      </Card>
    </motion.div>
  );
}
