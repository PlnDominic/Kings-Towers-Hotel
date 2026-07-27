import { gettingHereSteps, nearbyAttractions } from "../data";

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-20 bg-white px-[clamp(1.25rem,5vw,5.5rem)] py-[clamp(4.5rem,12vh,9rem)]">
      <div className="grid grid-cols-1 gap-[clamp(2.5rem,6vw,5rem)] min-[880px]:grid-cols-2">
        <div>
          <span className="font-mono-label text-[0.72rem] uppercase tracking-[0.22em] text-muted">Visit Us</span>
          <h2 className="mt-[0.6rem] mb-6 font-display text-[clamp(1.9rem,3.6vw,2.5rem)] leading-[1.1]">
            Ahensan Estate, Kumasi
          </h2>
          <p className="text-base leading-[1.8] text-body">
            Plt 3, Blk D, Old Ahensan
            <br />
            Ahensan Estate, Kumasi, Ghana
            <br />
            P.O. Box 5722, Kumasi
          </p>
          <div className="mt-7 flex flex-col gap-2">
            <a href="tel:+2335129308" className="text-[0.98rem] text-accent no-underline">
              Tel: +233 51 29 308
            </a>
            <a href="tel:+233242535631" className="text-[0.98rem] text-accent no-underline">
              Cell: +233 24 25 35 631
            </a>
            <a href="mailto:kingsthl@yahoo.com" className="text-[0.98rem] text-accent no-underline">
              kingsthl@yahoo.com
            </a>
          </div>
          <h3 className="mt-8 mb-[0.9rem] font-display text-base">Nearby</h3>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {nearbyAttractions.map((a) => (
              <li
                key={a.name}
                className="flex max-w-[22rem] justify-between border-b border-hairline pb-2 text-[0.9rem] text-body"
              >
                {a.name} <span>{a.distance}</span>
              </li>
            ))}
          </ul>
          <div className="mt-7 overflow-hidden border border-hairline">
            <iframe
              title="Map to Kings Towers Hotel, Ahensan Estate, Kumasi"
              src="https://www.google.com/maps?q=Ahensan+Estate,+Kumasi,+Ghana&output=embed"
              width="100%"
              height="260"
              className="block border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
        <div className="border border-hairline bg-white p-[clamp(2rem,4vw,3rem)]">
          <h3 className="m-0 mb-5 font-display text-[1.1rem]">Getting Here</h3>
          <ul className="m-0 flex list-none flex-col gap-4 p-0">
            {gettingHereSteps.map((step, i) => (
              <li key={step} className="flex gap-[0.9rem] text-[0.92rem] leading-[1.6] text-body">
                <span className="font-mono-label font-bold text-accent">{String(i + 1).padStart(2, "0")}</span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
