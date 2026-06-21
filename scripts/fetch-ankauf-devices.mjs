// Einmaliges, schluessel-freies Skript: laedt saubere Konsolen-Produktfotos von
// Wikimedia nach /public/ankauf/devices und schreibt eine getypte Map
// (deviceImages.generated.ts), die das Preis-Tool als Bild-Fallback importiert.
//
// Lauf: node scripts/fetch-ankauf-devices.mjs
//
// Quellen: Wikipedia-REST-Lead-Image (WIKI) bzw. fest gewaehlte Wikimedia-Commons-
// Dateien (COMMONS, meist Evan-Amos / Public Domain, weisser Hintergrund). Bilder
// sind CC/PD — fuer den finalen Shop spaeter durch eigene Produktfotos ersetzen;
// der Resolver greift automatisch, sobald in Supabase ein Bild gepflegt ist.
//
// Groesse: Wikimedia rendert fuer grosse PNGs keine beliebigen Thumb-Breiten
// (HTTP 400). Wir probieren darum absteigende Breiten und nehmen die groesste,
// die 200 liefert; erst als letzter Ausweg das (grosse) Original.

import { mkdirSync, writeFileSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const OUT_DIR = join(ROOT, "public", "ankauf", "devices");
const MAP_FILE = join(ROOT, "components", "ankauf", "v2", "price", "deviceImages.generated.ts");
const UA = "RetrOase-dev/1.0 (one-time console image fetch; contact: dev@retroase.local)";
const WIDTHS = [720, 660, 640, 600, 560, 500, 480, 440, 400, 360, 330, 320, 300, 256, 250, 220];

// REST-Lead-Image dieser Artikel ist ein echtes Produktfoto.
const WIKI = [
  ["ps5", "PlayStation_5"],
  ["ps4", "PlayStation_4"],
  ["ps3", "PlayStation_3"],
  ["ps2", "PlayStation_2"],
  ["3ds", "Nintendo_3DS"],
  ["ds", "Nintendo_DS"],
  ["gameboy", "Game_Boy"],
  ["gamecube", "GameCube"],
  ["wii", "Wii"],
  ["snes", "Super_Nintendo_Entertainment_System"],
  ["nes", "Nintendo_Entertainment_System"],
  ["xbox-one", "Xbox_One"],
  ["sega", "Sega_Genesis"],
];

// Wo das Lead-Image nur ein Logo ist: fest gewaehlte Commons-Fotos (verifiziert).
const COMMONS = [
  ["ps1", "PSX-Console-wController.jpg"],
  ["switch", "Nintendo-Switch-Console-Docked-wJoyConRB.jpg"],
  // Kein frei lizenziertes, sauberes Xbox-Series-X-Foto auf Commons vorhanden
  // (MS-Pressebilder sind nicht CC). Sauberes Logo auf Weiss statt Regal-Schnappschuss.
  ["xbox-series", "Xbox_Series_X.png"],
  ["n64", "Nintendo-64-wController-L.jpg"],
  ["xbox-360", "Xbox-360S-Console-Set.png"],
];

function bumpWidthVariants(thumbUrl) {
  return WIDTHS.map((w) => thumbUrl.replace(/\/\d+px-/, `/${w}px-`));
}

function filePathVariants(file) {
  const enc = encodeURIComponent(file);
  const base = `https://commons.wikimedia.org/wiki/Special:FilePath/${enc}`;
  return [...WIDTHS.map((w) => `${base}?width=${w}`), base];
}

function extFromName(name) {
  const raw = (name.split("?")[0].split(".").pop() || "png").toLowerCase();
  return ["png", "jpg", "jpeg", "webp"].includes(raw) ? raw : "png";
}

async function firstOk(urls) {
  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA } });
      if (res.ok) return { res, url };
    } catch {
      // weiter zur naechsten Breite
    }
  }
  return null;
}

async function resolveWikiCandidates(title) {
  const summary = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`,
    { headers: { "User-Agent": UA, accept: "application/json" } },
  );
  if (!summary.ok) return null;
  const data = await summary.json();
  const thumb = data?.thumbnail?.source;
  const original = data?.originalimage?.source;
  const urls = [];
  if (thumb) urls.push(...bumpWidthVariants(thumb));
  if (original) urls.push(original);
  return urls.length ? urls : null;
}

// Vorherige Bilder loeschen, damit keine Logo-/Format-Leichen liegen bleiben.
mkdirSync(OUT_DIR, { recursive: true });
for (const f of readdirSync(OUT_DIR)) rmSync(join(OUT_DIR, f));

const map = {};

async function save(key, urls, extHint) {
  if (!urls) {
    console.log(`SKIP ${key}: keine Bild-URL`);
    return;
  }
  const hit = await firstOk(urls);
  if (!hit) {
    console.log(`SKIP ${key}: alle URLs HTTP-Fehler`);
    return;
  }
  const buf = Buffer.from(await hit.res.arrayBuffer());
  const ext = extHint ?? extFromName(hit.url);
  const file = `${key}.${ext}`;
  writeFileSync(join(OUT_DIR, file), buf);
  map[key] = `/ankauf/devices/${file}`;
  console.log(`OK   ${file.padEnd(18)} ${(buf.length / 1024).toFixed(0).padStart(4)} KB`);
}

for (const [key, title] of WIKI) {
  try {
    await save(key, await resolveWikiCandidates(title), null);
  } catch (err) {
    console.log(`ERR  ${key}: ${err.message}`);
  }
}

for (const [key, file] of COMMONS) {
  try {
    await save(key, filePathVariants(file), extFromName(file));
  } catch (err) {
    console.log(`ERR  ${key}: ${err.message}`);
  }
}

const entries = Object.entries(map)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([k, v]) => `  "${k}": "${v}",`)
  .join("\n");

const ts = `// AUTO-GENERIERT von scripts/fetch-ankauf-devices.mjs — nicht von Hand editieren.
// Lokale Konsolen-Produktfotos (Wikimedia, CC/PD). Greifen als Fallback, wenn
// in Supabase noch kein eigenes Bild gepflegt ist.
export const DEVICE_IMAGES: Record<string, string> = {
${entries}
};
`;

writeFileSync(MAP_FILE, ts);
console.log(`\n-> ${Object.keys(map).length} Bilder, Map geschrieben: ${MAP_FILE}`);
