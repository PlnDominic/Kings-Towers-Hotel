import SplitSection from "./SplitSection";

export default function About() {
  return (
    <SplitSection
      id="about"
      mediaSide="left"
      eyebrow="The Hotel"
      heading="Relaxation, delivered with personal attention"
      paragraphs={[
        "Kings Towers Hotel provides a serene and scenic location where guests can enjoy soothing relaxation. Our trademark approach to service is unique and personal, delivering to the requirements of both the business and leisure traveler.",
        "Our restaurants serve special blends of oriental and African dishes: tasty Ghanaian recipes that have delighted many guests.",
      ]}
      image={{ src: "/images/poolside-garden.jpg", alt: "Poolside garden with African relief mural" }}
    />
  );
}
