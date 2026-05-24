import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { tagCreateSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/api-helpers";
import { ensureUniqueSlug } from "@/lib/slug";

export async function GET() {
  const list = await prisma.tag.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ data: list });
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const parsed = tagCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const slug = await ensureUniqueSlug(parsed.data.slug ?? parsed.data.name, "tag");
  const tag = await prisma.tag.create({
    data: { name: parsed.data.name, slug },
  });
  return NextResponse.json({ data: tag });
}
