import { notFound } from "next/navigation";
import { ProjectPageShell } from "@/components/project/project-page-shell";
import {
  applyC3V6NavChildOverride,
  applyC3V6OverviewOverride,
  applyLineNavOverride,
  loadProjectBySlug,
} from "@/lib/load-projects";
import { stringifySearchParams } from "@/lib/url-search";

/** 始终拉取最新 JSON；避免路由缓存导致 Overview 视频配置不更新 */
export const dynamic = "force-dynamic";

function ProjectRouteLoadFailed({ detail }: { detail?: string }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <p className="font-medium text-destructive">项目页暂时无法打开</p>
      <p className="mt-2 text-sm text-muted-foreground">
        {detail ??
          "服务端在读取项目数据时出错。若仅在部署环境出现，请确认仓库内 data/projects 已随构建打包（参见 next.config 中 outputFileTracingIncludes）。"}
      </p>
    </div>
  );
}

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  let slug = "";
  try {
    const p = params != null ? await params : {};
    const raw =
      typeof p === "object" && p !== null && "slug" in p
        ? (p as { slug: unknown }).slug
        : undefined;
    slug = typeof raw === "string" ? raw : "";
  } catch (e) {
    console.error("[projects/[slug]] params", e);
    return (
      <ProjectRouteLoadFailed
        detail={
          process.env.NODE_ENV === "development"
            ? `路由参数解析失败：${String((e as Error)?.message ?? e)}`
            : undefined
        }
      />
    );
  }

  let project = await loadProjectBySlug(slug);

  if (!project) notFound();

  let initialSearchQuery = "";
  let navForMerge: string | null = null;
  try {
    const sp = searchParams != null ? await searchParams : {};
    const raw = sp && typeof sp === "object" ? sp : {};
    const rec = raw as Record<string, string | string[] | undefined>;
    initialSearchQuery = stringifySearchParams(rec);
    const navRaw = rec.nav;
    if (typeof navRaw === "string") navForMerge = navRaw;
    else if (Array.isArray(navRaw) && typeof navRaw[0] === "string")
      navForMerge = navRaw[0];
  } catch {
    initialSearchQuery = "";
  }

  project = await applyLineNavOverride(project, navForMerge);
  project = await applyC3V6OverviewOverride(project, navForMerge);
  project = await applyC3V6NavChildOverride(project, navForMerge);

  return (
    <div className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6 sm:px-6">
      <ProjectPageShell
        project={project}
        initialSearchQuery={initialSearchQuery}
      />
    </div>
  );
}
