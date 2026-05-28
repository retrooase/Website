import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Gradient orbs — background depth */}
      <div
        className="absolute -top-48 -right-48 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,107,53,0.18), transparent 65%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-48 -left-48 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,204,2,0.08), transparent 65%)" }}
        aria-hidden="true"
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          opacity: 0.35,
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">

          {/* Left: Content */}
          <div className="self-center">
            {/* Brand pill */}
            <div className="inline-flex items-center gap-3 border border-border px-3 py-1.5 mb-8 bg-background/50 backdrop-blur-sm">
              <span
                className="font-pixel text-accent-orange"
                style={{ fontSize: "0.45rem", letterSpacing: "0.15em" }}
              >
                RETROASE
              </span>
              <span className="w-px h-3 bg-border" aria-hidden="true" />
              <span className="font-sans text-xs text-text-secondary">
                Retro Shop · Deutschland
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-sans font-bold text-text-primary leading-[1.08] tracking-tight mb-6"
              style={{ fontSize: "clamp(2.25rem, 4.5vw, 4.5rem)" }}
            >
              Retro-Gaming.
              <br />
              <span className="text-accent-orange">Neu gedacht.</span>
            </h1>

            {/* Subline */}
            <p
              className="font-sans text-text-secondary leading-relaxed mb-10 max-w-lg"
              style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)" }}
            >
              Geprüfte Konsolen, Spiele und Sammlerstücke — ehrlich beschrieben,
              schnell versendet. Direkt aus Deutschland.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-14">
              <Link href="/shop" className="btn-primary">
                Shop entdecken
                <ArrowRight size={16} />
              </Link>
              <Link href="/ankauf" className="btn-secondary">
                Ware verkaufen
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 sm:gap-12 pt-8 border-t border-border">
              {[
                { value: "500+", label: "eBay-Bewertungen" },
                { value: "100%", label: "Geprüfte Ware" },
                { value: "1–2 Tage", label: "Versandzeit" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p
                    className="font-mono font-bold text-text-primary"
                    style={{ fontSize: "clamp(1.25rem, 2vw, 1.75rem)" }}
                  >
                    {stat.value}
                  </p>
                  <p className="font-sans text-xs text-text-secondary mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Glass showcase (desktop only) */}
          <div className="hidden lg:flex flex-col gap-3 self-stretch">
            {/* Glass stats + categories panel */}
            <div className="flex-1 relative bg-background/70 backdrop-blur-xl border border-border/60 p-8 overflow-hidden flex flex-col justify-between">
              {/* Orange accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,107,53,0.8) 40%, rgba(255,107,53,0.8) 60%, transparent)",
                }}
                aria-hidden="true"
              />

              <div>
                {/* Label */}
                <span
                  className="font-pixel text-accent-orange mb-3 block"
                  style={{ fontSize: "0.45rem", letterSpacing: "0.18em" }}
                >
                  RETROASE.DE
                </span>
                <p className="font-sans text-sm text-text-secondary mb-10">
                  Dein Retro-Gaming-Partner aus Deutschland
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-5 mb-10">
                  {[
                    { value: "500+", label: "eBay-Bewertungen" },
                    { value: "100%", label: "Geprüfte Ware" },
                    { value: "1–2 Tage", label: "Versandzeit" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <p
                        className="font-mono font-bold text-text-primary"
                        style={{ fontSize: "clamp(1.1rem, 1.6vw, 1.6rem)" }}
                      >
                        {stat.value}
                      </p>
                      <p className="font-sans text-xs text-text-secondary mt-1 leading-snug">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category pills */}
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${encodeURIComponent(cat.label)}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border hover:border-accent-orange text-text-secondary hover:text-accent-orange font-sans text-xs transition-all duration-150"
                  >
                    <span aria-hidden="true">{cat.icon}</span>
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Orange CTA bar */}
            <Link
              href="/shop"
              className="group flex items-center justify-between px-7 py-5 bg-accent-orange hover:bg-[#e05a28] transition-colors duration-150"
            >
              <div>
                <p className="font-sans font-bold text-background text-base leading-tight">
                  Jetzt shoppen
                </p>
                <p className="font-sans text-sm text-background/70 mt-0.5">
                  Alle Produkte entdecken
                </p>
              </div>
              <ArrowRight
                size={22}
                className="text-background group-hover:translate-x-1 transition-transform duration-150"
              />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
