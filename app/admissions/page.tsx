import type { Metadata } from "next";
import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import PlaceholderNote from "@/components/PlaceholderNote";
import GeoPattern from "@/components/GeoPattern";
import RegistrationForm from "@/components/RegistrationForm";
import { learningPhotos } from "@/lib/stock-images";

export const metadata: Metadata = { title: "Admissions | Abu Taymeeyah Academy" };

const steps = [
  { title: "Choose Programme", description: "Pick the class level that fits the student's current stage." },
  { title: "Complete Registration", description: "Fill in the registration form with student and guardian details." },
  { title: "Pay Tuition", description: "Complete payment for the chosen programme, termly or monthly." },
  { title: "Receive Confirmation", description: "Get an email confirmation and receipt once payment is processed." },
  { title: "Begin Classes", description: "Join your assigned class and start the memorization journey." },
];

export default function AdmissionsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy-gradient text-white py-20">
        <Image src={learningPhotos[1].src} alt={learningPhotos[1].alt} fill className="object-cover opacity-20" priority />
        <div className="absolute inset-0 bg-navy-gradient opacity-90" />
        <GeoPattern className="absolute inset-0 opacity-20" />
        <div className="relative mx-auto max-w-6xl px-5">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold-light">Admissions</p>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl">Admissions Open</h1>
          <p className="mt-4 max-w-xl text-white/75 leading-relaxed">
            Five simple steps from choosing a programme to your first class.
          </p>
        </div>
      </section>

      {/* Process */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <SectionHeading eyebrow="How it works" title="Admission Process" align="center" />
        <ol className="mt-12 grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((s, i) => (
            <li key={s.title} className="relative rounded-sm border border-navy/10 bg-white p-6">
              <span className="step-count text-3xl text-gold-dim">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-display text-lg text-navy">{s.title}</h3>
              <p className="mt-1.5 text-sm text-navy/65 leading-relaxed">{s.description}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Fees */}
      <section className="bg-mist py-20">
        <div className="mx-auto max-w-4xl px-5">
          <SectionHeading eyebrow="Tuition" title="Fees" align="center" />
          <div className="mt-10 overflow-hidden rounded-sm border border-navy/10 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-navy text-white">
                <tr>
                  <th className="px-6 py-4 font-mono text-xs uppercase tracking-widest font-medium">Programme Group</th>
                  <th className="px-6 py-4 font-mono text-xs uppercase tracking-widest font-medium">Payment Cycle</th>
                  <th className="px-6 py-4 font-mono text-xs uppercase tracking-widest font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-navy/10">
                  <td className="px-6 py-4 text-navy">O&apos;Level Classes</td>
                  <td className="px-6 py-4 text-navy/70">Termly</td>
                  <td className="px-6 py-4 text-navy/50 font-mono text-xs">Placeholder</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-navy">Advanced Classes</td>
                  <td className="px-6 py-4 text-navy/70">Monthly</td>
                  <td className="px-6 py-4 text-navy/50 font-mono text-xs">Placeholder</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-center">
            <PlaceholderNote>Exact tuition amounts to be supplied by the academy</PlaceholderNote>
          </div>
        </div>
      </section>

      {/* Registration form */}
      <section className="mx-auto max-w-3xl px-5 py-20">
        <SectionHeading eyebrow="Register" title="Registration Form" align="center" />
        <p className="mt-4 text-center text-sm text-navy/60">
          This form is a working preview. Connect it to a form handler or your
          backend of choice to collect real submissions.
        </p>

        <RegistrationForm />
      </section>

      {/* Payment */}
      <section className="bg-mist py-20">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <SectionHeading eyebrow="Payment" title="Online Payment" align="center" />
          <p className="mt-4 text-sm text-navy/65 leading-relaxed">
            Once registration is complete, tuition is paid securely online.
            After payment, you&apos;ll automatically receive a confirmation
            email, a receipt, and the academy will be notified.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button className="rounded-sm bg-navy px-6 py-3 text-sm font-semibold text-white opacity-70 cursor-not-allowed" title="Connect Paystack to enable">
              Pay with Paystack
            </button>
            <button className="rounded-sm border border-navy/20 px-6 py-3 text-sm font-semibold text-navy opacity-70 cursor-not-allowed" title="Connect Flutterwave to enable">
              Pay with Flutterwave
            </button>
          </div>
          <div className="mt-4 flex justify-center">
            <PlaceholderNote>Payment buttons are placeholders — connect a Paystack or Flutterwave account to activate</PlaceholderNote>
          </div>
        </div>
      </section>
    </>
  );
}
