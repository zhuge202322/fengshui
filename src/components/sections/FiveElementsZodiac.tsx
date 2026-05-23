"use client";

import Link from "next/link";

const ELEMENTS = [
  { glyph: "木", en: "Wood",  pinyin: "Mù",   color: "#3fa17a", trait: "Growth · Vision · Benevolence", season: "Spring · East" },
  { glyph: "火", en: "Fire",  pinyin: "Huǒ",  color: "#c0392b", trait: "Passion · Propriety · Radiance", season: "Summer · South" },
  { glyph: "土", en: "Earth", pinyin: "Tǔ",   color: "#c9a233", trait: "Stability · Trust · Nurturing",  season: "Late Summer · Center" },
  { glyph: "金", en: "Metal", pinyin: "Jīn",  color: "#e5e7eb", trait: "Clarity · Integrity · Precision", season: "Autumn · West" },
  { glyph: "水", en: "Water", pinyin: "Shuǐ", color: "#60a5fa", trait: "Wisdom · Depth · Adaptability",   season: "Winter · North" },
];

const ZODIACS = [
  { glyph: "鼠", en: "Rat",     years: "1984 · 1996 · 2008" },
  { glyph: "牛", en: "Ox",      years: "1985 · 1997 · 2009" },
  { glyph: "虎", en: "Tiger",   years: "1986 · 1998 · 2010" },
  { glyph: "兔", en: "Rabbit",  years: "1987 · 1999 · 2011" },
  { glyph: "龍", en: "Dragon",  years: "1988 · 2000 · 2012" },
  { glyph: "蛇", en: "Snake",   years: "1989 · 2001 · 2013" },
  { glyph: "馬", en: "Horse",   years: "1990 · 2002 · 2014" },
  { glyph: "羊", en: "Goat",    years: "1991 · 2003 · 2015" },
  { glyph: "猴", en: "Monkey",  years: "1992 · 2004 · 2016" },
  { glyph: "雞", en: "Rooster", years: "1993 · 2005 · 2017" },
  { glyph: "狗", en: "Dog",     years: "1994 · 2006 · 2018" },
  { glyph: "豬", en: "Pig",     years: "1995 · 2007 · 2019" },
];

export function FiveElementsZodiac() {
  return (
    <>
      {/* FIVE ELEMENTS */}
      <section className="relative py-28">
        <div className="container-page">
          <div className="text-center">
            <span className="section-eyebrow">五行 · Wu Xing</span>
            <h2 className="mt-3 section-title">
              <span className="gold-text">The Five Cosmic Elements</span>
            </h2>
            <div className="divider-gold mt-5" />
            <p
              className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed"
              style={{ color: "var(--c-text-soft)" }}
            >
              Wood, Fire, Earth, Metal, Water — the five primordial forces that
              compose every being, every season, every fortune. Their dance is
              the music of the Tao.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {ELEMENTS.map((el, i) => (
              <div
                key={el.en}
                className="group card-mystic relative overflow-hidden text-center transition hover:-translate-y-1"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-20 transition group-hover:opacity-40"
                  style={{
                    background: `radial-gradient(circle at center, ${el.color}, transparent 70%)`,
                  }}
                />
                <div className="relative">
                  <div
                    className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border animate-float"
                    style={{
                      borderColor: el.color,
                      boxShadow: `0 0 30px ${el.color}55, inset 0 0 20px ${el.color}33`,
                      animationDelay: `${i * 0.4}s`,
                    }}
                  >
                    <span className="han text-5xl" style={{ color: el.color }}>
                      {el.glyph}
                    </span>
                  </div>
                  <div className="mt-5 heading-display text-sm">{el.en}</div>
                  <div className="text-[11px] uppercase tracking-[0.3em] opacity-60">
                    {el.pinyin}
                  </div>
                  <p className="mt-3 text-sm" style={{ color: "var(--c-text-soft)" }}>
                    {el.trait}
                  </p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.18em] opacity-60">
                    {el.season}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHINESE ZODIAC WHEEL */}
      <section className="relative py-28">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px max-w-4xl"
          style={{ background: "linear-gradient(90deg, transparent, var(--c-border-strong), transparent)" }}
        />

        <div className="container-page">
          <div className="text-center">
            <span className="section-eyebrow">十二生肖 · Shēng Xiào</span>
            <h2 className="mt-3 section-title">
              <span className="gold-text">The Twelve Celestial Animals</span>
            </h2>
            <div className="divider-gold mt-5" />
            <p
              className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed"
              style={{ color: "var(--c-text-soft)" }}
            >
              Each year is guarded by one of the twelve animal spirits — your
              birth year reveals your innate temperament and the elemental
              currents that shape your fortune.
            </p>
          </div>

          <div className="mt-16 grid gap-12 md:grid-cols-5 md:items-center">
            {/* zodiac wheel */}
            <div className="relative mx-auto h-[360px] w-[360px] max-w-full md:col-span-2">
              <div
                className="absolute inset-0 rounded-full border animate-spinSlow"
                style={{ borderColor: "var(--c-border-strong)", boxShadow: "0 0 60px var(--c-glow)" }}
              />
              <div className="absolute inset-6 rounded-full bagua animate-spinReverse" />
              <div className="absolute inset-16 taiji animate-spinSlow" />

              {ZODIACS.map((z, i) => {
                const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
                const r = 160;
                const x = Math.round(Math.cos(angle) * r);
                const y = Math.round(Math.sin(angle) * r);
                return (
                  <div
                    key={z.en}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))` }}
                  >
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full border backdrop-blur"
                      style={{
                        background: "var(--c-bg-soft)",
                        borderColor: "var(--c-border-strong)",
                      }}
                      title={`${z.en} · ${z.years}`}
                    >
                      <span className="han text-xl" style={{ color: "var(--c-primary-soft)" }}>
                        {z.glyph}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* grid list */}
            <div className="md:col-span-3">
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {ZODIACS.map((z) => (
                  <div
                    key={z.en}
                    className="card-mystic flex items-center gap-3 !p-3 text-left"
                  >
                    <span className="han text-2xl" style={{ color: "var(--c-primary-soft)" }}>
                      {z.glyph}
                    </span>
                    <div className="leading-tight">
                      <div className="text-[12px] uppercase tracking-[0.15em]">
                        {z.en}
                      </div>
                      <div className="text-[10px] opacity-60">{z.years.split(" · ")[0]}…</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center md:text-left">
                <Link href="/divination" className="btn-primary">
                  Find Your Animal Sign
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
