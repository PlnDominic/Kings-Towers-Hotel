import Image from "next/image";

export default function Leisure() {
  return (
    <section id="leisure" className="relative scroll-mt-20 bg-white">
      <div className="relative h-[clamp(360px,62vh,640px)] overflow-hidden">
        <Image
          src="/images/pool-waterfall.jpg"
          alt="Pool with carved African relief mural and stone waterfall"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="mx-auto max-w-[760px] px-[clamp(1.25rem,5vw,5.5rem)] pt-[clamp(2.75rem,6vh,4.5rem)] pb-[clamp(3rem,7vh,5rem)] text-center">
        <span className="font-mono-label text-[0.72rem] uppercase tracking-[0.22em] text-muted">
          Roof-Top &amp; Poolside
        </span>
        <h2 className="m-0 mt-[0.6rem] font-display text-[clamp(2.25rem,4.8vw,3rem)] leading-[1.08] tracking-[0.01em]">
          Come and relax
        </h2>
        <p className="mx-auto mt-[1.1rem] max-w-[52ch] text-[1.02rem] leading-[1.7] text-body">
          By our swimming pool or the Roof-Top garden, enjoy the invigorating tropical sun, sipping our chilled tropical fruit cocktails and beverages of your choice.
        </p>
      </div>
    </section>
  );
}
