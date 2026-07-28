"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ctaBase, CtaArrow, navLinkClass } from "./ui";

// Root-relative hashes ("/#about") rather than bare "#about": this header
// also renders on /reservation, where a bare hash would just edit the URL
// without navigating anywhere since that page has no matching id.
const navLinks = [
  { href: "/#about", label: "About" },
  { href: "/#amenities", label: "Amenities" },
  { href: "/#room-types", label: "Rooms" },
  { href: "/#gallery", label: "Gallery" },
];

function CrownMark({ className }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3.5 8.5 7 11l5-6.5L17 11l3.5-2.5-1.8 9.5H5.3L3.5 8.5Z" />
      <path d="M5.3 18h13.4" />
    </svg>
  );
}

function Wordmark({ compact }) {
  return (
    <Link href="/" style={{ color: "inherit" }} className="flex items-center gap-2.5 no-underline">
      <CrownMark className={compact ? "h-5 w-5 shrink-0" : "h-[1.35rem] w-[1.35rem] shrink-0"} />
      <span className="leading-none">
        <span className="block whitespace-nowrap font-display text-[1rem] font-bold tracking-[0.03em]">
          KINGS TOWERS
        </span>
        <span className="mt-1 hidden whitespace-nowrap font-mono-label text-[0.5rem] font-normal uppercase tracking-[0.36em] opacity-70 min-[480px]:block">
          Hotel &amp; Conference Centre
        </span>
      </span>
    </Link>
  );
}

function NavLink({ href, label, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{ color: "inherit" }}
      className={`${navLinkClass} whitespace-nowrap text-[0.8rem] font-semibold uppercase tracking-[0.08em]`}
    >
      {label}
    </Link>
  );
}

// `transparentAtTop`: only the homepage has a dark photo hero behind the
// header at scroll position 0, so only it should start in the
// transparent/white-text state. Every other page is plain white up top —
// starting transparent there renders white-on-white nav text until the
// user scrolls past 40px.
export default function Header({ transparentAtTop = false }) {
  const [scrolled, setScrolled] = useState(!transparentAtTop);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!transparentAtTop) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparentAtTop]);

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const textColor = scrolled ? "var(--color-ink)" : "#ffffff";

  return (
    <header className="fixed inset-x-0 top-0 z-[100] flex justify-center px-4 pt-4 min-[880px]:px-6">
      {/* Floating glass bar: brand mark left, primary nav centered, actions
          right — a conventional, highly scannable layout. Opacity/border/
          shadow shift once the page scrolls onto light content, where the
          same translucent tint would otherwise wash out. */}
      <div
        className="kt-nav-in grid w-full max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-6 border px-5 py-3 backdrop-blur-xl backdrop-saturate-150 transition-[background,border-color,box-shadow,color] duration-500"
        style={{
          background: scrolled ? "rgba(255,255,255,0.78)" : "rgba(12,13,16,0.28)",
          borderColor: scrolled ? "rgba(22,24,31,0.08)" : "rgba(255,255,255,0.28)",
          boxShadow: scrolled
            ? "0 8px 30px rgba(22,24,31,0.1), inset 0 1px 1px rgba(255,255,255,0.7)"
            : "0 8px 30px rgba(0,0,0,0.28), inset 0 1px 1px rgba(255,255,255,0.35)",
          color: textColor,
        }}
      >
        <Wordmark />

        <nav className="hidden items-center justify-center gap-9 min-[880px]:flex">
          {navLinks.map((l) => (
            <NavLink key={l.href} {...l} />
          ))}
        </nav>

        <div className="flex items-center justify-end gap-3">
          <div className="hidden min-[880px]:block">
            <Link
              href="/reservation"
              className={`${ctaBase} px-[1.15rem] py-2 text-[0.78rem] tracking-[0.04em]`}
            >
              Book Now
              <CtaArrow />
            </Link>
          </div>

          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
            className="flex h-9 w-9 items-center justify-center border-0 bg-transparent p-0 transition-colors duration-200 hover:opacity-70 min-[880px]:hidden"
            style={{ color: textColor }}
          >
            <span className="relative block h-4 w-5">
              <span className="absolute left-0 top-0 h-px w-5 bg-current" />
              <span className="absolute left-0 top-[7px] h-px w-5 bg-current" />
              <span className="absolute left-0 top-[14px] h-px w-5 bg-current" />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile nav: dimmed backdrop + a full-height drawer sliding in from
          the right. Large, thumb-friendly rows beat a cramped dropdown, and
          a persistent call link gives mobile guests the fastest path to a
          real person. */}
      <div
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-[98] bg-black/50 backdrop-blur-sm transition-opacity duration-300 min-[880px]:hidden ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={`fixed inset-y-0 right-0 z-[99] flex w-[85vw] max-w-[380px] flex-col bg-cream shadow-[-20px_0_50px_-12px_rgba(22,24,31,0.35)] transition-transform duration-300 ease-out min-[880px]:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-hairline px-6 py-5 text-ink">
          <Wordmark compact />
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="flex h-9 w-9 items-center justify-center border-0 bg-transparent p-0 text-ink transition-opacity duration-200 hover:opacity-60"
          >
            <span className="relative block h-4 w-4">
              <span className="absolute left-0 top-[7px] h-px w-4 rotate-45 bg-current" />
              <span className="absolute left-0 top-[7px] h-px w-4 -rotate-45 bg-current" />
            </span>
          </button>
        </div>

        <nav className="flex flex-1 flex-col overflow-y-auto px-6 py-2">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="group flex items-center justify-between border-b border-hairline py-5 text-[1.05rem] font-medium text-ink no-underline"
            >
              {l.label}
              <span
                aria-hidden="true"
                className="text-accent opacity-0 transition-all duration-200 -translate-x-1 group-hover:translate-x-0 group-hover:opacity-100"
              >
                →
              </span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-hairline px-6 py-6">
          <Link
            href="/reservation"
            onClick={() => setMenuOpen(false)}
            className={`${ctaBase} w-full px-[1.1rem] py-3.5 text-[0.85rem] tracking-[0.04em]`}
          >
            Book Now
            <CtaArrow />
          </Link>
          <a
            href="tel:+2335129308"
            className="mt-4 block text-center font-mono-label text-[0.78rem] tracking-[0.06em] text-muted no-underline hover:text-accent"
          >
            Call us · +233 51 29 308
          </a>
        </div>
      </div>
    </header>
  );
}
