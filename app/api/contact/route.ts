import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";

// Same best-effort throttling approach as the admin login route — resets on
// redeploy and isn't shared across serverless instances, but stops the most
// naive spam scripts.
const attempts = new Map<string, { count: number; windowStart: number }>();
const MAX_PER_WINDOW = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function getClientKey(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const key = getClientKey(req);
    const now = Date.now();
    const record = attempts.get(key);

    if (record && now - record.windowStart < WINDOW_MS) {
      if (record.count >= MAX_PER_WINDOW) {
        return NextResponse.json(
          { error: "Too many messages sent. Please try again later." },
          { status: 429 }
        );
      }
      record.count += 1;
    } else {
      attempts.set(key, { count: 1, windowStart: now });
    }

    const body = await req.json();
    const { name, email, message, company } = body;

    // Honeypot: a real visitor never fills this hidden field in; a bot
    // filling every field usually will. Pretend success either way so bots
    // don't learn to leave it blank.
    if (company) {
      return NextResponse.json({ success: true });
    }

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { error: "Please enter a message of at least 10 characters." },
        { status: 400 }
      );
    }
    if (name.length > 200 || email.length > 200 || message.length > 5000) {
      return NextResponse.json({ error: "One of the fields is too long." }, { status: 400 });
    }

    await sendContactEmail({ name: name.trim(), email: email.trim(), message: message.trim() });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Contact form submission failed:", error?.message || error);
    return NextResponse.json(
      { error: "We couldn't send your message right now. Please try again or reach us directly by phone/WhatsApp." },
      { status: 500 }
    );
  }
}
