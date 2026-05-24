const CMS_BASE_URL =
  process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:3001";

export interface CmsCategory {
  id: string;
  name: string;
  slug: string;
}

export interface CmsTag {
  id: string;
  name: string;
  slug: string;
}

export interface CmsPostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: string | null;
  readMinutes: number;
  views: number;
  category: CmsCategory | null;
  tags: CmsTag[];
}

export interface CmsPostDetail extends CmsPostSummary {
  contentHtml: string;
  author: { name: string | null; email: string } | null;
}

interface ListResponse<T> { data: T[] }
interface SingleResponse<T> { data: T }

export async function fetchPosts(params?: {
  q?: string;
  limit?: number;
  category?: string;
  tag?: string;
}): Promise<CmsPostSummary[]> {
  const search = new URLSearchParams();
  if (params?.q) search.set("q", params.q);
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.category) search.set("category", params.category);
  if (params?.tag) search.set("tag", params.tag);

  const url = `${CMS_BASE_URL}/api/public/posts${search.toString() ? `?${search}` : ""}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = (await res.json()) as ListResponse<CmsPostSummary>;
    return json.data ?? [];
  } catch {
    return [];
  }
}

export async function fetchPostBySlug(slug: string): Promise<CmsPostDetail | null> {
  try {
    const res = await fetch(`${CMS_BASE_URL}/api/public/posts/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as SingleResponse<CmsPostDetail>;
    return json.data ?? null;
  } catch {
    return null;
  }
}

export function formatPublishedDate(input: string | null): string {
  if (!input) return "";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" });
}
