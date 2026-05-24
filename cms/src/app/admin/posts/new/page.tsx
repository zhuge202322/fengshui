import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PostForm } from "@/components/PostForm";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <header className="mb-6 flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--c-primary-soft)" }}>
            Compose
          </div>
          <h1 className="mt-2 text-3xl gold-text" style={{ fontFamily: "Cinzel" }}>
            New Article
          </h1>
        </div>
        <Link href="/admin/posts" className="btn">← Back to Articles</Link>
      </header>

      <PostForm
        mode="create"
        categories={(categories as Array<{ id: string; name: string }>).map((c) => ({
          id: c.id,
          name: c.name,
        }))}
        tags={(tags as Array<{ id: string; name: string }>).map((t) => ({
          id: t.id,
          name: t.name,
        }))}
      />
    </div>
  );
}
