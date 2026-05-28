# RetrOase — Claude Projektkontext

## Projekt
RetrOase ist ein deutscher Retro-Gaming-Shop für geprüfte Secondhand-Ware.

Slogan:
"Wo Gaming-Träume wahr werden."

## Tech Stack
- Next.js 14 App Router
- TypeScript strict
- Tailwind CSS
- Supabase
- Stripe
- Resend
- Vercel

## Design
Stil: Modernes Premium E-Commerce mit Retro-Akzenten.

Farben (Dark Mode):
- background: #050505
- surface: #111111
- surface-hover: #1a1a1a
- text-primary: #ffffff
- text-secondary: #b5b5b5
- border: #2a2a2a
- accent-orange: #ff6b35 (Hauptmarkenfarbe)
- accent-yellow: #ffcc02
- accent-green: #39ff14

Farben (Light Mode):
- background: #ffffff
- surface: #ffffff
- surface-hover: #f5f5f5
- text-primary: #111111
- text-secondary: #555555
- border: #e5e5e5
- accent-orange: #ff6b35

Fonts:
- Press Start 2P nur sparsam: Logo, Badges, kleine Akzente
- Inter als Hauptschrift: UI, Navigation, Buttons, Produkttexte
- JetBrains Mono für Preise/Codes

## Entwicklungsregeln
- Mobile first
- Kleine Komponenten bauen
- TypeScript strict einhalten
- next/image für Bilder verwenden
- Bestehendes Design-System respektieren
- Keine unnötigen Libraries installieren
- Keine globalen Refactors ohne Auftrag
- Keine fremden Seiten anfassen
- Nur die angeforderte Komponente oder Datei ändern
- Performance beachten

## Projektstruktur
- /app
- /components
- /lib
- /data
- /types
- /public
- /supabase

## Arbeitsweise
Claude soll immer wie ein vorsichtiger Senior Developer arbeiten:
1. Erst bestehende Struktur prüfen
2. Nur den aktuellen Task umsetzen
3. Möglichst wenige Dateien ändern
4. Am Ende geänderte Dateien nennen
5. Kurz sagen, was erledigt wurde