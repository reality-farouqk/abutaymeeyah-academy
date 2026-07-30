import Link from "next/link";
import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import ProgrammeCard from "@/components/ProgrammeCard";
import PlaceholderNote from "@/components/PlaceholderNote";
import ArchDivider from "@/components/ArchDivider";
import GeoPattern from "@/components/GeoPattern";
import { learningPhotos, mosquePhotos } from "@/lib/stock-images";

const programmes = [
  { title: "Beginners Classes", description: "Perfect for students beginning their Qur'an journey, building Arabic letter recognition and early recitation." },
  { title: "Intermediate Classes", description: "Build confidence and improve memorization with structured revision and steady progression." },
  { title: "Advanced Classes", description: "For students progressing toward complete memorization of the Qur'an." },
  { title: "Private Classes", description: "One-on-one personalized learning paced to the student's needs." },
  { title: "Muraajah Classes", description: "Dedicated revision and retention sessions to preserve what has been memorized." },
  { title: "Private Tajweed", description: "Master proper Qur'an recitation rules under close, individual guidance." },
];

const whyChoose = [
  { title: "Qualified Tutors", description: "Experienced teachers with proven teaching methods." },
  { title: "Small Class Sizes", description: "10–15 students per class for better individual attention." },
  { title: "Flexible Scheduling", description: "Classes designed around students' availability." },
  { title: "Structured Curriculum", description: "A clear roadmap from beginner to advanced memorization." },
  { title: "Spiritual Development", description: "More than memorization — building Islamic character." },
  { title: "Personalized Support", description: "Continuous guidance and progress monitoring." },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy-gradient text-white">
        <GeoPattern className="absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-6xl px-5 py-24 lg:py-32 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold-light">
              Abu Taymeeyah Academy for Qur&apos;anic Memorisation &amp; Training
            </p>
            <h1 className="mt-5 font-display text-4xl sm:text-5xl leading-tight">
              Memorize the Qur&apos;an with Excellence, Discipline &amp; Qualified Teachers
            </h1>
            <p className="mt-6 text-white/75 leading-relaxed max-w-md">
              Join Abu Taymeeyah Academy and begin a structured journey towards
              Qur&apos;an memorization, Tajweed mastery, and lifelong spiritual growth.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/enroll"
                className="inline-flex items-center rounded-sm bg-gold px-7 py-3.5 text-sm font-semibold text-navy-deep hover:bg-gold-light transition-colors focus-ring"
              >
                Enroll Now
              </Link>
              <Link
                href="/programmes"
                className="inline-flex items-center rounded-sm border border-white/30 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors focus-ring"
              >
                View Programmes
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="relative aspect-[4/5] arch-clip bg-navy-light border border-gold/30 shadow-arch overflow-hidden">
              <Image src="/ustaz-abutaymeeyah.jpg" alt="Qur'an stand with lantern, academy branding" fill className="object-cover" />
            </div>
            <div className="absolute -bottom-5 -left-5 h-20 w-20 arch-clip bg-gold flex items-center justify-center">
              <div className="arch-clip">
              <Image src="/logo.jpg" alt="Abu Taymeeyah Academy logo" width={48} height={48} className="object-contain" />
              </div>
            </div>
          </div>
        </div>
        <ArchDivider color="#FBFCFE" />
      </section>

      {/* ABOUT PREVIEW */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 items-start">
          <SectionHeading eyebrow="Who we are · Est. 2021" title="A structured home for Qur'an memorization" />
          <div>
            <p className="text-navy/75 leading-relaxed">
              Abu Taymeeyah Academy is dedicated to providing quality Qur&apos;an
              memorization and Islamic learning through structured teaching
              methods, qualified instructors, and an environment that nurtures
              spiritual development.
            </p>
            <Link href="/about" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-dim">
              Learn more about us <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* PROGRAMMES */}
      <section className="bg-mist py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading eyebrow="Programmes" title="Our Programmes" align="center" />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programmes.map((p, i) => (
              <ProgrammeCard
                key={p.title}
                title={p.title}
                description={p.description}
                index={String(i + 1).padStart(2, "0")}
              />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/programmes"
              className="inline-flex items-center rounded-sm bg-navy px-7 py-3.5 text-sm font-semibold text-white hover:bg-navy-light transition-colors focus-ring"
            >
              Explore Programmes
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <SectionHeading eyebrow="Why families choose us" title="Why Choose Abu Taymeeyah Academy" align="center" />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {whyChoose.map((w) => (
            <div key={w.title} className="flex gap-4">
              <div className="h-10 w-10 shrink-0 arch-clip bg-gold/15 flex items-center justify-center text-gold-dim">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-lg text-navy">{w.title}</h3>
                <p className="mt-1 text-sm text-navy/70 leading-relaxed">{w.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ADMISSIONS OPEN */}
      <section className="relative overflow-hidden bg-navy-gradient text-white py-20">
        <GeoPattern className="absolute inset-0 opacity-25" />
        <div className="relative mx-auto max-w-6xl px-5 grid lg:grid-cols-[1fr_auto] gap-10 items-center">
          <div>
            <SectionHeading eyebrow="Admissions" title="Admissions Open" light />
            <div className="mt-6 grid sm:grid-cols-3 gap-6">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-gold-light">Current Intake</p>
                <p className="mt-1 text-sm text-white/80">Beginners, Intermediate, Advanced, Private, Muraajah &amp; Private Tajweed</p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-gold-light">Registration Deadline</p>
                <p className="mt-1 text-sm text-white/80">ongoing</p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-gold-light">Payment Options</p>
                <p className="mt-1 text-sm text-white/80">O&apos;Level classes: termly &middot; Advanced classes: monthly</p>
              </div>
            </div>
          </div>
          <Link
            href="/enroll"
            className="inline-flex items-center justify-center rounded-sm bg-gold px-8 py-4 text-sm font-semibold text-navy-deep hover:bg-gold-light transition-colors focus-ring whitespace-nowrap"
          >
            Enroll Today
          </Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {/* <section className="mx-auto max-w-6xl px-5 py-20">
        <SectionHeading eyebrow="What families say" title="Testimonials" align="center" />
        <div className="mt-4 text-center">
          <PlaceholderNote>Real parent and student testimonials to be added by the academy</PlaceholderNote>
        </div>
        <div className="mt-10 grid sm:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-sm border border-navy/10 bg-white p-6">
              <p className="text-sm text-navy/60 italic leading-relaxed">
                &ldquo;Placeholder testimonial text — to be replaced with a genuine
                parent or student quote.&rdquo;
              </p>
              <p className="mt-4 text-sm font-semibold text-navy">Parent / Guardian Name</p>
              <p className="text-xs text-navy/50">Placeholder</p>
            </div>
          ))}
        </div>
      </section> */}

      {/* GALLERY PREVIEW */}
      <section className="bg-mist py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading eyebrow="A look inside" title="Gallery" align="center" />
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...learningPhotos.slice(0, 3), mosquePhotos[0]].map((p) => (
              <div key={p.src} className="relative aspect-square rounded-sm overflow-hidden border border-navy/10">
                <Image src={p.src} alt={p.alt} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/gallery" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-dim">
              View full gallery <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 py-24 text-center">
        <h2 className="font-display text-3xl sm:text-4xl text-navy">
          Ready to Begin Your Qur&apos;an Journey?
        </h2>
        <Link
          href="/enroll"
          className="mt-8 inline-flex items-center rounded-sm bg-gold px-8 py-4 text-sm font-semibold text-navy-deep hover:bg-gold-light transition-colors focus-ring"
        >
          Register Now
        </Link>
      </section>
    </>
  );
}
