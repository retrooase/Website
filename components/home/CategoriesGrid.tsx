import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

const PLATFORM_EMOJI: Record<string, string> = {
  Nintendo:    "🍄",
  "Game Boy":  "🎮",
  PlayStation: "🎯",
  "Pokémon":   "⚡",
  Zubehör:     "🔧",
  Retro:       "🕹️",
};

const PLATFORM_TAGLINE: Record<string, string> = {
  Nintendo:    "Klassiker & Kultspiele",
  "Game Boy":  "Taschenspielkonsolen",
  PlayStation: "Sony Gaming",
  "Pokémon":   "Karten & Spiele",
  Zubehör:     "Controller & Kabel",
  Retro:       "80er & 90er Gems",
};

const PLATFORM_ACCENT: Record<string, string> = {
  Nintendo:    "rgba(228,0,15,0.08)",
  "Game Boy":  "rgba(138,138,138,0.08)",
  PlayStation: "rgba(0,67,156,0.08)",
  "Pokémon":   "rgba(255,204,2,0.08)",
  Zubehör:     "rgba(255,107,53,0.08)",
  Retro:       "rgba(34,211,163,0.08)",
};

export function CategoriesGrid() {
  return (
    <section className="py-20 sm:py-28 scroll-fade bg-surface">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-10 sm:mb-14">
          <div>
            <p className="font-sans text-xs font-semibold tracking-[0.18em] uppercase text-accent-orange mb-3">
              Sortiert nach Plattform
            </p>
            <h2
              className="font-display font-bold text-text-primary"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.75rem)" }}
            >
              Was suchst du?
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-2 font-sans text-sm font-semibold text-accent-orange hover:gap-3 transition-all duration-200 group"
          >
            Alle anzeigen
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat, i) => {
            const emoji   = PLATFORM_EMOJI[cat.label]   ?? "🎮";
            const tagline = PLATFORM_TAGLINE[cat.label] ?? cat.description;
            const accent  = PLATFORM_ACCENT[cat.label]  ?? "rgba(255,107,53,0.08)";
            const isWide  = i === 0 || i === 3;

            return (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.id}`}
                className={`group relative flex flex-col gap-4 p-5 sm:p-6 rounded-2xl border border-border bg-background hover:border-border-strong hover:-translate-y-0.5 hover:shadow-hover transition-all duration-200 min-h-[140px] ${isWide ? "lg:col-span-2" : "lg:col-span-1"}`}
                style={{ background: `linear-gradient(135deg, ${accent} 0%, var(--background) 60%)` }}
                aria-label={`${cat.label}: ${cat.description}`}
              >
                <span
                  className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-200 origin-left"
                  aria-hidden="true"
                >
                  {emoji}
                </span>

                <div className="mt-auto">
                  <p className="font-display font-bold text-text-primary text-sm leading-snug">
                    {cat.label}
                  </p>
                  <p className="font-sans text-xs text-text-tertiary mt-0.5 leading-tight">
                    {tagline}
                  </p>
                </div>

                <ArrowRight
                  size={14}
                  className="absolute top-5 right-5 text-text-tertiary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200"
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </div>

        {/* Mobile CTA */}
        <div className="mt-6 sm:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full border border-border text-text-secondary font-sans text-sm font-medium hover:border-accent-orange hover:text-accent-orange transition-all duration-200"
          >
            Alle Kategorien
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
