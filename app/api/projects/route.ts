import { NextResponse } from "next/server";
import { loadProjectIndex, loadAllProjectDetails } from "@/lib/load-projects";

export async function GET() {
  try {
    const [index, details] = await Promise.all([
      loadProjectIndex(),
      loadAllProjectDetails(),
    ]);
    return NextResponse.json({
      pm: index.pm,
      summaries: index.projects,
      details,
    });
  } catch (e) {
    console.error("[api/projects]", e);
    return NextResponse.json(
      { error: "load_failed", message: String(e) },
      { status: 500 },
    );
  }
}
