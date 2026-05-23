"use client";

import Link from "next/link";
import { useRef } from "react";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden hero-vignette">
      {/* Background video (auto-fallback to image if not available) */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster="/hero/hero-poster.svg"
      >
        <source src="/hero/hero-mountain.mp4" type="video/mp4" />
      </video>

      {/* Decorative overlays */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[88vmin] w-[88vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bagua opacity-15 blur-sm animate-spinSlow" />
        <div
          className="absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{ borderColor: "var(--c-border)" }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-[44vmin] w-[44vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{ borderColor: "var(--c-border-strong)", boxShadow: "0 0 80px var(--c-glow)" }}
        />
      </div>

      {/* Lanterns */}
      <div className="pointer-events-none absolute left-[6%] top-[14%] hidden md:block">
        <Lantern />
      </div>
      <div className="pointer-events-none absolute right-[6%] top-[14%] hidden md:block">
        <Lantern delay="-1.5s" />
      </div>

      {/* Content */}
      <div className="container-page relative z-10 flex h-full flex-col items-center justify-center text-center">
        <span className="pill">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--c-primary-soft)" }} />
          Zhengyi · Jiulong Orthodox Lineage
        </span>

        <h1 className="mt-8 max-w-5xl font-display uppercase leading-[1.05] tracking-[0.1em]">
          <span className="block text-2xl opacity-80 md:text-3xl">An Ancient Path</span>
          <span className="mt-3 block text-5xl gold-text md:text-7xl lg:text-8xl">
            Decode Your Destiny
          </span>
          <span
            className="mt-4 block han text-3xl tracking-[0.3em] opacity-90 md:text-4xl"
            style={{ color: "var(--c-primary-soft)" }}
          >
            觀 命 · 改 運 · 順 勢
          </span>
        </h1>

        <p
          className="mt-8 max-w-2xl text-lg leading-relaxed md:text-xl"
          style={{ color: "var(--c-text-soft)" }}
        >
          Through <em>BaZi</em> Four Pillars, Five Elements, and celestial Zodiac —
          unveil the hidden current of your fortune and walk in alignment with the Tao.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link href="/divination" className="btn-primary">
            ✨ Get Your Free Reading
          </Link>
          <a
            href={process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://wa.me/"}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            💬 Speak to a Master
          </a>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <span
            className="h-10 w-px"
            style={{ background: "linear-gradient(180deg, var(--c-primary-soft), transparent)" }}
          />
        </div>
      </div>
    </section>
  );
}

function Lantern({ delay = "0s" }: { delay?: string }) {
  return (
    <div className="animate-lanternSway" style={{ animationDelay: delay }}>
      <div
        className="h-px w-px"
        style={{ boxShadow: "0 0 0 0 transparent" }}
      />
      <div
        className="relative mx-auto h-1 w-px"
        style={{ background: "var(--c-border)" }}
      />
      <div
        className="relative h-16 w-12 rounded-full"
        style={{
          background: "radial-gradient(circle at 50% 40%, var(--c-accent-soft), var(--c-accent) 60%, var(--c-primary-deep))",
          boxShadow: "0 0 30px var(--c-glow), inset 0 0 20px rgba(0,0,0,0.4)",
          border: "1px solid var(--c-border-strong)",
        }}
      >
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 han text-base"
          style={{ color: "var(--c-bg)" }}
        >
          靈
        </div>
      </div>
      <div className="mx-auto h-3 w-2" style={{ background: "var(--c-primary-soft)" }} />
      <div className="mx-auto h-4 w-px" style={{ background: "var(--c-primary)" }} />
    </div>
  );
}
