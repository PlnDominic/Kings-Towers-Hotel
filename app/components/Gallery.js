"use client";

import Image from "next/image";
import { useState } from "react";
import { galleryImages } from "../data";

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <section
      id="gallery"
      className="scroll-mt-20 bg-white px-[clamp(1.25rem,5vw,5.5rem)] pt-[clamp(4.5rem,12vh,9rem)] pb-[clamp(3.5rem,9vh,7rem)]"
    >
      <div className="mb-[clamp(2.5rem,5vh,4rem)]">
        <span className="mb-[0.9rem] block font-mono-label text-[0.72rem] uppercase tracking-[0.22em] text-muted">
          Around The Estate
        </span>
        <h2 className="m-0 font-display text-[clamp(1.5rem,3vw,2.1rem)] uppercase tracking-[0.04em]">Gallery</h2>
      </div>
      <div className="grid grid-cols-2 auto-rows-[200px] gap-[0.6rem] min-[701px]:grid-cols-4">
        {galleryImages.map((img) => (
          <div
            key={img.src + img.alt}
            className="relative cursor-zoom-in overflow-hidden"
            onClick={() => setLightbox(img)}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 700px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 ease-out hover:scale-105"
            />
          </div>
        ))}
      </div>

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[200] flex cursor-zoom-out items-center justify-center bg-black/92 p-12"
        >
          <div className="relative h-full w-full">
            <Image src={lightbox.src} alt={lightbox.alt} fill sizes="100vw" className="object-contain" />
          </div>
        </div>
      )}
    </section>
  );
}
