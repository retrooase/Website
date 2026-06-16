import Link from "next/link";
import { ArrowRight, TrendingUp, CheckCircle } from "lucide-react";

const STEPS = [
  {
    number: "01",
    title: "Einschicken",
    desc: "Schick uns deine Konsolen oder Spiele — wir evaluieren alles kostenlos.",
  },
  {
    number: "02",
    title: "Prüfen & Bewerten",
    desc: "Wir prüfen Zustand und Vollständigkeit und machen ein faires Angebot.",
  },
  {
    number: "03",
    title: "Sofort bezahlt werden",
    desc: "Du nimmst an → wir überweisen schnell und unkompliziert auf dein Konto.",
  },
] as const;

const PERKS = [
  "Kostenlose Bewertung",
  "Kein Verkaufszwang",
  "500+ zufriedene Verkäufer",
];

export function AnkaufTeaser() {
  return (
    <section
      className="py-20 sm:py-28 scroll-fade relative overflow-hidden"
      style={{ background: "var(--bg-anchor)" }}
      aria-labelledby="ankauf-heading"
    >
      {/* Background atmosphere */}
      <div
        className="absolute top-1/2 -left-32 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,95,46,0.12) 0%, transparent 65%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 right-0 w-[400px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(34,211,163,0.07) 0%, transparent 60%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left: Headline + CTA */}
          <div className="lg:pt-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-accent-orange/30 bg-accent-orange/10 mb-8">
              <TrendingUp size={13} className="text-accent-orange" aria-hidden="true" />
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-accent-orange">
                Ankauf
              </span>
            </div>

            <h2
              id="ankauf-heading"
              className="font-display font-bold leading-tight tracking-tight mb-6"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)", color: "#F0EBF9" }}
            >
              Dein Retro-Schatz
              <br />
              <span
                className="text-accent-orange"
                style={{ textShadow: "0 0 40px rgba(255,95,46,0.3)" }}
              >
                bringt Geld.
              </span>
            </h2>

            <p
              className="font-sans leading-relaxed mb-8 max-w-md"
              style={{ color: "rgba(240,235,249,0.55)" }}
            >
              Du hast alte Konsolen, Spiele oder Pokémon-Karten im Schrank?
              Wir kaufen fair an — schnell, unkompliziert, aus Deutschland.
            </p>

            {/* Value highlight */}
            <div className="mb-10 p-6 rounded-2xl border border-accent-orange/20 bg-accent-orange/5">
              <span
                className="font-display font-extrabold text-accent-orange block leading-none"
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
                  textShadow: "0 0 40px rgba(255,95,46,0.4)",
                }}
              >
                bis 200€
              </span>
              <p className="font-sans text-xs mt-2 text-white/40">
                Beispielwert: Game Boy Advance SP · Sehr Gut
              </p>
            </div>

            <Link
              href="/ankauf"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-accent-orange text-white font-sans font-semibold text-base hover:bg-accent-orange/90 hover:-translate-y-0.5 shadow-[0_4px_24px_rgba(255,95,46,0.35)] hover:shadow-[0_8px_36px_rgba(255,95,46,0.5)] transition-all duration-200"
            >
              Jetzt Angebot anfragen
              <ArrowRight size={16} />
            </Link>

            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-5">
              {PERKS.map((p) => (
                <span key={p} className="flex items-center gap-1.5 font-sans text-xs text-white/35">
                  <CheckCircle size={12} className="text-accent-teal flex-shrink-0" aria-hidden="true" />
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Steps */}
          <div className="space-y-3">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="group flex gap-5 items-start p-6 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:border-accent-orange/30 hover:bg-accent-orange/5 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-full bg-accent-orange/15 border border-accent-orange/30">
                  <span className="font-display font-bold text-accent-orange text-sm">
                    {step.number}
                  </span>
                </div>
                <div className="pt-0.5">
                  <h3 className="font-display font-bold text-base mb-1.5 text-white/90">
                    {step.title}
                  </h3>
                  <p className="font-sans text-sm leading-relaxed text-white/45">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
