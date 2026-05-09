"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ProjectDetail } from "@/types/domain";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const sevClass: Record<string, string> = {
  low: "border-emerald-500/30 bg-emerald-500/10",
  medium: "border-amber-500/30 bg-amber-500/10",
  high: "border-orange-500/30 bg-orange-500/10",
  critical: "border-red-500/30 bg-red-500/10",
};

export function RisksTab({ project }: { project: ProjectDetail }) {
  const counts = project.risks.reduce<Record<string, number>>((acc, r) => {
    acc[r.severity] = (acc[r.severity] ?? 0) + 1;
    return acc;
  }, {});

  const trend = ["low", "medium", "high", "critical"].map((k) => ({
    k,
    n: counts[k] ?? 0,
  }));

  return (
    <div className="space-y-4">
      <Card className="glass-card p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold">风险管理中心</h3>
            <p className="text-xs text-muted-foreground">
              等级 · Owner · 缓解 · 进展
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {trend.map((t) => (
              <Badge key={t.k} variant="outline">
                {t.k}: {t.n}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-4 h-[160px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" />
              <XAxis dataKey="k" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="n"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary) / 0.15)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        {project.risks.map((r, idx) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
          >
            <Card className={`glass-card border p-4 ${sevClass[r.severity]}`}>
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold leading-snug">{r.title}</p>
                <Badge variant="destructive">{r.severity}</Badge>
              </div>
              <Separator className="my-3" />
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">状态：</span>
                  {r.status}
                </p>
                <p>
                  <span className="text-muted-foreground">影响：</span>
                  {r.impact}
                </p>
                <p>
                  <span className="text-muted-foreground">Owner：</span>
                  {r.owner}
                </p>
                <p>
                  <span className="text-muted-foreground">缓解：</span>
                  {r.mitigation}
                </p>
                <p className="text-muted-foreground">
                  <span className="text-foreground">进展：</span>
                  {r.progress}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
