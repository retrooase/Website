const SELL_TYPES = [
  {
    icon: "🎮",
    title: "Einzelnes Produkt",
    desc: "Eine Konsole, ein Spiel oder ein Gerät — schnelle, direkte Anfrage.",
    badge: "Häufigste Wahl",
  },
  {
    icon: "📦",
    title: "Mehrere Produkte",
    desc: "Verschiedene Artikel auf einmal — ein Angebot für alles.",
    badge: null,
  },
  {
    icon: "🗃️",
    title: "Ganze Sammlung",
    desc: "Konsolen, Spiele, Zubehör komplett — bestes Gesamtangebot.",
    badge: "Bestes Angebot",
  },
  {
    icon: "🔧",
    title: "Defektes Gerät",
    desc: "Startet nicht mehr oder hat Fehler? Wir kaufen trotzdem an.",
    badge: null,
  },
  {
    icon: "⚡",
    title: "Pokémon & Karten",
    desc: "Sets, Singles, alte Booster, Ordner oder ganze Sammlungen.",
    badge: null,
  },
  {
    icon: "🔌",
    title: "Zubehör & Controller",
    desc: "Kabel, Netzteile, Akkus, Adapter, Hüllen, Speicherkarten.",
    badge: null,
  },
] as const;

export function AnkaufCategories() {
  return (
    <section className="py-20 sm:py-28 bg-background scroll-fade">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-accent-orange mb-3">
            Was möchtest du verkaufen?
          </p>
          <h2
            className="font-sans font-bold text-text-primary"
            style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)" }}
          >
            Wähle deine Kategorie
          </h2>
          <p className="font-sans text-sm text-text-secondary mt-2 max-w-lg mx-auto">
            Wir kaufen fast alles rund um Retro-Gaming an — auch in schlechtem Zustand oder
            ohne Verpackung.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {SELL_TYPES.map((type) => (
            <a
              key={type.title}
              href="#angebot"
              className="group relative flex flex-col gap-4 p-6 sm:p-7 bg-surface border border-border hover:border-accent-orange hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(255,107,53,0.10)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none transition-all duration-200"
            >
              {type.badge && (
                <span className="absolute top-3 right-3 font-sans text-[10px] font-bold bg-accent-orange text-background px-2 py-0.5 uppercase tracking-wide">
                  {type.badge}
                </span>
              )}
              <span className="text-3xl" aria-hidden="true">
                {type.icon}
              </span>
              <div>
                <p className="font-sans font-semibold text-text-primary text-sm group-hover:text-accent-orange transition-colors">
                  {type.title}
                </p>
                <p className="font-sans text-xs text-text-secondary mt-1 leading-relaxed">
                  {type.desc}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
