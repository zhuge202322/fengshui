import { Journal } from "@/components/sections/Journal";
import { Newsletter } from "@/components/sections/Newsletter";

export default function BlogPage() {
  return (
    <section className="relative py-20">
      <div className="container-page text-center">
        <span className="section-eyebrow">The Journal</span>
        <h1 className="mt-3 section-title">
          <span className="gold-text">Ancient Wisdom · Modern Words</span>
        </h1>
        <div className="divider-gold mt-5" />
        <p
          className="mx-auto mt-6 max-w-2xl text-lg"
          style={{ color: "var(--c-text-soft)" }}
        >
          Essays, guides and oracles from our masters — translated for the
          modern seeker.
        </p>
      </div>

      <Journal />
      <Newsletter />
    </section>
  );
}
