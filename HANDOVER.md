# HANDOVER — RetrOase `/ankauf` "VAULT" Redesign

> Lebender Übergabe-Stand für die Ankauf-Seite. **Nach jedem größeren Schritt aktualisieren**,
> damit ein anderer Agent (z. B. Codex) nahtlos mit dem aktuellen Stand weiterarbeiten kann.

**Letztes Update:** 2026-06-21 — Echte Konsolen-Produktfotos (Wikimedia, lokal) + automatischer Bild-Resolver; gefuehrter Modell-Schritt vergroessert.

### Changelog 2026-06-21 — Konsolen-Fotos + groesserer Modell-Schritt
**Task (User):** „Hier fehlen die Bilder der Konsolen, ich will das Außerdem noch größer haben!"
- **Bild-Quelle (schluessel-frei):** `scripts/fetch-ankauf-devices.mjs` laedt 18 saubere Konsolenfotos (Wikimedia/Evan-Amos, CC/PD, weisser Hintergrund) nach `public/ankauf/devices/` (~2.7 MB gesamt, ueber absteigende Thumb-Breiten klein gehalten) und schreibt die getypte Map `components/ankauf/v2/price/deviceImages.generated.ts`. Erneut ausfuehrbar: `node scripts/fetch-ankauf-devices.mjs`.
- **Resolver:** `getDeviceKey()` + `getLocalDeviceImage()` in `AnkaufPriceToolV2.tsx`; in `getVariantImage()` als **Fallback** verdrahtet (Reihenfolge: Supabase `imageUrl` → `familyImageUrl` → lokales Konsolenfoto). D. h. sobald im Admin ein echtes Bild gepflegt ist, gewinnt das automatisch.
- **Ausnahme:** Xbox Series X = sauberes Logo statt Foto (kein frei lizenziertes MS-Pressefoto auf Commons). Spiele/Karten/Zubehör haben (noch) kein Foto → Platzhalter.
- **Optik:** `.ak-model-visual` + `.ak-modell-hero-img` jetzt helle „Produkt-Plate" in **beiden** Themes (freigestellte Fotos verschmelzen), Fallback-Text dort fix dunkel. Gefuehrter Modell-Schritt vergroessert (`.ak-modell-split` breiter/mehr gap, groessere Kacheln + Bilder).
- **Verifiziert:** `tsc --noEmit` EXIT 0, `/ankauf` HTTP 200, Device-Files 200, next/image-Optimizer 200.
- **Lizenz-Hinweis:** Wikimedia-Fotos sind CC/PD (nominative Nutzung wie rebuy/momox) — fuer finalen Shop spaeter durch eigene Produktfotos ersetzen (Resolver greift dann automatisch).

---

## 1. Was wird gebaut
`/ankauf` wird zu einem Premium **"Dark Casino × Retro-Gaming"-Erlebnis ("VAULT")** mit Fokus auf
maximale Conversion/Emotion. Acht Phasen:

1. **Hero** ✅ (fertig & vom Kunden abgenommen)
2. **Scroll-Erlebnis** (6 Sektionen) ✅ (S1–S6 fertig)
3. **Preis-Tool / Preisschätzer** ← *läuft gerade* (Tool V2 + „Wert enthüllen"-Reveal + Trade-In fertig; Supabase-Admin offen)
4. Wizard-Redesign + Barcode-Scanner
5. Coins/Gamification + Sound (Tone.js, default stumm)
6. Micro-Animationen + Custom Cursor
7. Mobile-Feinschliff
8. Performance (Lighthouse 85+)

## 2. ⚠️ INVARIANTEN — NICHT BRECHEN
- **Backend unangetastet:** Supabase-Wizard-Pipeline, `POST /api/ankauf`, `/ankauf/status`, Admin-Freigabe. Datenvertrag des Wizards 1:1 lassen.
- **Anker-IDs bleiben:** `#angebot` (Wizard) und `#preisschaetzer`. CTAs scrollen dorthin.
- **Scoped Design:** ALLE neuen Styles unter `.ak-stage`, alle Klassen `ak-`-prefixed. **Kein** Eingriff ins globale OBSIDIAN-Design (globals.css / Tailwind-Theme des restlichen Shops).
- **Hero (`AnkaufHeroV2`) nicht verändern** (abgenommen).

## 3. Stack / Pakete
Next 14.2 App Router · TS strict · Tailwind. Animation: `framer-motion`, `gsap` (+ScrollTrigger),
`lenis` (Smooth Scroll), `three` + `@react-three/fiber@8` + `@react-three/drei@9`. Später:
`tone` (Sound, Phase 5), `lottie-react`, `zustand`.
**In Phase 2 neu installiert:** `lenis`.

## 4. Konventionen / Patterns (WICHTIG für neue Sektionen)
- **reduced-motion:** Jede Sektion respektiert `prefers-reduced-motion`. JS-Effekte mit `useReducedMotion()` gaten; reduced → statisch sichtbar. Pre-hidden Elemente in CSS (`opacity:0`) + reduced-Override auf `opacity:1`.
- **GSAP-Muster** (jede Client-Sektion):
  ```ts
  gsap.registerPlugin(ScrollTrigger);
  const ctx = gsap.context(() => { /* ...fromTo mit scrollTrigger... */ }, rootRef);
  return () => ctx.revert();
  ```
  **`fromTo`** statt `from` benutzen, wenn Elemente in CSS pre-hidden sind (kein Flash). `gsap.context(fn, rootRef)` scoped Selektoren auf die Sektion.
- **Lenis ↔ ScrollTrigger** wird zentral in `SmoothScroll.tsx` (Layout) synchronisiert. Sektionen müssen nichts tun außer ScrollTrigger benutzen.
- **Counter:** `useCountUp(target, { duration, delay, enabled: !reduced })` — feuert via IntersectionObserver, sauberes Cleanup, `started`-Flag für "???"-Platzhalter.
- **Canvas-Effekte (Partikel/Konfetti):** rAF + IntersectionObserver (Trigger/Pause), DPR-Cap 2, Cleanup im `useEffect`-Return.
- **Performance:** nur `transform`/`opacity` animieren; `will-change` sparsam; Loops pausieren wenn offscreen.

## 5. GateGuard-Hook (Workflow-Hinweis)
Ein lokaler ECC-Hook ("Fact-Forcing Gate") blockt den **ersten** Zugriff pro Datei (und den ersten Bash)
je Session-Fenster (~30 min State in `~/.gateguard`) und verlangt kurze Fakten. Vorgehen: Fakten nennen,
dann dieselbe Operation **1× erneut** ausführen. Dauerhaft aus: Session mit `ECC_GATEGUARD=off` starten.

## 6. Dateistruktur (Phase 1–3)
```
app/ankauf/
  layout.tsx          Bebas-Neue-Font (route-scoped) + import ankauf.css + <SmoothScroll>
  ankauf.css          gescoptes "VAULT"-Design-System + ALLE Sektions-Styles
  page.tsx            Reihenfolge der Sektionen (siehe unten)
components/ankauf/v2/
  lib/hooks.ts        useReducedMotion, useMediaQuery, useIsDesktop, useMounted
  lib/useCountUp.ts   Count-up-Hook (IntersectionObserver + rAF)
  scroll/SmoothScroll.tsx       Lenis-Provider (im Layout)
  scroll/Section1Value.tsx      S1 — Wertkarten
  scroll/Section2Psychology.tsx S2 — 4.200.000
  scroll/Section3Ticker.tsx     S3 — Live-Ticker (CSS-Marquee, Server-Comp)
  scroll/Section4Steps.tsx      S4 — 3 Schritte + CTA
  scroll/Section5Trust.tsx      S5 — Vertrauen (Stats / Reviews / Badges)
  scroll/Section6Fomo.tsx       S6 — FOMO (Live-Zahl / Countdown / CTA)
  scroll/ConfettiBurst.tsx      Konfetti-Canvas (S4 Schritt 3 + Preis-Reveal)
  price/priceCatalog.ts         Seed-Preisdaten + Helfer (Marken/Reihen/Varianten/Faktoren)
  price/AnkaufPriceToolV2.tsx   Preis-Tool (Single/Sammlung + "Wert enthüllen"-Reveal)
  hero/*                        Phase-1-Hero (NICHT anfassen)
```

**Aktuelle Reihenfolge in `page.tsx`:**
Hero → S1 → S2 → S3 → S4 → **Preis-Tool V2** (`#preisschaetzer`) → S5 Trust → S6 FOMO → FAQ → Wizard (`#angebot`).
Entfernt/ersetzt: `AnkaufCategories` (→ S1), `AnkaufProcess` (→ S4), `AnkaufTrust` (→ S5), `AnkaufPriceWidget` + `AnkaufBarcodeCard` (→ Preis-Tool V2).

## 7. Status der Scroll-Sektionen
- ✅ **S1 "Was ist dein Zeug wert?"** — 6 Karten fliegen aus versch. Richtungen rein, Preise zählen von "???" hoch, Gold-Finale.
- ✅ **S2 Psychologie** — Satz rollt rein, "4.200.000" zählt hoch (Bebas + Gold-Neon), Pointe "Darunter vielleicht deine?", abgedunkelter Fokus.
- ✅ **S3 Live-Ankauf-Ticker** — 2 Marquee-Reihen (gegenläufig, versch. Tempo), grün pulsierende Preise.
- ✅ **S4 "So einfach geht's"** — 3-Schritte-Timeline (slide-in), Linien zeichnen sich, Konfetti bei Schritt 3, CTA → `#angebot`.
- ✅ **S5 Vertrauen & Beweise** — 3 Statistiken zählen hoch (312 Ankäufe, 4,9★, 24 h), Bewertungs-Marquee (3D-Tilt), Trust-Badges. Ersetzt die alte `AnkaufTrust`.
- ✅ **S6 FOMO & Dringlichkeit** — pulsierender Live-Punkt + schwankende Besucherzahl (~47), echter Countdown (rot <1 h), "12 Ankäufe heute", großer CTA → `#angebot`.

**Phase 3 (Preis-Tool) — Stand:** ✅ Preis-Tool V2 (Single/Sammlung, **ein** Wert-Ort, „Wert enthüllen"-Slot-Reveal + Trade-In-Split, größere Felder). ⏳ offen: Supabase-Preis-Admin + Anbindung (Details §15, §17). Seed-Preise liegen in `price/priceCatalog.ts`.

## 8. Lokal starten / testen
- **Dev:** `npm run dev` — Port 3000 ist meist belegt → läuft auf **3001**. URL: `http://localhost:3001/ankauf`. Bei großen Änderungen **Hard-Reload** (Strg+Shift+R).
- **Typecheck:** `npx tsc --noEmit --incremental --tsBuildInfoFile node_modules/.cache/tsc-perf.tsbuildinfo`
- **Bei korruptem Cache / altem Stand:** Dev stoppen, `.next` löschen, neu starten.

## 9. Bekannte, unkritische Punkte
- `GET /images/placeholder-product.jpg 404` kommt vom **Shop** (fehlendes Platzhalterbild), NICHT vom Ankauf.
- `next.config.mjs` setzt global `Permissions-Policy: camera=()` → **muss für /ankauf gelockert werden, bevor der Barcode-Scanner (Phase 4) funktioniert.**
- Webpack-Cache-Warnung ("hasStartTime") ist harmlos; ggf. `.next` löschen.

## 10. Nächster Schritt
**S5 (Vertrauen) + S6 (FOMO)** bauen → danach alte `AnkaufTrust` entfernen. Anschließend Phase 3
(Slot-Maschinen-Preisschätzer ersetzt das alte `AnkaufPriceWidget` unter `#preisschaetzer`).
Reihenfolge in `page.tsx` pflegen, HANDOVER.md aktualisieren.

## 11. Debug-Notiz 2026-06-18
- Runtime-Fehler `Cannot read properties of undefined (reading 'call')` wurde auf stale Next/Webpack-Dev-Chunks zurueckgefuehrt.
- Ursache im Projekt: `next.config.mjs` setzte `Cache-Control: public, max-age=31536000, immutable` fuer `/_next/static/(.*)` auch in Development. Dadurch konnte der Browser alte Dev-Chunks behalten.
- Fix: `_next/static`-Cache-Header werden nur noch in `NODE_ENV === "production"` gesetzt. Nach dem Fix `.next` loeschen und Dev-Server neu starten.
- Nebenfix: ungenutzter `Mesh`-Type-Import in `HeroScene3D.tsx` entfernt, damit `next build` nicht am ESLint-Check scheitert.

## 12. Codex-Handover fuer Claude Code 2026-06-18
**Ausgangslage:** User meldete auf `/ankauf` ein Next.js Dev-Overlay:
`Unhandled Runtime Error: TypeError: Cannot read properties of undefined (reading 'call')`.

**Was Codex geprueft hat:**
- README.md, AGENTS.md, HANDOVER.md und `app/ankauf/layout.tsx` gelesen.
- Alle neuen Ankauf-v2-Dateien geprueft: Hero, 3D-Szene, SmoothScroll, Scroll-Sektionen, CountUp, Confetti.
- `npm run build` zuerst ausgefuehrt: Build kompilierte, stoppte aber an ESLint wegen ungenutztem `Mesh`-Import.
- `.next` war stale/inkonsistent; Typecheck stolperte vorher ueber fehlende `.next/types`.

**Was Codex geaendert hat:**
- `next.config.mjs`: Cache-Header fuer `/_next/static/media/(.*)` und `/_next/static/(.*)` werden nur noch in Production gesetzt. In Dev bleiben Next-Chunks `no-store`, damit keine alten Webpack-Chunks haengen bleiben.
- `components/ankauf/v2/hero/HeroScene3D.tsx`: ungenutzten `Mesh`-Type-Import entfernt.
- `.next` lokal geloescht, damit Next frische Chunks und Types baut.

**Verifikation durch Codex:**
- `npm run build` erfolgreich.
- `npx tsc --noEmit --incremental --tsBuildInfoFile node_modules/.cache/tsc-perf.tsbuildinfo` erfolgreich.
- Separater Dev-Testserver auf Port 3010 gestartet, `/ankauf` geladen, danach wieder gestoppt.
- Browsercheck: `/ankauf` Status 200, H1 sichtbar, kein `Unhandled Runtime Error` Overlay, keine Browser-Exceptions im zweiten Lauf.
- Dev-Header fuer `/_next/static/chunks/webpack.js`: `Cache-Control: no-store, must-revalidate`.

**Hinweis fuer naechsten Agenten:**
- Falls der User im eigenen Browser noch das alte Overlay sieht: laufenden Dev-Server stoppen, `npm run dev` neu starten, dann Hard-Reload (`Strg+Shift+R`). Falls noetig Browser Site Data fuer `localhost` loeschen.
- Nicht erneut die Hero-/Scroll-UI umbauen; dieser Task war nur Debug/Fix.
- Danach kann normal mit Phase 2 S5/S6 weitergemacht werden.

## 13. Codex-Handover S5/S6 2026-06-18
**Status:** Phase 2 Scroll-Erlebnis wurde um Sektion 5 und 6 erweitert.

**Neu angelegte Dateien:**
- `components/ankauf/v2/scroll/Section5Trust.tsx`
- `components/ankauf/v2/scroll/Section6Fomo.tsx`

**Geaenderte Dateien:**
- `app/ankauf/page.tsx`: S5/S6 importiert und hinter dem alten Preisschaetzer eingebunden; alte `AnkaufTrust`-Einbindung entfernt. Reihenfolge jetzt: Hero -> S1 -> S2 -> S3 -> S4 -> Preisschaetzer/Barcode -> S5 Trust -> S6 FOMO -> FAQ -> Wizard.
- `app/ankauf/ankauf.css`: Styles fuer S5/S6, Review-Marquee, 3D-Tilt, Trust-Badges, FOMO-Karten, Parallax-Orbits und Reduced-Motion-Fallbacks ergaenzt.

**Sektion 5 umgesetzt:**
- 3 Count-up-Statistiken: 312 erfolgreiche Ankaeufe, 4,9 Sterne Bewertung, 24h Reaktionszeit.
- Bewertungs-Cards als horizontaler Marquee-Scroll mit Platzhalterbewertungen.
- Bewertungs-Cards haben leichten 3D-Tilt bei Maus-Hover; Touch bleibt ruhig.
- Trust-Badges: Faire Preise, Sofort-Auszahlung, Kostenloser Versand.
- GSAP ScrollTrigger-Reveals + langsame Parallax-Orbits.

**Sektion 6 umgesetzt:**
- Live-Hinweis mit rotem pulsendem Punkt und schwankender Besucherzahl um 47.
- Countdown-Timer startet bei 02:47:33, laeuft wirklich runter und schaltet unter 1h auf Rot.
- Hinweis: Heute bereits 12 Ankaeufe abgeschlossen.
- CTA `Sichere dir den aktuellen Preis` scrollt zu `#angebot`.
- Timer/Live-Zahl laufen nur, wenn die Sektion per IntersectionObserver sichtbar ist; Cleanup fuer Intervalle vorhanden.

**Technische Hinweise:**
- Weiterhin vorhandene zentrale Lenis-Integration in `SmoothScroll.tsx`; keine neue Smooth-Scroll-Logik in S5/S6.
- `useCountUp` wird wiederverwendet; keine neue Counter-Logik.
- Backend, Wizard, `#angebot` und `#preisschaetzer` nicht veraendert.
- Nach `npm run build` wurde der Dev-Server neu gestartet und `.next` geloescht, weil ein laufender Dev-Server nach dem Build sonst fehlende Dev-Chunks als HTML liefern kann.

**Verifikation durch Codex:**
- `npx tsc --noEmit --incremental --tsBuildInfoFile node_modules/.cache/tsc-perf.tsbuildinfo` erfolgreich.
- `npm run build` erfolgreich.
- Dev-Server laeuft auf Port 3000.
- Browsercheck auf `http://127.0.0.1:3000/ankauf`: Status 200, kein Runtime-Overlay, keine PageErrors/ConsoleErrors, S5/S6-Texte sichtbar.
- Mobile-Viewport-Check 390px: kein horizontales Overflow, S5/S6 sichtbar, keine PageErrors/ConsoleErrors.

**Naechster sinnvoller Schritt:**
- Visueller Feinschliff per echter Browseransicht/mobile Viewport, falls der User nach Optik-Feedback fragt.
- Danach Phase 3: Slot-Maschinen-Preisschaetzer fuer `#preisschaetzer`.

## 14. Codex-Handover Visual/Mobile Polish 2026-06-18
**User-Auftrag:** Visuellen Feinschliff machen und Mobile-Optik optimieren.

**Geaendert:**
- `app/ankauf/page.tsx`: Preisschaetzer-Sektion bekommt nun `ak-stage ak-tool-section`, damit der alte Tool-Block optisch in den VAULT-Fluss eingebettet ist.
- `app/ankauf/ankauf.css`: Tool-Bruecke mit weicherem Hintergrund/Gradienten, bessere Uebergaenge zu S5, Mobile-Spacing fuer Tool/S5/S6 reduziert, S5/S6-Headlines auf Mobile kleiner und lesbarer, Review-Marquee auf Mobile langsamer/ruhiger, FOMO-Karten/CTA fuer kleine Screens kompakter.
- `components/ui/CookieBanner.tsx`: Mobile-Banner kompakter gemacht, kuerzere Mobile-Copy, kleinere Buttons/Paddings, Safe-Area-Padding. Desktop-Verhalten bleibt gleich.

**Geprueft:**
- Desktop-Screens fuer Preisschaetzer, S5, S6.
- Mobile-Screens mit und ohne Cookie-Banner.
- Kein horizontales Overflow bei 390px.
- Keine Browser-PageErrors/ConsoleErrors in den visuellen Checks.

**Hinweis:**
- Fixed Bottom-Navigation/Chat-Button existieren global weiter und koennen Mobile-Screens unten ueberlagern. S5/S6 haben mehr Bottom-Space, damit CTA/Inhalte dennoch erreichbar bleiben.

## 15. Codex-Handover Preis-Tool V2 2026-06-18
**User-Auftrag:** "Ultimatives Preis tool" fuer mehrere Positionen bauen, z. B. Nintendo DS + 5 Spiele, mit Gesamtbetrag. Zusaetzlich einschaetzen, ob guenstige KI im Preisprozess Sinn macht.

**Neu angelegte Dateien:**
- `components/ankauf/v2/price/priceCatalog.ts`
- `components/ankauf/v2/price/AnkaufPriceToolV2.tsx`

**Geaenderte Dateien:**
- `app/ankauf/page.tsx`: alten Preisschaetzer-/Barcode-Block durch `AnkaufPriceToolV2` ersetzt. Section-Copy auf Paketwert und Mehrfachpositionen angepasst.
- `app/ankauf/ankauf.css`: Styles fuer Preis-Vault, Builder, Live-Schaetzung, Paketliste, Empty-State und Mobile-Layout ergaenzt.
- `components/ui/Navigation.tsx`: mobiles Slide-In-Menue ist im geschlossenen Zustand `hidden`, damit es auf Mobile keine horizontale Seitenbreite erzeugt.

**Preis-Tool V2 umgesetzt:**
- Nutzer kann mehrere Positionen einzeln erfassen: Marke -> Reihe -> Variante -> Zustand -> Vollstaendigkeit -> Anzahl.
- Gesamtwert wird live als Range angezeigt.
- Paketliste zeigt jede Position separat, Menge kann nachtraeglich geaendert werden, Positionen koennen entfernt werden.
- Schnellsuche findet Varianten ueber Name/Alias. Eingaben wie `5 DS Spiele` ignorieren Fuellwoerter/Zahlen fuer die Suche und uebernehmen die Menge `5` automatisch.
- Aktuelle Seed-Daten liegen bewusst in `priceCatalog.ts`: PS5 Disc/Digital/Slim, Switch, DS/3DS, Game Boy, Xbox, Pokemon, Retro-Konsolen, Controller usw.
- CTA speichert die Paketliste in `localStorage` unter `retroase_price_tool_items` und scrollt zu `#angebot`. Der bestehende Wizard-Backend-Vertrag wurde nicht angefasst.

**Wichtige Produktentscheidung:**
- Preise sind aktuell lokale Seed-Richtwerte. Das ist nur Phase 1.
- Naechster sinnvoller Schritt ist ein Admin-steuerbarer Preis-Katalog in Supabase, damit der Betreiber Basispreise, Varianten, Faktoren, Nachfrage-Status und Aktiv/Inaktiv selbst pflegen kann.
- KI sollte guenstig nur als Assistenz genutzt werden, nicht als finale Preisquelle:
  - sinnvoll: Freitext wie "Nintendo DS mit 5 Spielen" in Positionen umwandeln,
  - sinnvoll spaeter: Foto/OCR/Barcode als Modell-Erkennung,
  - nicht sinnvoll: KI bestimmt allein den Ankaufpreis.
  Die Preiswahrheit sollte aus Admin-Regeln/Preiskatalog kommen.

**Verifikation durch Codex:**
- `npx tsc --noEmit --incremental --tsBuildInfoFile node_modules\.cache\tsc-perf.tsbuildinfo` erfolgreich.
- `npm run build` erfolgreich.
- Dev-Server nach Build gestoppt, `.next` geloescht und auf Port 3000 neu gestartet.
- `http://127.0.0.1:3000/ankauf` antwortet mit HTTP 200.
- Playwright Mobile-Smoke-Test: `5 DS Spiele` -> Suchtreffer `Nintendo DS Spiel`, Menge `5`, Position hinzugefuegt, Gesamtwert `16 € - 74 €`, kein horizontaler Overflow, keine PageErrors/ConsoleErrors.

**Naechster sinnvoller Schritt:**
- Supabase-Tabellen + Admin-Oberflaeche fuer Preisregeln bauen:
  `ankauf_price_categories`, `ankauf_price_variants`, `ankauf_price_conditions`, `ankauf_price_completeness`, optional `ankauf_price_adjustments`.
  Danach kann der Frontend-Katalog aus Supabase kommen und der Shopbetreiber hat echte Kontrolle.

## 16. Codex-Handover Mobile WhatsApp Fix 2026-06-18
**User-Auftrag:** WhatsApp-Button auf Mobile korrigieren, weil er unten rechts ueber der Bottom-Menueleiste lag.

**Geaenderte Dateien:**
- `components/ui/WhatsAppButton.tsx`
- `components/ui/BackToTop.tsx`
- `HANDOVER.md`

**Umsetzung:**
- WhatsApp-Button liegt auf Mobile jetzt oberhalb der Bottom-Navigation:
  `bottom-[calc(5.75rem+env(safe-area-inset-bottom))] right-4`.
- Button ist auf Mobile etwas kompakter (`w-12 h-12`), Desktop bleibt `w-14 h-14`.
- Tooltip wird auf sehr kleinen Screens nicht mehr eingeblendet, damit er nicht in die UI ragt.
- Back-to-Top-Button wurde mobil daneben gesetzt (`right-[4.75rem]`), damit beide Floating Buttons nicht ueberlappen.
- Desktop-Layout bleibt wie vorher: WhatsApp unten rechts, Back-to-Top darueber.

**Verifikation durch Codex:**
- `npx tsc --noEmit --incremental --tsBuildInfoFile node_modules\.cache\tsc-perf.tsbuildinfo` erfolgreich.
- Playwright Mobile-Check 390x844 auf `http://127.0.0.1:3000/ankauf#preisschaetzer`:
  - WhatsApp-Button: kein Overlap mit Mobile Bottom Nav.
  - Back-to-Top: kein Overlap mit WhatsApp.
  - Kein horizontaler Overflow.
  - Keine PageErrors/ConsoleErrors.

## 17. Claude-Handover P9/P10 — Wert-Reveal + Trade-In 2026-06-18
**User-Auftrag:** Nächsten sinnvollen Schritt selbst wählen → gewählt: **P9 (Slot-Reveal)** + **P10 (Trade-In-Bonus)**, weil kein Backend/keine Assets nötig und größter Sofort-Effekt; baut auf dem bestehenden Preis-Tool V2 auf.

**Geänderte Dateien:**
- `components/ankauf/v2/price/AnkaufPriceToolV2.tsx`: Reveal-Zustandsmaschine (`idle` → `rolling` → `done`), Bonus-Konstante, Roll-Helfer, Reveal-Zone im JSX. Import von `useReducedMotion`.
- `app/ankauf/ankauf.css`: neue `.ak-reveal-*`-Klassen (Trigger, Split-Cards, Bonus-Badge, Pulse-/Flacker-Keyframes, reduced-motion-Override). Keine bestehende Regel verändert.

**Umsetzung:**
- Live-Gesamtwert bleibt als Aufbau-Feedback (Total-Orb + Bundle-Total unverändert).
- Button **„🎰 Wert enthüllen"** erscheint nur bei ≥1 Position. Klick → ~1,3 s Slot-Rattern (deterministisches Flackern aus Tick-Seed) → Ergebnis.
- Ergebnis-Split: **Sofort-Auszahlung** (Range) vs. **RetrOase-Guthaben** (Range × 1,1, grün, „+10% Power-Up"-Badge) + Microcopy „im Shop einlösbar".
- Bonus = `STORE_CREDIT_BONUS = 0.1` (eine Konstante; später über Preis-Admin/Supabase steuerbar).
- Paket-Änderung setzt Reveal automatisch auf `idle` zurück (kein veralteter Wert). Timer mit Cleanup. `prefers-reduced-motion` → sofortiges Ergebnis ohne Animation.
- Backend, Wizard, `#angebot`/`#preisschaetzer` und localStorage-Schema (`retroase_price_tool_items`) **unverändert**.

**Verifikation:**
- `npx tsc --noEmit --incremental --tsBuildInfoFile node_modules/.cache/tsc-perf.tsbuildinfo` → EXIT 0.
- Dev-Server Port 3000; `GET http://127.0.0.1:3000/ankauf` → 200, sauberer Compile, keine Fehler im Dev-Log.
- (Hinweis: Runtime-Fehler vom Sessionstart war erneut stale `.next`-Cache → `.next` + `node_modules/.cache` gelöscht, Dev neu gestartet. Der eigentliche Config-Fix aus §11/§12 ist weiterhin aktiv.)

**Update v2 (nach User-Feedback: „Live-Wert verrät den Preis schon" + „Animation langweilig"):**
- **Blind-Reveal:** ALLE Euro-Werte (Total-Orb, Live-Schätzung-„Wert", Höchster Einzelwert, Paket-Summe, Positions-Preise) sind bis zum Enthüllen mit 🔒 maskiert (Klasse `.ak-locked`, gegated über `revealed = reveal === "done"`). Erst nach dem Enthüllen sichtbar; jede Paket-Änderung verschließt wieder (Reset-Effekt auf `[totalMin, totalMax]`).
- **Spielerischer Reveal:** 3 rotierende Slot-Walzen (Emoji-Symbole, CSS-Keyframe `ak-slot3-spin`) ~1,6 s + Konfetti-Burst (`ConfettiBurst`, `enabled={!reduced}`) + danach hochzählende Zahlen (rAF easeOutCubic über `progress`-State).
- **Klare Seiten:** links „💸 Effektive Auszahlung" (Cash), rechts „🪙 RetrOase Guthaben +10% Power-Up" (grün, Glow, slam-in).
- Tool-Titel/Subtitle angepasst („Sammlung erfassen. Wert enthüllen." + Tresor-Wording).
- `rollingEuro`/`rollTick` (v1-Flacker) entfernt. tsc EXIT 0, `/ankauf` 200.

**Update v3 (nach User-Feedback: „Preis an 5 Stellen, zu kompliziert"):**
- **Preis-Tool radikal vereinfacht.** Der Wert erscheint jetzt an **genau EINEM Ort** (Reveal-Zone). Entfernt: Live-Schätzung-Panel (Slot-Reels + Mini-Ledger), Gesamtwert-Orb oben, Paket-Summen-Chip, Einzelpreise in der Liste.
- **Modus-Wahl** oben (`mode: "single" | "collection"`, default `single`): „🎮 Einzelnes Produkt" vs. „📦 Ganze Sammlung". `activeRange` = im Single-Modus `selectedRange`, im Collection-Modus Summe der `items`.
- **Single-Modus:** ein Produkt konfigurieren → kompakte Produkt-Karte (ohne Preis) → enthüllen. **Collection-Modus:** Produkte zur Liste „Dein Paket" hinzufügen (nur Name/Menge/Löschen, kein Preis) → Gesamtwert enthüllen.
- Wording entschärft: „Produkt hinzufügen" statt „Position", Titel „Was ist es wert?".
- **Größere Eingabefelder** (`.ak-search-lg`, größere Selects/Chips/Buttons via `.ak-picker-panel`).
- Neue Klassen: `.ak-price-head`, `.ak-mode-toggle/.ak-mode-tab`, `.ak-picker-panel`, `.ak-paket-panel`, `.ak-single-summary`, `.ak-reveal-empty`. **Dead CSS** (jetzt ungenutzt, kann später raus): `.ak-price-grid`, `.ak-price-builder/.ak-price-result`, `.ak-total-orb`, `.ak-slot-machine/.ak-slot-reel/.ak-slot-value`, `.ak-mini-ledger`, `.ak-bundle-board/.ak-bundle-head/.ak-bundle-total`, `.ak-price-tool-top`.
- localStorage-Export (`retroase_price_tool_items`) unverändert: im Single-Modus 1-Element-Array. tsc EXIT 0, `/ankauf` 200.

**Nächster sinnvoller Schritt:**
- **P5** visuelle Marken-/Geräte-Kacheln (braucht Logos/Geräte-Bilder vom User) **oder** **P2/P3** Supabase-Preis-Admin (Fundament für P4/P6/P7/P8).

**Update v4 (Codex nach User-Feedback):**
- RetrOase-Guthaben-Bonus von **20% auf 10%** reduziert.
- `STORE_CREDIT_BONUS` in `AnkaufPriceToolV2.tsx` ist jetzt `0.1`; Badge und Guthaben-Range werden dadurch automatisch als `+10% Power-Up` berechnet.

## 18. Codex-Handover Preis-Admin Fundament 2026-06-18
**User-Auftrag:** Mit dem Preis-Admin anfangen, damit der Betreiber langfristig volle Kontrolle ueber Marken, Reihen, Varianten, Preise, EANs und Guthaben-Bonus bekommt.

**Neu angelegte Dateien:**
- `supabase/migrations/20260618_ankauf_price_admin.sql`
- `app/(admin)/admin/ankauf-preise/page.tsx`
- `app/(admin)/admin/ankauf-preise/actions.ts`

**Geaenderte Dateien:**
- `components/admin/AdminSidebar.tsx`: neuer Menuepunkt `Preis-Katalog`.
- `HANDOVER.md`

**Datenmodell/Migration:**
- Neue Tabellen:
  - `ankauf_price_settings`
  - `ankauf_price_brands`
  - `ankauf_price_devices`
  - `ankauf_price_variants`
  - `ankauf_price_conditions`
  - `ankauf_price_completeness`
  - `ankauf_price_games`
  - `ankauf_price_accessories`
  - `ankauf_price_adjustments`
- RLS aktiviert: oeffentlich lesbar fuer aktive Preis-Katalog-Daten, Schreiben nur via `service_role`.
- Seed aus dem aktuellen lokalen `priceCatalog.ts` migriert: Marken, Reihen/Geraete, Varianten, Zustand-Faktoren, Vollstaendigkeits-Faktoren.
- `store_credit_bonus` als Einstellung mit `0.1000` (= 10%) angelegt.

**Admin-UI:**
- Neue Route `/admin/ankauf-preise`.
- Ohne Login greift der bestehende Adminschutz und leitet zu `/login`.
- Wenn die Migration noch nicht in Supabase ausgefuehrt wurde, zeigt die Seite einen klaren Hinweis auf:
  `supabase/migrations/20260618_ankauf_price_admin.sql`.
- Funktionen:
  - Trade-In-Bonus in Prozent aendern.
  - neue Marke anlegen.
  - neue Reihe / neues Geraet anlegen.
  - neue Variante anlegen.
  - Varianten filtern nach Marke, Typ, Status und Suche.
  - Variante bearbeiten: Name, Typ, Nachfrage, Basispreis von/bis, Aliase, EANs, Bild-URL, Zubehoer-Checklisten, Notizen, aktiv/inaktiv.

**Wichtige Grenze:**
- Das Frontend-Preis-Tool ist noch NICHT an Supabase angebunden. Es nutzt weiterhin `priceCatalog.ts` als Seed/Fallback.
- Naechster Schritt ist die Anbindung: Supabase-Katalog laden, `priceCatalog.ts` als Fallback behalten, `store_credit_bonus` aus `ankauf_price_settings` lesen.

**Verifikation durch Codex:**
- `npx tsc --noEmit --incremental --tsBuildInfoFile node_modules\.cache\tsc-perf.tsbuildinfo` erfolgreich.
- Dev-Server laeuft auf Port 3000.
- `http://127.0.0.1:3000/ankauf#preisschaetzer` antwortet mit HTTP 200.
- `http://127.0.0.1:3000/admin/ankauf-preise` antwortet ohne Login mit HTTP 307 zu `/login`.
- `npm run build` kompiliert und typecheckt, bricht aber beim Page-Data-Sammeln auf der bestehenden Route `/admin/blog/[id]` mit `PageNotFoundError` ab. Das liegt nicht an den neuen Preis-Admin-Dateien; TypeScript ist sauber. Nach dem fehlgeschlagenen Build wurde `.next` geloescht und der Dev-Server neu gestartet.

## 19. Codex-Handover Supabase-Anbindung Preis-Tool 2026-06-18
**User-Auftrag:** Nach erfolgreichem Seed im Admin mit der echten Anbindung starten: Der oeffentliche Preisschaetzer soll seine Preiswahrheit aus Supabase/Admin bekommen, nicht mehr nur aus `priceCatalog.ts`.

**Neu angelegte Datei:**
- `components/ankauf/v2/price/loadPriceCatalog.ts`

**Geaenderte Dateien:**
- `app/ankauf/page.tsx`
- `components/ankauf/v2/price/AnkaufPriceToolV2.tsx`
- `components/ankauf/v2/price/priceCatalog.ts`
- `app/(admin)/admin/ankauf-preise/actions.ts`
- `HANDOVER.md`

**Umsetzung:**
- `/ankauf` laedt serverseitig den aktiven Katalog aus Supabase:
  - `ankauf_price_settings` fuer `store_credit_bonus`
  - `ankauf_price_brands`
  - `ankauf_price_devices`
  - `ankauf_price_variants`
  - `ankauf_price_conditions`
  - `ankauf_price_completeness`
- Das Preis-Tool bekommt den geladenen Katalog als Prop und nutzt daraus Marken/Reihen/Varianten, Suche, Basispreise, Zustandsfaktoren, OVP/Vollstaendigkeitsfaktoren und den RetrOase-Guthaben-Bonus.
- Der lokale `priceCatalog.ts` bleibt als Fallback erhalten, falls Supabase leer ist, Tabellen fehlen oder eine Abfrage fehlschlaegt.
- Der Guthaben-Bonus bleibt bei **10%**, kommt jetzt aber aus `ankauf_price_settings.store_credit_bonus`.
- Admin-Aenderungen revalidieren jetzt auch `/ankauf`, damit Preis- und Bonus-Aenderungen im Frontend sauber ankommen.
- `/ankauf` ist `force-dynamic`; in Dev/Preview werden Admin-Aenderungen nach Reload nicht durch statisches Caching verdeckt.
- Backend/Wizard-Pipeline, `#preisschaetzer`, `#angebot`, localStorage-Key `retroase_price_tool_items` und das Reveal-UI wurden nicht gebrochen.

**Verifikation:**
- `npx tsc --noEmit --incremental --tsBuildInfoFile node_modules\.cache\tsc-perf.tsbuildinfo` erfolgreich.
- `GET http://127.0.0.1:3000/ankauf#preisschaetzer` -> 200.
- `GET http://127.0.0.1:3000/admin/ankauf-preise` -> 200.
- Lokaler Playwright-Klicktest konnte nicht laufen, weil das Projekt kein `playwright`-Paket installiert hat. Kein Paket wurde nachinstalliert.

**Naechster sinnvoller Schritt:**
- Kleiner Live-Test durch den User: Im Admin eine Test-Variante oder einen Preis leicht aendern, speichern, `/ankauf#preisschaetzer` hart neu laden und pruefen, ob der neue Wert im Reveal ankommt. Danach kann Phase 3.2 folgen: Paketliste aus `retroase_price_tool_items` im Ankauf-Wizard vorbefuellen.

**Nachfix 2026-06-18:**
- Problem: Der Admin zeigte 26 Varianten und `store_credit_bonus = 0.11`, aber der oeffentliche Supabase-Client sah wegen unvollstaendiger Public-RLS-Policies 0 Varianten und keinen Bonus. Dadurch fiel `/ankauf` auf den lokalen Fallback mit 10% zurueck.
- Fix: `loadPriceCatalog.ts` nutzt jetzt server-only den Service-Key/Admin-Client, falls `SUPABASE_SERVICE_KEY` vorhanden ist. Secrets werden nicht an den Browser gegeben; der Client bekommt nur die gemappten Katalogdaten.
- Verifikation: `GET /ankauf#preisschaetzer` enthaelt im RSC-Payload `storeCreditBonus: 0.11` und `source: "supabase"`. TypeScript erfolgreich.

## 20. Codex-Handover Preis-Tool -> Wizard-Vorbefuellung 2026-06-18
**User-Auftrag:** Auswahl aus dem Preisschaetzer in den Ankauf-Wizard uebernehmen, damit Kunden nicht alles doppelt eingeben muessen. Gleichzeitig klaeren, wann der Wizard komplett neu als V2 gebaut werden soll.

**Geaenderte Datei:**
- `components/ankauf/wizard/AnkaufWizard.tsx`
- `HANDOVER.md`

**Umsetzung:**
- Der bestehende Wizard liest beim Laden `localStorage.retroase_price_tool_items`.
- Wenn Daten vorhanden sind, werden automatisch befuellt:
  - Verkaufstyp (`einzeln`, `mehrere`, `pokemon`, `zubehoer`, `defekt`)
  - Produktname/Paketname
  - Kategorie
  - Plattform/Reihe
  - Zustand
  - Vollstaendigkeit
  - Gesamtmenge
  - Beschreibung inklusive einzelner Positionen und Preisrange aus dem Preisschaetzer
- Nach Import springt der Wizard direkt auf Schritt 2 Kontakt. Schritt 1 und Details bleiben ueber Zurueck/Weiter editierbar.
- Sichtbarer Hinweisblock: "Aus dem Preisschaetzer uebernommen" mit Produkt-/Paketname, Anzahl und Schaetzung.
- Import kann ueber X entfernt werden; dabei werden nur Ankauf-/Produktfelder zurueckgesetzt.
- Nach erfolgreichem Absenden wird `retroase_price_tool_items` geloescht, damit keine alte Anfrage erneut importiert wird.

**Wichtige Grenze:**
- Der bestehende Wizard wurde bewusst nicht spektakulaer umgebaut. Das ist nur die Bridge, damit der aktuelle Flow sofort besser funktioniert.
- Empfehlung fuer naechste grosse Phase: **AnkaufWizardV2** komplett neu bauen, statt den alten 5-Step-Wizard weiter aufzubohren.

**Wizard-V2 Empfehlung:**
- Neuer Guided Flow nach Preis-Tool-Logik:
  1. Dein Paket bestaetigen
  2. Zustand/Zubehoer/Fotos je Position
  3. Auszahlung vs. RetrOase-Guthaben waehlen
  4. Kontaktdaten
  5. Review + Absenden
- Visuell: VAULT/Casino-Flow, ein Fokus pro Screen, klare Next-Richtung, mobile-first, spaeter Barcode/Fotos als eigene Momente.
- Technisch: erst als neue Komponente parallel bauen (`components/ankauf/v2/wizard/AnkaufWizardV2.tsx`), Backend-Vertrag unveraendert lassen, danach alten Wizard ersetzen.

**Verifikation:**
- `npx tsc --noEmit --incremental --tsBuildInfoFile node_modules\.cache\tsc-perf.tsbuildinfo` erfolgreich.
- `GET http://127.0.0.1:3000/ankauf#angebot` -> 200.

**Nachfix 2026-06-18:**
- Problem: Alte `retroase_price_tool_items` lagen als nacktes Array im Browser-LocalStorage. Dadurch konnte der Wizard ein altes Paket importieren, obwohl der User gerade nur ein einzelnes Produkt gewaehlt hatte.
- Fix:
  - `AnkaufPriceToolV2.tsx` speichert den Import jetzt als versioniertes Payload-Objekt mit `version: 2`, `source: "ankauf-price-tool-v2"` und `savedAt`.
  - `AnkaufWizard.tsx` akzeptiert nur noch dieses neue Format und nur, wenn es maximal 20 Minuten alt ist.
  - Legacy-Array-Daten werden automatisch aus dem LocalStorage geloescht und nicht importiert.
- Verifikation: TypeScript erfolgreich.

## 21. Codex-Handover AnkaufWizardV2 2026-06-18
**User-Auftrag:** Den geplanten komplett neuen Ankauf-Wizard V2 als Premium-Arcade-Flow umsetzen. Der alte Wizard bleibt als Rueckfall im Repo, wird auf `/ankauf` aber nicht mehr gerendert.

**Neu angelegte Datei:**
- `components/ankauf/v2/wizard/AnkaufWizardV2.tsx`

**Geaenderte Dateien:**
- `app/ankauf/page.tsx`
- `app/ankauf/ankauf.css`
- `HANDOVER.md`

**Umsetzung:**
- Neuer gefuehrter 5-Step-Flow unter `#angebot`:
  1. Paket bestaetigen
  2. Zustand & Zubehoer
  3. Fotos
  4. Kontakt
  5. Review & Absenden
- V2 hat eigenen detaillierten State mit `items[]`, `contact`, `photos`, `consents`.
- Preisschaetzer-Import:
  - liest nur das versionierte `retroase_price_tool_items` Format mit `version: 2` und `source: "ankauf-price-tool-v2"`.
  - akzeptiert nur frische Daten bis 20 Minuten.
  - Legacy-Arrays werden geloescht/ignoriert.
- Standalone-Start:
  - Wenn kein Import vorhanden ist, startet der Wizard mit einem leeren Produkt-Slot.
  - Produkte koennen hinzugefuegt, entfernt und mengenmaessig angepasst werden.
- Auszahlung:
  - Kein eigener Auswahl-Step mehr im Wizard.
  - Kunde entscheidet erst nach dem finalen Angebot zwischen Sofort-Auszahlung und RetrOase-Guthaben.
  - `storeCreditBonus` kommt weiter aus `priceCatalog.storeCreditBonus` und wird nur in der Anfrage/Review als Hinweis dokumentiert.
- Submit:
  - V2 mappt seinen detaillierten State zurueck in den bestehenden `/api/ankauf` FormData-Vertrag.
  - Keine DB-Migration und kein API-Vertragsbruch.
  - Nach erfolgreichem Submit wird der Preisschaetzer-Import aus localStorage geloescht.
- Design:
  - Neue Styles sind unter `.ak-stage` / `.ak-wizard-v2-*` in `app/ankauf/ankauf.css` gescoped.
  - Premium-Arcade/Mission-Map statt altem Formular-Look.
  - Mobile-first Layout, grosse Touch-Flaechen, responsive einspaltig auf kleinen Screens.

**Verifikation:**
- `npx tsc --noEmit --incremental --tsBuildInfoFile node_modules\.cache\tsc-perf.tsbuildinfo` erfolgreich.
- `GET http://127.0.0.1:3000/ankauf#angebot` -> 200.

**Naechste Ausbaustufe:**
- Admin-Zubehoer-Checklisten fuer die wichtigsten Varianten einpflegen, danach EAN/Barcode-Scanner und Foto-Anforderungen pro Produkt.

## 22. Claude-Handover Light Mode + offene Aufgaben 2026-06-18
**User-Auftrag:** "Ich will alles einmal in dem Neuen Look ueberarbeitet haben! Vorallem soll es fuer alles auch einmal ein Light mode geben nicht nur Dark!" — zuerst die Ankauf-Tools, dann die ganze /ankauf-Seite; anschliessend mehrere Kontrast-Nachbesserungen ("manche sachen sieht man immernoch nicht").

**Geaenderte Dateien:**
- `app/ankauf/ankauf.css` (grosser additiver Light-Block am Ende)
- `components/ankauf/v2/hero/HeroHeadline.tsx` (`text-white` -> `color: var(--ak-text)`)
- `components/ankauf/v2/wizard/AnkaufWizardV2.tsx` (Foto-Typ-Filter + `accept`)

**Umsetzung Light Mode:**
- Aktiv wenn KEINE `.dark`-Klasse am `<html>` (ThemeProvider-Toggle). Default bleibt Dark.
- Umgesetzt als `:root:not(.dark) .ak-stage { … }` Token-Remap (warmes Elfenbein + tiefes Gold) + komponentenweise Overrides. Dark Mode komplett unberuehrt.
- Token-Remap (Auszug): `--ak-bg:#faf6ec`, `--ak-surface:#fffdf8`, `--ak-text:#221a10`, `--ak-gold:#b26a00`, `--ak-green:#0b8f50`, Glows auf `0 0 0 rgba(0,0,0,0)` (nicht `none`, wegen box-shadow-Listen).
- Abgedeckt: Hero, S1 Value, S2, S3 Ticker, S4 Steps, S5 Reviews/Stats, S6 FOMO + Preis-Tool V2 + AnkaufWizardV2.
- Kontrast-Fixes: `.ak-review-card` (war dunkel), `.ak-item-row`/`.ak-item-actions input` (unsichtbar/dunkel), `.ak-ticker-price` (Neon-Flash aus), `--ak-text-mute` von 0.46 -> 0.56, `.ak-fomo-*`, `.ak-s2-dim`, Proof/FOMO-Sektions-Verlaeufe.

**⚠️ Light-Mode-Falle (NICHT erneut reinlaufen):**
- Bei `.ak-gold-text` (gold-gradient Clip-Schrift) im Light-Override NUR `background-image` ueberschreiben, NIEMALS die `background`-Shorthand — die resettet `background-clip: text`, der Verlauf fuellt dann den ganzen Kasten statt der Buchstaben (massiver Gold-Balken). Clip-Properties im Override mit-deklarieren.

**Foto-Bug-Fix:** Wizard `addPhotos` nahm vorher jedes `image/*` an, Server `/api/ankauf` akzeptiert aber nur jpeg/png/webp -> HEIC/GIF lies den GANZEN Submit mit 400 scheitern. Jetzt client-seitig auf jpeg/png/webp gefiltert (+ klarer Hinweis) und `accept`-Attribut angepasst.

**NOCH ZU TUN — /ankauf:**
1. Hero-3D-Szene (`components/ankauf/v2/hero/HeroScene3D.tsx`) im Light Mode pruefen — Three.js fuer dunklen Grund gebaut; Licht/Material evtl. anpassen (nicht per CSS loesbar).
2. Light Mode responsive pruefen (320/375/768/1024/1440) — keine dunklen/blassen Reste, Tools mobil bedienbar.
3. Live-Submit-Test AnkaufWizardV2 (echter POST -> Insert `ankauf_requests`, Upload Bucket `ankauf-items`, 2 Resend-Mails, Erfolgsscreen + `/ankauf/status/{id}`).
4. Admin-Zubehoer-Checklisten fuer die wichtigsten Varianten pflegen und im Wizard gegenpruefen.
5. Accessibility: WCAG-Kontrast fuer Gold/Gruen auf Elfenbein nachmessen, Tastatur-Nav, reduced-motion.

**NOCH ZU TUN — Launch:**
- Supabase PROD: Migration `supabase/migrations/20260618_ankauf_price_admin.sql` ausfuehren + Storage-Bucket `ankauf-items` anlegen.
- Resend: Domain @retroase.de verifizieren, DANN `RESEND_FROM_EMAIL` setzen (aktuell `onboarding@resend.dev`).
- Vercel: ENV (Supabase service key, RESEND_*, ADMIN_EMAIL …) eintragen.
- eBay: Webhook + Token erst beim Launch aktivieren.
- Post-Launch: Barcode/EAN-Scanner + grosse Spiele-Datenbank.

**Verifikation:** `GET http://127.0.0.1:3001/ankauf` -> 200 (Port 3000 war belegt). Light Mode visuell vom User bestaetigt (Hero, Reviews, Ticker) nach mehreren Kontrast-Iterationen.

**Codex QA-Nachfix 2026-06-18:**
- Read-only Browser-QA per Headless Chrome fuer Light Mode auf `http://127.0.0.1:3000/ankauf` durchgefuehrt.
- Gepruefte Viewports: 320, 375, 768, 1024, 1440.
- Hero-3D-Szene im Light Mode geprueft: Canvas rendert, TV/Coins sind auf hellem Grund gut sichtbar; keine Material-/Licht-Aenderung noetig.
- Gefunden und gefixt:
  - Horizontaler Overflow durch breite Marquee-/Reveal-Elemente -> `.ak-stage` bekommt `overflow-x: hidden; overflow-x: clip;`.
  - `ak-wizard-v2-section` hatte im Light Mode noch hardcoded dunklen Hintergrund, waehrend Text schon dunkel war -> Light-Override fuer die Wizard-Section ergaenzt.
- Nachfix verifiziert:
  - Kein horizontales Overflow auf 320/375/768/1024/1440.
  - Keine Console-/Network-Fehler im Headless-Check.
  - Wizard-Heading im Light Mode wieder lesbar.
  - `npx tsc --noEmit --incremental --tsBuildInfoFile node_modules\.cache\tsc-perf.tsbuildinfo` erneut erfolgreich.

**Codex Live-Submit-Test 2026-06-18:**
- Echter AnkaufWizardV2-Submit ueber Browser-Automation ausgefuehrt.
- Testdaten:
  - Produkt: `TEST Nintendo DS Lite Codex ...`
  - Hinweis: `TESTANFRAGE BITTE IGNORIEREN - automatischer Live-Test Codex.`
  - Foto: kleines Test-PNG.
- Ergebnis:
  - Erfolgsscreen wurde angezeigt.
  - Anfrage-ID: `7359eea0-0ccc-423b-9e06-c6ba1feaa206`.
  - `GET /ankauf/status/7359eea0-0ccc-423b-9e06-c6ba1feaa206` -> 200.
  - Supabase `ankauf_requests`: Eintrag vorhanden, Status `Eingegangen`, Kategorie `Nintendo`, Plattform `Nintendo DS`, Zustand `Gut`, Menge `1`, Testmarker in Beschreibung vorhanden.
  - Storage Bucket `ankauf-items`: Upload vorhanden unter `7359eea0-0ccc-423b-9e06-c6ba1feaa206/00.png`.
- Mail-Fund:
  - Resend-Logs zeigten beim Test zwei fehlgeschlagene POSTs:
    - Kundenmail: 403, weil ohne verifizierte Domain nur an die Resend-eigene Testadresse gesendet werden darf.
    - Adminmail: 422, weil `ADMIN_EMAIL` kommasepariert war und vorher als ein String an Resend ging.
  - API gab trotzdem keine `emailWarning` zurueck, weil Resend-Fehler als `{ error }` aufloesen und nicht zwingend als Promise-Rejection.
- Fix in `app/api/ankauf/route.ts`:
  - `ADMIN_EMAIL` wird jetzt per Komma in eine saubere Empfaengerliste geparst.
  - Resend-Ergebnisse mit `value.error` werden jetzt als Mail-Fehler erkannt.
  - Bei teilweisem Fehler kommt `emailWarning: "Eine E-Mail-Benachrichtigung konnte nicht gesendet werden."`, bei komplettem Fehler bleibt die bestehende Warnung.
- Nachfix-Verifikation:
  - `npx tsc --noEmit --incremental --tsBuildInfoFile node_modules\.cache\tsc-perf.tsbuildinfo` erfolgreich.
  - Status-Link der Test-Anfrage weiterhin 200.

**Codex Wizard-Zubehoer-Checklisten 2026-06-18:**
- User-Auftrag: Als naechsten Schritt die produktabhaengigen Zubehoer-Checklisten im AnkaufWizardV2 bauen.
- Geaenderte Dateien:
  - `components/ankauf/v2/price/priceCatalog.ts`
  - `components/ankauf/v2/price/loadPriceCatalog.ts`
  - `components/ankauf/v2/price/AnkaufPriceToolV2.tsx`
  - `components/ankauf/v2/wizard/AnkaufWizardV2.tsx`
  - `app/ankauf/page.tsx`
  - `app/ankauf/ankauf.css`
  - `HANDOVER.md`
- Umsetzung:
  - `PriceVariant` kennt jetzt optional `requiredAccessories` und `optionalAccessories`.
  - `loadPriceCatalog()` laedt `required_accessories` und `optional_accessories` aus `ankauf_price_variants`.
  - Preis-Tool schreibt beim Uebergang zum Wizard jetzt `variantId` in `retroase_price_tool_items`.
  - `AnkaufWizardV2` bekommt `priceCatalog.variants` als Prop, liest die `variantId` beim Import und zeigt in Schritt 2 eine Checkliste je Produkt.
  - Wenn im Admin noch keine Zubehoerlisten gepflegt sind, nutzt der Wizard sinnvolle Fallbacks nach Produktfamilie/Typ: z. B. Switch, DS/3DS, Game Boy, PlayStation/Xbox, Spiele, Karten.
  - UI trennt "Wichtig fuer den Preis" und "Bonus-Zubehoer"; Auswahl bleibt weiter als Textliste im bestehenden API-Description-Vertrag. Keine API-/DB-Vertragsaenderung.
  - Light Mode und Mobile-Stacking fuer die neuen Kit-Flaechen ergaenzt.
- Verifikation:
  - `npx tsc --noEmit --incremental --tsBuildInfoFile node_modules\.cache\tsc-perf.tsbuildinfo` erfolgreich.
  - `GET http://127.0.0.1:3000/ankauf` -> 200.
  - Headless-Chrome-Smoke auf 390px mit DS-Lite-Import: Checkliste zeigt `Ladegerat / Netzteil`, `Stift / Stylus`, `Originalverpackung`, `Anleitung`, `Tasche`; horizontaler Overflow `0`.
- Naechster sinnvoller Schritt:
  - Im Admin bei wichtigen Varianten echte Pflicht-/Optional-Listen einpflegen und pruefen, ob der Wizard danach "Checkliste aus deinem Preis-Katalog" statt Fallback anzeigt.
  - Danach: Barcode/EAN-Scanner oder per-Produkt-Fotoanforderungen.

**Codex Visual Product Picker 2026-06-18:**
- User-Auftrag: Preis-Tool spielerischer wie einen Auto-Konfigurator gestalten: Logos/Bilder, Modellkarten und Ausstattungsliste.
- Geaenderte Dateien:
  - `components/ankauf/v2/price/priceCatalog.ts`
  - `components/ankauf/v2/price/loadPriceCatalog.ts`
  - `components/ankauf/v2/price/AnkaufPriceToolV2.tsx`
  - `app/ankauf/ankauf.css`
  - `HANDOVER.md`
- Umsetzung:
  - `PriceVariant` kennt jetzt `brandLogoUrl`, `familyImageUrl` und `imageUrl`.
  - `loadPriceCatalog()` laedt `logo_url` aus `ankauf_price_brands`, `image_url` aus `ankauf_price_devices` und `image_url` aus `ankauf_price_variants`.
  - Preis-Tool zeigt jetzt einen visuellen Setup-Builder:
    1. Marke als Logo-Karte
    2. Reihe als horizontale Bild-/Badge-Auswahl
    3. Modell als Produktkarte mit Bildflaeche, Typ/Nachfrage-Badge, Basisrange und Mini-Ausstattung
  - Wenn noch keine echten Bilder im Admin gepflegt sind, erscheinen bewusst gestaltete Retro-Fallback-Karten statt kaputter Images.
  - Ausstattungspanel zeigt Pflicht-/Optionalteile aus Admin-Daten oder sinnvolle Fallbacks.
  - Alte Select-Struktur bleibt versteckt als defensiver Fallback im Code, sichtbar ist der neue Konfigurator.
- Verifikation:
  - `npx tsc --noEmit --incremental --tsBuildInfoFile node_modules\.cache\tsc-perf.tsbuildinfo` erfolgreich.
  - Headless-Chrome-Smoke auf 390px: 6 Marken-Karten, Reihen-/Modellkarten, Ausstattungsliste sichtbar, Console-Errors `0`, horizontaler Overflow `0`.
- Wichtiger Hinweis:
  - Aktuell sind im `public`-Ordner keine echten Konsolen-/Logo-Bilddateien gefunden worden. Sobald im Admin `logo_url`/`image_url` auf erlaubte Quellen zeigen (`/images/...`, Supabase Storage, eBay image host, placehold.co), werden echte Bilder automatisch gerendert.

**Codex AnkaufFunnelV3 2026-06-18:**
- User-Entscheidung: `/ankauf` war zu ueberladen. Schätzer und direkter Ankauf sollen zu einem fokussierten Erlebnis verschmelzen: erst immer Wert schätzen, bei Einverstaendnis dann in eine geschlossene Formular-/Checkout-Umgebung.
- Neu:
  - `components/ankauf/v3/AnkaufFunnelV3.tsx`
- Geaenderte Dateien:
  - `app/ankauf/page.tsx`
  - `components/ankauf/v2/price/AnkaufPriceToolV2.tsx`
  - `app/ankauf/ankauf.css`
  - `HANDOVER.md`
- Umsetzung:
  - `/ankauf` rendert jetzt nur noch den V3-Funnel, nicht mehr die lange Hero/S1-S6/FOMO/FAQ/Wizard-Scrollseite.
  - Der erste Screen ist der Ankauf-Automat mit Preis-Tool, Mini-Trust-Bar und kompakten Proof-Hinweisen.
  - `AnkaufPriceToolV2` kann jetzt optional im Funnel-Modus laufen:
    - `offerCtaLabel`
    - `onOfferStart`
    - `requireRevealBeforeOffer`
  - Im Funnel ist der CTA erst nach dem Wert-Reveal aktiv und lautet sinngemaess "Schatzung passt - Ankauf starten".
  - Beim Start wird die Paketliste weiter ins bestehende `retroase_price_tool_items` geschrieben; danach mountet `AnkaufWizardV2` im Fokus-Modus und liest den Import wie bisher.
  - `#preisschaetzer` bleibt der erste Screen, `#angebot` bleibt der Fokus-/Wizard-Screen. Direktaufruf von `#angebot` schaltet den Fokusmodus ein.
  - Lange Trust-/FOMO-/Story-Sektionen bleiben im Code, werden auf `/ankauf` aber nicht mehr gerendert.
- Verifikation:
  - `npx.cmd tsc --noEmit --incremental --tsBuildInfoFile node_modules\.cache\tsc-perf.tsbuildinfo` erfolgreich.
  - `GET http://127.0.0.1:3000/ankauf` -> 200.
  - HTML-Smoke: `ak-funnel-v3` und `ak-price-tool` vorhanden, alte Hero-Klasse nicht mehr im ausgelieferten HTML.
- Hinweis:
  - Headless-Chrome-Smoke konnte in dieser Umgebung nicht voll ausgefuehrt werden: Node-REPL wurde durch Windows-Sandbox blockiert, Projekt hat kein lokales `playwright` Package. Manuell im Browser/Handy testen.

**Gefuehrter rebuy-Wizard (Preis-Tool) 2026-06-21:**
- User-Auftrag: `/ankauf` vom System her wie rebuy.de bauen — voll gefuehrt ("man wird durchgefuehrt"), foolproof ("jeder 70-Jaehrige checkt es"), grosse Kacheln, Modell-Detailschritt mit Bild links wie rebuy, aber im RetrOase-/VAULT-Stil. Architektur-Entscheidung des Users: **gefuehrter Wizard IN `/ankauf`** (keine eigenen Routen pro Marke, Anker bleiben).
- Geaenderte Dateien:
  - `components/ankauf/v2/price/AnkaufPriceToolV2.tsx`
  - `app/ankauf/ankauf.css`
  - `HANDOVER.md`
- Umsetzung (nur **Einzel-Modus**; Sammlungs-Modus bleibt bewusst offenes Accordion fuer Mehrfach-Hinzufuegen):
  - Neuer State `step` (1–4) + `goToStep()`; `guided = mode === "single"`.
  - Schritte: **1 Marke → 2 Reihe → 3 Modell → 4 Wert**. Immer nur ein Schritt sichtbar (`hidden`-Attribut je Schritt: `guided ? step !== N : <alte Bedingung>`).
  - **Stepper** oben (`.ak-wizard-stepper`): klickbar bis zum erreichten Schritt, erledigte Schritte mit Haekchen (`CheckCircle2`).
  - **Auto-Weiter** bei Klick auf Marke/Reihe (`handleBrandChange`→step2, `handleFamilyChange`→step3); Suchtreffer (`selectVariant`)→step4. Expliziter **Weiter/Zurueck** (`.ak-wizard-nav`), `Weiter` ist gegated via `canAdvance`.
  - **Modell-Schritt im 2-Spalten-Layout** (`.ak-modell-split`): grosses Produktbild links (`.ak-modell-hero-img`, zeigt gewaehlte oder erste Variante), Optionen rechts. Modell-Grid in `const modelOptions` extrahiert (DRY: wird im Split UND im Accordion-Fallback genutzt).
  - **Groessere Marken-Kacheln** im Flow via `[data-guided="true"] .ak-brand-grid` (3 Spalten, zentriert, Logo oben).
  - Reveal + "Ankauf starten"-CTA + Einzel-Zusammenfassung erscheinen erst bei `step === 4`.
  - Root traegt `data-guided="true"` im Einzel-Modus.
- Invarianten eingehalten: **keine** API-/DB-/localStorage-Vertragsaenderung; `#preisschaetzer`/`#angebot` unberuehrt; alles unter `.ak-stage`/`ak-*`; Funnel-Props (`offerCtaLabel`/`onOfferStart`/`requireRevealBeforeOffer`) unveraendert. Light-Mode-Overrides fuer Stepper/Back/Modell-Hero ergaenzt.
- Verifikation:
  - `npx tsc --noEmit --incremental` erfolgreich (EXIT 0).
  - `GET http://127.0.0.1:3000/ankauf` -> 200; HTML-Smoke: `data-guided`, `ak-wizard-stepper`, `ak-modell-split`, "Welches Modell" vorhanden.
- Naechster sinnvoller Schritt (vom User noch offen, NICHT gebaut):
  - Foto-Upload + Mail/Kontakt als **finalen Wizard-Schritt 5** direkt inline (statt erst im separaten `#angebot`-Screen). User-Wortlaut: "auch die Moeglichkeit fuer die Bilder". Entscheidung B1 (nahtloser Sprung) vs. B2 (Formular inline) noch offen.
  - Optional: Daten-Umlaute im Fallback-Katalog / Supabase-Admin ("Zubehoer", "Nur Geraet").
