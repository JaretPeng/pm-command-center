import { NextResponse } from "next/server";
import { loadProjectIndex, loadAllProjectDetails } from "@/lib/load-projects";

export async function GET() {
  const [index, details] = await Promise.all([
    loadProjectIndex(),
    loadAllProjectDetails(),
  ]);
  return NextResponse.json({
    pm: index.pm,
    summaries: index.projects,
    details,
  });
}
