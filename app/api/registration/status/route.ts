import { NextRequest, NextResponse } from "next/server";
import { getRegistrationByReference, getRegistrationsByEmail } from "@/lib/registrations-store";

export async function GET(req: NextRequest) {
  try {
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
    return NextResponse.json(
      { error: error?.message || "Failed to search registration status." },
      { status: 500 }
    );
  }
}
