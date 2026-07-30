"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programmes", label: "Programmes" },
  { href: "/admissions", label: "Admissions" },
  // { href: "/admissions/status", label: "Check Status" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur border-b border-navy/10">
      <div className="mx-auto max-w-6xl px-5 flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-3 focus-ring rounded">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden arch-clip bg-navy">
            <Image src="/logo.jpg" alt="Abu Taymeeyah Academy crest" fill className="object-cover" />
          </div>
          <div className="leading-tight">
            <p className="font-display text-lg text-navy tracking-wide">Abu Taymeeyah</p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-gold-dim font-mono">Academy</p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-navy/80 hover:text-navy transition-colors focus-ring rounded"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            href="/enroll"
            className="inline-flex items-center rounded-sm bg-gold px-5 py-2.5 text-sm font-semibold text-navy-deep hover:bg-gold-light transition-colors focus-ring shadow-sm"
          >
            Enroll Now
          </Link>
        </div>

        <button
          className="lg:hidden text-navy focus-ring rounded p-2"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M3 3h18M3 12h18M3 18h18" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-navy/10 bg-paper px-5 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-navy/80 hover:text-navy"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/enroll"
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center rounded-sm bg-gold px-5 py-2.5 text-sm font-semibold text-navy-deep"
          >
            Enroll Now
          </Link>
        </div>
      )}
    </header>
  );
}
