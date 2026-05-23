import Link from "next/link";

export default function AboutPage() {
  return (
    <section className="relative py-20">
      <div className="container-page max-w-4xl">
        <div className="text-center">
          <span className="heading-display text-xs text-gold-200">About Us</span>
          <h1 className="mt-4 font-display text-4xl uppercase tracking-[0.18em] md:text-5xl">
            <span className="gold-text">LingYun FengShui</span>
          </h1>
          <div className="divider-gold mt-6" />
        </div>

        <article className="mt-14 space-y-6 text-lg leading-relaxed text-ink-100/90">
          <p>
            LingYun FengShui is a direct disciple-house of the{" "}
            <em>Zhengyi Jiulong School</em> — an orthodox Taoist lineage rooted
            in centuries of Chinese metaphysical practice. We offer Feng Shui
            consultations, BaZi (Four Pillars of Destiny) readings, and Five
            Elements analysis to help seekers understand the architecture of
            their lives, refine their fortune, and walk in alignment with the
            Tao.
          </p>
          <p>
            We believe in the quiet power of energy in motion — that a person&apos;s
            destiny is woven from the dance between their inner constitution
            and the elemental currents of their environment. When these forces
            move in harmony, vitality rises: health, prosperity, love, career
            and inner peace flow naturally.
          </p>
          <p>
            Whether you seek to refine your personal path, illuminate your
            relationships, accelerate your career, or rebalance the Qi of your
            home or business, our masters bring authentic lineage practice to
            guide you. Awaken your blueprint. Activate your potential.
          </p>
        </article>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <div className="card-mystic">
            <div className="heading-display text-xs text-gold-200">Address</div>
            <p className="mt-3 text-ink-100/85">
              Rm 3106-3107, Bldg 1, No.188 N. Renmin Rd Sec.2,
              <br /> Jinniu District, Chengdu, Sichuan, China
            </p>
          </div>
          <div className="card-mystic">
            <div className="heading-display text-xs text-gold-200">Contact</div>
            <p className="mt-3 text-ink-100/85">
              WhatsApp · private consultation
              <br /> TikTok: @sunny31499
            </p>
          </div>
        </div>

        <div className="mt-14 text-center">
          <Link href="/divination" className="btn-primary">
            Receive Your Reading
          </Link>
        </div>
      </div>
    </section>
  );
}
