import { NextResponse } from "next/server";
import { loadProjectBySlug } from "@/lib/load-projects";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const project = await loadProjectBySlug(slug);
  if (!project) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json(project);
}
