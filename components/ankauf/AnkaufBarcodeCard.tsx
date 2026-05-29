"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, RotateCcw } from "lucide-react";

// ─── Lokale Erkennungs-Logik (keine externe API) ─────────────

type SellHint = {
  category: string;
  categoryIcon: string;
  photoTips: string[];
  hint: string;
  sellType: "einzeln" | "pokemon" | "sammlung" | "zubehoer" | "defekt";
};

const PATTERNS: Array<{ keywords: string[]; result: SellHint }> = [
  {
    keywords: ["game boy", "gameboy", "gba", "gbc", "gbsp", "gb color", "gb advance", "gb pocket"],
    result: {
      category: "Game Boy",
      categoryIcon: "🕹️",
      photoTips: ["Vorderseite", "Rückseite", "Seriennummer", "Display & Tasten"],
      hint: "Game-Boy-Geräte erzielen oft hohe Preise — besonders in gutem Zustand mit Originalzubehör.",
      sellType: "einzeln",
    },
  },
  {
    keywords: ["nintendo", "snes", "n64", "gamecube", "wii", "switch", "ds", "3ds", "nes", "famicom", "super nintendo"],
    result: {
      category: "Nintendo",
      categoryIcon: "🎮",
      photoTips: ["Konsole Vorderseite", "Anschlüsse", "Controller", "Zubehör & Spiele"],
      hint: "Nintendo-Geräte sind sehr gefragt — vollständige Sets mit Zubehör erzielen bessere Preise.",
      sellType: "einzeln",
    },
  },
  {
    keywords: ["playstation", "ps1", "ps2", "ps3", "ps4", "psx", "sony", "ps one"],
    result: {
      category: "PlayStation",
      categoryIcon: "🎯",
      photoTips: ["Konsole Vorderseite", "Rückseite & Anschlüsse", "Controller", "Spiele & OVP"],
      hint: "PlayStation-Konsolen sind beliebt — alle Kabel und Controller angeben für ein besseres Angebot.",
      sellType: "einzeln",
    },
  },
  {
    keywords: ["pokemon", "pokémon", "pikachu", "karten", "tcg", "booster", "holo", "charizard", "evoli", "cards"],
    result: {
      category: "Pokémon & Karten",
      categoryIcon: "⚡",
      photoTips: ["Gesamtübersicht aller Karten", "Seltene/Holo-Karten einzeln", "Zustand der Karten", "Set oder Binder"],
      hint: "Seltene Karten einzeln fotografieren — das hilft uns bei der genauen Einschätzung.",
      sellType: "pokemon",
    },
  },
  {
    keywords: ["sammlung", "konvolut", "lot", "paket", "collection", "kiste", "karton", "alles"],
    result: {
      category: "Sammlung / Konvolut",
      categoryIcon: "📦",
      photoTips: ["Gesamtübersicht aller Teile", "Highlights einzeln", "Zustandsfotos", "Vollständigkeit"],
      hint: "Sammlungen nehmen wir sehr gerne an — bitte so viele Fotos wie möglich beifügen.",
      sellType: "sammlung",
    },
  },
  {
    keywords: ["controller", "kabel", "netzteil", "hülle", "headset", "zubehör", "adapter", "speicherkarte", "memory"],
    result: {
      category: "Zubehör",
      categoryIcon: "🔌",
      photoTips: ["Vorderseite", "Rückseite", "Stecker & Anschlüsse", "Seriennummer"],
      hint: "Originalzubehör ist sehr gefragt — vor allem ungeöffnetes oder wenig genutztes.",
      sellType: "zubehoer",
    },
  },
  {
    keywords: ["sega", "mega drive", "genesis", "saturn", "dreamcast", "atari", "commodore", "amiga", "spectrum"],
    result: {
      category: "Retro",
      categoryIcon: "👾",
      photoTips: ["Gerät Vorderseite", "Rückseite & Anschlüsse", "Verpackung wenn vorhanden", "Zubehör"],
      hint: "Klassische Retro-Geräte sind Sammlerstücke — auch defekte Geräte können wertvoll sein.",
      sellType: "einzeln",
    },
  },
  {
    keywords: ["defekt", "kaputt", "broken", "geht nicht", "lädt nicht", "kein bild", "kein ton", "reparieren", "beschädigt"],
    result: {
      category: "Defektes Gerät",
      categoryIcon: "🔧",
      photoTips: ["Gerät allgemein", "Sichtbare Schäden genau", "Seriennummer", "Alle vorhandenen Teile"],
      hint: "Auch defekte Geräte kaufen wir an — bitte den Schaden möglichst genau beschreiben und fotografieren.",
      sellType: "defekt",
    },
  },
];

function analyzeInput(text: string): SellHint | null {
  const lower = text.toLowerCase();
  for (const { keywords, result } of PATTERNS) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return result;
    }
  }
  return null;
}

// ─── Komponente ──────────────────────────────────────────────

export function AnkaufBarcodeCard() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<SellHint | null>(null);
  const [noMatch, setNoMatch] = useState(false);

  function handleAnalyze() {
    if (!input.trim()) return;
    const found = analyzeInput(input);
    setResult(found);
    setNoMatch(!found);
  }

  function handleReset() {
    setInput("");
    setResult(null);
    setNoMatch(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleAnalyze();
  }

  return (
    <div className="bg-background border border-border p-6 lg:p-7 shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-none">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-3 mb-1">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-accent-orange">
            Smart Assistent
          </p>
          <span className="font-sans text-[10px] font-bold bg-[rgba(255,107,53,0.08)] border border-accent-orange/30 text-accent-orange px-2 py-0.5 uppercase tracking-wide flex-shrink-0">
            KI-frei
          </span>
        </div>
        <h3 className="font-sans font-bold text-text-primary text-xl">
          Produkt erkennen
        </h3>
        <p className="font-sans text-xs text-text-secondary mt-1.5">
          Beschreibe kurz was du verkaufen möchtest — wir zeigen dir die richtigen Foto-Tipps.
        </p>
      </div>

      {!result ? (
        <div className="space-y-4">
          {/* Input */}
          <div>
            <label
              htmlFor="smart-input"
              className="font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2 block"
            >
              Was möchtest du verkaufen?
            </label>
            <div className="flex gap-2">
              <input
                id="smart-input"
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setNoMatch(false);
                }}
                onKeyDown={handleKeyDown}
                placeholder="z.B. Game Boy Advance, Pokémon Karten, PS2…"
                className="flex-1 bg-surface border border-border text-text-primary placeholder:text-text-secondary px-4 py-2.5 font-sans text-sm outline-none focus:border-accent-orange transition-colors min-h-[44px]"
              />
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={!input.trim()}
                className="px-4 min-h-[44px] bg-accent-orange text-background flex items-center justify-center hover:bg-[#e05a28] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Produkt analysieren"
              >
                <Sparkles size={16} />
              </button>
            </div>
            {noMatch && (
              <p className="font-sans text-xs text-text-secondary mt-2">
                Produkt nicht erkannt — starte trotzdem direkt mit der{" "}
                <a href="#angebot" className="text-accent-orange hover:underline">
                  Anfrage
                </a>
                .
              </p>
            )}
          </div>

          {/* Beispiele */}
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2">
              Beispiele
            </p>
            <div className="flex flex-wrap gap-2">
              {["Game Boy Advance", "Pokémon Karten", "PlayStation 2", "Nintendo 64", "Sega Mega Drive"].map(
                (ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => {
                      setInput(ex);
                      const found = analyzeInput(ex);
                      setResult(found);
                      setNoMatch(!found);
                    }}
                    className="font-sans text-xs border border-border bg-surface text-text-secondary px-3 py-1.5 hover:border-accent-orange hover:text-accent-orange transition-colors"
                  >
                    {ex}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Erkannt-Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl" aria-hidden="true">
                {result.categoryIcon}
              </span>
              <span className="font-sans text-xs font-bold bg-[rgba(255,107,53,0.08)] border border-accent-orange/30 text-accent-orange px-3 py-1 uppercase tracking-wide">
                {result.category}
              </span>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 font-sans text-xs text-text-secondary hover:text-accent-orange transition-colors"
            >
              <RotateCcw size={12} />
              Neu
            </button>
          </div>

          {/* Hinweis */}
          <p className="font-sans text-sm text-text-secondary leading-relaxed border-l-2 border-accent-orange/40 pl-3">
            {result.hint}
          </p>

          {/* Foto-Tipps */}
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2">
              Empfohlene Fotos
            </p>
            <div className="grid grid-cols-2 gap-2">
              {result.photoTips.map((tip, i) => (
                <div
                  key={tip}
                  className="flex items-center gap-2 border border-border bg-surface px-3 py-2"
                >
                  <span className="font-mono text-[10px] text-accent-orange font-bold w-4 flex-shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-sans text-xs text-text-primary">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <a
            href="#angebot"
            className="flex items-center justify-center gap-2 w-full bg-accent-orange text-background font-sans font-semibold text-sm px-5 py-3 hover:bg-[#e05a28] transition-colors min-h-[44px]"
          >
            Jetzt Anfrage stellen
            <ArrowRight size={15} />
          </a>
        </div>
      )}
    </div>
  );
}
