"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { JSONContent } from "@tiptap/react";
import { RichTextEditor } from "@/components/RichTextEditor";

export interface CategoryOption { id: string; name: string }
export interface TagOption { id: string; name: string }

export interface PostFormInitial {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string | null;
  content?: JSONContent | null;
  coverImage?: string | null;
  status?: "DRAFT" | "PUBLISHED";
  categoryId?: string | null;
  tagIds?: string[];
  readMinutes?: number;
}

interface Props {
  mode: "create" | "edit";
  initial?: PostFormInitial;
  categories: CategoryOption[];
  tags: TagOption[];
}

const EMPTY_DOC: JSONContent = { type: "doc", content: [{ type: "paragraph" }] };

export function PostForm({ mode, initial, categories, tags }: Props) {
  const router = useRouter();
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [tagIds, setTagIds] = useState<string[]>(initial?.tagIds ?? []);
  const [readMinutes, setReadMinutes] = useState<number>(initial?.readMinutes ?? 5);

  const [contentJson, setContentJson] = useState<JSONContent>(
    initial?.content ?? EMPTY_DOC,
  );
  const [contentHtml, setContentHtml] = useState<string>("");

  const [saving, setSaving] = useState<"DRAFT" | "PUBLISHED" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);

  const initialContent = useMemo(() => initial?.content ?? EMPTY_DOC, [initial?.content]);

  useEffect(() => {
    if (!slug && title && mode === "create") {
      setSlug(
        title
          .toLowerCase()
          .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-"),
      );
    }
  }, [title, slug, mode]);

  function toggleTag(id: string) {
    setTagIds((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  }

  async function handleCoverUpload(file: File) {
    setUploadingCover(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/media", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Upload failed");
      setCoverImage(data.data.url);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploadingCover(false);
    }
  }

  async function handleSubmit(status: "DRAFT" | "PUBLISHED") {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setSaving(status);
    setError(null);

    const payload = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      excerpt: excerpt.trim() || null,
      content: contentJson,
      contentHtml,
      coverImage: coverImage.trim() || null,
      status,
      categoryId: categoryId || null,
      tagIds,
      readMinutes: Number(readMinutes) || 5,
    };

    const url = mode === "create" ? "/api/posts" : `/api/posts/${initial?.id}`;
    const method = mode === "create" ? "POST" : "PATCH";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          typeof data?.error === "string"
            ? data.error
            : JSON.stringify(data?.error ?? "Save failed"),
        );
      }
      if (mode === "create") {
        router.push(`/admin/posts/${data.data.id}`);
      } else {
        router.refresh();
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <div>
          <label className="label" htmlFor="title">Title</label>
          <input
            id="title"
            className="field text-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="A title worthy of the ancestors…"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
          <div>
            <label className="label" htmlFor="slug">Slug</label>
            <input
              id="slug"
              className="field"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="auto-from-title"
            />
          </div>
          <div>
            <label className="label" htmlFor="readMinutes">Read minutes</label>
            <input
              id="readMinutes"
              type="number"
              min={1}
              max={60}
              className="field"
              value={readMinutes}
              onChange={(e) => setReadMinutes(parseInt(e.target.value || "5", 10))}
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="excerpt">Excerpt</label>
          <textarea
            id="excerpt"
            className="field min-h-[80px]"
            value={excerpt ?? ""}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Short summary shown in listings (max 500 chars)…"
            maxLength={500}
          />
        </div>

        <div className="panel p-0 overflow-hidden">
          <RichTextEditor
            value={initialContent}
            onChange={(json, html) => {
              setContentJson(json);
              setContentHtml(html);
            }}
          />
        </div>
      </div>

      <aside className="space-y-4">
        <div className="panel">
          <h3 className="text-sm uppercase tracking-[0.2em]" style={{ color: "var(--c-primary-soft)" }}>
            Publish
          </h3>
          {error && (
            <div
              className="mt-3 rounded-md border px-3 py-2 text-xs"
              style={{ borderColor: "var(--c-danger)", color: "#fca5a5" }}
            >
              {error}
            </div>
          )}
          <div className="mt-3 flex flex-col gap-2">
            <button
              type="button"
              className="btn"
              disabled={saving !== null}
              onClick={() => handleSubmit("DRAFT")}
            >
              {saving === "DRAFT" ? "Saving…" : "Save as Draft"}
            </button>
            <button
              type="button"
              className="btn-primary"
              disabled={saving !== null}
              onClick={() => handleSubmit("PUBLISHED")}
            >
              {saving === "PUBLISHED" ? "Publishing…" : "Publish"}
            </button>
          </div>
          {initial?.status && (
            <div className="mt-3 text-[11px]" style={{ color: "var(--c-muted)" }}>
              Current status: <span className="badge ml-1">{initial.status}</span>
            </div>
          )}
        </div>

        <div className="panel">
          <h3 className="text-sm uppercase tracking-[0.2em]" style={{ color: "var(--c-primary-soft)" }}>
            Cover Image
          </h3>
          {coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImage}
              alt="cover"
              className="mt-3 w-full rounded-md border object-cover"
              style={{ borderColor: "var(--c-border)" }}
            />
          ) : (
            <div
              className="mt-3 flex h-32 items-center justify-center rounded-md border text-xs"
              style={{ borderColor: "var(--c-border)", color: "var(--c-muted)" }}
            >
              No image yet
            </div>
          )}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleCoverUpload(file);
              e.target.value = "";
            }}
          />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className="btn flex-1"
              disabled={uploadingCover}
              onClick={() => coverInputRef.current?.click()}
            >
              {uploadingCover ? "Uploading…" : coverImage ? "Replace" : "Upload"}
            </button>
            {coverImage && (
              <button
                type="button"
                className="btn-danger"
                onClick={() => setCoverImage("")}
              >
                Clear
              </button>
            )}
          </div>
          <div className="mt-3">
            <label className="label" htmlFor="coverUrl">Or paste URL</label>
            <input
              id="coverUrl"
              className="field"
              value={coverImage ?? ""}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://…"
            />
          </div>
        </div>

        <div className="panel">
          <h3 className="text-sm uppercase tracking-[0.2em]" style={{ color: "var(--c-primary-soft)" }}>
            Category
          </h3>
          <select
            className="field mt-3"
            value={categoryId ?? ""}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">— None —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="panel">
          <h3 className="text-sm uppercase tracking-[0.2em]" style={{ color: "var(--c-primary-soft)" }}>
            Tags
          </h3>
          {tags.length === 0 ? (
            <p className="mt-3 text-xs" style={{ color: "var(--c-muted)" }}>
              No tags yet. Manage in Categories &amp; Tags.
            </p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((t) => {
                const active = tagIds.includes(t.id);
                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => toggleTag(t.id)}
                    className="rounded-full border px-3 py-1 text-xs transition"
                    style={{
                      borderColor: active ? "var(--c-primary)" : "var(--c-border)",
                      background: active ? "rgba(201,162,51,0.15)" : "transparent",
                      color: active ? "var(--c-primary-soft)" : "var(--c-muted)",
                    }}
                  >
                    {t.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
