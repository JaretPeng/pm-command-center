"use client";

import { ProjectDetailClient } from "@/components/project/project-detail-client";
import type { ProjectDetail } from "@/types/domain";

/**
 * 客户端壳层：承接服务端传入的完整 project（与读盘 API 同源），避免详情页再 fetch /api
 * `initialSearchQuery` 由服务端从 URL 解析，详情内不再使用 `useSearchParams`，避免标签页长期「加载中」。
 */
export function ProjectPageShell({
  project,
  initialSearchQuery,
}: {
  project: ProjectDetail;
  initialSearchQuery: string;
}) {
  return (
    <ProjectDetailClient
      project={project}
      initialSearchQuery={initialSearchQuery}
    />
  );
}
