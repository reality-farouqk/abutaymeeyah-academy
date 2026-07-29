import type { Metadata } from "next";
import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import PlaceholderNote from "@/components/PlaceholderNote";
import GeoPattern from "@/components/GeoPattern";
import { quranPhotos, mosquePhotos, learningPhotos, type StockPhoto } from "@/lib/stock-images";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos from Abu Taymeeyah Academy's Qur'an memorization classes, Tajweed sessions, and student life.",
  alternates: { canonical: "/gallery" },
};

function PhotoGrid({ photos }: { photos: StockPhoto[] }) {
  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((p) => (
        <figure key={p.src} className="relative aspect-square rounded-sm overflow-hidden border border-navy/10 bg-mist">
          <Image src={p.src} alt={p.alt} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
        </figure>
      ))}
    </div>
  );
}

export default function GalleryPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy-gradient text-white py-20">
        <GeoPattern className="absolute inset-0 opacity-25" />
        <div className="relative mx-auto max-w-6xl px-5">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold-light">Gallery</p>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl">Life at the Academy</h1>
          {/* <p className="mt-4 max-w-xl text-white/75 leading-relaxed">
            Representative photography for now — real photos of our students,
            classes and events will replace these as the academy shares them.
          </p> */}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-20 space-y-16">
        <div>
          <SectionHeading eyebrow="Category" title="Qur'an Memorization Sessions" />
          <PhotoGrid photos={learningPhotos.slice(0, 4)} />
        </div>

        <div>
          <SectionHeading eyebrow="Category" title="Islamic Programs" />
          <PhotoGrid photos={mosquePhotos} />
        </div>

        <div>
          <SectionHeading eyebrow="Category" title="Students" />
          <PhotoGrid photos={learningPhotos.slice(2, 6)} />
        </div>

        <div>
          <SectionHeading eyebrow="Category" title="Qur'an &amp; Study Materials" />
          <PhotoGrid photos={quranPhotos} />
        </div>

        {/* Categories still needing the academy's own photography */}
        {/* {["Events", "Graduation", "Competitions"].map((cat) => (
          <div key={cat}>
            <SectionHeading eyebrow="Category" title={cat} />
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-sm bg-mist border border-navy/10 flex items-center justify-center"
                >
                  <span className="text-xs font-mono text-navy/40">Photo placeholder</span>
                </div>
              ))}
            </div>
          </div>
        ))} */}
      </div>

      {/* <div className="mx-auto max-w-3xl px-5 pb-20 text-center">
        <PlaceholderNote>
          Islamic/Qur&apos;an stock photography above is free-to-use from Pexels — replace with the
          academy&apos;s own photos of classes, students and events as they become available
        </PlaceholderNote>
      </div> */}
    </>
  );
}
