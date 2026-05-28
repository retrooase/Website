import type { Metadata } from "next";
import { getAllProducts, getPlatforms } from "@/lib/products";
import { ShopClient } from "@/components/shop/ShopClient";

type SearchParams = { q?: string; category?: string };

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const cat = searchParams.category;
  return {
    title: cat ? `${cat} kaufen` : "Shop — Alle Produkte",
    description:
      "Geprüfte Retro-Konsolen, Spiele & Pokémon-Karten. Direkt kaufen oder über eBay.",
  };
}

export default function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const products = getAllProducts();
  const platforms = getPlatforms();

  return (
    <>
      {/* Page-Header */}
      <div className="bg-surface border-b border-border pt-10 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className="font-pixel text-text-primary mb-3"
            style={{ fontSize: "clamp(0.7rem, 2.5vw, 1rem)" }}
          >
            {searchParams.category ? `🗂️ ${searchParams.category}` : "🛒 Alle Produkte"}
          </h1>
          <p className="font-sans text-sm text-text-secondary mb-5 max-w-lg">
            {searchParams.category
              ? `Geprüfte Secondhand-Ware in der Kategorie ${searchParams.category} — direkt aus Deutschland.`
              : "Entdecke geprüfte Retro-Schätze — Konsolen, Spiele & Pokémon-Karten direkt aus Deutschland."}
          </p>

          {/* Trust-Zeile */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-sans text-xs text-text-secondary flex items-center gap-1.5">
              <span className="text-success font-bold">✓</span>
              Geprüfte Secondhand-Ware
            </span>
            <span className="text-border hidden sm:inline" aria-hidden="true">·</span>
            <span className="font-sans text-xs text-text-secondary">
              🚚 Versand aus Deutschland
            </span>
            <span className="text-border hidden sm:inline" aria-hidden="true">·</span>
            <span className="font-sans text-xs text-text-secondary">
              🔒 Sicher bezahlen über eBay
            </span>
          </div>
        </div>
      </div>

      <ShopClient
        products={products}
        allPlatforms={platforms}
        initialQuery={searchParams.q ?? ""}
        initialCategory={searchParams.category ?? ""}
      />
    </>
  );
}
