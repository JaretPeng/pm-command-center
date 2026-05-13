import { NextResponse } from "next/server";
import { isSafeProjectSlug, loadProjectBySlug } from "@/lib/load-projects";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    if (!isSafeProjectSlug(slug)) {
      return NextResponse.json({ error: "invalid_slug" }, { status: 400 });
    }
    const project = await loadProjectBySlug(slug);
    if (!project) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (e) {
    console.error("[api/projects/[slug]]", e);
    return NextResponse.json(
      { error: "load_failed", message: String(e) },
      { status: 500 },
    );
  }
}
