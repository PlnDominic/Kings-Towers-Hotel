"use client";

import { useEffect, useRef, useState } from "react";
import { amenities } from "../data";

export default function Amenities() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="amenities"
      ref={sectionRef}
      className="overflow-hidden bg-near-black px-[clamp(1.25rem,5vw,5.5rem)] pt-[clamp(4.5rem,12vh,9rem)] pb-[clamp(3.5rem,9vh,7rem)] text-white"
    >
      <div className="mb-[clamp(2.5rem,5vh,4rem)] max-w-[640px]">
        <span className="font-mono-label text-[0.72rem] uppercase tracking-[0.22em] text-white/55">
          What&#39;s Included
        </span>
        <h2 className="mt-[0.7rem] mb-0 font-display text-[clamp(1.75rem,3.4vw,2.4rem)] tracking-[0.01em]">
          Everything you need, on the estate
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-px border border-white/14 bg-white/14 min-[561px]:grid-cols-2 min-[1025px]:grid-cols-4">
        {amenities.map((item, i) => (
          <div
            key={item.title}
            className="kt-reveal bg-near-black p-[1.9rem_1.6rem] transition-[transform,opacity,background] duration-[450ms] ease-[cubic-bezier(.16,1,.3,1)] hover:bg-[#151515]"
            style={{
              transitionDelay: `${i * 70}ms`,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(28px)",
            }}
          >
            <span className="font-mono-label text-[0.72rem] tracking-[0.05em] text-white/35">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div
              className="mt-4 mb-[1.1rem] flex h-11 w-11 items-center justify-center rounded-full bg-white/8 text-white transition-colors duration-300"
              dangerouslySetInnerHTML={{ __html: item.icon }}
            />
            <h3 className="m-0 font-display text-[0.98rem] font-bold tracking-[0.01em]">{item.title}</h3>
            <p className="mt-2 text-[0.86rem] leading-[1.6] text-white/60">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
