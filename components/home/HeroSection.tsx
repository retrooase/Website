import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Star } from "lucide-react";

const PRODUCTS = [
  {
    emoji: "🎮",
    name: "Game Boy Color",
    platform: "Nintendo",
    price: "79,90 €",
    badge: "TOP",
    badgeColor: "bg-accent-teal text-[#0D0B12]",
    accent: "rgba(34,211,163,0.12)",
    delay: "0ms",
    rotate: "-2deg",
    top: "0%",
  },
  {
    emoji: "⚡",
    name: "Pokémon Gold",
    platform: "Game Boy",
    price: "44,90 €",
    badge: "SELTEN",
    badgeColor: "bg-accent-gold text-[#0D0B12]",
    accent: "rgba(240,164,41,0.12)",
    delay: "120ms",
    rotate: "1.5deg",
    top: "30%",
  },
  {
    emoji: "🍄",
    name: "Super Nintendo",
    platform: "SNES",
    price: "139,90 €",
    badge: "HOT",
    badgeColor: "bg-accent-orange text-white",
    accent: "rgba(255,95,46,0.12)",
    delay: "240ms",
    rotate: "-1deg",
    top: "60%",
  },
];

const TRUST_PILLS = [
  { icon: ShieldCheck, text: "100% geprüft" },
  { icon: Truck, text: "1–2 Tage DE" },
  { icon: Star, text: "500+ Bewertungen" },
];

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "var(--bg-anchor)",
        minHeight: "100svh",
      }}
      aria-labelledby="hero-heading"
    >
      {/* Background atmosphere */}
      <div
        className="absolute -top-32 -right-16 w-[600px] h-[600px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,95,46,0.18) 0%, transparent 60%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 -left-32 w-[500px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(34,211,163,0.07) 0%, transparent 60%)" }}
        aria-hidden="true"
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />

      {/* ── Content grid ─── */}
      <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="lg:grid lg:grid-cols-[1fr_420px] lg:gap-16 xl:gap-24 items-center py-16 pb-28 lg:py-24 lg:pb-24">

          {/* ── LEFT: Text Content ─────────────────────────── */}
          <div className="flex flex-col justify-center pb-6 lg:pb-0">

            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-2.5 mb-6 lg:mb-8"
              style={{ animation: "reveal-up 0.55s var(--ease-smooth) 0ms both" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-accent-orange flex-shrink-0"
                style={{ animation: "glow-pulse 2s ease-in-out infinite" }}
                aria-hidden="true"
              />
              <span className="font-sans text-[11px] font-semibold tracking-[0.22em] uppercase text-accent-orange">
                Retro Gaming · Made in Germany
              </span>
            </div>

            {/* Headline — 2 Zeilen, kompakter */}
            <h1
              id="hero-heading"
              className="font-display font-extrabold leading-[0.88] tracking-[-0.04em] mb-5 lg:mb-7"
              style={{ color: "#EEE9FB" }}
            >
              <span
                className="block"
                style={{
                  fontSize: "clamp(2.4rem, 8vw, 6.5rem)",
                  animation: "reveal-up 0.7s var(--ease-smooth) 80ms both",
                }}
              >
                Gaming-Träume
              </span>
              <span
                className="block text-accent-orange"
                style={{
                  fontSize: "clamp(2.4rem, 8vw, 6.5rem)",
                  animation: "reveal-up 0.7s var(--ease-smooth) 180ms both",
                  textShadow: "0 0 60px rgba(255,95,46,0.35)",
                }}
              >
                wahr werden.
              </span>
            </h1>

            {/* Subline */}
            <p
              className="font-sans text-sm sm:text-base leading-relaxed mb-8 max-w-lg"
              style={{
                color: "rgba(238,233,251,0.52)",
                animation: "reveal-up 0.7s var(--ease-smooth) 280ms both",
              }}
            >
              Geprüfte Konsolen, Spiele & Pokémon-Karten aus Deutschland.
              Jedes Teil ehrlich beschrieben, sicher versendet.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col xs:flex-row gap-3 mb-10 lg:mb-12"
              style={{ animation: "reveal-up 0.7s var(--ease-smooth) 360ms both" }}
            >
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-accent-orange text-white font-sans font-semibold text-sm hover:bg-accent-orange/90 hover:-translate-y-0.5 shadow-[0_4px_24px_rgba(255,95,46,0.4)] hover:shadow-[0_8px_36px_rgba(255,95,46,0.55)] transition-all duration-200"
              >
                Shop entdecken
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/ankauf"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-white/15 text-white/60 font-sans font-medium text-sm hover:border-white/35 hover:text-white/90 hover:bg-white/5 transition-all duration-200"
              >
                Ware verkaufen →
              </Link>
            </div>

            {/* Trust pills */}
            <div
              className="flex flex-wrap items-center gap-2"
              style={{ animation: "reveal-up 0.7s var(--ease-smooth) 440ms both" }}
            >
              {TRUST_PILLS.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-sm"
                >
                  <Icon size={12} className="text-accent-teal flex-shrink-0" />
                  <span className="font-sans text-[11px] font-medium text-white/55">{text}</span>
                </div>
              ))}
            </div>

            {/* Stats row (desktop only) */}
            <div
              className="hidden lg:flex items-center gap-10 mt-12 pt-8 border-t border-white/8"
              style={{ animation: "reveal-up 0.7s var(--ease-smooth) 540ms both" }}
            >
              {[
                { value: "500+", label: "eBay-Bewertungen" },
                { value: "100%", label: "Geprüfte Ware" },
                { value: "1–2 Tage", label: "Versand" },
              ].map((s) => (
                <div key={s.label}>
                  <p
                    className="font-display font-extrabold text-accent-orange leading-none"
                    style={{
                      fontSize: "clamp(1.5rem, 2.2vw, 2rem)",
                      textShadow: "0 0 20px rgba(255,95,46,0.35)",
                    }}
                  >
                    {s.value}
                  </p>
                  <p className="font-sans text-[11px] mt-1 text-white/35">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Product Showcase (Desktop) ──────────────── */}
          <div
            className="hidden lg:block relative h-[520px] xl:h-[580px]"
            style={{ animation: "reveal-up 0.8s var(--ease-smooth) 200ms both" }}
            aria-hidden="true"
          >
            {PRODUCTS.map((p, i) => (
              <div
                key={p.name}
                className="absolute w-[220px] xl:w-[240px]"
                style={{
                  top: p.top,
                  right: i === 1 ? "0px" : i === 0 ? "30px" : "10px",
                  transform: `rotate(${p.rotate})`,
                  animation: `reveal-up 0.8s var(--ease-smooth) ${p.delay} both, float 6s ease-in-out ${p.delay} infinite`,
                  zIndex: i === 1 ? 3 : i === 0 ? 2 : 1,
                }}
              >
                <div
                  className="rounded-2xl border border-white/10 p-4 backdrop-blur-xl"
                  style={{ background: `rgba(13,11,18,0.7)` }}
                >
                  {/* Emoji showcase */}
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-3 flex-shrink-0"
                    style={{ background: p.accent }}
                  >
                    {p.emoji}
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-sans text-xs font-semibold text-white/90 truncate">{p.name}</p>
                      <p className="font-sans text-[10px] text-white/35 mt-0.5">{p.platform}</p>
                    </div>
                    <span className={`flex-shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full ${p.badgeColor}`}>
                      {p.badge}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/8 flex items-center justify-between">
                    <span className="font-display font-bold text-accent-orange text-sm">{p.price}</span>
                    <span className="font-sans text-[10px] text-white/30">inkl. MwSt.</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Background glow behind cards */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at 60% 40%, rgba(255,95,46,0.06) 0%, transparent 70%)",
              }}
            />
          </div>

          {/* ── Mobile: Product Row (Horizontal scroll) ──────── */}
          <div
            className="lg:hidden -mx-4 px-4 pb-4 mt-2"
            style={{ animation: "reveal-up 0.7s var(--ease-smooth) 500ms both" }}
          >
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
              {PRODUCTS.map((p) => (
                <div
                  key={p.name}
                  className="flex-shrink-0 w-[160px] rounded-2xl border border-white/10 p-3 backdrop-blur-xl"
                  style={{ background: "rgba(19,16,32,0.85)" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-2"
                    style={{ background: p.accent }}
                  >
                    {p.emoji}
                  </div>
                  <p className="font-sans text-xs font-semibold text-white/85 truncate">{p.name}</p>
                  <p className="font-display font-bold text-accent-orange text-xs mt-1">{p.price}</p>
                </div>
              ))}

              {/* "Mehr ansehen" card */}
              <Link
                href="/shop"
                className="flex-shrink-0 w-[120px] rounded-2xl border border-accent-orange/20 p-3 flex flex-col items-center justify-center gap-2 hover:bg-accent-orange/10 transition-colors"
                style={{ background: "rgba(255,95,46,0.05)" }}
                aria-label="Alle Produkte im Shop"
              >
                <ArrowRight size={20} className="text-accent-orange" />
                <span className="font-sans text-[11px] font-semibold text-accent-orange text-center">Alle Produkte</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none hidden lg:flex flex-col items-center gap-1.5"
        aria-hidden="true"
      >
        <div className="w-px h-10 bg-gradient-to-b from-white/25 to-transparent" />
        <span className="font-sans text-[10px] tracking-widest uppercase text-white/20">Scroll</span>
      </div>
    </section>
  );
}
