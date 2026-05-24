import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-helpers";

interface Ctx { params: { id: string } }

export async function DELETE(_: Request, { params }: Ctx) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  await prisma.category.delete({ where: { id: params.id } }).catch(() => null);
  return NextResponse.json({ data: { ok: true } });
}
