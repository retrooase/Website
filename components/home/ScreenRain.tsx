import type { CSSProperties } from "react";
import Image from "next/image";

/**
 * Vollbild-Regen aus Retro-Items (Controller, Coins, Game Boys, Module).
 *
 * Liegt als `fixed` Overlay über der GANZEN Seite (nicht nur im Hero) und
 * bleibt beim Scrollen stehen — dadurch fallen Controller & Coins durchgehend
 * über den kompletten Screen.
 *
 *   • pointer-events-none  → blockiert niemals Klicks/Buttons
 *   • z-0                  → liegt ÜBER dem dunklen Body-Backstop (#050505),
 *                            aber UNTER dem Seiteninhalt: der Inhalt steckt in
 *                            einem `relative z-10`-Wrapper (siehe app/page.tsx).
 *                            Karten/Texte verdecken den Regen; die Sektionen
 *                            sind transparent, damit er durchscheint.
 *   • Items dezent/milchig → nur leichte Atmosphäre, bewusst zurückhaltend
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
  opacity: string;
  glow: "orange" | "gold" | "teal";
};

const GLOW: Record<RainItem["glow"], string> = {
  orange: "drop-shadow-[0_0_22px_rgba(255,95,46,0.32)]",
  gold: "drop-shadow-[0_0_20px_rgba(240,164,41,0.40)]",
  teal: "drop-shadow-[0_0_20px_rgba(34,211,163,0.30)]",
};

// Über die volle Breite verteilt, gemischte Größen/Tempo, sofort befüllt
// (negative Delays), damit der Screen von Anfang an „voll" ist.
// Zwei Ebenen: große, langsame Geräte + kleine, schnelle Coins → dichter Regen.
const RAIN_ITEMS: readonly RainItem[] = [
  // ── Ebene 1: große Geräte (langsam) ──────────────────────────────────
  { src: "/home/hero-controller.svg", size: 66, left: "4%",  delay: "-9s",  duration: "20s", drift: "-38px", start: "12deg",  end: "-30deg", opacity: "0.42", glow: "orange" },
  { src: "/home/hero-gameboy.svg",   size: 50, left: "12%", delay: "-5s",  duration: "17s", drift: "44px",  start: "-10deg", end: "26deg",  opacity: "0.44", glow: "orange" },
  { src: "/home/hero-cartridge.svg", size: 54, left: "20%", delay: "-3s",  duration: "19s", drift: "-50px", start: "-16deg", end: "22deg",  opacity: "0.38", glow: "teal" },
  { src: "/home/hero-controller.svg", size: 58, left: "28%", delay: "-15s", duration: "21s", drift: "32px",  start: "-12deg", end: "34deg",  opacity: "0.4",  glow: "orange" },
  { src: "/home/hero-gameboy.svg",   size: 46, left: "36%", delay: "-11s", duration: "18s", drift: "40px",  start: "9deg",   end: "-22deg", opacity: "0.44", glow: "orange" },
  { src: "/home/hero-cartridge.svg", size: 48, left: "44%", delay: "-8s",  duration: "20s", drift: "-44px", start: "-18deg", end: "24deg",  opacity: "0.38", glow: "teal" },
  { src: "/home/hero-controller.svg", size: 70, left: "52%", delay: "-4s",  duration: "22s", drift: "36px",  start: "14deg",  end: "-32deg", opacity: "0.4",  glow: "orange" },
  { src: "/home/hero-gameboy.svg",   size: 52, left: "60%", delay: "-6s",  duration: "18s", drift: "-42px", start: "-9deg",  end: "24deg",  opacity: "0.44", glow: "orange" },
  { src: "/home/hero-cartridge.svg", size: 44, left: "68%", delay: "-13s", duration: "19s", drift: "30px",  start: "16deg",  end: "-20deg", opacity: "0.38", glow: "teal" },
  { src: "/home/hero-controller.svg", size: 60, left: "76%", delay: "-10s", duration: "21s", drift: "-34px", start: "-14deg", end: "30deg",  opacity: "0.4",  glow: "orange" },
  { src: "/home/hero-gameboy.svg",   size: 48, left: "84%", delay: "-2s",  duration: "17s", drift: "38px",  start: "10deg",  end: "-28deg", opacity: "0.44", glow: "orange" },
  { src: "/home/hero-cartridge.svg", size: 52, left: "92%", delay: "-7s",  duration: "20s", drift: "-36px", start: "-15deg", end: "26deg",  opacity: "0.38", glow: "teal" },
  // ── Ebene 2: kleine Coins (schnell, viele) ───────────────────────────
  { src: "/home/hero-coin.svg",      size: 30, left: "2%",  delay: "-2s",  duration: "12s", drift: "20px",  start: "0deg",   end: "260deg", opacity: "0.6",  glow: "gold" },
  { src: "/home/hero-coin.svg",      size: 22, left: "8%",  delay: "-11s", duration: "10s", drift: "-12px", start: "0deg",   end: "320deg", opacity: "0.56", glow: "gold" },
  { src: "/home/hero-coin.svg",      size: 28, left: "16%", delay: "-6s",  duration: "13s", drift: "16px",  start: "0deg",   end: "300deg", opacity: "0.6",  glow: "gold" },
  { src: "/home/hero-coin.svg",      size: 24, left: "24%", delay: "-13s", duration: "11s", drift: "-16px", start: "0deg",   end: "240deg", opacity: "0.56", glow: "gold" },
  { src: "/home/hero-coin.svg",      size: 34, left: "32%", delay: "-1s",  duration: "12s", drift: "26px",  start: "0deg",   end: "280deg", opacity: "0.6",  glow: "gold" },
  { src: "/home/hero-coin.svg",      size: 20, left: "40%", delay: "-9s",  duration: "10s", drift: "-10px", start: "0deg",   end: "340deg", opacity: "0.54", glow: "gold" },
  { src: "/home/hero-coin.svg",      size: 28, left: "48%", delay: "-7s",  duration: "13s", drift: "-22px", start: "0deg",   end: "240deg", opacity: "0.58", glow: "gold" },
  { src: "/home/hero-coin.svg",      size: 26, left: "56%", delay: "-14s", duration: "11s", drift: "18px",  start: "0deg",   end: "300deg", opacity: "0.56", glow: "gold" },
  { src: "/home/hero-coin.svg",      size: 32, left: "64%", delay: "-3s",  duration: "12s", drift: "24px",  start: "0deg",   end: "270deg", opacity: "0.6",  glow: "gold" },
  { src: "/home/hero-coin.svg",      size: 22, left: "72%", delay: "-12s", duration: "10s", drift: "-14px", start: "0deg",   end: "320deg", opacity: "0.54", glow: "gold" },
  { src: "/home/hero-coin.svg",      size: 30, left: "80%", delay: "-5s",  duration: "13s", drift: "22px",  start: "0deg",   end: "300deg", opacity: "0.6",  glow: "gold" },
  { src: "/home/hero-coin.svg",      size: 24, left: "88%", delay: "-10s", duration: "11s", drift: "-18px", start: "0deg",   end: "260deg", opacity: "0.56", glow: "gold" },
  { src: "/home/hero-coin.svg",      size: 28, left: "96%", delay: "-4s",  duration: "12s", drift: "14px",  start: "0deg",   end: "280deg", opacity: "0.58", glow: "gold" },
  // ── Füll-Items (versetzt) für noch mehr Dichte ───────────────────────
  { src: "/home/hero-coin.svg",      size: 18, left: "6%",  delay: "-15s", duration: "9s",  drift: "10px",  start: "0deg",   end: "360deg", opacity: "0.5",  glow: "gold" },
  { src: "/home/hero-gameboy.svg",   size: 38, left: "30%", delay: "-17s", duration: "16s", drift: "-28px", start: "8deg",   end: "-26deg", opacity: "0.4",  glow: "orange" },
  { src: "/home/hero-coin.svg",      size: 20, left: "44%", delay: "-16s", duration: "9s",  drift: "-12px", start: "0deg",   end: "340deg", opacity: "0.5",  glow: "gold" },
  { src: "/home/hero-controller.svg", size: 50, left: "58%", delay: "-18s", duration: "20s", drift: "-30px", start: "-11deg", end: "28deg",  opacity: "0.38", glow: "orange" },
  { src: "/home/hero-coin.svg",      size: 18, left: "70%", delay: "-8s",  duration: "9s",  drift: "12px",  start: "0deg",   end: "360deg", opacity: "0.5",  glow: "gold" },
  { src: "/home/hero-cartridge.svg", size: 40, left: "82%", delay: "-16s", duration: "18s", drift: "26px",  start: "14deg",  end: "-22deg", opacity: "0.36", glow: "teal" },
  { src: "/home/hero-coin.svg",      size: 22, left: "94%", delay: "-12s", duration: "10s", drift: "-10px", start: "0deg",   end: "320deg", opacity: "0.52", glow: "gold" },
  { src: "/home/hero-gameboy.svg",   size: 42, left: "50%", delay: "-19s", duration: "16s", drift: "-26px", start: "7deg",   end: "-24deg", opacity: "0.4",  glow: "orange" },
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
    // Dezent & milchig: nur leichte Atmosphäre im Hintergrund, nicht
    // aufdringlich. (item.opacity bleibt als Feld, wird hier übersteuert.)
    ["--hero-opacity" as string]: "0.15",
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
