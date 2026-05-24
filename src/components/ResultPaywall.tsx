"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { FiveElement } from "@/lib/divination";
import type { VendureProductSummary } from "@/lib/vendure";
import { formatMoney } from "@/lib/vendure";

interface PackageRecommendation {
  slug: string;
  name: string;
  badge: string;
  description: string;
  priceNow: number;
  priceWas: number | null;
  currencyCode: string;
  highlight?: boolean;
}

const FALLBACK_PACKAGES: PackageRecommendation[] = [
  {
    slug: "bazi-complete",
    name: "Complete BaZi Reading",
    badge: "Most Loved",
    description:
      "Full 10-year luck cycle, wealth windows, love palace and elemental remedies — written by a master.",
    priceNow: 199,
    priceWas: 269,
    currencyCode: "USD",
    highlight: true,
  },
  {
    slug: "wealth-bazi",
    name: "Wealth BaZi Consultation",
    badge: "Money Star",
    description:
      "Pinpoint the years your wealth star activates and the career direction aligned to your chart.",
    priceNow: 99,
    priceWas: 129,
    currencyCode: "USD",
  },
  {
    slug: "love-bazi",
    name: "Love & Relationship Reading",
    badge: "Spouse Palace",
    description:
      "Decode your spouse palace, your romance rhythm and the partner archetype that resonates.",
    priceNow: 99,
    priceWas: 129,
    currencyCode: "USD",
  },
];

const DAY_MASTER_LINES: Record<FiveElement, { title: string; body: string }> = {
  Wood: {
    title: "Your Wood Day Master craves expansion — but knows little of its own roots.",
    body: "The full reading uncovers when your career trunk will reach the canopy of fortune, and which seasons silently drain your sap.",
  },
  Fire: {
    title: "Your Fire Day Master burns brightly — yet without fuel, even the brightest flame falters.",
    body: "Discover the exact years your wealth flame ignites, the people who feed your fire, and the seasons of rest the cosmos demands.",
  },
  Earth: {
    title: "Your Earth Day Master is the keeper of foundations — but every mountain has hidden veins.",
    body: "The premium scroll names the hidden veins of metal & water your chart needs to thrive, and the year your patience pays.",
  },
  Metal: {
    title: "Your Metal Day Master is precise, unbending — and longing for warmth.",
    body: "We map the years that temper your blade, the relationships that polish you, and the wealth gate that opens before forty.",
  },
  Water: {
    title: "Your Water Day Master flows where others cannot reach — but a river without banks loses itself.",
    body: "The full reading draws the riverbed of your next decade: where to pool wealth, where to release stagnation, who walks the bridge with you.",
  },
};

interface Props {
  dayMaster: FiveElement;
  vendureProducts: VendureProductSummary[];
  whatsappUrl: string;
  whatsappMessage: string;
}

function pickRecommendations(
  remote: VendureProductSummary[],
): PackageRecommendation[] {
  if (remote.length === 0) return FALLBACK_PACKAGES;
  const top = remote.slice(0, 3);
  return top.map((p, i) => ({
    slug: p.slug,
    name: p.name,
    badge: p.collectionNames[0] ?? "Featured",
    description:
      p.description.replace(/<[^>]+>/g, "").slice(0, 160) ||
      "Personalised consultation written by a LingYun master.",
    priceNow: p.priceNow,
    priceWas: p.priceWas,
    currencyCode: p.currencyCode,
    highlight: i === 0,
  }));
}

const AUTO_OPEN_DELAY_MS = 5000;

export function ResultPaywall({
  dayMaster,
  vendureProducts,
  whatsappUrl,
  whatsappMessage,
}: Props) {
  const [open, setOpen] = useState(false);
  const [autoTriggered, setAutoTriggered] = useState(false);
  const triggeredRef = useRef(false);

  const recommendations = useMemo(
    () => pickRecommendations(vendureProducts),
    [vendureProducts],
  );
  const lines = DAY_MASTER_LINES[dayMaster] ?? DAY_MASTER_LINES.Wood;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (triggeredRef.current) return;

    const params = new URLSearchParams(window.location.search);
    if (params.get("paywall") === "now") {
      triggeredRef.current = true;
      console.info("[LingYun] Paywall force-opened via ?paywall=now");
      setOpen(true);
      setAutoTriggered(true);
      return;
    }

    console.info(
      `[LingYun] Paywall scheduled in ${AUTO_OPEN_DELAY_MS}ms (dayMaster=${dayMaster})`,
    );
    const timer = window.setTimeout(() => {
      if (triggeredRef.current) return;
      triggeredRef.current = true;
      setOpen(true);
      setAutoTriggered(true);
      console.info("[LingYun] Paywall auto-opened");
    }, AUTO_OPEN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [dayMaster]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <div
        className={`fixed inset-x-0 bottom-0 z-[60] px-3 pb-4 sm:px-6 ${
          open ? "pointer-events-none opacity-0" : "pointer-events-none"
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="pointer-events-auto mx-auto flex w-full max-w-3xl items-center justify-between gap-4 rounded-full border px-5 py-3 text-left shadow-xl backdrop-blur transition hover:scale-[1.01]"
          style={{
            borderColor: "var(--c-primary)",
            background:
              "linear-gradient(120deg, rgba(20,16,9,0.92), rgba(40,28,12,0.92))",
            color: "var(--c-text)",
            boxShadow: "0 14px 40px rgba(0,0,0,0.55), 0 0 24px var(--c-glow)",
          }}
        >
          <span className="flex items-center gap-3">
            <span
              className="han text-2xl"
              style={{
                color: "var(--c-primary-soft)",
                textShadow: "0 0 12px var(--c-glow)",
              }}
            >
              玄
            </span>
            <span className="flex flex-col leading-tight">
              <span
                className="text-[10px] uppercase tracking-[0.28em]"
                style={{ color: "var(--c-primary-soft)" }}
              >
                Premium Reading · Unlocked Privately
              </span>
              <span className="text-sm font-display">
                Continue with a LingYun master →
              </span>
            </span>
          </span>
          <span
            className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em]"
            style={{ background: "var(--c-primary)", color: "var(--c-bg)" }}
          >
            See Options
          </span>
        </button>
      </div>

      {open && (
        <div
          className="paywall-overlay fixed inset-0 z-[70] flex items-end justify-center sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="paywall-shell relative m-3 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl border p-6 sm:p-8"
            style={{
              borderColor: "var(--c-primary)",
              background:
                "linear-gradient(160deg, rgba(14,11,7,0.97), rgba(36,24,10,0.97))",
              boxShadow:
                "0 30px 80px rgba(0,0,0,0.7), 0 0 60px var(--c-glow)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-full border px-2.5 py-0.5 text-xs opacity-70 hover:opacity-100"
              style={{ borderColor: "var(--c-border)" }}
              aria-label="Close"
            >
              ✕
            </button>

            <div className="paywall-bagua pointer-events-none absolute -right-20 -top-20 h-72 w-72 opacity-20" />

            <div className="relative">
              <div
                className="text-[10px] uppercase tracking-[0.32em]"
                style={{ color: "var(--c-primary-soft)" }}
              >
                {autoTriggered ? "Cosmic Timing · 8 seconds in" : "Private Counsel"}
              </div>
              <h2 className="mt-2 font-display text-2xl leading-tight gold-text sm:text-3xl">
                {lines.title}
              </h2>
              <div className="divider-gold mx-0 mt-4" />
              <p
                className="mt-5 text-sm leading-relaxed sm:text-base"
                style={{ color: "var(--c-text-soft)" }}
              >
                {lines.body}
              </p>
            </div>

            <ul className="relative mt-7 grid gap-3 sm:grid-cols-3">
              {recommendations.map((pkg) => {
                const discount =
                  pkg.priceWas && pkg.priceWas > pkg.priceNow
                    ? Math.round(((pkg.priceWas - pkg.priceNow) / pkg.priceWas) * 100)
                    : 0;
                return (
                  <li
                    key={pkg.slug}
                    className="relative flex flex-col rounded-lg border p-4 transition hover:-translate-y-0.5"
                    style={{
                      borderColor: pkg.highlight
                        ? "var(--c-primary)"
                        : "var(--c-border)",
                      background: pkg.highlight
                        ? "rgba(201,162,51,0.10)"
                        : "rgba(0,0,0,0.25)",
                      boxShadow: pkg.highlight
                        ? "0 0 28px var(--c-glow)"
                        : undefined,
                    }}
                  >
                    {pkg.highlight && (
                      <span
                        className="absolute -top-2 left-4 rounded-full px-2 py-0.5 text-[9px] uppercase tracking-[0.25em]"
                        style={{
                          background: "var(--c-primary)",
                          color: "var(--c-bg)",
                        }}
                      >
                        Master&apos;s Pick
                      </span>
                    )}
                    <div
                      className="text-[10px] uppercase tracking-[0.2em]"
                      style={{ color: "var(--c-primary-soft)" }}
                    >
                      {pkg.badge}
                    </div>
                    <div className="mt-1 font-display text-base leading-tight">
                      {pkg.name}
                    </div>
                    <p
                      className="mt-2 line-clamp-3 text-xs leading-relaxed"
                      style={{ color: "var(--c-text-soft)" }}
                    >
                      {pkg.description}
                    </p>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="font-display text-xl gold-text">
                        {formatMoney(pkg.priceNow, pkg.currencyCode)}
                      </span>
                      {pkg.priceWas && pkg.priceWas > pkg.priceNow && (
                        <span className="text-[11px] line-through opacity-60">
                          {formatMoney(pkg.priceWas, pkg.currencyCode)}
                        </span>
                      )}
                      {discount > 0 && (
                        <span
                          className="rounded-sm px-1.5 py-0.5 text-[9px] uppercase tracking-[0.15em]"
                          style={{
                            background: "var(--c-accent)",
                            color: "var(--c-text)",
                          }}
                        >
                          -{discount}%
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/shop/${pkg.slug}`}
                      className="btn-ghost mt-4 !py-2 text-[10px]"
                      onClick={() => setOpen(false)}
                    >
                      View Details →
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div
              className="relative mt-7 rounded-lg border p-5 text-center"
              style={{
                borderColor: "var(--c-primary)",
                background: "rgba(0,0,0,0.35)",
              }}
            >
              <div className="font-display text-lg gold-text">
                Or talk to a master right now, privately on WhatsApp.
              </div>
              <p
                className="mx-auto mt-2 max-w-md text-xs"
                style={{ color: "var(--c-text-soft)" }}
              >
                Send your chart, ask one question, and decide afterwards. Every
                conversation is hand-replied within 24 hours.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-4 inline-flex items-center gap-2"
              >
                💬 Continue on WhatsApp
              </a>
              <p
                className="mt-3 text-[10px] uppercase tracking-[0.3em]"
                style={{ color: "var(--c-text-soft)" }}
              >
                Pre-filled: “{whatsappMessage.slice(0, 70)}…”
              </p>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-5 block w-full text-center text-[11px] uppercase tracking-[0.3em] opacity-60 hover:opacity-100"
            >
              Not now — keep reading my chart
            </button>
          </div>
        </div>
      )}
    </>
  );
}
