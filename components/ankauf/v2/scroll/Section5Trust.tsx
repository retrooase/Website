"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../lib/hooks";
import { useCountUp } from "../lib/useCountUp";

/**
 * SEKTION 5 - Vertrauen & Beweise
 * Zaehlt harte Proof-Zahlen hoch, zeigt Bewertungs-Cards als Marquee
 * und gibt die wichtigsten Kauf-/Verkaufsversprechen als Badges aus.
 */

interface StatItem {
  value: number;
  label: string;
  suffix?: string;
  decimals?: number;
}

interface ReviewItem {
  name: string;
  product: string;
  text: string;
}

const STATS: StatItem[] = [
  { value: 312, label: "erfolgreiche Ankäufe" },
  { value: 4.9, label: "Bewertung", suffix: "★", decimals: 1 },
  { value: 24, label: "Reaktionszeit", suffix: "h" },
];

const REVIEWS: ReviewItem[] = [
  {
    name: "Marcel K.",
    product: "Nintendo Switch Sammlung",
    text: "Schnelle Antwort, fairer Preis und die Auszahlung war direkt da.",
  },
  {
    name: "Lea M.",
    product: "Game Boy Color + Spiele",
    text: "Ich hatte keine Ahnung, was die Sachen wert sind. RetrOase hat alles sauber erklärt.",
  },
  {
    name: "Dennis R.",
    product: "PlayStation 4 Bundle",
    text: "Fotos geschickt, Angebot bekommen, verkauft. Genau so sollte Ankauf laufen.",
  },
  {
    name: "Sabrina T.",
    product: "Pokémon-Karten",
    text: "Nicht das übliche Feilschen. Transparent, freundlich und sehr unkompliziert.",
  },
];

const BADGES = ["Faire Preise", "Sofort-Auszahlung", "Kostenloser Versand"];

function StatCard({ item, index, reduced }: { item: StatItem; index: number; reduced: boolean }) {
  const { ref, value } = useCountUp<HTMLSpanElement>(item.value, {
    duration: 1500,
    delay: 180 + index * 120,
    enabled: !reduced,
  });
  const displayValue =
    item.decimals === 1 ? value.toFixed(1).replace(".", ",") : Math.round(value).toLocaleString("de-DE");

  return (
    <article className="ak-stat-card">
      <span ref={ref} className="ak-display ak-stat-value">
        {displayValue}
        {item.suffix && <span className="ak-stat-suffix">{item.suffix}</span>}
      </span>
      <span className="ak-stat-label">{item.label}</span>
    </article>
  );
}

function ReviewCard({ review }: { review: ReviewItem }) {
  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty("--ak-tilt-x", `${(-y * 7).toFixed(2)}deg`);
    card.style.setProperty("--ak-tilt-y", `${(x * 9).toFixed(2)}deg`);
  };

  const onPointerLeave = (event: React.PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--ak-tilt-x", "0deg");
    event.currentTarget.style.setProperty("--ak-tilt-y", "0deg");
  };

  return (
    <article className="ak-review-card" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      <div className="ak-review-stars" aria-label="5 von 5 Sternen">
        ★★★★★
      </div>
      <p className="ak-review-text">&quot;{review.text}&quot;</p>
      <div className="ak-review-meta">
        <span>{review.name}</span>
        <small>{review.product}</small>
      </div>
    </article>
  );
}

export function Section5Trust() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Proof-Inhalte nacheinander sichtbar machen.
      gsap.fromTo(
        ".ak-s5-head .ak-reveal",
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.72,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: rootRef.current, start: "top 74%", once: true },
        },
      );

      gsap.fromTo(
        ".ak-stat-card",
        { y: 44, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.75,
          ease: "back.out(1.25)",
          stagger: 0.12,
          scrollTrigger: { trigger: ".ak-stats-grid", start: "top 78%", once: true },
        },
      );

      gsap.fromTo(
        ".ak-review-shell",
        { y: 34, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: ".ak-review-shell", start: "top 82%", once: true },
        },
      );

      gsap.fromTo(
        ".ak-trust-badge",
        { y: 22, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ".ak-trust-badges", start: "top 86%", once: true },
        },
      );

      // Langsame Hintergrundtiefe, Vordergrund bleibt stabil.
      gsap.to(".ak-s5-orbit", {
        yPercent: -18,
        ease: "none",
        scrollTrigger: { trigger: rootRef.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [reduced]);

  const marqueeItems = [...REVIEWS, ...REVIEWS];

  return (
    <section ref={rootRef} className="ak-stage ak-section ak-proof-section" aria-labelledby="ak-s5-title">
      <div className="ak-s5-orbit" aria-hidden="true">
        <span>◆</span>
        <span>◼</span>
        <span>●</span>
      </div>

      <div className="ak-container">
        <div className="ak-s1-head ak-s5-head">
          <p className="ak-eyebrow ak-reveal">Vertrauen & Beweise</p>
          <h2 id="ak-s5-title" className="ak-h2 ak-display ak-reveal">
            Nicht nur laut. <span className="ak-gold-text">Nachweisbar fair.</span>
          </h2>
        </div>

        <div className="ak-stats-grid">
          {STATS.map((item, index) => (
            <StatCard key={item.label} item={item} index={index} reduced={reduced} />
          ))}
        </div>

        <div className="ak-review-shell" aria-label="Bewertungen">
          <div className="ak-review-track">
            {marqueeItems.map((review, index) => (
              <ReviewCard key={`${review.name}-${index}`} review={review} />
            ))}
          </div>
        </div>

        <div className="ak-trust-badges" aria-label="Vertrauensmerkmale">
          {BADGES.map((badge) => (
            <span key={badge} className="ak-trust-badge">
              <i aria-hidden="true" />
              {badge}
            </span>
          ))}
        </div>

        <div className="ak-section-pull" aria-hidden="true" />
      </div>
    </section>
  );
}
