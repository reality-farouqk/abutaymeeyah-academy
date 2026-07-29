import { NextRequest, NextResponse } from "next/server";
import { updatePaymentStatus, getRegistrationByReference } from "@/lib/registrations-store";

export async function POST(req: NextRequest) {
  try {
    const { reference, trxRef } = await req.json();

    if (!reference) {
      return NextResponse.json({ error: "Registration reference required." }, { status: 400 });
    }

    const reg = getRegistrationByReference(reference);
    if (!reg) {
      return NextResponse.json({ error: "Registration not found." }, { status: 404 });
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;

    if (paystackSecret && !paystackSecret.includes("xxxxxxxx") && trxRef && !trxRef.startsWith("PSTK_DEMO")) {
      const response = await fetch(`https://api.paystack.co/transaction/verify/${trxRef}`, {
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
        },
      });

      const data = await response.json();
      if (data.status && data.data?.status === "success") {
        const updated = updatePaymentStatus(reference, "PAID", "Paystack", trxRef);
        return NextResponse.json({ success: true, registration: updated });
      } else {
        updatePaymentStatus(reference, "FAILED", "Paystack", trxRef);
        return NextResponse.json({ error: "Paystack transaction verification failed." }, { status: 400 });
      }
    }

    // Demo Mode Verification
    const updated = updatePaymentStatus(reference, "PAID", "Paystack", trxRef || `PSTK_DEMO_${Date.now()}`);
    return NextResponse.json({
      success: true,
      message: "Payment verified successfully (Demo Mode).",
      registration: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to verify Paystack payment." },
      { status: 500 }
    );
  }
}
