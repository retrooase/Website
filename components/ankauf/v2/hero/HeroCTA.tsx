"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

/**
 * Der zentrale Hero-CTA "JETZT VERKAUFEN".
 * Bei Klick regnet/explodiert ein Schwall goldener Münzen aus dem Button,
 * danach wird sanft zum Ziel (Wizard) gescrollt.
 * Reduced-Motion: kein Münzregen, sofortiger Sprung.
 */

type Burst = { id: number; coins: { dx: number; dy: number; d: number }[] };

const COIN_COUNT = 18;

function makeBurst(id: number): Burst {
  const coins = Array.from({ length: COIN_COUNT }, () => {
    const angle = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * 160;
    return {
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist - 40, // leichter Drall nach oben
      d: 0.7 + Math.random() * 0.5,
    };
  });
  return { id, coins };
}

export function HeroCTA({
  targetId = "angebot",
  label = "Jetzt verkaufen",
  reduced,
}: {
  targetId?: string;
  label?: string;
  reduced: boolean;
}) {
  const [bursts, setBursts] = useState<Burst[]>([]);

  const scrollToTarget = () => {
    const el = document.getElementById(targetId);
    el?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  const handleClick = () => {
    if (reduced) {
      scrollToTarget();
      return;
    }
    const id = Date.now();
    setBursts((prev) => [...prev, makeBurst(id)]);
    window.setTimeout(() => setBursts((prev) => prev.filter((b) => b.id !== id)), 1400);
    window.setTimeout(scrollToTarget, 260);
  };

  return (
    <div className="relative inline-flex">
      {/* Münz-Explosion */}
      <AnimatePresence>
        {bursts.map((burst) => (
          <div
            key={burst.id}
            className="pointer-events-none absolute left-1/2 top-1/2 z-20"
            aria-hidden="true"
          >
            {burst.coins.map((c, i) => (
              <motion.span
                key={i}
                initial={{ x: 0, y: 0, scale: 0.4, opacity: 1 }}
                animate={{ x: c.dx, y: c.dy, scale: 1, opacity: 0, rotate: 240 }}
                transition={{ duration: c.d, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  width: 16,
                  height: 16,
                  marginLeft: -8,
                  marginTop: -8,
                  borderRadius: "999px",
                  background: "radial-gradient(circle at 35% 30%, #FFF4C2, #FFC93C 55%, #C9760A)",
                  boxShadow: "0 0 8px rgba(255,180,40,0.7)",
                }}
              />
            ))}
          </div>
        ))}
      </AnimatePresence>

      <button type="button" onClick={handleClick} className="ak-cta">
        <span style={{ position: "relative", zIndex: 1 }}>{label}</span>
        <span style={{ position: "relative", zIndex: 1, fontSize: "1.1em" }} aria-hidden="true">
          🪙
        </span>
      </button>
    </div>
  );
}
