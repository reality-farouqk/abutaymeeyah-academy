# Abu Taymeeyah Academy — Website

A Next.js (App Router) + TypeScript + Tailwind CSS website for Abu Taymeeyah
Academy for Qur'anic Memorisation and Training, built from the provided site
map, flyer, and logo.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

To build for production:

```bash
npm run build
npm run start
```

## What's included

- **Home** — hero, about preview, six programme cards, "why choose us,"
  admissions banner, testimonials, gallery preview, closing CTA.
- **About** — story, mission, vision, core values, teacher grid (all with
  the academy's exact mission/vision text; story and teacher bios are
  placeholders).
- **Programmes** — a detail section for each of the six class types
  (Beginners, Intermediate, Advanced, Private, Muraajah, Private Tajweed).
- **Admissions** — the 5-step admission process, a fees table (payment
  cadence only, amounts pending), and a full registration form.
- **Gallery** — categorized placeholder grid (Events, Students, Graduation,
  Competitions, Memorization Sessions, Islamic Programs).
- **Contact** — phone, email, WhatsApp link, contact form, map placeholder.
- **Enroll Now** — a 4-step enrollment wizard: choose programme → register →
  pay → confirmation.

## Design system

- **Colors:** deep navy (`#0F1E3D`), muted antique gold (`#C6942F`), pale
  sky-blue mist (`#EEF2F9`), near-white paper (`#FBFCFE`).
- **Type:** Amiri (display/serif, Arabic-rooted) for headings, Work Sans for
  body copy, IBM Plex Mono for labels, numbers, and step markers.
- **Signature motif:** a pointed mosque-arch shape (echoing the academy's
  own logo mark) used to frame images, cap programme cards, and mark
  numbered steps. Defined once in `components/ArchDefs.tsx` as reusable SVG
  clip-paths (`.arch-clip`, `.arch-clip-wide`).

## Still needed from the academy (see in-page placeholder notes)

- Director's photo (message and name are now in place on the About page)
- Teacher photos, qualifications, experience
- Physical address and Google Maps location
- Exact tuition fees per programme
- Weekly class timetable
- Minimum/maximum student ages
- Physical / online / hybrid class format per programme
- High-quality photography for Events, Graduation, and Competitions in the Gallery
- Social media links
- Terms & conditions, refund and privacy policies
- Bank details or confirmation of Paystack/Flutterwave as payment gateway

## Photography

Real Qur'an, mosque, and study-session photography has been added throughout
the site (hero backgrounds on About/Programmes/Admissions/Enroll/Contact, the
Home page gallery preview, and the full Gallery page). All of it is sourced
from **Pexels** (free for commercial use, no attribution required — see
https://www.pexels.com/license/) and is defined in one place:
`lib/stock-images.ts`. Three categories are covered — `quranPhotos`,
`mosquePhotos`, and `learningPhotos` — each an array of `{ src, alt, credit }`
you can freely reorder, trim, or swap out.

The Gallery page's **Events**, **Graduation**, and **Competitions** sections
are left as placeholders on purpose — using generic stock photos there would
misrepresent the academy's actual events, so those should only be filled with
real photography once the academy provides it. The "Meet Our Teachers" grid
on the About page is left as a placeholder for the same reason.

To swap in the academy's own photography later: drop files into `public/`,
then replace the relevant `src` in `lib/stock-images.ts` (or the direct
`<Image>` calls in `app/gallery/page.tsx`) with local paths, e.g. `/gallery/photo-1.jpg`.

## Wiring up real functionality

- **Payments:** the "Pay with Paystack / Flutterwave" buttons in
  `app/admissions/page.tsx` and `app/enroll/page.tsx` are visual
  placeholders. Replace with the Paystack/Flutterwave inline SDK or a
  server route once the academy confirms which gateway and provides API
  keys.
- **Forms:** the registration and contact forms currently prevent default
  submission. Wire them to an API route (e.g. `app/api/register/route.ts`)
  or a service like Formspree/Resend to actually collect and email
  submissions.
- **Images:** `public/logo.jpg` and `public/flyer.jpg` are the assets
  supplied. Replace gray "photo placeholder" blocks across Gallery, About,
  and the Home page as real photography comes in.
# abutaymeeyah-academy
