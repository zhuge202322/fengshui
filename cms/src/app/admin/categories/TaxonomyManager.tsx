"use client";

import { useState } from "react";

interface TaxonomyItem {
  id: string;
  name: string;
  slug: string;
  count: number;
}

interface Props {
  kind: "category" | "tag";
  title: string;
  endpoint: string;
  items: TaxonomyItem[];
}

export function TaxonomyManager({ kind, title, endpoint, items: initial }: Props) {
  const [items, setItems] = useState<TaxonomyItem[]>(initial);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create() {
    if (!name.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          typeof data?.error === "string"
            ? data.error
            : JSON.stringify(data?.error ?? "Create failed"),
        );
      }
      setItems((prev) =>
        [...prev, { id: data.data.id, name: data.data.name, slug: data.data.slug, count: 0 }]
          .sort((a, b) => a.name.localeCompare(b.name)),
      );
      setName("");
      setSlug("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCreating(false);
    }
  }

  async function remove(id: string, label: string) {
    if (!confirm(`Delete ${kind} "${label}"?`)) return;
    const res = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      alert("Delete failed");
    }
  }

  return (
    <section className="panel">
      <div className="flex items-center justify-between">
        <h2 className="text-lg" style={{ fontFamily: "Cinzel" }}>{title}</h2>
        <span className="badge">{items.length}</span>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-[2fr_2fr_auto]">
        <input
          className="field"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="field"
          placeholder="slug (optional)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <button
          type="button"
          className="btn-primary"
          disabled={creating || !name.trim()}
          onClick={create}
        >
          {creating ? "Adding…" : "Add"}
        </button>
      </div>
      {error && (
        <div
          className="mt-3 rounded-md border px-3 py-2 text-xs"
          style={{ borderColor: "var(--c-danger)", color: "#fca5a5" }}
        >
          {error}
        </div>
      )}

      <ul className="mt-4 divide-y" style={{ borderColor: "var(--c-border)" }}>
        {items.length === 0 && (
          <li className="py-6 text-center text-xs" style={{ color: "var(--c-muted)" }}>
            None yet.
          </li>
        )}
        {items.map((i) => (
          <li key={i.id} className="flex items-center justify-between py-2.5">
            <div>
              <div className="text-sm">{i.name}</div>
              <div className="text-[11px]" style={{ color: "var(--c-muted)" }}>
                /{i.slug} · {i.count} posts
              </div>
            </div>
            <button
              type="button"
              className="btn-danger"
              onClick={() => remove(i.id, i.name)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
