import Link from "next/link";

export function CtaBanner() {
  return (
    <section className="relative py-20">
      <div className="container-page">
        <div
          className="relative overflow-hidden rounded-md border p-12 text-center md:p-20"
          style={{
            background:
              "radial-gradient(ellipse at top, var(--c-glow), transparent 60%), var(--c-bg-soft)",
            borderColor: "var(--c-border-strong)",
            boxShadow: "0 0 60px var(--c-glow)",
          }}
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bagua opacity-10 animate-spinSlow" />

          <div className="relative">
            <span className="pill">Limited Slots · This Month</span>
            <h2 className="mt-6 font-display text-4xl uppercase leading-tight tracking-[0.14em] md:text-6xl">
              <span className="gold-text">Your Destiny Awaits</span>
            </h2>
            <p
              className="mx-auto mt-6 max-w-2xl text-lg"
              style={{ color: "var(--c-text-soft)" }}
            >
              The cosmos has already written your name. We simply help you read
              it — and walk it with grace.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/divination" className="btn-primary">
                Begin Your Free Reading
              </Link>
              <a
                href={process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://wa.me/"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                💬 Private Consultation
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
