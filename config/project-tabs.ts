/** 项目详情页 Tab：与 URL `?tab=` 一一对应；旧 Tab `risks` / `metrics` 已并入 Overview，收到旧链接时回落到 overview */

export const PROJECT_TAB_LIST = [
  { id: "overview", label: "Overview" },
  { id: "milestones", label: "Milestones" },
  { id: "timeline", label: "Timeline" },
  { id: "team", label: "Team" },
  { id: "operation-scheme", label: "Operation Scheme" },
  { id: "documents", label: "Documents" },
  { id: "retrospective", label: "Retrospective" },
] as const;

export type ProjectTabId = (typeof PROJECT_TAB_LIST)[number]["id"];

const TAB_IDS = new Set<string>(PROJECT_TAB_LIST.map((t) => t.id));

const LEGACY_TAB_FALLBACK_TO_OVERVIEW = new Set(["risks", "metrics"]);

export function isProjectTabId(v: string): v is ProjectTabId {
  return TAB_IDS.has(v);
}

export function resolveProjectTabParam(raw: string | null): ProjectTabId {
  const v = raw ?? "overview";
  if (LEGACY_TAB_FALLBACK_TO_OVERVIEW.has(v)) return "overview";
  return isProjectTabId(v) ? v : "overview";
}

/** 项目详情 URL；Overview 省略 `?tab=`，其余 Tab 带 query */
export function projectDetailHref(
  slug: string,
  tab: ProjectTabId = "overview",
): string {
  if (tab === "overview") return `/projects/${slug}`;
  return `/projects/${slug}?tab=${encodeURIComponent(tab)}`;
}
