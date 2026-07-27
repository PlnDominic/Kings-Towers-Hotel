"use client";

import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  async function onSubmit(e) {
    e.preventDefault();
    if (!agreed) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <footer className="bg-near-black px-[clamp(1.25rem,5vw,5.5rem)] pt-[clamp(3.5rem,8vh,5.5rem)] pb-0 text-white">
      <div className="mx-auto max-w-[640px] text-center">
        <span className="font-mono-label text-[0.72rem] uppercase tracking-[0.22em] text-white/60">
          Stay Connected
        </span>
        <h2 className="mt-[0.8rem] mb-0 font-display text-[clamp(1.4rem,2.6vw,1.9rem)] leading-[1.4] font-normal">
          Be the first to hear about Kings Towers, where comfort meets tranquility. Get offers, updates and stories
          from Ahensan Estate.
        </h2>
      </div>

      {status === "sent" ? (
        <p className="mx-auto mt-10 max-w-[640px] text-center text-[0.9rem] text-white/80">
          Thanks, you&#39;re on the list.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mx-auto mt-10 flex max-w-[640px] gap-[0.6rem]">
          <input
            required
            type="email"
            placeholder="EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-full border border-white/15 bg-[#1c1c1c] px-[1.4rem] py-[0.9rem] text-[0.85rem] tracking-[0.03em] text-white placeholder:text-white/50"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            aria-label="Subscribe"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-0 bg-white text-[1rem] disabled:opacity-60"
          >
            →
          </button>
        </form>
      )}

      <div className="mx-auto mt-4 flex max-w-[640px] items-center justify-center gap-2 text-[0.78rem] text-white/60">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="h-[14px] w-[14px]"
        />
        <span>
          I agree to the{" "}
          <a href="#" className="text-white/80 underline">
            Privacy Policy
          </a>
        </span>
      </div>
      {status === "error" && !agreed && (
        <p className="mt-2 text-center text-[0.78rem] text-red-400">Please agree to the Privacy Policy first.</p>
      )}

      <div className="mx-auto mt-16 grid max-w-[1100px] grid-cols-1 gap-8 border-t border-white/15 pt-10 min-[880px]:grid-cols-2">
        <div>
          <p className="m-0 text-[0.88rem] leading-[1.7] text-white/85">
            Kings Towers Hotel &amp; Conference Centre
            <br />
            Ahensan Estate, Kumasi, Ghana
          </p>
          <p className="mt-4 text-[0.88rem] leading-[1.7] text-white/85">
            kingsthl@yahoo.com
            <br />
            T: +233 51 29 308
          </p>
        </div>
        <div className="flex flex-col gap-[0.7rem] text-[0.82rem] tracking-[0.02em]">
          <a href="#about" className="font-semibold text-white underline">
            ABOUT
          </a>
          <a href="#room-types" className="font-semibold text-white underline">
            ROOMS
          </a>
          <a href="#leisure" className="font-semibold text-white underline">
            LEISURE
          </a>
          <a href="#gallery" className="font-semibold text-white underline">
            GALLERY
          </a>
          <a href="#contact" className="font-semibold text-white underline">
            CONTACT
          </a>
          <a
            href="#reservation"
            className="font-semibold text-accent-soft underline transition-colors duration-200 hover:text-accent-hover"
          >
            BOOK NOW
          </a>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-[1100px] flex-wrap justify-between gap-4 border-t border-white/15 py-[1.6rem] text-[0.72rem] tracking-[0.03em] text-white/60">
        <span>ALL RIGHTS RESERVED KINGS TOWERS HOTEL</span>
        <span>Ahensan Estate, Kumasi, Ghana</span>
      </div>
    </footer>
  );
}
