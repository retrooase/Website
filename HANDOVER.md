# HANDOVER — RetrOase `/ankauf` "VAULT" Redesign

> Lebender Übergabe-Stand für die Ankauf-Seite. **Nach jedem größeren Schritt aktualisieren**,
> damit ein anderer Agent (z. B. Codex) nahtlos mit dem aktuellen Stand weiterarbeiten kann.

**Letztes Update:** 2026-06-18 — Phase 2 komplett (S1–S6); Phase 3 läuft: Preis-Tool V2 + P9/P10 „Wert enthüllen"-Reveal & Trade-In-Bonus fertig.

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
