import Link from "next/link";
import { fetchPosts, formatPublishedDate, type CmsPostSummary } from "@/lib/cms";

const FALLBACK_POSTS: Array<CmsPostSummary & { glyph: string }> = [
  {
    id: "fallback-1",
    slug: "feng-shui-interior-design",
    title: "The Ultimate Guide to Feng Shui Interior Design",
    excerpt:
      "Transform your home with the Bagua map, the Five Elements, and the commanding position — and invite peace, health and prosperity into your life.",
    coverImage: null,
    publishedAt: "2026-01-30T00:00:00.000Z",
    readMinutes: 8,
    views: 0,
    category: { id: "c1", name: "Feng Shui", slug: "feng-shui" },
    tags: [],
    glyph: "宅",
  },
  {
    id: "fallback-2",
    slug: "understand-your-bazi",
    title: "How to Read Your BaZi Chart — A Beginner's Map",
    excerpt:
      "Heavenly Stems, Earthly Branches, Day Master — demystified in plain English. The first step to seeing yourself as the cosmos sees you.",
    coverImage: null,
    publishedAt: "2026-01-18T00:00:00.000Z",
    readMinutes: 12,
    views: 0,
    category: { id: "c2", name: "BaZi", slug: "bazi" },
    tags: [],
    glyph: "命",
  },
  {
    id: "fallback-3",
    slug: "2026-tai-sui",
    title: "2026 Tai Sui — Who Clashes and How to Harmonize",
    excerpt:
      "The Year of the Horse brings a powerful Tai Sui. Discover which animal signs are in clash and the rituals that neutralize misfortune.",
    coverImage: null,
    publishedAt: "2026-01-04T00:00:00.000Z",
    readMinutes: 6,
    views: 0,
    category: { id: "c3", name: "Cosmology", slug: "cosmology" },
    tags: [],
    glyph: "歲",
  },
];

const GLYPHS = ["宅", "命", "歲", "氣", "運", "卦", "玄", "靈"];

function pickGlyph(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) & 0xffff;
  return GLYPHS[hash % GLYPHS.length];
}

export async function Journal({ limit = 3 }: { limit?: number } = {}) {
  const remote = await fetchPosts({ limit });
  const posts = remote.length > 0
    ? remote.map((p) => ({ ...p, glyph: pickGlyph(p.slug) }))
    : FALLBACK_POSTS;

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
          {posts.map((p) => (
            <article
              key={p.id}
              className="card-mystic group flex flex-col overflow-hidden !p-0"
            >
              <div
                className="relative aspect-[16/10] overflow-hidden"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, var(--c-glow), transparent 60%), var(--c-bg-soft)",
                  borderBottom: "1px solid var(--c-border)",
                }}
              >
                {p.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.coverImage}
                    alt={p.title}
                    className="absolute inset-0 h-full w-full object-cover opacity-90 transition group-hover:scale-105"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bagua opacity-25 animate-spinSlow" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className="han text-7xl transition group-hover:scale-110"
                        style={{ color: "var(--c-primary-soft)", textShadow: "0 0 30px var(--c-glow)" }}
                      >
                        {(p as { glyph?: string }).glyph ?? pickGlyph(p.slug)}
                      </span>
                    </div>
                  </>
                )}
                {p.category && (
                  <span
                    className="absolute left-4 top-4 rounded-sm px-2 py-1 text-[10px] uppercase tracking-[0.18em]"
                    style={{ background: "var(--c-bg-soft)", color: "var(--c-primary-soft)" }}
                  >
                    {p.category.name}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="text-[11px] uppercase tracking-[0.2em] opacity-60">
                  {formatPublishedDate(p.publishedAt) || "Coming soon"} · {p.readMinutes} min
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
                <Link
                  href={`/blog/${p.slug}`}
                  className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em]"
                  style={{ color: "var(--c-primary-soft)" }}
                >
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
