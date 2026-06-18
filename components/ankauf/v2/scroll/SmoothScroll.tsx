"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../lib/hooks";

/**
 * Aktiviert butterweiches Lenis-Smooth-Scrolling für das /ankauf-Segment und
 * synchronisiert es mit GSAP ScrollTrigger (ein gemeinsamer rAF-Loop).
 *
 * • prefers-reduced-motion → natives Scrollen, kein Lenis (ruhiger Fallback).
 *   ScrollTrigger funktioniert dann ganz normal über native Scroll-Events.
 * • Touch bleibt nativ (Lenis smoothTouch aus) → bestes Gefühl auf Mobile.
 * • Sauberes Cleanup beim Verlassen der Route.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Lenis treibt ScrollTrigger an
    lenis.on("scroll", ScrollTrigger.update);
    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, [reduced]);

  return <>{children}</>;
}
