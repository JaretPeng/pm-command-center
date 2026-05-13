import "server-only";

import { promises as fs } from "fs";
import path from "path";
import type {
  MetricSeries,
  Milestone,
  ProjectDetail,
  ProjectIndexFile,
  ProjectSummary,
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
  p.retrospectives = asArray(p.retrospectives);
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

function normalizeProjectIndexFile(raw: ProjectIndexFile): ProjectIndexFile {
  return {
    ...raw,
    projects: raw.projects.map((s) => ({
      ...s,
      tags: asStringArray(s.tags),
    })),
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

export async function loadAllProjectDetails(): Promise<ProjectDetail[]> {
  const summaries = await loadProjectSummaries();
  const out: ProjectDetail[] = [];
  for (const s of summaries) {
    const p = await loadProjectBySlug(s.slug);
    if (p) out.push(p);
  }
  return out;
}
