import slugify from "slugify";
import { prisma } from "./prisma";

export async function ensureUniqueSlug(input: string, model: "post" | "category" | "tag", currentId?: string): Promise<string> {
  const base = slugify(input, { lower: true, strict: true, trim: true });
  if (!base) return `untitled-${Date.now()}`;

  let candidate = base;
  let n = 1;
  while (true) {
    const exists = await checkExists(model, candidate, currentId);
    if (!exists) return candidate;
    n += 1;
    candidate = `${base}-${n}`;
  }
}

async function checkExists(model: "post" | "category" | "tag", slug: string, currentId?: string): Promise<boolean> {
  const where = { slug, ...(currentId ? { NOT: { id: currentId } } : {}) };
  switch (model) {
    case "post":     return Boolean(await prisma.post.findFirst({ where }));
    case "category": return Boolean(await prisma.category.findFirst({ where }));
    case "tag":      return Boolean(await prisma.tag.findFirst({ where }));
  }
}
