"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CtaArrow, pillBase } from "./ui";

// Root-relative hashes ("/#about") rather than bare "#about": this header
// also renders on /reservation, where a bare hash would just edit the URL
// without navigating anywhere since that page has no matching id.
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#room-types", label: "Rooms & Suites" },
  { href: "/#amenities", label: "Amenities" },
  { href: "/#gallery", label: "Gallery" },
];

function CrownMark({ className }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 9.5 6.3 11 9 6l3 4 3-4 2.7 5 2.3-1.5-1.4 8.5H5.4L4 9.5Z" />
      <circle cx="4" cy="8.3" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="20" cy="8.3" r="0.9" fill="currentColor" stroke="none" />
      <path d="M5.6 17.5h12.8" />
    </svg>
  );
}

function Wordmark({ compact, textColor }) {
  return (
    <Link href="/" style={{ color: "inherit" }} className="flex items-center gap-2.5 no-underline">
      <CrownMark className={`shrink-0 text-accent ${compact ? "h-5 w-5" : "h-6 w-6"}`} />
      <span className="leading-none">
        <span
          className="block whitespace-nowrap font-serif-display text-[1.05rem] font-semibold tracking-[0.02em]"
          style={{ color: textColor }}
        >
          Kings Towers
        </span>
        <span className="mt-0.5 block whitespace-nowrap text-right font-mono-label text-[0.55rem] font-normal uppercase tracking-[0.42em] text-accent">
          Hotel
        </span>
      </span>
    </Link>
  );
}

function NavLink({ href, label, active, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{ color: active ? "var(--color-accent)" : "inherit" }}
      className="group relative whitespace-nowrap text-[0.92rem] font-medium no-underline transition-colors duration-200 hover:text-accent"
    >
      {label}
      <span
        aria-hidden="true"
        className={`absolute -bottom-1.5 left-0 h-px bg-accent transition-all duration-300 ${
          active ? "w-full" : "w-0 group-hover:w-full"
        }`}
      />
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
  const pathname = usePathname();

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
    <header
      className="fixed inset-x-0 top-0 z-[100] transition-[background-color,border-color,box-shadow] duration-400"
      style={{
        background: scrolled ? "var(--color-cream)" : "transparent",
        borderBottom: scrolled ? "1px solid var(--color-hairline)" : "1px solid transparent",
        boxShadow: scrolled ? "0 12px 30px -20px rgba(22,24,31,0.25)" : "none",
        color: textColor,
      }}
    >
      {/* Full-width, edge-to-edge bar — no box around it, just brand mark
          left, primary nav centered, actions right, floating directly on
          the hero photo until the page scrolls. */}
      <div className="kt-nav-in mx-auto grid max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-6 px-5 py-4 min-[880px]:px-8">
        <Wordmark textColor={textColor} />

        <nav className="hidden items-center justify-center gap-8 min-[880px]:flex">
          {navLinks.map((l) => (
            <NavLink key={l.href} {...l} active={l.href === "/" && pathname === "/"} />
          ))}
        </nav>

        <div className="flex items-center justify-end gap-3">
          <div className="hidden min-[880px]:block">
            <Link href="/reservation" className={`${pillBase} px-6 py-2.5 text-[0.85rem] tracking-[0.02em]`}>
              Book Now
            </Link>
          </div>

          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full border p-0 transition-colors duration-200 hover:opacity-70 min-[880px]:hidden"
            style={{ color: textColor, borderColor: textColor }}
          >
            <span className="relative block h-3.5 w-4">
              <span className="absolute left-0 top-0 h-px w-4 bg-current" />
              <span className="absolute left-0 top-[7px] h-px w-4 bg-current" />
              <span className="absolute left-0 top-[14px] h-px w-4 bg-current" />
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
        className={`fixed inset-0 z-[98] bg-black/55 transition-opacity duration-300 min-[880px]:hidden ${
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
          <Wordmark compact textColor="var(--color-ink)" />
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
            className={`${pillBase} w-full px-[1.1rem] py-3.5 text-[0.85rem] tracking-[0.04em]`}
          >
            Book Now
            <CtaArrow />
          </Link>
          <a
            href="tel:+233208888123"
            className="mt-4 block text-center font-mono-label text-[0.78rem] tracking-[0.06em] text-muted no-underline hover:text-accent"
          >
            Call us · 020 88 88 123
          </a>
        </div>
      </div>
    </header>
  );
}
