import { NextRequest, NextResponse } from "next/server";
import { updatePaymentStatus, getRegistrationByReference } from "@/lib/registrations-store";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const clientKey = getClientKey(req);
    if (!checkRateLimit("paystack-verify", clientKey, 20, 10 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
    }

    const { reference, trxRef } = await req.json();

    if (!reference) {
      return NextResponse.json({ error: "Registration reference required." }, { status: 400 });
    }

    const reg = getRegistrationByReference(reference);
    if (!reg) {
      return NextResponse.json({ error: "Registration not found." }, { status: 404 });
    }

    if (reg.paymentStatus === "PAID") {
      return NextResponse.json({ success: true, registration: reg });
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    const isLiveConfigured = !!paystackSecret && !paystackSecret.includes("xxxxxxxx");

    // CRITICAL: see the matching comment in the Flutterwave verify route —
    // which branch runs depends ONLY on isLiveConfigured, never on whether
    // the client sent a trxRef. Do not weaken this condition.
    if (isLiveConfigured) {
      if (!trxRef || typeof trxRef !== "string" || trxRef.startsWith("PSTK_DEMO")) {
        return NextResponse.json({ error: "Missing or invalid transaction reference." }, { status: 400 });
      }

      const response = await fetch(`https://api.paystack.co/transaction/verify/${trxRef}`, {
        headers: { Authorization: `Bearer ${paystackSecret}` },
      });

      const data = await response.json();

      const confirmedSuccessful =
        data.status === true &&
        data.data?.status === "success" &&
        Number(data.data?.amount) >= reg.totalFee * 100 && // Paystack amounts are in kobo
        data.data?.currency === "NGN";

      if (confirmedSuccessful) {
        const updated = updatePaymentStatus(reference, "PAID", "Paystack", trxRef);
        return NextResponse.json({ success: true, registration: updated });
      } else {
        updatePaymentStatus(reference, "FAILED", "Paystack", trxRef);
        return NextResponse.json({ error: "Paystack transaction verification failed." }, { status: 400 });
      }
    }

    // Not configured with live keys — demo mode, for local development and
    // previewing the flow only. This branch can never run in an environment
    // where a real secret key is set.
    const updated = updatePaymentStatus(reference, "PAID", "Paystack", trxRef || `PSTK_DEMO_${Date.now()}`);
    return NextResponse.json({
      success: true,
      message: "Payment verified successfully (Demo Mode).",
      registration: updated,
    });
  } catch (error: any) {
    console.error("Paystack verify failed:", error?.message || error);
    return NextResponse.json(
      { error: "Failed to verify Paystack payment." },
      { status: 500 }
    );
  }
}
