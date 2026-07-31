// Admin authentication helpers.
//
// Deliberately uses only the Web Crypto API (`crypto.subtle`, global in both
// the Next.js Edge runtime used by middleware.ts and in Node.js 19+ used by
// API routes) rather than Node's `node:crypto` module, which middleware
// cannot import at all. See package.json's "engines" field — this requires
// a Node.js host that exposes global Web Crypto (Node 19+; Vercel's current
// default Node runtime already does).
//
// This is a lightweight, single-admin-password scheme appropriate for a
// small site with one or two staff logins. If the academy later needs
// multiple admin accounts with distinct permissions, an audit trail of who
// changed what, or self-serve password resets, that's the point to move to
// a real auth provider (e.g. Supabase Auth, Clerk, Auth.js) instead of
// extending this.

const SESSION_COOKIE = "atm_admin_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacHex(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return bufToHex(sig);
}

// Constant-time comparison of two equal-length hex strings. (Hex digests of
// a fixed hash are always the same length, so the length check up front
// doesn't leak anything about the compared secrets.)
function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set.");
  return secret;
}

export async function createSessionToken(): Promise<string> {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = String(expires);
  const signature = await hmacHex(getSessionSecret(), payload);
  return `${payload}.${signature}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  let expected: string;
  try {
    expected = await hmacHex(getSessionSecret(), payload);
  } catch {
    return false;
  }

  if (!timingSafeEqualHex(signature, expected)) return false;

  const expires = Number(payload);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;

  return true;
}

// Password comparison: both sides are hashed first (with a fixed, non-secret
// label — it only needs to equalize length, not add secrecy) so a
// constant-time compare can run regardless of how long the candidate or
// real password are.
export async function verifyPassword(candidate: string): Promise<boolean> {
  const actual = process.env.ADMIN_PASSWORD;
  if (!actual || !candidate) return false;
  const [a, b] = await Promise.all([hmacHex("pw-check", candidate), hmacHex("pw-check", actual)]);
  return timingSafeEqualHex(a, b);
}

export const ADMIN_SESSION_COOKIE = SESSION_COOKIE;
export const ADMIN_SESSION_TTL_MS = SESSION_TTL_MS;
