export function LineageStory() {
  return (
    <section className="relative py-28">
      <div className="container-page grid items-center gap-14 md:grid-cols-2">
        <div className="relative">
          <div className="relative mx-auto h-[460px] w-[460px] max-w-full">
            <div
              className="absolute inset-0 rounded-full border animate-spinSlow"
              style={{
                borderColor: "var(--c-border-strong)",
                boxShadow: "0 0 80px var(--c-glow)",
              }}
            />
            <div className="absolute inset-8 rounded-full bagua animate-spinReverse" />
            <div className="absolute inset-20 rounded-full bagua animate-spinSlow opacity-60" />
            <div className="absolute inset-32 taiji animate-spinSlow" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="han text-8xl gold-text">靈雲</span>
            </div>
          </div>

          {/* floating glyphs */}
          {["金", "木", "水", "火", "土"].map((g, i) => {
            const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
            const r = 240;
            const x = Math.round(Math.cos(angle) * r);
            const y = Math.round(Math.sin(angle) * r);
            return (
              <span
                key={g}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-float han text-2xl opacity-60"
                style={{
                  transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`,
                  color: "var(--c-primary-soft)",
                  animationDelay: `${i * 0.5}s`,
                }}
              >
                {g}
              </span>
            );
          })}
        </div>

        <div>
          <span className="section-eyebrow">Our Lineage</span>
          <h2 className="mt-3 section-title">
            <span className="gold-text">Zhengyi · Jiulong</span>
          </h2>
          <div
            className="mt-5 h-px w-24"
            style={{ background: "linear-gradient(90deg, var(--c-primary), transparent)" }}
          />
          <p className="mt-6 text-lg leading-relaxed" style={{ color: "var(--c-text-soft)" }}>
            LingYun FengShui is a direct disciple-house of the{" "}
            <em>Zhengyi Jiulong School</em> — an orthodox Taoist lineage rooted
            in centuries of Chinese metaphysical practice. We carry forward the
            authentic transmission of BaZi, Feng Shui, and the Five Elements
            arts — guiding seekers worldwide to walk in resonance with the Tao.
          </p>

          <ul className="mt-8 space-y-4">
            {[
              "Authentic Zhengyi Taoist lineage — Jiulong School",
              "Personalized readings rooted in classical metaphysics",
              "Clear, actionable guidance — not vague platitudes",
              "Confidential, private channel via WhatsApp",
              "Trusted by seekers in over 40 countries",
            ].map((it) => (
              <li
                key={it}
                className="flex items-start gap-3"
                style={{ color: "var(--c-text-soft)" }}
              >
                <span
                  className="mt-2 inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: "var(--c-primary)" }}
                />
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
