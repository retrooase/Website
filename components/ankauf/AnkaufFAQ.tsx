"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "Ist die Anfrage verbindlich?",
    a: "Nein. Du sendest uns eine komplett unverbindliche Anfrage. Wir machen dir ein Angebot — du entscheidest danach ob du annimmst oder nicht. Kein Druck, keine Verpflichtung, keine versteckten Kosten.",
  },
  {
    q: "Was kann ich alles verkaufen?",
    a: "Fast alles rund um Retro-Gaming: Konsolen, Spiele, Controller, Zubehör, Kabel, Netzteile, Pokémon-Karten, Sammelkarten, Originalverpackungen, Anleitungen, Bundles und ganze Sammlungen. Auch defekte Geräte kaufen wir an.",
  },
  {
    q: "Wie schnell bekomme ich eine Antwort?",
    a: "In der Regel innerhalb von 24 Stunden. Bei umfangreichen Sammlungen oder seltenen Stücken kann es etwas länger dauern — wir möchten dir ein möglichst präzises und faires Angebot machen.",
  },
  {
    q: "Muss das Produkt funktionieren?",
    a: "Nein. Wir kaufen auch defekte Geräte an — für unsere Aufarbeitung oder als Ersatzteile. Der Preis richtet sich natürlich nach dem Zustand. Beschreib einfach was nicht funktioniert, wir machen trotzdem ein Angebot.",
  },
  {
    q: "Kann ich eine ganze Sammlung verkaufen?",
    a: "Ja, und dafür bieten wir oft das beste Angebot! Beschreib uns einfach was du hast — wir erstellen dir ein Gesamt-Angebot für alles auf einmal. Großere Sammlungen können wir auch persönlich abholen.",
  },
] as const;

export function AnkaufFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  function toggle(i: number) {
    setOpen((prev) => (prev === i ? null : i));
  }

  return (
    <section className="py-20 sm:py-28 bg-background scroll-fade">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-accent-orange mb-3">
              FAQ
            </p>
            <h2
              className="font-sans font-bold text-text-primary"
              style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)" }}
            >
              Häufige Fragen
            </h2>
          </div>

          <div className="divide-y divide-border border border-border">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i}>
                <button
                  onClick={() => toggle(i)}
                  aria-expanded={open === i}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-surface transition-colors"
                >
                  <span className="font-sans font-semibold text-sm text-text-primary">
                    {item.q}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-text-secondary flex-shrink-0 transition-transform duration-200 ${
                      open === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {open === i && (
                  <div className="px-6 pb-5 bg-surface">
                    <p className="font-sans text-sm text-text-secondary leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
