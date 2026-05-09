"use client";

import { motion } from "framer-motion";
import { Activity, AlertTriangle, BookOpen, Crown, Gauge, Layers, Timer, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { cn } from "@/lib/utils";

type Kpi = {
  label: string;
  value: number;
  hint?: string;
  icon: React.ElementType;
  accent?: string;
};

export function KpiGrid({
  kpis,
  mode,
}: {
  kpis: {
    total: number;
    active: number;
    delayed: number;
    highPriority: number;
    riskItems: number;
    monthlyMilestones: number;
    docs: number;
    people: number;
  };
  mode: "executive" | "delivery";
}) {
  const items: Kpi[] = [
    {
      label: "项目总数",
      value: kpis.total,
      icon: Layers,
      accent: "from-sky-500/12 to-blue-600/10",
    },
    {
      label: "进行中",
      value: kpis.active,
      icon: Activity,
      accent: "from-sky-500/15 to-blue-500/10",
    },
    {
      label: "延迟项目",
      value: kpis.delayed,
      icon: Timer,
      accent: "from-amber-500/15 to-orange-500/10",
    },
    {
      label: "高优先级",
      value: kpis.highPriority,
      icon: Crown,
      accent: "from-blue-500/12 to-sky-500/10",
    },
    {
      label: "当前风险项",
      value: kpis.riskItems,
      icon: AlertTriangle,
      accent: "from-red-500/15 to-orange-500/10",
    },
    {
      label: "周期内里程碑",
      value: kpis.monthlyMilestones,
      icon: Gauge,
      accent: "from-emerald-500/15 to-teal-500/10",
    },
    {
      label: "文档总数",
      value: kpis.docs,
      icon: BookOpen,
      accent: "from-zinc-500/10 to-zinc-500/5",
    },
    {
      label: "协同人数（估）",
      value: kpis.people,
      icon: Users,
      accent: "from-slate-400/15 to-slate-500/10",
    },
  ];

  const priority =
    mode === "delivery"
      ? ["延迟项目", "当前风险项", "周期内里程碑", "进行中", "高优先级"]
      : ["项目总数", "进行中", "高优先级", "文档总数"];
  const order =
    mode === "delivery"
      ? [
          ...priority
            .map((lab) => items.find((i) => i.label === lab))
            .filter(Boolean) as Kpi[],
          ...items.filter((i) => !priority.includes(i.label)),
        ]
      : items;

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {order.map((k, idx) => (
        <motion.div
          key={k.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.04 }}
        >
          <Card
            className={cn(
              "glass-card gradient-border relative overflow-hidden p-4 transition-[transform,box-shadow] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.35)]",
            )}
          >
            <div
              className={cn(
                "pointer-events-none absolute inset-0 opacity-70",
                "bg-gradient-to-br",
                k.accent,
              )}
            />
            <div className="relative flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  {k.label}
                </p>
                <div className="mt-2 text-3xl font-semibold tracking-tight">
                  <AnimatedNumber value={k.value} />
                </div>
                {k.hint ? (
                  <p className="mt-1 text-xs text-muted-foreground">{k.hint}</p>
                ) : null}
              </div>
              <div className="rounded-lg bg-background/60 p-2 shadow-inner">
                <k.icon className="h-4 w-4 text-primary" />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
