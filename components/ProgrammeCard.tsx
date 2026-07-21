import Link from "next/link";

export default function ProgrammeCard({
  title,
  description,
  index,
}: {
  title: string;
  description: string;
  index: string;
}) {
  return (
    <div className="group relative rounded-sm border border-navy/10 bg-white p-7 pt-9 hover:border-gold/50 hover:shadow-arch transition-all">
      <div className="h-10 w-10 arch-clip bg-navy flex items-center justify-center text-gold-light font-mono text-xs">
        {index}
      </div>
      <h3 className="mt-5 font-display text-xl text-navy">{title}</h3>
      <p className="mt-2 text-sm text-navy/70 leading-relaxed">{description}</p>
      <Link
        href="/programmes"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gold-dim group-hover:gap-2.5 transition-all"
      >
        Learn more <span aria-hidden="true">&rarr;</span>
      </Link>
    </div>
  );
}
