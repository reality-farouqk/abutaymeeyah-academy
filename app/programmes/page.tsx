import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import PlaceholderNote from "@/components/PlaceholderNote";
import GeoPattern from "@/components/GeoPattern";
import { quranPhotos } from "@/lib/stock-images";

export const metadata: Metadata = { title: "Programmes | Abu Taymeeyah Academy" };

const programmes = [
  {
    id: "beginners",
    title: "Beginners Classes",
    overview: "An entry point for students starting from letter recognition through to first steps in memorization.",
    who: "New students with little or no prior Qur'an reading experience.",
    payment: "Termly",
  },
  {
    id: "intermediate",
    title: "Intermediate Classes",
    overview: "Builds fluency, confidence, and consistency in memorization for students with a foundation already in place.",
    who: "Students who can read the Qur'an and have begun memorizing.",
    payment: "Termly",
  },
  {
    id: "advanced",
    title: "Advanced Classes",
    overview: "Rigorous, closely supervised progression toward completing memorization of the full Qur'an.",
    who: "Students well into their memorization journey.",
    payment: "Monthly",
  },
  {
    id: "private",
    title: "Private Classes",
    overview: "One-on-one personalized learning paced entirely around the student.",
    who: "Students or parents who prefer individual attention over group classes.",
    payment: "Monthly",
  },
  {
    id: "muraajah",
    title: "Muraajah Classes",
    overview: "Dedicated revision and retention sessions to keep memorized portions strong.",
    who: "Students who have completed memorization or portions and need consistent revision.",
    payment: "Monthly",
  },
  {
    id: "tajweed",
    title: "Private Tajweed",
    overview: "Focused, individual instruction in the rules of proper Qur'anic recitation.",
    who: "Students and adults wanting to correct or refine their recitation.",
    payment: "Monthly",
  },
];

export default function ProgrammesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy-gradient text-white py-20">
        <Image src={quranPhotos[2].src} alt={quranPhotos[2].alt} fill className="object-cover opacity-20" priority />
        <div className="absolute inset-0 bg-navy-gradient opacity-90" />
        <GeoPattern className="absolute inset-0 opacity-20" />
        <div className="relative mx-auto max-w-6xl px-5">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold-light">Programmes</p>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl">A clear path, at every level</h1>
          <p className="mt-4 max-w-xl text-white/75 leading-relaxed">
            From first letters to complete memorization, each programme is
            structured with clear objectives and consistent revision.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-20 space-y-16">
        {programmes.map((p, i) => (
          <article key={p.id} id={p.id} className="grid lg:grid-cols-[auto_1fr] gap-8 items-start scroll-mt-24">
            <div className="h-14 w-14 arch-clip bg-navy flex items-center justify-center text-gold-light font-mono text-sm shrink-0">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="border-b border-navy/10 pb-16 last:border-none">
              <h2 className="font-display text-2xl sm:text-3xl text-navy">{p.title}</h2>
              <p className="mt-3 text-navy/70 leading-relaxed max-w-2xl">{p.overview}</p>

              <dl className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <dt className="font-mono text-xs uppercase tracking-widest text-gold-dim">Who it&apos;s for</dt>
                  <dd className="mt-1 text-sm text-navy/70">{p.who}</dd>
                </div>
                <div>
                  <dt className="font-mono text-xs uppercase tracking-widest text-gold-dim">Duration</dt>
                  <dd className="mt-1 text-sm text-navy/50">Placeholder — to be confirmed</dd>
                </div>
                <div>
                  <dt className="font-mono text-xs uppercase tracking-widest text-gold-dim">Class Format</dt>
                  <dd className="mt-1 text-sm text-navy/50">Placeholder — physical / online / hybrid</dd>
                </div>
                <div>
                  <dt className="font-mono text-xs uppercase tracking-widest text-gold-dim">Fees &amp; Schedule</dt>
                  <dd className="mt-1 text-sm text-navy/70">{p.payment} payment &middot; timetable to be confirmed</dd>
                </div>
              </dl>

              <Link
                href="/enroll"
                className="mt-7 inline-flex items-center rounded-sm bg-gold px-6 py-3 text-sm font-semibold text-navy-deep hover:bg-gold-light transition-colors focus-ring"
              >
                Enroll in {p.title}
              </Link>
            </div>
          </article>
        ))}
      </div>

      <section className="bg-mist py-16">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <SectionHeading eyebrow="Note" title="Detailed learning objectives coming soon" align="center" />
          <div className="mt-4 flex justify-center">
            <PlaceholderNote>Full learning objectives, weekly timetable, and exact fees per programme to be supplied by the academy</PlaceholderNote>
          </div>
        </div>
      </section>
    </>
  );
}
