"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../lib/hooks";
import { useCountUp } from "../lib/useCountUp";

/**
 * SEKTION 2 — Psychologie-Trigger
 * Ein großer Satz rollt rein, eine dramatische Zahl zählt auf 4.200.000 hoch,
 * danach kommt die Pointe "Darunter vielleicht deine?". Abgedunkelter
 * Fokus-Effekt für Dramatik.
 */

const TARGET = 4_200_000;

export function Section2Psychology() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const { ref: numRef, value } = useCountUp<HTMLSpanElement>(TARGET, {
    duration: 2400,
    delay: 250,
    enabled: !reduced,
  });

  useEffect(() => {
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const trigger = rootRef.current;
      gsap.fromTo(
        ".ak-s2-line",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger, start: "top 68%", once: true },
        },
      );
      gsap.fromTo(
        ".ak-s2-number",
        { scale: 0.88, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.0,
          ease: "power2.out",
          delay: 0.2,
          scrollTrigger: { trigger, start: "top 62%", once: true },
        },
      );
      gsap.fromTo(
        ".ak-s2-tail",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          delay: 1.0,
          scrollTrigger: { trigger, start: "top 56%", once: true },
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={rootRef} className="ak-stage ak-section ak-s2" aria-labelledby="ak-s2-title">
      <div className="ak-s2-dim" aria-hidden="true" />
      <div className="ak-container ak-s2-inner">
        <p id="ak-s2-title" className="ak-s2-line ak-h2 ak-display ak-s2-statement">
          In deutschen Kellern liegen <span className="ak-gold-text">Millionen</span> ungenutzter Konsolen.
        </p>
        <div className="ak-s2-number">
          <span ref={numRef} className="ak-display ak-s2-big ak-neon-gold">
            {Math.round(value).toLocaleString("de-DE")}
          </span>
        </div>
        <p className="ak-s2-tail ak-s2-question">
          Darunter vielleicht <span className="ak-gold-text">deine?</span>
        </p>
      </div>
    </section>
  );
}
