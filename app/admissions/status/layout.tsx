import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check Admission Status",
  description: "Look up your registration status and receipt at Abu Taymeeyah Academy.",
  robots: { index: false, follow: true },
};

export default function AdmissionsStatusLayout({ children }: { children: React.ReactNode }) {
  return children;
}
