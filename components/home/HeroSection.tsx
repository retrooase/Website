"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock3,
  Eye,
  Flame,
  Gamepad2,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

const INITIAL_TIMER_SECONDS = 2 * 60 * 60 + 46 * 60 + 27;
const BASE_VIEWERS = 50;
const PURCHASES_TODAY = 12;

const TRUST_ITEMS = [
  "Unverbindlich",
  "Antwort < 24 h",
  "Kein Verkaufszwang",
  "Fair bewertet",
] as const;

const VALUE_CARDS = [
  {
    logo: "/ankauf/logos/gamecube.svg",
    title: "Nintendo & GameCube",
    label: "Konsole + Spiele",
    value: "bis 280 €",
    tone: "rgba(255, 201, 60, 0.16)",
  },
  {
    logo: "/ankauf/logos/pokemon.svg",
    title: "Pokémon-Sammlung",
    label: "Karten, Spiele, OVP",
    value: "bis 650 €",
    tone: "rgba(0, 255, 136, 0.12)",
  },
  {
    logo: "/ankauf/logos/playstation.svg",
    title: "PlayStation Klassiker",
    label: "PS1, PS2, PSP",
    value: "bis 220 €",
    tone: "rgba(54, 224, 255, 0.12)",
  },
] as const;

function formatTime(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;

  return [hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":");
}

export function HeroSection() {
  const [viewers, setViewers] = useState(BASE_VIEWERS);
  const [remaining, setRemaining] = useState(INITIAL_TIMER_SECONDS);
  const isUrgent = remaining < 3600;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemaining((current) => (current <= 0 ? INITIAL_TIMER_SECONDS : current - 1));
    }, 1000);

    const viewerPulse = window.setInterval(() => {
      const drift = Math.floor(Math.random() * 7) - 2;
      setViewers(Math.max(47, Math.min(56, BASE_VIEWERS + drift)));
    }, 2600);

    return () => {
      window.clearInterval(timer);
      window.clearInterval(viewerPulse);
    };
  }, []);

  return (
    <section
      className="relative isolate overflow-hidden"
      style={{
        minHeight: "calc(100svh - 4rem)",
        background:
          "radial-gradient(ellipse 78% 52% at 50% 0%, rgba(255, 201, 60, 0.13), transparent 68%), linear-gradient(180deg, #050507 0%, #0B0911 54%, #050507 100%)",
      }}
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 201, 60, 0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 201, 60, 0.035) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
          maskImage: "radial-gradient(ellipse 78% 70% at 50% 42%, black 28%, transparent 82%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-24 top-24 h-80 w-80 rounded-full blur-3xl"
        style={{ background: "rgba(255, 95, 46, 0.18)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full blur-3xl"
        style={{ background: "rgba(0, 255, 136, 0.09)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] max-w-8xl flex-col justify-start px-4 pb-24 pt-12 sm:px-6 sm:pb-20 sm:pt-14 lg:min-h-[calc(100svh-5rem)] lg:justify-center lg:px-8 lg:py-14">
        <div className="grid items-center gap-9 lg:grid-cols-[minmax(0,1.02fr)_minmax(360px,0.78fr)] lg:gap-14 xl:gap-20">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center lg:mx-0 lg:items-start lg:text-left">
            <div
              className="mb-5 inline-flex items-center gap-2 rounded-full border px-3.5 py-2"
              style={{
                borderColor: "rgba(255, 201, 60, 0.22)",
                background: "rgba(255, 201, 60, 0.055)",
                boxShadow: "0 0 30px rgba(255, 170, 30, 0.10)",
              }}
            >
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-error opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-error shadow-[0_0_12px_rgba(255,69,102,0.9)]" />
              </span>
              <span className="font-sans text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-accent-gold">
                Ankauf live · Retro-Gaming DE
              </span>
            </div>

            <h1
              id="hero-heading"
              className="font-display text-[2.75rem] font-extrabold leading-[0.94] tracking-normal text-white sm:text-[4.25rem] lg:text-[5.8rem] xl:text-[6.6rem]"
            >
              <span className="block">Wo Gaming-Träume</span>
              <span
                className="block text-accent-orange"
                style={{
                  textShadow: "0 0 34px rgba(255, 95, 46, 0.55), 0 0 82px rgba(255, 95, 46, 0.22)",
                }}
              >
                wahr werden.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-pretty font-sans text-base leading-relaxed text-white/62 sm:text-lg">
              Verkauf deine Retro-Konsolen, Spiele und Pokémon-Karten ohne Rätselraten:
              fair einschätzen lassen, Angebot bekommen, erst dann entscheiden.
            </p>

            <div className="mt-6 grid w-full max-w-md grid-cols-3 gap-2 lg:hidden">
              <article className="rounded-2xl border border-accent-gold/20 bg-accent-gold/[0.06] px-2.5 py-3 text-center">
                <strong className="block font-mono text-sm font-extrabold text-accent-gold">4,2 Mio.</strong>
                <span className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.08em] text-white/38">ungenutzt</span>
              </article>
              <article className="rounded-2xl border border-accent-teal/20 bg-accent-teal/[0.055] px-2.5 py-3 text-center">
                <strong className="block font-mono text-sm font-extrabold text-accent-teal">{viewers}</strong>
                <span className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.08em] text-white/38">live hier</span>
              </article>
              <article className="rounded-2xl border border-accent-orange/25 bg-accent-orange/[0.07] px-2.5 py-3 text-center">
                <strong className="block font-mono text-sm font-extrabold text-accent-orange">{PURCHASES_TODAY}</strong>
                <span className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.08em] text-white/38">heute</span>
              </article>
            </div>

            <div className="mt-7 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center lg:mt-8 lg:justify-start">
              <Link
                href="/ankauf"
                className="group relative inline-flex min-h-[54px] items-center justify-center overflow-hidden rounded-full px-7 py-4 font-sans text-sm font-extrabold text-[#281600] transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-accent-gold sm:min-h-[58px] sm:text-base"
                style={{
                  background: "linear-gradient(135deg, #FFE9A8 0%, #FFC93C 42%, #FF8A1F 100%)",
                  boxShadow:
                    "0 14px 44px rgba(255, 170, 30, 0.42), inset 0 1px 0 rgba(255,255,255,0.65), inset 0 -2px 8px rgba(180,90,0,0.35)",
                }}
              >
                <span
                  className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 skew-x-[-18deg] bg-white/45"
                  style={{ animation: "shine-pass 3.2s ease-in-out infinite" }}
                  aria-hidden="true"
                />
                <span className="relative inline-flex items-center gap-2">
                  Gratis Preis schätzen lassen
                  <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Link>

              <Link
                href="/shop"
                className="mx-auto inline-flex min-h-[54px] w-full max-w-[15.5rem] items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.035] px-7 py-4 font-sans text-sm font-bold text-white/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-orange/50 hover:bg-accent-orange/10 hover:text-white sm:mx-0 sm:min-h-[58px] sm:w-auto sm:max-w-none sm:text-base"
              >
                Danach in den Shop
                <Gamepad2 size={17} />
              </Link>
            </div>

            <div className="mt-5 hidden w-full max-w-md grid-cols-2 gap-2 sm:flex sm:max-w-none sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-5 sm:gap-y-2 lg:justify-start">
              {TRUST_ITEMS.map((item) => (
                <span key={item} className="inline-flex items-center justify-center gap-1.5 font-sans text-[0.72rem] font-semibold text-white/48 sm:text-xs">
                  <Check size={13} className="text-accent-teal" strokeWidth={3} aria-hidden="true" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto hidden w-full max-w-[440px] lg:block lg:max-w-none" aria-label="Live Ankauf-Status">
            <div
              className="pointer-events-none absolute -inset-8 rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(255, 201, 60, 0.18), transparent 66%)" }}
              aria-hidden="true"
            />

            <div className="relative grid gap-3 sm:gap-4">
              <article
                className="relative overflow-hidden rounded-[1.6rem] border p-5 text-center sm:p-6 lg:p-7"
                style={{
                  borderColor: "rgba(255, 201, 60, 0.2)",
                  background: "linear-gradient(160deg, rgba(22, 22, 31, 0.88), rgba(5, 5, 7, 0.92))",
                  boxShadow: "0 22px 70px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                <div
                  className="pointer-events-none absolute inset-x-10 top-0 h-px"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255, 233, 168, 0.85), transparent)" }}
                  aria-hidden="true"
                />
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                  <Sparkles size={13} className="text-accent-gold" aria-hidden="true" />
                  <span className="font-sans text-[0.66rem] font-extrabold uppercase tracking-[0.16em] text-white/48">
                    FOMO aus dem Keller
                  </span>
                </div>
                <strong
                  className="block font-display text-5xl font-extrabold leading-none text-accent-gold sm:text-6xl lg:text-7xl"
                  style={{ textShadow: "0 0 34px rgba(240,164,41,0.48), 0 0 88px rgba(240,164,41,0.20)" }}
                >
                  4,2 Mio.
                </strong>
                <p className="mx-auto mt-3 max-w-xs text-pretty font-sans text-sm leading-relaxed text-white/54">
                  ungenutzte Geräte liegen in Schubladen, Kartons und Kellern. Vielleicht ist deins das nächste Angebot.
                </p>
              </article>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <article className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 backdrop-blur">
                  <span className="relative flex items-center justify-center" aria-hidden="true">
                    <span className="absolute h-3 w-3 animate-pulse-ring rounded-full bg-accent-teal" />
                    <span className="h-2 w-2 rounded-full bg-accent-teal" />
                  </span>
                  <p className="text-left font-sans text-xs leading-tight text-white/62">
                    <span className="font-extrabold text-accent-teal tabular-nums">{viewers}</span> schauen gerade
                  </p>
                </article>

                <article
                  className="rounded-2xl border px-4 py-4 text-center backdrop-blur transition-colors"
                  style={{
                    borderColor: isUrgent ? "rgba(255, 95, 46, 0.4)" : "rgba(255, 255, 255, 0.1)",
                    background: isUrgent ? "rgba(255, 95, 46, 0.08)" : "rgba(255, 255, 255, 0.04)",
                  }}
                >
                  <span className="mb-1 flex items-center justify-center gap-1.5 font-sans text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-white/38">
                    <Clock3 size={11} className={isUrgent ? "text-accent-orange" : "text-white/38"} aria-hidden="true" />
                    Preisrunde
                  </span>
                  <strong className="font-mono text-base font-extrabold tabular-nums text-white sm:text-lg">
                    {formatTime(remaining)}
                  </strong>
                </article>

                <article className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 backdrop-blur">
                  <Flame size={17} className="text-accent-orange" aria-hidden="true" />
                  <p className="text-left font-sans text-xs leading-tight text-white/62">
                    Heute schon <span className="font-extrabold text-white tabular-nums">{PURCHASES_TODAY}</span> Ankäufe
                  </p>
                </article>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {VALUE_CARDS.map((card) => (
                  <article
                    key={card.title}
                    className="group rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-gold/40"
                  >
                    <div
                      className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl"
                      style={{ background: card.tone }}
                    >
                      <Image src={card.logo} alt="" width={26} height={26} aria-hidden="true" />
                    </div>
                    <p className="font-sans text-xs font-extrabold text-white/86">{card.title}</p>
                    <p className="mt-0.5 font-sans text-[0.68rem] leading-tight text-white/36">{card.label}</p>
                    <p className="mt-3 font-mono text-sm font-extrabold text-accent-gold">{card.value}</p>
                  </article>
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-center font-sans text-xs text-white/42">
                <Eye size={13} className="text-white/35" aria-hidden="true" />
                <span>Der echte Preis kommt nach Prüfung. Du entscheidest erst nach unserem Angebot.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 hidden items-center justify-center gap-3 text-white/24 lg:flex" aria-hidden="true">
          <TrendingUp size={14} />
          <span className="font-sans text-[0.68rem] font-extrabold uppercase tracking-[0.22em]">Scroll für geprüfte Ware</span>
          <Zap size={14} />
        </div>
      </div>
    </section>
  );
}
