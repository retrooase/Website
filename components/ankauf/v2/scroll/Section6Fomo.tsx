"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../lib/hooks";

/**
 * SEKTION 6 - FOMO & Dringlichkeit
 * Lebendige Besucherzahl, echter Countdown und ein finaler CTA zum Formular.
 * Timer und Zufallszahl laufen nur, wenn die Sektion sichtbar ist.
 */

const INITIAL_TIMER_SECONDS = 2 * 60 * 60 + 47 * 60 + 33;
const BASE_VIEWERS = 47;

function formatTime(totalSeconds: number) {
  const safeSeconds = Math.max(0, totalSeconds);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;
  return [hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":");
}

export function Section6Fomo() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const deadlineRef = useRef<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [viewers, setViewers] = useState(BASE_VIEWERS);
  const [remaining, setRemaining] = useState(INITIAL_TIMER_SECONDS);
  const isUrgent = remaining < 3600;

  const scrollToForm = () => {
    document
      .getElementById("angebot")
      ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "120px", threshold: 0.18 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    if (!deadlineRef.current) deadlineRef.current = Date.now() + INITIAL_TIMER_SECONDS * 1000;

    const update = () => {
      const deadline = deadlineRef.current ?? Date.now();
      const nextRemaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(nextRemaining);
      if (nextRemaining === 0) deadlineRef.current = Date.now() + INITIAL_TIMER_SECONDS * 1000;
    };

    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [isVisible]);

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

  useEffect(() => {
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // FOMO-Elemente bewusst kompakt inszenieren: erst Signal, dann Zeit, dann CTA.
      gsap.fromTo(
        ".ak-fomo-head .ak-reveal",
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
        ".ak-fomo-metric",
        { y: 42, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.72,
          ease: "back.out(1.2)",
          stagger: 0.11,
          scrollTrigger: { trigger: ".ak-fomo-grid", start: "top 80%", once: true },
        },
      );

      gsap.fromTo(
        ".ak-fomo-cta-wrap",
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.68,
          ease: "power3.out",
          scrollTrigger: { trigger: ".ak-fomo-cta-wrap", start: "top 88%", once: true },
        },
      );

      gsap.to(".ak-s6-orbit", {
        yPercent: -22,
        ease: "none",
        scrollTrigger: { trigger: rootRef.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={rootRef} className="ak-stage ak-section ak-fomo-section" aria-labelledby="ak-s6-title">
      <div className="ak-s6-orbit" aria-hidden="true">
        <span>▲</span>
        <span>◆</span>
        <span>◼</span>
      </div>

      <div className="ak-container">
        <div className="ak-s1-head ak-fomo-head">
          <p className="ak-eyebrow ak-reveal">Aktueller Ankauf-Moment</p>
          <h2 id="ak-s6-title" className="ak-h2 ak-display ak-reveal">
            Preise bewegen sich. <span className="ak-gold-text">Dein Angebot auch.</span>
          </h2>
        </div>

        <div className="ak-fomo-grid">
          <article className="ak-fomo-metric ak-fomo-live">
            <span className="ak-live-pulse" aria-hidden="true" />
            <p>{viewers} Personen schauen gerade auf diese Seite</p>
          </article>

          <article className={`ak-fomo-metric ak-fomo-timer ${isUrgent ? "ak-fomo-urgent" : ""}`}>
            <span className="ak-fomo-label">Nächste Preisanpassung in</span>
            <strong className="ak-display">{formatTime(remaining)}</strong>
          </article>

          <article className="ak-fomo-metric ak-fomo-today">
            <span aria-hidden="true">🔥</span>
            <p>Heute bereits <strong>12 Ankäufe</strong> abgeschlossen</p>
          </article>
        </div>

        <div className="ak-fomo-cta-wrap">
          <button type="button" className="ak-cta ak-fomo-cta" onClick={scrollToForm}>
            <span>Sichere dir den aktuellen Preis</span>
          </button>
          <p>Unverbindlich anfragen. Du entscheidest erst nach unserem Angebot.</p>
        </div>

        <div className="ak-section-pull ak-section-pull-hot" aria-hidden="true" />
      </div>
    </section>
  );
}
