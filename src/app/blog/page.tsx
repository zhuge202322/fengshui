import Link from "next/link";
import { Newsletter } from "@/components/sections/Newsletter";
import { fetchPosts, formatPublishedDate } from "@/lib/cms";

const GLYPHS = ["宅", "命", "歲", "氣", "運", "卦", "玄", "靈"];
function pickGlyph(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) & 0xffff;
  return GLYPHS[hash % GLYPHS.length];
}

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await fetchPosts({ limit: 60 });

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

      <div className="container-page mt-14">
        {posts.length === 0 ? (
          <div
            className="mx-auto max-w-xl rounded-lg border p-10 text-center"
            style={{ borderColor: "var(--c-border)", color: "var(--c-text-soft)" }}
          >
            <p className="font-display text-xl">The scrolls are being prepared.</p>
            <p className="mt-3 text-sm">
              Our masters are inscribing the next chapter. Please return soon, or
              connect the CMS at{" "}
              <code style={{ color: "var(--c-primary-soft)" }}>NEXT_PUBLIC_CMS_URL</code>.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                          style={{
                            color: "var(--c-primary-soft)",
                            textShadow: "0 0 30px var(--c-glow)",
                          }}
                        >
                          {pickGlyph(p.slug)}
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
                  {p.excerpt && (
                    <p
                      className="mt-3 flex-1 text-sm leading-relaxed"
                      style={{ color: "var(--c-text-soft)" }}
                    >
                      {p.excerpt}
                    </p>
                  )}
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
        )}
      </div>

      <Newsletter />
    </section>
  );
}
