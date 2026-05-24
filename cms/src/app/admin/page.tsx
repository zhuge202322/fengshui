import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [posts, drafts, published, categories, tags, media] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: "DRAFT" } }),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.category.count(),
    prisma.tag.count(),
    prisma.media.count(),
  ]);

  const recent = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
    take: 5,
    include: { category: true },
  });

  const stats = [
    { label: "Total Articles",     value: posts },
    { label: "Drafts",             value: drafts },
    { label: "Published",          value: published },
    { label: "Categories",         value: categories },
    { label: "Tags",               value: tags },
    { label: "Media Files",        value: media },
  ];

  return (
    <div>
      <header className="flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--c-primary-soft)" }}>
            Dashboard
          </div>
          <h1 className="mt-2 text-3xl gold-text" style={{ fontFamily: "Cinzel" }}>
            Welcome back, master
          </h1>
        </div>
        <Link href="/admin/posts/new" className="btn-primary">
          + New Article
        </Link>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className="panel text-center">
            <div className="text-3xl gold-text" style={{ fontFamily: "Cinzel" }}>
              {s.value}
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.25em]" style={{ color: "var(--c-muted)" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <section className="mt-10 panel">
        <div className="flex items-center justify-between">
          <h2 className="text-lg" style={{ fontFamily: "Cinzel" }}>Recently Updated</h2>
          <Link href="/admin/posts" className="text-xs underline opacity-70 hover:opacity-100">
            View all →
          </Link>
        </div>
        <ul className="mt-4 divide-y" style={{ borderColor: "var(--c-border)" }}>
          {recent.length === 0 && (
            <li className="py-6 text-center text-sm" style={{ color: "var(--c-muted)" }}>
              No articles yet. Click &quot;New Article&quot; to begin.
            </li>
          )}
          {recent.map((p) => (
            <li key={p.id} className="flex items-center justify-between py-3">
              <Link href={`/admin/posts/${p.id}`} className="flex-1 truncate text-sm hover:underline">
                {p.title}
              </Link>
              <div className="flex items-center gap-3">
                <span className="badge">{p.status}</span>
                {p.category && <span className="text-xs opacity-60">{p.category.name}</span>}
                <span className="text-xs opacity-50">
                  {new Date(p.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
