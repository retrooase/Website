import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products";
import { getCategoryLabel } from "@/lib/categories";
import { ShopClient } from "@/components/shop/ShopClient";
import { breadcrumbSchema, jsonLdString } from "@/lib/seo";

export const revalidate = 60;

type SearchParams = { q?: string; category?: string };

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const cat = searchParams.category;
  const label = cat ? getCategoryLabel(cat) : "";
  const isSearch = Boolean(searchParams.q);
  return {
    title: label ? `${label} kaufen` : "Shop — Alle Produkte",
    description: label
      ? `Geprüfte Secondhand ${label} — Konsolen, Spiele & Zubehör direkt aus Deutschland kaufen.`
      : "Geprüfte Retro-Konsolen, Spiele & Pokémon-Karten. Direkt kaufen oder über eBay.",
    alternates: {
      canonical: cat ? `/shop?category=${encodeURIComponent(cat)}` : "/shop",
    },
    // Freitext-Suchergebnisse sind dünner/duplizierter Content -> nicht indexieren
    robots: isSearch ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const products = await getAllProducts();
  const platforms = Array.from(new Set(products.map((p) => p.platform).filter((p): p is string => Boolean(p))));
  const categoryLabel = searchParams.category ? getCategoryLabel(searchParams.category) : "";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            breadcrumbSchema([
              { name: "Startseite", url: "/" },
              { name: categoryLabel || "Shop" },
            ])
          ),
        }}
      />
      {/* Page-Header */}
      <div className="bg-surface border-b border-border/60 pt-10 pb-8">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className="font-display font-bold text-text-primary mb-2 leading-tight"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
          >
            {categoryLabel || "Alle Produkte"}
          </h1>
          <p className="font-sans text-sm text-text-secondary mb-5 max-w-lg">
            {categoryLabel
              ? `Geprüfte Secondhand-Ware · ${categoryLabel} · direkt aus Deutschland.`
              : "Entdecke geprüfte Retro-Schätze — Konsolen, Spiele & Pokémon-Karten direkt aus Deutschland."}
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="flex items-center gap-1.5 font-sans text-xs text-text-secondary">
              <span className="text-accent-teal">✓</span>
              Geprüfte Ware
            </span>
            <span className="flex items-center gap-1.5 font-sans text-xs text-text-secondary">
              🚚 Versand 1–2 Tage
            </span>
            <span className="flex items-center gap-1.5 font-sans text-xs text-text-secondary">
              🔒 Sicher bezahlen
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
