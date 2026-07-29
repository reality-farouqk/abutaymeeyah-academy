import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import GeoPattern from "@/components/GeoPattern";
import RegistrationForm from "@/components/RegistrationForm";
import { PROGRAMMES, formatNaira } from "@/lib/programmes";
import { learningPhotos } from "@/lib/stock-images";

export const metadata: Metadata = {
  title: "Admissions",
  description:
    "Start your enrollment at Abu Taymeeyah Academy — view programme fees, the 5-step admission process, and register online.",
  alternates: { canonical: "/admissions" },
};

const steps = [
  { title: "Choose Programme", description: "Pick the class level that fits the student's current stage." },
  { title: "Complete Registration", description: "Fill in the registration form with student and guardian details." },
  { title: "Pay Tuition Online", description: "Complete payment for the chosen programme via Paystack or Flutterwave." },
  { title: "Receive Digital Receipt", description: "Get an instant verification receipt with reference code and onboarding guide." },
  { title: "Begin Classes", description: "Join your assigned class slot and start your Qur'an journey." },
];

export default function AdmissionsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy-gradient text-white py-20">
        <Image src={learningPhotos[1].src} alt={learningPhotos[1].alt} fill className="object-cover opacity-20" priority />
        <div className="absolute inset-0 bg-navy-gradient opacity-90" />
        <GeoPattern className="absolute inset-0 opacity-20" />
        <div className="relative mx-auto max-w-6xl px-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold-light">Admissions Open</p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl">Qur&apos;anic Learning Admissions</h1>
            <p className="mt-3 max-w-xl text-white/75 leading-relaxed text-sm">
              Structured Qur'an memorization, Tajweed mastery, and Islamic studies with qualified tutors.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/enroll"
              className="rounded-sm bg-gold px-6 py-3 text-sm font-semibold text-navy-deep hover:bg-gold-light transition-colors focus-ring"
            >
              Start Registration
            </Link>
            <Link
              href="/admissions/status"
              className="rounded-sm border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors focus-ring"
            >
              Check Status & Receipt
            </Link>
          </div>
        </div>
      </section>

      {/* Admission Process */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <SectionHeading eyebrow="How it works" title="5-Step Admission Process" align="center" />
        <ol className="mt-12 grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((s, i) => (
            <li key={s.title} className="relative rounded-sm border border-navy/10 bg-white p-6 shadow-sm">
              <span className="step-count text-3xl text-gold-dim">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-display text-lg text-navy">{s.title}</h3>
              <p className="mt-1.5 text-xs text-navy/65 leading-relaxed">{s.description}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Schedule & Fees Table */}
      <section className="bg-mist py-16">
        <div className="mx-auto max-w-5xl px-5">
          <SectionHeading eyebrow="Tuition & Fees" title="Academy Programme Fees" align="center" />
          <div className="mt-10 overflow-hidden rounded-sm border border-navy/10 bg-white shadow-sm">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-navy text-white text-xs font-mono uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">Programme</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Payment Cycle</th>
                  <th className="px-6 py-4 font-medium">Tuition Fee</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/10">
                {PROGRAMMES.map((prog) => (
                  <tr key={prog.id} className="hover:bg-navy/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-navy">{prog.name}</p>
                      <p className="text-xs text-navy/60">{prog.subtitle}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-navy/70">{prog.category}</td>
                    <td className="px-6 py-4 text-xs text-navy/70">{prog.billingCycle}</td>
                    <td className="px-6 py-4 font-mono font-bold text-navy">{formatNaira(prog.fee)}</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/enroll?step=0`}
                        className="inline-flex items-center rounded-sm bg-gold/20 text-navy-deep border border-gold/40 px-3 py-1.5 text-xs font-semibold hover:bg-gold hover:text-navy transition-colors"
                      >
                        Enroll Now
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-center text-xs text-navy/50">
            A discounted Beginners Classes monthly plan (₦7,000/month) is available to students with Nigerian nationality — select it on the registration form.
          </p>
        </div>
      </section>

      {/* Registration Form preview/direct fill */}
      <section className="mx-auto max-w-3xl px-5 py-16">
        <SectionHeading eyebrow="Quick Registration" title="Online Registration Form" align="center" />
        <p className="mt-3 text-center text-sm text-navy/60">
          Fill out your information below to register and proceed to tuition payment.
        </p>

        <RegistrationForm />
      </section>
    </>
  );
}
