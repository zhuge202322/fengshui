import Link from "next/link";
import {
  fetchVendureProducts,
  formatMoney,
  type VendureProductSummary,
} from "@/lib/vendure";

const FALLBACK_PRODUCTS: Array<VendureProductSummary & { glyph: string; hot?: boolean }> = [
  {
    id: "fallback-bazi-complete",
    slug: "bazi-complete",
    name: "Complete BaZi Reading",
    description:
      "Full reading covering wealth, marriage, career and health with 10-year luck cycle map.",
    featuredAssetUrl: null,
    priceNow: 199,
    priceWas: 269,
    currencyCode: "USD",
    collectionNames: ["BaZi Reading"],
    glyph: "命",
    hot: true,
  },
  {
    id: "fallback-wealth-bazi",
    slug: "wealth-bazi",
    name: "Wealth Bazi Consultation",
    description: "Decode your wealth star — identify activation windows and aligned career directions.",
    featuredAssetUrl: null,
    priceNow: 99,
    priceWas: 129,
    currencyCode: "USD",
    collectionNames: ["BaZi Reading"],
    glyph: "財",
    hot: true,
  },
  {
    id: "fallback-love-bazi",
    slug: "love-bazi",
    name: "Love & Relationship Reading",
    description: "Clarify your spouse palace, the rhythm of romance, and your most resonant partner type.",
    featuredAssetUrl: null,
    priceNow: 99,
    priceWas: 129,
    currencyCode: "USD",
    collectionNames: ["BaZi Reading"],
    glyph: "緣",
  },
  {
    id: "fallback-career-bazi",
    slug: "career-bazi",
    name: "Career Bazi Consultation",
    description: "Align your professional path with your innate elemental constitution.",
    featuredAssetUrl: null,
    priceNow: 99,
    priceWas: 129,
    currencyCode: "USD",
    collectionNames: ["BaZi Reading"],
    glyph: "業",
  },
  {
    id: "fallback-health-bazi",
    slug: "health-bazi",
    name: "Health Bazi Consultation",
    description: "Restore vitality by rebalancing the disrupted Qi within your Five Elements.",
    featuredAssetUrl: null,
    priceNow: 99,
    priceWas: 129,
    currencyCode: "USD",
    collectionNames: ["BaZi Reading"],
    glyph: "康",
  },
  {
    id: "fallback-tai-sui",
    slug: "tai-sui",
    name: "2026 Averting Tai Sui Ritual",
    description: "Balance the year's cosmic clash and transform challenges into opportunities.",
    featuredAssetUrl: null,
    priceNow: 99,
    priceWas: 169,
    currencyCode: "USD",
    collectionNames: ["Energy Cleansing"],
    glyph: "歲",
    hot: true,
  },
  {
    id: "fallback-debt-of-life",
    slug: "debt-of-life",
    name: "Debt of Life Release",
    description: "Release the karmic burden carried at birth and restore the flow of your life.",
    featuredAssetUrl: null,
    priceNow: 99,
    priceWas: 139,
    currencyCode: "USD",
    collectionNames: ["Energy Cleansing"],
    glyph: "債",
  },
  {
    id: "fallback-pet-blessing",
    slug: "pet-blessing",
    name: "Pet Blessing Ceremony",
    description: "Bring protection, peace and vitality to your beloved companion.",
    featuredAssetUrl: null,
    priceNow: 99,
    priceWas: 147,
    currencyCode: "USD",
    collectionNames: ["Pet Blessing"],
    glyph: "靈",
  },
];

const GLYPH_POOL = ["命", "財", "緣", "業", "康", "歲", "債", "靈", "氣", "卦"];

function pickGlyph(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) & 0xffff;
  return GLYPH_POOL[hash % GLYPH_POOL.length];
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, "").trim();
}

export async function ProductsShowcase({ limit = 8 }: { limit?: number } = {}) {
  const remote = await fetchVendureProducts(limit);
  const products = remote.length > 0 ? remote : FALLBACK_PRODUCTS;

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
          {products.map((p) => {
            const discount =
              p.priceWas && p.priceWas > p.priceNow
                ? Math.round(((p.priceWas - p.priceNow) / p.priceWas) * 100)
                : 0;
            const hot = "hot" in p ? Boolean(p.hot) : discount >= 30;
            const glyph = "glyph" in p ? (p as { glyph?: string }).glyph ?? pickGlyph(p.slug) : pickGlyph(p.slug);
            const category = p.collectionNames[0] ?? "Consultation";
            const description = stripHtml(p.description).slice(0, 180);

            return (
              <article key={p.id} className="card-mystic group flex flex-col">
                <div
                  className="relative -m-6 mb-0 aspect-[4/3] overflow-hidden border-b"
                  style={{ borderColor: "var(--c-border)" }}
                >
                  {p.featuredAssetUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.featuredAssetUrl}
                      alt={p.name}
                      className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105"
                    />
                  ) : (
                    <>
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
                          {glyph}
                        </span>
                      </div>
                    </>
                  )}

                  <div className="absolute left-3 top-3 flex flex-col gap-1">
                    {discount > 0 && (
                      <span
                        className="rounded-sm px-2 py-0.5 text-[10px] uppercase tracking-[0.18em]"
                        style={{ background: "var(--c-accent)", color: "var(--c-text)" }}
                      >
                        -{discount}%
                      </span>
                    )}
                    {hot && (
                      <span
                        className="rounded-sm px-2 py-0.5 text-[10px] uppercase tracking-[0.18em]"
                        style={{ background: "var(--c-primary)", color: "var(--c-bg)" }}
                      >
                        Hot
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-6 flex flex-1 flex-col">
                  <div className="text-[10px] uppercase tracking-[0.2em] opacity-60">
                    {category}
                  </div>
                  <h3 className="mt-2 font-display text-lg leading-tight">{p.name}</h3>
                  <p
                    className="mt-3 line-clamp-2 text-sm leading-relaxed"
                    style={{ color: "var(--c-text-soft)" }}
                  >
                    {description}
                  </p>

                  <div className="mt-4 flex items-baseline gap-3">
                    <span className="font-display text-2xl gold-text">
                      {formatMoney(p.priceNow, p.currencyCode)}
                    </span>
                    {p.priceWas && p.priceWas > p.priceNow && (
                      <span className="text-sm line-through opacity-50">
                        {formatMoney(p.priceWas, p.currencyCode)}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/shop/${p.slug}`}
                    className="btn-ghost mt-5 !py-2.5 text-[10px]"
                  >
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
