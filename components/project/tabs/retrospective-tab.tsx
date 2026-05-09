"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ProjectDetail } from "@/types/domain";
import { formatDate } from "@/lib/utils";
import { FishboneDiagram } from "@/components/project/fishbone";

export function RetrospectiveTab({ project }: { project: ProjectDetail }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {project.retrospectives.map((r, idx) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
          >
            <Card className="glass-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{r.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(r.date)}
                  </p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    问题背景
                  </p>
                  <p className="mt-2 text-sm leading-relaxed">{r.context}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    Root Cause
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                    {r.rootCause.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs font-semibold text-muted-foreground">
                    影响分析
                  </p>
                  <p className="mt-2 text-sm leading-relaxed">{r.impact}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    解决方案
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                    {r.actions.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    经验沉淀
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                    {r.lessons.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
                {r.followUp ? (
                  <div className="md:col-span-2 rounded-lg border bg-muted/15 p-3 text-sm">
                    <span className="font-medium">后续优化：</span>
                    {r.followUp}
                  </div>
                ) : null}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {project.deepDive ? (
        <div className="space-y-4">
          <Card className="glass-card p-5">
            <p className="text-sm font-semibold">专业复盘案例 · RCA</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Timeline · 文本 · 鱼骨图
            </p>
            <div className="mt-4 space-y-3 text-sm leading-relaxed">
              <p className="font-medium">{project.deepDive.title}</p>
              <p className="text-muted-foreground">
                {project.deepDive.problemBackground}
              </p>
              <div className="rounded-lg border bg-muted/10 p-3">
                <p className="text-xs font-semibold text-muted-foreground">
                  Root Cause 摘要
                </p>
                <p className="mt-2">{project.deepDive.rootCauseSummary}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  Timeline
                </p>
                <div className="mt-2 space-y-2">
                  {project.deepDive.timeline.map((t) => (
                    <div
                      key={t.date}
                      className="flex gap-3 rounded-lg border px-3 py-2"
                    >
                      <span className="w-28 shrink-0 text-xs text-muted-foreground">
                        {formatDate(t.date)}
                      </span>
                      <span className="text-sm">{t.event}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  解决方案
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {project.deepDive.solution.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
              {project.deepDive.metrics?.length ? (
                <div className="flex flex-wrap gap-2">
                  {project.deepDive.metrics.map((m) => (
                    <span
                      key={m}
                      className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </Card>

          <FishboneDiagram dive={project.deepDive} />
        </div>
      ) : null}
    </div>
  );
}
