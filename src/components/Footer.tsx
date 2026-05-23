import Link from "next/link";

export function Footer() {
  const cols = [
    {
      title: "Divination",
      items: [
        { label: "Free Reading", href: "/divination" },
        { label: "BaZi Four Pillars", href: "/divination" },
        { label: "Five Elements", href: "/divination" },
        { label: "Zodiac Fortune", href: "/divination" },
      ],
    },
    {
      title: "Services",
      items: [
        { label: "Wealth Consultation", href: "/shop" },
        { label: "Love & Relationship", href: "/shop" },
        { label: "Career Guidance", href: "/shop" },
        { label: "Home Feng Shui", href: "/shop" },
      ],
    },
    {
      title: "Knowledge",
      items: [
        { label: "Journal", href: "/blog" },
        { label: "About Lineage", href: "/about" },
        { label: "FAQ", href: "/about" },
        { label: "Testimonials", href: "/" },
      ],
    },
  ];

  return (
    <footer
      className="relative mt-32 border-t"
      style={{ background: "var(--c-bg-soft)", borderColor: "var(--c-border)" }}
    >
      <div className="pointer-events-none absolute inset-x-0 -top-20 mx-auto h-40 w-40 opacity-30">
        <div className="bagua absolute inset-0 rounded-full animate-spinSlow" />
      </div>

      <div className="container-page grid gap-12 py-20 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <span
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border"
              style={{ borderColor: "var(--c-border-strong)" }}
            >
              <span className="han text-xl" style={{ color: "var(--c-primary-soft)" }}>靈</span>
            </span>
            <div>
              <div className="heading-display text-sm gold-text">LingYun FengShui</div>
              <div className="text-[11px] opacity-60">道法自然 · The Tao follows Nature</div>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-relaxed" style={{ color: "var(--c-text-soft)" }}>
            Authentic lineage of the Zhengyi Jiulong Orthodox School. Bridging
            ancient Chinese metaphysics with the modern seeker — through BaZi,
            Five Elements, and personalized Feng Shui guidance.
          </p>
          <div className="mt-6 flex gap-3">
            {["WhatsApp", "TikTok", "Instagram", "Email"].map((s) => (
              <a
                key={s}
                href="#"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border text-[10px] uppercase tracking-[0.15em] transition hover:opacity-100"
                style={{ borderColor: "var(--c-border)", color: "var(--c-primary-soft)" }}
                aria-label={s}
              >
                {s.slice(0, 2)}
              </a>
            ))}
          </div>
        </div>

        {cols.map((col) => (
          <div key={col.title}>
            <div className="heading-display text-[11px]" style={{ color: "var(--c-primary-soft)" }}>
              {col.title}
            </div>
            <ul className="mt-4 space-y-2.5 text-sm" style={{ color: "var(--c-text-soft)" }}>
              {col.items.map((it) => (
                <li key={it.label}>
                  <Link href={it.href} className="transition hover:opacity-100" style={{ opacity: 0.8 }}>
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        className="border-t py-5 text-center text-xs opacity-60"
        style={{ borderColor: "var(--c-border)" }}
      >
        <div>
          © {new Date().getFullYear()} LingYun FengShui · All rights reserved.
        </div>
        <div className="mt-1">
          Rm 3106-3107, Bldg 1, No.188 N. Renmin Rd Sec.2, Jinniu District, Chengdu, Sichuan, China
        </div>
      </div>
    </footer>
  );
}
