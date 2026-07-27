"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ctaBase, CtaArrow, navLinkClass } from "./ui";

// Root-relative hashes ("/#about") rather than bare "#about": this header
// also renders on /reservation, where a bare hash would just edit the URL
// without navigating anywhere since that page has no matching id.
const navLinks = [
  { href: "/#about", label: "About" },
  { href: "/#room-types", label: "Rooms" },
  { href: "/#leisure", label: "Leisure" },
];

function NavLink({ href, label, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{ color: "inherit" }}
      className={`${navLinkClass} text-[0.82rem] tracking-[0.04em]`}
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
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const textColor = scrolled ? "var(--color-ink)" : "#ffffff";

  return (
    <header className="fixed inset-x-0 top-0 z-[100] flex justify-center px-4 pt-4">
      {/* Floating liquid-glass pill: same material language as the hero
          booking widget, so the two read as one system. Opacity/border/shadow
          shift once the page scrolls onto light content, where the same
          translucent tint would otherwise wash out. */}
      <div
        className="kt-nav-in grid w-full max-w-5xl grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-full border px-6 py-3 backdrop-blur-xl backdrop-saturate-150 transition-[background,border-color,box-shadow,color] duration-500"
        style={{
          background: scrolled ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.1)",
          borderColor: scrolled ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.25)",
          boxShadow: scrolled
            ? "0 8px 30px rgba(22,24,31,0.12), inset 0 1px 1px rgba(255,255,255,0.7), inset 0 -1px 1px rgba(255,255,255,0.1)"
            : "0 8px 30px rgba(0,0,0,0.32), inset 0 1px 1px rgba(255,255,255,0.45), inset 0 -1px 1px rgba(255,255,255,0.06)",
          color: textColor,
        }}
      >
        <div className="hidden items-center gap-[1.9rem] min-[880px]:flex">
          {navLinks.map((l) => (
            <NavLink key={l.href} {...l} />
          ))}
        </div>

        <div className="whitespace-nowrap text-center font-display text-[1.05rem] font-bold tracking-[0.04em]">
          KINGS TOWERS
          <span className="mt-0.5 block font-mono-label text-[0.5rem] font-normal uppercase tracking-[0.4em] opacity-80">
            Hotel &amp; Conference Centre
          </span>
        </div>

        <div className="flex items-center justify-end gap-[1.1rem]">
          <div className="hidden items-center gap-[1.1rem] min-[880px]:flex">
            <Link
              href="/reservation"
              className={`${ctaBase} rounded-full px-[1.1rem] py-2 text-[0.78rem] tracking-[0.04em]`}
            >
              Book Now
              <CtaArrow />
            </Link>
          </div>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border-0 bg-transparent p-0 transition-colors duration-200 hover:bg-white/10 min-[880px]:hidden"
            style={{ color: textColor }}
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 h-px w-5 bg-current transition-all duration-300 ${
                  menuOpen ? "top-[7px] rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] h-px w-5 bg-current transition-opacity duration-300 ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 h-px w-5 bg-current transition-all duration-300 ${
                  menuOpen ? "top-[7px] -rotate-45" : "top-[14px]"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu: a second glass panel, floating just below the pill. */}
      <div
        className={`absolute inset-x-4 top-[4.75rem] z-[99] flex flex-col overflow-hidden rounded-3xl border border-white/30 bg-white/80 px-6 text-ink shadow-[0_20px_50px_-12px_rgba(22,24,31,0.35)] backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 min-[880px]:hidden ${
          menuOpen ? "visible max-h-96 py-3 opacity-100" : "invisible max-h-0 py-0 opacity-0"
        }`}
      >
        {navLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setMenuOpen(false)}
            className="border-b border-ink/10 py-3 text-[0.95rem] font-medium text-ink no-underline last:border-0"
          >
            {l.label}
          </Link>
        ))}
        <Link
          href="/reservation"
          onClick={() => setMenuOpen(false)}
          className={`${ctaBase} my-3 rounded-full px-[1.1rem] py-3 text-[0.85rem] tracking-[0.04em]`}
        >
          Book Now
          <CtaArrow />
        </Link>
      </div>
    </header>
  );
}
