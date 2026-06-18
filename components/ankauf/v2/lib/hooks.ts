"use client";

import { useEffect, useState } from "react";

/**
 * Liefert true, wenn der Nutzer reduzierte Bewegung bevorzugt.
 * Startet defensiv mit `false` und korrigiert nach dem Mount, damit
 * SSR und Client identisch rendern (keine Hydration-Mismatches).
 */
export function useReducedMotion(): boolean {
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

/**
 * Generischer Media-Query-Hook. `false` bis nach dem Mount, damit
 * client-only Entscheidungen (3D laden?) nicht zu Hydration-Fehlern führen.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return matches;
}

/** Tablet/Desktop ab 768px — entscheidet, ob die volle Three.js-Szene lädt. */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 768px)");
}

/**
 * `true` erst nach dem ersten Client-Render. Nützlich, um schwere
 * client-only Komponenten (Canvas, WebGL) erst nach der Hydration zu mounten.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
