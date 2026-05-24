import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const postCreateSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).optional(),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.any(),
  contentHtml: z.string().optional(),
  coverImage: z.string().url().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  categoryId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).optional(),
  readMinutes: z.number().int().min(1).max(60).optional(),
});

export const postUpdateSchema = postCreateSchema.partial();

export const categoryCreateSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).optional(),
});

export const tagCreateSchema = z.object({
  name: z.string().min(1).max(50),
  slug: z.string().min(1).max(50).optional(),
});
