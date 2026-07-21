import type { Metadata } from "next";
import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import PlaceholderNote from "@/components/PlaceholderNote";
import GeoPattern from "@/components/GeoPattern";
import { mosquePhotos, learningPhotos } from "@/lib/stock-images";

export const metadata: Metadata = { title: "About Us | Abu Taymeeyah Academy" };

const values = ["Excellence", "Sincerity", "Discipline", "Compassion", "Integrity", "Lifelong Learning"];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy-gradient text-white py-20">
        <Image
          src={mosquePhotos[1].src}
          alt={mosquePhotos[1].alt}
          fill
          className="object-cover opacity-25"
          priority
        />
        <div className="absolute inset-0 bg-navy-gradient opacity-90" />
        <GeoPattern className="absolute inset-0 opacity-20" />
        <div className="relative mx-auto max-w-6xl px-5">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold-light">About Us</p>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl">About Abu Taymeeyah Academy</h1>
        </div>
      </section>

      {/* Our Story */}
      <section className="mx-auto max-w-6xl px-5 py-20 grid lg:grid-cols-[1fr_1fr] gap-12 items-center">
        <div>
          <SectionHeading eyebrow="Our Story · Est. 2021" title="How the academy began" />
          <p className="mt-5 text-navy/70 leading-relaxed">
            Established in 2021, Abu Taymeeyah Academy began with a vision to
            inspire a global community united in the pursuit of Qur&apos;an
            memorization — fostering profound spiritual connection, lifelong
            learning, and the embodiment of Qur&apos;anic values to transform
            lives and societies.
          </p>
          <p className="mt-4 text-navy/70 leading-relaxed">
            Over the years, the academy has expanded its academic offerings
            to include Private Classes, Muraajah Classes, Beginners Classes,
            Intermediate Classes, Advanced Classes, and Tajweed and Qiraat
            classes. Abu Taymeeyah Academy has maintained a tradition of
            excellence, producing students who excel in Qur&apos;an
            memorization, fluency, and discipline — qualities that have
            shaped its academic reputation.
          </p>
        </div>
        <div className="relative aspect-[4/3] arch-clip-wide overflow-hidden border border-navy/10 shadow-arch">
          <Image src={learningPhotos[4].src} alt={learningPhotos[4].alt} fill className="object-cover" />
        </div>
      </section>

      {/* Director's Welcome Message */}
      <section className="bg-mist py-20">
        <div className="mx-auto max-w-5xl px-5 grid lg:grid-cols-[auto_1fr] gap-10 items-start">
          <div className="mx-auto lg:mx-0 h-28 w-28 arch-clip bg-navy/10 border border-navy/15 flex items-center justify-center shrink-0">
            <span className="text-[11px] font-mono text-navy/40 text-center px-2">Director&apos;s photo placeholder</span>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold-dim">Director&apos;s Welcome Message</p>
            <div className="mt-4 space-y-4 text-navy/75 leading-relaxed">
              <p>
                It is with great pleasure that I welcome you to Abu
                Taymeeyah Academy — a place where excellence, spiritual
                growth, and character development form the foundation of
                our mission. Since our establishment in 2021, we have
                remained committed to nurturing a thriving community
                dedicated to Qur&apos;an memorization, inspiring every
                member to strengthen their connection with the Holy
                Qur&apos;an and embody its teachings in their daily lives.
              </p>
              <p>
                At Abu Taymeeyah Academy, we believe every learner possesses
                unique potential. Our dedicated team works tirelessly to
                create an environment that inspires curiosity, creativity,
                and integrity — preparing our students not only for
                academic success but for meaningful contributions to
                society. As you explore our programs and community, I
                encourage you to embrace the opportunities that await. We
                look forward to walking this journey of growth and
                achievement with you.
              </p>
            </div>
            <p className="mt-6 font-display text-lg text-navy">Abu Taymeeyah Abdullah</p>
            <p className="text-sm text-navy/55">Director, Abu Taymeeyah Academy</p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-mist py-20">
        <div className="mx-auto max-w-6xl px-5 grid lg:grid-cols-2 gap-10">
          <div className="rounded-sm bg-white border border-navy/10 p-8">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold-dim">Mission</p>
            <p className="mt-4 font-display text-xl text-navy leading-relaxed">
              Our mission is to nurture a thriving community dedicated to
              Qur&apos;an memorization, fostering spiritual growth, unity, and
              mutual support. By emphasizing structured learning, accessible
              resources, and collaborative encouragement, we aim to inspire
              each member to strengthen their connection with the Holy
              Qur&apos;an and embody its teachings in daily life.
            </p>
          </div>
          <div className="rounded-sm bg-white border border-navy/10 p-8">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold-dim">Vision</p>
            <p className="mt-4 font-display text-xl text-navy leading-relaxed">
              To inspire a global community united in the pursuit of
              Qur&apos;an memorization, fostering profound spiritual
              connection, lifelong learning, and the embodiment of Qur&apos;anic
              values to transform lives and societies.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <SectionHeading eyebrow="What guides us" title="Core Values" align="center" />
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {values.map((v) => (
            <div key={v} className="rounded-sm border border-navy/10 bg-white py-6 text-center">
              <p className="font-display text-navy">{v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Meet Our Teachers */}
      <section className="bg-mist py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading eyebrow="Our Instructors" title="Meet Our Teachers" align="center" />
          <div className="mt-4 text-center">
            <PlaceholderNote>Teacher photos, qualifications and experience to be provided</PlaceholderNote>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-sm bg-white border border-navy/10 overflow-hidden">
                <div className="aspect-square bg-navy/5 flex items-center justify-center">
                  <span className="text-xs font-mono text-navy/40">Photo placeholder</span>
                </div>
                <div className="p-5">
                  <p className="font-display text-lg text-navy">Ustadh / Ustadhah Name</p>
                  <p className="text-sm text-navy/60">Qualification — placeholder</p>
                  <p className="text-xs text-navy/45 mt-1">Years of experience — placeholder</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
