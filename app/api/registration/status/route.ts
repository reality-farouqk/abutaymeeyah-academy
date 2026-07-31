import { NextRequest, NextResponse } from "next/server";
import { getRegistrationByReference, getRegistrationsByEmail } from "@/lib/registrations-store";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  try {
    const clientKey = getClientKey(req);
    // This endpoint returns personal data by reference or email with no
    // login required — rate limit it to slow down enumeration/brute-force
    // attempts against either lookup path.
    if (!checkRateLimit("registration-status", clientKey, 15, 10 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json({ error: "Please provide a reference number or email address." }, { status: 400 });
    }

    const trimmed = query.trim();

    // Check if reference
    const byRef = getRegistrationByReference(trimmed);
    if (byRef) {
      return NextResponse.json({ success: true, registrations: [byRef] });
    }

    // Check if email
    const byEmail = getRegistrationsByEmail(trimmed);
    if (byEmail.length > 0) {
      return NextResponse.json({ success: true, registrations: byEmail });
    }

    return NextResponse.json(
      { error: "No registration found matching your reference or email address." },
      { status: 404 }
    );
  } catch (error: any) {
    console.error("Registration status lookup failed:", error?.message || error);
    return NextResponse.json(
      { error: "Failed to search registration status." },
      { status: 500 }
    );
  }
}
