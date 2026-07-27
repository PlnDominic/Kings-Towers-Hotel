"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { heroImages } from "../data";
import { useBooking } from "./BookingContext";
import { ctaBase, CtaArrow } from "./ui";

// "Liquid glass": translucent + blurred + saturated, with a bright inset
// edge along the top (where light would catch a glass rim) fading to
// almost nothing at the bottom, plus a soft outer shadow for lift.
const glassClass =
  "mx-auto flex w-full max-w-md flex-col self-center overflow-hidden rounded-2xl border border-white/25 bg-white/12 shadow-[0_8px_30px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.5),inset_0_-1px_1px_rgba(255,255,255,0.05)] backdrop-blur-xl backdrop-saturate-150 min-[700px]:w-auto min-[700px]:max-w-none min-[700px]:flex-row min-[700px]:items-stretch";

const fieldClass =
  "min-w-0 flex-1 border-b border-white/15 bg-transparent px-4 py-2.5 text-[0.82rem] text-white [color-scheme:dark] placeholder:text-white/60 focus:bg-white/10 focus:outline-none min-[700px]:border-b-0 min-[700px]:border-r";

function BookingContainer() {
  const { booking, setBooking } = useBooking();
  const [checkIn, setCheckIn] = useState(booking.checkIn);
  const [checkOut, setCheckOut] = useState(booking.checkOut);
  const [roomType, setRoomType] = useState(booking.roomType);

  function onSubmit(e) {
    e.preventDefault();
    setBooking({ checkIn, checkOut, roomType });
    document.getElementById("reservation")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <form onSubmit={onSubmit} className={glassClass}>
      <input
        type="date"
        aria-label="Check-in"
        value={checkIn}
        onChange={(e) => setCheckIn(e.target.value)}
        className={fieldClass}
      />
      <input
        type="date"
        aria-label="Check-out"
        value={checkOut}
        onChange={(e) => setCheckOut(e.target.value)}
        className={fieldClass}
      />
      <select aria-label="Room type" value={roomType} onChange={(e) => setRoomType(e.target.value)} className={fieldClass}>
        <option value="">Any room</option>
        <option value="standard">Standard Room</option>
        <option value="queen">Queen Room</option>
        <option value="twin">Twin Room</option>
        <option value="mini-suite">Mini Suite</option>
      </select>
      <button
        type="submit"
        className={`${ctaBase} whitespace-nowrap px-5 py-2.5 text-[0.82rem] tracking-[0.02em] hover:translate-y-0 hover:shadow-none`}
      >
        Check
        <CtaArrow />
      </button>
    </form>
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
        <p className="mt-[clamp(2rem,8vh,6rem)] max-w-[34ch] text-[1.02rem] leading-[1.6] text-white [text-shadow:0_1px_18px_rgba(0,0,0,0.35)]">
          A serene, scenic retreat in Ahensan Estate, Kumasi, switched off from the din of the outside world.
        </p>
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <h1 className="m-0 max-w-[20ch] font-display text-[clamp(3rem,7.2vw,5rem)] leading-[1.02] font-bold tracking-[0.01em] text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.4)]">
              Kings Towers Hotel
            </h1>
            <a href="#reservation" className={`${ctaBase} whitespace-nowrap px-[1.9rem] py-[0.95rem] text-[0.9rem] tracking-[0.02em]`}>
              Book Now
              <CtaArrow />
            </a>
          </div>
          <BookingContainer />
        </div>
      </div>
    </section>
  );
}
