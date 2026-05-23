export interface ThemeTokens {
  bg: string;
  bgSoft: string;
  surface: string;
  text: string;
  textSoft: string;
  muted: string;
  primary: string;
  primarySoft: string;
  primaryDeep: string;
  accent: string;
  accentSoft: string;
  border: string;
  borderStrong: string;
  glow: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  nameCN: string;
  description: string;
  tokens: ThemeTokens;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "obsidian-gold",
    name: "Obsidian Gold",
    nameCN: "玄金",
    description: "Default. Deep void black with imperial gold — classic Taoist temple feel.",
    tokens: {
      bg: "#0a0603",
      bgSoft: "#140d05",
      surface: "rgba(0, 0, 0, 0.4)",
      text: "#f6f1e7",
      textSoft: "rgba(246, 241, 231, 0.75)",
      muted: "rgba(246, 241, 231, 0.45)",
      primary: "#c9a233",
      primarySoft: "#e0bf5b",
      primaryDeep: "#7d5a10",
      accent: "#8b1a1a",
      accentSoft: "#c0392b",
      border: "rgba(201, 162, 51, 0.25)",
      borderStrong: "rgba(201, 162, 51, 0.55)",
      glow: "rgba(201, 162, 51, 0.25)",
    },
  },
  {
    id: "vermilion-night",
    name: "Vermilion Night",
    nameCN: "朱砂夜",
    description: "Lacquer black with vermilion red — feels like a Forbidden City night.",
    tokens: {
      bg: "#0d0506",
      bgSoft: "#1a0a0d",
      surface: "rgba(0, 0, 0, 0.45)",
      text: "#f7e9d8",
      textSoft: "rgba(247, 233, 216, 0.78)",
      muted: "rgba(247, 233, 216, 0.45)",
      primary: "#b91c1c",
      primarySoft: "#ef4444",
      primaryDeep: "#7f1d1d",
      accent: "#d4af37",
      accentSoft: "#fbbf24",
      border: "rgba(185, 28, 28, 0.35)",
      borderStrong: "rgba(239, 68, 68, 0.6)",
      glow: "rgba(185, 28, 28, 0.3)",
    },
  },
  {
    id: "jade-mist",
    name: "Jade Mist",
    nameCN: "翠雾",
    description: "Misty mountain green with bronze hints — flowing Qi of the southern peaks.",
    tokens: {
      bg: "#06120e",
      bgSoft: "#0a1d16",
      surface: "rgba(0, 0, 0, 0.4)",
      text: "#e8f0e6",
      textSoft: "rgba(232, 240, 230, 0.78)",
      muted: "rgba(232, 240, 230, 0.45)",
      primary: "#3fa17a",
      primarySoft: "#6dd5a8",
      primaryDeep: "#1f6b50",
      accent: "#b8860b",
      accentSoft: "#d4af37",
      border: "rgba(63, 161, 122, 0.3)",
      borderStrong: "rgba(109, 213, 168, 0.55)",
      glow: "rgba(63, 161, 122, 0.28)",
    },
  },
  {
    id: "celestial-indigo",
    name: "Celestial Indigo",
    nameCN: "天青",
    description: "Deep cosmos indigo with silver moonlight — for star-gazing seekers.",
    tokens: {
      bg: "#070914",
      bgSoft: "#0d1126",
      surface: "rgba(0, 0, 0, 0.4)",
      text: "#e8ecf7",
      textSoft: "rgba(232, 236, 247, 0.78)",
      muted: "rgba(232, 236, 247, 0.45)",
      primary: "#6366f1",
      primarySoft: "#a5b4fc",
      primaryDeep: "#3730a3",
      accent: "#d4af37",
      accentSoft: "#fbbf24",
      border: "rgba(99, 102, 241, 0.3)",
      borderStrong: "rgba(165, 180, 252, 0.55)",
      glow: "rgba(99, 102, 241, 0.28)",
    },
  },
  {
    id: "rice-paper",
    name: "Rice Paper",
    nameCN: "宣纸",
    description: "Warm rice-paper cream with ink black — quiet scholar's study.",
    tokens: {
      bg: "#f4ecd8",
      bgSoft: "#ebe0c4",
      surface: "rgba(255, 252, 240, 0.6)",
      text: "#1a1208",
      textSoft: "rgba(26, 18, 8, 0.75)",
      muted: "rgba(26, 18, 8, 0.45)",
      primary: "#8b1a1a",
      primarySoft: "#b91c1c",
      primaryDeep: "#5e0e0e",
      accent: "#c9a233",
      accentSoft: "#e0bf5b",
      border: "rgba(26, 18, 8, 0.2)",
      borderStrong: "rgba(139, 26, 26, 0.5)",
      glow: "rgba(139, 26, 26, 0.18)",
    },
  },
  {
    id: "twilight-rose",
    name: "Twilight Rose",
    nameCN: "暮霞",
    description: "Sunset purple-rose with golden glow — celestial dusk over the temple.",
    tokens: {
      bg: "#150a18",
      bgSoft: "#22102a",
      surface: "rgba(0, 0, 0, 0.4)",
      text: "#f7e9f0",
      textSoft: "rgba(247, 233, 240, 0.78)",
      muted: "rgba(247, 233, 240, 0.45)",
      primary: "#d946ef",
      primarySoft: "#f0abfc",
      primaryDeep: "#86198f",
      accent: "#f5b942",
      accentSoft: "#fcd34d",
      border: "rgba(217, 70, 239, 0.3)",
      borderStrong: "rgba(240, 171, 252, 0.55)",
      glow: "rgba(217, 70, 239, 0.25)",
    },
  },
];

export const TOKEN_KEYS: { key: keyof ThemeTokens; label: string; type: "color" | "rgba" }[] = [
  { key: "bg",            label: "Background",         type: "color" },
  { key: "bgSoft",        label: "Background Soft",    type: "color" },
  { key: "text",          label: "Text",               type: "color" },
  { key: "textSoft",      label: "Text Soft",          type: "rgba"  },
  { key: "primary",       label: "Primary",            type: "color" },
  { key: "primarySoft",   label: "Primary Soft",       type: "color" },
  { key: "primaryDeep",   label: "Primary Deep",       type: "color" },
  { key: "accent",        label: "Accent",             type: "color" },
  { key: "border",        label: "Border",             type: "rgba"  },
  { key: "glow",          label: "Glow",               type: "rgba"  },
];

export const CSS_VAR_MAP: Record<keyof ThemeTokens, string> = {
  bg: "--c-bg",
  bgSoft: "--c-bg-soft",
  surface: "--c-surface",
  text: "--c-text",
  textSoft: "--c-text-soft",
  muted: "--c-muted",
  primary: "--c-primary",
  primarySoft: "--c-primary-soft",
  primaryDeep: "--c-primary-deep",
  accent: "--c-accent",
  accentSoft: "--c-accent-soft",
  border: "--c-border",
  borderStrong: "--c-border-strong",
  glow: "--c-glow",
};

export function applyTheme(tokens: ThemeTokens) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  (Object.keys(tokens) as (keyof ThemeTokens)[]).forEach((k) => {
    root.style.setProperty(CSS_VAR_MAP[k], tokens[k]);
  });
}
