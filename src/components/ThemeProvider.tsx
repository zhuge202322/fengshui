"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  THEME_PRESETS,
  applyTheme,
  type ThemePreset,
  type ThemeTokens,
} from "@/lib/theme";

interface ThemeContextValue {
  presetId: string;
  tokens: ThemeTokens;
  setPreset: (id: string) => void;
  updateToken: (key: keyof ThemeTokens, value: string) => void;
  reset: () => void;
  presets: ThemePreset[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "lingyun-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [presetId, setPresetId] = useState<string>(THEME_PRESETS[0].id);
  const [tokens, setTokens] = useState<ThemeTokens>(THEME_PRESETS[0].tokens);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { presetId: string; tokens: ThemeTokens };
        if (parsed.presetId && parsed.tokens) {
          setPresetId(parsed.presetId);
          setTokens(parsed.tokens);
          applyTheme(parsed.tokens);
          return;
        }
      }
    } catch {
      /* noop */
    }
    applyTheme(THEME_PRESETS[0].tokens);
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ presetId, tokens }),
      );
    } catch {
      /* noop */
    }
  }, [presetId, tokens]);

  const setPreset = useCallback((id: string) => {
    const preset = THEME_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setPresetId(id);
    setTokens(preset.tokens);
    applyTheme(preset.tokens);
  }, []);

  const updateToken = useCallback(
    (key: keyof ThemeTokens, value: string) => {
      setTokens((prev) => {
        const next = { ...prev, [key]: value };
        applyTheme(next);
        return next;
      });
      setPresetId("custom");
    },
    [],
  );

  const reset = useCallback(() => {
    setPreset(THEME_PRESETS[0].id);
  }, [setPreset]);

  const value = useMemo<ThemeContextValue>(
    () => ({ presetId, tokens, setPreset, updateToken, reset, presets: THEME_PRESETS }),
    [presetId, tokens, setPreset, updateToken, reset],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
