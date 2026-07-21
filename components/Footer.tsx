import Link from "next/link";

const programmes = [
  "Beginners Classes",
  "Intermediate Classes",
  "Advanced Classes",
  "Private Classes",
  "Muraajah Classes",
  "Private Tajweed",
];

export default function Footer() {
  return (
    <footer className="bg-navy-deep text-white">
      <div className="mx-auto max-w-6xl px-5 py-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl">Abu Taymeeyah Academy</p>
          <p className="mt-3 text-sm text-white/70 leading-relaxed">
            Quality Qur&apos;an memorization and Islamic learning through structured
            teaching, qualified instructors, and an environment that nurtures
            spiritual growth.
          </p>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold-light">Quick Links</p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            {[
              ["/", "Home"],
              ["/about", "About"],
              ["/programmes", "Programmes"],
              ["/admissions", "Admissions"],
              ["/gallery", "Gallery"],
              ["/contact", "Contact"],
              ["/enroll", "Enroll Now"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="hover:text-gold-light transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold-light">Programmes</p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            {programmes.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold-light">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>08037416047</li>
            <li>09123782303</li>
            <li className="break-all">abutaymeeyahinstitute@gmail.com</li>
            <li className="text-white/50">Address — placeholder, to be provided</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>&copy; {new Date().getFullYear()} Abu Taymeeyah Academy. All rights reserved.</p>
          <p>Nurturing hearts through the Qur&apos;an.</p>
        </div>
      </div>
    </footer>
  );
}
