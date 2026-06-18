"use client";

import { motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Dramatische Hero-Headline:
 *   Zeile 1 "DEINE SCHÄTZE." fällt Buchstabe für Buchstabe von oben (Bounce).
 *   Zeile 2 "DEIN GELD."     explodiert danach aus der Mitte (Scale-Spring).
 * Bei reduzierter Bewegung: statisch, sofort sichtbar.
 */

const LINE_1 = "DEINE SCHÄTZE.";
const LINE_2 = "DEIN GELD.";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } },
};

const letter: Variants = {
  hidden: { y: -70, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 520, damping: 14 } },
};

function AnimatedLetters({ text }: { text: string }) {
  return (
    <motion.span variants={container} initial="hidden" animate="show" style={{ display: "inline-block" }}>
      {text.split("").map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          variants={letter}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

export function HeroHeadline({ reduced }: { reduced: boolean }) {
  const line2Delay = 0.15 + LINE_1.length * 0.05 + 0.1;

  if (reduced) {
    return (
      <h1 className="ak-display text-[clamp(2.8rem,8vw,7rem)]">
        <span className="block text-white">{LINE_1}</span>
        <span className="ak-gold-text ak-neon-gold block">{LINE_2}</span>
      </h1>
    );
  }

  return (
    <h1 className="ak-display text-[clamp(2.8rem,8vw,7rem)]">
      <span className="block text-white">
        <AnimatedLetters text={LINE_1} />
      </span>
      <motion.span
        className="ak-gold-text ak-neon-gold block"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: line2Delay, type: "spring", stiffness: 220, damping: 12 }}
        style={{ transformOrigin: "center" }}
      >
        {LINE_2}
      </motion.span>
    </h1>
  );
}

/**
 * Typewriter-Sub-Headline mit blinkendem Cursor.
 * Bei reduzierter Bewegung: vollständiger Text ohne Tipp-Animation.
 */
export function HeroTypewriter({
  text = "Wir kaufen alles an. Sofort. Fair. Unkompliziert.",
  reduced,
  startDelay = 1100,
}: {
  text?: string;
  reduced: boolean;
  startDelay?: number;
}) {
  const [count, setCount] = useState(reduced ? text.length : 0);

  useEffect(() => {
    if (reduced) {
      setCount(text.length);
      return;
    }
    let timer: ReturnType<typeof setTimeout>;
    let i = 0;
    const begin = setTimeout(function step() {
      setCount(++i);
      if (i < text.length) timer = setTimeout(step, 38);
    }, startDelay);
    return () => {
      clearTimeout(begin);
      clearTimeout(timer);
    };
  }, [text, reduced, startDelay]);

  return (
    <p className="font-sans text-[clamp(1rem,1.4vw,1.25rem)]" style={{ color: "var(--ak-text-dim)" }}>
      {text.slice(0, count)}
      <span
        aria-hidden="true"
        style={{
          display: "inline-block",
          width: "0.6ch",
          marginLeft: "1px",
          color: "var(--ak-gold)",
          animation: "ak-blink 1s step-end infinite",
        }}
      >
        |
      </span>
    </p>
  );
}
