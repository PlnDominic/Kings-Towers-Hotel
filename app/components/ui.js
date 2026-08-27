// Shared visual treatment for the site's primary (filled, red) calls to action —
// keeps hover/focus/active states consistent across header, hero, and reservation.
export const ctaBase =
  "group relative inline-flex items-center justify-center gap-2 border-0 bg-accent font-semibold text-white no-underline transition-all duration-200 ease-out hover:bg-accent-hover hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-10px_rgba(226,35,26,0.65)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:translate-y-0 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-accent disabled:hover:shadow-none";

// Rounded pill buttons — used only by the header + hero, matching a
// specific reference design's shape. The rest of the site is deliberately
// square-cornered; this is a scoped exception on shape only, not color —
// still the site's own accent color, no separate palette.
export const pillBase =
  "group relative inline-flex items-center justify-center gap-2 rounded-full border-0 bg-accent font-semibold text-white no-underline transition-all duration-200 ease-out hover:bg-accent-hover hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-10px_rgba(226,35,26,0.65)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:translate-y-0 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-accent disabled:hover:shadow-none";

export const pillOutlineBase =
  "group relative inline-flex items-center justify-center gap-2 rounded-full border border-white bg-transparent font-semibold text-white no-underline transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-white hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:translate-y-0";

export function CtaArrow() {
  return (
    <span aria-hidden="true" className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">
      →
    </span>
  );
}

export function ChevronRight() {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-transform duration-200 ease-out group-hover:translate-x-1"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

// Centered serif heading + short accent underline, shared by the
// Gallery/Testimonials pair so the two columns read as one composition.
export function SerifHeading({ children }) {
  return (
    <div className="text-center">
      <h2 className="m-0 font-serif-display text-[clamp(1.6rem,3vw,2.1rem)] font-medium text-ink">{children}</h2>
      <span className="mx-auto mt-4 block h-[2px] w-14 bg-accent" />
    </div>
  );
}

// Underlined text-link nav item with a hover underline that draws in from
// the left. Color is left to the caller (an inline `style={{color:"inherit"}}`
// beats the project-wide `a { color: accent }` rule reliably, whereas the
// `text-inherit` utility class does not — see Header.js).
export const navLinkClass =
  "relative no-underline after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full";

// A "look here" callout, not a real control — it's `pointer-events-none`
// and purely decorative, sitting next to the actual clickable thing
// (a calendar day, a room card, the submit button) to point first-time
// guests at it. The caller positions it: wrap the target in `relative`
// and pass absolute-position classes for `className` (e.g. `-top-4
// right-2`). `rotate` sets the resting tilt in degrees — pass it as a
// prop, not a Tailwind rotate-* class, since the bounce animation drives
// `transform` on every frame and would silently override a static one.
export function ClickHereTag({ text = "Click Here!", className = "", rotate = -6 }) {
  return (
    <span
      aria-hidden="true"
      style={{ "--kt-tag-rotate": `${rotate}deg` }}
      className={`kt-click-bounce pointer-events-none absolute z-30 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-accent px-3.5 py-1.5 font-mono-label text-[0.7rem] font-bold uppercase tracking-[0.04em] text-white shadow-[0_10px_24px_-8px_rgba(226,35,26,0.75)] ${className}`}
    >
      {text}
      <span className="text-[0.95rem] leading-none">👆</span>
    </span>
  );
}
