"use client";

import { useEffect, useState } from "react";
import { ctaBase, CtaArrow, navLinkClass } from "./ui";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#room-types", label: "Rooms" },
  { href: "#leisure", label: "Leisure" },
  { href: "#contact", label: "Contact" },
];

function NavLink({ href, label, onClick, className = "" }) {
  return (
    <a
      href={href}
      onClick={onClick}
      style={{ color: "inherit" }}
      className={`${navLinkClass} text-[0.82rem] tracking-[0.04em] ${className}`}
    >
      {label}
    </a>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const textColor = scrolled ? "var(--color-ink)" : "#ffffff";

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-[100] grid h-20 grid-cols-[1fr_auto_1fr] items-center px-[clamp(1.25rem,5vw,5.5rem)] border-b transition-[background,color,border-color] duration-300"
        style={{
          borderBottomColor: scrolled ? "var(--color-hairline)" : "transparent",
          background: scrolled ? "rgba(250,248,244,0.88)" : "transparent",
          backdropFilter: scrolled ? "saturate(140%) blur(14px)" : "none",
          color: textColor,
        }}
      >
        <div className="hidden items-center gap-[2.1rem] min-[880px]:flex">
          {navLinks.slice(0, 3).map((l) => (
            <NavLink key={l.href} {...l} />
          ))}
        </div>

        <div className="whitespace-nowrap text-center font-display text-[1.15rem] font-bold tracking-[0.04em]">
          KINGS TOWERS
          <span className="mt-0.5 block font-mono-label text-[0.54rem] font-normal uppercase tracking-[0.42em] opacity-80">
            Hotel &amp; Conference Centre
          </span>
        </div>

        <div className="flex items-center justify-end gap-[1.35rem]">
          <div className="hidden items-center gap-[1.35rem] min-[880px]:flex">
            <NavLink href="#contact" label="Contact" />
            <a href="#reservation" className={`${ctaBase} px-[1.1rem] py-2 text-[0.78rem] tracking-[0.04em]`}>
              Book Now
              <CtaArrow />
            </a>
          </div>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center border-0 bg-transparent p-0 min-[880px]:hidden"
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
      </header>

      <div
        className={`fixed inset-x-0 top-20 z-[99] flex flex-col border-b border-hairline bg-cream px-[clamp(1.25rem,5vw,5.5rem)] text-ink shadow-[0_16px_32px_-16px_rgba(0,0,0,0.2)] transition-all duration-300 min-[880px]:hidden ${
          menuOpen ? "visible max-h-96 py-4 opacity-100" : "invisible max-h-0 py-0 opacity-0"
        }`}
      >
        {navLinks.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setMenuOpen(false)}
            className="border-b border-hairline py-3 text-[0.95rem] font-medium text-ink no-underline last:border-0"
          >
            {l.label}
          </a>
        ))}
        <a
          href="#reservation"
          onClick={() => setMenuOpen(false)}
          className={`${ctaBase} my-3 px-[1.1rem] py-3 text-[0.85rem] tracking-[0.04em]`}
        >
          Book Now
          <CtaArrow />
        </a>
      </div>
    </>
  );
}
