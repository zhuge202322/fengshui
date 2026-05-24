import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { preflight, withCors } from "@/lib/api-helpers";

export const OPTIONS = preflight;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 100);
  const category = searchParams.get("category") ?? undefined;
  const tag = searchParams.get("tag") ?? undefined;
  const q = searchParams.get("q")?.trim() ?? "";

  const where: Record<string, unknown> = { status: "PUBLISHED" };
  if (category) where.category = { slug: category };
  if (tag) where.tags = { some: { slug: tag } };
  if (q) {
    where.OR = [
      { title:   { contains: q, mode: "insensitive" } },
      { excerpt: { contains: q, mode: "insensitive" } },
    ];
  }

  const posts = await prisma.post.findMany({
    where,
    orderBy: { publishedAt: "desc" },
    take: limit,
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      coverImage: true,
      publishedAt: true,
      readMinutes: true,
      views: true,
      category: { select: { id: true, name: true, slug: true } },
      tags:     { select: { id: true, name: true, slug: true } },
    },
  });

  return withCors(NextResponse.json({ data: posts }));
}
