const STEPS = [
  {
    number: "01",
    emoji: "📝",
    title: "Produkt beschreiben",
    desc: "Füll das Anfrage-Formular aus oder schreib uns direkt — was hast du, in welchem Zustand? Gerne auch mit Foto.",
    note: null,
  },
  {
    number: "02",
    emoji: "📷",
    title: "Fotos hochladen",
    desc: "Zeig uns den Zustand per Bild. Je genauer das Foto, desto präziser unser Angebot.",
    note: null,
  },
  {
    number: "03",
    emoji: "💶",
    title: "Angebot & Auszahlung",
    desc: "Wir melden uns innerhalb von 24h mit einem fairen Preisangebot. Du nimmst an → Versandlabel → Geld in 48h.",
    note: null,
  },
] as const;

export function AnkaufProcess() {
  return (
    <section className="py-20 sm:py-28 bg-background scroll-fade relative overflow-hidden">
      <div
        className="absolute -left-40 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,107,53,0.06), transparent 65%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-accent-orange mb-3">
            Der Ablauf
          </p>
          <h2
            className="font-sans font-bold text-text-primary"
            style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)" }}
          >
            In 3 Schritten zu Geld
          </h2>
          <p className="font-sans text-sm text-text-secondary mt-2">
            Einfach, schnell, unverbindlich.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="flex flex-col gap-5 p-7 border border-border bg-surface hover:border-accent-orange hover:shadow-[0_4px_20px_rgba(255,107,53,0.08)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center bg-accent-orange flex-shrink-0">
                  <span className="font-pixel text-background" style={{ fontSize: "0.5rem" }}>
                    {step.number}
                  </span>
                </div>
                <span className="text-2xl" aria-hidden="true">
                  {step.emoji}
                </span>
              </div>
              <div>
                <h3 className="font-sans font-semibold text-text-primary text-base mb-2">
                  {step.title}
                </h3>
                <p className="font-sans text-sm text-text-secondary leading-relaxed">
                  {step.desc}
                </p>
                {step.note && (
                  <span className="inline-flex mt-3 font-sans text-[10px] font-semibold bg-surface-hover border border-border text-text-secondary px-2 py-1 uppercase tracking-wide">
                    {step.note}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
