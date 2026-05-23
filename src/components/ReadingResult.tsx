import type { DivinationResult } from "@/lib/reading";
import type { FiveElement } from "@/lib/divination";

const ELEMENT_HEX: Record<FiveElement, string> = {
  Wood: "#3fa17a",
  Fire: "#c0392b",
  Earth: "#c9a233",
  Metal: "#e5e7eb",
  Water: "#60a5fa",
};

const ELEMENT_GLYPH: Record<FiveElement, string> = {
  Wood: "木",
  Fire: "火",
  Earth: "土",
  Metal: "金",
  Water: "水",
};

interface Props {
  result: DivinationResult;
  userName?: string;
}

export function ReadingResult({ result, userName }: Props) {
  const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://wa.me/";
  const greetingName = userName?.trim() || "Seeker";

  const max = Math.max(...Object.values(result.fiveElements.counts), 1);

  return (
    <div className="space-y-10">
      {/* SUMMARY */}
      <div className="card-mystic">
        <span className="heading-display text-xs text-gold-200">Your Reading</span>
        <h2 className="mt-3 font-display text-3xl tracking-[0.12em] md:text-4xl">
          <span className="gold-text">Greetings, {greetingName}</span>
        </h2>
        <div className="divider-gold mt-4 mx-0" />
        <p className="mt-6 text-lg leading-relaxed text-ink-100/90">{result.summary}</p>
      </div>

      {/* BAZI CHART */}
      <div className="card-mystic">
        <span className="heading-display text-xs text-gold-200">
          BaZi · Four Pillars of Destiny
        </span>
        <h3 className="mt-2 font-display text-2xl tracking-[0.12em] gold-text">
          Your Celestial Blueprint
        </h3>
        <div className="mt-6 grid grid-cols-4 gap-3 md:gap-6">
          {(["year", "month", "day", "hour"] as const).map((key) => {
            const p = result.chart[key];
            return (
              <div
                key={key}
                className="relative rounded-sm border border-gold-300/30 bg-black/40 p-4 text-center"
              >
                <div className="heading-display text-[10px] text-gold-200/70">
                  {key === "day" ? "Day · Self" : key}
                </div>
                <div className="mt-3 font-display text-3xl gold-text md:text-4xl">
                  {p.stemCN}
                </div>
                <div className="mt-1 font-display text-3xl text-ink-50 md:text-4xl">
                  {p.branchCN}
                </div>
                <div className="mt-3 text-xs uppercase tracking-[0.2em] text-ink-100/70">
                  {p.stem} {p.branch}
                </div>
                <div className="mt-2 inline-block rounded-full border border-gold-300/30 px-2 py-0.5 text-[10px] text-gold-200">
                  {p.element} / {p.branchElement}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FIVE ELEMENTS */}
      <div className="card-mystic">
        <span className="heading-display text-xs text-gold-200">
          Five Elements Distribution
        </span>
        <h3 className="mt-2 font-display text-2xl tracking-[0.12em] gold-text">
          The Dance of Wu Xing
        </h3>

        <div className="mt-8 grid gap-6 md:grid-cols-5">
          {(Object.entries(result.fiveElements.counts) as [FiveElement, number][]).map(
            ([el, count]) => (
              <div key={el} className="text-center">
                <div
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border"
                  style={{
                    borderColor: ELEMENT_HEX[el],
                    background: `${ELEMENT_HEX[el]}26`,
                    boxShadow: `0 0 24px ${ELEMENT_HEX[el]}55`,
                  }}
                >
                  <span className="han text-3xl" style={{ color: ELEMENT_HEX[el] }}>
                    {ELEMENT_GLYPH[el]}
                  </span>
                </div>
                <div className="mt-3 font-display text-xs uppercase tracking-[0.2em] opacity-80">
                  {el}
                </div>
                <div className="mt-1 font-display text-lg gold-text">{count}</div>
                <div
                  className="mx-auto mt-2 h-1 w-16 overflow-hidden rounded-full"
                  style={{ background: "var(--c-border)" }}
                >
                  <div
                    className="h-full"
                    style={{
                      width: `${(count / max) * 100}%`,
                      background: `linear-gradient(90deg, ${ELEMENT_HEX[el]}, var(--c-primary-soft))`,
                    }}
                  />
                </div>
              </div>
            ),
          )}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-sm border border-gold-300/20 bg-black/30 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-gold-200">
              Dominant
            </div>
            <div className="mt-2 font-display text-2xl gold-text">
              {result.fiveElements.dominant}
            </div>
          </div>
          <div className="rounded-sm border border-gold-300/20 bg-black/30 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-gold-200">
              Deficient
            </div>
            <div className="mt-2 font-display text-2xl gold-text">
              {result.fiveElements.deficient}
            </div>
          </div>
        </div>

        <p className="mt-6 leading-relaxed text-ink-100/85">
          {result.fiveElements.insight}
        </p>
      </div>

      {/* ZODIAC */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card-mystic">
          <span className="heading-display text-xs text-gold-200">
            Chinese Zodiac
          </span>
          <h3 className="mt-2 font-display text-2xl gold-text">
            {result.chineseZodiac.animal}
          </h3>
          <p className="mt-4 text-ink-100/85">{result.chineseZodiac.insight}</p>
        </div>

        <div className="card-mystic">
          <span className="heading-display text-xs text-gold-200">
            Western Zodiac
          </span>
          <h3 className="mt-2 font-display text-2xl gold-text">
            {result.westernZodiac.symbol} {result.westernZodiac.name}
          </h3>
          <p className="mt-4 text-ink-100/85">{result.westernZodiac.insight}</p>
        </div>
      </div>

      {/* FREE PORTRAIT */}
      <div className="card-mystic">
        <span className="heading-display text-xs text-gold-200">Free Insight</span>
        <h3 className="mt-2 font-display text-2xl gold-text">Your Inner Portrait</h3>
        <p className="mt-4 leading-relaxed text-ink-100/85">
          {result.free.personality}
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <div className="heading-display text-xs text-gold-200">Strengths</div>
            <ul className="mt-3 space-y-2 text-ink-100/85">
              {result.free.strengths.map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-gold-300" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="heading-display text-xs text-gold-200">Challenges</div>
            <ul className="mt-3 space-y-2 text-ink-100/85">
              {result.free.challenges.map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-crimson" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* PREMIUM LOCKED */}
      <div className="relative card-mystic overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black/90" />
        <div className="relative">
          <span className="heading-display text-xs text-gold-200">
            Premium Reading · Locked
          </span>
          <h3 className="mt-2 font-display text-3xl gold-text">
            The Full Depth of Your Destiny
          </h3>
          <p className="mt-4 leading-relaxed text-ink-100/80">{result.premium.teaser}</p>

          <div className="relative mt-8 grid gap-4 md:grid-cols-2">
            {result.premium.sections.map((sec) => (
              <div
                key={sec.title}
                className="relative rounded-sm border border-gold-300/30 bg-black/40 p-5"
              >
                <div className="font-display text-lg gold-text">{sec.title}</div>
                <p className="mt-3 line-clamp-2 text-sm text-ink-100/70 blur-[3px]">
                  {sec.preview}
                </p>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span className="rounded-full border border-gold-300/50 bg-black/60 px-4 py-1 text-[10px] uppercase tracking-[0.3em] text-gold-200">
                    🔒 Locked
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="relative mt-10 rounded-sm border border-gold-300/40 bg-black/50 p-6 text-center">
            <div className="font-display text-xl gold-text">
              Unlock the Full Reading on WhatsApp
            </div>
            <p className="mt-3 text-sm text-ink-100/80">
              Continue privately with one of our masters. Receive your full
              personalized destiny report — wealth, love, career, health and
              10-year luck cycle.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-6"
            >
              💬 Continue on WhatsApp
            </a>
            <p className="mt-3 text-xs text-ink-100/40">
              Or reach us on TikTok: @sunny31499
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
