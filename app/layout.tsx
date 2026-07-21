import type { Metadata } from "next";
import { Amiri, Work_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArchDefs from "@/components/ArchDefs";

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
  title: "Abu Taymeeyah Academy | Qur'anic Memorisation & Training",
  description:
    "Abu Taymeeyah Academy for Qur'anic Memorisation and Training — structured Qur'an memorization, Tajweed mastery, and Islamic learning with qualified tutors.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${amiri.variable} ${workSans.variable} ${plexMono.variable} font-body`}>
        <ArchDefs />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
