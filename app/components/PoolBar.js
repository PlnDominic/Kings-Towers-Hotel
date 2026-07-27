import SplitSection from "./SplitSection";

export default function PoolBar() {
  return (
    <SplitSection
      mediaSide="right"
      eyebrow="The Pool Bar"
      heading="Four bars, three restaurants"
      paragraphs={[
        "Gather poolside for a chilled drink or settle in for dinner across our restaurants and bars, serving special blends of oriental and rare African recipes.",
      ]}
      image={{ src: "/images/poolbar-terrace.jpg", alt: "Pool Bar terrace with seating" }}
    />
  );
}
