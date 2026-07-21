"use client";

import Link from "next/link";

export default function RegistrationForm() {
  return (
    <form className="mt-10 grid sm:grid-cols-2 gap-5" onSubmit={(e) => e.preventDefault()}>
      {[
        ["Parent Name", "text"],
        ["Student Name", "text"],
        ["Age", "number"],
        ["Email", "email"],
        ["Phone Number", "tel"],
        ["WhatsApp Number", "tel"],
      ].map(([label, type]) => (
        <label key={label} className="text-sm text-navy/80">
          {label}
          <input
            type={type}
            required
            className="mt-1.5 w-full rounded-sm border border-navy/20 bg-white px-4 py-2.5 text-sm text-navy focus-ring outline-none"
          />
        </label>
      ))}

      <label className="text-sm text-navy/80">
        Gender
        <select className="mt-1.5 w-full rounded-sm border border-navy/20 bg-white px-4 py-2.5 text-sm text-navy focus-ring outline-none">
          <option>Male</option>
          <option>Female</option>
        </select>
      </label>

      <label className="text-sm text-navy/80">
        Programme
        <select className="mt-1.5 w-full rounded-sm border border-navy/20 bg-white px-4 py-2.5 text-sm text-navy focus-ring outline-none">
          <option>Beginners Classes</option>
          <option>Intermediate Classes</option>
          <option>Advanced Classes</option>
          <option>Private Classes</option>
          <option>Muraajah Classes</option>
          <option>Private Tajweed</option>
        </select>
      </label>

      <label className="sm:col-span-2 text-sm text-navy/80">
        Address
        <input className="mt-1.5 w-full rounded-sm border border-navy/20 bg-white px-4 py-2.5 text-sm text-navy focus-ring outline-none" />
      </label>

      <label className="text-sm text-navy/80">
        Emergency Contact
        <input className="mt-1.5 w-full rounded-sm border border-navy/20 bg-white px-4 py-2.5 text-sm text-navy focus-ring outline-none" />
      </label>

      <label className="text-sm text-navy/80">
        Preferred Schedule
        <input className="mt-1.5 w-full rounded-sm border border-navy/20 bg-white px-4 py-2.5 text-sm text-navy focus-ring outline-none" />
      </label>

      <label className="sm:col-span-2 text-sm text-navy/80">
        Previous Experience
        <textarea rows={3} className="mt-1.5 w-full rounded-sm border border-navy/20 bg-white px-4 py-2.5 text-sm text-navy focus-ring outline-none" />
      </label>

      <label className="sm:col-span-2 text-sm text-navy/80">
        Additional Notes
        <textarea rows={3} className="mt-1.5 w-full rounded-sm border border-navy/20 bg-white px-4 py-2.5 text-sm text-navy focus-ring outline-none" />
      </label>

      <label className="sm:col-span-2 flex items-start gap-3 text-sm text-navy/70">
        <input type="checkbox" required className="mt-1 focus-ring" />
        I agree to the academy&apos;s policies.
      </label>

      <div className="sm:col-span-2 flex flex-col sm:flex-row gap-4 mt-2">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-sm bg-navy px-7 py-3.5 text-sm font-semibold text-white hover:bg-navy-light transition-colors focus-ring"
        >
          Continue to Payment
        </button>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-sm border border-navy/20 px-7 py-3.5 text-sm font-semibold text-navy hover:bg-navy/5 transition-colors focus-ring"
        >
          Have a question first?
        </Link>
      </div>
    </form>
  );
}
