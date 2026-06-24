// Einmal-Skript: echte Konsolen-Fotos (Wikimedia/Commons, CC/PD) laden,
// Hintergrund per ML transparent freistellen, auf ein einheitliches Quadrat
// normalisieren und als /public/ankauf/devices/<key>.png speichern.
// Erzeugt zusaetzlich deviceImages.generated.ts (Key -> Pfad) + eine Montage
// zur Sichtpruefung. Nicht zur Laufzeit verwendet.
import { removeBackground } from "@imgly/background-removal-node";
import Jimp from "jimp";
import { writeFile, mkdir } from "node:fs/promises";

const UA = { headers: { "User-Agent": "RetrOase-dev/1.0 (one-time console photo build; dev@retroase.local)" } };
const OUT = "public/ankauf/devices";
const SIZE = 512;
const PAD = 0.1;

const U = (x) => (x.startsWith("http") ? x : `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(x)}`);

// key -> { src: [Kandidaten (URL oder Commons-Dateiname)], query: Commons-Suche als Fallback }
const DEVICES = {
  "ps5-disc": { src: ["https://upload.wikimedia.org/wikipedia/commons/1/1b/PlayStation_5_and_DualSense_with_transparent_background.png"], query: "PlayStation 5 console" },
  "ps5-digital": { src: ["https://upload.wikimedia.org/wikipedia/commons/0/03/PS5DigitalEdition.png"], query: "PlayStation 5 Digital Edition console" },
  "ps5-slim": { src: ["https://upload.wikimedia.org/wikipedia/commons/4/4b/Playstation_5_mod%C3%A8le_slim_%28%C3%A9dition_standard_avec_lecteur_de_disque_amovible.png"], query: "PlayStation 5 Slim console" },
  "ps4": { src: ["PS4-Console-wDS4.jpg"], query: "PlayStation 4 console" },
  "ps4-slim": { src: ["PlayStation 4 Slim video game console.jpg"], query: "PlayStation 4 Slim console" },
  "ps2-slim": { src: ["PS2-Slim-Console-Set.jpg"], query: "PlayStation 2 Slim console" },
  "switch": { src: ["Nintendo-Switch-Console-Docked-wJoyConRB.jpg"], query: "Nintendo Switch console" },
  "switch-lite": { src: ["Nintendo-Switch-Lite-Coral.png", "Nintendo Switch Lite Coral.jpg"], query: "Nintendo Switch Lite" },
  "ds-lite": { src: ["Nintendo-DS-Lite.png", "Nintendo-DSLite.png"], query: "Nintendo DS Lite" },
  "dsi": { src: ["Nintendo-DSi.png", "Nintendo-DSi-Black.png"], query: "Nintendo DSi console" },
  "3ds-xl": { src: ["New-Nintendo-3DS-XL.png", "Nintendo-3DS-XL-Blue.png"], query: "New Nintendo 3DS XL" },
  "gameboy-color": { src: ["Nintendo-Game-Boy-Color-FL.jpg", "Game-Boy-Color-Purple.png"], query: "Game Boy Color" },
  "gba-sp": { src: ["Nintendo-Game-Boy-Advance-SP-Mk1.png", "Game-Boy-Advance-SP.png"], query: "Game Boy Advance SP" },
  "n64": { src: ["Nintendo-64-wController-L.jpg"], query: "Nintendo 64 console" },
  "gamecube": { src: ["GameCube-Console-Set.png"], query: "Nintendo GameCube console" },
  "snes": { src: ["SNES-Mod1-Console-Set.jpg", "Nintendo-Super-Famicom-Console-Set-FL.jpg"], query: "Super Nintendo Entertainment System console" },
  "sega": { src: ["Sega-Genesis-Mk2-6button.jpg", "Sega-Mega-Drive-EU-Mk1-wController-FL.jpg"], query: "Sega Genesis console" },
  "xbox-series-x": { src: ["https://upload.wikimedia.org/wikipedia/commons/1/12/Xbox_Series_X_2.jpg"], query: "Xbox Series X console" },
  "xbox-series-s": { src: ["Xbox-Series-S.jpg"], query: "Xbox Series S console" },
};

async function firstOk(urls) {
  for (const u of urls) {
    try {
      const r = await fetch(u, UA);
      if (r.ok) return { url: u, ab: await r.arrayBuffer() };
    } catch {}
  }
  return null;
}

async function commonsSearch(query) {
  const u =
    `https://commons.wikimedia.org/w/api.php?action=query&generator=search` +
    `&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=8` +
    `&prop=imageinfo&iiprop=url|size|mime&format=json&origin=*`;
  try {
    const r = await fetch(u, UA);
    const j = await r.json();
    const items = Object.values(j?.query?.pages ?? {})
      .map((p) => p.imageinfo?.[0])
      .filter(Boolean)
      .filter((i) => /image\/(jpeg|png)/.test(i.mime) && i.width >= 400 && i.width <= 6000)
      .filter((i) => !/logo|motherboard|teardown|chip|pcb/i.test(i.url));
    return items[0]?.url ?? null;
  } catch {
    return null;
  }
}

async function normalize(cut) {
  const inner = Math.round(SIZE * (1 - 2 * PAD));
  const img = await Jimp.read(cut);
  img.autocrop({ tolerance: 0.02, cropOnlyFrames: false });
  img.contain(inner, inner);
  const canvas = new Jimp(SIZE, SIZE, 0x00000000);
  canvas.composite(img, Math.round((SIZE - img.bitmap.width) / 2), Math.round((SIZE - img.bitmap.height) / 2));
  return await canvas.getBufferAsync(Jimp.MIME_PNG);
}

await mkdir(OUT, { recursive: true });
const map = {};
const tiles = [];

for (const [key, cfg] of Object.entries(DEVICES)) {
  let got = await firstOk(cfg.src.map(U));
  if (!got && cfg.query) {
    const u = await commonsSearch(cfg.query);
    if (u) got = await firstOk([u]);
  }
  if (!got) {
    console.log(`MISS ${key}`);
    continue;
  }
  try {
    const mime = /\.png(\?|$)/i.test(got.url) ? "image/png" : "image/jpeg";
    const cutBlob = await removeBackground(new Blob([got.ab], { type: mime }));
    const cut = Buffer.from(await cutBlob.arrayBuffer());
    const final = await normalize(cut);
    await writeFile(`${OUT}/${key}.png`, final);
    map[key] = `/ankauf/devices/${key}.png`;
    tiles.push({ key, final });
    console.log(`OK ${key} <- ${decodeURIComponent(got.url.split("/").pop())}`);
  } catch (e) {
    console.log(`FAIL ${key}: ${e.message}`);
  }
}

// deviceImages.generated.ts
const sorted = Object.keys(map).sort();
const body = sorted.map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(map[k])},`).join("\n");
const ts =
  `// AUTO-GENERIERT von scripts/build-console-photos.mjs — nicht von Hand editieren.\n` +
  `// Echte, freigestellte Konsolen-Fotos (Wikimedia, CC/PD). Greifen als Fallback,\n` +
  `// wenn in Supabase noch kein eigenes Bild gepflegt ist.\n` +
  `export const DEVICE_IMAGES: Record<string, string> = {\n${body}\n};\n`;
await writeFile("components/ankauf/v2/price/deviceImages.generated.ts", ts);

// Montage zur Sichtpruefung (graue "Showcase"-Kacheln wie spaeter im UI)
const COL = 5;
const T = 200;
const rows = Math.ceil(tiles.length / COL);
const montage = new Jimp(COL * T, rows * T, 0x0c0c10ff);
for (let i = 0; i < tiles.length; i++) {
  const cell = new Jimp(T - 8, T - 8, 0x2c2c36ff);
  const dev = await Jimp.read(tiles[i].final);
  dev.contain(150, 150);
  cell.composite(dev, Math.round((cell.bitmap.width - dev.bitmap.width) / 2), Math.round((cell.bitmap.height - dev.bitmap.height) / 2));
  montage.composite(cell, (i % COL) * T + 4, Math.floor(i / COL) * T + 4);
}
await montage.writeAsync(`${OUT}/_montage.png`);

console.log(`\nDONE ${sorted.length}/${Object.keys(DEVICES).length} -> montage at ${OUT}/_montage.png`);
console.log("keys:", sorted.join(", "));
