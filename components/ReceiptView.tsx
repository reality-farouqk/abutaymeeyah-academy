"use client";

import { StudentRegistration } from "@/lib/registrations-store";
import { formatNaira } from "@/lib/programmes";

interface ReceiptViewProps {
  registration: StudentRegistration;
  onBackToEnrollment?: () => void;
}

export default function ReceiptView({ registration, onBackToEnrollment }: ReceiptViewProps) {
  const handlePrint = () => {
    window.print();
  };

  const isPaid = registration.paymentStatus === "PAID";

  return (
    <div className="mx-auto max-w-2xl bg-white border border-navy/15 rounded-sm p-6 sm:p-10 shadow-sm print:border-none print:shadow-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-navy/10 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display text-xl text-navy font-bold">Abu Taymeeyah Academy</span>
          </div>
          <p className="text-xs text-navy/60 mt-1">Qur&apos;anic Memorisation & Training Institute</p>
          <p className="text-xs text-navy/50">Official Enrollment & Tuition Receipt</p>
        </div>

        <div className="text-left sm:text-right">
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider ${
              isPaid
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : "bg-amber-100 text-amber-800 border border-amber-300"
            }`}
          >
            {isPaid ? "✓ Paid & Verified" : "⏳ Payment Pending"}
          </div>
          <p className="text-xs font-mono text-navy/60 mt-2">
            Ref: <span className="font-semibold text-navy">{registration.reference}</span>
          </p>
          <p className="text-[11px] text-navy/50">
            Date: {new Date(registration.createdAt).toLocaleDateString("en-GB", { dateStyle: "medium" })}
          </p>
        </div>
      </div>

      {/* Student & Parent Info Grid */}
      <div className="mt-6 grid sm:grid-cols-2 gap-6 text-sm">
        <div className="bg-mist p-4 rounded-sm border border-navy/5">
          <h4 className="font-mono text-xs uppercase tracking-wider text-gold-dim font-bold mb-2">Student Information</h4>
          <p className="font-semibold text-navy text-base">{registration.studentName}</p>
          <p className="text-xs text-navy/70 mt-1">Age: {registration.studentAge} years • Gender: {registration.gender}</p>
          <p className="text-xs text-navy/70 mt-1">Programme: <span className="font-semibold text-navy">{registration.programmeName}</span></p>
          <p className="text-xs text-navy/70 mt-1">Schedule: {registration.schedule}</p>
        </div>

        <div className="bg-mist p-4 rounded-sm border border-navy/5">
          <h4 className="font-mono text-xs uppercase tracking-wider text-gold-dim font-bold mb-2">Parent / Guardian Contact</h4>
          <p className="font-semibold text-navy text-base">{registration.parentName}</p>
          <p className="text-xs text-navy/70 mt-1">Email: {registration.email}</p>
          <p className="text-xs text-navy/70 mt-1">Phone: {registration.phone}</p>
          {registration.whatsapp && registration.whatsapp !== registration.phone && (
            <p className="text-xs text-navy/70 mt-1">WhatsApp: {registration.whatsapp}</p>
          )}
        </div>
      </div>

      {/* Financial Table */}
      <div className="mt-6">
        <h4 className="font-mono text-xs uppercase tracking-wider text-navy/60 mb-2 font-semibold">Fee Breakdown</h4>
        <div className="border border-navy/10 rounded-sm overflow-hidden text-sm">
          <div className="flex justify-between bg-navy/5 px-4 py-2.5 font-medium text-navy border-b border-navy/10 text-xs">
            <span>Description</span>
            <span>Billing Cycle</span>
            <span>Amount</span>
          </div>

          <div className="flex justify-between px-4 py-3 border-b border-navy/5 text-navy/80">
            <span>
              Tuition Fee ({registration.programmeName})
              {registration.feePlanLabel && (
                <span className="block text-[11px] text-navy/50">{registration.feePlanLabel}</span>
              )}
            </span>
            <span className="text-navy/60 text-xs">{registration.billingCycle}</span>
            <span className="font-mono">{formatNaira(registration.tuitionFee)}</span>
          </div>

          <div className="flex justify-between px-4 py-3 border-b border-navy/5 text-navy/80">
            <span>Registration & Admission Form Fee</span>
            <span className="text-navy/60 text-xs">One-off</span>
            <span className="font-mono">{formatNaira(registration.registrationFee)}</span>
          </div>

          {registration.discountAmount > 0 && (
            <div className="flex justify-between px-4 py-3 border-b border-navy/5 text-emerald-700 bg-emerald-50/50">
              <span>Scholarship / Promo Discount ({registration.promoCode})</span>
              <span className="text-emerald-600 text-xs">Applied</span>
              <span className="font-mono">-{formatNaira(registration.discountAmount)}</span>
            </div>
          )}

          <div className="flex justify-between bg-navy text-white px-4 py-3 font-semibold text-base">
            <span>Total Payable</span>
            <span className="font-mono">{formatNaira(registration.totalFee)}</span>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      {isPaid && (
        <div className="mt-6 flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-sm text-xs">
          <div>
            <p className="font-semibold text-emerald-900">Payment Confirmed</p>
            <p className="text-emerald-700 mt-0.5">
              Gateway: <span className="font-mono font-medium">{registration.paymentGateway}</span> • Ref:{" "}
              <span className="font-mono">{registration.transactionReference || "N/A"}</span>
            </p>
          </div>
          {registration.paidAt && (
            <p className="text-emerald-700 font-mono">
              {new Date(registration.paidAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </div>
      )}

      {/* Verification Badge */}
      <div className="mt-8 border-t border-navy/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-navy/5 border border-navy/15 rounded flex items-center justify-center p-2 text-center text-[9px] font-mono text-navy/60 leading-tight">
            [ QR Code ]<br />{registration.reference}
          </div>
          <div>
            <p className="text-xs text-navy/70">Verify status online anytime at:</p>
            <p className="text-xs font-mono font-semibold text-navy">abutaymeeyah.academy/admissions/status</p>
          </div>
        </div>

        <div className="flex items-center gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-sm border border-navy/20 bg-white px-4 py-2.5 text-xs font-semibold text-navy hover:bg-navy/5 transition-colors focus-ring"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Print / Save Receipt
          </button>

          {onBackToEnrollment && (
            <button
              onClick={onBackToEnrollment}
              className="inline-flex items-center rounded-sm bg-navy px-4 py-2.5 text-xs font-semibold text-white hover:bg-navy-light transition-colors focus-ring"
            >
              Enroll Another Student
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
