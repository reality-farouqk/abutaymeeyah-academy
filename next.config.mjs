/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
  async headers() {
    // Content-Security-Policy is NOT set here — it needs a fresh nonce per
    // request (for the JSON-LD <script> tag in app/layout.tsx), so it's
    // built in middleware.ts instead. Everything here is static and safe to
    // apply the same way to every response.
    return [
      {
        source: "/:path*",
        headers: [
          // Prevents the site from being framed by another origin
          // (clickjacking). Belt-and-braces alongside CSP's
          // frame-ancestors, for older browsers that don't support it.
          { key: "X-Frame-Options", value: "DENY" },
          // Stops browsers from guessing content types away from what the
          // server declared (helps prevent some XSS/MIME-confusion attacks).
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Don't leak the full referring URL (which can contain a
          // registration reference or email in query params) to other sites.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Disables browser features this site never uses.
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
          // Tells browsers to only ever connect over HTTPS for a year, and
          // to remember that even before the first HTTPS response (once
          // the domain is submitted to the HSTS preload list, which is a
          // separate manual step at hstspreload.org — not automatic).
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default nextConfig;
