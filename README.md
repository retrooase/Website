# RetrOase — Website

> **"Wo Gaming-Träume wahr werden."**
> Retro-Gaming Shop aus Deutschland — geprüfte Secondhand-Ware, persönliches Team.

---

## 🚀 Schnellstart (Lokale Entwicklung)

### Voraussetzungen
- Node.js 18+ (aktuell installiert: v24)
- npm 10+
- Supabase-Account (kostenlos unter [supabase.com](https://supabase.com))
- Vercel-Account für Deployment

### 1. Repository klonen
```bash
git clone https://github.com/DEIN-USER/retroase-website.git
cd retroase-website
npm install
```

### 2. Umgebungsvariablen einrichten
```bash
# .env.local öffnen und alle Platzhalter mit echten Werten ersetzen
```

**Pflicht-Keys für den Start:**
| Variable | Wo finden? |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_KEY` | Supabase → Project Settings → API |
| `NEXTAUTH_SECRET` | Terminal: `openssl rand -base64 32` |

### 3. Datenbank einrichten
1. [Supabase-Projekt erstellen](https://app.supabase.com/new)
2. SQL Editor öffnen
3. Datei `supabase/schema.sql` vollständig ausführen
4. Storage Buckets anlegen (Anleitung am Ende der schema.sql)

### 4. Entwicklungsserver starten
```bash
npm run dev
```
Website läuft auf: http://localhost:3000

---

## 📁 Projektstruktur

```
retroase-website/
├── app/
│   ├── (shop)/          → Öffentliche Seiten (Startseite, Shop, Blog…)
│   ├── (admin)/         → Admin-Bereich (geschützt)
│   └── api/             → API-Routen (Stripe, eBay, Newsletter…)
├── components/
│   ├── ui/              → Wiederverwendbare UI-Komponenten
│   ├── shop/            → Shop-spezifische Komponenten
│   └── admin/           → Admin-Komponenten
├── lib/
│   ├── supabase/        → Supabase-Clients (Browser & Server)
│   └── constants.ts     → Alle Texte & Konfigurationen
├── types/               → TypeScript-Typen
├── data/                → Fallback-JSON-Daten (Beispielprodukte)
├── supabase/
│   └── schema.sql       → Vollständiges Datenbankschema
└── public/              → Statische Assets, Favicon, OG-Images
```

---

## 🔧 API-Keys — Übersicht & Setup

### Supabase (Datenbank & Auth)
1. [supabase.com](https://supabase.com) → Neues Projekt erstellen
2. Settings → API → URL + Anon Key + Service Role Key kopieren
3. SQL Editor → `supabase/schema.sql` ausführen

### Stripe (Zahlungen)
1. [dashboard.stripe.com](https://dashboard.stripe.com) → Account erstellen
2. Developers → API Keys → Publishable Key + Secret Key kopieren
3. Zahlungsmethoden aktivieren: Klarna, SEPA, Apple/Google Pay
4. **Deutschland-Setup**: Stripe-Account muss verifiziert sein (Personalausweis)
5. Webhook erstellen: `https://retroase.de/api/stripe/webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`

### eBay Developer API
1. [developer.ebay.com](https://developer.ebay.com) → Anmelden (mit eBay-Account)
2. My Account → Application Keys → Client ID + Secret kopieren
3. Für Sync: OAuth Refresh Token generieren (Anleitung in `/lib/ebay/`)

### Resend (E-Mail)
1. [resend.com](https://resend.com) → Account erstellen
2. Domain `retroase.de` verifizieren (DNS-Einträge setzen)
3. API Keys → Neuen Key erstellen
4. Absender-E-Mail in Resend freigeben: `hallo@retroase.de`

---

## 🚢 Deployment (Vercel)

```bash
# 1. GitHub-Repo anlegen und Code pushen
git init
git add .
git commit -m "Initial commit: RetrOase Phase 1"
git remote add origin https://github.com/DEIN-USER/retroase-website.git
git push -u origin main

# 2. Vercel verbinden
# vercel.com → New Project → GitHub-Repo importieren

# 3. Umgebungsvariablen in Vercel eintragen:
# Vercel Dashboard → Project → Settings → Environment Variables
# Alle Werte aus .env.local übertragen (ohne die Kommentare)
```

---

## 📦 Technologie-Stack

| Bereich | Technologie |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + CSS Variables |
| Datenbank | Supabase (PostgreSQL) |
| Auth | Supabase Auth + NextAuth |
| Payments | Stripe |
| E-Mail | Resend |
| eBay-Sync | eBay Developer API |
| Deployment | Vercel |
| TypeScript | Strict Mode |

---

## 🎯 Phasen-Status

- [x] **Phase 1** — Fundament (Next.js, Design System, Globale Komponenten, Supabase)
- [ ] **Phase 2** — Shop (Startseite, Produkt-Grid, Detail-Seite, Wunschliste)
- [ ] **Phase 3** — Ankauf-Tool (Wizard, Foto-Upload, E-Mail)
- [ ] **Phase 4** — Accounts & Alerts (Auth, Profil, Wunschlisten-Alerts)
- [ ] **Phase 5** — Admin (Dashboard, Produkt-Verwaltung, eBay-Sync)
- [ ] **Phase 6** — Blog & Rechtliches (DSGVO, Impressum, AGB)
- [ ] **Phase 7** — Finish & Deploy (SEO, Performance, Vercel)

---

## 👥 Team

| Person | Rolle |
|---|---|
| Eren | Inhaber & Gesicht von RetrOase |
| Emir | Mitgründer & Entwicklung |
| [Kollege] | Team-Mitglied |

**Kontakt:** hallo@retroase.de

---

## ⚠️ Sicherheitshinweise

- **`.env.local` NIEMALS in Git committen** — enthält alle API-Schlüssel
- Die Datei ist bereits in `.gitignore` eingetragen
- Für Production: Alle Test-Keys durch Live-Keys ersetzen
- Supabase RLS (Row Level Security) ist für alle Tabellen aktiv

---

*© 2025 RetrOase. Schwestermarke: [KaizenDesk.de](https://kaizendesk.de)*
"# Website" 
