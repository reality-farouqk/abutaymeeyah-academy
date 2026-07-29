import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { updatePaymentStatus, getRegistrationByReference } from "@/lib/registrations-store";

/**
 * Flutterwave webhook receiver.
 *
 * Set this URL in your Flutterwave dashboard under
 * Settings -> Webhooks (for both Live and Test environments):
 *   https://<your-domain>/api/payment/flutterwave/webhook
 *
 * In that same dashboard screen, set a "Secret Hash" (any random string
 * you choose) and store the identical value as FLUTTERWAVE_SECRET_HASH in
 * this app's environment variables. Flutterwave is NOT the one handing you
 * this value — you invent it yourself and put it in both places. It is a
 * separate credential from FLUTTERWAVE_SECRET_KEY, FLUTTERWAVE_CLIENT_ID,
 * and FLUTTERWAVE_ENCRYPTION_KEY, none of which are used for webhook
 * verification.
 *
 * Why a webhook at all, given /verify already exists? The client-driven
 * /verify route only fires if the customer's browser makes it back to your
 * redirect_url. If they close the tab, lose connection, or the redirect
 * fails, that route never runs and the registration stays PENDING forever.
 * The webhook is Flutterwave calling *your server* directly, so payment
 * confirmation doesn't depend on the customer's browser at all.
 */

function timingSafeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function isValidSignature(rawBody: string, headers: Headers, secretHash: string): boolean {
  // Legacy / most-documented method: Flutterwave echoes your secret hash
  // back verbatim in the `verif-hash` header — a direct string match.
  const verifHash = headers.get("verif-hash");
  if (verifHash && timingSafeEqual(verifHash, secretHash)) {
    return true;
  }

  // Newer method some accounts use: `flutterwave-signature` is an
  // HMAC-SHA256 of the raw request body, keyed with your secret hash,
  // base64-encoded.
  const signature = headers.get("flutterwave-signature");
  if (signature) {
    const computed = crypto.createHmac("sha256", secretHash).update(rawBody).digest("base64");
    if (timingSafeEqual(signature, computed)) {
      return true;
    }
  }

  return false;
}

// Extracts the registration reference (e.g. "ATA-123456") back out of the
// tx_ref we generated in /initialize, which looks like
// "FLW_ATA-123456_1690000000000".
function extractRegistrationReference(txRef: string): string | null {
  const match = txRef.match(/^FLW_(.+)_\d+$/);
  return match ? match[1] : null;
}

export async function POST(req: NextRequest) {
  const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;

  if (!secretHash) {
    console.error("FLUTTERWAVE_SECRET_HASH is not set — rejecting webhook.");
    return NextResponse.json({ error: "Webhook not configured." }, { status: 500 });
  }

  // Read the raw body ourselves (needed for HMAC verification) before
  // parsing it as JSON.
  const rawBody = await req.text();

  if (!isValidSignature(rawBody, req.headers, secretHash)) {
    console.warn("Rejected Flutterwave webhook with invalid/missing signature.");
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  // Acknowledge fast, then do the real work. Flutterwave will retry if it
  // doesn't get a 2xx quickly, so we keep this handler lightweight and
  // avoid slow work before responding where possible.
  try {
    const event = payload?.event;
    const data = payload?.data;
    const txRef: string | undefined = data?.tx_ref;
    const transactionId = data?.id;

    if (event !== "charge.completed" || !txRef || !transactionId) {
      // Not an event we act on (e.g. transfer events) — acknowledge and skip.
      return NextResponse.json({ received: true });
    }

    const reference = extractRegistrationReference(txRef);
    if (!reference) {
      console.warn(`Could not parse registration reference from tx_ref: ${txRef}`);
      return NextResponse.json({ received: true });
    }

    const reg = getRegistrationByReference(reference);
    if (!reg) {
      console.warn(`Webhook for unknown registration reference: ${reference}`);
      return NextResponse.json({ received: true });
    }

    // Idempotency: if we've already marked this paid (e.g. via the
    // client-driven /verify route, or a duplicate webhook delivery),
    // there's nothing left to do.
    if (reg.paymentStatus === "PAID") {
      return NextResponse.json({ received: true, alreadyProcessed: true });
    }

    // Never trust the webhook payload's amount/status directly — re-verify
    // the transaction against Flutterwave's API using the transaction id,
    // per Flutterwave's own best-practice guidance.
    const flwSecret = process.env.FLUTTERWAVE_SECRET_KEY;
    if (!flwSecret) {
      console.error("FLUTTERWAVE_SECRET_KEY is not set — cannot confirm transaction.");
      return NextResponse.json({ error: "Server misconfigured." }, { status: 500 });
    }

    const verifyRes = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      { headers: { Authorization: `Bearer ${flwSecret}` } }
    );
    const verifyData = await verifyRes.json();

    const confirmedSuccessful =
      verifyData?.status === "success" &&
      verifyData?.data?.status === "successful" &&
      verifyData?.data?.tx_ref === txRef &&
      Number(verifyData?.data?.amount) >= reg.totalFee &&
      verifyData?.data?.currency === "NGN";

    if (confirmedSuccessful) {
      updatePaymentStatus(reference, "PAID", "Flutterwave", String(transactionId));
    } else {
      updatePaymentStatus(reference, "FAILED", "Flutterwave", String(transactionId));
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Error processing Flutterwave webhook:", error?.message || error);
    // Still acknowledge with 200 so Flutterwave doesn't hammer retries for
    // an error on our side that a retry won't fix; the /verify route and
    // manual reconciliation remain as a fallback.
    return NextResponse.json({ received: true });
  }
}