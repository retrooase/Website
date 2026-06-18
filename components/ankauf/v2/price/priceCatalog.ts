export type PriceRange = [number, number];

export type ConditionId = "mint" | "good" | "fair" | "defective";
export type CompletenessId = "boxed" | "complete" | "loose" | "missing";
export type DemandLevel = "hot" | "steady" | "niche";

export interface PriceVariant {
  id: string;
  brand: string;
  family: string;
  name: string;
  type: "console" | "handheld" | "game" | "cards" | "accessory" | "bundle";
  baseRange: PriceRange;
  demand: DemandLevel;
  aliases: string[];
}

export interface PriceCondition {
  id: ConditionId;
  label: string;
  factor: number;
  hint: string;
}

export interface PriceCompleteness {
  id: CompletenessId;
  label: string;
  factor: number;
  hint: string;
}

export const PRICE_CONDITIONS: PriceCondition[] = [
  { id: "mint", label: "Sehr gut", factor: 1, hint: "gepflegt, getestet, kaum Spuren" },
  { id: "good", label: "Gut", factor: 0.82, hint: "normale Nutzungsspuren" },
  { id: "fair", label: "Akzeptabel", factor: 0.58, hint: "deutliche Spuren, funktioniert" },
  { id: "defective", label: "Defekt", factor: 0.28, hint: "geht nicht oder teilweise defekt" },
];

export const PRICE_COMPLETENESS: PriceCompleteness[] = [
  { id: "boxed", label: "OVP + Zubehör", factor: 1.14, hint: "Karton, Kabel, Controller, Beilagen" },
  { id: "complete", label: "Komplett ohne OVP", factor: 1, hint: "alles zum Spielen dabei" },
  { id: "loose", label: "Nur Gerät / Spiel", factor: 0.74, hint: "ohne OVP oder Zubehör" },
  { id: "missing", label: "Unvollständig", factor: 0.55, hint: "wichtiges Zubehör fehlt" },
];

export const PRICE_VARIANTS: PriceVariant[] = [
  {
    id: "sony-ps5-disc",
    brand: "Sony",
    family: "PlayStation 5",
    name: "PS5 Disc Edition",
    type: "console",
    baseRange: [280, 390],
    demand: "hot",
    aliases: ["ps5", "playstation 5", "disc", "laufwerk"],
  },
  {
    id: "sony-ps5-digital",
    brand: "Sony",
    family: "PlayStation 5",
    name: "PS5 Digital Edition",
    type: "console",
    baseRange: [230, 330],
    demand: "hot",
    aliases: ["ps5 digital", "playstation 5 digital", "digital edition"],
  },
  {
    id: "sony-ps5-slim-disc",
    brand: "Sony",
    family: "PlayStation 5",
    name: "PS5 Slim Disc",
    type: "console",
    baseRange: [300, 420],
    demand: "hot",
    aliases: ["ps5 slim", "slim disc", "ps5 slim laufwerk"],
  },
  {
    id: "sony-ps5-slim-digital",
    brand: "Sony",
    family: "PlayStation 5",
    name: "PS5 Slim Digital",
    type: "console",
    baseRange: [250, 350],
    demand: "hot",
    aliases: ["ps5 slim digital", "slim digital"],
  },
  {
    id: "sony-ps4-pro",
    brand: "Sony",
    family: "PlayStation 4",
    name: "PS4 Pro",
    type: "console",
    baseRange: [120, 190],
    demand: "steady",
    aliases: ["playstation 4 pro", "ps4 pro"],
  },
  {
    id: "sony-ps4-slim",
    brand: "Sony",
    family: "PlayStation 4",
    name: "PS4 Slim",
    type: "console",
    baseRange: [90, 150],
    demand: "steady",
    aliases: ["playstation 4 slim", "ps4 slim"],
  },
  {
    id: "sony-ps2-slim",
    brand: "Sony",
    family: "PlayStation 2",
    name: "PS2 Slim",
    type: "console",
    baseRange: [55, 95],
    demand: "steady",
    aliases: ["playstation 2 slim", "ps2 slim"],
  },
  {
    id: "nintendo-switch-oled",
    brand: "Nintendo",
    family: "Switch",
    name: "Nintendo Switch OLED",
    type: "handheld",
    baseRange: [190, 280],
    demand: "hot",
    aliases: ["switch oled", "oled switch"],
  },
  {
    id: "nintendo-switch-v2",
    brand: "Nintendo",
    family: "Switch",
    name: "Nintendo Switch V2",
    type: "handheld",
    baseRange: [150, 230],
    demand: "hot",
    aliases: ["switch", "switch v2", "rote box"],
  },
  {
    id: "nintendo-switch-lite",
    brand: "Nintendo",
    family: "Switch",
    name: "Nintendo Switch Lite",
    type: "handheld",
    baseRange: [85, 140],
    demand: "steady",
    aliases: ["switch lite", "lite"],
  },
  {
    id: "nintendo-ds-lite",
    brand: "Nintendo",
    family: "Nintendo DS",
    name: "Nintendo DS Lite",
    type: "handheld",
    baseRange: [28, 60],
    demand: "steady",
    aliases: ["ds lite", "nintendo ds lite"],
  },
  {
    id: "nintendo-dsi",
    brand: "Nintendo",
    family: "Nintendo DS",
    name: "Nintendo DSi",
    type: "handheld",
    baseRange: [25, 55],
    demand: "steady",
    aliases: ["dsi", "nintendo dsi"],
  },
  {
    id: "nintendo-ds-game",
    brand: "Nintendo",
    family: "Nintendo DS",
    name: "Nintendo DS Spiel",
    type: "game",
    baseRange: [4, 18],
    demand: "steady",
    aliases: ["ds spiel", "nintendo ds spiel", "ds spiele"],
  },
  {
    id: "nintendo-3ds-xl",
    brand: "Nintendo",
    family: "Nintendo 3DS",
    name: "Nintendo 3DS XL",
    type: "handheld",
    baseRange: [75, 150],
    demand: "hot",
    aliases: ["3ds xl", "new 3ds xl"],
  },
  {
    id: "nintendo-gameboy-color",
    brand: "Nintendo",
    family: "Game Boy",
    name: "Game Boy Color",
    type: "handheld",
    baseRange: [45, 95],
    demand: "hot",
    aliases: ["gbc", "gameboy color", "game boy color"],
  },
  {
    id: "nintendo-gameboy-advance-sp",
    brand: "Nintendo",
    family: "Game Boy",
    name: "Game Boy Advance SP",
    type: "handheld",
    baseRange: [65, 125],
    demand: "hot",
    aliases: ["gba sp", "advance sp", "gameboy advance sp"],
  },
  {
    id: "nintendo-gameboy-game",
    brand: "Nintendo",
    family: "Game Boy",
    name: "Game Boy Spiel",
    type: "game",
    baseRange: [8, 35],
    demand: "steady",
    aliases: ["game boy spiel", "gameboy spiel", "gb spiel"],
  },
  {
    id: "nintendo-n64",
    brand: "Nintendo",
    family: "Nintendo 64",
    name: "Nintendo 64 Konsole",
    type: "console",
    baseRange: [75, 150],
    demand: "hot",
    aliases: ["n64", "nintendo 64"],
  },
  {
    id: "nintendo-gamecube",
    brand: "Nintendo",
    family: "GameCube",
    name: "Nintendo GameCube",
    type: "console",
    baseRange: [80, 160],
    demand: "hot",
    aliases: ["gamecube", "game cube"],
  },
  {
    id: "microsoft-series-x",
    brand: "Microsoft",
    family: "Xbox Series",
    name: "Xbox Series X",
    type: "console",
    baseRange: [260, 380],
    demand: "hot",
    aliases: ["series x", "xbox series x"],
  },
  {
    id: "microsoft-series-s",
    brand: "Microsoft",
    family: "Xbox Series",
    name: "Xbox Series S",
    type: "console",
    baseRange: [120, 190],
    demand: "steady",
    aliases: ["series s", "xbox series s"],
  },
  {
    id: "pokemon-card-collection",
    brand: "Pokémon",
    family: "Karten",
    name: "Pokémon Karten Sammlung",
    type: "cards",
    baseRange: [20, 220],
    demand: "hot",
    aliases: ["pokemon karten", "pokémon karten", "karten sammlung"],
  },
  {
    id: "pokemon-gameboy-game",
    brand: "Pokémon",
    family: "Spiele",
    name: "Pokémon Game Boy Spiel",
    type: "game",
    baseRange: [35, 120],
    demand: "hot",
    aliases: ["pokemon gelb", "pokemon rot", "pokemon blau", "pokémon game boy"],
  },
  {
    id: "retro-snes",
    brand: "Retro",
    family: "SNES",
    name: "Super Nintendo Konsole",
    type: "console",
    baseRange: [75, 150],
    demand: "hot",
    aliases: ["snes", "super nintendo"],
  },
  {
    id: "retro-sega-mega-drive",
    brand: "Retro",
    family: "Sega",
    name: "Sega Mega Drive",
    type: "console",
    baseRange: [55, 115],
    demand: "steady",
    aliases: ["mega drive", "sega mega drive"],
  },
  {
    id: "accessory-controller-original",
    brand: "Zubehör",
    family: "Controller",
    name: "Original Controller",
    type: "accessory",
    baseRange: [10, 38],
    demand: "steady",
    aliases: ["controller", "original controller", "joy con", "dual sense"],
  },
];

const SEARCH_STOP_WORDS = new Set([
  "mit",
  "und",
  "plus",
  "inkl",
  "inklusive",
  "ein",
  "eine",
  "einer",
  "von",
  "zu",
  "stk",
  "stueck",
  "stück",
  "x",
]);

function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss");
}

function getSearchStems(part: string) {
  const stems = [part];
  if (part.endsWith("en") && part.length > 4) stems.push(part.slice(0, -2));
  if (part.endsWith("e") && part.length > 4) stems.push(part.slice(0, -1));
  return stems;
}

export function getBrands() {
  return Array.from(new Set(PRICE_VARIANTS.map((variant) => variant.brand)));
}

export function getFamilies(brand: string) {
  return Array.from(
    new Set(PRICE_VARIANTS.filter((variant) => variant.brand === brand).map((variant) => variant.family)),
  );
}

export function getVariants(brand: string, family: string) {
  return PRICE_VARIANTS.filter((variant) => variant.brand === brand && variant.family === family);
}

export function getVariantById(id: string) {
  return PRICE_VARIANTS.find((variant) => variant.id === id) ?? null;
}

export function getConditionById(id: ConditionId) {
  return PRICE_CONDITIONS.find((condition) => condition.id === id) ?? PRICE_CONDITIONS[1];
}

export function getCompletenessById(id: CompletenessId) {
  return PRICE_COMPLETENESS.find((item) => item.id === id) ?? PRICE_COMPLETENESS[1];
}

export function calculateRange(
  variant: PriceVariant,
  conditionId: ConditionId,
  completenessId: CompletenessId,
  quantity: number,
): PriceRange {
  const condition = getConditionById(conditionId);
  const completeness = getCompletenessById(completenessId);
  const amount = Math.max(1, Math.min(99, Math.round(quantity || 1)));
  const factor = condition.factor * completeness.factor;
  return [
    Math.max(1, Math.round(variant.baseRange[0] * factor * amount)),
    Math.max(2, Math.round(variant.baseRange[1] * factor * amount)),
  ];
}

export function searchVariants(query: string) {
  const normalized = normalizeSearchText(query.trim());
  if (!normalized) return PRICE_VARIANTS.slice(0, 8);

  const parts = normalized
    .split(/\s+/)
    .filter((part) => part && !/^\d+$/.test(part) && !SEARCH_STOP_WORDS.has(part));

  if (parts.length === 0) return PRICE_VARIANTS.slice(0, 8);

  return PRICE_VARIANTS.filter((variant) => {
    const haystack = [
      variant.brand,
      variant.family,
      variant.name,
      variant.type,
      variant.demand,
      ...variant.aliases,
    ]
      .join(" ")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ß/g, "ss");

    return parts.every((part) => getSearchStems(part).some((stem) => haystack.includes(stem)));
  }).slice(0, 8);
}
