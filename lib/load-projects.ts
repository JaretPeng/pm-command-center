import "server-only";

import { promises as fs } from "fs";
import path from "path";
import type {
  DocumentItem,
  MetricSeries,
  Milestone,
  ProjectDetail,
  ProjectIndexFile,
  ProjectSummary,
  RetrospectiveItem,
  RiskItem,
  TeamMember,
} from "@/types/domain";

const DATA_DIR = path.join(process.cwd(), "data", "projects");

/** 路由与文件名中的 slug：禁止 `../` 等穿越路径 */
const PROJECT_SLUG_RE = /^[a-zA-Z0-9_-]{1,128}$/;

export function isSafeProjectSlug(slug: unknown): slug is string {
  return typeof slug === "string" && PROJECT_SLUG_RE.test(slug);
}

function isProjectDetailRecord(
  parsed: unknown,
  expectedSlug: string,
): parsed is ProjectDetail {
  if (
    parsed === null ||
    typeof parsed !== "object" ||
    Array.isArray(parsed)
  ) {
    return false;
  }
  const slug = (parsed as { slug?: unknown }).slug;
  return typeof slug === "string" && slug === expectedSlug;
}

function asArray<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function asStringArray(v: unknown): string[] {
  return Array.isArray(v)
    ? (v.filter((x) => typeof x === "string") as string[])
    : [];
}

/** 归一化 JSON：任意列表字段为 null/缺失时，避免 Tab SSR 上 `.map` / `.reduce` 抛错 → Internal Server Error */
function normalizeProjectDetail(raw: ProjectDetail): ProjectDetail {
  const p: ProjectDetail = { ...raw };
  p.tags = asStringArray(p.tags);
  p.retrospectives = asArray(p.retrospectives).map((raw) => {
    const item = raw as Record<string, unknown>;
    const st = item.supplementTables;
    const tables = Array.isArray(st)
      ? st
          .filter((x) => x != null && typeof x === "object" && !Array.isArray(x))
          .map((tb) => {
            const t = tb as Record<string, unknown>;
            const cols = asStringArray(t.columns);
            const rowsRaw = t.rows;
            const rows = Array.isArray(rowsRaw)
              ? rowsRaw
                  .filter((row) => Array.isArray(row))
                  .map((row) => asStringArray(row as unknown[]))
              : [];
            return {
              title: typeof t.title === "string" ? t.title : "",
              columns: cols,
              rows,
              footnote:
                typeof t.footnote === "string" ? t.footnote : undefined,
            };
          })
      : undefined;
    return {
      ...(item as object),
      supplementTables: tables?.length ? tables : undefined,
    } as RetrospectiveItem;
  });
  p.background = asStringArray(p.background);
  p.objectives = asStringArray(p.objectives);
  p.keyOutcomes = asStringArray(p.keyOutcomes);
  p.documents = asArray(p.documents);
  p.risks = asArray(p.risks);
  p.milestones = asArray<Milestone>(p.milestones).map((m) => ({
    ...m,
    modules: asStringArray(m.modules),
  }));
  p.gantt = asArray(p.gantt);
  p.team = asArray<TeamMember>(p.team).map((m) => ({
    ...m,
    modules: asStringArray(m.modules),
    deliverables: asStringArray(m.deliverables),
  }));
  p.valueProps = asArray(p.valueProps);
  if (p.heroNarrative != null && !Array.isArray(p.heroNarrative)) {
    delete (p as { heroNarrative?: unknown }).heroNarrative;
  }
  if (p.heroCurriculumStrip && typeof p.heroCurriculumStrip === "object") {
    p.heroCurriculumStrip = {
      ...p.heroCurriculumStrip,
      modules: asArray(p.heroCurriculumStrip.modules),
    };
  }
  const m = p.metrics;
  if (m && typeof m === "object" && !Array.isArray(m)) {
    p.metrics = {
      kpis: asArray(m.kpis),
      series: asArray<MetricSeries>(m.series).map((s) => ({
        ...s,
        data: asArray(s.data),
      })),
    };
  } else {
    p.metrics = { kpis: [], series: [] };
  }
  const st = p.structure;
  if (st && typeof st === "object" && !Array.isArray(st)) {
    p.structure = {
      nodes: asArray(st.nodes),
      edges: asArray(st.edges),
    };
  } else {
    p.structure = { nodes: [], edges: [] };
  }
  if (p.deepDive && typeof p.deepDive === "object") {
    const d = p.deepDive;
    p.deepDive = {
      ...d,
      timeline: asArray(d.timeline),
      solution: asStringArray(d.solution),
      metrics:
        d.metrics != null && Array.isArray(d.metrics)
          ? asStringArray(d.metrics)
          : undefined,
      fishbone:
        d.fishbone && typeof d.fishbone === "object"
          ? {
              ...d.fishbone,
              branches: asArray(d.fishbone.branches),
            }
          : { problemStatement: "", branches: [] },
    };
  }
  if (p.operationScheme != null && typeof p.operationScheme === "object") {
    p.operationScheme = {
      ...p.operationScheme,
      sections: asArray(p.operationScheme.sections),
    };
  }
  if (
    p.retrospectiveOverviewWikiEmbed != null &&
    typeof p.retrospectiveOverviewWikiEmbed === "object"
  ) {
    const w = p.retrospectiveOverviewWikiEmbed;
    const mode = w.displayMode;
    p.retrospectiveOverviewWikiEmbed = {
      ...w,
      displayMode:
        mode === "iframe" || mode === "link" ? mode : undefined,
    };
  }
  if ("heroTagBadges" in p && (p as { heroTagBadges?: unknown }).heroTagBadges !== undefined) {
    const arr = asStringArray((p as { heroTagBadges?: unknown }).heroTagBadges);
    if (arr.length) (p as { heroTagBadges: string[] }).heroTagBadges = arr;
    else delete (p as { heroTagBadges?: string[] }).heroTagBadges;
  }
  if ("heroDynamicsStatLabels" in p) {
    const hsl = (p as { heroDynamicsStatLabels?: unknown }).heroDynamicsStatLabels;
    if (hsl != null && typeof hsl === "object" && !Array.isArray(hsl)) {
      const o = hsl as Record<string, unknown>;
      p.heroDynamicsStatLabels = {
        inProgress:
          typeof o.inProgress === "string" ? o.inProgress : undefined,
        completed:
          typeof o.completed === "string" ? o.completed : undefined,
        pending: typeof o.pending === "string" ? o.pending : undefined,
        risk: typeof o.risk === "string" ? o.risk : undefined,
      };
    } else {
      delete (p as { heroDynamicsStatLabels?: unknown }).heroDynamicsStatLabels;
    }
  }
  if (
    p.retrospectiveRefundReductionPlan != null &&
    typeof p.retrospectiveRefundReductionPlan === "object"
  ) {
    const r = p.retrospectiveRefundReductionPlan;
    const ctx =
      r.context && typeof r.context === "object" && !Array.isArray(r.context)
        ? r.context
        : {};
    p.retrospectiveRefundReductionPlan = {
      ...r,
      context: {
        scenario:
          typeof (ctx as { scenario?: unknown }).scenario === "string"
            ? (ctx as { scenario: string }).scenario
            : "",
        conflict:
          typeof (ctx as { conflict?: unknown }).conflict === "string"
            ? (ctx as { conflict: string }).conflict
            : "",
        problems: asStringArray((ctx as { problems?: unknown }).problems),
      },
      phases: asArray(r.phases).map((ph) => {
        const row = ph as {
          name?: unknown;
          schemePrefix?: unknown;
          goal?: unknown;
          forParents?: unknown;
          forStudents?: unknown;
        };
        return {
          name: typeof row.name === "string" ? row.name : "",
          schemePrefix:
            typeof row.schemePrefix === "string" ? row.schemePrefix : "方案-",
          goal: typeof row.goal === "string" ? row.goal : "",
          forParents: asStringArray(row.forParents),
          forStudents: asStringArray(row.forStudents),
        };
      }),
    };
  }
  return p;
}

function applyPartialProjectOverride(
  base: ProjectDetail,
  partial: Record<string, unknown>,
): ProjectDetail {
  const out: Record<string, unknown> = { ...base };
  for (const [k, val] of Object.entries(partial)) {
    if (val === undefined) continue;
    if (val === null) {
      delete out[k];
      continue;
    }
    out[k] = val;
  }
  return out as unknown as ProjectDetail;
}

/** 仅当 `slug=a-line` 且 URL 带 `nav` 时，尝试合并 `data/projects/overrides/a-line-{nav}.json` */
export async function applyLineNavOverride(
  project: ProjectDetail,
  nav: string | null,
): Promise<ProjectDetail> {
  if (project.slug !== "a-line" || !nav || !isSafeProjectSlug(nav)) {
    return project;
  }
  const filePath = path.join(DATA_DIR, "overrides", `a-line-${nav}.json`);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const partial = JSON.parse(raw) as Record<string, unknown>;
    if (
      partial == null ||
      typeof partial !== "object" ||
      Array.isArray(partial)
    ) {
      return project;
    }
    return normalizeProjectDetail(
      applyPartialProjectOverride(project, partial),
    );
  } catch {
    return project;
  }
}

/**
 * C 线「项目总览」：`/projects/c3-v6` 无 `?nav=` 时合并 `overrides/c3-v6-overview.json`。
 * 带子路径 `?nav=` 时由 `applyC3V6NavChildOverride` 合并 `overrides/c3-v6-{nav}.json`。
 */
export async function applyC3V6OverviewOverride(
  project: ProjectDetail,
  nav: string | null,
): Promise<ProjectDetail> {
  if (project.slug !== "c3-v6") return project;
  const trimmed = nav?.trim() ?? "";
  if (trimmed.length > 0) return project;

  const filePath = path.join(DATA_DIR, "overrides", "c3-v6-overview.json");
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const partial = JSON.parse(raw) as Record<string, unknown>;
    if (
      partial == null ||
      typeof partial !== "object" ||
      Array.isArray(partial)
    ) {
      return project;
    }
    return normalizeProjectDetail(
      applyPartialProjectOverride(project, partial),
    );
  } catch {
    return project;
  }
}

/**
 * C 线侧栏子项目：`/projects/c3-v6?nav={id}` 时合并 `overrides/c3-v6-{nav}.json`（如 `c1-v7-course`）。
 * 与 `c3-v6-overview.json`（仅无 `nav`）互斥。
 */
export async function applyC3V6NavChildOverride(
  project: ProjectDetail,
  nav: string | null,
): Promise<ProjectDetail> {
  if (project.slug !== "c3-v6") return project;
  const trimmed = nav?.trim() ?? "";
  if (!trimmed || !isSafeProjectSlug(trimmed)) return project;
  const filePath = path.join(DATA_DIR, "overrides", `c3-v6-${trimmed}.json`);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const partial = JSON.parse(raw) as Record<string, unknown>;
    if (
      partial == null ||
      typeof partial !== "object" ||
      Array.isArray(partial)
    ) {
      return project;
    }
    return normalizeProjectDetail(
      applyPartialProjectOverride(project, partial),
    );
  } catch {
    return project;
  }
}

function normalizeProjectIndexFile(raw: ProjectIndexFile): ProjectIndexFile {
  const top = raw.dashboardTopKpis;
  let dashboardTopKpis: ProjectIndexFile["dashboardTopKpis"] = undefined;
  if (top != null && typeof top === "object" && !Array.isArray(top)) {
    const o = top as Record<string, unknown>;
    const n = (x: unknown) =>
      typeof x === "number" && Number.isFinite(x) ? x : undefined;
    dashboardTopKpis = {
      totalProjects: n(o.totalProjects),
      inProgress: n(o.inProgress),
      delayed: n(o.delayed),
      highPriority: n(o.highPriority),
    };
    if (
      dashboardTopKpis.totalProjects == null &&
      dashboardTopKpis.inProgress == null &&
      dashboardTopKpis.delayed == null &&
      dashboardTopKpis.highPriority == null
    ) {
      dashboardTopKpis = undefined;
    }
  }

  const delayedNotes = asStringArray(raw.dashboardDelayedNotes);

  return {
    ...raw,
    projects: raw.projects.map((s) => ({
      ...s,
      tags: asStringArray(s.tags),
    })),
    dashboardTopKpis,
    dashboardDelayedNotes: delayedNotes.length ? delayedNotes : undefined,
  };
}

export async function loadProjectIndex(): Promise<ProjectIndexFile> {
  const raw = await fs.readFile(path.join(DATA_DIR, "index.json"), "utf-8");
  return normalizeProjectIndexFile(JSON.parse(raw) as ProjectIndexFile);
}

export async function loadProjectSummaries(): Promise<ProjectSummary[]> {
  const idx = await loadProjectIndex();
  return idx.projects;
}

export async function loadProjectBySlug(
  slug: string,
): Promise<ProjectDetail | null> {
  if (!isSafeProjectSlug(slug)) return null;
  try {
    const raw = await fs.readFile(
      path.join(DATA_DIR, `${slug}.json`),
      "utf-8",
    );
    const parsed: unknown = JSON.parse(raw);
    if (!isProjectDetailRecord(parsed, slug)) return null;
    return normalizeProjectDetail(parsed as ProjectDetail);
  } catch {
    return null;
  }
}

/**
 * 总控台 / API 列表用：对 A 线、C 线「产品线」slug，将 `overrides/{slug}-*.json` 中的
 * milestones / risks / documents 与 blockerCount 合并进一份视图（不修改磁盘上的子项目文件）。
 * 协同人数等仍沿用主 JSON，避免同一人在多子项目中重复累加。
 */
async function mergeLinePortfolioForDashboard(
  base: ProjectDetail,
): Promise<ProjectDetail> {
  const slug = base.slug;
  if (slug !== "a-line" && slug !== "c3-v6") return base;

  const prefix = `${slug}-`;
  const dir = path.join(DATA_DIR, "overrides");
  let names: string[];
  try {
    names = await fs.readdir(dir);
  } catch {
    return base;
  }

  const milestones: Milestone[] = [...base.milestones];
  const risks: RiskItem[] = [...base.risks];
  const documents: DocumentItem[] = [...base.documents];
  let blockerSum =
    typeof base.blockerCount === "number" ? base.blockerCount : 0;

  for (const fname of names) {
    if (!fname.startsWith(prefix) || !fname.endsWith(".json")) continue;
    const navKey = fname.slice(prefix.length, -5);
    if (!isSafeProjectSlug(navKey)) continue;
    let raw: string;
    try {
      raw = await fs.readFile(path.join(dir, fname), "utf-8");
    } catch {
      continue;
    }
    let partial: Record<string, unknown>;
    try {
      partial = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      continue;
    }
    if (
      partial == null ||
      typeof partial !== "object" ||
      Array.isArray(partial)
    ) {
      continue;
    }

    if (Array.isArray(partial.milestones)) {
      const ms = partial.milestones as Milestone[];
      milestones.push(
        ...ms.map((m) => ({
          ...m,
          id: `${navKey}:${m.id}`,
        })),
      );
    }
    if (Array.isArray(partial.risks)) {
      const rs = partial.risks as RiskItem[];
      risks.push(
        ...rs.map((r) => ({
          ...r,
          id: `${navKey}:${r.id}`,
        })),
      );
    }
    if (Array.isArray(partial.documents)) {
      const ds = partial.documents as DocumentItem[];
      documents.push(
        ...ds.map((d) => ({
          ...d,
          id: `${navKey}:${d.id}`,
        })),
      );
    }
    if (typeof partial.blockerCount === "number") {
      blockerSum += partial.blockerCount;
    }
  }

  return normalizeProjectDetail({
    ...base,
    milestones,
    risks,
    documents,
    milestoneCount: milestones.length,
    blockerCount: blockerSum,
  });
}

export async function loadAllProjectDetails(): Promise<ProjectDetail[]> {
  const summaries = await loadProjectSummaries();
  const out: ProjectDetail[] = [];
  for (const s of summaries) {
    const p = await loadProjectBySlug(s.slug);
    if (!p) continue;
    if (s.slug === "a-line" || s.slug === "c3-v6") {
      out.push(await mergeLinePortfolioForDashboard(p));
    } else {
      out.push(p);
    }
  }
  return out;
}
