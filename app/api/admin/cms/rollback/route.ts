import { NextResponse } from "next/server";
import { rollbackSectionData } from "../../../../../lib/cms";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { historyId, actorEmail } = body;

    if (!historyId) {
      return NextResponse.json({ error: "Missing historyId." }, { status: 400 });
    }

    const cleanActor = actorEmail || "admin@deflores.com";
    const result = await rollbackSectionData(parseInt(historyId), cleanActor);

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("CMS Rollback error:", error);
    const msg = error instanceof Error ? error.message : "Failed to rollback section";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
