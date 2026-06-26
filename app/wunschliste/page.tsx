"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2, ShoppingBag, ShoppingCart } from "lucide-react";
import { useWishlistHybrid } from "@/lib/hooks/useWishlistHybrid";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/lib/hooks/useCart";
import type { Product } from "@/types";
import { SITE } from "@/lib/constants";

export default function WunschlistePage() {
  const { wishlist, toggleWishlist, isLoaded } = useWishlistHybrid();
  const { addToCart, isInCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (wishlist.length === 0) {
      setProducts([]);
      return;
    }

    setFetching(true);
    const supabase = createClient();
    supabase
      .from("products")
      .select("*")
      .in("id", wishlist)
      .then(({ data, error }) => {
        setFetching(false);
        // Bei Fehler nichts bereinigen – sonst würde eine gültige Liste
        // bei einem Netzwerkfehler fälschlich geleert.
        if (error) return;

        const map = new Map((data ?? []).map((p) => [p.id, p as Product]));
        setProducts(wishlist.map((id) => map.get(id)).filter((p): p is Product => !!p));

        // Geister-IDs (Produkt existiert nicht mehr) automatisch entfernen,
        // damit der Wunschlisten-Zähler/Badge nicht dauerhaft "hängt".
        const ghostIds = wishlist.filter((id) => !map.has(id));
        ghostIds.forEach((id) => toggleWishlist(id));
      });
  }, [wishlist, isLoaded, toggleWishlist]);

  const loading = !isLoaded || fetching;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-surface">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-1">
            <Heart size={22} className="text-error" />
            <h1 className="font-sans font-bold text-text-primary" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)" }}>
              Wunschliste
            </h1>
            {!loading && products.length > 0 && (
              <span className="font-sans text-sm text-text-secondary bg-surface-hover border border-border px-2.5 py-0.5">
                {products.length} {products.length === 1 ? "Artikel" : "Artikel"}
              </span>
            )}
          </div>
          <p className="font-sans text-sm text-text-secondary">
            Gespeicherte Artikel — auch ohne Account verfügbar.
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-surface border border-border">
                <div className="aspect-square bg-surface-hover animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-surface-hover animate-pulse w-3/4" />
                  <div className="h-4 bg-surface-hover animate-pulse w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="border-2 border-dashed border-border p-16 text-center max-w-md mx-auto">
            <Heart size={40} className="text-border mx-auto mb-4" />
            <p className="font-sans font-semibold text-text-primary mb-2">Deine Wunschliste ist leer</p>
            <p className="font-sans text-sm text-text-secondary mb-6">
              Klick beim Stöbern auf das Herz-Symbol um Artikel zu merken.
            </p>
            <Link href="/shop" className="btn-primary inline-flex gap-2 justify-center">
              <ShoppingBag size={14} />
              Zum Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <WishlistCard
                key={product.id}
                product={product}
                onRemove={() => toggleWishlist(product.id)}
                onAddToCart={() => addToCart({
                  productId: product.id,
                  title: product.title,
                  price: product.price,
                  image: product.images?.[0],
                  slug: product.slug,
                })}
                inCart={isInCart(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function WishlistCard({
  product,
  onRemove,
  onAddToCart,
  inCart,
}: {
  product: Product;
  onRemove: () => void;
  onAddToCart: () => void;
  inCart: boolean;

}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group relative bg-surface border border-border hover:border-accent-orange transition-all duration-150">
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-square bg-surface-hover overflow-hidden">
          {!imgError ? (
            <Image
              src={product.images?.[0] ?? "/images/placeholder-product.jpg"}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-3xl opacity-20">🎮</span>
            </div>
          )}

          {product.is_sold && (
            <div className="absolute inset-0 bg-background/75 flex items-center justify-center">
              <span className="font-pixel text-error" style={{ fontSize: "0.5rem" }}>VERKAUFT</span>
            </div>
          )}
        </div>

        <div className="p-3">
          <p className="font-sans text-xs font-semibold text-text-primary line-clamp-2 leading-snug mb-1.5">
            {product.title}
          </p>
          <p className="font-mono text-sm font-bold text-accent-orange">
            {product.price.toFixed(2).replace(".", ",")} {SITE.currencySymbol}
          </p>
          {product.condition && (
            <p className="font-sans text-xs text-text-secondary mt-0.5">{product.condition}</p>
          )}
        </div>
      </Link>

      {/* Actions: sichtbar bei hover */}
      <div className="px-3 pb-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        {!product.is_sold && (
          <button
            onClick={onAddToCart}
            disabled={inCart}
            className="flex-1 flex items-center justify-center gap-1.5 font-sans text-xs py-1.5 border border-border hover:border-accent-orange hover:text-accent-orange transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-text-secondary"
          >
            <ShoppingCart size={12} />
            {inCart ? "Im Warenkorb" : "In den Warenkorb"}
          </button>
        )}
        <button
          onClick={onRemove}
          aria-label="Entfernen"
          className="p-1.5 border border-border hover:border-error hover:text-error transition-colors text-text-secondary"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
