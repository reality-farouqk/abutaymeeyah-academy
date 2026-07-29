import type { Metadata } from "next";
import { Amiri, Work_Sans, IBM_Plex_Mono } from "next/font/google";
import './globals.css';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArchDefs from "@/components/ArchDefs";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, CONTACT, SOCIAL_LINKS } from "@/lib/site-config";

const amiri = Amiri({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-display",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Qur'anic Memorisation & Training`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Qur'an memorization academy Nigeria",
    "Tajweed classes Nigeria",
    "Hifz academy",
    "online Qur'an classes Nigeria",
    "Islamic studies academy",
    "Qa'idah classes",
    "Muraajah Qur'an revision",
    "Abu Taymeeyah Academy",
  ],
  authors: [{ name: SITE_NAME }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Qur'anic Memorisation & Training`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Qur'anic Memorisation & Training`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

// EducationalOrganization structured data — helps search engines understand
// what the academy is and surface rich results (sitelinks, knowledge panel
// snippets). Contact details are pulled from lib/site-config.ts.
const structuredData = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.jpg`,
  description: SITE_DESCRIPTION,
  email: CONTACT.email,
  telephone: CONTACT.phones[0],
  ...(SOCIAL_LINKS.length > 0 ? { sameAs: SOCIAL_LINKS } : {}),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${amiri.variable} ${workSans.variable} ${plexMono.variable} font-body`}>
        <ArchDefs />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
