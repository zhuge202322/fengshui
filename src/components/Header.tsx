"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const nav = [
  { href: "/", label: "Home" },
  { href: "/divination", label: "Divination" },
  { href: "/shop", label: "Shop" },
  { href: "/blog", label: "Journal" },
  { href: "/about", label: "Lineage" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-30 border-b backdrop-blur-xl transition-all"
      style={{
        background: scrolled ? "rgba(0,0,0,0.7)" : "var(--c-surface)",
        borderColor: "var(--c-border)",
      }}
    >
      <div className="container-page flex h-20 items-center justify-between">
        <Link href="/" className="group flex items-center gap-3">
          <span
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border"
            style={{
              background: "var(--c-bg-soft)",
              borderColor: "var(--c-border-strong)",
              boxShadow: "0 0 20px var(--c-glow)",
            }}
          >
            <span className="absolute inset-1 rounded-full bagua animate-spinSlow" />
            <span className="relative han text-xl" style={{ color: "var(--c-primary-soft)" }}>
              靈
            </span>
          </span>
          <span className="flex flex-col leading-tight">
            <span className="heading-display text-[11px]" style={{ color: "var(--c-primary-soft)" }}>
              LingYun
            </span>
            <span className="font-display text-sm tracking-[0.35em]">
              FENG · SHUI
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="heading-display text-[11px] transition hover:opacity-100"
              style={{ color: "var(--c-text-soft)" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/divination" className="btn-ghost">
            Free Reading
          </Link>
          <a
            href={process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://wa.me/"}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Consult Now
          </a>
        </div>

        {/* Mobile */}
        <button
          type="button"
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className="block h-0.5 w-6" style={{ background: "var(--c-primary-soft)" }} />
          <span className="mt-1.5 block h-0.5 w-6" style={{ background: "var(--c-primary-soft)" }} />
          <span className="mt-1.5 block h-0.5 w-6" style={{ background: "var(--c-primary-soft)" }} />
        </button>
      </div>

      {open && (
        <div
          className="border-t md:hidden"
          style={{ background: "var(--c-bg-soft)", borderColor: "var(--c-border)" }}
        >
          <nav className="container-page flex flex-col gap-3 py-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="heading-display text-xs"
                style={{ color: "var(--c-text-soft)" }}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/divination" onClick={() => setOpen(false)} className="btn-primary mt-2 w-full">
              Free Reading
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
