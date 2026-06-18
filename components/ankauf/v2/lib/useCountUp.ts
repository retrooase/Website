"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Zählt eine Zahl von `start` auf `target` hoch, sobald das verbundene
 * Element zum ersten Mal in den Viewport scrollt (IntersectionObserver).
 * Sauberes Cleanup von rAF, Timeout und Observer → kein Memory-Leak.
 *
 * Bei `enabled: false` (z. B. prefers-reduced-motion) wird sofort der
 * Zielwert gesetzt, ohne Animation.
 */
interface CountUpOptions {
  /** Dauer der Zähl-Animation in ms. */
  duration?: number;
  /** Startwert. */
  start?: number;
  /** Verzögerung vor dem Start in ms (für gestaffelte Effekte). */
  delay?: number;
  /** false → sofort Zielwert (reduced-motion-Fallback). */
  enabled?: boolean;
  /** Sichtbarkeits-Schwelle, ab der gezählt wird. */
  threshold?: number;
}

interface CountUpResult<T extends HTMLElement> {
  ref: React.RefObject<T>;
  value: number;
  /** true, sobald das Hochzählen begonnen hat (für "???"-Platzhalter). */
  started: boolean;
}

export function useCountUp<T extends HTMLElement = HTMLElement>(
  target: number,
  { duration = 1600, start = 0, delay = 0, enabled = true, threshold = 0.4 }: CountUpOptions = {},
): CountUpResult<T> {
  const ref = useRef<T>(null);
  const [value, setValue] = useState(enabled ? start : target);
  const [started, setStarted] = useState(!enabled);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!enabled) {
      setValue(target);
      setStarted(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let timeout: number | undefined;
    let startTs = 0;

    const tick = (ts: number) => {
      if (!startTs) startTs = ts;
      const p = Math.min(1, (ts - startTs) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setValue(start + (target - start) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true;
          timeout = window.setTimeout(() => {
            setStarted(true);
            raf = requestAnimationFrame(tick);
          }, delay);
        }
      },
      { threshold },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      if (timeout) clearTimeout(timeout);
    };
  }, [target, duration, start, delay, enabled, threshold]);

  return { ref, value, started };
}
