"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Eye, Flame } from "lucide-react";
import { useCountUp } from "@/lib/hooks/useCountUp";

/**
 * FOMO-Sektion der Startseite — "Konsolen im Keller".
 * Eine dramatische Zahl zählt auf 4.200.000 hoch, darunter live wirkende
 * Dringlichkeits-Signale (Besucher, Countdown, Tages-Ankäufe). Emotionaler
 * Hook für den Ankauf, im OBSIDIAN-Designsystem (Dark-only).
 *
 * Zahlen sind bewusste Marketing-/Schätzwerte; Besucher & Countdown sind
 * simuliert und laufen nur, solange die Sektion sichtbar ist (Performance).
 */

const BASEMENT_TARGET = 4_200_000;
const INITIAL_TIMER_SECONDS = 2 * 60 * 60 + 47 * 60 + 33;
const BASE_VIEWERS = 47;
const PURCHASES_TODAY = 12;

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

function formatTime(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  return [hours, minutes, seconds].map((p) => String(p).padStart(2, "0")).join(":");
}

export function BasementFomo() {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const deadlineRef = useRef<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [viewers, setViewers] = useState(BASE_VIEWERS);
  const [remaining, setRemaining] = useState(INITIAL_TIMER_SECONDS);
  const isUrgent = remaining < 3600;

  const { ref: numRef, value } = useCountUp<HTMLSpanElement>(BASEMENT_TARGET, {
    duration: 2600,
    delay: 200,
    enabled: !reduced,
  });

  // Timer/Besucher nur laufen lassen, wenn die Sektion im Viewport ist.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "120px", threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Countdown zur "nächsten Preisanpassung".
  useEffect(() => {
    if (!isVisible) return;
    if (!deadlineRef.current) deadlineRef.current = Date.now() + INITIAL_TIMER_SECONDS * 1000;

    const update = () => {
      const deadline = deadlineRef.current ?? Date.now();
      const next = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(next);
      if (next === 0) deadlineRef.current = Date.now() + INITIAL_TIMER_SECONDS * 1000;
    };

    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [isVisible]);

  // Lebendige Besucherzahl (leichtes Driften um den Basiswert).
  useEffect(() => {
    if (!isVisible) return;
    const update = () => {
      const drift = Math.floor(Math.random() * 8) - 3;
      setViewers(Math.max(43, Math.min(52, BASE_VIEWERS + drift)));
    };
    update();
    const interval = window.setInterval(update, reduced ? 5200 : 2600);
    return () => window.clearInterval(interval);
  }, [isVisible, reduced]);

  return (
    <section
      ref={rootRef}
      aria-labelledby="basement-heading"
      className="relative overflow-hidden"
      style={{ background: "var(--bg-anchor)" }}
    >
      {/* Hintergrund-Atmosphäre */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(240,164,41,0.12) 0%, transparent 65%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -right-24 w-[500px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,95,46,0.10) 0%, transparent 60%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2.5 mb-6">
          <span
            className="w-1.5 h-1.5 rounded-full bg-accent-gold flex-shrink-0"
            style={{ animation: "glow-pulse 2s ease-in-out infinite" }}
            aria-hidden="true"
          />
          <span className="font-sans text-[11px] font-semibold tracking-[0.22em] uppercase text-accent-gold">
            Wusstest du?
          </span>
        </div>

        {/* Statement */}
        <h2
          id="basement-heading"
          className="font-display font-extrabold leading-[1.05] tracking-[-0.03em] text-balance mb-8"
          style={{ color: "#EEE9FB", fontSize: "clamp(1.6rem, 4.5vw, 3rem)" }}
        >
          In deutschen Kellern liegen ungenutzte Konsolen.
        </h2>

        {/* Die große Zahl */}
        <span
          ref={numRef}
          className="block font-display font-extrabold leading-none mb-4 tabular-nums"
          style={{
            color: "var(--accent-gold)",
            fontSize: "clamp(3.2rem, 13vw, 9rem)",
            textShadow: "0 0 40px rgba(240,164,41,0.45), 0 0 90px rgba(240,164,41,0.2)",
          }}
        >
          {Math.round(value).toLocaleString("de-DE")}
        </span>

        <p className="font-sans text-sm sm:text-base text-white/45 max-w-md mx-auto mb-2">
          Geräte, die ungenutzt in Schubladen, Kartons und auf Dachböden verstauben.
        </p>
        <p
          className="font-display font-bold mb-12"
          style={{ color: "#EEE9FB", fontSize: "clamp(1.25rem, 3vw, 1.9rem)" }}
        >
          Darunter vielleicht <span className="text-accent-orange">deine?</span>
        </p>

        {/* Live-FOMO Signale */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto mb-12">
          {/* Live-Besucher */}
          <article className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm px-4 py-4">
            <span className="relative flex items-center justify-center flex-shrink-0" aria-hidden="true">
              <span className="absolute w-2.5 h-2.5 rounded-full bg-accent-teal" style={{ animation: "pulse-ring 1.6s ease-out infinite" }} />
              <span className="w-2 h-2 rounded-full bg-accent-teal" />
            </span>
            <p className="font-sans text-xs sm:text-[13px] text-white/70 text-left leading-tight">
              <span className="font-bold text-accent-teal tabular-nums">{viewers}</span> schauen gerade hier
            </p>
          </article>

          {/* Countdown */}
          <article
            className="flex flex-col items-center gap-1 rounded-2xl border px-4 py-4 transition-colors"
            style={{
              borderColor: isUrgent ? "rgba(255,95,46,0.35)" : "rgba(255,255,255,0.1)",
              background: isUrgent ? "rgba(255,95,46,0.06)" : "rgba(255,255,255,0.03)",
            }}
          >
            <span className="flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-widest text-white/40">
              <Clock size={11} className={isUrgent ? "text-accent-orange" : "text-white/40"} />
              Nächste Preisanpassung
            </span>
            <strong
              className="font-mono font-bold tabular-nums text-lg sm:text-xl"
              style={{ color: isUrgent ? "var(--accent-orange)" : "#EEE9FB" }}
            >
              {formatTime(remaining)}
            </strong>
          </article>

          {/* Heute */}
          <article className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm px-4 py-4">
            <Flame size={18} className="text-accent-orange flex-shrink-0" aria-hidden="true" />
            <p className="font-sans text-xs sm:text-[13px] text-white/70 text-left leading-tight">
              Heute schon <span className="font-bold text-white tabular-nums">{PURCHASES_TODAY}</span> Ankäufe
            </p>
          </article>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3">
          <Link
            href="/ankauf"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-accent-orange text-white font-sans font-semibold text-sm sm:text-base hover:bg-accent-orange/90 hover:-translate-y-0.5 shadow-[0_4px_24px_rgba(255,95,46,0.4)] hover:shadow-[0_8px_36px_rgba(255,95,46,0.55)] transition-all duration-200"
          >
            Was ist deins wert?
            <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
          <p className="flex items-center gap-1.5 font-sans text-xs text-white/40">
            <Eye size={12} aria-hidden="true" />
            Kostenlos &amp; unverbindlich — du entscheidest erst nach unserem Angebot.
          </p>
        </div>
      </div>
    </section>
  );
}
