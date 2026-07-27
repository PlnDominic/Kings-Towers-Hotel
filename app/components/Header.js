"use client";

import { useEffect, useState } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-[100] grid h-20 grid-cols-[1fr_auto_1fr] items-center px-[clamp(1.25rem,5vw,5.5rem)] border-b transition-[background,color,border-color] duration-300"
      style={{
        borderBottomColor: scrolled ? "var(--color-hairline)" : "transparent",
        background: scrolled ? "rgba(250,248,244,0.88)" : "transparent",
        backdropFilter: scrolled ? "saturate(140%) blur(14px)" : "none",
        color: scrolled ? "var(--color-ink)" : "#ffffff",
      }}
    >
      <div className="hidden items-center gap-[2.1rem] min-[880px]:flex">
        <a href="#about" className="text-[0.82rem] tracking-[0.04em] text-inherit no-underline">
          About
        </a>
        <a href="#room-types" className="text-[0.82rem] tracking-[0.04em] text-inherit no-underline">
          Rooms
        </a>
        <a href="#leisure" className="text-[0.82rem] tracking-[0.04em] text-inherit no-underline">
          Leisure
        </a>
      </div>

      <div className="whitespace-nowrap text-center font-display text-[1.15rem] font-bold tracking-[0.04em]">
        KINGS TOWERS
        <span className="mt-0.5 block font-mono-label text-[0.54rem] font-normal uppercase tracking-[0.42em] opacity-80">
          Hotel &amp; Conference Centre
        </span>
      </div>

      <div className="hidden items-center justify-end gap-[1.35rem] min-[880px]:flex">
        <a href="#contact" className="text-[0.82rem] tracking-[0.04em] text-inherit no-underline">
          Contact
        </a>
        <a
          href="#reservation"
          className="whitespace-nowrap border border-accent bg-accent px-[1.1rem] py-2 text-[0.78rem] tracking-[0.04em] text-white no-underline"
        >
          Book Now
        </a>
      </div>
    </header>
  );
}
