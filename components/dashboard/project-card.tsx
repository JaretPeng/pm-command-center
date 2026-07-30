"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, Calendar, Flag, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { healthLabel, healthBadgeClass } from "@/lib/health";
import { cn } from "@/lib/utils";
import { projectDetailHref } from "@/config/project-tabs";
import type { ProjectSummary } from "@/types/domain";
import { formatDate } from "@/lib/utils";

const riskTone: Record<string, string> = {
  low: "text-emerald-600 dark:text-emerald-400",
  medium: "text-amber-600 dark:text-amber-400",
  high: "text-orange-600 dark:text-orange-400",
  critical: "text-red-600 dark:text-red-400",
};

export function ProjectCard({
  project,
  index,
}: {
  project: ProjectSummary;
  index: number;
}) {
  return (
    <Link href={projectDetailHref(project.slug)} className="block">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.06 }}
      >
        <Card className="glass-card group h-full overflow-hidden p-4 transition-all hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold leading-snug group-hover:text-primary">
                {project.name}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{project.type}</p>
            </div>
            <Badge variant="outline" className={cn("shrink-0", healthBadgeClass(project.health))}>
              {healthLabel(project.health)}
            </Badge>
          </div>

          <div className="mt-4 grid gap-2 text-xs">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{project.status}</Badge>
              <Badge variant="outline">{project.phase}</Badge>
              <span className={cn("inline-flex items-center gap-1 rounded-md border px-2 py-0.5", riskTone[project.riskLevel])}>
                <AlertCircle className="h-3 w-3" />
                {project.riskLevel.toUpperCase()}
              </span>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                {project.owner}
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(project.startDate)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Flag className="h-3.5 w-3.5" />
                里程碑 {project.milestoneCount}
              </span>
            </div>

            {project.blockerCount > 0 ? (
              <p className="text-xs text-amber-700 dark:text-amber-300">
                当前 blockers：{project.blockerCount} 项需关注
              </p>
            ) : null}

            <div className="pt-1">
              <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>完成度</span>
                <span className="font-medium text-foreground">
                  {project.progress}%
                </span>
              </div>
              <Progress value={project.progress} />
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-muted/60 px-2 py-0.5 text-[11px] text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}
