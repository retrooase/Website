"use client";

import { useEffect, useRef } from "react";

/**
 * Leichte Konfetti-Explosion auf einem Canvas. Feuert genau einmal, sobald das
 * Element zum ersten Mal in den Viewport scrollt (IntersectionObserver). Der
 * rAF-Loop stoppt automatisch nach ~1,8 s; vollständiges Cleanup.
 *
 * `enabled={false}` (prefers-reduced-motion) → kein Feuern.
 */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vrot: number;
  size: number;
  color: string;
  life: number;
}

const COLORS = ["#FFC93C", "#FF9A1F", "#00FF88", "#36E0FF", "#FF3B5C", "#FFE9A8"];
const DURATION_MS = 1800;

export function ConfettiBurst({ enabled = true, count = 140 }: { enabled?: boolean; count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let startTs = 0;
    let particles: Particle[] = [];
    let fired = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const measure = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return rect;
    };

    const spawn = (w: number, h: number) => {
      const ox = w / 2;
      const oy = h / 2;
      particles = Array.from({ length: count }, () => {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI; // nach oben gestreut
        const speed = 4 + Math.random() * 7;
        return {
          x: ox,
          y: oy,
          vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 3,
          vy: Math.sin(angle) * speed,
          rot: Math.random() * Math.PI,
          vrot: (Math.random() - 0.5) * 0.4,
          size: 5 + Math.random() * 6,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          life: 1,
        };
      });
    };

    const tick = (ts: number) => {
      if (!startTs) startTs = ts;
      const elapsed = ts - startTs;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.vy += 0.18; // Schwerkraft
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vrot;
        p.life = Math.max(0, 1 - elapsed / DURATION_MS);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
      if (elapsed < DURATION_MS) raf = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, w, h);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired) {
          fired = true;
          const rect = measure();
          spawn(rect.width, rect.height);
          startTs = 0;
          raf = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 },
    );
    io.observe(canvas);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [enabled, count]);

  return <canvas ref={canvasRef} aria-hidden="true" className="ak-confetti" />;
}
