import { NextRequest, NextResponse } from "next/server";
import { getAllRegistrations, updatePaymentStatus } from "@/lib/registrations-store";

export async function GET() {
  try {
    const list = getAllRegistrations();
    return NextResponse.json({ success: true, registrations: list });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch registrations." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { reference, paymentStatus, paymentGateway } = await req.json();

    if (!reference || !paymentStatus) {
      return NextResponse.json(
        { error: "Reference and paymentStatus are required." },
        { status: 400 }
      );
    }

    const updated = updatePaymentStatus(
      reference,
      paymentStatus,
      paymentGateway || "Bank Transfer",
      `ADMIN_CONFIRM_${Date.now()}`
    );

    if (!updated) {
      return NextResponse.json({ error: "Registration not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, registration: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update registration payment status." },
      { status: 500 }
    );
  }
}
