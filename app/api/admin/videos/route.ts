import { NextResponse } from "next/server";
import { getHomepageData, saveSectionData } from "../../../../lib/cms";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getHomepageData();
    const defaultRamp = {
      video_1: {
        url: "/ramp_video_1.mp4",
        eyebrow: "THE RAMP",
        title: "Couture in motion.",
        is_visible: true,
      },
      video_2: {
        url: "/ramp_video_2.mp4",
        eyebrow: "SECOND LOOK",
        title: "The runway, again.",
        is_visible: true,
      },
    };

    const videos = data.ramp_videos || defaultRamp;
    return NextResponse.json({ success: true, videos });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to fetch homepage videos";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { video_1, video_2, actorEmail } = body;

    if (!video_1?.url || !video_2?.url) {
      return NextResponse.json(
        { success: false, error: "Both Video 1 and Video 2 URLs are required." },
        { status: 400 }
      );
    }

    const content = {
      video_1: {
        url: String(video_1.url).trim(),
        eyebrow: String(video_1.eyebrow || "THE RAMP").trim(),
        title: String(video_1.title || "Couture in motion.").trim(),
        is_visible: video_1.is_visible !== false,
      },
      video_2: {
        url: String(video_2.url).trim(),
        eyebrow: String(video_2.eyebrow || "SECOND LOOK").trim(),
        title: String(video_2.title || "The runway, again.").trim(),
        is_visible: video_2.is_visible !== false,
      },
    };

    const cleanActor = actorEmail || "admin@deflores.com";
    const result = await saveSectionData("ramp_videos", content, "published", cleanActor);

    return NextResponse.json({ ...result, content });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to save homepage videos";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
