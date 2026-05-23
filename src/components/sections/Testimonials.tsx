"use client";

const TESTIMONIALS = [
  {
    name: "Sophia M.",
    role: "Marketing Director",
    country: "United Kingdom",
    rating: 5,
    text: "I've always felt something was holding me back in my career. After my BaZi reading, everything clicked. The insights were uncanny — I now know where to focus to unlock my potential.",
    initials: "SM",
    color: "#c9a233",
  },
  {
    name: "Mark & Linda",
    role: "Homeowners",
    country: "Canada",
    rating: 5,
    text: "The home Feng Shui consultation noticeably improved our family harmony. Within weeks the atmosphere shifted — calmer, warmer, more flow.",
    initials: "ML",
    color: "#8b1a1a",
  },
  {
    name: "Anna K.",
    role: "Entrepreneur",
    country: "United States",
    rating: 5,
    text: "An incredibly accurate Bazi reading. It explained why I faced certain challenges and gave me a clear plan for the next chapter. Worth every penny.",
    initials: "AK",
    color: "#3fa17a",
  },
  {
    name: "Daniel R.",
    role: "Tech Founder",
    country: "Singapore",
    rating: 5,
    text: "I was skeptical at first, but the masters at LingYun pinpointed timing windows with uncanny precision. My next funding round closed in the predicted month.",
    initials: "DR",
    color: "#6366f1",
  },
  {
    name: "Yuki T.",
    role: "Artist",
    country: "Japan",
    rating: 5,
    text: "The Five Elements analysis helped me redesign my studio. My creativity has flowed more freely ever since — it feels like a clogged channel finally opened.",
    initials: "YT",
    color: "#d946ef",
  },
  {
    name: "Carlos P.",
    role: "Restaurant Owner",
    country: "Spain",
    rating: 5,
    text: "After the Tai Sui ritual, our restaurant's traffic doubled within two months. The team is calmer, customers stay longer. Authentic and powerful work.",
    initials: "CP",
    color: "#f5b942",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-28">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse at 20% 30%, var(--c-glow), transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(139,26,26,0.2), transparent 50%)",
        }}
      />

      <div className="container-page">
        <div className="text-center">
          <span className="section-eyebrow">Voices of Our Seekers</span>
          <h2 className="mt-3 section-title">
            <span className="gold-text">Trusted Worldwide</span>
          </h2>
          <div className="divider-gold mt-5" />
        </div>

        {/* Stat strip */}
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { v: "12K+", l: "Readings Delivered" },
            { v: "98%",  l: "Satisfaction Rate" },
            { v: "40+",  l: "Countries Reached" },
            { v: "20Y",  l: "Lineage Practice" },
          ].map((s) => (
            <div key={s.l} className="card-mystic text-center">
              <div className="font-display text-3xl gold-text">{s.v}</div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.25em] opacity-70">
                {s.l}
              </div>
            </div>
          ))}
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <article key={t.name} className="card-mystic flex flex-col">
              <div className="flex items-center gap-1" style={{ color: "var(--c-primary-soft)" }}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p
                className="mt-4 flex-1 text-base leading-relaxed"
                style={{ color: "var(--c-text-soft)" }}
              >
                <span className="font-display text-2xl gold-text" style={{ marginRight: 4 }}>
                  “
                </span>
                {t.text}
                <span className="font-display text-2xl gold-text" style={{ marginLeft: 4 }}>
                  ”
                </span>
              </p>
              <div
                className="mt-6 flex items-center gap-3 border-t pt-4"
                style={{ borderColor: "var(--c-border)" }}
              >
                <span
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border font-display text-sm"
                  style={{
                    background: `linear-gradient(135deg, ${t.color}55, ${t.color}22)`,
                    borderColor: t.color,
                    color: t.color,
                  }}
                >
                  {t.initials}
                </span>
                <div>
                  <div className="font-display text-sm">{t.name}</div>
                  <div className="text-[11px] opacity-60">
                    {t.role} · {t.country}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Trust ribbon */}
        <div
          className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 border-y py-6"
          style={{ borderColor: "var(--c-border)" }}
        >
          {[
            "🛡️ Confidential",
            "🪷 Authentic Lineage",
            "📜 Personalized Report",
            "💬 WhatsApp Aftercare",
            "⭐ 5-star Reviews",
          ].map((it) => (
            <span
              key={it}
              className="text-[11px] uppercase tracking-[0.25em]"
              style={{ color: "var(--c-primary-soft)" }}
            >
              {it}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
