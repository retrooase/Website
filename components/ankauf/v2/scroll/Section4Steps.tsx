"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../lib/hooks";
import { ConfettiBurst } from "./ConfettiBurst";

/**
 * SEKTION 4 — "So einfach geht's" (3 Schritte)
 * Schritte gleiten abwechselnd von links/rechts rein, die Verbindungslinien
 * "zeichnen" sich (scaleY), bei Schritt 3 explodiert Konfetti. Abschluss-Text
 * + CTA, der zum Formular (#angebot) scrollt.
 */

interface Step {
  num: string;
  title: string;
  desc: string;
  side: "left" | "right";
}

const STEPS: Step[] = [
  { num: "1", title: "Anbieten", desc: "Formular ausfüllen, ein paar Fotos hochladen — fertig.", side: "left" },
  { num: "2", title: "Bewertung erhalten", desc: "Faire Einschätzung vom Retro-Team in unter 24 Stunden.", side: "right" },
  { num: "3", title: "Geld kassieren 💰", desc: "Annehmen & sofort per PayPal ausgezahlt bekommen.", side: "left" },
];

export function Section4Steps() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);

  const scrollToForm = () => {
    document
      .getElementById("angebot")
      ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  useEffect(() => {
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Überschrift
      gsap.fromTo(
        ".ak-s1-head .ak-reveal",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: rootRef.current, start: "top 78%", once: true },
        },
      );

      // Schritte gleiten abwechselnd rein
      gsap.utils.toArray<HTMLElement>(".ak-step").forEach((step) => {
        const dir = step.dataset.side === "right" ? 90 : -90;
        gsap.fromTo(
          step,
          { x: dir, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: step, start: "top 82%", once: true },
          },
        );
      });

      // Verbindungslinien zeichnen sich
      gsap.utils.toArray<HTMLElement>(".ak-step-line").forEach((line) => {
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: { trigger: line, start: "top 86%", once: true },
          },
        );
      });

      // Abschluss-Block
      gsap.fromTo(
        ".ak-steps-outro",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: ".ak-steps-outro", start: "top 88%", once: true },
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={rootRef} className="ak-stage ak-section ak-steps-section" aria-labelledby="ak-s4-title">
      <div className="ak-container">
        <div className="ak-s1-head">
          <p className="ak-eyebrow ak-reveal">In 3 Schritten</p>
          <h2 id="ak-s4-title" className="ak-h2 ak-display ak-reveal">
            So einfach <span className="ak-gold-text">geht&apos;s.</span>
          </h2>
        </div>

        <ol className="ak-steps">
          {STEPS.map((step, i) => (
            <li key={step.num} className="ak-step-wrap">
              <div className={`ak-step ak-step-${step.side}`} data-side={step.side}>
                {step.num === "3" && <ConfettiBurst enabled={!reduced} />}
                <span className="ak-step-num ak-display">{step.num}</span>
                <div className="ak-step-body">
                  <h3 className="ak-step-title">{step.title}</h3>
                  <p className="ak-step-desc">{step.desc}</p>
                </div>
              </div>
              {i < STEPS.length - 1 && <span className="ak-step-line" aria-hidden="true" />}
            </li>
          ))}
        </ol>

        <div className="ak-steps-outro">
          <p className="ak-steps-outro-text">So einfach ist das.</p>
          <button type="button" className="ak-cta" onClick={scrollToForm}>
            <span>Jetzt anbieten</span>
            <span aria-hidden="true">🪙</span>
          </button>
        </div>
      </div>
    </section>
  );
}
