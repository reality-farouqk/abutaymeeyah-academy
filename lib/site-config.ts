// Central place for SEO-relevant site facts. Referenced by app/layout.tsx,
// app/sitemap.ts, app/robots.ts, and the JSON-LD structured data.
//
// TODO: SITE_URL is a PLACEHOLDER — there's no production domain yet.
// The moment you have one, change it here (or better, set the
// NEXT_PUBLIC_SITE_URL environment variable in your hosting provider so you
// don't have to touch code). Everything else in this file — sitemap URLs,
// canonical tags, Open Graph/Twitter tags, and JSON-LD — is derived from
// this single value, so updating it here is the only change needed.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.abutaymeeyahacademy.com";

export const SITE_NAME = "Abu Taymeeyah Academy";

export const SITE_DESCRIPTION =
  "Abu Taymeeyah Academy for Qur'anic Memorisation and Training — structured Qur'an memorization, Tajweed mastery, and Islamic learning with qualified tutors in Nigeria.";

export const CONTACT = {
  phones: ["+2348037416047", "+2349123782303"],
  email: "abutaymeeyahinstitute@gmail.com",
  whatsapp: "https://wa.me/2348037416047",
};

// Add real profiles here once they exist (used in JSON-LD "sameAs").
export const SOCIAL_LINKS: string[] = [];

// Origins allowed to be used when building payment gateway redirect URLs.
// The Origin header on a request is fully attacker-controlled when the
// request isn't made by a real browser on this site (e.g. a direct curl/API
// call), so it must never be used unchecked to build a redirect_url handed
// to Flutterwave/Paystack — that would let someone redirect a paying
// customer to an arbitrary domain right after a real payment completes.
const ALLOWED_ORIGINS = [SITE_URL, "http://localhost:3000"];

export function getSafeOrigin(requestOrigin: string | null): string {
  if (requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin)) {
    return requestOrigin;
  }
  return SITE_URL;
}
