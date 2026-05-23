import { ProductsShowcase } from "@/components/sections/ProductsShowcase";
import { CtaBanner } from "@/components/sections/CtaBanner";

export default function ShopPage() {
  return (
    <section className="relative py-20">
      <div className="container-page text-center">
        <span className="section-eyebrow">Sacred Marketplace</span>
        <h1 className="mt-3 section-title">
          <span className="gold-text">The LingYun Shop</span>
        </h1>
        <div className="divider-gold mt-5" />
        <p
          className="mx-auto mt-6 max-w-2xl text-lg"
          style={{ color: "var(--c-text-soft)" }}
        >
          Personalized consultations, ritual ceremonies, and energy services —
          each one offered through private channel after a brief intake.
        </p>
        <div
          className="mx-auto mt-6 max-w-xl rounded-md border px-4 py-3 text-sm"
          style={{ borderColor: "var(--c-border)", color: "var(--c-text-soft)" }}
        >
          ✨ Full e-commerce experience is coming soon. For now, every order
          is confirmed personally on WhatsApp for an authentic experience.
        </div>
      </div>

      <ProductsShowcase />
      <CtaBanner />
    </section>
  );
}
