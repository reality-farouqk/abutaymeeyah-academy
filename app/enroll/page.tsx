"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import GeoPattern from "@/components/GeoPattern";
import ReceiptView from "@/components/ReceiptView";
import RegistrationForm from "@/components/RegistrationForm";
import { PROGRAMMES, Programme, formatNaira, VALID_PROMO_CODES } from "@/lib/programmes";
import { StudentRegistration } from "@/lib/registrations-store";
import { quranPhotos } from "@/lib/stock-images";

const steps = ["Choose Programme", "Student Details", "Payment & Review", "Confirmation"];

function EnrollWizard() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const stepParam = searchParams.get("step");
  const refParam = searchParams.get("ref");
  const gatewayParam = searchParams.get("gateway");
  const trxrefParam = searchParams.get("trxref") || searchParams.get("transaction_id");

  const [step, setStep] = useState<number>(0);
  const [selectedProgramme, setSelectedProgramme] = useState<Programme>(PROGRAMMES[0]);
  const [currentRegistration, setCurrentRegistration] = useState<StudentRegistration | null>(null);

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Sync step from query parameter or payment redirects
  useEffect(() => {
    if (stepParam) {
      const parsedStep = parseInt(stepParam, 10);
      // Step 3 (the "payment complete" confirmation screen) is never trusted
      // directly from a URL query param — anyone could hand-edit ?step=3
      // into the address bar. It's only ever set programmatically below,
      // after the server confirms paymentStatus === "PAID".
      if (!isNaN(parsedStep) && parsedStep !== 3) {
        setStep(parsedStep);
      }
    }

    if (refParam) {
      // Fetch existing registration details
      fetch(`/api/registration/status?query=${refParam}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.registrations && data.registrations[0]) {
            const reg: StudentRegistration = data.registrations[0];
            setCurrentRegistration(reg);

            const foundProg = PROGRAMMES.find((p) => p.id === reg.programmeId);
            if (foundProg) setSelectedProgramme(foundProg);

            if (trxrefParam && gatewayParam) {
              // Returning from a payment gateway redirect — verify with the
              // gateway's API before showing anything resembling success.
              verifyPayment(reg.reference, gatewayParam, trxrefParam);
            } else if (reg.paymentStatus === "PAID") {
              // Revisiting a link for a registration that's already been
              // confirmed paid (e.g. a saved receipt URL) — safe to show.
              setStep(3);
            } else {
              // Registration exists but payment isn't confirmed yet (e.g. a
              // stale/incomplete ?step=3 link) — send them back to the
              // payment step instead of the confirmation screen.
              setStep(2);
            }
          }
        })
        .catch(() => {});
    }
  }, [stepParam, refParam, gatewayParam, trxrefParam]);

  const verifyPayment = async (reference: string, gateway: string, trxRef: string) => {
    setPaymentLoading(true);
    setPaymentError(null);
    setStep(2); // Stay on the payment step while we confirm — never jump ahead speculatively.

    try {
      const endpoint =
        gateway === "flutterwave"
          ? "/api/payment/flutterwave/verify"
          : "/api/payment/paystack/verify";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, trxRef, transactionId: trxRef }),
      });

      const data = await res.json();

      // Only trust an explicit, server-confirmed PAID status — not just a
      // 200 response — before ever revealing the confirmation screen.
      if (!res.ok || data.registration?.paymentStatus !== "PAID") {
        throw new Error(
          data.error ||
            "We couldn't confirm your payment yet. If you completed payment, please contact us with your registration reference before retrying — do not pay twice."
        );
      }

      setCurrentRegistration(data.registration);
      setStep(3); // Step 3: Receipt & Confirmation — only reachable from here.
    } catch (err: any) {
      setPaymentError(err.message || "Failed to verify payment.");
      setStep(2); // Make sure the error is visible on the payment step.
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleRegistrationSuccess = (regData: StudentRegistration) => {
    setCurrentRegistration(regData);
    setStep(2);
  };

  const handlePaystackPay = async () => {
    if (!currentRegistration) return;
    setPaymentLoading(true);
    setPaymentError(null);

    try {
      const res = await fetch("/api/payment/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: currentRegistration.reference }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start Paystack payment.");

      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      }
    } catch (err: any) {
      setPaymentError(err.message || "Paystack initialization error.");
      setPaymentLoading(false);
    }
  };

  const handleFlutterwavePay = async () => {
    if (!currentRegistration) return;
    setPaymentLoading(true);
    setPaymentError(null);

    try {
      const res = await fetch("/api/payment/flutterwave/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: currentRegistration.reference }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start Flutterwave payment.");

      if (data.link) {
        window.location.href = data.link;
      }
    } catch (err: any) {
      setPaymentError(err.message || "Flutterwave initialization error.");
      setPaymentLoading(false);
    }
  };

  return (
    <>
      {/* Banner */}
      <section className="relative overflow-hidden bg-navy-gradient text-white py-16">
        <Image src={quranPhotos[0].src} alt={quranPhotos[0].alt} fill className="object-cover opacity-20" priority />
        <div className="absolute inset-0 bg-navy-gradient opacity-90" />
        <GeoPattern className="absolute inset-0 opacity-20" />
        <div className="relative mx-auto max-w-4xl px-5 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold-light">Online Enrollment</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">Qur&apos;an Student Registration</h1>
          <p className="mt-3 text-white/75 text-sm max-w-lg mx-auto leading-relaxed">
            Select your class level, submit student details, and complete your tuition payment securely.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <section className="bg-mist py-12 min-h-screen">
        <div className="mx-auto max-w-4xl px-5">
          {/* Step Indicator */}
          <ol className="flex items-center justify-between bg-white p-4 sm:p-6 border border-navy/10 rounded-sm shadow-sm">
            {steps.map((s, i) => (
              <li key={s} className="flex-1 flex items-center">
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <div
                    className={`h-9 w-9 arch-clip flex items-center justify-center font-mono text-xs font-bold ${
                      i <= step ? "bg-navy text-gold-light" : "bg-white border border-navy/20 text-navy/40"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span className={`text-[11px] sm:text-xs text-center font-medium ${i <= step ? "text-navy font-semibold" : "text-navy/40"}`}>
                    {s}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-px flex-1 -mt-4 ${i < step ? "bg-navy" : "bg-navy/15"}`} />
                )}
              </li>
            ))}
          </ol>

          {/* Step Content */}
          <div className="mt-8">
            {/* Step 0: Choose Programme */}
            {step === 0 && (
              <div className="bg-white p-6 sm:p-10 border border-navy/10 rounded-sm shadow-sm">
                <div className="text-center max-w-lg mx-auto">
                  <h2 className="font-display text-2xl sm:text-3xl text-navy">Choose Your Programme</h2>
                  <p className="mt-2 text-sm text-navy/60">
                    Select a class programme tailored for your current level and learning goals.
                  </p>
                </div>

                <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {PROGRAMMES.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProgramme(p)}
                      className={`cursor-pointer rounded-sm border p-6 flex flex-col justify-between transition-all relative ${
                        selectedProgramme.id === p.id
                          ? "border-gold bg-gold/5 ring-2 ring-gold/50 shadow-md"
                          : "border-navy/15 bg-white hover:border-navy/30"
                      }`}
                    >
                      {p.popular && (
                        <span className="absolute -top-3 right-4 bg-gold text-navy-deep font-mono text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full">
                          Most Popular
                        </span>
                      )}

                      <div>
                        <span className="text-[10px] font-mono font-semibold uppercase text-gold-dim tracking-wider">
                          {p.category}
                        </span>
                        <h3 className="font-display text-lg text-navy mt-1">{p.name}</h3>
                        <p className="text-xs text-navy/60 mt-1">{p.subtitle}</p>

                        <div className="mt-4 pt-3 border-t border-navy/10 flex items-baseline gap-1">
                          <span className="font-mono text-2xl font-bold text-navy">{formatNaira(p.fee)}</span>
                          <span className="text-xs text-navy/60 font-medium">/ {p.billingCycle}</span>
                        </div>

                        <ul className="mt-4 space-y-2 text-xs text-navy/75">
                          {p.features.map((feat) => (
                            <li key={feat} className="flex items-start gap-2">
                              <span className="text-gold font-bold">✓</span>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6 pt-4 border-t border-navy/10">
                        <button
                          type="button"
                          className={`w-full py-2.5 text-xs font-semibold rounded-sm transition-colors ${
                            selectedProgramme.id === p.id
                              ? "bg-navy text-white"
                              : "bg-navy/5 text-navy hover:bg-navy/10"
                          }`}
                        >
                          {selectedProgramme.id === p.id ? "Selected" : "Select Class"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex justify-end">
                  <button
                    onClick={() => setStep(1)}
                    className="inline-flex items-center rounded-sm bg-navy px-8 py-3.5 text-sm font-semibold text-white hover:bg-navy-light transition-colors focus-ring"
                  >
                    Continue to Student Details &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* Step 1: Student Details Form */}
            {step === 1 && (
              <div className="bg-white p-6 sm:p-10 border border-navy/10 rounded-sm shadow-sm">
                <div className="flex justify-between items-center border-b border-navy/10 pb-4">
                  <div>
                    <h2 className="font-display text-2xl text-navy">Registration Form</h2>
                    <p className="text-xs text-navy/60 mt-1">
                      Selected Programme: <span className="font-semibold text-navy">{selectedProgramme.name} ({formatNaira(selectedProgramme.fee)})</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setStep(0)}
                    className="text-xs font-semibold text-navy/60 hover:text-navy underline"
                  >
                    Change Class
                  </button>
                </div>

                <RegistrationForm
                  initialProgrammeId={selectedProgramme.id}
                  onSuccess={handleRegistrationSuccess}
                  submitButtonText="Save Registration & Continue to Payment"
                />
              </div>
            )}

            {/* Step 2: Payment & Review */}
            {step === 2 && currentRegistration && (
              <div className="bg-white p-6 sm:p-10 border border-navy/10 rounded-sm shadow-sm">
                <div className="text-center max-w-md mx-auto">
                  <span className="font-mono text-xs font-semibold text-gold-dim uppercase tracking-wider">
                    Registration Ref: {currentRegistration.reference}
                  </span>
                  <h2 className="font-display text-2xl text-navy mt-1">Complete Tuition Payment</h2>
                  <p className="text-sm text-navy/65 mt-1">
                    Review your fee breakdown and choose your preferred online payment gateway.
                  </p>
                </div>

                {paymentLoading && trxrefParam && (
                  <div className="mt-6 p-4 rounded bg-navy/5 border border-navy/15 text-navy text-sm text-center">
                    Confirming your payment with the gateway — please don&apos;t close this page…
                  </div>
                )}

                {paymentError && (
                  <div className="mt-6 p-4 rounded bg-red-50 border border-red-200 text-red-700 text-sm text-center">
                    {paymentError}
                  </div>
                )}

                {/* Summary Card */}
                <div className="mt-8 bg-mist p-6 rounded-sm border border-navy/10">
                  <div className="grid sm:grid-cols-2 gap-4 text-sm pb-4 border-b border-navy/10">
                    <div>
                      <p className="text-xs text-navy/60 font-mono uppercase">Student Name</p>
                      <p className="font-semibold text-navy">{currentRegistration.studentName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-navy/60 font-mono uppercase">Programme</p>
                      <p className="font-semibold text-navy">{currentRegistration.programmeName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-navy/60 font-mono uppercase">Parent Email</p>
                      <p className="font-semibold text-navy">{currentRegistration.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-navy/60 font-mono uppercase">Assigned Schedule</p>
                      <p className="font-semibold text-navy">{currentRegistration.schedule}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-navy/70">
                      <span>Tuition Fee ({currentRegistration.billingCycle})</span>
                      <span className="font-mono font-medium">{formatNaira(currentRegistration.tuitionFee)}</span>
                    </div>
                    <div className="flex justify-between text-navy/70">
                      <span>Admission & Registration Form</span>
                      <span className="font-mono font-medium">{formatNaira(currentRegistration.registrationFee)}</span>
                    </div>

                    {currentRegistration.discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-medium">
                        <span>Scholarship Discount ({currentRegistration.promoCode})</span>
                        <span className="font-mono">-{formatNaira(currentRegistration.discountAmount)}</span>
                      </div>
                    )}

                    <div className="pt-3 border-t border-navy/15 flex justify-between font-bold text-lg text-navy">
                      <span>Total Fee</span>
                      <span className="font-mono">{formatNaira(currentRegistration.totalFee)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Gateway Options */}
                <div className="mt-8 text-center">
                  <p className="text-xs font-mono font-semibold uppercase text-navy/60 mb-4">Select Secure Payment Gateway</p>
                  
                  <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                    <button
                      onClick={handlePaystackPay}
                      disabled={paymentLoading}
                      className="flex flex-col items-center justify-center p-5 rounded-sm border border-navy/20 bg-white hover:border-gold hover:bg-gold/5 transition-colors focus-ring"
                    >
                      <span className="font-display font-bold text-lg text-navy">Paystack</span>
                      <span className="text-[11px] text-navy/60 mt-1">Cards, Bank Transfer, USSD</span>
                    </button>

                    <button
                      onClick={handleFlutterwavePay}
                      disabled={paymentLoading}
                      className="flex flex-col items-center justify-center p-5 rounded-sm border border-navy/20 bg-white hover:border-gold hover:bg-gold/5 transition-colors focus-ring"
                    >
                      <span className="font-display font-bold text-lg text-navy">Flutterwave</span>
                      <span className="text-[11px] text-navy/60 mt-1">Cards, Mobile Money, Transfers</span>
                    </button>
                  </div>

                  <p className="text-xs text-navy/50 mt-4">
                    Instant automated verification & receipt generation upon payment completion.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Receipt & Confirmation — gated on a server-confirmed
                PAID status, not just on `step` reaching 3, so this can
                never render for a pending/failed payment. */}
            {step === 3 && currentRegistration && currentRegistration.paymentStatus === "PAID" && (
              <div className="space-y-6">
                <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-sm text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xl mb-3">
                    ✓
                  </div>
                  <h2 className="font-display text-2xl text-emerald-900">Registration & Payment Complete!</h2>
                  <p className="text-sm text-emerald-800 mt-1 max-w-md mx-auto">
                    SubhanAllah! Student registration for <span className="font-semibold">{currentRegistration.studentName}</span> has been confirmed.
                  </p>
                </div>

                <ReceiptView
                  registration={currentRegistration}
                  onBackToEnrollment={() => {
                    setCurrentRegistration(null);
                    setStep(0);
                    router.push("/enroll");
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default function EnrollPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-navy/60">Loading wizard...</div>}>
      <EnrollWizard />
    </Suspense>
  );
}
