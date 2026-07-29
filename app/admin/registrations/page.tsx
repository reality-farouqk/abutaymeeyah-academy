"use client";

import { useState, useEffect } from "react";
import { StudentRegistration } from "@/lib/registrations-store";
import { formatNaira } from "@/lib/programmes";
import ReceiptView from "@/components/ReceiptView";

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<StudentRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedReg, setSelectedReg] = useState<StudentRegistration | null>(null);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/registrations");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch registrations.");
      setRegistrations(data.registrations || []);
    } catch (err: any) {
      setError(err.message || "Failed to load registrations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleMarkAsPaid = async (reference: string) => {
    if (!confirm(`Confirm manual payment receipt for ${reference}?`)) return;

    try {
      const res = await fetch("/api/admin/registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference,
          paymentStatus: "PAID",
          paymentGateway: "Bank Transfer",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update payment status.");

      alert(`Payment status for ${reference} updated to PAID!`);
      fetchRegistrations();
      if (selectedReg && selectedReg.reference === reference) {
        setSelectedReg(data.registration);
      }
    } catch (err: any) {
      alert(err.message || "Error updating payment status.");
    }
  };

  const filtered = registrations.filter((reg) => {
    const matchesSearch =
      reg.reference.toLowerCase().includes(search.toLowerCase()) ||
      reg.studentName.toLowerCase().includes(search.toLowerCase()) ||
      reg.parentName.toLowerCase().includes(search.toLowerCase()) ||
      reg.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ? true : reg.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalRevenue = registrations
    .filter((r) => r.paymentStatus === "PAID")
    .reduce((sum, r) => sum + r.totalFee, 0);

  return (
    <div className="min-h-screen bg-mist py-12">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 border border-navy/10 rounded-sm shadow-sm">
          <div>
            <span className="font-mono text-xs text-gold-dim uppercase tracking-wider">Academy Administration</span>
            <h1 className="font-display text-2xl text-navy">Student Registrations & Payments</h1>
          </div>

          <div className="flex gap-4">
            <div className="bg-navy/5 px-4 py-2 rounded border border-navy/10 text-center">
              <p className="text-[10px] uppercase font-mono text-navy/60">Total Enrolled</p>
              <p className="font-display text-lg font-bold text-navy">{registrations.length}</p>
            </div>
            <div className="bg-emerald-50 px-4 py-2 rounded border border-emerald-200 text-center">
              <p className="text-[10px] uppercase font-mono text-emerald-800">Verified Paid Revenue</p>
              <p className="font-display text-lg font-bold text-emerald-700">{formatNaira(totalRevenue)}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 border border-navy/10 rounded-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student, parent, email or ref..."
            className="w-full sm:w-80 rounded-sm border border-navy/20 px-4 py-2 text-sm text-navy outline-none focus-ring"
          />

          <div className="flex items-center gap-2 text-sm">
            <span className="text-navy/60 font-medium">Status:</span>
            {["ALL", "PAID", "PENDING"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded text-xs font-semibold ${
                  statusFilter === st
                    ? "bg-navy text-white"
                    : "bg-navy/5 text-navy/70 hover:bg-navy/10"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-hidden rounded-sm border border-navy/10 bg-white shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-navy/60">Loading registrations...</div>
          ) : error ? (
            <div className="p-12 text-center text-red-600">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-navy/50">No registrations found matching criteria.</div>
          ) : (
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-navy text-white text-xs font-mono uppercase">
                <tr>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Student & Age</th>
                  <th className="px-4 py-3">Programme</th>
                  <th className="px-4 py-3">Parent & Contact</th>
                  <th className="px-4 py-3">Total Fee</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/10">
                {filtered.map((reg) => (
                  <tr key={reg.reference} className="hover:bg-navy/5 transition-colors">
                    <td className="px-4 py-3 font-mono font-semibold text-navy text-xs">{reg.reference}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-navy">{reg.studentName}</p>
                      <p className="text-xs text-navy/60">{reg.studentAge} yrs • {reg.gender}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-navy font-medium">{reg.programmeName}</p>
                      <p className="text-[11px] text-navy/60">
                        {reg.feePlanLabel ? `${reg.feePlanLabel} • ` : ""}
                        {reg.schedule}
                      </p>
                      {reg.nationality && (
                        <p className="text-[11px] text-navy/40">{reg.nationality}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-navy">{reg.parentName}</p>
                      <p className="text-xs text-navy/60">{reg.phone} • {reg.email}</p>
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold text-navy">
                      {formatNaira(reg.totalFee)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold uppercase ${
                          reg.paymentStatus === "PAID"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {reg.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => setSelectedReg(reg)}
                        className="px-3 py-1 bg-navy/10 text-navy rounded text-xs font-medium hover:bg-navy/20"
                      >
                        View Receipt
                      </button>

                      {reg.paymentStatus !== "PAID" && (
                        <button
                          onClick={() => handleMarkAsPaid(reg.reference)}
                          className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700"
                        >
                          Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal for Receipt View */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 bg-navy/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-sm shadow-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedReg(null)}
              className="absolute top-4 right-4 text-navy/60 hover:text-navy text-xl font-bold px-3 py-1 border rounded"
            >
              ✕
            </button>
            <ReceiptView registration={selectedReg} />
          </div>
        </div>
      )}
    </div>
  );
}
