"use client";

export default function ContactForm() {
  return (
    <form className="rounded-sm border border-navy/10 bg-white p-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
      <label className="block text-sm text-navy/80">
        Name
        <input required className="mt-1.5 w-full rounded-sm border border-navy/20 px-4 py-2.5 text-sm text-navy focus-ring outline-none" />
      </label>
      <label className="block text-sm text-navy/80">
        Email
        <input type="email" required className="mt-1.5 w-full rounded-sm border border-navy/20 px-4 py-2.5 text-sm text-navy focus-ring outline-none" />
      </label>
      <label className="block text-sm text-navy/80">
        Message
        <textarea rows={5} required className="mt-1.5 w-full rounded-sm border border-navy/20 px-4 py-2.5 text-sm text-navy focus-ring outline-none" />
      </label>
      <button
        type="submit"
        className="inline-flex items-center rounded-sm bg-gold px-7 py-3.5 text-sm font-semibold text-navy-deep hover:bg-gold-light transition-colors focus-ring"
      >
        Send Message
      </button>
    </form>
  );
}
