import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Users, Gamepad2, Sparkles } from "lucide-react";
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

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Geprüfte Ware",
    text: "Jedes Produkt wird auf Zustand und Funktion geprüft, bevor es in den Shop kommt.",
    accent: "rgba(34,211,163,0.10)",
    iconColor: "text-accent-teal",
    iconRgb: "34,211,163",
  },
  {
    icon: Truck,
    title: "Schneller Versand",
    text: "Bestellungen verlassen unser Lager in der Regel innerhalb von 1–2 Werktagen.",
    accent: "rgba(255,95,46,0.10)",
    iconColor: "text-accent-orange",
    iconRgb: "255,95,46",
  },
  {
    icon: Gamepad2,
    title: "Ehrliche Zustandsbewertung",
    text: "Wir beschönigen nichts — Zustand und Gebrauchsspuren sind klar dokumentiert.",
    accent: "rgba(240,164,41,0.10)",
    iconColor: "text-accent-gold",
    iconRgb: "240,164,41",
  },
  {
    icon: Users,
    title: "Persönlicher Kontakt",
    text: "Fragen zu einem Produkt oder deinem Ankauf? Wir antworten persönlich.",
    accent: "rgba(255,95,46,0.08)",
    iconColor: "text-accent-orange",
    iconRgb: "255,95,46",
  },
] as const;

const TEAM_MEMBERS = [
  { ...TEAM.eren, color: "orange" as const },
  // Emir & Ibrahim vorerst ausgeblendet
];

const AVATAR_STYLES = {
  orange: { rgb: "255,95,46", text: "text-accent-orange" },
  gold: { rgb: "240,164,41", text: "text-accent-gold" },
  teal: { rgb: "34,211,163", text: "text-accent-teal" },
} as const;

function getInitials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}

export default function UeberUnsPage() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(breadcrumbSchema([{ name: "Startseite", url: "/" }, { name: "Über uns" }])),
        }}
      />

      {/* Hero */}
      <section
        className="relative isolate overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 22% 0%, rgba(255,95,46,0.14), transparent 62%), radial-gradient(ellipse 54% 46% at 82% 30%, rgba(34,211,163,0.08), transparent 66%)",
        }}
        aria-labelledby="ueber-uns-heading"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 76% 68% at 50% 20%, black 24%, transparent 84%)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-14 sm:pb-20">
          <div className="max-w-2xl">
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border mb-6"
              style={{ background: "rgba(255,95,46,0.10)", borderColor: "rgba(255,95,46,0.30)" }}
            >
              <Sparkles size={13} className="text-accent-orange" aria-hidden="true" />
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-accent-orange">
                Unsere Geschichte
              </span>
            </div>

            <h1
              id="ueber-uns-heading"
              className="font-display font-extrabold leading-[1.02] tracking-tight text-white mb-5"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
            >
              Über{" "}
              <span
                className="text-accent-orange"
                style={{ textShadow: "0 0 34px rgba(255,95,46,0.4)" }}
              >
                RetrOase
              </span>
            </h1>

            <p className="font-sans text-base leading-relaxed text-white/60 max-w-xl">
              {SITE.slogan} Wir sind ein deutscher Retro-Gaming-Shop mit Leidenschaft für
              Konsolen, Spiele und Sammlerstücke, die eine zweite Chance verdienen.
            </p>
          </div>
        </div>
      </section>

      {/* Was uns antreibt */}
      <section className="py-16 sm:py-24 scroll-fade bg-surface">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10 sm:mb-14">
            <p className="font-sans text-xs font-semibold tracking-[0.18em] uppercase text-accent-orange mb-3">
              Warum RetrOase
            </p>
            <h2
              className="font-display font-bold text-text-primary mb-4"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
            >
              Was uns antreibt
            </h2>
            <p className="font-sans text-sm text-text-secondary leading-relaxed mb-3">
              RetrOase entstand aus der Leidenschaft für Retro-Gaming und dem Wunsch, gebrauchte
              Konsolen, Spiele und Sammlerstücke fair und transparent weiterzugeben. Jedes Produkt
              in unserem Shop wird vor dem Verkauf sorgfältig geprüft — so weißt du genau, was du
              bekommst.
            </p>
            <p className="font-sans text-sm text-text-secondary leading-relaxed">
              Ob altes Game Boy, gesuchtes SNES-Modul oder Pokémon-Sammlung aus dem Keller: Wir
              kaufen an, prüfen, und geben Klassikern ein neues Zuhause.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {FEATURES.map(({ icon: Icon, title, text, accent, iconColor, iconRgb }) => (
              <div
                key={title}
                className="group relative flex flex-col gap-4 p-5 sm:p-6 rounded-2xl border border-border bg-background hover:border-border-strong hover:-translate-y-0.5 hover:shadow-hover transition-all duration-200 min-h-[160px]"
                style={{ background: `linear-gradient(135deg, ${accent} 0%, var(--background) 60%)` }}
              >
                <div
                  className="w-11 h-11 flex items-center justify-center rounded-xl border"
                  style={{ background: `rgba(${iconRgb},0.10)`, borderColor: `rgba(${iconRgb},0.25)` }}
                >
                  <Icon size={20} className={iconColor} aria-hidden="true" />
                </div>
                <div>
                  <p className="font-display font-bold text-text-primary text-sm leading-snug">{title}</p>
                  <p className="font-sans text-xs text-text-tertiary mt-1.5 leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section
        className="py-16 sm:py-24 scroll-fade relative overflow-hidden"
        style={{ background: "transparent" }}
        aria-labelledby="team-heading"
      >
        <div
          className="absolute top-0 right-0 w-[420px] h-[420px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(240,164,41,0.10) 0%, transparent 65%)" }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 sm:mb-14">
            <p className="font-sans text-xs font-semibold tracking-[0.18em] uppercase text-accent-orange mb-3">
              Die Köpfe dahinter
            </p>
            <h2
              id="team-heading"
              className="font-display font-bold text-text-primary"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
            >
              Das Team
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-xs">
            {TEAM_MEMBERS.map((member) => {
              const style = AVATAR_STYLES[member.color];
              return (
                <div
                  key={member.name}
                  className="group flex flex-col items-center text-center gap-4 p-6 sm:p-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:border-white/[0.16] hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full border transition-transform duration-300 group-hover:scale-105"
                    style={{ background: `rgba(${style.rgb},0.12)`, borderColor: `rgba(${style.rgb},0.30)` }}
                  >
                    <span className={`font-display font-extrabold text-lg sm:text-xl ${style.text}`}>
                      {getInitials(member.name)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-base sm:text-lg">
                      {member.name}
                    </h3>
                    <p className={`mt-1.5 font-sans text-[0.68rem] font-bold uppercase tracking-[0.1em] ${style.text}`}>
                      {member.role}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust + CTA */}
      <section className="pb-16 sm:pb-24 scroll-fade">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-border pt-10 sm:pt-12">
            <p className="font-sans text-xs text-text-tertiary mb-5 uppercase tracking-[0.14em]">
              Darauf kannst du dich verlassen
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              {TRUST_BADGES.map((badge) => (
                <span
                  key={badge.text}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.035] px-3.5 py-2 font-sans text-xs font-semibold text-white/60"
                >
                  <span aria-hidden="true">{badge.icon}</span>
                  {badge.text}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-accent-orange text-white font-sans font-semibold text-sm hover:bg-accent-orange/90 hover:-translate-y-0.5 shadow-[0_4px_24px_rgba(255,95,46,0.35)] hover:shadow-[0_8px_36px_rgba(255,95,46,0.5)] transition-all duration-200"
              >
                Zum Shop
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/kontakt"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/14 bg-white/[0.045] font-sans font-semibold text-sm text-white/78 backdrop-blur hover:-translate-y-0.5 hover:border-accent-orange/50 hover:bg-accent-orange/10 hover:text-white transition-all duration-200"
              >
                Kontakt aufnehmen
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
