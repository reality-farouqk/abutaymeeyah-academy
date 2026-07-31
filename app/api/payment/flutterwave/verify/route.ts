import { NextRequest, NextResponse } from "next/server";
import { updatePaymentStatus, getRegistrationByReference } from "@/lib/registrations-store";
import { checkRateLimit, getClientKey } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const clientKey = getClientKey(req);
    if (!checkRateLimit("flw-verify", clientKey, 20, 10 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
    }

    const { reference, transactionId } = await req.json();

    if (!reference) {
      return NextResponse.json({ error: "Registration reference required." }, { status: 400 });
    }

    const reg = getRegistrationByReference(reference);
    if (!reg) {
      return NextResponse.json({ error: "Registration not found." }, { status: 404 });
    }

    // Already confirmed (e.g. by the webhook, or a previous call) — nothing
    // left to verify. Also avoids re-hitting Flutterwave's API pointlessly.
    if (reg.paymentStatus === "PAID") {
      return NextResponse.json({ success: true, registration: reg });
    }

    const flwSecret = process.env.FLUTTERWAVE_SECRET_KEY;
    const isLiveConfigured = !!flwSecret && !flwSecret.includes("xxxxxxxx");

    // CRITICAL: which branch runs is decided ONLY by isLiveConfigured (a
    // server-side environment fact), never by whether the client happened
    // to send a transactionId. The previous version fell through to
    // auto-approving the payment whenever transactionId was missing or
    // malformed — including when live keys WERE configured — which meant
    // anyone could mark any registration PAID with a bare POST request and
    // no transactionId at all. Do not weaken this condition.
    if (isLiveConfigured) {
      if (!transactionId || typeof transactionId !== "string" || transactionId.startsWith("FLW_DEMO")) {
        return NextResponse.json({ error: "Missing or invalid transaction reference." }, { status: 400 });
      }

      const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
        headers: { Authorization: `Bearer ${flwSecret}` },
      });

      const data = await response.json();

      const confirmedSuccessful =
        data.status === "success" &&
        data.data?.status === "successful" &&
        Number(data.data?.amount) >= reg.totalFee &&
        data.data?.currency === "NGN";

      if (confirmedSuccessful) {
        const updated = updatePaymentStatus(reference, "PAID", "Flutterwave", String(transactionId));
        return NextResponse.json({ success: true, registration: updated });
      } else {
        updatePaymentStatus(reference, "FAILED", "Flutterwave", String(transactionId));
        return NextResponse.json({ error: "Flutterwave transaction verification failed." }, { status: 400 });
      }
    }

    // Not configured with live keys — demo mode, for local development and
    // previewing the flow only. This branch can never run in an environment
    // where a real secret key is set.
    const updated = updatePaymentStatus(reference, "PAID", "Flutterwave", transactionId || `FLW_DEMO_${Date.now()}`);
    return NextResponse.json({
      success: true,
      message: "Payment verified successfully (Demo Mode).",
      registration: updated,
    });
  } catch (error: any) {
    console.error("Flutterwave verify failed:", error?.message || error);
    return NextResponse.json(
      { error: "Failed to verify Flutterwave payment." },
      { status: 500 }
    );
  }
}
