"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { galleryImages } from "../data";
import { ChevronRight, SerifHeading } from "./ui";
import Testimonials from "./Testimonials";

const TEASER_COUNT = 6;

export default function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    if (lightboxIndex === null) return;
    function onKey(e) {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") setLightboxIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length);
      if (e.key === "ArrowRight") setLightboxIndex((i) => (i + 1) % galleryImages.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex]);

  const teaser = galleryImages.slice(0, TEASER_COUNT);
  const current = lightboxIndex !== null ? galleryImages[lightboxIndex] : null;

  return (
    <section id="gallery" className="scroll-mt-20 bg-white px-[clamp(1.25rem,5vw,5.5rem)] py-[clamp(4.5rem,12vh,9rem)]">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-16 min-[1024px]:grid-cols-2">
        <div>
          <SerifHeading>Photo Gallery</SerifHeading>

          <div className="mt-8 grid grid-cols-3 gap-1.5">
            {teaser.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => setLightboxIndex(i)}
                aria-label={`Open photo: ${img.alt}`}
                className="relative aspect-square cursor-zoom-in overflow-hidden border-0 p-0"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 1024px) 33vw, 20vw"
                  className="object-cover transition-transform duration-500 ease-out hover:scale-105"
                />
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setLightboxIndex(0)}
              className="inline-flex items-center gap-2 rounded-xl border-0 bg-accent px-6 py-3 text-[0.9rem] font-semibold text-white transition-colors duration-200 hover:bg-accent-hover"
            >
              Enter Photo Gallery
              <ChevronRight />
            </button>
          </div>
        </div>

        <Testimonials />
      </div>

      {current && (
        <div
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 z-[200] flex cursor-zoom-out items-center justify-center bg-black/92 p-6 min-[700px]:p-12"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length);
            }}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border-0 bg-white/10 text-2xl text-white transition-colors hover:bg-white/20 min-[700px]:left-6"
          >
            ‹
          </button>
          <div className="relative h-full w-full" onClick={(e) => e.stopPropagation()}>
            <Image src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" />
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((i) => (i + 1) % galleryImages.length);
            }}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border-0 bg-white/10 text-2xl text-white transition-colors hover:bg-white/20 min-[700px]:right-6"
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}
