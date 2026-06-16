import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedProducts } from "@/lib/products";
import { ProductCard } from "@/components/shop/ProductCard";

export async function FeaturedProducts() {
  const products = await getFeaturedProducts(4);

  return (
    <section className="py-20 sm:py-28 scroll-fade bg-background">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-10 sm:mb-14">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
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
              className="font-display font-bold text-text-primary leading-tight"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.75rem)" }}
            >
              Featured Picks
            </h2>
            <p className="font-sans text-sm text-text-secondary mt-2 max-w-xs">
              Handverlesene Highlights — frisch geprüft und versandbereit.
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-2 font-sans text-sm font-semibold text-accent-orange hover:gap-3 transition-all duration-200 group"
          >
            Alle anzeigen
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
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
