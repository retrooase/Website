import { ArrowRight } from "lucide-react";

const TRUST = [
  "Kostenlos & unverbindlich",
  "Antwort innerhalb von 24h",
  "Faire Bewertung durch Retro-Gaming-Team",
] as const;

const STATS = [
  { value: "500+", label: "Ankäufe" },
  { value: "48h", label: "Auszahlung" },
  { value: "100%", label: "Faire Preise" },
  { value: "🇩🇪", label: "Aus DE" },
] as const;

export function AnkaufHero() {
  return (
    <div className="bg-surface border-b border-border relative overflow-hidden">
      {/* Orb orange top-right */}
      <div
        className="absolute -right-20 -top-20 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle at 65% 25%, rgba(255,107,53,0.13), transparent 55%)" }}
        aria-hidden="true"
      />
      {/* Orb amber bottom-left */}
      <div
        className="absolute -left-40 bottom-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,204,2,0.05), transparent 65%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 border border-accent-orange/30 bg-accent-orange/5 px-3 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-orange" aria-hidden="true" />
            <span className="font-sans text-xs font-semibold text-accent-orange uppercase tracking-widest">
              Ankauf · Retro-Gaming
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-sans font-bold text-text-primary leading-tight tracking-tight mb-5"
            style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)" }}
          >
            Verkauf deine
            <br />
            <span className="text-accent-orange">Retro-Schätze.</span>
          </h1>

          {/* Subheadline */}
          <p
            className="font-sans text-text-secondary leading-relaxed mb-10 max-w-2xl"
            style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)" }}
          >
            Erhalte eine faire Einschätzung für Konsolen, Spiele, Pokémon-Karten,
            Zubehör und ganze Sammlungen. Schnell, seriös und direkt aus Deutschland.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <a
              href="#angebot"
              className="inline-flex items-center justify-center gap-2 bg-accent-orange text-background px-8 py-4 font-sans font-semibold text-sm hover:bg-[#e05a28] transition-colors min-h-[52px]"
            >
              Ankauf starten
              <ArrowRight size={16} />
            </a>
            <a
              href="#preisschaetzer"
              className="inline-flex items-center justify-center gap-2 border border-border bg-background text-text-primary px-8 py-4 font-sans font-semibold text-sm hover:border-accent-orange hover:text-accent-orange transition-colors min-h-[52px]"
            >
              Preis schätzen
            </a>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-6 mb-12">
            {TRUST.map((item) => (
              <span key={item} className="flex items-center gap-2 font-sans text-xs text-text-secondary">
                <span className="text-success font-bold">✓</span>
                {item}
              </span>
            ))}
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-4 gap-0 border border-border bg-background/60">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`px-4 py-4 text-center ${i < STATS.length - 1 ? "border-r border-border" : ""}`}
              >
                <p className="font-mono font-bold text-accent-orange text-lg sm:text-xl">
                  {stat.value}
                </p>
                <p className="font-sans text-[10px] text-text-secondary mt-0.5 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
