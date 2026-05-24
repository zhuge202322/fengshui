"use client";

import { useRef, useState } from "react";

interface MediaItem {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  alt: string | null;
  createdAt: string;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function MediaManager({ initial }: { initial: MediaItem[] }) {
  const [items, setItems] = useState<MediaItem[]>(initial);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/media", { method: "POST", body: form });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? "Upload failed");
        setItems((prev) => [
          {
            ...data.data,
            createdAt: new Date(data.data.createdAt).toISOString(),
          },
          ...prev,
        ]);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this media file?")) return;
    const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((m) => m.id !== id));
    } else {
      alert("Delete failed");
    }
  }

  function copyUrl(url: string) {
    const full = url.startsWith("http") ? url : `${location.origin}${url}`;
    navigator.clipboard.writeText(full).then(
      () => alert(`Copied: ${full}`),
      () => prompt("Copy URL:", full),
    );
  }

  return (
    <div>
      <div className="panel flex items-center justify-between gap-4">
        <div>
          <div className="text-sm">Upload images</div>
          <div className="text-xs" style={{ color: "var(--c-muted)" }}>
            JPG · PNG · WEBP · GIF · SVG, max 5 MB each.
          </div>
        </div>
        <div className="flex items-center gap-2">
          {error && (
            <span className="text-xs" style={{ color: "#fca5a5" }}>{error}</span>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
          <button
            type="button"
            className="btn-primary"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? "Uploading…" : "Upload Files"}
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="panel mt-6 text-center text-sm" style={{ color: "var(--c-muted)" }}>
          No media yet. Upload your first image to get started.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((m) => (
            <div
              key={m.id}
              className="group relative overflow-hidden rounded-lg border"
              style={{ borderColor: "var(--c-border)", background: "var(--c-surface)" }}
            >
              <div className="aspect-square w-full overflow-hidden bg-black/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.url}
                  alt={m.alt ?? m.filename}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
              </div>
              <div className="px-3 py-2 text-[11px]" style={{ color: "var(--c-muted)" }}>
                <div className="truncate" title={m.filename}>{m.filename}</div>
                <div className="mt-0.5 flex items-center justify-between">
                  <span>{formatSize(m.size)}</span>
                  <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="absolute inset-0 flex items-end justify-center gap-2 bg-gradient-to-t from-black/80 via-transparent p-3 opacity-0 transition group-hover:opacity-100">
                <button
                  type="button"
                  className="btn"
                  onClick={() => copyUrl(m.url)}
                >
                  Copy URL
                </button>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => handleDelete(m.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
