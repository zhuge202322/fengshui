import Link from "next/link";

export function HowItWorks() {
  const steps = [
    {
      n: "01",
      glyph: "辰",
      t: "Submit Birth Info",
      d: "Year, month, day and hour — the celestial coordinates of your soul.",
    },
    {
      n: "02",
      glyph: "卦",
      t: "Receive Free Insight",
      d: "An initial portrait of your elemental nature, archetype and core fortune.",
    },
    {
      n: "03",
      glyph: "解",
      t: "Unlock Full Reading",
      d: "Career, wealth, love, health and 10-year luck cycle — delivered privately.",
    },
    {
      n: "04",
      glyph: "緣",
      t: "Personal Guidance",
      d: "Reach our masters on WhatsApp for a confidential consultation tailored to you.",
    },
  ];

  return (
    <section className="relative py-28">
      <div className="container-page">
        <div className="text-center">
          <span className="section-eyebrow">How It Works</span>
          <h2 className="mt-3 section-title">
            <span className="gold-text">Your Path to Clarity</span>
          </h2>
          <div className="divider-gold mt-5" />
        </div>

        <div className="relative mt-16">
          {/* connector line */}
          <div
            className="pointer-events-none absolute left-0 right-0 top-12 hidden h-px md:block"
            style={{ background: "linear-gradient(90deg, transparent, var(--c-border-strong), transparent)" }}
          />

          <ol className="grid gap-6 md:grid-cols-4">
            {steps.map((s) => (
              <li key={s.n} className="card-mystic relative text-center">
                <div
                  className="mx-auto -mt-12 flex h-20 w-20 items-center justify-center rounded-full border"
                  style={{
                    background: "var(--c-bg-soft)",
                    borderColor: "var(--c-border-strong)",
                    boxShadow: "0 0 30px var(--c-glow)",
                  }}
                >
                  <span className="han text-3xl" style={{ color: "var(--c-primary-soft)" }}>
                    {s.glyph}
                  </span>
                </div>
                <div className="mt-4 font-display text-xs opacity-50">STEP {s.n}</div>
                <h3 className="mt-1 heading-display text-sm">{s.t}</h3>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--c-text-soft)" }}>
                  {s.d}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-14 text-center">
          <Link href="/divination" className="btn-primary">
            Cast Your Chart Now
          </Link>
        </div>
      </div>
    </section>
  );
}
