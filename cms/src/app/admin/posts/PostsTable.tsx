"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface PostRow {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";
  categoryName: string | null;
  tagNames: string[];
  updatedAt: string;
  views: number;
}

export function PostsTable({ posts }: { posts: PostRow[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setPendingId(id);
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (!res.ok) {
        alert("Delete failed");
        return;
      }
      startTransition(() => router.refresh());
    } finally {
      setPendingId(null);
    }
  }

  if (posts.length === 0) {
    return (
      <div className="panel text-center text-sm" style={{ color: "var(--c-muted)" }}>
        No articles yet. Click <Link href="/admin/posts/new" className="underline">New Article</Link> to start.
      </div>
    );
  }

  return (
    <div className="panel overflow-hidden p-0">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--c-muted)" }}>
            <th className="px-5 py-3">Title</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3">Category</th>
            <th className="px-5 py-3">Updated</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y" style={{ borderColor: "var(--c-border)" }}>
          {posts.map((p) => (
            <tr key={p.id} className="border-t" style={{ borderColor: "var(--c-border)" }}>
              <td className="px-5 py-3">
                <Link href={`/admin/posts/${p.id}`} className="font-medium hover:underline">
                  {p.title}
                </Link>
                <div className="mt-0.5 text-[11px]" style={{ color: "var(--c-muted)" }}>
                  /{p.slug} · {p.views} views
                </div>
              </td>
              <td className="px-5 py-3">
                <span className="badge">{p.status}</span>
              </td>
              <td className="px-5 py-3">
                <span className="text-xs" style={{ color: "var(--c-muted)" }}>
                  {p.categoryName ?? "—"}
                </span>
              </td>
              <td className="px-5 py-3 text-xs" style={{ color: "var(--c-muted)" }}>
                {new Date(p.updatedAt).toLocaleString()}
              </td>
              <td className="px-5 py-3 text-right">
                <div className="inline-flex gap-2">
                  <Link href={`/admin/posts/${p.id}`} className="btn">Edit</Link>
                  <button
                    type="button"
                    className="btn-danger"
                    disabled={pendingId === p.id}
                    onClick={() => handleDelete(p.id, p.title)}
                  >
                    {pendingId === p.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
