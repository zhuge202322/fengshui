"use client";

import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="relative py-28">
      <div className="container-page">
        <div
          className="relative overflow-hidden rounded-md border p-10 md:p-16"
          style={{
            background:
              "linear-gradient(135deg, var(--c-bg-soft), var(--c-bg))",
            borderColor: "var(--c-border-strong)",
          }}
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bagua opacity-20 animate-spinSlow" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bagua opacity-15 animate-spinReverse" />

          <div className="relative grid items-center gap-10 md:grid-cols-2">
            <div>
              <span className="section-eyebrow">Stay in the Flow</span>
              <h2 className="mt-3 section-title">
                <span className="gold-text">Whispers from the Tao</span>
              </h2>
              <p
                className="mt-5 max-w-md text-lg leading-relaxed"
                style={{ color: "var(--c-text-soft)" }}
              >
                Receive monthly cosmic forecasts, ritual reminders, and quiet
                wisdom from our masters. No spam — just signal.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setDone(true);
              }}
              className="space-y-4"
            >
              <label className="label-mystic">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="input-mystic !py-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={done}
              />
              <button type="submit" disabled={done} className="btn-primary w-full">
                {done ? "✓ Subscribed · Welcome, Seeker" : "Subscribe"}
              </button>
              <p className="text-[11px] opacity-50">
                We never share your data. Read our privacy policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
