import { Suspense } from "react";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { ProjectDetailClient } from "@/components/project/project-detail-client";
import { loadProjectBySlug } from "@/lib/load-projects";

/** 始终拉取最新 JSON；避免路由缓存导致 Overview 视频配置不更新 */
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return [{ slug: "a-line" }, { slug: "c3-v6" }];
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  noStore();
  const { slug } = await params;
  const project = await loadProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6 sm:px-6">
      <Suspense
        fallback={
          <div className="py-10 text-sm text-muted-foreground">
            加载项目工作台…
          </div>
        }
      >
        <ProjectDetailClient project={project} />
      </Suspense>
    </div>
  );
}
