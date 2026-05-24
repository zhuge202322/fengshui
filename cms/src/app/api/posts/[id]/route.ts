import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { postUpdateSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/api-helpers";
import { ensureUniqueSlug } from "@/lib/slug";
import { tiptapJsonToHtml } from "@/lib/tiptap-renderer";

interface Ctx { params: { id: string } }

export async function GET(_: Request, { params }: Ctx) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { category: true, tags: true, author: true },
  });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: post });
}

export async function PATCH(req: Request, { params }: Ctx) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  try {
    const body = await req.json();
    const parsed = postUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const input = parsed.data;

    const existing = await prisma.post.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    let slug = existing.slug;
    if (input.slug && input.slug !== existing.slug) {
      slug = await ensureUniqueSlug(input.slug, "post", existing.id);
    }

    const contentHtml = input.content
      ? tiptapJsonToHtml(input.content)
      : undefined;

    const publishedAt =
      input.status === "PUBLISHED" && existing.status !== "PUBLISHED"
        ? new Date()
        : input.status === "DRAFT"
          ? null
          : existing.publishedAt;

    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        ...(input.title  !== undefined ? { title: input.title } : {}),
        slug,
        ...(input.excerpt    !== undefined ? { excerpt: input.excerpt } : {}),
        ...(input.content    !== undefined ? { content: input.content } : {}),
        ...(contentHtml      !== undefined ? { contentHtml } : {}),
        ...(input.coverImage !== undefined ? { coverImage: input.coverImage } : {}),
        ...(input.status     !== undefined ? { status: input.status, publishedAt } : {}),
        ...(input.categoryId !== undefined ? { categoryId: input.categoryId } : {}),
        ...(input.readMinutes!== undefined ? { readMinutes: input.readMinutes } : {}),
        ...(input.tagIds     !== undefined
          ? { tags: { set: (input.tagIds as string[]).map((id) => ({ id })) } }
          : {}),
      },
      include: { category: true, tags: true },
    });

    return NextResponse.json({ data: post });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Ctx) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  await prisma.post.delete({ where: { id: params.id } }).catch(() => null);
  return NextResponse.json({ data: { ok: true } });
}
