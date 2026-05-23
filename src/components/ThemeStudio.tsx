"use client";

import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { TOKEN_KEYS, type ThemeTokens } from "@/lib/theme";

function rgbaToHex(value: string): string {
  if (value.startsWith("#")) return value;
  const match = value.match(/rgba?\(([^)]+)\)/i);
  if (!match) return "#000000";
  const parts = match[1].split(",").map((s) => parseFloat(s.trim()));
  const [r, g, b] = parts;
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbaAlpha(value: string): number {
  const match = value.match(/rgba\(([^)]+)\)/i);
  if (!match) return 1;
  const parts = match[1].split(",").map((s) => parseFloat(s.trim()));
  return parts[3] ?? 1;
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function ThemeStudio() {
  const { presetId, tokens, presets, setPreset, updateToken, reset } = useTheme();
  const [open, setOpen] = useState(false);

  function handleColorChange(key: keyof ThemeTokens, hex: string) {
    const current = tokens[key];
    if (current.startsWith("rgba")) {
      const a = rgbaAlpha(current);
      updateToken(key, hexToRgba(hex, a));
    } else {
      updateToken(key, hex);
    }
  }

  function handleAlphaChange(key: keyof ThemeTokens, alpha: number) {
    const current = tokens[key];
    const hex = rgbaToHex(current);
    updateToken(key, hexToRgba(hex, alpha));
  }

  return (
    <>
      {/* Floating toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border animate-glowPulse"
        style={{
          background: "var(--c-surface)",
          borderColor: "var(--c-border-strong)",
          color: "var(--c-primary-soft)",
        }}
        aria-label="Theme Studio"
        title="Theme Studio"
      >
        <span className="han text-2xl">色</span>
      </button>

      {/* Panel */}
      <aside
        className={`fixed bottom-24 right-6 z-50 w-[340px] max-w-[92vw] origin-bottom-right rounded-md border p-5 shadow-2xl backdrop-blur-xl transition ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
        style={{
          background: "var(--c-bg-soft)",
          borderColor: "var(--c-border-strong)",
          maxHeight: "75vh",
          overflowY: "auto",
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="section-eyebrow">Theme Studio</div>
            <div className="mt-1 font-display text-lg gold-text">調色 · Tune Your Aura</div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-lg opacity-60 hover:opacity-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Presets */}
        <div className="mt-5">
          <div className="label-mystic">Presets</div>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPreset(p.id)}
                className={`group flex items-center gap-2 rounded-sm border p-2 text-left transition ${
                  presetId === p.id ? "ring-1" : ""
                }`}
                style={{
                  borderColor: presetId === p.id ? p.tokens.primary : "var(--c-border)",
                  background: p.tokens.bg,
                  color: p.tokens.text,
                }}
                title={p.description}
              >
                <span
                  className="h-6 w-6 shrink-0 rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${p.tokens.primary}, ${p.tokens.accent})`,
                    boxShadow: `0 0 12px ${p.tokens.glow}`,
                  }}
                />
                <span className="flex flex-col text-[10px] leading-tight">
                  <span className="font-display uppercase tracking-[0.18em]">
                    {p.name}
                  </span>
                  <span className="han text-xs opacity-80">{p.nameCN}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Token editor */}
        <div className="mt-6">
          <div className="label-mystic">Fine Tune</div>
          <div className="space-y-2.5">
            {TOKEN_KEYS.map(({ key, label, type }) => {
              const value = tokens[key];
              const hex = rgbaToHex(value);
              const alpha = type === "rgba" ? rgbaAlpha(value) : 1;
              return (
                <div key={key} className="flex items-center gap-3">
                  <label className="w-28 shrink-0 text-[11px] uppercase tracking-[0.15em] opacity-80">
                    {label}
                  </label>
                  <input
                    type="color"
                    value={hex}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="h-7 w-10 cursor-pointer rounded border-0 bg-transparent"
                    aria-label={`${label} color`}
                  />
                  {type === "rgba" ? (
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={alpha}
                      onChange={(e) => handleAlphaChange(key, parseFloat(e.target.value))}
                      className="flex-1 accent-current"
                      aria-label={`${label} alpha`}
                    />
                  ) : (
                    <code className="flex-1 truncate text-[10px] opacity-60">
                      {hex}
                    </code>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={reset}
            className="flex-1 rounded-sm border px-3 py-2 text-[11px] uppercase tracking-[0.2em] transition hover:opacity-80"
            style={{ borderColor: "var(--c-border)" }}
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => {
              const text = JSON.stringify(tokens, null, 2);
              navigator.clipboard?.writeText(text);
            }}
            className="flex-1 rounded-sm border px-3 py-2 text-[11px] uppercase tracking-[0.2em] transition hover:opacity-80"
            style={{ borderColor: "var(--c-border)" }}
          >
            Copy JSON
          </button>
        </div>

        <p className="mt-4 text-[10px] leading-relaxed opacity-50">
          Adjust the palette to find the most resonant tone for your site.
          Saved locally — refresh-safe.
        </p>
      </aside>
    </>
  );
}
