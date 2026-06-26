import type { CSSProperties } from "react";
import Image from "next/image";

/**
 * Vollbild-Regen aus Retro-Items (Controller, Coins, Game Boys, Module).
 *
 * Liegt als `fixed` Overlay über der GANZEN Website (gemountet im Root-Layout
 * via ScreenRainGate, der den Admin-Bereich ausnimmt) und bleibt beim Scrollen
 * stehen — dezente Retro-Atmosphäre auf jeder Seite.
 *
 *   • pointer-events-none  → blockiert niemals Klicks/Buttons
 *   • z-0                  → liegt ÜBER dem dunklen Body-Backstop (#050505),
 *                            aber UNTER dem Seiteninhalt (`main` ist
 *                            `relative z-10`). Karten/Texte verdecken den Regen.
 *   • Items dezent/milchig → nur leichte Atmosphäre, bewusst zurückhaltend
 *   • bewusst wenige Items → unaufdringlich, performant auf jeder Seite
 *   • aria-hidden          → reine Deko, kein Screenreader-Rauschen
 *   • Wiederverwendet die `hero-rain` Keyframe aus globals.css
 *   • Bei `prefers-reduced-motion` per `.screen-rain`-Regel komplett aus
 */

type RainItem = {
  src: string;
  size: number;
  left: string;
  delay: string;
  duration: string;
  drift: string;
  start: string;
  end: string;
  glow: "orange" | "gold" | "teal";
};

const GLOW: Record<RainItem["glow"], string> = {
  orange: "drop-shadow-[0_0_22px_rgba(255,95,46,0.32)]",
  gold: "drop-shadow-[0_0_20px_rgba(240,164,41,0.40)]",
  teal: "drop-shadow-[0_0_20px_rgba(34,211,163,0.30)]",
};

// Milchig & dezent: gemeinsame, niedrige Deckkraft für alle Items.
const RAIN_OPACITY = "0.1";

// Bewusst wenige Items, locker über die Breite verteilt, sofort befüllt
// (negative Delays). Gemischte Größen/Tempo für Tiefe ohne Aufdringlichkeit.
const RAIN_ITEMS: readonly RainItem[] = [
  { src: "/home/hero-controller.svg", size: 60, left: "5%",  delay: "-9s",  duration: "21s", drift: "-34px", start: "12deg",  end: "-30deg", glow: "orange" },
  { src: "/home/hero-coin.svg",       size: 26, left: "13%", delay: "-3s",  duration: "12s", drift: "18px",  start: "0deg",   end: "280deg", glow: "gold" },
  { src: "/home/hero-gameboy.svg",    size: 46, left: "21%", delay: "-13s", duration: "18s", drift: "40px",  start: "-10deg", end: "26deg",  glow: "orange" },
  { src: "/home/hero-cartridge.svg",  size: 48, left: "30%", delay: "-6s",  duration: "20s", drift: "-46px", start: "-16deg", end: "22deg",  glow: "teal" },
  { src: "/home/hero-coin.svg",       size: 22, left: "37%", delay: "-15s", duration: "11s", drift: "14px",  start: "0deg",   end: "320deg", glow: "gold" },
  { src: "/home/hero-controller.svg", size: 64, left: "45%", delay: "-2s",  duration: "22s", drift: "32px",  start: "14deg",  end: "-32deg", glow: "orange" },
  { src: "/home/hero-gameboy.svg",    size: 42, left: "53%", delay: "-10s", duration: "17s", drift: "-30px", start: "8deg",   end: "-24deg", glow: "orange" },
  { src: "/home/hero-coin.svg",       size: 28, left: "61%", delay: "-5s",  duration: "13s", drift: "22px",  start: "0deg",   end: "260deg", glow: "gold" },
  { src: "/home/hero-cartridge.svg",  size: 50, left: "69%", delay: "-12s", duration: "20s", drift: "-44px", start: "-18deg", end: "24deg",  glow: "teal" },
  { src: "/home/hero-controller.svg", size: 56, left: "77%", delay: "-7s",  duration: "21s", drift: "34px",  start: "-14deg", end: "30deg",  glow: "orange" },
  { src: "/home/hero-coin.svg",       size: 24, left: "85%", delay: "-1s",  duration: "12s", drift: "-16px", start: "0deg",   end: "300deg", glow: "gold" },
  { src: "/home/hero-gameboy.svg",    size: 44, left: "93%", delay: "-14s", duration: "18s", drift: "-38px", start: "-9deg",  end: "24deg",  glow: "orange" },
  { src: "/home/hero-coin.svg",       size: 20, left: "9%",  delay: "-8s",  duration: "10s", drift: "12px",  start: "0deg",   end: "340deg", glow: "gold" },
  { src: "/home/hero-cartridge.svg",  size: 44, left: "49%", delay: "-17s", duration: "19s", drift: "28px",  start: "16deg",  end: "-20deg", glow: "teal" },
  { src: "/home/hero-controller.svg", size: 52, left: "65%", delay: "-16s", duration: "20s", drift: "-28px", start: "-11deg", end: "28deg",  glow: "orange" },
  { src: "/home/hero-coin.svg",       size: 24, left: "33%", delay: "-11s", duration: "12s", drift: "-14px", start: "0deg",   end: "260deg", glow: "gold" },
];

function rainStyle(item: RainItem): CSSProperties {
  return {
    left: item.left,
    width: item.size,
    height: item.size,
    animationDuration: item.duration,
    animationDelay: item.delay,
    ["--hero-drift" as string]: item.drift,
    ["--hero-start" as string]: item.start,
    ["--hero-end" as string]: item.end,
    ["--hero-opacity" as string]: RAIN_OPACITY,
  };
}

export function ScreenRain() {
  return (
    <div
      className="screen-rain pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {RAIN_ITEMS.map((item, index) => (
        <span
          key={`${item.src}-${index}`}
          className="absolute -top-24 block animate-[hero-rain_linear_infinite] will-change-transform"
          style={rainStyle(item)}
        >
          <Image
            src={item.src}
            alt=""
            width={item.size}
            height={item.size}
            // Eager laden: die Items sitzen fixed/außerhalb des Viewports und
            // bewegen sich nur per transform — Lazy-IntersectionObserver würde
            // nie feuern, die SVGs blieben unsichtbar.
            loading="eager"
            className={GLOW[item.glow]}
          />
        </span>
      ))}
    </div>
  );
}
