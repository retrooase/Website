import { type SellType } from "./types";

const SELL_TYPES: Array<{
  id: SellType;
  emoji: string;
  title: string;
  desc: string;
  badge?: string;
}> = [
  {
    id: "einzeln",
    emoji: "🎮",
    title: "Einzelnes Produkt",
    desc: "Eine Konsole, ein Spiel oder ein Controller.",
    badge: "Häufigste Wahl",
  },
  {
    id: "mehrere",
    emoji: "📦",
    title: "Mehrere Produkte",
    desc: "Verschiedene Artikel auf einmal — ein Angebot für alles.",
  },
  {
    id: "sammlung",
    emoji: "🗃️",
    title: "Ganze Sammlung",
    desc: "Konsolen, Spiele, Zubehör komplett — bestes Gesamtangebot.",
    badge: "Bestes Angebot",
  },
  {
    id: "defekt",
    emoji: "🔧",
    title: "Defektes Gerät",
    desc: "Startet nicht oder hat Fehler? Wir kaufen trotzdem an.",
  },
  {
    id: "pokemon",
    emoji: "⚡",
    title: "Pokémon & Karten",
    desc: "Sets, Singles, Booster, Ordner oder ganze Sammlungen.",
  },
  {
    id: "zubehoer",
    emoji: "🔌",
    title: "Zubehör & Controller",
    desc: "Kabel, Netzteile, Akkus, Adapter, Speicherkarten.",
  },
];

export function WizardStep1Type({
  value,
  onChange,
  error,
}: {
  value: SellType | null;
  onChange: (v: SellType) => void;
  error?: string;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-sans font-bold text-text-primary text-lg mb-1">
          Was möchtest du verkaufen?
        </h3>
        <p className="font-sans text-sm text-text-secondary">
          Wähle die passende Kategorie für dein Angebot.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {SELL_TYPES.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => onChange(type.id)}
            aria-pressed={value === type.id}
            className={`relative flex flex-col gap-2.5 p-4 sm:p-5 border text-left transition-all duration-150 hover:border-accent-orange/60 min-h-[120px] ${
              value === type.id
                ? "border-accent-orange bg-[rgba(255,107,53,0.05)] dark:bg-[rgba(255,107,53,0.08)]"
                : "border-border bg-background hover:bg-surface"
            }`}
          >
            {type.badge && (
              <span className="absolute top-2.5 right-2.5 font-sans text-[9px] font-bold uppercase tracking-wider bg-accent-orange text-background px-1.5 py-0.5 leading-tight">
                {type.badge}
              </span>
            )}
            <span className="text-2xl leading-none" aria-hidden="true">
              {type.emoji}
            </span>
            <div>
              <p className="font-sans font-semibold text-sm text-text-primary leading-tight pr-12">
                {type.title}
              </p>
              <p className="font-sans text-xs text-text-secondary mt-0.5 leading-snug">
                {type.desc}
              </p>
            </div>
          </button>
        ))}
      </div>

      {error && (
        <p className="font-sans text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
