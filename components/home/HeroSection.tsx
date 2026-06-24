"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Gamepad2, ShoppingBag, Sparkles } from "lucide-react";

const FALLING_ITEMS = [
  { src: "/home/hero-gameboy.svg", size: 58, left: "7%", delay: "-7s", duration: "17s", drift: "46px", start: "-10deg", end: "28deg", opacity: "0.42" },
  { src: "/home/hero-controller.svg", size: 72, left: "18%", delay: "-1s", duration: "20s", drift: "-34px", start: "14deg", end: "-32deg", opacity: "0.34" },
  { src: "/home/hero-coin.svg", size: 34, left: "29%", delay: "-10s", duration: "13s", drift: "18px", start: "0deg", end: "270deg", opacity: "0.5" },
  { src: "/home/hero-cartridge.svg", size: 56, left: "43%", delay: "-4s", duration: "19s", drift: "-52px", start: "-18deg", end: "24deg", opacity: "0.32" },
  { src: "/home/hero-coin.svg", size: 28, left: "58%", delay: "-12s", duration: "12s", drift: "26px", start: "0deg", end: "240deg", opacity: "0.46" },
  { src: "/home/hero-gameboy.svg", size: 48, left: "72%", delay: "-6s", duration: "18s", drift: "-40px", start: "9deg", end: "-24deg", opacity: "0.34" },
  { src: "/home/hero-controller.svg", size: 64, left: "87%", delay: "-14s", duration: "21s", drift: "30px", start: "-12deg", end: "36deg", opacity: "0.3" },
] as const;

const SHOP_CARDS = [
  {
    logo: "/ankauf/logos/nintendo.svg",
    title: "Game Boy Color",
    meta: "refurbished",
    price: "79,90 €",
    className: "left-[2%] top-[0%] w-[62%] rotate-[-3deg] sm:w-[60%] lg:left-[0%] lg:top-[2%] lg:w-[58%]",
  },
  {
    logo: "/ankauf/logos/pokemon.svg",
    title: "Pokémon Gold",
    meta: "selten",
    price: "44,90 €",
    className: "right-[1%] top-[34%] w-[58%] rotate-[2deg] sm:top-[35%] sm:w-[56%] lg:right-[0%] lg:top-[35%] lg:w-[54%]",
  },
  {
    logo: "/home/hero-controller.svg",
    title: "Deine Konsole?",
    meta: "verkaufen",
    price: "Wert prüfen",
    className: "left-[10%] top-[68%] w-[66%] rotate-[1deg] sm:left-[12%] sm:w-[64%] lg:left-[12%] lg:top-[68%] lg:w-[58%]",
  },
] as const;

function rainStyle(item: (typeof FALLING_ITEMS)[number]): CSSProperties {
  return {
    left: item.left,
    width: item.size,
    height: item.size,
    animationDuration: item.duration,
    animationDelay: item.delay,
    ["--hero-drift" as string]: item.drift,
    ["--hero-start" as string]: item.start,
    ["--hero-end" as string]: item.end,
    ["--hero-opacity" as string]: item.opacity,
  };
}

function HeroRain() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {FALLING_ITEMS.map((item, index) => (
        <span
          key={`${item.src}-${index}`}
          className="absolute -top-24 block animate-[hero-rain_linear_infinite] will-change-transform"
          style={rainStyle(item)}
        >
          <Image src={item.src} alt="" width={item.size} height={item.size} className="drop-shadow-[0_0_22px_rgba(255,95,46,0.28)]" />
        </span>
      ))}
    </div>
  );
}

function HeroShowcase() {
  return (
    <div className="relative mx-auto h-[240px] w-full max-w-[350px] sm:h-[310px] sm:max-w-[430px] lg:h-[560px] lg:max-w-[600px]" aria-label="Retro-Gaming Shop Auswahl">
      <div
        className="absolute inset-x-[12%] bottom-2 top-[8%] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(255,95,46,0.26), rgba(240,164,41,0.12) 34%, rgba(34,211,163,0.08) 58%, transparent 74%)" }}
        aria-hidden="true"
      />
      <div className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/[0.025] shadow-[inset_0_0_60px_rgba(255,255,255,0.04)]" />

      <div className="absolute left-[2%] top-[-4%] hidden items-center gap-2 rounded-full border border-accent-teal/20 bg-accent-teal/[0.08] px-3 py-2 text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-accent-teal shadow-[0_0_24px_rgba(34,211,163,0.12)] sm:flex">
        <span className="h-2 w-2 rounded-full bg-accent-teal shadow-[0_0_12px_rgba(34,211,163,0.9)]" />
        Shop live
      </div>

      <div className="absolute right-[7%] top-[5%] flex h-16 w-16 items-center justify-center rounded-[1.25rem] border border-accent-gold/20 bg-[#171018]/80 shadow-[0_18px_42px_rgba(0,0,0,0.35),0_0_34px_rgba(240,164,41,0.14)] sm:h-20 sm:w-20 lg:right-[3%] lg:top-[3%] lg:h-24 lg:w-24">
        <Image src="/home/hero-coin.svg" alt="" width={58} height={58} className="h-9 w-9 sm:h-12 sm:w-12 lg:h-14 lg:w-14" aria-hidden="true" />
      </div>

      {SHOP_CARDS.map((card, index) => (
        <article
          key={card.title}
          className={`absolute ${card.className} rounded-[1rem] border border-white/12 bg-[#0b0810]/88 p-2 shadow-[0_22px_60px_rgba(0,0,0,0.48)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 sm:rounded-[1.15rem] sm:p-4 lg:rounded-[1.45rem] lg:p-5`}
          style={{ animation: `hero-float ${6 + index}s ease-in-out ${index * -1.2}s infinite` }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/8 sm:h-12 sm:w-12 sm:rounded-2xl lg:h-16 lg:w-16"
              style={{
                background:
                  index === 0
                    ? "linear-gradient(135deg, rgba(34,211,163,0.18), rgba(255,95,46,0.08))"
                    : index === 1
                      ? "linear-gradient(135deg, rgba(240,164,41,0.20), rgba(255,95,46,0.09))"
                      : "linear-gradient(135deg, rgba(255,95,46,0.18), rgba(34,211,163,0.10))",
              }}
            >
              <Image src={card.logo} alt="" width={42} height={42} className="h-5 w-5 sm:h-7 sm:w-7 lg:h-10 lg:w-10" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-sans text-[0.68rem] font-extrabold leading-tight text-white sm:text-sm lg:text-base">{card.title}</p>
              <p className="mt-0.5 font-mono text-[0.52rem] font-bold uppercase tracking-[0.14em] text-white/38 sm:text-[0.62rem]">{card.meta}</p>
            </div>
          </div>
          <div className="mt-1.5 flex items-end justify-between gap-3 border-t border-white/10 pt-1.5 sm:mt-3 sm:pt-3">
            <span className="font-display text-xs font-extrabold leading-none text-accent-orange sm:text-base lg:text-xl">{card.price}</span>
            <span className="rounded-full bg-white/[0.06] px-2 py-0.5 font-sans text-[0.5rem] font-extrabold uppercase tracking-[0.1em] text-white/48 sm:px-2.5 sm:py-1 sm:text-[0.62rem]">
              {index === 2 ? "Ankauf" : "Shop"}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}

export function HeroSection() {
  return (
    <section
      className="relative isolate overflow-hidden"
      style={{
        minHeight: "calc(100svh - 4rem)",
        background:
          "radial-gradient(ellipse 70% 54% at 22% 18%, rgba(255,95,46,0.18), transparent 62%), radial-gradient(ellipse 54% 42% at 78% 52%, rgba(34,211,163,0.10), transparent 66%), linear-gradient(180deg, #050407 0%, #0d0a12 54%, #050407 100%)",
      }}
      aria-labelledby="hero-heading"
    >
      <HeroRain />

      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 76% 68% at 50% 38%, black 24%, transparent 84%)",
        }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050407] to-transparent" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-4rem)] max-w-8xl items-center gap-6 px-4 pb-24 pt-9 sm:px-6 sm:pb-24 lg:min-h-[calc(100svh-5rem)] lg:grid-cols-[minmax(0,0.92fr)_minmax(430px,0.82fr)] lg:gap-16 lg:px-8 lg:py-14">
        <div className="mx-auto flex w-full max-w-3xl min-w-0 flex-col items-center text-center lg:mx-0 lg:items-start lg:text-left">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent-gold/24 bg-black/30 px-3.5 py-2 shadow-[0_0_34px_rgba(255,95,46,0.12)] backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-error shadow-[0_0_12px_rgba(255,69,102,0.95)]" aria-hidden="true" />
            <span className="font-sans text-[0.64rem] font-extrabold uppercase tracking-[0.18em] text-accent-gold sm:text-[0.68rem]">
              Shop & Ankauf live
            </span>
          </div>

          <h1
            id="hero-heading"
            className="max-w-full font-display text-[2.35rem] font-extrabold leading-[0.95] tracking-normal text-white sm:text-[4.25rem] sm:leading-[0.93] lg:text-[5.05rem] xl:text-[5.65rem]"
          >
            <span className="block">Wo Gaming-</span>
            <span className="block">Träume</span>
            <span
              className="block text-accent-orange"
              style={{ textShadow: "0 0 34px rgba(255,95,46,0.58), 0 0 82px rgba(255,95,46,0.22)" }}
            >
              wahr werden.
            </span>
          </h1>

          <div className="mt-4 w-full lg:hidden">
            <HeroShowcase />
          </div>

          <p className="mt-4 max-w-xl text-pretty font-sans text-[0.95rem] leading-relaxed text-white/68 sm:text-lg lg:mt-7">
            Kaufe geprüfte, teils refurbished Retro-Ware oder verkaufe deine Sammlung fair an RetrOase.
          </p>

          <div className="mt-8 flex w-full max-w-md flex-row gap-3 pr-16 sm:max-w-none sm:justify-center sm:gap-4 sm:pr-0 lg:mt-9 lg:justify-start">
            <Link
              href="/ankauf"
              className="group relative inline-flex min-h-[52px] flex-1 items-center justify-center overflow-hidden rounded-full px-4 py-3.5 font-sans text-sm font-extrabold text-[#271300] transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-accent-gold sm:min-h-[60px] sm:flex-none sm:px-7 sm:py-4 sm:text-base"
              style={{
                background: "linear-gradient(135deg, #FFE9A8 0%, #FFC83D 40%, #FF8B1F 100%)",
                boxShadow:
                  "0 18px 46px rgba(255,139,31,0.42), inset 0 1px 0 rgba(255,255,255,0.72), inset 0 -2px 10px rgba(160,72,0,0.32)",
              }}
            >
              <span
                className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 skew-x-[-18deg] bg-white/45"
                style={{ animation: "shine-pass 3.2s ease-in-out infinite" }}
                aria-hidden="true"
              />
              <span className="relative inline-flex items-center gap-2">
                Ware verkaufen
                <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href="/shop"
              className="inline-flex min-h-[52px] w-[5.25rem] items-center justify-center gap-2 rounded-full border border-white/14 bg-white/[0.045] px-3 py-3.5 font-sans text-sm font-extrabold text-white/78 backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-orange/50 hover:bg-accent-orange/10 hover:text-white sm:min-h-[60px] sm:w-auto sm:px-7 sm:py-4 sm:text-base"
            >
              <span className="sm:hidden">Shop</span>
              <span className="hidden sm:inline">Shop entdecken</span>
              <ShoppingBag size={17} />
            </Link>
          </div>

          <p className="mt-5 hidden items-center justify-center gap-2 font-sans text-xs font-medium text-white/46 sm:flex lg:justify-start">
            <BadgeCheck size={14} className="text-accent-teal" aria-hidden="true" />
            Kostenlos & unverbindlich. Du entscheidest nach dem Angebot.
          </p>

          <div className="mt-7 hidden flex-wrap items-center justify-center gap-3 sm:flex lg:justify-start">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 font-sans text-[0.72rem] font-bold text-white/48">
              <Sparkles size={13} className="text-accent-gold" aria-hidden="true" />
              500+ Bewertungen
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 font-sans text-[0.72rem] font-bold text-white/48">
              <Gamepad2 size={13} className="text-accent-teal" aria-hidden="true" />
              Geprüfte Ware
            </span>
          </div>
        </div>

        <div className="hidden lg:block">
          <HeroShowcase />
        </div>
      </div>
    </section>
  );
}
