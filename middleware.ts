import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";

// Paths that must stay reachable without a session — otherwise nobody could
// ever log in (or out).
const PUBLIC_ADMIN_PATHS = new Set(["/admin/login", "/api/admin/login", "/api/admin/logout"]);

function generateNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  // btoa is a global in both the Edge runtime and Node — no Buffer needed,
  // matching the edge-safe approach already used in lib/admin-auth.ts.
  return btoa(String.fromCharCode(...bytes));
}

function buildCsp(nonce: string): string {
  const isDev = process.env.NODE_ENV !== "production";

  const directives = [
    `default-src 'self'`,
    // 'strict-dynamic' lets Next.js's own framework scripts (loaded by the
    // nonce'd bootstrap script) run without needing their own nonce/hash.
    // 'unsafe-eval' is dev-only, for React Fast Refresh/webpack HMR.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    // Inline `style={{...}}` attributes are used in a couple of components
    // (e.g. the contact form's honeypot field) — no nonce system for those,
    // so this stays 'unsafe-inline'. Far lower risk than script-src would be.
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: https://images.pexels.com`,
    `font-src 'self' data:`,
    // Same-origin fetch() calls only (all third-party APIs — Flutterwave,
    // Paystack, Resend — are called server-side, never from the browser).
    // Dev mode also needs the webpack HMR websocket.
    `connect-src 'self'${isDev ? " ws://localhost:* http://localhost:*" : ""}`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `object-src 'none'`,
    `upgrade-insecure-requests`,
  ];

  return directives.join("; ");
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const nonce = generateNonce();
  const csp = buildCsp(nonce);

  // Forward the nonce to Server Components (read via headers() in
  // app/layout.tsx) so the JSON-LD <script> tag can use it, per Next.js's
  // documented CSP pattern.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);

  function withCsp(res: NextResponse): NextResponse {
    res.headers.set("Content-Security-Policy", csp);
    return res;
  }

  if (PUBLIC_ADMIN_PATHS.has(pathname)) {
    return withCsp(NextResponse.next({ request: { headers: requestHeaders } }));
  }

  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

  if (isAdminRoute) {
    const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const authed = await verifySessionToken(token);

    if (!authed) {
      // API routes get a plain 401 — no redirect, since a fetch() call
      // can't follow one into an HTML login page usefully.
      if (pathname.startsWith("/api/admin")) {
        return withCsp(NextResponse.json({ error: "Unauthorized." }, { status: 401 }));
      }

      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("next", pathname);
      return withCsp(NextResponse.redirect(loginUrl));
    }
  }

  return withCsp(NextResponse.next({ request: { headers: requestHeaders } }));
}

export const config = {
  // Runs on everything except static assets and image-optimization
  // requests — including /api routes, since /api/admin/* still needs the
  // auth check above. A CSP header on a JSON response is inert but
  // harmless.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)"],
};
