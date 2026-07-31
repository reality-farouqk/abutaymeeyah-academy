import { NextRequest } from "next/server";

// Best-effort, in-memory rate limiting. This resets on every
// redeploy/restart and isn't shared across serverless instances, so it's a
// speed bump against naive scripts, not a real defense against a determined
// or distributed attacker. If abuse becomes a real problem, replace this
// with Vercel's Firewall or a shared store like Upstash Redis
// (@upstash/ratelimit) — same call sites, swap the implementation here.
const buckets = new Map<string, { count: number; windowStart: number }>();

export function getClientKey(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}

/**
 * Returns true if the request is within its rate limit (and records it),
 * false if the limit has been exceeded for this key+scope combination.
 */
export function checkRateLimit(
  scope: string,
  key: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const bucketKey = `${scope}:${key}`;
  const now = Date.now();
  const record = buckets.get(bucketKey);

  if (record && now - record.windowStart < windowMs) {
    if (record.count >= maxRequests) {
      return false;
    }
    record.count += 1;
    return true;
  }

  buckets.set(bucketKey, { count: 1, windowStart: now });
  return true;
}
