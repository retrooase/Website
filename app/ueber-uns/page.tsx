import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Truck, Users, Gamepad2 } from "lucide-react";
import { SITE, TEAM, TRUST_BADGES } from "@/lib/constants";
import { breadcrumbSchema, jsonLdString } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Über uns",
  description:
    "RetrOase ist ein deutscher Retro-Gaming-Shop für geprüfte Secondhand-Konsolen, Spiele und Pokémon-Karten. Lerne das Team hinter RetrOase kennen.",
  alternates: {
    canonical: "/ueber-uns",
  },
};

export default function UeberUnsPage() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(breadcrumbSchema([{ name: "Startseite", url: "/" }, { name: "Über uns" }])),
        }}
      />

      <section className="border-b border-border bg-surface">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-accent-orange mb-3">
            Unsere Geschichte
          </p>
          <h1
            className="font-sans font-bold text-text-primary mb-4"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
          >
            Über RetrOase
          </h1>
          <p className="font-sans text-sm text-text-secondary max-w-xl leading-relaxed">
            {SITE.slogan} Wir sind ein deutscher Retro-Gaming-Shop mit Leidenschaft für
            Konsolen, Spiele und Sammlerstücke, die eine zweite Chance verdienen.
          </p>
        </div>
      </section>

      <section className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        <div className="space-y-4">
          <h2 className="font-sans font-bold text-text-primary text-xl">Was uns antreibt</h2>
          <p className="font-sans text-sm text-text-secondary leading-relaxed">
            RetrOase entstand aus der Leidenschaft für Retro-Gaming und dem Wunsch, gebrauchte
            Konsolen, Spiele und Sammlerstücke fair und transparent weiterzugeben. Jedes Produkt in
            unserem Shop wird vor dem Verkauf sorgfältig geprüft — so weißt du genau, was du bekommst.
          </p>
          <p className="font-sans text-sm text-text-secondary leading-relaxed">
            Ob altes Game Boy, gesuchtes SNES-Modul oder Pokémon-Sammlung aus dem Keller: Wir kaufen
            an, prüfen, und geben Klassikern ein neues Zuhause.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { icon: ShieldCheck, title: "Geprüfte Ware", text: "Jedes Produkt wird auf Zustand und Funktion geprüft, bevor es in den Shop kommt." },
            { icon: Truck, title: "Schneller Versand", text: "Bestellungen verlassen unser Lager in der Regel innerhalb von 1–2 Werktagen." },
            { icon: Gamepad2, title: "Ehrliche Zustandsbewertung", text: "Wir beschönigen nichts — Zustand und Gebrauchsspuren sind klar dokumentiert." },
            { icon: Users, title: "Persönlicher Kontakt", text: "Fragen zu einem Produkt oder deinem Ankauf? Wir antworten persönlich." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-3 p-5 bg-surface border border-border">
              <Icon size={20} className="text-accent-orange flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-sans font-semibold text-text-primary text-sm mb-1">{title}</p>
                <p className="font-sans text-xs text-text-secondary leading-relaxed">{text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="font-sans font-bold text-text-primary text-xl">Das Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-5 bg-surface border border-border">
              <p className="font-sans font-bold text-text-primary text-sm">{TEAM.eren.name}</p>
              <p className="font-sans text-xs text-accent-orange mb-2">{TEAM.eren.role}</p>
            </div>
            <div className="p-5 bg-surface border border-border">
              <p className="font-sans font-bold text-text-primary text-sm">{TEAM.emir.name}</p>
              <p className="font-sans text-xs text-accent-orange mb-2">{TEAM.emir.role}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <p className="font-sans text-xs text-text-secondary mb-4 uppercase tracking-wide">
            Darauf kannst du dich verlassen
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {TRUST_BADGES.map((badge) => (
              <li key={badge.text} className="flex items-center gap-2 font-sans text-sm text-text-secondary">
                <span aria-hidden="true">{badge.icon}</span>
                {badge.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-border pt-8">
          <Link
            href="/shop"
            className="px-6 py-3 bg-accent-orange text-white font-sans text-sm font-semibold hover:bg-accent-orange/90 transition-colors"
          >
            Zum Shop
          </Link>
          <Link
            href="/kontakt"
            className="px-6 py-3 border border-border text-text-primary font-sans text-sm font-semibold hover:border-accent-orange transition-colors"
          >
            Kontakt aufnehmen
          </Link>
        </div>
      </section>
    </div>
  );
}
