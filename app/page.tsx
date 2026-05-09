import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { loadAllProjectDetails, loadProjectIndex } from "@/lib/load-projects";

export default async function HomePage() {
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
}
