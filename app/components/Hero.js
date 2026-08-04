"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { heroImages } from "../data";
import { pillBase, pillOutlineBase } from "./ui";

const fieldButtonClass =
  "flex min-w-0 flex-1 flex-col items-start gap-1 border-b border-hairline px-5 py-4 text-left transition-colors duration-200 hover:bg-cream/60 min-[880px]:border-b-0 min-[880px]:border-r min-[880px]:border-hairline min-[880px]:last-of-type:border-r-0";

const fieldLabelClass = "font-mono-label text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-muted";

function FieldIcon({ children }) {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-accent"
    >
      {children}
    </svg>
  );
}

function CounterRow({ label, value, onChange, min = 0 }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-[0.88rem] text-ink">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          aria-label={`Decrease ${label}`}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-hairline bg-transparent text-ink transition-colors duration-200 hover:border-accent hover:text-accent"
        >
          −
        </button>
        <span className="w-4 text-center text-[0.88rem] text-ink">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          aria-label={`Increase ${label}`}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-hairline bg-transparent text-ink transition-colors duration-200 hover:border-accent hover:text-accent"
        >
          +
        </button>
      </div>
    </div>
  );
}

// The white "booking card" that overlaps the bottom edge of the hero photo.
// Two honest tabs: a real quick-search that hands off to the reservation
// wizard, and a "manage booking" pane that points to a phone/email instead
// of faking a lookup system that doesn't exist.
function BookingCard() {
  const router = useRouter();
  const [tab, setTab] = useState("book");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [promo, setPromo] = useState("");
  const [guestsOpen, setGuestsOpen] = useState(false);
  const guestsRef = useRef(null);

  useEffect(() => {
    if (!guestsOpen) return;
    const onClick = (e) => {
      if (guestsRef.current && !guestsRef.current.contains(e.target)) setGuestsOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [guestsOpen]);

  function onSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    params.set("adults", String(adults));
    params.set("children", String(children));
    if (promo.trim()) params.set("promo", promo.trim());
    router.push(`/reservation?${params.toString()}`);
  }

  return (
    <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-[0_25px_60px_-20px_rgba(22,24,31,0.35)]">
      <div className="flex border-b border-hairline">
        <button
          type="button"
          onClick={() => setTab("book")}
          className="flex items-center gap-2 border-b-2 px-6 py-4 text-[0.88rem] font-semibold transition-colors duration-200"
          style={{
            borderColor: tab === "book" ? "var(--color-accent)" : "transparent",
            color: tab === "book" ? "var(--color-accent)" : "var(--color-muted)",
          }}
        >
          <FieldIcon>
            <rect x="3" y="10" width="18" height="9" rx="1" />
            <path d="M3 10V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3M8 5v3M16 5v3" />
          </FieldIcon>
          Book Your Stay
        </button>
        <button
          type="button"
          onClick={() => setTab("manage")}
          className="flex items-center gap-2 border-b-2 px-6 py-4 text-[0.88rem] font-semibold transition-colors duration-200"
          style={{
            borderColor: tab === "manage" ? "var(--color-accent)" : "transparent",
            color: tab === "manage" ? "var(--color-accent)" : "var(--color-muted)",
          }}
        >
          <FieldIcon>
            <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
            <path d="M12 8v4l2.5 2.5" />
          </FieldIcon>
          Manage Booking
        </button>
      </div>

      {tab === "book" ? (
        <form onSubmit={onSubmit} className="flex flex-col min-[880px]:flex-row min-[880px]:items-stretch">
          <label className={fieldButtonClass}>
            <span className={fieldLabelClass}>
              <FieldIcon>
                <rect x="3" y="5" width="18" height="16" rx="1" />
                <path d="M3 10h18M8 3v4M16 3v4" />
              </FieldIcon>
              <span className="ml-1.5 align-middle">Check-in</span>
            </span>
            <input
              required
              type="date"
              value={checkIn}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full border-0 bg-transparent p-0 text-[0.92rem] text-ink focus:outline-none"
            />
          </label>

          <label className={fieldButtonClass}>
            <span className={fieldLabelClass}>
              <FieldIcon>
                <rect x="3" y="5" width="18" height="16" rx="1" />
                <path d="M3 10h18M8 3v4M16 3v4" />
              </FieldIcon>
              <span className="ml-1.5 align-middle">Check-out</span>
            </span>
            <input
              required
              type="date"
              value={checkOut}
              min={checkIn || new Date().toISOString().slice(0, 10)}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full border-0 bg-transparent p-0 text-[0.92rem] text-ink focus:outline-none"
            />
          </label>

          <div ref={guestsRef} className={`relative ${fieldButtonClass}`}>
            <button
              type="button"
              onClick={() => setGuestsOpen((v) => !v)}
              className="flex w-full flex-col items-start gap-1 border-0 bg-transparent p-0 text-left"
            >
              <span className={fieldLabelClass}>
                <FieldIcon>
                  <circle cx="12" cy="8" r="3.2" />
                  <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
                </FieldIcon>
                <span className="ml-1.5 align-middle">Guests</span>
              </span>
              <span className="text-[0.92rem] text-ink">
                {adults} Adult{adults > 1 ? "s" : ""}, {children} Child{children === 1 ? "" : "ren"}
              </span>
            </button>

            {guestsOpen && (
              <div className="absolute left-0 top-full z-30 mt-2 w-64 divide-y divide-hairline rounded-xl border border-hairline bg-white p-4 shadow-[0_20px_45px_-15px_rgba(22,24,31,0.35)]">
                <CounterRow label="Adults" value={adults} onChange={setAdults} min={1} />
                <CounterRow label="Children" value={children} onChange={setChildren} min={0} />
              </div>
            )}
          </div>

          <label className={fieldButtonClass}>
            <span className={fieldLabelClass}>
              <FieldIcon>
                <path d="M20.6 12.6 12 21.2a2 2 0 0 1-2.8 0l-6.4-6.4a2 2 0 0 1 0-2.8L11.4 3.4A2 2 0 0 1 12.8 3H19a2 2 0 0 1 2 2v6.2a2 2 0 0 1-.4 1.4Z" />
                <circle cx="15.5" cy="8.5" r="1.2" fill="currentColor" stroke="none" />
              </FieldIcon>
              <span className="ml-1.5 align-middle">Promo Code</span>
            </span>
            <input
              type="text"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              placeholder="Enter code (optional)"
              className="w-full border-0 bg-transparent p-0 text-[0.92rem] text-ink placeholder:text-muted focus:outline-none"
            />
          </label>

          <div className="flex items-center p-3 min-[880px]:p-4">
            <button type="submit" className={`${pillBase} w-full whitespace-nowrap px-7 py-3.5 text-[0.88rem]`}>
              Check Availability
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col items-start gap-3 px-6 py-8 min-[880px]:flex-row min-[880px]:items-center min-[880px]:justify-between min-[880px]:px-8">
          <p className="m-0 max-w-[46ch] text-[0.92rem] leading-[1.7] text-body">
            We don&#39;t have online booking lookup yet — to check, change, or cancel an existing reservation, please
            call or email our front desk directly.
          </p>
          <div className="flex shrink-0 gap-3">
            <a
              href="tel:+233208888123"
              className="group relative inline-flex items-center justify-center gap-2 rounded-full border border-accent bg-transparent px-5 py-2.5 text-[0.85rem] font-semibold text-accent no-underline transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-accent hover:text-white"
            >
              Call Us
            </a>
            <a href="mailto:kingstowershotel@gmail.com" className={`${pillBase} px-5 py-2.5 text-[0.85rem]`}>
              Email Us
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <section className="relative isolate flex min-h-[88svh] overflow-hidden">
        <div className="absolute inset-0 -z-20">
          {heroImages.map((img, i) => (
            <Image
              key={img.src}
              src={img.src}
              alt={img.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover transition-opacity duration-[1200ms] ease-in-out"
              style={{ opacity: i === index ? 1 : 0 }}
            />
          ))}
        </div>

        <div className="absolute left-1/2 bottom-[clamp(1.25rem,4vh,2.5rem)] z-20 flex -translate-x-1/2 gap-2">
          {heroImages.map((img, i) => (
            <button
              key={img.src}
              onClick={() => setIndex(i)}
              aria-label={`Show slide ${i + 1}`}
              className="h-2 cursor-pointer rounded-full border-0 p-0 transition-all duration-300"
              style={{
                width: i === index ? "22px" : "8px",
                background: i === index ? "#fff" : "rgba(255,255,255,0.45)",
              }}
            />
          ))}
        </div>

        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(90deg, rgba(10,10,10,0.72) 0%, rgba(10,10,10,0.42) 48%, rgba(10,10,10,0.22) 100%), linear-gradient(180deg, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.15) 45%, rgba(10,10,10,0.6) 100%)",
          }}
        />

        {/* Left-aligned content block — eyebrow, two-line headline (second
            line italic in the accent color), description, single CTA. */}
        <div className="relative flex w-full flex-col justify-center gap-5 px-[clamp(1.25rem,6vw,6rem)] pt-24 pb-[clamp(6rem,14vh,9rem)] text-left text-white">
          <span className="font-mono-label text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-accent-soft">
            Welcome to Kings Towers Hotel
          </span>
          <h1 className="m-0 max-w-[16ch] font-serif-display text-[clamp(2.5rem,6vw,4.2rem)] leading-[1.08] text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.4)]">
            Experience Luxury.
            <br />
            <span className="italic text-accent-soft">Feel at Home.</span>
          </h1>
          <p className="max-w-[38ch] text-[1rem] leading-[1.7] text-white/85 [text-shadow:0_1px_18px_rgba(0,0,0,0.35)]">
            Discover unmatched comfort, exceptional service, and unforgettable moments at Kings Towers Hotel — a
            quiet, serene setting in Ahensan Estates, Kumasi, just two minutes from KNUST west gate.
          </p>
          <Link href="/#room-types" className={`${pillOutlineBase} mt-2 w-fit whitespace-nowrap px-7 py-3.5 text-[0.9rem]`}>
            Explore Rooms
          </Link>
        </div>
      </section>

      {/* The booking card overlaps the bottom edge of the photo — it lives
          outside the hero's own overflow-hidden section so it isn't clipped. */}
      <div className="relative z-20 -mt-14 px-[clamp(1rem,4vw,3rem)] pb-[clamp(3rem,7vh,5rem)] min-[880px]:-mt-16">
        <BookingCard />
      </div>
    </>
  );
}
