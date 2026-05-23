export function AnnouncementBar() {
  const items = [
    "🪷  Free reading available — Discover your Four Pillars in 60 seconds",
    "✨  2026 Tai Sui guidance now open — Limited consultations this month",
    "📜  Zhengyi Jiulong Orthodox Lineage · Authentic Taoist masters",
    "🔮  Personal destiny report — Wealth · Love · Career · Health",
    "📿  Private WhatsApp consultation — Discreet and confidential",
  ];
  const loop = [...items, ...items];

  return (
    <div
      className="relative overflow-hidden border-b text-[11px] uppercase tracking-[0.25em]"
      style={{
        background: "var(--c-bg-soft)",
        borderColor: "var(--c-border)",
        color: "var(--c-primary-soft)",
      }}
    >
      <div className="marquee py-2">
        {loop.map((it, i) => (
          <span key={i} className="inline-flex items-center gap-3">
            {it}
            <span className="opacity-30">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
