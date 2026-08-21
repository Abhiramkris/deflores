import { NextResponse } from "next/server";
import { sql } from "../../../lib/db";
import { Resend } from "resend";
import { SignJWT } from "jose";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummykey123");
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "deflores_haute_couture_secret_secure_key_123"
);

export async function POST(request: Request) {
  try {
    const { action, email, otp } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // ----------------------------------------------------
    // Action 1: Send OTP
    // ----------------------------------------------------
    if (action === "send") {
      // Automatically register testing admin if matching temporary bypass email
      if (cleanEmail === "123@gmail.com") {
        await sql`
          INSERT INTO admins (email) VALUES ('123@gmail.com') ON CONFLICT DO NOTHING
        `;
      }

      // Check if email belongs to an registered admin
      const admins = await sql`
        SELECT id FROM admins WHERE email = ${cleanEmail}
      `;

      if (admins.length === 0) {
        return NextResponse.json({ error: "Access Denied. Email is not an authorized administrator." }, { status: 403 });
      }

      // Generate 6-digit OTP (use static 123456 for bypass test email)
      const generatedOtp = cleanEmail === "123@gmail.com" ? "123456" : Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

      // Insert OTP into DB
      await sql`
        INSERT INTO admin_otps (email, otp, expires_at)
        VALUES (${cleanEmail}, ${generatedOtp}, ${expiresAt})
      `;

      // Log request
      await sql`
        INSERT INTO action_logs (actor_email, action_type, description)
        VALUES (${cleanEmail}, 'OTP_REQUESTED', 'OTP code requested for login verification')
      `;

      // Send email via Resend
      if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: "de flores Haute Couture <onboarding@resend.dev>",
          to: cleanEmail,
          subject: "Your de flores Admin Login OTP",
          html: `<p>Your administrator verification OTP is <strong>${generatedOtp}</strong>. It will expire in 10 minutes.</p>`
        });
      } else {
        console.log(`[LOCAL DEV] OTP generated for ${cleanEmail}: ${generatedOtp}`);
      }

      return NextResponse.json({ success: true, message: "OTP sent successfully" });
    }

    // ----------------------------------------------------
    // Action 2: Verify OTP
    // ----------------------------------------------------
    if (action === "verify") {
      if (!otp) {
        return NextResponse.json({ error: "OTP is required" }, { status: 400 });
      }

      // Retrieve valid OTPs
      const activeOtps = await sql`
        SELECT id FROM admin_otps 
        WHERE email = ${cleanEmail} AND otp = ${otp.trim()} AND expires_at > NOW()
        ORDER BY created_at DESC LIMIT 1
      `;

      if (activeOtps.length === 0) {
        // Log failure
        await sql`
          INSERT INTO action_logs (actor_email, action_type, description)
          VALUES (${cleanEmail}, 'LOGIN_FAILED', 'Failed login attempt: invalid or expired OTP code')
        `;
        return NextResponse.json({ error: "Invalid or expired OTP code" }, { status: 400 });
      }

      // Cleanup consumed OTPs
      await sql`
        DELETE FROM admin_otps WHERE email = ${cleanEmail}
      `;

      // Log success
      await sql`
        INSERT INTO action_logs (actor_email, action_type, description)
        VALUES (${cleanEmail}, 'LOGIN_SUCCESS', 'Administrator successfully verified OTP and entered workspace')
      `;

      // Create JWT token
      const token = await new SignJWT({ email: cleanEmail })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("2h")
        .sign(JWT_SECRET);

      // Set cookie in response
      const response = NextResponse.json({ success: true });
      response.cookies.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 2 * 60 * 60, // 2 hours
      });

      return response;
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Auth OTP API Error:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}
