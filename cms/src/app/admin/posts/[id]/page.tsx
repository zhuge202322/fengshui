import Link from "next/link";
import { notFound } from "next/navigation";
import type { JSONContent } from "@tiptap/react";
import { prisma } from "@/lib/prisma";
import { PostForm } from "@/components/PostForm";

export const dynamic = "force-dynamic";

interface Ctx { params: { id: string } }

export default async function EditPostPage({ params }: Ctx) {
  const [post, categories, tags] = await Promise.all([
    prisma.post.findUnique({
      where: { id: params.id },
      include: { tags: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!post) notFound();

  const typed = post as unknown as {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: JSONContent | null;
    coverImage: string | null;
    status: "DRAFT" | "PUBLISHED";
    categoryId: string | null;
    readMinutes: number;
    tags: Array<{ id: string }>;
  };

  return (
    <div>
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--c-primary-soft)" }}>
            Edit
          </div>
          <h1 className="mt-2 text-3xl gold-text" style={{ fontFamily: "Cinzel" }}>
            {typed.title}
          </h1>
          <p className="mt-1 text-xs" style={{ color: "var(--c-muted)" }}>
            /{typed.slug}
          </p>
        </div>
        <Link href="/admin/posts" className="btn">← Back to Articles</Link>
      </header>

      <PostForm
        mode="edit"
        initial={{
          id: typed.id,
          title: typed.title,
          slug: typed.slug,
          excerpt: typed.excerpt,
          content: typed.content,
          coverImage: typed.coverImage,
          status: typed.status,
          categoryId: typed.categoryId,
          tagIds: typed.tags.map((t) => t.id),
          readMinutes: typed.readMinutes,
        }}
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
