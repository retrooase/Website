import Link from "next/link";
import { ArrowRight } from "lucide-react";

const STEPS = [
  {
    number: "01",
    title: "Einschicken",
    desc: "Schick uns deine Geräte oder Spiele — wir evaluieren alles kostenlos.",
  },
  {
    number: "02",
    title: "Prüfen & Bewerten",
    desc: "Wir prüfen Zustand und Vollständigkeit und machen dir ein faires Angebot.",
  },
  {
    number: "03",
    title: "Bezahlt werden",
    desc: "Du nimmst an → wir überweisen schnell und unkompliziert.",
  },
];

export function AnkaufTeaser() {
  return (
    <section className="py-20 sm:py-28 scroll-fade relative overflow-hidden">
      {/* Subtle amber orb */}
      <div
        className="absolute -right-32 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,107,53,0.06), transparent 65%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left: Headline + CTA */}
          <div className="lg:pt-3">
            <div className="inline-flex items-center gap-2 border border-border px-3 py-1.5 mb-8">
              <span
                className="font-pixel text-accent-orange"
                style={{ fontSize: "0.45rem", letterSpacing: "0.15em" }}
              >
                ANKAUF
              </span>
            </div>

            <h2
              className="font-sans font-bold text-text-primary leading-tight tracking-tight mb-6"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}
            >
              Dein Retro-Schatz
              <br />
              <span className="text-accent-orange">bringt Geld.</span>
            </h2>

            <p
              className="font-sans text-text-secondary leading-relaxed mb-10 max-w-md"
              style={{ fontSize: "clamp(0.95rem, 1.2vw, 1.1rem)" }}
            >
              Du hast alte Konsolen, Spiele oder Pokémon-Karten im Schrank?
              Wir kaufen fair an — schnell, unkompliziert, aus Deutschland.
            </p>

            <Link href="/ankauf" className="btn-primary inline-flex">
              Jetzt Angebot anfragen
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Right: Steps */}
          <div className="space-y-3">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="group flex gap-5 items-start p-6 border border-border hover:border-accent-orange hover:shadow-[0_4px_20px_rgba(255,107,53,0.08)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none transition-all duration-200 bg-surface"
              >
                <div className="flex-shrink-0 w-11 h-11 flex items-center justify-center bg-accent-orange">
                  <span
                    className="font-pixel text-background"
                    style={{ fontSize: "0.5rem" }}
                  >
                    {step.number}
                  </span>
                </div>
                <div className="pt-0.5">
                  <h3 className="font-sans font-semibold text-text-primary text-base mb-1.5">
                    {step.title}
                  </h3>
                  <p className="font-sans text-sm text-text-secondary leading-relaxed">
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
