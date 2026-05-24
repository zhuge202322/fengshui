import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-helpers";

interface Ctx { params: { id: string } }

export async function DELETE(_: Request, { params }: Ctx) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const media = await prisma.media.findUnique({ where: { id: params.id } });
  if (!media) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const baseDir = process.env.UPLOAD_DIR ?? "public/uploads";
  const absDir = path.isAbsolute(baseDir) ? baseDir : path.join(process.cwd(), baseDir);
  const filepath = path.join(absDir, media.filename);
  await fs.unlink(filepath).catch(() => null);

  await prisma.media.delete({ where: { id: params.id } });
  return NextResponse.json({ data: { ok: true } });
}
