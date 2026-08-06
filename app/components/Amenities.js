import { amenities } from "../data";
import { SerifHeading } from "./ui";

function AmenityCard({ a, hidden }) {
  return (
    <div aria-hidden={hidden} className="flex w-[190px] shrink-0 flex-col items-center text-center">
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center border border-accent text-accent [&_svg]:h-5 [&_svg]:w-5"
        dangerouslySetInnerHTML={{ __html: a.icon }}
      />
      <h3 className="mt-3 font-serif-display text-[0.95rem] font-medium text-ink">{a.title}</h3>
      <span className="mt-1.5 block h-[2px] w-6 bg-accent" />
      <p className="mt-2.5 text-[0.8rem] leading-[1.6] text-body">{a.desc}</p>
    </div>
  );
}

export default function Amenities() {
  return (
    <section id="amenities" className="scroll-mt-20 bg-cream px-[clamp(1.25rem,5vw,5.5rem)] py-[clamp(3rem,8vh,5.5rem)]">
      <SerifHeading>Amenities</SerifHeading>

      {/* Auto-scrolling marquee: all seven facilities are wider than any
          viewport, so the row drifts continuously left-to-right and loops
          seamlessly — two back-to-back copies of the list, animated by
          exactly one copy-width. The second copy is aria-hidden so screen
          readers only hear each facility once. Pauses on hover/focus so
          the text stays readable, and holds still (as a plain scrollable
          row) for anyone with reduced motion set. */}
      <div className="kt-marquee mt-8 overflow-hidden">
        <div className="kt-marquee-track flex w-max gap-10">
          {amenities.map((a) => (
            <AmenityCard key={a.title} a={a} />
          ))}
          {amenities.map((a) => (
            <AmenityCard key={`${a.title}-repeat`} a={a} hidden />
          ))}
        </div>
      </div>
    </section>
  );
}
