"use client";

import { useEffect, useMemo, useState } from "react";

const ANIMALS = [
  { name: "Rat",     emoji: "🐀", trait: "A day favoring strategy and quiet networking." },
  { name: "Ox",      emoji: "🐂", trait: "Steady progress rewards your discipline today." },
  { name: "Tiger",   emoji: "🐅", trait: "Bold action receives unexpected support." },
  { name: "Rabbit",  emoji: "🐇", trait: "Soft diplomacy unlocks closed doors." },
  { name: "Dragon",  emoji: "🐉", trait: "A signal arrives — pay attention to coincidences." },
  { name: "Snake",   emoji: "🐍", trait: "Intuition is sharper than logic. Trust it." },
  { name: "Horse",   emoji: "🐎", trait: "Movement releases stagnation. Travel if you can." },
  { name: "Goat",    emoji: "🐐", trait: "Creative energy peaks. Make something beautiful." },
  { name: "Monkey",  emoji: "🐒", trait: "Reframing a problem reveals a new path." },
  { name: "Rooster", emoji: "🐓", trait: "Polish a detail you have been avoiding." },
  { name: "Dog",     emoji: "🐕", trait: "Loyalty returns to you in a small kindness." },
  { name: "Pig",     emoji: "🐖", trait: "Abundance flows through honest, generous acts." },
];

const ELEMENTS = ["Wood", "Fire", "Earth", "Metal", "Water"] as const;
const DIRS = ["East", "South", "West", "North", "Center"] as const;
const COLORS = ["Emerald", "Crimson", "Gold", "Silver", "Indigo"] as const;
const NUMBERS = [3, 6, 8, 9, 1, 4, 7, 2, 5] as const;

function dayHash() {
  const d = new Date();
  const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h << 5) - h + key.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function DailyFortune() {
  // Defer to client to avoid SSR/CSR mismatch on date
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const data = useMemo(() => {
    const h = dayHash();
    return {
      element: ELEMENTS[h % ELEMENTS.length],
      direction: DIRS[(h >> 2) % DIRS.length],
      color: COLORS[(h >> 4) % COLORS.length],
      number: NUMBERS[(h >> 6) % NUMBERS.length],
      avoid: ELEMENTS[(h >> 8) % ELEMENTS.length],
      animals: ANIMALS,
    };
  }, []);

  return (
    <section className="relative py-28">
      <div className="container-page">
        <div className="text-center">
          <span className="section-eyebrow">Today&apos;s Oracle · 今日玄機</span>
          <h2 className="mt-3 section-title">
            <span className="gold-text">Daily Cosmic Reading</span>
          </h2>
          <div className="divider-gold mt-5" />
          <p
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed"
            style={{ color: "var(--c-text-soft)" }}
          >
            A glance at the day&apos;s elemental current — your auspicious direction,
            color and number for{" "}
            {ready ? new Date().toLocaleDateString("en-US", { dateStyle: "long" }) : "today"}.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-5">
          {[
            { l: "Element",   v: data.element,   sub: "Ascendant energy" },
            { l: "Direction", v: data.direction, sub: "Most auspicious" },
            { l: "Color",     v: data.color,     sub: "Wear today" },
            { l: "Number",    v: String(data.number), sub: "Lucky digit" },
            { l: "Avoid",     v: data.avoid,     sub: "Element in clash" },
          ].map((it) => (
            <div key={it.l} className="card-mystic text-center">
              <div className="text-[10px] uppercase tracking-[0.25em] opacity-60">{it.l}</div>
              <div className="mt-3 font-display text-2xl gold-text">{it.v}</div>
              <div className="mt-2 text-[11px] opacity-50">{it.sub}</div>
            </div>
          ))}
        </div>

        {/* per-zodiac micro horoscope */}
        <div className="mt-12">
          <div className="text-center text-[11px] uppercase tracking-[0.25em] opacity-60">
            Today by Zodiac
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {data.animals.map((a) => (
              <div
                key={a.name}
                className="card-mystic flex items-start gap-3 !p-4"
              >
                <span className="text-2xl">{a.emoji}</span>
                <div>
                  <div className="font-display text-sm">{a.name}</div>
                  <div className="text-xs opacity-70" style={{ color: "var(--c-text-soft)" }}>
                    {a.trait}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
