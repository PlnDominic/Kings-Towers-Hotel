"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { heroImages } from "../data";

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative isolate flex min-h-[100svh] overflow-hidden">
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

      <div className="absolute left-1/2 bottom-[clamp(1.5rem,4vh,3rem)] z-20 flex -translate-x-1/2 gap-2">
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
            "linear-gradient(180deg, rgba(20,22,28,0.34) 0%, rgba(20,22,28,0) 30%), linear-gradient(0deg, rgba(20,22,28,0.4) 0%, rgba(20,22,28,0) 46%)",
        }}
      />

      <div className="relative flex w-full flex-col justify-between px-[clamp(1.25rem,5vw,5.5rem)] pt-[calc(80px+3vh)] pb-[clamp(3rem,7vh,6rem)] text-white">
        <p className="mt-[clamp(2rem,8vh,6rem)] max-w-[34ch] text-[1.02rem] leading-[1.6] text-white/[0.94] [text-shadow:0_1px_18px_rgba(0,0,0,0.25)]">
          A serene, scenic retreat in Ahensan Estate, Kumasi, switched off from the din of the outside world.
        </p>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <h1 className="m-0 max-w-[20ch] font-display text-[clamp(3rem,7.2vw,5rem)] leading-[1.02] font-bold tracking-[0.01em] text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.3)]">
            Kings Towers Hotel
          </h1>
          <a
            href="#reservation"
            className="whitespace-nowrap bg-accent px-[1.9rem] py-[0.95rem] text-[0.9rem] font-semibold tracking-[0.02em] text-white no-underline"
          >
            Book Now
          </a>
        </div>
      </div>
    </section>
  );
}
