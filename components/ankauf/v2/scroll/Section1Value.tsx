"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../lib/hooks";
import { useCountUp } from "../lib/useCountUp";

/**
 * SEKTION 1 — "Was ist dein Zeug wert?"
 * Überschrift erscheint zuerst, dann fliegen 6 Produktkarten aus verschiedenen
 * Richtungen gestaffelt rein. Anschließend zählen die Preise von 0 hoch und alle
 * Karten leuchten einmal golden auf (Finale).
 */

interface ValueItem {
  icon: string;
  name: string;
  max: number; // Richtwert (abgeleitet aus PRICE_ESTIMATES)
  fx: number; // Start-Offset X (px) für den Flug-Effekt
  fy: number; // Start-Offset Y (px)
}

const ITEMS: ValueItem[] = [
  { icon: "🎮", name: "PlayStation 4", max: 250, fx: -150, fy: 10 },
  { icon: "🕹️", name: "Nintendo Switch", max: 220, fx: 140, fy: -80 },
  { icon: "👾", name: "Game Boy", max: 100, fx: -40, fy: 150 },
  { icon: "⚡", name: "Pokémon-Karten", max: 200, fx: 150, fy: 90 },
  { icon: "🎯", name: "PlayStation 5", max: 420, fx: -150, fy: -70 },
  { icon: "📟", name: "Nintendo DS", max: 90, fx: 60, fy: 150 },
];

/** Einzelne Wertkarte mit eigenem Count-up (Hook pro Instanz). */
function ValueCard({ item, index, reduced }: { item: ValueItem; index: number; reduced: boolean }) {
  const { ref, value, started } = useCountUp<HTMLSpanElement>(item.max, {
    duration: 1400,
    delay: 700 + index * 110,
    enabled: !reduced,
  });

  return (
    <article className="ak-vcard" data-fx={item.fx} data-fy={item.fy}>
      <span className="ak-vcard-icon" aria-hidden="true">
        {item.icon}
      </span>
      <h3 className="ak-vcard-name">{item.name}</h3>
      <span className="ak-vcard-label">Wert</span>
      <span ref={ref} className="ak-mono ak-vcard-amount">
        {started ? `bis ${Math.round(value)} €` : "???"}
      </span>
    </article>
  );
}

export function Section1Value() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Überschrift zuerst
      gsap.fromTo(
        ".ak-s1-head .ak-reveal",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: rootRef.current, start: "top 72%", once: true },
        },
      );

      // Karten fliegen aus ihren Richtungen rein
      const cards = gsap.utils.toArray<HTMLElement>(".ak-vcard");
      cards.forEach((card, i) => {
        const fx = Number(card.dataset.fx ?? 0);
        const fy = Number(card.dataset.fy ?? 0);
        gsap.fromTo(
          card,
          { x: fx, y: fy, opacity: 0, rotate: gsap.utils.random(-7, 7) },
          {
            x: 0,
            y: 0,
            opacity: 1,
            rotate: 0,
            duration: 0.85,
            ease: "back.out(1.4)",
            delay: i * 0.12,
            scrollTrigger: { trigger: rootRef.current, start: "top 62%", once: true },
            onComplete:
              i === cards.length - 1
                ? () => gridRef.current?.classList.add("ak-cards-landed")
                : undefined,
          },
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={rootRef} className="ak-stage ak-section" aria-labelledby="ak-s1-title">
      <div className="ak-container">
        <div className="ak-s1-head">
          <p className="ak-eyebrow ak-s1-eyebrow ak-reveal">Was ist dein Zeug wert?</p>
          <h2 id="ak-s1-title" className="ak-h2 ak-display ak-reveal">
            Was schlummert bei dir <span className="ak-gold-text">zuhause?</span>
          </h2>
        </div>

        <div ref={gridRef} className="ak-vgrid">
          {ITEMS.map((item, i) => (
            <ValueCard key={item.name} item={item} index={i} reduced={reduced} />
          ))}
        </div>
      </div>
    </section>
  );
}
