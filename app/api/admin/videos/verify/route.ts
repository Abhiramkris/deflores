import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawUrl = typeof body?.url === "string" ? body.url.trim() : "";

    if (!rawUrl) {
      return NextResponse.json(
        { success: false, permissionOk: false, message: "Please provide a valid video link." },
        { status: 400 }
      );
    }

    if (rawUrl.startsWith("/")) {
      const relativePath = rawUrl.replace(/^\//, "");
      const fullPath = path.join(process.cwd(), "public", relativePath);
      if (fs.existsSync(fullPath)) {
        return NextResponse.json({
          success: true,
          permissionOk: true,
          optimizedUrl: rawUrl,
          originalUrl: rawUrl,
          message: "Local video asset verified in atelier storage.",
        });
      }
    }

    const driveMatch = rawUrl.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)|docs\.google\.com\/file\/d\/)([a-zA-Z0-9_-]+)/);

    if (driveMatch && driveMatch[1]) {
      const fileId = driveMatch[1];
      const checkUrl = `https://drive.google.com/file/d/${fileId}/view`;

      try {
        const testRes = await fetch(checkUrl, {
          method: "GET",
          headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
          redirect: "follow",
        });

        const finalUrl = testRes.url || "";
        const bodyText = await testRes.text();

        if (testRes.status === 404) {
          return NextResponse.json({
            success: false,
            permissionOk: false,
            message: "Google Drive file not found or inaccessible (HTTP 404). Please ensure the file exists and is shared as 'Anyone with the link can view'.",
          });
        }

        if (
          testRes.status === 401 ||
          testRes.status === 403 ||
          !testRes.ok ||
          finalUrl.includes("accounts.google.com") ||
          finalUrl.includes("ServiceLogin") ||
          bodyText.includes("You need access") ||
          bodyText.includes("Permission denied") ||
          bodyText.includes("Request access")
        ) {
          return NextResponse.json({
            success: false,
            permissionOk: false,
            message: "Google Drive permission error: This file is restricted or private. Please open Google Drive, click Share, and set General Access to 'Anyone with the link can view'.",
          });
        }

        const optimizedUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download`;

        return NextResponse.json({
          success: true,
          permissionOk: true,
          optimizedUrl,
          originalUrl: rawUrl,
          fileId,
          message: "Google Drive permissions verified (Public access confirmed). Link optimized for direct video streaming.",
        });
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : "Network check failed";
        return NextResponse.json({
          success: false,
          permissionOk: false,
          message: `Failed to verify Google Drive link: ${errMsg}`,
        });
      }
    }

    if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
      try {
        const testRes = await fetch(rawUrl, {
          method: "GET",
          headers: {
            Range: "bytes=0-1024",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          },
          redirect: "follow",
        });

        if (testRes.status === 401 || testRes.status === 403) {
          return NextResponse.json({
            success: false,
            permissionOk: false,
            message: "Permission error (HTTP 401/403): Access to this video file is private or forbidden.",
          });
        }

        if (testRes.status === 404) {
          return NextResponse.json({
            success: false,
            permissionOk: false,
            message: "Video not found (HTTP 404): The specified link does not exist.",
          });
        }

        if (testRes.ok || testRes.status === 206) {
          return NextResponse.json({
            success: true,
            permissionOk: true,
            optimizedUrl: rawUrl,
            originalUrl: rawUrl,
            message: "Direct video stream verified. Public permissions confirmed.",
          });
        }
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : "Network check failed";
        return NextResponse.json({
          success: false,
          permissionOk: false,
          message: `Network validation error: ${errMsg}`,
        });
      }
    }

    return NextResponse.json({
      success: false,
      permissionOk: false,
      message: "Unsupported URL format. Please provide a valid Google Drive link or HTTPS video URL.",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Verification failed";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
