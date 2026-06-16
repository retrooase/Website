"use client";

import { useEffect, useState } from "react";

const BAR_BLOCKS = 18;

export function RetroLoader({ label = "LOADING" }: { label?: string }) {
  const [filled, setFilled] = useState(0);
  const [blink, setBlink] = useState(true);

  // blinking cursor
  useEffect(() => {
    const t = setInterval(() => setBlink((b) => !b), 480);
    return () => clearInterval(t);
  }, []);

  // fake progress — fills to ~85% then waits
  useEffect(() => {
    let current = 0;
    const speeds = [80, 90, 100, 110, 130, 150, 160, 180, 200, 220, 240, 260, 280, 300, 340, 400];
    let i = 0;
    const tick = () => {
      current++;
      setFilled(Math.min(current, BAR_BLOCKS - 3));
      if (current < BAR_BLOCKS - 3) {
        setTimeout(tick, speeds[i] ?? 400);
        i++;
      }
    };
    const initial = setTimeout(tick, 120);
    return () => clearTimeout(initial);
  }, []);

  return (
    <div
      className="min-h-[65vh] flex flex-col items-center justify-center gap-7 px-4 select-none"
      aria-label="Wird geladen…"
      role="status"
    >
      {/* Logo */}
      <div className="text-center leading-none space-y-1">
        <span
          className="font-pixel text-accent-orange neon-text-orange block"
          style={{ fontSize: "clamp(0.75rem, 2.8vw, 1.1rem)", letterSpacing: "0.25em" }}
        >
          RETR
        </span>
        <span
          className="font-pixel text-accent-yellow neon-text-yellow block"
          style={{ fontSize: "clamp(0.75rem, 2.8vw, 1.1rem)", letterSpacing: "0.25em" }}
        >
          OASE
        </span>
      </div>

      {/* Pixel divider */}
      <div className="flex gap-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 bg-border" />
        ))}
      </div>

      {/* Label + blinking cursor */}
      <div
        className="font-pixel text-text-secondary flex items-center gap-2"
        style={{ fontSize: "0.5rem", letterSpacing: "0.18em" }}
      >
        <span className="text-accent-orange" style={{ fontSize: "0.55rem" }}>►</span>
        <span>{label}</span>
        <span
          className="text-accent-orange"
          style={{ opacity: blink ? 1 : 0, transition: "opacity 0.08s" }}
        >
          █
        </span>
      </div>

      {/* Pixel progress bar */}
      <div className="flex items-center gap-px">
        <span className="font-pixel text-border mr-1" style={{ fontSize: "0.55rem" }}>[</span>
        {Array.from({ length: BAR_BLOCKS }).map((_, i) => (
          <div
            key={i}
            className="w-3.5 h-3.5"
            style={{
              background: i < filled ? "var(--accent-orange)" : "var(--surface-hover)",
              boxShadow: i < filled ? "0 0 5px var(--accent-orange), 0 0 10px rgba(255,107,53,0.4)" : "none",
              transition: "background 0.1s, box-shadow 0.1s",
            }}
          />
        ))}
        <span className="font-pixel text-border ml-1" style={{ fontSize: "0.55rem" }}>]</span>
      </div>

      {/* Bottom line */}
      <p
        className="font-pixel text-text-secondary"
        style={{ fontSize: "0.38rem", letterSpacing: "0.12em" }}
      >
        PLEASE WAIT...
      </p>
    </div>
  );
}
