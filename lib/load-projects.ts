import "server-only";

import { promises as fs } from "fs";
import path from "path";
import type { ProjectDetail, ProjectIndexFile, ProjectSummary } from "@/types/domain";

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

/** 开发模式下禁用缓存，避免改 JSON / 媒体后仍读到旧数据 */
const isDev = process.env.NODE_ENV === "development";

let indexCache: ProjectIndexFile | null = null;
const projectCache = new Map<string, ProjectDetail>();

export async function loadProjectIndex(): Promise<ProjectIndexFile> {
  if (!isDev && indexCache) return indexCache;
  const raw = await fs.readFile(path.join(DATA_DIR, "index.json"), "utf-8");
  const parsed = JSON.parse(raw) as ProjectIndexFile;
  if (!isDev) indexCache = parsed;
  return parsed;
}

export async function loadProjectSummaries(): Promise<ProjectSummary[]> {
  const idx = await loadProjectIndex();
  return idx.projects;
}

export async function loadProjectBySlug(
  slug: string,
): Promise<ProjectDetail | null> {
  if (!isSafeProjectSlug(slug)) return null;
  if (!isDev && projectCache.has(slug)) {
    return projectCache.get(slug)!;
  }
  try {
    const raw = await fs.readFile(
      path.join(DATA_DIR, `${slug}.json`),
      "utf-8",
    );
    const parsed: unknown = JSON.parse(raw);
    if (!isProjectDetailRecord(parsed, slug)) return null;
    if (!isDev) projectCache.set(slug, parsed);
    return parsed;
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
