// Defines the reusable pointed-arch (mihrab) clip paths used throughout the
// site as the signature visual motif, echoing the academy's logo mark.
// Rendered once, invisibly, and referenced everywhere via .arch-clip / .arch-clip-wide
export default function ArchDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <clipPath id="arch-clip-path" clipPathUnits="objectBoundingBox">
          <path d="M0,1 L0,0.42 C0,0.15 0.2,0 0.5,0 C0.8,0 1,0.15 1,0.42 L1,1 Z" />
        </clipPath>
        <clipPath id="arch-clip-path-wide" clipPathUnits="objectBoundingBox">
          <path d="M0,1 L0,0.6 C0,0.15 0.25,0 0.5,0 C0.75,0 1,0.15 1,0.6 L1,1 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}
