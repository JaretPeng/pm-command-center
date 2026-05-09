import type { ProjectDetail, ProjectSummary } from "@/types/domain";
import { milestonesInHorizon, type TimeHorizon } from "@/lib/filters";

export function aggregateDocuments(projects: ProjectDetail[]): number {
  return projects.reduce((acc, p) => acc + p.documents.length, 0);
}

export function aggregateCollaborators(projects: ProjectDetail[]): number {
  return projects.reduce(
    (acc, p) => acc + (p.collaborators ?? p.team.length),
    0,
  );
}

export function countRiskItems(projects: ProjectDetail[]): number {
  return projects.reduce((acc, p) => acc + p.risks.length, 0);
}

export function computeHeaderStats(summaries: ProjectSummary[]) {
  const total = summaries.length;
  const active = summaries.filter((s) => s.status === "进行中").length;
  const done = summaries.filter((s) => s.status === "已完成").length;
  const riskProjects = summaries.filter(
    (s) => s.riskLevel === "high" || s.riskLevel === "critical",
  ).length;
  const milestoneOpen = summaries.reduce((a, s) => a + s.milestoneCount, 0);
  return { total, active, done, riskProjects, milestoneOpen };
}

export function computeKpis(
  summaries: ProjectSummary[],
  projects: ProjectDetail[],
  horizon: TimeHorizon,
) {
  const delayed = summaries.filter((s) => s.delayed).length;
  const highPriority = summaries.filter((s) => s.highPriority).length;
  const monthlyMilestones = milestonesInHorizon(projects, horizon).length;
  const docs = aggregateDocuments(projects);
  const people = aggregateCollaborators(projects);
  const riskItems = countRiskItems(projects);

  return {
    total: summaries.length,
    active: summaries.filter((s) => s.status === "进行中").length,
    delayed,
    highPriority,
    riskItems,
    monthlyMilestones,
    docs,
    people,
  };
}

export function collectExecutiveSignals(projects: ProjectDetail[]) {
  return projects.flatMap((p) =>
    p.valueProps.slice(0, 2).map((v) => ({
      project: p.name,
      slug: p.slug,
      title: v.title,
      description: v.description,
      metric: v.metric,
    })),
  );
}

export function collectDeliverySignals(projects: ProjectDetail[]) {
  return projects.flatMap((p) =>
    p.blockerCount > 0 || p.milestones.some((m) => m.status === "at_risk")
      ? [
          {
            slug: p.slug,
            name: p.name,
            blockers: p.blockerCount,
            atRisk: p.milestones.filter((m) => m.status === "at_risk").length,
          },
        ]
      : [],
  );
}
