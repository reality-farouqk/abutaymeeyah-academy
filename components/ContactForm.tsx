"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot — stays empty for real users
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, company }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      setStatus("error");
      setError(err.message || "Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-sm border border-emerald-200 bg-emerald-50 p-8 text-center">
        <p className="font-display text-lg text-emerald-800">Message sent — Jazakumullahu khayran!</p>
        <p className="mt-2 text-sm text-emerald-700">We&apos;ll get back to you as soon as we can.</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm font-semibold text-emerald-800 underline underline-offset-2"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-sm border border-navy/10 bg-white p-8 space-y-5">
      <label className="block text-sm text-navy/80">
        Name
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          className="mt-1.5 w-full rounded-sm border border-navy/20 px-4 py-2.5 text-sm text-navy focus-ring outline-none"
        />
      </label>
      <label className="block text-sm text-navy/80">
        Email
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-1.5 w-full rounded-sm border border-navy/20 px-4 py-2.5 text-sm text-navy focus-ring outline-none"
        />
      </label>
      <label className="block text-sm text-navy/80">
        Message
        <textarea
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us what you'd like to know — programmes, schedules, fees, or anything else."
          className="mt-1.5 w-full rounded-sm border border-navy/20 px-4 py-2.5 text-sm text-navy focus-ring outline-none"
        />
      </label>

      {/* Honeypot field — hidden from real visitors (clipped to 1px, not
          `display:none`, since some bots skip fields hidden that way), and
          never announced to screen readers. Uses inline styles rather than
          a large negative offset so it can't cause horizontal page scroll. */}
      <div
        style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}
        aria-hidden="true"
      >
        <label>
          Company
          <input
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </label>
      </div>

      {status === "error" && error && (
        <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm text-center">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center rounded-sm bg-gold px-7 py-3.5 text-sm font-semibold text-navy-deep hover:bg-gold-light transition-colors focus-ring disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
