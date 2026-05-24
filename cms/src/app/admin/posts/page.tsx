import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PostsTable } from "./PostsTable";

export const dynamic = "force-dynamic";

interface SearchParams {
  q?: string;
  status?: string;
}

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const q = (searchParams.q ?? "").trim();
  const status = searchParams.status === "DRAFT" || searchParams.status === "PUBLISHED"
    ? searchParams.status
    : undefined;

  const where: Record<string, unknown> = {};
  if (q) {
    where.OR = [
      { title:   { contains: q, mode: "insensitive" } },
      { excerpt: { contains: q, mode: "insensitive" } },
    ];
  }
  if (status) where.status = status;

  const posts = await prisma.post.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: { category: true, tags: true },
    take: 100,
  });

  return (
    <div>
      <header className="flex items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--c-primary-soft)" }}>
            Library
          </div>
          <h1 className="mt-2 text-3xl gold-text" style={{ fontFamily: "Cinzel" }}>
            Articles
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--c-muted)" }}>
            Compose, refine, and publish the lineage of LingYun teachings.
          </p>
        </div>
        <Link href="/admin/posts/new" className="btn-primary">
          + New Article
        </Link>
      </header>

      <form className="mt-6 flex flex-wrap items-end gap-3" method="get">
        <div className="flex-1 min-w-[240px]">
          <label className="label" htmlFor="q">Search</label>
          <input
            id="q"
            name="q"
            defaultValue={q}
            className="field"
            placeholder="Title or excerpt…"
          />
        </div>
        <div>
          <label className="label" htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue={status ?? ""} className="field">
            <option value="">All</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>
        <button type="submit" className="btn">Apply</button>
        {(q || status) && (
          <Link href="/admin/posts" className="btn">Reset</Link>
        )}
      </form>

      <div className="mt-6">
        <PostsTable
          posts={(posts as Array<{
            id: string;
            title: string;
            slug: string;
            status: "DRAFT" | "PUBLISHED";
            category: { name: string } | null;
            tags: Array<{ name: string }>;
            updatedAt: Date;
            views: number;
          }>).map((p) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            status: p.status,
            categoryName: p.category?.name ?? null,
            tagNames: p.tags.map((t) => t.name),
            updatedAt: p.updatedAt.toISOString(),
            views: p.views,
          }))}
        />
      </div>
    </div>
  );
}
