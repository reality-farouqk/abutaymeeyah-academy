import { NextRequest, NextResponse } from "next/server";
import { getRegistrationByReference } from "@/lib/registrations-store";

export async function POST(req: NextRequest) {
  try {
    const { reference } = await req.json();

    if (!reference) {
      return NextResponse.json({ error: "Registration reference required." }, { status: 400 });
    }

    const reg = getRegistrationByReference(reference);
    if (!reg) {
      return NextResponse.json({ error: "Registration not found." }, { status: 404 });
    }

    const flwSecret = process.env.FLUTTERWAVE_SECRET_KEY;
    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const redirectUrl = `${origin}/enroll?step=3&ref=${reference}&gateway=flutterwave`;

    if (flwSecret && !flwSecret.includes("xxxxxxxx")) {
      const txRef = `FLW_${reg.reference}_${Date.now()}`;
      const response = await fetch("https://api.flutterwave.com/v3/payments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${flwSecret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tx_ref: txRef,
          amount: reg.totalFee,
          currency: "NGN",
          redirect_url: redirectUrl,
          customer: {
            email: reg.email,
            phonenumber: reg.phone,
            name: reg.parentName,
          },
          customizations: {
            title: "Abu Taymeeyah Academy Tuition",
            description: `Tuition fee for ${reg.programmeName}`,
            logo: `${origin}/logo.jpg`,
          },
        }),
      });

      const data = await response.json();
      if (data.status === "success" && data.data?.link) {
        return NextResponse.json({
          success: true,
          link: data.data.link,
          txRef,
          mode: "live",
        });
      }
    }

    // Interactive Demo Mode Fallback
    const demoTxRef = `FLW_DEMO_${Date.now()}_${reg.reference}`;
    return NextResponse.json({
      success: true,
      link: `${redirectUrl}&transaction_id=${demoTxRef}&status=successful`,
      txRef: demoTxRef,
      mode: "demo",
      message: "Using simulated Flutterwave gateway for instant preview.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to initialize Flutterwave payment." },
      { status: 500 }
    );
  }
}
