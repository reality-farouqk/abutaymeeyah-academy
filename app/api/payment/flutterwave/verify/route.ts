import { NextRequest, NextResponse } from "next/server";
import { updatePaymentStatus, getRegistrationByReference } from "@/lib/registrations-store";

export async function POST(req: NextRequest) {
  try {
    const { reference, transactionId } = await req.json();

    if (!reference) {
      return NextResponse.json({ error: "Registration reference required." }, { status: 400 });
    }

    const reg = getRegistrationByReference(reference);
    if (!reg) {
      return NextResponse.json({ error: "Registration not found." }, { status: 404 });
    }

    const flwSecret = process.env.FLUTTERWAVE_SECRET_KEY;

    if (flwSecret && !flwSecret.includes("xxxxxxxx") && transactionId && !transactionId.startsWith("FLW_DEMO")) {
      const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
        headers: {
          Authorization: `Bearer ${flwSecret}`,
        },
      });

      const data = await response.json();
      if (data.status === "success" && data.data?.status === "successful") {
        const updated = updatePaymentStatus(reference, "PAID", "Flutterwave", String(transactionId));
        return NextResponse.json({ success: true, registration: updated });
      } else {
        updatePaymentStatus(reference, "FAILED", "Flutterwave", String(transactionId));
        return NextResponse.json({ error: "Flutterwave transaction verification failed." }, { status: 400 });
      }
    }

    // Demo Mode Verification
    const updated = updatePaymentStatus(reference, "PAID", "Flutterwave", transactionId || `FLW_DEMO_${Date.now()}`);
    return NextResponse.json({
      success: true,
      message: "Payment verified successfully (Demo Mode).",
      registration: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to verify Flutterwave payment." },
      { status: 500 }
    );
  }
}
