import type {
  Milestone,
  ProjectDetail,
  ProjectSummary,
  RiskSeverity,
} from "@/types/domain";

export type TimeHorizon = "all" | "month" | "quarter";

export function isInHorizon(isoDate: string, horizon: TimeHorizon): boolean {
  if (horizon === "all") return true;
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return false;
  const now = new Date();
  const start = new Date(now);
  if (horizon === "month") {
    start.setMonth(start.getMonth() - 1);
  } else {
    start.setMonth(start.getMonth() - 3);
  }
  return d >= start && d <= now;
}

export interface DashboardFilters {
  query: string;
  status?: string;
  risk?: RiskSeverity | "any";
  tag?: string;
  horizon: TimeHorizon;
}

function summaryMatchesQuery(p: ProjectSummary, q: string): boolean {
  if (!q.trim()) return true;
  const s = `${p.name} ${p.type} ${p.phase} ${p.owner} ${p.tags.join(" ")}`.toLowerCase();
  return s.includes(q.toLowerCase());
}

export function filterSummaries(
  list: ProjectSummary[],
  f: DashboardFilters,
): ProjectSummary[] {
  return list.filter((p) => {
    if (!summaryMatchesQuery(p, f.query)) return false;
    if (f.status && f.status !== "all" && p.status !== f.status) return false;
    if (f.risk && f.risk !== "any" && p.riskLevel !== f.risk) return false;
    if (f.tag && f.tag !== "all" && !p.tags.includes(f.tag)) return false;
    return true;
  });
}

export function milestonesInHorizon(
  projects: ProjectDetail[],
  horizon: TimeHorizon,
): Milestone[] {
  const out: Milestone[] = [];
  for (const p of projects) {
    for (const m of p.milestones) {
      if (isInHorizon(m.dueDate, horizon)) {
        out.push({
          ...m,
          projectSlug: p.slug,
          projectName: p.name,
        });
      }
    }
  }
  return out.sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  );
}
