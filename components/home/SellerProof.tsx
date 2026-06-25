const SELLER_STATS = [
  { value: "4,9/5", label: "Bewertung" },
  { value: "2.400+", label: "Faire Ankäufe" },
  { value: "24 h", label: "Antwortzeit" },
  { value: "0 €", label: "Versand n. Freigabe" },
] as const;

const SELLER_REVIEWS = [
  {
    text: "Mein ganzer Dachboden voller SNES-Sachen - fair bewertet und super schnell abgewickelt.",
    name: "Tobias R.",
  },
  {
    text: "Endlich ein Laden, der Retro wirklich versteht. Top Kommunikation.",
    name: "Jasmin W.",
  },
  {
    text: "Versandlabel kam sofort, Geld zwei Tage später auf dem Konto. Mega.",
    name: "Daniel H.",
  },
  {
    text: "Nicht das übliche Feilschen. Transparent, freundlich und sehr unkompliziert.",
    name: "Sabrina T.",
  },
  {
    text: "Schnelle Antwort, fairer Preis und die Auszahlung war direkt da.",
    name: "Marcel K.",
  },
  {
    text: "Ich hatte keine Ahnung, was meine Sachen wert sind. RetrOase hat alles erklärt.",
    name: "Lea M.",
  },
] as const;

export function SellerProof() {
  const reviewLoop = [...SELLER_REVIEWS, ...SELLER_REVIEWS];

  return (
    <section
      aria-labelledby="seller-proof-heading"
      className="scroll-fade relative overflow-hidden py-16 sm:py-24"
      style={{ background: "transparent" }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-55"
        style={{
          backgroundImage:
            "linear-gradient(rgba(240,164,41,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(240,164,41,0.03) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "linear-gradient(180deg, transparent 0%, black 18%, black 82%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {SELLER_STATS.map((stat) => (
            <article
              key={stat.label}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#11111a] px-4 py-5 text-center shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-gold/40 hover:shadow-[0_18px_44px_rgba(240,164,41,0.12)] sm:px-6 sm:py-6"
            >
              <strong className="block font-mono text-2xl font-extrabold leading-none text-accent-gold tabular-nums sm:text-3xl lg:text-[2rem]">
                {stat.value}
              </strong>
              <span className="mt-2 block font-sans text-[0.68rem] font-extrabold uppercase tracking-[0.08em] text-white/35 sm:text-xs">
                {stat.label}
              </span>
              <span
                className="absolute bottom-0 left-1/2 h-px w-3/5 -translate-x-1/2 bg-gradient-to-r from-transparent via-accent-gold to-transparent opacity-80"
                aria-hidden="true"
              />
            </article>
          ))}
        </div>

        <div className="mt-8 sm:mt-10">
          <header className="mb-4 flex items-center gap-3">
            <span
              className="font-mono text-xs tracking-[0.12em] text-accent-gold"
              aria-hidden="true"
            >
              ★★★★★
            </span>
            <h2
              id="seller-proof-heading"
              className="font-sans text-lg font-extrabold tracking-tight text-white sm:text-xl"
            >
              Das sagen Verkäufer über uns
            </h2>
          </header>

          <div className="group overflow-x-auto overflow-y-hidden sm:overflow-hidden sm:[mask-image:linear-gradient(90deg,transparent,black_7%,black_93%,transparent)]">
            <div className="flex w-max gap-3 py-2 sm:animate-ticker sm:group-hover:[animation-play-state:paused]">
              {reviewLoop.map((review, index) => (
                <figure
                  key={`${review.name}-${index}`}
                  className="flex min-h-[172px] w-[min(78vw,20rem)] flex-none flex-col justify-between rounded-2xl border border-white/10 bg-[#11111a] p-5 shadow-card transition-all duration-200 hover:border-accent-gold/35 sm:w-80"
                  aria-hidden={index >= SELLER_REVIEWS.length}
                >
                  <div>
                    <span
                      className="font-mono text-xs tracking-[0.12em] text-accent-gold"
                      aria-label="5 von 5 Sternen"
                    >
                      ★★★★★
                    </span>
                    <blockquote className="mt-4 font-sans text-sm font-semibold leading-relaxed text-white/80">
                      {review.text}
                    </blockquote>
                  </div>
                  <figcaption className="mt-5 font-sans text-sm font-extrabold text-[#ffe7a3]">
                    {review.name}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
