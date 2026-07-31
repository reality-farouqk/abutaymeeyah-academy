"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin/registrations";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed.");
      }

      router.push(next);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-mist px-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-sm border border-navy/10 bg-white p-8 shadow-sm space-y-5"
      >
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold-dim">Restricted</p>
          <h1 className="mt-2 font-display text-2xl text-navy">Admin Sign In</h1>
        </div>

        <label className="block text-sm font-medium text-navy/80">
          Password
          <input
            type="password"
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-sm border border-navy/20 bg-white px-4 py-2.5 text-sm text-navy focus-ring outline-none"
          />
        </label>

        {error && (
          <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center rounded-sm bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-navy-light transition-colors focus-ring disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
