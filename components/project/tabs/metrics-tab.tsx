"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ProjectDetail } from "@/types/domain";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(199 89% 48%)",
  "hsl(280 70% 55%)",
  "hsl(38 92% 50%)",
];

export function MetricsTab({ project }: { project: ProjectDetail }) {
  const s0 = project.metrics.series[0]?.data ?? [];
  const s1 = project.metrics.series[1]?.data ?? [];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        {project.metrics.kpis.map((k, idx) => (
          <motion.div
            key={k.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
          >
            <Card className="glass-card p-4">
              <p className="text-xs text-muted-foreground">{k.label}</p>
              <p className="mt-2 text-2xl font-semibold">{k.value}</p>
              {k.change ? (
                <Badge variant="secondary" className="mt-2">
                  {k.change}
                </Badge>
              ) : null}
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="glass-card p-4">
          <p className="text-sm font-semibold">{project.metrics.series[0]?.name}</p>
          <div className="mt-3 h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={s0}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass-card p-4">
          <p className="text-sm font-semibold">{project.metrics.series[1]?.name}</p>
          <div className="mt-3 h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={s1}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(199 89% 48% / 0.8)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass-card p-4 lg:col-span-2">
          <p className="text-sm font-semibold">{project.metrics.series[2]?.name}</p>
          <div className="mt-3 h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={project.metrics.series[2]?.data ?? []}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(280 70% 55%)"
                  fill="hsl(280 70% 55% / 0.15)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass-card p-4 lg:col-span-2">
          <p className="text-sm font-semibold">KPI 占比（示意）</p>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={project.metrics.kpis.map((k, i) => ({
                      name: k.label,
                      value: i + 1,
                    }))}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {project.metrics.kpis.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                图表为示意性占比映射（数据为演示用途）。后续接入数据库时可替换为真实口径与维度切片。
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
