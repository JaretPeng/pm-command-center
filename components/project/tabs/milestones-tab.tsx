"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MilestoneStatus, ProjectDetail } from "@/types/domain";
import { formatDate } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export function MilestonesTab({ project }: { project: ProjectDetail }) {
  const [filter, setFilter] = useState<"all" | MilestoneStatus>("all");
  const [sort, setSort] = useState<"due" | "risk">("due");
  const [openId, setOpenId] = useState<string | null>(null);

  const rows = useMemo(() => {
    let ms = [...project.milestones];
    if (filter !== "all") ms = ms.filter((m) => m.status === filter);
    ms.sort((a, b) => {
      if (sort === "due") {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      const rank: Record<string, number> = {
        critical: 4,
        high: 3,
        medium: 2,
        low: 1,
      };
      const ar = a.risk ? rank[a.risk] ?? 0 : 0;
      const br = b.risk ? rank[b.risk] ?? 0 : 0;
      return br - ar;
    });
    return ms;
  }, [project.milestones, filter, sort]);

  return (
    <Card className="glass-card p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold">里程碑系统</h3>
          <p className="text-xs text-muted-foreground">
            过滤 · 排序 · 展开详情
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            value={filter}
            onValueChange={(v) => setFilter(v as typeof filter)}
          >
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="planned">planned</SelectItem>
              <SelectItem value="in_progress">in_progress</SelectItem>
              <SelectItem value="done">done</SelectItem>
              <SelectItem value="at_risk">at_risk</SelectItem>
              <SelectItem value="delayed">delayed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue placeholder="排序" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="due">按时间</SelectItem>
              <SelectItem value="risk">按风险</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="relative mt-6 space-y-3 border-l border-border/80 pl-6">
        {rows.map((m, idx) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="relative"
          >
            <span className="absolute -left-[29px] top-3 h-3 w-3 rounded-full bg-primary shadow-[0_0_0_4px_hsl(var(--background))]" />
            <div className="rounded-xl border bg-muted/10 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium leading-snug">{m.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(m.dueDate)} · {m.owner}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{m.status}</Badge>
                  {m.risk ? (
                    <Badge variant="destructive">{m.risk}</Badge>
                  ) : (
                    <Badge variant="secondary">risk N/A</Badge>
                  )}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {m.modules.map((mod) => (
                  <span
                    key={mod}
                    className="rounded-md bg-background px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    {mod}
                  </span>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 h-8 px-2 text-xs"
                onClick={() => setOpenId(openId === m.id ? null : m.id)}
              >
                详情
                <ChevronDown
                  className={`ml-1 h-3 w-3 transition-transform ${
                    openId === m.id ? "rotate-180" : ""
                  }`}
                />
              </Button>
              <AnimatePresence>
                {openId === m.id ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                      {m.description ?? "暂无描述"}
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
