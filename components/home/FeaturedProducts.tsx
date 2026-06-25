import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedProducts } from "@/lib/products";
import { ProductCard } from "@/components/shop/ProductCard";

export async function FeaturedProducts() {
  const products = await getFeaturedProducts(4);

  return (
    <section className="relative overflow-hidden py-20 sm:py-28 scroll-fade">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 48% 36% at 50% 8%, rgba(255,95,46,0.13), transparent 68%), radial-gradient(ellipse 38% 34% at 83% 56%, rgba(34,211,163,0.08), transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "58px 58px",
          maskImage: "radial-gradient(ellipse 70% 58% at 50% 42%, black 20%, transparent 84%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center text-center sm:mb-16">
          <div>
            <div className="inline-flex items-center justify-center gap-2 mb-3 rounded-full border border-accent-orange/20 bg-accent-orange/[0.06] px-3 py-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full bg-accent-orange"
                style={{ animation: "glow-pulse 2s ease-in-out infinite" }}
                aria-hidden="true"
              />
              <p className="font-sans text-xs font-semibold tracking-[0.18em] uppercase text-accent-orange">
                Neu eingetroffen
              </p>
            </div>
            <h2
              className="font-display font-extrabold text-text-primary leading-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 4rem)", textShadow: "0 0 36px rgba(255,95,46,0.18)" }}
            >
              Frisch im Shop
            </h2>
            <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-relaxed text-white/56 sm:text-base">
              Geprüfte Retro-Highlights, die direkt bereit für die nächste Sammlung sind.
            </p>
          </div>
          <Link
            href="/shop"
            className="mt-5 hidden items-center gap-2 rounded-full border border-white/12 bg-white/[0.035] px-4 py-2.5 font-sans text-sm font-extrabold text-white/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-orange/50 hover:bg-accent-orange/10 hover:text-white sm:inline-flex group"
          >
            Alle anzeigen
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 lg:gap-7">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 4} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full border border-border text-text-secondary font-sans text-sm font-medium hover:border-accent-orange hover:text-accent-orange transition-all duration-200"
          >
            Alle Produkte sehen
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
