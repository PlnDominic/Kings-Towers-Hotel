import Image from "next/image";

export default function SplitSection({ id, eyebrow, heading, paragraphs, image, mediaSide = "left" }) {
  const media = (
    <div className="relative min-h-[280px] overflow-hidden max-[880px]:min-h-[280px] min-[880px]:min-h-[360px] min-[880px]:h-full">
      <Image src={image.src} alt={image.alt} fill sizes="(max-width: 880px) 100vw, 50vw" className="object-cover" />
    </div>
  );

  const copy = (
    <div className="max-w-[30rem] self-center px-[clamp(1.25rem,5vw,5.5rem)] py-[clamp(2.5rem,6vw,5rem)] min-[880px]:px-[clamp(2.5rem,6vw,5rem)]">
      <span className="mb-[1.1rem] block font-mono-label text-[0.72rem] uppercase tracking-[0.22em] text-muted">
        {eyebrow}
      </span>
      <h2 className="m-0 font-display text-[clamp(1.9rem,3.6vw,2.5rem)] leading-[1.1] tracking-[0.01em]">
        {heading}
      </h2>
      {paragraphs.map((p, i) => (
        <p key={i} className={`${i === 0 ? "mt-[1.1rem]" : "mt-4"} text-base leading-[1.7] text-body`}>
          {p}
        </p>
      ))}
    </div>
  );

  return (
    <section
      id={id}
      className="grid grid-cols-1 min-h-[clamp(420px,70vh,680px)] scroll-mt-20 items-stretch bg-white max-[880px]:min-h-fit min-[880px]:grid-cols-[var(--split-cols)]"
      style={{ "--split-cols": mediaSide === "left" ? "1.15fr 1fr" : "1fr 1.15fr" }}
    >
      {mediaSide === "left" ? (
        <>
          {media}
          {copy}
        </>
      ) : (
        <>
          {copy}
          {media}
        </>
      )}
    </section>
  );
}
