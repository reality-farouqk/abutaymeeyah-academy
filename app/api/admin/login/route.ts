import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, createSessionToken, ADMIN_SESSION_COOKIE, ADMIN_SESSION_TTL_MS } from "@/lib/admin-auth";

// Best-effort brute-force throttling. This resets whenever the server
// process restarts/redeploys and isn't shared across serverless instances,
// so it's a speed bump, not a real defense — if this app grows beyond a
// couple of trusted staff logins, put this behind a real rate limiter
// (e.g. Upstash Redis, or your host's WAF/rate-limit rules) instead.
const attempts = new Map<string, { count: number; lockUntil: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getClientKey(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}

export async function POST(req: NextRequest) {
  try {
    const key = getClientKey(req);
    const record = attempts.get(key);
    const now = Date.now();

    if (record && record.lockUntil > now) {
      const waitMins = Math.ceil((record.lockUntil - now) / 60000);
      return NextResponse.json(
        { error: `Too many attempts. Try again in ${waitMins} minute(s).` },
        { status: 429 }
      );
    }

    const { password } = await req.json();

    if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) {
      console.error("ADMIN_PASSWORD or ADMIN_SESSION_SECRET is not set.");
      return NextResponse.json({ error: "Admin login is not configured." }, { status: 500 });
    }

    const valid = await verifyPassword(password || "");

    if (!valid) {
      const next = record
        ? { count: record.count + 1, lockUntil: 0 }
        : { count: 1, lockUntil: 0 };
      if (next.count >= MAX_ATTEMPTS) {
        next.lockUntil = now + WINDOW_MS;
        next.count = 0;
      }
      attempts.set(key, next);
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }

    attempts.delete(key);
    const token = await createSessionToken();

    const res = NextResponse.json({ success: true });
    res.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_SESSION_TTL_MS / 1000,
    });
    return res;
  } catch (error: any) {
    console.error("Admin login failed:", error?.message || error);
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
