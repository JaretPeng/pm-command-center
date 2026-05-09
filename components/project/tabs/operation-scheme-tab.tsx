"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import type { ProjectDetail } from "@/types/domain";

export function OperationSchemeTab({ project }: { project: ProjectDetail }) {
  const block = project.operationScheme;

  if (!block || (!block.summary && !block.sections?.length)) {
    return (
      <Card className="glass-card p-6">
        <p className="text-sm font-medium">Operation Scheme</p>
        <p className="mt-2 text-sm text-muted-foreground">
          尚未配置运营方案内容。请在{" "}
          <code className="rounded bg-muted px-1">
            data/projects/{project.slug}.json
          </code>{" "}
          中增加 <code className="rounded bg-muted px-1">operationScheme</code>{" "}
          字段（含 summary 与 sections）。
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {block.summary ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass-card p-5">
            <h3 className="text-sm font-semibold">概要</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {block.summary}
            </p>
          </Card>
        </motion.div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {(block.sections ?? []).map((sec, idx) => (
          <motion.div
            key={`${sec.title}-${idx}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
          >
            <Card className="glass-card h-full p-5">
              <h3 className="text-sm font-semibold">{sec.title}</h3>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {sec.content}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
