import { prisma } from "@/lib/prisma";
import { TaxonomyManager } from "./TaxonomyManager";

export const dynamic = "force-dynamic";

export default async function AdminTaxonomyPage() {
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { posts: true } } },
    }),
    prisma.tag.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { posts: true } } },
    }),
  ]);

  type WithCount = { id: string; name: string; slug: string; _count: { posts: number } };

  return (
    <div>
      <header className="mb-6">
        <div className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--c-primary-soft)" }}>
          Taxonomy
        </div>
        <h1 className="mt-2 text-3xl gold-text" style={{ fontFamily: "Cinzel" }}>
          Categories &amp; Tags
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--c-muted)" }}>
          Organise your articles by lineage and theme.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <TaxonomyManager
          kind="category"
          title="Categories"
          endpoint="/api/categories"
          items={(categories as WithCount[]).map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            count: c._count.posts,
          }))}
        />
        <TaxonomyManager
          kind="tag"
          title="Tags"
          endpoint="/api/tags"
          items={(tags as WithCount[]).map((t) => ({
            id: t.id,
            name: t.name,
            slug: t.slug,
            count: t._count.posts,
          }))}
        />
      </div>
    </div>
  );
}
