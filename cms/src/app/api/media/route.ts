import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-helpers";

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function getUploadConfig() {
  const dir = process.env.UPLOAD_DIR ?? "public/uploads";
  const base = process.env.PUBLIC_UPLOAD_BASE ?? "/uploads";
  return { dir, base };
}

export async function GET() {
  const list = await prisma.media.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return NextResponse.json({ data: list });
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  try {
    const form = await req.formData();
    const file = form.get("file");
    const alt = (form.get("alt") as string | null) ?? "";

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }
    if (!ALLOWED_MIME.includes(file.type)) {
      return NextResponse.json({ error: `Unsupported type: ${file.type}` }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    const { dir, base } = getUploadConfig();
    const absDir = path.isAbsolute(dir) ? dir : path.join(process.cwd(), dir);
    await fs.mkdir(absDir, { recursive: true });

    const ext = path.extname(file.name) || mimeToExt(file.type);
    const filename = `${Date.now()}-${randomBytes(6).toString("hex")}${ext}`;
    const filepath = path.join(absDir, filename);

    const bytes = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filepath, bytes);

    const url = `${base.replace(/\/$/, "")}/${filename}`;

    const media = await prisma.media.create({
      data: {
        filename,
        mimeType: file.type,
        size: file.size,
        url,
        alt,
      },
    });

    return NextResponse.json({ data: media });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

function mimeToExt(mime: string): string {
  switch (mime) {
    case "image/jpeg":   return ".jpg";
    case "image/png":    return ".png";
    case "image/webp":   return ".webp";
    case "image/gif":    return ".gif";
    case "image/svg+xml":return ".svg";
    default:             return "";
  }
}
