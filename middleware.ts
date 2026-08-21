import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "deflores_haute_couture_secret_secure_key_123"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin/... and /api/admin/... paths except login and auth OTP route itself
  if (
    (pathname.startsWith("/admin") && pathname !== "/admin/login") ||
    (pathname.startsWith("/api/admin") && pathname !== "/api/auth/otp")
  ) {
    const tokenCookie = request.cookies.get("admin_token");
    
    if (!tokenCookie) {
      return NextResponse.json ? NextResponse.json({ error: "Unauthorized" }, { status: 401 }) : NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      await jwtVerify(tokenCookie.value, JWT_SECRET);
      return NextResponse.next();
    } catch (err) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Invalid Session" }, { status: 401 });
      }
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete("admin_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
