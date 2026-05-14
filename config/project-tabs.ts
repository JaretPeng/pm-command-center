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

/** A 线「A线手册制作」子项目：不展示运营方案与复盘 Tab */
function hideOperationAndRetrospectiveForALineManual(
  slug: string,
  nav: string | null,
): boolean {
  return slug === "a-line" && nav === "a-line-manual";
}

/** A 线「A4/A5/A8 课程制作」子项目：仅保留 Milestones / Timeline / Team */
const A_LINE_COURSE_TRACK_NAVS = new Set(["a4-course", "a5-course", "a8-course"]);

const A_LINE_COURSE_TRACK_HIDDEN_TABS = new Set<ProjectTabId>([
  "overview",
  "documents",
  "operation-scheme",
  "retrospective",
]);

function hideTabsForALineCourseTrackNav(slug: string, nav: string | null): boolean {
  return slug === "a-line" && nav != null && A_LINE_COURSE_TRACK_NAVS.has(nav);
}

/** C 线「项目总览」：`/projects/c3-v6` 无 `nav` 时为总览态 */
function isC3V6ProjectOverview(slug: string, nav: string | null): boolean {
  if (slug !== "c3-v6") return false;
  return (nav?.trim() ?? "").length === 0;
}

export function projectTabsForSlug(slug: string, nav: string | null) {
  let tabs = [...PROJECT_TAB_LIST];
  if (hideOperationAndRetrospectiveForALineManual(slug, nav)) {
    tabs = tabs.filter(
      (t) => t.id !== "operation-scheme" && t.id !== "retrospective",
    );
  }
  if (hideTabsForALineCourseTrackNav(slug, nav)) {
    tabs = tabs.filter((t) => !A_LINE_COURSE_TRACK_HIDDEN_TABS.has(t.id));
  }
  if (isC3V6ProjectOverview(slug, nav)) {
    tabs = tabs.filter((t) => t.id !== "timeline" && t.id !== "documents");
  }
  return tabs;
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

/** 解析 URL `tab=`；非法或本页已隐藏的 Tab 回落到可用 Tab */
export function resolveProjectTabForSlug(
  slug: string,
  nav: string | null,
  raw: string | null,
): ProjectTabId {
  const t = resolveProjectTabParam(raw);
  if (hideTabsForALineCourseTrackNav(slug, nav) && A_LINE_COURSE_TRACK_HIDDEN_TABS.has(t)) {
    return "milestones";
  }
  if (isC3V6ProjectOverview(slug, nav) && (t === "timeline" || t === "documents")) {
    return "overview";
  }
  if (
    hideOperationAndRetrospectiveForALineManual(slug, nav) &&
    (t === "operation-scheme" || t === "retrospective")
  ) {
    return "overview";
  }
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
