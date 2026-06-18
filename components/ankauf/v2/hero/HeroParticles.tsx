"use client";

import { useEffect, useRef } from "react";

/**
 * Leichtgewichtiger 2D-Canvas-Hintergrund für den Hero:
 *   • Sternenfeld (twinkelnd)
 *   • Goldener Münzregen (fällt + dreht sich)
 *   • Driftende Pixel-Icons (🎮 💰 ⭐ 🕹️ 👾) nach oben
 *
 * Performance:
 *   • Münze & Icons werden EINMAL als Sprites vorgerendert und danach nur
 *     noch per drawImage gezeichnet — kein Gradient-/Emoji-Text-Shaping
 *     mehr pro Frame.
 *   • Pausiert automatisch, sobald der Tab im Hintergrund ist ODER der Hero
 *     aus dem Viewport gescrollt wurde (IntersectionObserver). Dadurch läuft
 *     die rAF-Schleife nicht weiter, während der Nutzer unten auf der Seite ist.
 */

type Star = { x: number; y: number; r: number; a: number; tw: number; ph: number };
type Coin = { x: number; y: number; vy: number; r: number; spin: number; sp: number };
type Icon = { x: number; y: number; vy: number; sway: number; ph: number; size: number; char: string };

const ICON_CHARS = ["🎮", "💰", "⭐", "🕹️", "👾"];

export function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement ?? canvas;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let stars: Star[] = [];
    let coins: Coin[] = [];
    let icons: Icon[] = [];
    let raf = 0;
    let last = performance.now();
    let running = false;

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    // ── Sprites einmalig vorrendern (statt pro Frame zu zeichnen) ───────
    const iconSprites = new Map<string, HTMLCanvasElement>();
    let coinSprite: HTMLCanvasElement | null = null;

    const buildSprites = () => {
      const SP = 64;
      for (const ch of ICON_CHARS) {
        const c = document.createElement("canvas");
        c.width = SP;
        c.height = SP;
        const cx = c.getContext("2d");
        if (!cx) continue;
        cx.textAlign = "center";
        cx.textBaseline = "middle";
        cx.font = `${Math.round(SP * 0.78)}px serif`;
        cx.fillText(ch, SP / 2, SP / 2);
        iconSprites.set(ch, c);
      }

      const S = 64;
      const cc = document.createElement("canvas");
      cc.width = S;
      cc.height = S;
      const cx = cc.getContext("2d");
      if (cx) {
        const r = S / 2 - 1;
        const g = cx.createRadialGradient(S / 2 - r * 0.3, S / 2 - r * 0.3, 1, S / 2, S / 2, r);
        g.addColorStop(0, "#FFF4C2");
        g.addColorStop(0.5, "#FFC93C");
        g.addColorStop(1, "#C9760A");
        cx.fillStyle = g;
        cx.beginPath();
        cx.arc(S / 2, S / 2, r, 0, Math.PI * 2);
        cx.fill();
        cx.strokeStyle = "rgba(180,100,0,0.6)";
        cx.lineWidth = 1.5;
        cx.stroke();
        coinSprite = cc;
      }
    };

    const seed = () => {
      const area = width * height;
      const starCount = Math.min(120, Math.round(area / 12000));
      const coinCount = Math.min(12, Math.round(area / 100000));
      const iconCount = Math.min(6, Math.round(area / 170000));

      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: rand(0.4, 1.4),
        a: rand(0.2, 0.9),
        tw: rand(0.4, 1.6),
        ph: Math.random() * Math.PI * 2,
      }));
      coins = Array.from({ length: coinCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vy: rand(18, 46),
        r: rand(6, 13),
        spin: Math.random() * Math.PI,
        sp: rand(1.5, 3.5),
      }));
      icons = Array.from({ length: iconCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vy: rand(8, 20),
        sway: rand(8, 22),
        ph: Math.random() * Math.PI * 2,
        size: rand(18, 30),
        char: ICON_CHARS[Math.floor(Math.random() * ICON_CHARS.length)],
      }));
    };

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const drawCoin = (c: Coin) => {
      if (!coinSprite) return;
      const squash = Math.abs(Math.cos(c.spin)) * 0.85 + 0.15; // fake 3D-Drehung
      const w = c.r * 2 * squash;
      const h = c.r * 2;
      ctx.drawImage(coinSprite, c.x - w / 2, c.y - h / 2, w, h);
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, width, height);

      // Sterne
      for (const s of stars) {
        s.ph += s.tw * dt;
        const a = s.a * (0.55 + 0.45 * Math.sin(s.ph));
        ctx.fillStyle = `rgba(255,245,210,${a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Icons (driften nach oben) — als vorgerendertes Sprite
      ctx.globalAlpha = 0.22;
      for (const ic of icons) {
        ic.y -= ic.vy * dt;
        ic.ph += dt;
        if (ic.y < -ic.size) {
          ic.y = height + ic.size;
          ic.x = Math.random() * width;
        }
        const sprite = iconSprites.get(ic.char);
        if (sprite) {
          const x = ic.x + Math.sin(ic.ph) * ic.sway;
          ctx.drawImage(sprite, x - ic.size / 2, ic.y - ic.size / 2, ic.size, ic.size);
        }
      }
      ctx.globalAlpha = 1;

      // Münzen (fallen) — als vorgerendertes Sprite
      for (const c of coins) {
        c.y += c.vy * dt;
        c.spin += c.sp * dt;
        if (c.y > height + c.r) {
          c.y = -c.r;
          c.x = Math.random() * width;
        }
        drawCoin(c);
      }

      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // „Läuft?" = Tab sichtbar UND Hero im Viewport
    let tabVisible = !document.hidden;
    let onScreen = true;
    const sync = () => (tabVisible && onScreen ? start() : stop());

    const onVisibility = () => {
      tabVisible = !document.hidden;
      sync();
    };

    buildSprites();
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { rootMargin: "150px" },
    );
    io.observe(parent);

    document.addEventListener("visibilitychange", onVisibility);
    sync();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
