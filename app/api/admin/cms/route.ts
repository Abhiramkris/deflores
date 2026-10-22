import { NextResponse } from "next/server";
import { getAllCmsDataWithDrafts, saveSectionData } from "../../../../lib/cms";

export async function GET() {
  try {
    const data = await getAllCmsDataWithDrafts();
    return NextResponse.json({ success: true, ...data });
  } catch (error: unknown) {
    console.error("CMS GET error:", error);
    const msg = error instanceof Error ? error.message : "Failed to load CMS data";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sectionKey, content, status, actorEmail } = body;

    if (!sectionKey || !content) {
      return NextResponse.json({ error: "Missing sectionKey or content payload." }, { status: 400 });
    }

    const cleanActor = actorEmail || "admin@deflores.com";
    const result = await saveSectionData(sectionKey, content, status || "published", cleanActor);

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("CMS POST error:", error);
    const msg = error instanceof Error ? error.message : "Failed to save CMS section";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
