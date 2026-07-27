import Image from "next/image";
import { ctaBase, ChevronRight } from "./ui";

export default function About() {
  return (
    <section id="about" className="scroll-mt-20 bg-white px-[clamp(1.25rem,5vw,5.5rem)] py-[clamp(4.5rem,12vh,9rem)]">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-12 min-[880px]:grid-cols-2 min-[880px]:gap-16">
        <div className="text-center">
          <h2 className="m-0 font-serif-display text-[clamp(1.9rem,3.6vw,2.75rem)] leading-[1.3] font-medium text-ink">
            Relaxation, delivered with personal attention
          </h2>
          <span className="mx-auto mt-5 block h-[2px] w-14 bg-accent" />
          <p className="mx-auto mt-6 max-w-[46ch] text-[0.98rem] leading-[1.85] text-body">
            Kings Towers Hotel provides a serene and scenic location where guests can enjoy soothing relaxation. Our
            trademark approach to service is unique and personal, delivering to the requirements of both the
            business and leisure traveler. Our restaurants serve special blends of oriental and African dishes:
            tasty Ghanaian recipes that have delighted many guests.
          </p>
          <a href="#amenities" className={`${ctaBase} mt-8 gap-1.5 px-6 py-3 text-[0.85rem] tracking-[0.02em]`}>
            Learn More
            <ChevronRight />
          </a>
        </div>

        <div className="relative aspect-[6/5] overflow-hidden rounded-2xl">
          <Image
            src="/images/poolside-garden.jpg"
            alt="Poolside garden with African relief mural"
            fill
            sizes="(max-width: 880px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
