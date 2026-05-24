import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { postCreateSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/api-helpers";
import { ensureUniqueSlug } from "@/lib/slug";
import { tiptapJsonToHtml } from "@/lib/tiptap-renderer";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const status = searchParams.get("status") ?? undefined;
  const adminMode = searchParams.get("admin") === "1";

  const where: Record<string, unknown> = {};
  if (q) {
    where.OR = [
      { title:   { contains: q, mode: "insensitive" } },
      { excerpt: { contains: q, mode: "insensitive" } },
    ];
  }
  if (!adminMode) {
    where.status = "PUBLISHED";
  } else if (status) {
    where.status = status;
  }

  const posts = await prisma.post.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: {
      category: true,
      tags: true,
      author: { select: { id: true, email: true, name: true } },
    },
    take: 100,
  });

  return NextResponse.json({ data: posts });
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  try {
    const body = await req.json();
    const parsed = postCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const input = parsed.data;
    const slug = await ensureUniqueSlug(input.slug ?? input.title, "post");
    const contentHtml = tiptapJsonToHtml(input.content);

    const post = await prisma.post.create({
      data: {
        title: input.title,
        slug,
        excerpt: input.excerpt ?? undefined,
        content: input.content,
        contentHtml,
        coverImage: input.coverImage ?? undefined,
        status: input.status,
        publishedAt: input.status === "PUBLISHED" ? new Date() : null,
        categoryId: input.categoryId ?? null,
        readMinutes: input.readMinutes ?? 5,
        authorId: auth.session.uid,
        tags: input.tagIds && input.tagIds.length > 0
          ? { connect: input.tagIds.map((id: string) => ({ id })) }
          : undefined,
      },
      include: { category: true, tags: true },
    });

    return NextResponse.json({ data: post });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
