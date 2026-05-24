"use client";

import { useEffect, useState } from "react";
import type { DivinationResult } from "@/lib/reading";
import { ReadingResult } from "@/components/ReadingResult";
import { ResultPaywall } from "@/components/ResultPaywall";
import {
  fetchVendureProducts,
  type VendureProductSummary,
} from "@/lib/vendure";

const HOURS: { value: number; label: string; branch: string }[] = [
  { value: 0,  label: "23:00 – 00:59", branch: "子 Zi (Rat)" },
  { value: 2,  label: "01:00 – 02:59", branch: "丑 Chou (Ox)" },
  { value: 4,  label: "03:00 – 04:59", branch: "寅 Yin (Tiger)" },
  { value: 6,  label: "05:00 – 06:59", branch: "卯 Mao (Rabbit)" },
  { value: 8,  label: "07:00 – 08:59", branch: "辰 Chen (Dragon)" },
  { value: 10, label: "09:00 – 10:59", branch: "巳 Si (Snake)" },
  { value: 12, label: "11:00 – 12:59", branch: "午 Wu (Horse)" },
  { value: 14, label: "13:00 – 14:59", branch: "未 Wei (Goat)" },
  { value: 16, label: "15:00 – 16:59", branch: "申 Shen (Monkey)" },
  { value: 18, label: "17:00 – 18:59", branch: "酉 You (Rooster)" },
  { value: 20, label: "19:00 – 20:59", branch: "戌 Xu (Dog)" },
  { value: 22, label: "21:00 – 22:59", branch: "亥 Hai (Pig)" },
];

export default function DivinationPage() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [birthDate, setBirthDate] = useState("");
  const [birthHour, setBirthHour] = useState<number>(12);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DivinationResult | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<
    VendureProductSummary[]
  >([]);

  useEffect(() => {
    if (!result) return;
    let active = true;
    fetchVendureProducts(8)
      .then((items) => {
        if (active) setRecommendedProducts(items);
      })
      .catch(() => {
        if (active) setRecommendedProducts([]);
      });
    return () => {
      active = false;
    };
  }, [result]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!birthDate) {
      setError("Please enter your date of birth.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/divination", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, gender, birthDate, birthHour }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Reading failed");
      setResult(json.data as DivinationResult);
      requestAnimationFrame(() => {
        document.getElementById("reading-result")?.scrollIntoView({ behavior: "smooth" });
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative py-20">
      <div className="container-page">
        <div className="text-center">
          <span className="heading-display text-xs text-gold-200">
            Cast Your Celestial Chart
          </span>
          <h1 className="mt-4 font-display text-4xl uppercase tracking-[0.18em] md:text-5xl">
            <span className="gold-text">Reveal Your Destiny</span>
          </h1>
          <div className="divider-gold mt-6" />
          <p className="mx-auto mt-6 max-w-2xl text-ink-100/80">
            Submit your birth coordinates. Our system will compute your{" "}
            <em>BaZi</em> Four Pillars, Five Elements distribution, Chinese and
            Western Zodiac signs — revealing the hidden current of your life.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-2xl">
          <form onSubmit={handleSubmit} className="card-mystic">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="label-mystic" htmlFor="name">
                  Your Name (optional)
                </label>
                <input
                  id="name"
                  className="input-mystic"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sophia"
                />
              </div>

              <div>
                <label className="label-mystic" htmlFor="birthDate">
                  Date of Birth
                </label>
                <input
                  id="birthDate"
                  type="date"
                  className="input-mystic"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  max={new Date().toISOString().slice(0, 10)}
                  required
                />
              </div>

              <div>
                <label className="label-mystic" htmlFor="birthHour">
                  Hour of Birth
                </label>
                <select
                  id="birthHour"
                  className="input-mystic"
                  value={birthHour}
                  onChange={(e) => setBirthHour(parseInt(e.target.value, 10))}
                >
                  {HOURS.map((h) => (
                    <option key={h.value} value={h.value}>
                      {h.label} · {h.branch}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="label-mystic">Gender</label>
                <div className="flex gap-3">
                  {(["male", "female"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`flex-1 rounded-sm border px-4 py-3 font-display text-xs uppercase tracking-[0.25em] transition ${
                        gender === g
                          ? "border-gold-300 bg-gold-400/10 text-gold-100 shadow-glow"
                          : "border-gold-300/20 text-ink-100/70 hover:border-gold-300/60"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <p className="mt-6 rounded-sm border border-crimson/40 bg-crimson/10 px-4 py-3 text-sm text-crimson">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-8 w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Consulting the Stars…" : "Reveal My Reading"}
            </button>
            <p className="mt-4 text-center text-xs text-ink-100/40">
              Your information is kept private and used only for this reading.
            </p>
          </form>
        </div>

        {result && (
          <div id="reading-result" className="mt-20">
            <ReadingResult result={result} userName={name} />
          </div>
        )}
      </div>

      {result && (
        <ResultPaywall
          dayMaster={result.chart.day.element}
          vendureProducts={recommendedProducts}
          whatsappUrl={
            process.env.NEXT_PUBLIC_WHATSAPP_URL ||
            "https://wa.me/8615000000000"
          }
          whatsappMessage={`Hello LingYun, my BaZi reading reveals a ${result.chart.day.element} Day Master, ${result.chineseZodiac.animal} year, ${result.westernZodiac.name}. I would like a complete reading.`}
        />
      )}
    </section>
  );
}
