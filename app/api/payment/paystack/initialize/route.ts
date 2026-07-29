import { NextRequest, NextResponse } from "next/server";
import { getRegistrationByReference } from "@/lib/registrations-store";

export async function POST(req: NextRequest) {
  try {
    const { reference } = await req.json();

    if (!reference) {
      return NextResponse.json({ error: "Registration reference is required." }, { status: 400 });
    }

    const reg = getRegistrationByReference(reference);
    if (!reg) {
      return NextResponse.json({ error: "Registration not found." }, { status: 404 });
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const callbackUrl = `${origin}/enroll?step=3&ref=${reference}&gateway=paystack`;

    // If live or test Paystack secret key is configured
    if (paystackSecret && !paystackSecret.includes("xxxxxxxx")) {
      const response = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: reg.email,
          amount: reg.totalFee * 100, // amount in kobo
          reference: `${reg.reference}_${Date.now()}`,
          callback_url: callbackUrl,
          metadata: {
            custom_fields: [
              { display_name: "Student Name", variable_name: "student_name", value: reg.studentName },
              { display_name: "Programme", variable_name: "programme", value: reg.programmeName },
              { display_name: "Academy Ref", variable_name: "academy_ref", value: reg.reference },
            ],
          },
        }),
      });

      const data = await response.json();
      if (data.status && data.data?.authorization_url) {
        return NextResponse.json({
          success: true,
          authorizationUrl: data.data.authorization_url,
          accessCode: data.data.access_code,
          reference: data.data.reference,
          mode: "live",
        });
      }
    }

    // Interactive Demo Mode Fallback
    const demoTxRef = `PSTK_DEMO_${Date.now()}_${reg.reference}`;
    return NextResponse.json({
      success: true,
      authorizationUrl: `${callbackUrl}&trxref=${demoTxRef}&status=success`,
      reference: demoTxRef,
      mode: "demo",
      message: "Using simulated Paystack gateway for instant preview.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to initialize Paystack payment." },
      { status: 500 }
    );
  }
}
