"use client";

import { Component, useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { Check } from "lucide-react";
import { HeroParticles } from "./HeroParticles";
import { HeroHeadline, HeroTypewriter } from "./HeroHeadline";
import { HeroCTA } from "./HeroCTA";
import { useReducedMotion, useIsDesktop, useMounted } from "../lib/hooks";

const TRUST = ["Kostenlos & unverbindlich", "Antwort in unter 24 h", "Faire Bewertung vom Retro-Team"];

/** Statische CSS-Konsole — Fallback für Mobile, reduced-motion & WebGL-Fehler. */
function FallbackConsole() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="ak-console-fallback" aria-hidden="true" />
    </div>
  );
}

// Three.js-Szene nur client-seitig & lazy laden — hält den Initial-Bundle klein.
const HeroScene3D = dynamic(() => import("./HeroScene3D"), {
  ssr: false,
  loading: () => <FallbackConsole />,
});

/** Fängt WebGL-/Render-Fehler der 3D-Szene ab und zeigt die CSS-Konsole. */
class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

export function AnkaufHeroV2() {
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  const [scrolled, setScrolled] = useState(false);

  const show3D = mounted && isDesktop && !reduced;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="ak-stage relative min-h-[100svh] w-full overflow-hidden">
      {/* Hintergrund-Ebenen */}
      <div className="ak-vignette pointer-events-none absolute inset-0" aria-hidden="true" />
      {mounted && !reduced && <HeroParticles />}
      <div className="ak-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />

      {/* Inhalt */}
      <div className="ak-container relative z-10 flex min-h-[100svh] flex-col justify-center py-24">
        <div className="grid items-center gap-10 md:grid-cols-2">
          {/* Text */}
          <div className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">
            <span className="ak-chip">
              <i className="ak-live-dot" />
              Ankauf · Sofort · Fair
            </span>

            <HeroHeadline reduced={reduced} />
            <HeroTypewriter reduced={reduced} />

            <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
              <HeroCTA reduced={reduced} />
              <a href="#preisschaetzer" className="ak-link-ghost">
                Erst Wert prüfen
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:justify-start">
              {TRUST.map((t) => (
                <span key={t} className="ak-pill">
                  <Check size={14} strokeWidth={3} />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Konsolen-Bühne */}
          <div className="relative order-first md:order-last">
            <div className="ak-spotlight pointer-events-none absolute inset-0" aria-hidden="true" />
            <div className="relative mx-auto flex h-[clamp(280px,44vh,520px)] w-full items-center justify-center">
              {show3D ? (
                <SceneBoundary fallback={<FallbackConsole />}>
                  <HeroScene3D />
                </SceneBoundary>
              ) : (
                <FallbackConsole />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll-Indikator — verschwindet beim ersten Scroll */}
      <div
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 transition-opacity duration-500"
        style={{ opacity: scrolled ? 0 : 1 }}
        aria-hidden="true"
      >
        <div className="ak-scroll">
          <span>Entdecke deinen Wert</span>
          <span className="ak-scroll-mouse" />
        </div>
      </div>
    </section>
  );
}
