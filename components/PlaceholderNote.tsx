export default function PlaceholderNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 inline-flex items-center gap-2 rounded-sm bg-gold/10 px-3 py-1.5 text-xs text-gold-dim border border-gold/30">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
        <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {children}
    </p>
  );
}
