import Link from "next/link";

const PRODUCTS = [
  {
    id: "bazi-complete",
    name: "Complete BaZi Reading",
    category: "Bazi Reading",
    priceWas: 269,
    priceNow: 199,
    hot: true,
    desc: "Full reading covering wealth, marriage, career and health with 10-year luck cycle map.",
    glyph: "命",
  },
  {
    id: "wealth-bazi",
    name: "Wealth Bazi Consultation",
    category: "Bazi Reading",
    priceWas: 129,
    priceNow: 99,
    hot: true,
    desc: "Decode your wealth star — identify activation windows and aligned career directions.",
    glyph: "財",
  },
  {
    id: "love-bazi",
    name: "Love & Relationship Reading",
    category: "Bazi Reading",
    priceWas: 129,
    priceNow: 99,
    hot: false,
    desc: "Clarify your spouse palace, the rhythm of romance, and your most resonant partner type.",
    glyph: "緣",
  },
  {
    id: "career-bazi",
    name: "Career Bazi Consultation",
    category: "Bazi Reading",
    priceWas: 129,
    priceNow: 99,
    hot: false,
    desc: "Align your professional path with your innate elemental constitution.",
    glyph: "業",
  },
  {
    id: "health-bazi",
    name: "Health Bazi Consultation",
    category: "Bazi Reading",
    priceWas: 129,
    priceNow: 99,
    hot: false,
    desc: "Restore vitality by rebalancing the disrupted Qi within your Five Elements.",
    glyph: "康",
  },
  {
    id: "tai-sui",
    name: "2026 Averting Tai Sui Ritual",
    category: "Energy Cleansing",
    priceWas: 169,
    priceNow: 99,
    hot: true,
    desc: "Balance the year's cosmic clash and transform challenges into opportunities.",
    glyph: "歲",
  },
  {
    id: "debt-of-life",
    name: "Debt of Life Release",
    category: "Energy Cleansing",
    priceWas: 139,
    priceNow: 99,
    hot: false,
    desc: "Release the karmic burden carried at birth and restore the flow of your life.",
    glyph: "債",
  },
  {
    id: "pet-blessing",
    name: "Pet Blessing Ceremony",
    category: "Pet Blessing",
    priceWas: 147,
    priceNow: 99,
    hot: false,
    desc: "Bring protection, peace and vitality to your beloved companion.",
    glyph: "靈",
  },
];

export function ProductsShowcase() {
  return (
    <section className="relative py-28">
      <div className="container-page">
        <div className="flex flex-col items-center text-center">
          <span className="section-eyebrow">Popular Services</span>
          <h2 className="mt-3 section-title">
            <span className="gold-text">Sacred Consultations</span>
          </h2>
          <div className="divider-gold mt-5" />
          <p
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed"
            style={{ color: "var(--c-text-soft)" }}
          >
            Personalized readings and ceremonies — each one rooted in lineage,
            tailored to your birth chart, delivered through private channels.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p) => {
            const discount = Math.round(((p.priceWas - p.priceNow) / p.priceWas) * 100);
            return (
              <article key={p.id} className="card-mystic group flex flex-col">
                {/* Image-like glyph plate */}
                <div
                  className="relative -m-6 mb-0 aspect-[4/3] overflow-hidden border-b"
                  style={{ borderColor: "var(--c-border)" }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(circle at 30% 30%, var(--c-glow), transparent 60%), radial-gradient(circle at 70% 70%, rgba(139,26,26,0.2), transparent 60%), var(--c-bg-soft)",
                    }}
                  />
                  <div className="absolute inset-0 bagua opacity-30 animate-spinSlow" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="han text-7xl transition group-hover:scale-110"
                      style={{
                        color: "var(--c-primary-soft)",
                        textShadow: "0 0 30px var(--c-glow)",
                      }}
                    >
                      {p.glyph}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="absolute left-3 top-3 flex flex-col gap-1">
                    <span
                      className="rounded-sm px-2 py-0.5 text-[10px] uppercase tracking-[0.18em]"
                      style={{ background: "var(--c-accent)", color: "var(--c-text)" }}
                    >
                      -{discount}%
                    </span>
                    {p.hot && (
                      <span
                        className="rounded-sm px-2 py-0.5 text-[10px] uppercase tracking-[0.18em]"
                        style={{ background: "var(--c-primary)", color: "var(--c-bg)" }}
                      >
                        Hot
                      </span>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="pt-6 flex flex-1 flex-col">
                  <div className="text-[10px] uppercase tracking-[0.2em] opacity-60">
                    {p.category}
                  </div>
                  <h3 className="mt-2 font-display text-lg leading-tight">{p.name}</h3>
                  <p
                    className="mt-3 line-clamp-2 text-sm leading-relaxed"
                    style={{ color: "var(--c-text-soft)" }}
                  >
                    {p.desc}
                  </p>

                  <div className="mt-4 flex items-baseline gap-3">
                    <span className="font-display text-2xl gold-text">${p.priceNow}</span>
                    <span className="text-sm line-through opacity-50">${p.priceWas}</span>
                  </div>

                  <Link href="/shop" className="btn-ghost mt-5 !py-2.5 text-[10px]">
                    View Details
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link href="/shop" className="btn-primary">
            Explore All Consultations
          </Link>
        </div>
      </div>
    </section>
  );
}
