// ============================================================
// RetrOase — Zentrale Konstanten (nie hardcoden)
// ============================================================

export const SITE = {
  name: "RetrOase",
  slogan: "Wo Gaming-Träume wahr werden.",
  domain: "retroase.de",
  url: "https://retroase.de",
  email: "hallo@retroase.de",
  adminEmail: "eren@retroase.de",
  phone: "", // WhatsApp-Nummer hier eintragen (mit Ländervorwahl, ohne +)
  whatsapp: "49", // Platzhalter — Nummer vervollständigen
  whatsappMessage: "Hallo RetrOase, ich habe eine Frage...",
  currency: "EUR",
  currencySymbol: "€",
  vat: 0.19, // 19% MwSt
  country: "DE",
  language: "de",
  ebayShopUrl: "https://www.ebay.de/usr/retroase", // Platzhalter
  instagramUrl: "https://www.instagram.com/retroase", // Platzhalter
  kaizenDeskUrl: "https://kaizendesk.de",
};

export const TEAM = {
  eren: {
    name: "Eren",
    role: "Inhaber & Gesicht von RetrOase",
    email: "eren@retroase.de",
  },
  emir: {
    name: "Emir",
    role: "Mitgründer & Bruder von Eren",
  },
  ibrahim: {
    name: "Ibrahim",
    role: "Mitgründer",
  },
};

export const CATEGORIES = [
  { id: "nintendo", label: "Nintendo", icon: "🎮", description: "SNES, N64, GameCube, Wii, Switch" },
  { id: "gameboy", label: "Game Boy", icon: "🕹️", description: "Original, Color, Advance, SP" },
  { id: "playstation", label: "PlayStation", icon: "🎯", description: "PS1, PS2, PS3, PS4 + Zubehör" },
  { id: "pokemon", label: "Pokémon", icon: "⚡", description: "Karten, Spiele, Zubehör" },
  { id: "zubehoer", label: "Zubehör", icon: "🔌", description: "Kabel, Akkus, Hüllen, Controller" },
  { id: "retro", label: "Retro", icon: "👾", description: "Sega, Atari & weitere Klassiker" },
] as const;

export const CONDITIONS = [
  { id: "sehr-gut", label: "Sehr Gut", color: "text-success", description: "Wie neu, kaum Gebrauchsspuren" },
  { id: "gut", label: "Gut", color: "text-accent-yellow", description: "Normale Gebrauchsspuren, voll funktionsfähig" },
  { id: "akzeptabel", label: "Akzeptabel", color: "text-warning", description: "Sichtbare Spuren, funktioniert einwandfrei" },
] as const;

export const BADGES = [
  { id: "NEU", label: "NEU", class: "badge-new" },
  { id: "SELTEN", label: "SELTEN", class: "badge-rare" },
  { id: "TOP-ZUSTAND", label: "TOP-ZUSTAND", class: "badge-top" },
  { id: "SCHNÄPPCHEN", label: "SCHNÄPPCHEN", class: "badge-deal" },
] as const;

export const TRUST_BADGES = [
  { icon: "✅", text: "Geprüfte Secondhand-Ware" },
  { icon: "🚀", text: "Versand in 1–2 Werktagen" },
  { icon: "⭐", text: "500+ eBay-Bewertungen" },
  { icon: "🇩🇪", text: "Shop aus Deutschland" },
  { icon: "🔒", text: "Sicher bezahlen" },
] as const;

export const TICKER_TEXT =
  "NINTENDO • PLAYSTATION • POKÉMON • GAME BOY • RETRO GAMING • MADE IN GERMANY • GEPRÜFTE WARE • SCHNELLER VERSAND • ";

export const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/ankauf", label: "Ankauf" },
  { href: "/blog", label: "Blog" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

export const FOOTER_LINKS = {
  shop: [
    { href: "/shop", label: "Alle Produkte" },
    { href: "/shop?category=nintendo", label: "Nintendo" },
    { href: "/shop?category=gameboy", label: "Game Boy" },
    { href: "/shop?category=playstation", label: "PlayStation" },
    { href: "/shop?category=pokemon", label: "Pokémon" },
  ],
  info: [
    { href: "/ankauf", label: "Ankauf" },
    { href: "/blog", label: "Blog" },
    { href: "/ueber-uns", label: "Über uns" },
    { href: "/kontakt", label: "Kontakt" },
  ],
  legal: [
    { href: "/impressum", label: "Impressum" },
    { href: "/datenschutz", label: "Datenschutz" },
    { href: "/agb", label: "AGB" },
    { href: "/widerruf", label: "Widerruf" },
  ],
} as const;

// Ankauf-Preisschätzer (ungefähre Richtwerte in Euro)
export const PRICE_ESTIMATES: Record<string, Record<string, Record<string, [number, number]>>> = {
  "Game Boy": {
    "Game Boy Original": {
      "Sehr Gut": [40, 70],
      "Gut": [25, 45],
      "Akzeptabel": [10, 25],
    },
    "Game Boy Color": {
      "Sehr Gut": [60, 100],
      "Gut": [40, 65],
      "Akzeptabel": [20, 40],
    },
    "Game Boy Advance": {
      "Sehr Gut": [50, 90],
      "Gut": [35, 55],
      "Akzeptabel": [15, 35],
    },
    "Game Boy Advance SP": {
      "Sehr Gut": [60, 100],
      "Gut": [40, 65],
      "Akzeptabel": [20, 40],
    },
  },
  "Nintendo": {
    "SNES": { "Sehr Gut": [80, 150], "Gut": [50, 90], "Akzeptabel": [25, 50] },
    "Nintendo 64": { "Sehr Gut": [90, 160], "Gut": [60, 100], "Akzeptabel": [30, 60] },
    "GameCube": { "Sehr Gut": [100, 180], "Gut": [70, 120], "Akzeptabel": [40, 70] },
    "Wii": { "Sehr Gut": [60, 100], "Gut": [40, 70], "Akzeptabel": [20, 40] },
  },
  "PlayStation": {
    "PlayStation 1": { "Sehr Gut": [70, 120], "Gut": [45, 80], "Akzeptabel": [20, 45] },
    "PlayStation 2": { "Sehr Gut": [80, 130], "Gut": [55, 90], "Akzeptabel": [25, 55] },
    "PlayStation 3": { "Sehr Gut": [50, 90], "Gut": [30, 60], "Akzeptabel": [15, 30] },
    "PlayStation 4": { "Sehr Gut": [150, 250], "Gut": [100, 170], "Akzeptabel": [70, 110] },
  },
  "Pokémon": {
    "Pokémon-Karten (Sammlung)": { "Sehr Gut": [30, 200], "Gut": [15, 80], "Akzeptabel": [5, 30] },
    "Pokémon-Spiel (Game Boy)": { "Sehr Gut": [40, 120], "Gut": [25, 70], "Akzeptabel": [10, 30] },
  },
};

export const SHIPPING_INFO = {
  daysMin: 1,
  daysMax: 2,
  freeShippingAbove: 50, // Kostenloser Versand ab 50€ [ASSUMPTION]
};
