import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchPostBySlug, fetchPosts, formatPublishedDate } from "@/lib/cms";

interface Ctx { params: { slug: string } }

export const dynamic = "force-dynamic";

export default async function BlogDetailPage({ params }: Ctx) {
  const post = await fetchPostBySlug(params.slug);
  if (!post) notFound();

  const related = (await fetchPosts({ limit: 4 }))
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <article className="relative pb-24 pt-16">
      <div className="container-page max-w-3xl">
        <Link
          href="/blog"
          className="text-[11px] uppercase tracking-[0.3em]"
          style={{ color: "var(--c-primary-soft)" }}
        >
          ← Back to Journal
        </Link>

        <header className="mt-6 text-center">
          {post.category && (
            <span className="section-eyebrow">{post.category.name}</span>
          )}
          <h1 className="mt-3 section-title">
            <span className="gold-text">{post.title}</span>
          </h1>
          <div className="divider-gold mt-5" />
          <div
            className="mt-5 text-xs uppercase tracking-[0.25em]"
            style={{ color: "var(--c-text-soft)" }}
          >
            {formatPublishedDate(post.publishedAt) || "Draft"}
            {" · "}
            {post.readMinutes} min read
            {post.author?.name ? ` · By ${post.author.name}` : ""}
          </div>
        </header>

        {post.coverImage && (
          <div
            className="mt-10 overflow-hidden rounded-lg border"
            style={{ borderColor: "var(--c-border)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.coverImage} alt={post.title} className="w-full" />
          </div>
        )}

        {post.excerpt && (
          <p
            className="mt-10 text-center text-lg italic"
            style={{ color: "var(--c-text-soft)" }}
          >
            {post.excerpt}
          </p>
        )}

        <div
          className="prose-lingyun mt-10"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {post.tags.length > 0 && (
          <div className="mt-12 flex flex-wrap items-center gap-2">
            <span
              className="text-[10px] uppercase tracking-[0.25em]"
              style={{ color: "var(--c-text-soft)" }}
            >
              Tags
            </span>
            {post.tags.map((t) => (
              <span
                key={t.id}
                className="rounded-full border px-3 py-1 text-xs"
                style={{ borderColor: "var(--c-border)", color: "var(--c-primary-soft)" }}
              >
                {t.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {related.length > 0 && (
        <section className="container-page mt-24 max-w-5xl">
          <div className="divider-gold mb-10" />
          <h2 className="text-center font-display text-2xl gold-text">Continue the Lineage</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className="card-mystic block"
              >
                <div
                  className="text-[10px] uppercase tracking-[0.25em]"
                  style={{ color: "var(--c-primary-soft)" }}
                >
                  {p.category?.name ?? "Article"} · {p.readMinutes} min
                </div>
                <h3 className="mt-2 font-display text-lg leading-snug">{p.title}</h3>
                {p.excerpt && (
                  <p className="mt-2 text-sm" style={{ color: "var(--c-text-soft)" }}>
                    {p.excerpt}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
