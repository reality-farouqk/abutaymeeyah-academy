export default function ArchDivider({
  color = "#FBFCFE",
  flip = false,
}: {
  color?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 1200 60"
      preserveAspectRatio="none"
      className={`arch-divider ${flip ? "rotate-180" : ""}`}
      aria-hidden="true"
    >
      <path
        d="M0,60 L0,40 Q150,0 300,40 Q450,0 600,40 Q750,0 900,40 Q1050,0 1200,40 L1200,60 Z"
        fill={color}
      />
    </svg>
  );
}
