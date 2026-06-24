import type { PriceVariant } from "./priceCatalog";

// Marken-Glyphen statt Stock-Fotos: gezeichnete Konsolen-Silhouetten im
// RetrOase-Look. Farben kommen aus CSS-Variablen (--gx-*), die in ankauf.css je
// nach Hell/Dunkel gesetzt werden, damit das Glyph immer zur Seite passt.
// Greift als Vorschau, wenn in Supabase noch kein echtes Produktbild gepflegt ist.

type GlyphKind =
  | "ps-tower"
  | "ps-flat"
  | "xbox-x"
  | "xbox-s"
  | "switch"
  | "clamshell"
  | "handheld-bar"
  | "n64"
  | "gamecube"
  | "snes"
  | "sega"
  | "cart"
  | "cards"
  | "gamepad"
  | "box";

interface Glyph {
  kind: GlyphKind;
  disc: boolean;
  slim: boolean;
}

function norm(value: string): string {
  return value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ß/g, "ss");
}

// Reihe/Modell -> Glyph-Archetyp. Reihenfolge: spezifisch vor generisch.
export function resolveGlyph(variant?: PriceVariant | null): Glyph {
  const base: Glyph = { kind: "box", disc: false, slim: false };
  if (!variant) return base;
  const t = norm(`${variant.family} ${variant.name}`);
  const slim = t.includes("slim") || t.includes("lite");

  if (variant.type === "cards") return { ...base, kind: "cards" };
  if (variant.type === "accessory" || t.includes("controller")) return { ...base, kind: "gamepad" };
  if (variant.type === "game") return { ...base, kind: "cart" };

  if (t.includes("playstation 5") || t.includes("ps5")) {
    return { kind: "ps-tower", disc: !t.includes("digital"), slim };
  }
  if (t.includes("playstation") || /\bps[1-4]\b/.test(t)) return { kind: "ps-flat", disc: false, slim };
  if (t.includes("xbox series s")) return { ...base, kind: "xbox-s" };
  if (t.includes("xbox")) return { ...base, kind: "xbox-x" };
  if (t.includes("switch")) return { kind: "switch", disc: false, slim };
  if (t.includes("game boy") || t.includes("gameboy")) {
    return t.includes("sp") ? { ...base, kind: "clamshell" } : { ...base, kind: "handheld-bar" };
  }
  if (t.includes("3ds") || t.includes("nintendo ds") || t.includes("dsi") || t.includes(" ds")) {
    return { ...base, kind: "clamshell" };
  }
  if (t.includes("nintendo 64") || t.includes("n64")) return { ...base, kind: "n64" };
  if (t.includes("gamecube") || t.includes("game cube")) return { ...base, kind: "gamecube" };
  if (t.includes("snes") || t.includes("super nintendo") || t.includes("super famicom")) {
    return { ...base, kind: "snes" };
  }
  if (t.includes("sega") || t.includes("mega drive") || t.includes("genesis")) return { ...base, kind: "sega" };
  return base;
}

const BODY = "var(--gx-body)";
const PANEL = "var(--gx-body-2)";
const ACCENT = "var(--gx-accent)";

function GlyphBody({ glyph }: { glyph: Glyph }) {
  switch (glyph.kind) {
    // PS5: stehender Tower. Disc = Laufwerks-Block links, Digital = glatt.
    // Slim = gedrungener mit dunkler unterer Haelfte.
    case "ps-tower":
      return glyph.slim ? (
        <>
          <rect x="43" y="28" width="42" height="74" rx="9" fill={BODY} />
          <path d="M43 68 h42 v25 a9 9 0 0 1 -9 9 H52 a9 9 0 0 1 -9 -9 Z" fill={PANEL} />
          <rect x="59" y="30" width="10" height="70" rx="3" fill={PANEL} stroke="none" />
          <rect x="36" y="100" width="56" height="8" rx="4" fill={PANEL} />
          {glyph.disc ? (
            <rect x="48" y="46" width="9" height="15" rx="2" fill={ACCENT} stroke="none" />
          ) : (
            <circle cx="64" cy="84" r="3.2" fill={ACCENT} stroke="none" />
          )}
        </>
      ) : (
        <>
          <rect x="47" y="13" width="34" height="93" rx="8" fill={BODY} />
          <rect x="59" y="15" width="10" height="89" rx="3" fill={PANEL} stroke="none" />
          <rect x="40" y="103" width="48" height="8" rx="4" fill={PANEL} />
          {glyph.disc ? (
            <rect x="49" y="58" width="8" height="17" rx="2" fill={ACCENT} stroke="none" />
          ) : (
            <circle cx="52" cy="95" r="3" fill={ACCENT} stroke="none" />
          )}
        </>
      );

    // PlayStation flach/schraeg (PS4/PS3/PS2): geneigter Riegel mit Disc-Schlitz.
    case "ps-flat":
      return (
        <>
          <path d="M24 71 L104 53 L104 75 L24 89 Z" fill={BODY} />
          <path d="M24 71 L104 53 L95 45 L16 63 Z" fill={PANEL} />
          <path d="M64 58 L64 87" stroke={ACCENT} strokeWidth="2" />
          <path d="M44 80 L60 77" stroke={ACCENT} strokeWidth="2.6" />
          <circle cx="36" cy="83" r="2.6" fill={ACCENT} stroke="none" />
        </>
      );

    // Xbox Series X: hoher Monolith mit rundem Lueftungsgitter oben.
    case "xbox-x":
      return (
        <>
          <rect x="49" y="13" width="30" height="95" rx="6" fill={BODY} />
          <circle cx="64" cy="27" r="11" fill={PANEL} />
          <circle cx="64" cy="27" r="11" fill="none" stroke={ACCENT} strokeWidth="2" />
          <circle cx="64" cy="27" r="3" fill={ACCENT} stroke="none" />
          <rect x="56" y="98" width="16" height="3" rx="1.5" fill={ACCENT} stroke="none" />
        </>
      );

    // Xbox Series S: kompakter, grosser runder Lueftungskreis.
    case "xbox-s":
      return (
        <>
          <rect x="45" y="30" width="38" height="64" rx="7" fill={BODY} />
          <circle cx="64" cy="49" r="13" fill={PANEL} />
          <circle cx="64" cy="49" r="13" fill="none" stroke={ACCENT} strokeWidth="2" />
          <rect x="56" y="84" width="16" height="3" rx="1.5" fill={ACCENT} stroke="none" />
        </>
      );

    // Switch: Tablet + zwei Joy-Cons. Lite = Unibody ohne Spalt.
    case "switch":
      return glyph.slim ? (
        <>
          <rect x="33" y="36" width="62" height="56" rx="11" fill={BODY} />
          <rect x="49" y="42" width="30" height="44" rx="3" fill={PANEL} />
          <path d="M42 58 v12 M36 64 h12" stroke={ACCENT} strokeWidth="2.6" />
          <circle cx="86" cy="60" r="2.6" fill={ACCENT} stroke="none" />
          <circle cx="86" cy="70" r="2.6" fill={ACCENT} stroke="none" />
        </>
      ) : (
        <>
          <rect x="46" y="32" width="36" height="62" rx="5" fill={PANEL} />
          <rect x="50" y="37" width="28" height="52" rx="3" fill="none" stroke={ACCENT} strokeWidth="1.8" />
          <rect x="30" y="32" width="16" height="62" rx="8" fill={BODY} />
          <rect x="82" y="32" width="16" height="62" rx="8" fill={BODY} />
          <circle cx="38" cy="48" r="2.4" fill={ACCENT} stroke="none" />
          <circle cx="90" cy="78" r="2.4" fill={ACCENT} stroke="none" />
        </>
      );

    // Klapp-Handheld (DS / 3DS / GBA SP): oben Display, unten Tasten.
    case "clamshell":
      return (
        <>
          <rect x="36" y="18" width="56" height="42" rx="6" fill={BODY} />
          <rect x="43" y="24" width="42" height="30" rx="3" fill={PANEL} />
          <rect x="36" y="64" width="56" height="44" rx="6" fill={BODY} />
          <path d="M48 84 v12 M42 90 h12" stroke={ACCENT} strokeWidth="2.6" />
          <circle cx="78" cy="86" r="2.8" fill={ACCENT} stroke="none" />
          <circle cx="84" cy="93" r="2.8" fill={ACCENT} stroke="none" />
        </>
      );

    // Game Boy (Color): stehender Riegel, Display oben, Steuerung unten.
    case "handheld-bar":
      return (
        <>
          <rect x="44" y="14" width="40" height="94" rx="11" fill={BODY} />
          <rect x="51" y="22" width="26" height="26" rx="3" fill={PANEL} />
          <path d="M56 72 v12 M50 78 h12" stroke={ACCENT} strokeWidth="2.6" />
          <circle cx="74" cy="74" r="3" fill={ACCENT} stroke="none" />
          <circle cx="80" cy="82" r="3" fill={ACCENT} stroke="none" />
        </>
      );

    // Nintendo 64: trapezfoermiges Gehaeuse mit Cartridge-Slot.
    case "n64":
      return (
        <>
          <path d="M32 98 L96 98 L87 56 L41 56 Z" fill={BODY} />
          <rect x="53" y="50" width="22" height="10" rx="2" fill={PANEL} />
          <circle cx="64" cy="76" r="6" fill={ACCENT} stroke="none" />
          <path d="M45 92 h6 M59 92 h6 M73 92 h6" stroke={ACCENT} strokeWidth="3" />
        </>
      );

    // GameCube: Wuerfel mit Disc-Deckel oben + Tragegriff.
    case "gamecube":
      return (
        <>
          <path d="M50 46 q14 -12 28 0" fill="none" stroke={ACCENT} strokeWidth="2.4" />
          <rect x="41" y="48" width="46" height="52" rx="8" fill={BODY} />
          <circle cx="64" cy="64" r="13" fill={PANEL} />
          <circle cx="64" cy="64" r="13" fill="none" stroke={ACCENT} strokeWidth="2" />
          <circle cx="64" cy="90" r="3" fill={ACCENT} stroke="none" />
        </>
      );

    // Super Nintendo: gedrungenes Gehaeuse mit Cartridge-Schacht + Streifen.
    case "snes":
      return (
        <>
          <rect x="31" y="50" width="66" height="40" rx="9" fill={BODY} />
          <rect x="51" y="42" width="26" height="12" rx="2" fill={PANEL} />
          <rect x="40" y="80" width="48" height="3" rx="1.5" fill={ACCENT} stroke="none" />
          <circle cx="84" cy="62" r="3" fill={ACCENT} stroke="none" />
          <circle cx="44" cy="62" r="3" fill={ACCENT} stroke="none" />
        </>
      );

    // Sega Mega Drive: flacher Riegel mit grossem Rundregler + Slot.
    case "sega":
      return (
        <>
          <rect x="33" y="54" width="62" height="34" rx="7" fill={BODY} />
          <rect x="50" y="46" width="28" height="10" rx="2" fill={PANEL} />
          <circle cx="48" cy="71" r="7" fill="none" stroke={ACCENT} strokeWidth="2.2" />
          <circle cx="48" cy="71" r="2.4" fill={ACCENT} stroke="none" />
          <path d="M68 67 h18 M68 73 h18" stroke={ACCENT} strokeWidth="2.2" />
        </>
      );

    // Spiel-Cartridge: Modul mit Label + Rippen unten.
    case "cart":
      return (
        <>
          <path d="M40 30 L40 96 L88 96 L88 38 L78 22 L40 22 Z" fill={BODY} />
          <rect x="48" y="34" width="32" height="26" rx="2" fill={ACCENT} stroke="none" opacity="0.92" />
          <path d="M48 78 h32 M48 85 h32" stroke={PANEL} strokeWidth="3" />
        </>
      );

    // Sammelkarten: aufgefaecherte Stapel mit Akzent-Kreis.
    case "cards":
      return (
        <>
          <rect x="44" y="32" width="40" height="60" rx="5" fill={PANEL} transform="rotate(-13 64 62)" />
          <rect x="44" y="32" width="40" height="60" rx="5" fill={BODY} transform="rotate(11 64 62)" />
          <circle cx="68" cy="62" r="9" fill="none" stroke={ACCENT} strokeWidth="2.4" transform="rotate(11 64 62)" />
          <path d="M59 62 h18" stroke={ACCENT} strokeWidth="2.4" transform="rotate(11 64 62)" />
        </>
      );

    // Controller: moderner Gamepad-Umriss mit D-Pad + Tasten.
    case "gamepad":
      return (
        <>
          <path
            d="M38 50 H90 Q100 50 102 62 L106 82 Q108 94 96 92 Q86 90 80 82 H48 Q42 90 32 92 Q20 94 22 82 L26 62 Q28 50 38 50 Z"
            fill={BODY}
          />
          <path d="M44 66 v12 M38 72 h12" stroke={ACCENT} strokeWidth="2.8" />
          <circle cx="84" cy="66" r="2.8" fill={ACCENT} stroke="none" />
          <circle cx="92" cy="74" r="2.8" fill={ACCENT} stroke="none" />
          <circle cx="76" cy="74" r="2.8" fill={ACCENT} stroke="none" />
          <circle cx="84" cy="82" r="2.8" fill={ACCENT} stroke="none" />
        </>
      );

    // Generische Konsole als letzter Fallback.
    default:
      return (
        <>
          <rect x="32" y="50" width="64" height="36" rx="8" fill={BODY} />
          <path d="M44 78 L72 74" stroke={ACCENT} strokeWidth="2.6" />
          <circle cx="84" cy="62" r="3" fill={ACCENT} stroke="none" />
        </>
      );
  }
}

export function ConsoleGlyph({ variant }: { variant?: PriceVariant | null }) {
  const glyph = resolveGlyph(variant);
  return (
    <svg
      className="ak-console-glyph"
      viewBox="0 0 128 128"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="var(--gx-edge)" strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round">
        <GlyphBody glyph={glyph} />
      </g>
    </svg>
  );
}
