import { amenities } from "../data";
import { SerifHeading } from "./ui";

export default function Amenities() {
  return (
    <section id="amenities" className="scroll-mt-20 bg-cream px-[clamp(1.25rem,5vw,5.5rem)] py-[clamp(3rem,8vh,5.5rem)]">
      <SerifHeading>Amenities</SerifHeading>

      {/* Scroll-snap row: at wide viewports all four items fit and it reads
          as a static row (matches the reference); below that width it
          becomes a swipeable single-row carousel instead of wrapping. */}
      <div className="mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2">
        {amenities.map((a) => (
          <div
            key={a.title}
            className="flex w-[168px] shrink-0 snap-start flex-col items-center text-center min-[980px]:w-[calc(25%-1.125rem)]"
          >
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center border border-accent text-accent [&_svg]:h-5 [&_svg]:w-5"
              dangerouslySetInnerHTML={{ __html: a.icon }}
            />
            <h3 className="mt-3 font-serif-display text-[0.95rem] font-medium text-ink">{a.title}</h3>
            <span className="mt-1.5 block h-[2px] w-6 bg-accent" />
            <p className="mt-2.5 text-[0.8rem] leading-[1.6] text-body">{a.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
