import type { ProjectDetail, ProjectSummary } from "@/types/domain";

export type SearchHit =
  | { type: "project"; slug: string; title: string; subtitle: string }
  | { type: "doc"; slug: string; title: string; subtitle: string };

export function searchEverything(
  projects: ProjectDetail[],
  query: string,
): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hits: SearchHit[] = [];

  for (const p of projects) {
    const blob = `${p.name} ${p.executiveSummary} ${p.tags.join(" ")}`.toLowerCase();
    if (blob.includes(q)) {
      hits.push({
        type: "project",
        slug: p.slug,
        title: p.name,
        subtitle: p.phase,
      });
    }
    for (const d of p.documents) {
      const dblob = `${d.title} ${d.excerpt ?? ""} ${(d.tags ?? []).join(" ")} ${d.department ?? ""}`.toLowerCase();
      if (dblob.includes(q)) {
        hits.push({
          type: "doc",
          slug: p.slug,
          title: d.title,
          subtitle: `${p.name} · 文档`,
        });
      }
    }
  }

  const seen = new Set<string>();
  return hits.filter((h) => {
    const key = `${h.type}:${h.slug}:${h.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function flattenTags(summaries: ProjectSummary[]): string[] {
  const s = new Set<string>();
  for (const p of summaries) p.tags.forEach((t) => s.add(t));
  return Array.from(s).sort();
}
