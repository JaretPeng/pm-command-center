"use client";

import { AlertTriangle, Clock3, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { projectDetailHref } from "@/config/project-tabs";
import type { ProjectSummary, RiskItem } from "@/types/domain";

export function RiskAlerts({
  summaries,
  risks,
  delayedNotes,
}: {
  summaries: ProjectSummary[];
  risks: { slug: string; projectName: string; items: RiskItem[] }[];
  /** 来自 `index.json`，与 `summaries.delayed` 并列展示 */
  delayedNotes?: string[];
}) {
  const delayed = summaries.filter((s) => s.delayed);
  const riskProjects = summaries.filter(
    (s) => s.riskLevel === "high" || s.riskLevel === "critical",
  );

  const topRisks = risks
    .flatMap((r) => r.items.map((it) => ({ ...it, slug: r.slug, projectName: r.projectName })))
    .filter((x) => x.severity === "high" || x.severity === "critical")
    .slice(0, 6);

  const blockers = summaries.filter((s) => s.blockerCount > 0);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="glass-card p-4">
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-amber-600" />
          <h3 className="text-sm font-semibold">延迟项目</h3>
        </div>
        <div className="mt-3 space-y-2">
          {(delayedNotes ?? []).map((text, i) => (
            <p
              key={`note-${i}`}
              className="rounded-lg border border-amber-500/25 bg-amber-500/[0.06] px-3 py-2 text-sm leading-relaxed text-foreground/90"
            >
              {text}
            </p>
          ))}
          {delayed.map((s) => (
            <Link
              key={s.slug}
              href={projectDetailHref(s.slug)}
              className="block rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm hover:bg-muted/40"
            >
              {s.name}
            </Link>
          ))}
          {delayed.length === 0 && !(delayedNotes && delayedNotes.length) ? (
            <p className="text-xs text-muted-foreground">暂无标记延迟</p>
          ) : null}
        </div>
      </Card>

      <Card className="glass-card p-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-orange-600" />
          <h3 className="text-sm font-semibold">高风险项目</h3>
        </div>
        <div className="mt-3 space-y-2">
          {riskProjects.length === 0 ? (
            <p className="text-xs text-muted-foreground">暂无 High/Critical 项目标记</p>
          ) : (
            riskProjects.map((s) => (
              <Link
                key={s.slug}
                href={projectDetailHref(s.slug)}
                className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm hover:bg-muted/40"
              >
                <span className="truncate">{s.name}</span>
                <Badge variant="outline">{s.riskLevel}</Badge>
              </Link>
            ))
          )}
        </div>
      </Card>

      <Card className="glass-card p-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <h3 className="text-sm font-semibold">Blockers / 待决策</h3>
        </div>
        <div className="mt-3 space-y-2">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Blockers（汇总）</p>
            <div className="mt-2 space-y-2">
              {blockers.length === 0 ? (
                <p className="text-xs text-muted-foreground">暂无 blockers 计数</p>
              ) : (
                blockers.map((s) => (
                  <Link
                    key={s.slug}
                    href={projectDetailHref(s.slug, "milestones")}
                    className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm hover:bg-muted/40"
                  >
                    <span className="truncate">{s.name}</span>
                    <Badge variant="destructive">{s.blockerCount}</Badge>
                  </Link>
                ))
              )}
            </div>
          </div>
          <div className="border-t pt-3">
            <p className="text-xs font-medium text-muted-foreground">高风险事项</p>
            <div className="mt-2 space-y-2">
              {topRisks.length === 0 ? (
                <p className="text-xs text-muted-foreground">暂无</p>
              ) : (
                topRisks.map((r) => (
                  <Link
                    key={r.id}
                    href={projectDetailHref(r.slug)}
                    className="block rounded-lg border bg-muted/15 px-3 py-2 text-xs hover:bg-muted/35"
                  >
                    <span className="font-medium">{r.title}</span>
                    <span className="mt-0.5 block text-muted-foreground">
                      {r.projectName}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
