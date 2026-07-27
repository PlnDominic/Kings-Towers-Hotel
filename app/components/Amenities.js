import { amenities } from "../data";
import { SerifHeading } from "./ui";

export default function Amenities() {
  return (
    <section id="amenities" className="scroll-mt-20 bg-cream px-[clamp(1.25rem,5vw,5.5rem)] py-[clamp(4.5rem,12vh,9rem)]">
      <SerifHeading>Amenities</SerifHeading>

      {/* Scroll-snap row: at wide viewports all four items fit and it reads
          as a static row (matches the reference); below that width it
          becomes a swipeable single-row carousel instead of wrapping. */}
      <div className="mt-12 flex snap-x snap-mandatory gap-10 overflow-x-auto scroll-smooth pb-2">
        {amenities.map((a) => (
          <div
            key={a.title}
            className="flex w-[220px] shrink-0 snap-start flex-col items-center text-center min-[980px]:w-[calc(25%-1.875rem)]"
          >
            <div
              className="flex h-[76px] w-[76px] shrink-0 items-center justify-center border border-accent text-accent"
              dangerouslySetInnerHTML={{ __html: a.icon }}
            />
            <h3 className="mt-5 font-serif-display text-[1.15rem] font-medium text-ink">{a.title}</h3>
            <span className="mt-2 block h-[2px] w-8 bg-accent" />
            <p className="mt-4 text-[0.9rem] leading-[1.7] text-body">{a.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
