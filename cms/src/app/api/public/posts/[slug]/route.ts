import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { preflight, withCors } from "@/lib/api-helpers";

export const OPTIONS = preflight;

interface Ctx { params: { slug: string } }

export async function GET(_: Request, { params }: Ctx) {
  const post = await prisma.post.findFirst({
    where: { slug: params.slug, status: "PUBLISHED" },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      coverImage: true,
      contentHtml: true,
      publishedAt: true,
      readMinutes: true,
      views: true,
      category: { select: { id: true, name: true, slug: true } },
      tags:     { select: { id: true, name: true, slug: true } },
      author:   { select: { name: true, email: true } },
    },
  });

  if (!post) {
    return withCors(NextResponse.json({ error: "Not found" }, { status: 404 }));
  }

  prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } }).catch(() => null);

  return withCors(NextResponse.json({ data: post }));
}
