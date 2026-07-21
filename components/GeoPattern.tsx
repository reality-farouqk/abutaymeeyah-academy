// A restrained 8-point Islamic star lattice, used sparingly as ambient
// texture on dark navy sections. Kept low-opacity so it never competes
// with content.
export default function GeoPattern({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="geo-star" width="64" height="64" patternUnits="userSpaceOnUse">
          <g stroke="#E8C878" strokeWidth="0.6" fill="none" opacity="0.5">
            <path d="M32 4 L44 20 L60 20 L48 32 L60 44 L44 44 L32 60 L20 44 L4 44 L16 32 L4 20 L20 20 Z" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#geo-star)" />
    </svg>
  );
}
