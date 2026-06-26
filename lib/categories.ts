// ============================================================
// RetrOase — Zentrale Kategorie-Logik (Slug ↔ Produkt-Matching)
// ============================================================
// Produkte besitzen nur ein grobes `category`-Feld ("Nintendo",
// "Game Boy", "PlayStation", "Pokémon", "Zubehör", "Retro") sowie ein
// freitextliches `platform`-Feld ("SNES", "Nintendo 64", "PlayStation 1"…).
// Damit Kategorie-Links wie /shop?category=snes oder /shop?category=nintendo
// trotzdem logisch funktionieren, matchen wir über mehrere Felder
// (category, platform, title, slug) anhand normalisierter Synonyme.

import type { Product } from "@/types";

/**
 * Normalisiert einen String für robusten Vergleich:
 * - lowercase + trim
 * - deutsche Umlaute → Digraph (ä→ae, ö→oe, ü→ue, ß→ss)
 * - übrige Diakritika entfernen (é→e …)
 * - Sonderzeichen/Bindestriche → Leerzeichen
 * - Mehrfach-Leerzeichen zusammenfassen
 */
export function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Kanonische Kategorie-Slugs → Synonyme/Suchbegriffe.
 * Alle Werte werden vor dem Vergleich über normalizeText() normalisiert.
 * Mehrwort-Begriffe ("game boy") matchen als Phrase, Einzelbegriffe ("snes")
 * als ganzes Wort — so vermeiden wir Fehltreffer durch Teil-Strings.
 */
export const CATEGORY_ALIASES: Record<string, string[]> = {
  nintendo: [
    "nintendo",
    "game boy",
    "gameboy",
    "game boy color",
    "game boy advance",
    "game boy advance sp",
    "game boy pocket",
    "gbc",
    "gba",
    "snes",
    "super nintendo",
    "n64",
    "nintendo 64",
    "gamecube",
    "game cube",
    "wii",
    "wii u",
    "nintendo ds",
    "3ds",
    "nintendo 3ds",
    "switch",
    "nintendo switch",
  ],
  gameboy: [
    "game boy",
    "gameboy",
    "game boy color",
    "game boy advance",
    "game boy advance sp",
    "game boy pocket",
    "gbc",
    "gba",
    "dmg",
  ],
  playstation: [
    "playstation",
    "sony",
    "ps1",
    "ps2",
    "ps3",
    "ps4",
    "ps5",
    "psx",
    "psone",
    "playstation 1",
    "playstation 2",
    "playstation 3",
    "playstation 4",
    "playstation 5",
    "dualshock",
  ],
  snes: [
    "snes",
    "super nintendo",
    "super nintendo entertainment system",
    "super famicom",
  ],
  n64: ["n64", "nintendo 64", "nintendo64"],
  pokemon: ["pokemon"],
  zubehoer: ["zubehoer", "zubehor", "accessoire", "accessory"],
  retro: [
    "retro",
    "sega",
    "atari",
    "mega drive",
    "master system",
    "game gear",
    "dreamcast",
    "saturn",
    "neo geo",
    "commodore",
    "c64",
    "vectrex",
  ],
};

/** Anzeige-Labels für Kategorie-Seiten (Header / Metadaten). */
export const CATEGORY_LABELS: Record<string, string> = {
  nintendo: "Nintendo",
  gameboy: "Game Boy",
  playstation: "PlayStation",
  snes: "Super Nintendo (SNES)",
  n64: "Nintendo 64",
  pokemon: "Pokémon",
  zubehoer: "Zubehör",
  retro: "Retro",
};

/**
 * Auflösung beliebiger Eingaben (Slug ODER Label ODER Synonym) → kanonischer Slug.
 * Deckt sowohl Navigations-Slugs ("gameboy", "n64") als auch die
 * Label-Form aus dem FilterPanel/Home-Grid ("Game Boy", "Pokémon") ab.
 */
const SLUG_RESOLVER: Record<string, string> = (() => {
  const map: Record<string, string> = {};

  // Kanonische Keys selbst (nintendo, gameboy, snes, n64, …)
  for (const key of Object.keys(CATEGORY_ALIASES)) {
    map[normalizeText(key)] = key;
  }

  // Zusätzliche Eingabeformen → kanonischer Slug
  const extra: Record<string, string> = {
    "game boy": "gameboy",
    "nintendo 64": "n64",
    nintendo64: "n64",
    "super nintendo": "snes",
    "super nintendo entertainment system": "snes",
    "pokémon": "pokemon",
    "zubehör": "zubehoer",
  };
  for (const [k, v] of Object.entries(extra)) {
    map[normalizeText(k)] = v;
  }

  return map;
})();

/** Liefert den kanonischen Slug für eine Eingabe oder null, wenn unbekannt. */
export function resolveCategorySlug(value: string): string | null {
  if (!value) return null;
  return SLUG_RESOLVER[normalizeText(value)] ?? null;
}

/** Menschlich lesbares Label für eine Kategorie-Eingabe (Fallback: Rohwert). */
export function getCategoryLabel(value: string): string {
  const slug = resolveCategorySlug(value);
  if (slug && CATEGORY_LABELS[slug]) return CATEGORY_LABELS[slug];
  return value;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Durchsuchbarer, normalisierter Text eines Produkts. */
function buildHaystack(product: Product): string {
  return normalizeText(
    [product.category, product.platform, product.title, product.slug]
      .filter(Boolean)
      .join(" ")
  );
}

/**
 * Prüft, ob ein bereits normalisierter Haystack einen Suchbegriff enthält.
 * - Phrasen (mit Leerzeichen): Teilstring-Vergleich
 * - Einzelwörter: Wortgrenzen-Vergleich (verhindert Treffer in längeren Tokens)
 */
function haystackMatchesTerm(haystack: string, term: string): boolean {
  const normalized = normalizeText(term);
  if (!normalized) return false;
  if (normalized.includes(" ")) return haystack.includes(normalized);
  return new RegExp(`(^| )${escapeRegExp(normalized)}( |$)`).test(haystack);
}

/**
 * Kernfunktion: Passt ein Produkt zu einem Kategorie-Wert (Slug oder Label)?
 * Unbekannte Werte fallen auf einen direkten Begriffs-Match zurück, damit
 * auch zukünftige/freie Kategorien grundsätzlich funktionieren.
 */
export function productMatchesCategory(product: Product, categoryValue: string): boolean {
  if (!categoryValue) return true;
  const haystack = buildHaystack(product);
  const slug = resolveCategorySlug(categoryValue);
  const terms = slug ? CATEGORY_ALIASES[slug] : [categoryValue];
  return terms.some((term) => haystackMatchesTerm(haystack, term));
}
