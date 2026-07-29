"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import GeoPattern from "@/components/GeoPattern";
import ReceiptView from "@/components/ReceiptView";
import { StudentRegistration } from "@/lib/registrations-store";
import { quranPhotos } from "@/lib/stock-images";

function StatusContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("ref") || searchParams.get("query") || "";

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<StudentRegistration[] | null>(null);

  const fetchStatus = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/registration/status?query=${encodeURIComponent(searchQuery.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Could not find registration.");
      }

      setRegistrations(data.registrations || []);
    } catch (err: any) {
      setError(err.message || "Failed to search status.");
      setRegistrations(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      fetchStatus(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStatus(query);
  };

  return (
    <>
      <section className="relative overflow-hidden bg-navy-gradient text-white py-16">
        <Image src={quranPhotos[0].src} alt={quranPhotos[0].alt} fill className="object-cover opacity-20" priority />
        <div className="absolute inset-0 bg-navy-gradient opacity-90" />
        <GeoPattern className="absolute inset-0 opacity-20" />
        <div className="relative mx-auto max-w-4xl px-5 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold-light">Student & Admission Portal</p>
          <h1 className="mt-3 font-display text-3xl sm:text-4xl">Check Registration & Payment Status</h1>
          <p className="mt-2 text-white/75 text-sm max-w-md mx-auto">
            Enter your Registration Reference (e.g., ATA-123456) or Parent Email to view your receipt and enrollment status.
          </p>

          <form onSubmit={handleSearch} className="mt-6 max-w-md mx-auto flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. ATA-849201 or parent@email.com"
              required
              className="flex-1 rounded-sm border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-sm bg-gold px-6 py-3 text-sm font-semibold text-navy-deep hover:bg-gold-light transition-colors focus-ring"
            >
              {loading ? "Searching..." : "Lookup"}
            </button>
          </form>
        </div>
      </section>

      <section className="bg-mist py-16 min-h-[400px]">
        <div className="mx-auto max-w-4xl px-5">
          {error && (
            <div className="p-4 rounded-sm bg-red-50 border border-red-200 text-red-700 text-sm text-center max-w-lg mx-auto">
              {error}
            </div>
          )}

          {registrations && registrations.length === 0 && (
            <div className="text-center py-12 text-navy/60">
              No registration record found for &quot;{query}&quot;.
            </div>
          )}

          {registrations && registrations.length > 0 && (
            <div className="space-y-12">
              {registrations.map((reg) => (
                <ReceiptView key={reg.reference} registration={reg} />
              ))}
            </div>
          )}

          {!registrations && !error && !loading && (
            <div className="text-center py-16 text-navy/50 text-sm max-w-sm mx-auto">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-navy/30 mb-3">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Enter a reference number or parent email above to check registration details.
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function AdmissionsStatusPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-navy/60">Loading portal...</div>}>
      <StatusContent />
    </Suspense>
  );
}
