export function FaqSection() {
  const faqs = [
    {
      q: "What information do you need for a BaZi reading?",
      a: "Your year, month, day, and hour of birth — ideally with the city of birth. The more precise the time, the more accurate the chart.",
    },
    {
      q: "Is the free reading really free?",
      a: "Yes. The free portion gives you a true portrait of your elemental nature and core fortune. Deeper personalized guidance is offered through paid consultation.",
    },
    {
      q: "How do I pay and receive my full reading?",
      a: "Payment and consultation happen privately on WhatsApp. After confirmation, your master will personally deliver your report and answer questions.",
    },
    {
      q: "Is my information confidential?",
      a: "Absolutely. Your data is used only for your reading. We never share, sell, or store it beyond what is needed to serve you.",
    },
    {
      q: "Can I get a reading for my child or partner?",
      a: "Yes — many clients request readings for loved ones. Simply provide their birth coordinates with their permission.",
    },
    {
      q: "Do you offer in-person Feng Shui consultation?",
      a: "Yes, in select regions. Please reach out on WhatsApp to discuss availability and travel.",
    },
  ];

  return (
    <section className="relative py-28">
      <div className="container-page max-w-4xl">
        <div className="text-center">
          <span className="section-eyebrow">Frequently Asked</span>
          <h2 className="mt-3 section-title">
            <span className="gold-text">Questions of Seekers</span>
          </h2>
          <div className="divider-gold mt-5" />
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => (
            <details
              key={f.q}
              className="group card-mystic !p-0 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-start gap-4 p-5 transition">
                <span
                  className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-display text-xs"
                  style={{
                    borderColor: "var(--c-border-strong)",
                    color: "var(--c-primary-soft)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-display text-base leading-snug">
                  {f.q}
                </span>
                <span
                  className="text-xl opacity-60 transition group-open:rotate-45"
                  style={{ color: "var(--c-primary-soft)" }}
                >
                  +
                </span>
              </summary>
              <div
                className="border-t px-5 pb-5 pt-4 text-sm leading-relaxed"
                style={{ borderColor: "var(--c-border)", color: "var(--c-text-soft)" }}
              >
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
