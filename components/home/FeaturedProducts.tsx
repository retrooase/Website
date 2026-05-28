import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedProducts } from "@/lib/products";
import { ProductCard } from "@/components/shop/ProductCard";

export function FeaturedProducts() {
  const products = getFeaturedProducts(4);

  return (
    <section className="py-20 sm:py-28 scroll-fade">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-accent-orange mb-2">
              Neu eingetroffen
            </p>
            <h2
              className="font-sans font-bold text-text-primary"
              style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)" }}
            >
              Featured Picks
            </h2>
            <p className="font-sans text-sm text-text-secondary mt-2">
              Handverlesene Highlights — frisch geprüft und versandbereit.
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-2 font-sans text-sm font-semibold text-accent-orange hover:text-text-primary transition-colors"
          >
            Alle anzeigen
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/shop" className="btn-secondary w-full justify-center">
            Alle Produkte sehen
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
