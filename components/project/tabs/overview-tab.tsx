"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import type { ProjectDetail } from "@/types/domain";
import { StructureDiagram } from "@/components/project/structure-diagram";
import { OverviewVideoSection } from "@/components/project/overview-video";

export function OverviewTab({ project }: { project: ProjectDetail }) {
  const hideDiagram = project.overviewHideStructureDiagram === true;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-2"
      >
        <Card className="glass-card p-5">
          <h3 className="text-sm font-semibold">项目背景</h3>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground sm:leading-7">
            {project.background.map((b, i) => (
              <p key={i} className="whitespace-pre-line">
                {b}
              </p>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="glass-card p-5">
          <h3 className="text-sm font-semibold">项目目标</h3>
          <div className="mt-4 grid gap-3">
            {project.objectives.map((o, i) => (
              <div
                key={i}
                className="rounded-lg border bg-muted/15 p-3 text-sm leading-relaxed"
              >
                <p className="whitespace-pre-line text-foreground/95">{o}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="glass-card p-5">
          <h3 className="text-sm font-semibold">项目成果</h3>
          <div className="mt-4 grid gap-3">
            {project.keyOutcomes.map((o, i) => (
              <div
                key={i}
                className="rounded-lg border border-dashed border-primary/20 bg-primary/[0.04] p-3 text-sm leading-relaxed"
              >
                <p className="whitespace-pre-line text-foreground/95">{o}</p>
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

      {!hideDiagram ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <StructureDiagram structure={project.structure} />
        </motion.div>
      ) : null}
    </div>
  );
}
