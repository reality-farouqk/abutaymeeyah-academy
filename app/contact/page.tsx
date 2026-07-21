import type { Metadata } from "next";
import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import PlaceholderNote from "@/components/PlaceholderNote";
import GeoPattern from "@/components/GeoPattern";
import ContactForm from "@/components/ContactForm";
import { mosquePhotos } from "@/lib/stock-images";

export const metadata: Metadata = { title: "Contact | Abu Taymeeyah Academy" };

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy-gradient text-white py-20">
        <Image src={mosquePhotos[2].src} alt={mosquePhotos[2].alt} fill className="object-cover opacity-20" priority />
        <div className="absolute inset-0 bg-navy-gradient opacity-90" />
        <GeoPattern className="absolute inset-0 opacity-20" />
        <div className="relative mx-auto max-w-6xl px-5">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold-light">Contact</p>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl">We&apos;d love to hear from you</h1>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 grid lg:grid-cols-[1fr_1.2fr] gap-14">
        <div>
          <SectionHeading eyebrow="Reach us" title="Contact Information" />

          <div className="mt-8 space-y-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-gold-dim">Phone</p>
              <p className="mt-1 text-navy">08037416047</p>
              <p className="text-navy">09123782303</p>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-gold-dim">Email</p>
              <a href="mailto:abutaymeeyahinstitute@gmail.com" className="mt-1 block text-navy hover:text-gold-dim break-all">
                abutaymeeyahinstitute@gmail.com
              </a>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-gold-dim">WhatsApp</p>
              <a
                href="https://wa.me/2348037416047"
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center rounded-sm bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-light transition-colors"
              >
                Message on WhatsApp
              </a>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-gold-dim">Office Hours</p>
              <p className="mt-1 text-navy/60 text-sm">Placeholder — to be confirmed</p>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-gold-dim">Address</p>
              <p className="mt-1 text-navy/60 text-sm">Placeholder — physical address to be provided</p>
            </div>
            <PlaceholderNote>Google Maps location and social media links to be added</PlaceholderNote>
          </div>
        </div>

        <div>
          <ContactForm />

          <div className="mt-6 aspect-[16/9] rounded-sm bg-mist border border-navy/10 flex items-center justify-center">
            <span className="text-xs font-mono text-navy/40">Google Map placeholder</span>
          </div>
        </div>
      </section>
    </>
  );
}
