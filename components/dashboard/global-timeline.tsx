"use client";

import { motion } from "framer-motion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Milestone } from "@/types/domain";
import { cn } from "@/lib/utils";

const statusStyle: Record<string, string> = {
  done: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200",
  in_progress: "bg-sky-500/15 text-sky-900 dark:text-sky-100",
  planned: "bg-zinc-500/10 text-zinc-700 dark:text-zinc-200",
  at_risk: "bg-amber-500/15 text-amber-900 dark:text-amber-100",
  delayed: "bg-red-500/15 text-red-900 dark:text-red-100",
};

export function GlobalTimeline({
  milestones,
}: {
  milestones: (Milestone & { projectName?: string })[];
}) {
  return (
    <div className="glass-card rounded-xl border p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">多项目时间轴</h3>
          <p className="text-xs text-muted-foreground">
            聚合里程碑 · 横向浏览关键节点
          </p>
        </div>
        <Badge variant="outline">{milestones.length} 个节点</Badge>
      </div>
      <ScrollArea className="mt-4 w-full whitespace-nowrap">
        <div className="flex gap-3 pb-2">
          {milestones.map((m, i) => (
            <motion.div
              key={`${m.id}-${i}`}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass-card inline-flex min-w-[240px] flex-col rounded-xl border p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="line-clamp-2 text-sm font-medium leading-snug">
                  {m.name}
                </p>
                <Badge
                  className={cn(
                    "shrink-0",
                    statusStyle[m.status] ?? "bg-muted text-foreground",
                  )}
                >
                  {m.status}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {m.projectName ?? "项目"} · {formatDate(m.dueDate)}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Owner · {m.owner}
              </p>
            </motion.div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
