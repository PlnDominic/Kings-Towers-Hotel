"use client";

import { useEffect, useState } from "react";
import { testimonials } from "../data";
import { SerifHeading } from "./ui";

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const t = testimonials[index];

  return (
    <div>
      <SerifHeading>Testimonials</SerifHeading>

      <div className="relative mt-8 border border-hairline bg-white px-8 py-10 min-[700px]:px-12 min-[700px]:py-12">
        <span aria-hidden="true" className="absolute left-6 top-3 font-serif-display text-[3rem] leading-none text-accent/70">
          &ldquo;
        </span>
        <span
          aria-hidden="true"
          className="absolute right-6 bottom-3 font-serif-display text-[3rem] leading-none text-accent/70"
        >
          &rdquo;
        </span>

        <p className="mx-auto max-w-[42ch] text-center text-[1rem] leading-[1.7] text-body">{t.quote}</p>

        <div className="mx-auto mt-8 h-14 w-14 rounded-full bg-cream" />
        <p className="mt-4 text-center text-[0.92rem] text-ink">
          {t.name} <span className="text-muted">– {t.detail}</span>
        </p>

        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show testimonial ${i + 1}`}
              onClick={() => setIndex(i)}
              className="h-2 w-2 rounded-full border-0 p-0 transition-colors duration-200"
              style={{ background: i === index ? "var(--color-accent)" : "var(--color-hairline)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
