"use client";

import { useState } from "react";
import Image from "next/image";
import GeoPattern from "@/components/GeoPattern";
import PlaceholderNote from "@/components/PlaceholderNote";
import { quranPhotos } from "@/lib/stock-images";

const programmes = [
  "Beginners Classes",
  "Intermediate Classes",
  "Advanced Classes",
  "Private Classes",
  "Muraajah Classes",
  "Private Tajweed",
];

const steps = ["Choose Programme", "Registration", "Payment", "Confirmation"];

export default function EnrollPage() {
  const [step, setStep] = useState(0);
  const [programme, setProgramme] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <section className="relative overflow-hidden bg-navy-gradient text-white py-20">
        <Image src={quranPhotos[0].src} alt={quranPhotos[0].alt} fill className="object-cover opacity-20" priority />
        <div className="absolute inset-0 bg-navy-gradient opacity-90" />
        <GeoPattern className="absolute inset-0 opacity-20" />
        <div className="relative mx-auto max-w-4xl px-5 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold-light">Enroll Now</p>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl">Begin Your Qur&apos;an Journey Today</h1>
          <p className="mt-4 text-white/75 leading-relaxed max-w-lg mx-auto">
            Structured teaching, qualified tutors, and a supportive community —
            enrollment takes just a few minutes.
          </p>
        </div>
      </section>

      {/* Why Enroll */}
      <section className="mx-auto max-w-5xl px-5 py-16 grid sm:grid-cols-3 gap-6">
        {[
          ["Qualified Tutors", "Experienced teachers guiding every step."],
          ["Small Classes", "10–15 students for real, personal attention."],
          ["Clear Structure", "A roadmap from beginner to complete memorization."],
        ].map(([title, desc]) => (
          <div key={title} className="rounded-sm border border-navy/10 bg-white p-6">
            <h3 className="font-display text-lg text-navy">{title}</h3>
            <p className="mt-1.5 text-sm text-navy/65">{desc}</p>
          </div>
        ))}
      </section>

      {/* Step wizard */}
      <section className="bg-mist py-16">
        <div className="mx-auto max-w-3xl px-5">
          {/* Step indicator */}
          <ol className="flex items-center justify-between">
            {steps.map((s, i) => (
              <li key={s} className="flex-1 flex items-center">
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div
                    className={`h-9 w-9 arch-clip flex items-center justify-center font-mono text-xs ${
                      i <= step ? "bg-navy text-gold-light" : "bg-white border border-navy/20 text-navy/40"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span className={`text-xs text-center ${i <= step ? "text-navy font-medium" : "text-navy/40"}`}>
                    {s}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-px flex-1 -mt-6 ${i < step ? "bg-navy" : "bg-navy/15"}`} />
                )}
              </li>
            ))}
          </ol>

          <div className="mt-10 rounded-sm border border-navy/10 bg-white p-8">
            {step === 0 && (
              <div>
                <h2 className="font-display text-2xl text-navy">Choose a Programme</h2>
                <p className="mt-1 text-sm text-navy/60">Select the class that fits the student&apos;s level.</p>
                <div className="mt-6 grid sm:grid-cols-2 gap-3">
                  {programmes.map((p) => (
                    <button
                      key={p}
                      onClick={() => setProgramme(p)}
                      className={`text-left rounded-sm border px-5 py-4 text-sm transition-colors focus-ring ${
                        programme === p
                          ? "border-gold bg-gold/10 text-navy font-semibold"
                          : "border-navy/15 text-navy/75 hover:border-navy/30"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  disabled={!programme}
                  onClick={() => setStep(1)}
                  className="mt-8 inline-flex items-center rounded-sm bg-navy px-7 py-3.5 text-sm font-semibold text-white disabled:opacity-40 hover:bg-navy-light transition-colors focus-ring"
                >
                  Continue
                </button>
              </div>
            )}

            {step === 1 && (
              <form
                className="space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  setStep(2);
                }}
              >
                <h2 className="font-display text-2xl text-navy">Registration Details</h2>
                <p className="text-sm text-navy/60">Programme selected: <span className="font-semibold text-navy">{programme}</span></p>
                <div className="grid sm:grid-cols-2 gap-5">
                  {["Parent Name", "Student Name", "Email", "Phone Number"].map((label) => (
                    <label key={label} className="text-sm text-navy/80">
                      {label}
                      <input required className="mt-1.5 w-full rounded-sm border border-navy/20 px-4 py-2.5 text-sm text-navy focus-ring outline-none" />
                    </label>
                  ))}
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="rounded-sm border border-navy/20 px-6 py-3 text-sm font-semibold text-navy hover:bg-navy/5 transition-colors focus-ring"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="rounded-sm bg-navy px-7 py-3 text-sm font-semibold text-white hover:bg-navy-light transition-colors focus-ring"
                  >
                    Continue to Payment
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <div>
                <h2 className="font-display text-2xl text-navy">Payment</h2>
                <p className="mt-1 text-sm text-navy/60">
                  Tuition for {programme} is paid securely online.
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <button
                    onClick={() => {
                      setSubmitted(true);
                      setStep(3);
                    }}
                    className="rounded-sm bg-gold px-6 py-3 text-sm font-semibold text-navy-deep hover:bg-gold-light transition-colors focus-ring"
                  >
                    Pay with Paystack
                  </button>
                  <button
                    onClick={() => {
                      setSubmitted(true);
                      setStep(3);
                    }}
                    className="rounded-sm border border-navy/20 px-6 py-3 text-sm font-semibold text-navy hover:bg-navy/5 transition-colors focus-ring"
                  >
                    Pay with Flutterwave
                  </button>
                </div>
                <div className="mt-4">
                  <PlaceholderNote>Payment buttons are a working preview — connect a Paystack or Flutterwave account to process real payments</PlaceholderNote>
                </div>
                <button onClick={() => setStep(1)} className="mt-6 block text-sm text-navy/60 hover:text-navy">
                  &larr; Back to registration
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="text-center py-6">
                <div className="mx-auto h-14 w-14 arch-clip bg-gold flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F1E3D" strokeWidth="2.5">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="mt-5 font-display text-2xl text-navy">Registration Received</h2>
                <p className="mt-2 text-sm text-navy/65 max-w-sm mx-auto">
                  {submitted
                    ? `Thank you for enrolling in ${programme}. A confirmation email and receipt will be sent once payment integration is connected.`
                    : "Your enrollment step is complete."}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
