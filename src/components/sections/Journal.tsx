import Link from "next/link";

const POSTS = [
  {
    slug: "feng-shui-interior-design",
    title: "The Ultimate Guide to Feng Shui Interior Design",
    excerpt:
      "Transform your home with the Bagua map, the Five Elements, and the commanding position — and invite peace, health and prosperity into your life.",
    category: "Feng Shui",
    date: "Jan 30, 2026",
    read: "8 min",
    glyph: "宅",
  },
  {
    slug: "understand-your-bazi",
    title: "How to Read Your BaZi Chart — A Beginner's Map",
    excerpt:
      "Heavenly Stems, Earthly Branches, Day Master — demystified in plain English. The first step to seeing yourself as the cosmos sees you.",
    category: "BaZi",
    date: "Jan 18, 2026",
    read: "12 min",
    glyph: "命",
  },
  {
    slug: "2026-tai-sui",
    title: "2026 Tai Sui — Who Clashes and How to Harmonize",
    excerpt:
      "The Year of the Horse brings a powerful Tai Sui. Discover which animal signs are in clash and the rituals that neutralize misfortune.",
    category: "Cosmology",
    date: "Jan 04, 2026",
    read: "6 min",
    glyph: "歲",
  },
];

export function Journal() {
  return (
    <section className="relative py-28">
      <div className="container-page">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="section-eyebrow">From the Journal</span>
            <h2 className="mt-3 section-title">
              <span className="gold-text">Ancient Wisdom · Modern Words</span>
            </h2>
          </div>
          <Link href="/blog" className="btn-ghost">
            All Articles →
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {POSTS.map((p) => (
            <article key={p.slug} className="card-mystic group flex flex-col overflow-hidden !p-0">
              <div
                className="relative aspect-[16/10] overflow-hidden"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, var(--c-glow), transparent 60%), var(--c-bg-soft)",
                  borderBottom: "1px solid var(--c-border)",
                }}
              >
                <div className="absolute inset-0 bagua opacity-25 animate-spinSlow" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="han text-7xl transition group-hover:scale-110"
                    style={{ color: "var(--c-primary-soft)", textShadow: "0 0 30px var(--c-glow)" }}
                  >
                    {p.glyph}
                  </span>
                </div>
                <span
                  className="absolute left-4 top-4 rounded-sm px-2 py-1 text-[10px] uppercase tracking-[0.18em]"
                  style={{ background: "var(--c-bg-soft)", color: "var(--c-primary-soft)" }}
                >
                  {p.category}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="text-[11px] uppercase tracking-[0.2em] opacity-60">
                  {p.date} · {p.read}
                </div>
                <h3 className="mt-3 font-display text-xl leading-snug transition group-hover:opacity-90">
                  {p.title}
                </h3>
                <p
                  className="mt-3 flex-1 text-sm leading-relaxed"
                  style={{ color: "var(--c-text-soft)" }}
                >
                  {p.excerpt}
                </p>
                <Link href={`/blog/${p.slug}`} className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em]" style={{ color: "var(--c-primary-soft)" }}>
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
