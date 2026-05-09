"use client";

import { GanttChart } from "@/components/gantt/gantt-chart";
import { TimelineEmbedSection } from "@/components/project/timeline-embed";
import type { ProjectDetail } from "@/types/domain";
import { Separator } from "@/components/ui/separator";

export function TimelineTab({ project }: { project: ProjectDetail }) {
  const embed = project.timelineEmbed;
  const showEmbed = Boolean(embed?.embedUrl?.trim());
  const hideBuiltIn = embed?.hideBuiltInGantt === true;

  return (
    <div className="space-y-6">
      {showEmbed && embed ? <TimelineEmbedSection block={embed} /> : null}

      {!hideBuiltIn ? (
        <>
          {showEmbed ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="shrink-0 text-xs font-medium text-muted-foreground">
                  页面内甘特（JSON 数据）
                </span>
                <Separator className="flex-1" />
              </div>
              <p className="text-xs text-muted-foreground">
                与石墨并存的兜底视图；更新{" "}
                <code className="rounded bg-muted px-1">gantt</code> 字段即可改这里。
              </p>
            </div>
          ) : null}
          <GanttChart items={project.gantt} />
        </>
      ) : null}
    </div>
  );
}
