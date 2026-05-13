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

/**
 * A 线：仅在侧栏「项目总览」（URL 无 `?nav=`）时隐藏顶栏 Timeline；
 * 「现行项目 / 已完结项目」等带子 `nav` 的入口仍显示完整 Tab（含 Timeline）。
 */
function hideTimelineTabOnALineOverview(slug: string, nav: string | null): boolean {
  if (slug !== "a-line") return false;
  return nav == null || nav === "";
}

export function projectTabsForSlug(slug: string, nav: string | null) {
  if (hideTimelineTabOnALineOverview(slug, nav)) {
    return PROJECT_TAB_LIST.filter((t) => t.id !== "timeline");
  }
  return PROJECT_TAB_LIST;
}

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

/** A 线项目总览（无 nav）下将 `?tab=timeline` 视为 Overview；带子 nav 时保留 Timeline */
export function resolveProjectTabForSlug(
  slug: string,
  nav: string | null,
  raw: string | null,
): ProjectTabId {
  const t = resolveProjectTabParam(raw);
  if (hideTimelineTabOnALineOverview(slug, nav) && t === "timeline") return "overview";
  return t;
}

/** 项目详情 URL；Overview 省略 `?tab=`，其余 Tab 带 query */
export function projectDetailHref(
  slug: string,
  tab: ProjectTabId = "overview",
): string {
  if (tab === "overview") return `/projects/${slug}`;
  return `/projects/${slug}?tab=${encodeURIComponent(tab)}`;
}
