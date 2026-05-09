"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import type { ProjectDetail } from "@/types/domain";
import { StructureDiagram } from "@/components/project/structure-diagram";
import { OverviewVideoSection } from "@/components/project/overview-video";

export function OverviewTab({ project }: { project: ProjectDetail }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="glass-card p-5">
          <h3 className="text-sm font-semibold">项目背景</h3>
          <div className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
            {project.background.map((b) => (
              <p key={b}>{b}</p>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="glass-card p-5">
          <h3 className="text-sm font-semibold">战略目标可视化</h3>
          <div className="mt-4 grid gap-3">
            {project.objectives.map((o, i) => (
              <div
                key={o}
                className="flex items-start gap-3 rounded-lg border bg-muted/15 p-3"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed">{o}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {project.overviewVideo ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <OverviewVideoSection block={project.overviewVideo} />
        </motion.div>
      ) : null}

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-2"
      >
        <Card className="glass-card p-5">
          <h3 className="text-sm font-semibold">ROI / 战略价值</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {project.valueProps.map((v) => (
              <div
                key={v.title}
                className="rounded-xl border bg-gradient-to-br from-primary/10 via-transparent to-sky-500/10 p-4"
              >
                <p className="font-semibold">{v.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{v.description}</p>
                {v.metric ? (
                  <p className="mt-3 text-xs font-medium text-primary">{v.metric}</p>
                ) : null}
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-2"
      >
        <StructureDiagram structure={project.structure} />
      </motion.div>
    </div>
  );
}
