import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, Package, Truck, Shield, ChevronDown } from "lucide-react";
import { getProductBySlug, getRelatedProducts, getAllProducts } from "@/lib/products";
import { SITE, SHIPPING_INFO } from "@/lib/constants";
import { ImageGallery } from "@/components/shop/ImageGallery";
import { WishlistButton } from "@/components/shop/WishlistButton";
import { ProductCard } from "@/components/shop/ProductCard";
import { Breadcrumb } from "@/components/shop/Breadcrumb";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: "Produkt nicht gefunden" };
  return {
    title: `${product.title} kaufen`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 160),
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

const conditionColor: Record<string, string> = {
  "Sehr Gut": "text-success",
  Gut: "text-accent-yellow",
  Akzeptabel: "text-warning",
};
const conditionDot: Record<string, string> = {
  "Sehr Gut": "bg-success",
  Gut: "bg-accent-yellow",
  Akzeptabel: "bg-warning",
};

export default function ProductDetailPage({ params }: Props) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const related = getRelatedProducts(product, 4);
  const descLines = product.description.split("\n\n");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Breadcrumb
        crumbs={[
          { label: "Startseite", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: product.category, href: `/shop?category=${encodeURIComponent(product.category)}` },
          { label: product.title },
        ]}
      />

      {/* Haupt-Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Linke Spalte — Galerie */}
        <div>
          <ImageGallery images={product.images} title={product.title} />
        </div>

        {/* Rechte Spalte — Infos */}
        <div className="space-y-5">
          {/* Badge + Zustand */}
          <div className="flex flex-wrap items-center gap-2">
            {product.badge && (
              <span
                className={`badge ${
                  product.badge === "NEU"
                    ? "badge-new"
                    : product.badge === "SELTEN"
                    ? "badge-rare"
                    : product.badge === "TOP-ZUSTAND"
                    ? "badge-top"
                    : "badge-deal"
                }`}
              >
                {product.badge}
              </span>
            )}
            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 inline-block ${conditionDot[product.condition] ?? "bg-text-secondary"}`} />
              <span className={`font-sans text-sm font-semibold ${conditionColor[product.condition] ?? "text-text-secondary"}`}>
                {product.condition}
              </span>
            </div>
            {product.is_sold && (
              <span className="badge bg-error text-white">VERKAUFT</span>
            )}
          </div>

          {/* Titel */}
          <h1 className="font-sans text-2xl sm:text-3xl font-bold text-text-primary leading-tight">
            {product.title}
          </h1>

          {/* Plattform + Kategorie */}
          <div className="flex flex-wrap gap-3">
            <span className="font-sans text-xs text-text-secondary bg-surface-hover px-3 py-1 border border-border">
              {product.platform}
            </span>
            <span className="font-sans text-xs text-text-secondary bg-surface-hover px-3 py-1 border border-border">
              {product.category}
            </span>
            {product.region && (
              <span className="font-sans text-xs text-text-secondary bg-surface-hover px-3 py-1 border border-border">
                {product.region}
              </span>
            )}
          </div>

          {/* Preis */}
          <div className="flex items-baseline gap-3">
            <span className="price-tag text-4xl">
              {product.price.toFixed(2).replace(".", ",")} {SITE.currencySymbol}
            </span>
            <span className="font-sans text-xs text-text-secondary">inkl. MwSt.</span>
          </div>

          {/* CTA-Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={`${SITE.ebayShopUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn-primary flex-1 justify-center ${product.is_sold ? "opacity-50 pointer-events-none" : ""}`}
              aria-disabled={product.is_sold}
            >
              <ShoppingBag size={16} />
              {product.is_sold ? "Verkauft" : "Auf eBay kaufen"}
            </a>
            <WishlistButton productId={product.id} size="md" className="border-2 border-border hover:border-error" />
          </div>

          {/* Versand-Info-Box */}
          <div className="border-2 border-border bg-surface p-4 space-y-2.5">
            <h3
              className="font-pixel text-text-secondary mb-3"
              style={{ fontSize: "0.5rem", letterSpacing: "0.1em" }}
            >
              VERSAND &amp; SERVICE
            </h3>
            <InfoRow icon={<Truck size={14} />} label={`Versand in ${SHIPPING_INFO.daysMin}–${SHIPPING_INFO.daysMax} Werktagen`} />
            <InfoRow icon={<Package size={14} />} label={`Kostenloser Versand ab ${SHIPPING_INFO.freeShippingAbove} ${SITE.currencySymbol}`} />
            <InfoRow icon={<Shield size={14} />} label="Geprüfte Secondhand-Ware" />
          </div>

          {/* Beschreibung (erste Sektion) */}
          <div className="space-y-3">
            <h2 className="font-pixel text-text-primary" style={{ fontSize: "0.6rem" }}>
              BESCHREIBUNG
            </h2>
            <div className="font-sans text-sm text-text-secondary leading-relaxed space-y-3">
              {descLines.slice(0, 2).map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>

          {/* Technische Details — ausklappbar */}
          {(product.includes || product.release_year || product.language) && (
            <TechDetails product={product} descLines={descLines} />
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="pixel-divider my-12" />

      {/* Ähnliche Produkte */}
      {related.length > 0 && (
        <section>
          <h2 className="section-header mb-6">🔄 Ähnliche Produkte</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function InfoRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2.5 text-text-secondary">
      <span className="text-accent-orange flex-shrink-0">{icon}</span>
      <span className="font-sans text-sm">{label}</span>
    </div>
  );
}

function TechDetails({
  product,
  descLines,
}: {
  product: ReturnType<typeof getProductBySlug>;
  descLines: string[];
}) {
  if (!product) return null;

  return (
    <details className="group border-2 border-border">
      <summary className="flex items-center justify-between p-4 cursor-pointer list-none select-none hover:bg-surface-hover transition-colors">
        <span className="font-pixel text-text-primary" style={{ fontSize: "0.55rem" }}>
          TECHNISCHE DETAILS &amp; LIEFERUMFANG
        </span>
        <ChevronDown
          size={16}
          className="text-text-secondary transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="p-4 border-t-2 border-border space-y-4">
        {/* Restliche Beschreibung */}
        {descLines.length > 2 && (
          <div className="font-sans text-sm text-text-secondary leading-relaxed space-y-2">
            {descLines.slice(2).map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        )}

        {/* Technische Tabelle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {product.platform && <TechRow label="Plattform" value={product.platform} />}
          {product.condition && <TechRow label="Zustand" value={product.condition} />}
          {product.region && <TechRow label="Region" value={product.region} />}
          {product.language && <TechRow label="Sprache" value={product.language} />}
          {product.release_year && (
            <TechRow label="Erscheinungsjahr" value={String(product.release_year)} />
          )}
        </div>

        {/* Lieferumfang */}
        {product.includes && product.includes.length > 0 && (
          <div>
            <p className="font-pixel text-text-secondary mb-2" style={{ fontSize: "0.5rem" }}>
              LIEFERUMFANG
            </p>
            <ul className="space-y-1">
              {product.includes.map((item) => (
                <li key={item} className="font-sans text-sm text-text-secondary flex items-center gap-2">
                  <span className="text-accent-green">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </details>
  );
}

function TechRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="font-sans text-xs text-text-secondary w-32 flex-shrink-0">{label}:</span>
      <span className="font-sans text-xs text-text-primary">{value}</span>
    </div>
  );
}
