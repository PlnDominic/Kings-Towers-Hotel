// Shared visual treatment for the site's primary (filled, orange) calls to action —
// keeps hover/focus/active states consistent across header, hero, and reservation.
export const ctaBase =
  "group relative inline-flex items-center justify-center gap-2 border-0 bg-accent font-semibold text-white no-underline transition-all duration-200 ease-out hover:bg-accent-hover hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-10px_rgba(209,96,31,0.65)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:translate-y-0 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-accent disabled:hover:shadow-none";

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
