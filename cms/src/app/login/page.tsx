"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@lingyun.local");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Login failed");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="panel w-full max-w-md">
        <div className="text-center">
          <div
            className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full border text-2xl"
            style={{ borderColor: "var(--c-primary)", color: "var(--c-primary-soft)" }}
          >
            靈
          </div>
          <h1 className="mt-4 text-2xl gold-text" style={{ fontFamily: "Cinzel", letterSpacing: "0.18em" }}>
            LingYun CMS
          </h1>
          <p className="mt-1 text-xs uppercase tracking-[0.25em]" style={{ color: "var(--c-muted)" }}>
            Admin Console
          </p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              className="field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p
              className="rounded-md border px-3 py-2 text-sm"
              style={{ borderColor: "rgba(185,28,28,0.5)", color: "#fca5a5", background: "rgba(185,28,28,0.1)" }}
            >
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <p className="text-center text-[11px]" style={{ color: "var(--c-muted)" }}>
            Default seed: admin@lingyun.local / admin123456
          </p>
        </form>
      </div>
    </div>
  );
}
