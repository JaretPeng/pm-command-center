"use client";

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

export function ProjectHero({ project }: { project: ProjectDetail }) {
  const pie = [
    { name: "完成", value: project.progress },
    { name: "剩余", value: Math.max(0, 100 - project.progress) },
  ];
  const COLORS = ["hsl(var(--primary))", "hsl(var(--muted))"];

  const riskOpen = project.risks.filter(
    (r) => r.severity === "high" || r.severity === "critical",
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-4 lg:grid-cols-[1fr_320px]"
    >
      <Card className="glass-card gradient-border relative overflow-hidden p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {project.name}
              </h1>
              <Badge>{project.status}</Badge>
              <Badge variant="outline">{project.phase}</Badge>
              <Badge variant="outline" className={healthBadgeClass(project.health)}>
                {healthLabel(project.health)}
              </Badge>
            </div>
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
                  {project.objectives.slice(0, 3).map((o) => (
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
                  {project.keyOutcomes.slice(0, 3).map((o) => (
                    <li key={o}>· {o}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <CalendarRange className="h-3.5 w-3.5" />
                {formatDate(project.startDate)}
                {project.endDate ? ` — ${formatDate(project.endDate)}` : ""}
              </span>
              <span>负责人 · {project.owner}</span>
              {project.version ? <span>版本 · {project.version}</span> : null}
              <span className={cn("inline-flex items-center gap-1", project.riskLevel === "high" || project.riskLevel === "critical" ? "text-red-600" : "")}>
                <AlertTriangle className="h-3.5 w-3.5" />
                风险 · {project.riskLevel.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="glass-card p-4">
        <p className="text-sm font-semibold">完成度</p>
        <div className="mt-2 h-[200px] w-full">
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
      </Card>
    </motion.div>
  );
}
