import { NextRequest, NextResponse } from "next/server";
import { PROGRAMMES, VALID_PROMO_CODES, FeePlan } from "@/lib/programmes";
import {
  generateRegistrationReference,
  saveRegistration,
  StudentRegistration,
} from "@/lib/registrations-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      programmeId,
      feePlanId,
      schedule,
      studentName,
      studentAge,
      gender,
      nationality,
      previousExperience,
      parentName,
      email,
      phone,
      whatsapp,
      address,
      emergencyContact,
      notes,
      promoCode,
    } = body;

    // Basic validation
    if (!programmeId || !studentName || !parentName || !email || !phone || !nationality) {
      return NextResponse.json(
        { error: "Please fill in all required fields (Programme, Nationality, Student Name, Parent Name, Email, Phone)." },
        { status: 400 }
      );
    }

    const prog = PROGRAMMES.find((p) => p.id === programmeId);
    if (!prog) {
      return NextResponse.json({ error: "Invalid programme selected." }, { status: 400 });
    }

    // Resolve which fee plan applies. Programmes with feePlans (e.g.
    // Beginners' discounted Nigerians-only monthly plan) require the
    // applicant to pick one; the nationality restriction is re-checked
    // here server-side rather than trusted from the client.
    let chosenPlan: FeePlan | undefined;
    if (prog.feePlans && prog.feePlans.length > 0) {
      chosenPlan = prog.feePlans.find((p) => p.id === feePlanId) || prog.feePlans[0];
      if (chosenPlan.nigeriansOnly && nationality !== "Nigerian") {
        return NextResponse.json(
          { error: `The "${chosenPlan.label}" fee plan is only available to students with Nigerian nationality. Please choose a different plan.` },
          { status: 400 }
        );
      }
    }

    // Fee breakdown calculation
    const tuitionFee = chosenPlan ? chosenPlan.fee : prog.fee;
    const billingCycle = chosenPlan ? chosenPlan.billingCycle : prog.billingCycle;
    const registrationFee = prog.registrationFee;
    let discountAmount = 0;

    if (promoCode && VALID_PROMO_CODES[promoCode.toUpperCase()]) {
      const promo = VALID_PROMO_CODES[promoCode.toUpperCase()];
      discountAmount = Math.round((tuitionFee * promo.discountPercentage) / 100);
    }

    const totalFee = Math.max(0, tuitionFee + registrationFee - discountAmount);

    const reference = generateRegistrationReference();
    const now = new Date().toISOString();

    const newRegistration: StudentRegistration = {
      reference,
      programmeId: prog.id,
      programmeName: prog.name,
      billingCycle,
      schedule: schedule || prog.scheduleOptions[0],
      feePlanId: chosenPlan?.id,
      feePlanLabel: chosenPlan?.label,
      studentName: studentName.trim(),
      studentAge: Number(studentAge) || 0,
      gender: gender === "Female" ? "Female" : "Male",
      nationality: nationality.trim(),
      previousExperience: previousExperience || "",
      parentName: parentName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      whatsapp: whatsapp?.trim() || phone.trim(),
      address: address || "",
      emergencyContact: emergencyContact || "",
      notes: notes || "",
      tuitionFee,
      registrationFee,
      discountAmount,
      promoCode: promoCode ? promoCode.toUpperCase() : undefined,
      totalFee,
      paymentStatus: "PENDING",
      paymentGateway: "Pending",
      createdAt: now,
      updatedAt: now,
    };

    saveRegistration(newRegistration);

    return NextResponse.json({
      success: true,
      message: "Registration created successfully.",
      registration: newRegistration,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to create registration." },
      { status: 500 }
    );
  }
}
