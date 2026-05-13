import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { loadAllProjectDetails, loadProjectIndex } from "@/lib/load-projects";

export default async function HomePage() {
  try {
    const [index, projects] = await Promise.all([
      loadProjectIndex(),
      loadAllProjectDetails(),
    ]);

    const pmName = process.env.NEXT_PUBLIC_PM_NAME ?? index.pm.name;
    const pmTitle = process.env.NEXT_PUBLIC_PM_TITLE ?? index.pm.title;

    return (
      <DashboardClient
        summaries={index.projects}
        projects={projects}
        pmName={pmName}
        pmTitle={pmTitle}
      />
    );
  } catch (e) {
    console.error("[HomePage] load projects failed", e);
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-sm">
        <p className="font-medium text-destructive">数据加载失败</p>
        <p className="mt-2 text-muted-foreground">
          请确认 <code className="rounded bg-muted px-1">data/projects</code>{" "}
          已随部署打包，或在本机执行{" "}
          <code className="rounded bg-muted px-1">npm run dev:clean</code>{" "}
          后重试。
        </p>
      </div>
    );
  }
}
