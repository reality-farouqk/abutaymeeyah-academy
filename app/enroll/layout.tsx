import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enroll",
  description: "Register a student and complete tuition payment at Abu Taymeeyah Academy.",
  robots: { index: false, follow: true },
};

export default function EnrollLayout({ children }: { children: React.ReactNode }) {
  return children;
}
