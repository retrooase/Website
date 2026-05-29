"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getAllProducts } from "@/lib/products";
import type { Product } from "@/lib/types";
import { SITE } from "@/lib/constants";

type Props = {
  userId: string;
};

export function WishlistSection({ userId }: Props) {
  const [productIds, setProductIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("wishlist_items")
      .select("product_id")
      .then(({ data }) => {
        setProductIds((data ?? []).map((r) => r.product_id as string));
        setLoading(false);
      });
  }, [userId]);

  async function remove(productId: string) {
    const supabase = createClient();
    await supabase
      .from("wishlist_items")
      .delete()
      .eq("product_id", productId);
    setProductIds((prev) => prev.filter((id) => id !== productId));

    // localStorage sync
    try {
      const raw = localStorage.getItem("retroase_wishlist_v1");
      const local: string[] = raw ? JSON.parse(raw) : [];
      localStorage.setItem(
        "retroase_wishlist_v1",
        JSON.stringify(local.filter((id) => id !== productId))
      );
    } catch {}
  }

  const allProducts = getAllProducts();
  const wishlistProducts = productIds
    .map((id) => allProducts.find((p) => p.id === id))
    .filter((p): p is Product => !!p);

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Heart size={18} className="text-error" />
        <h2 className="font-pixel text-text-primary" style={{ fontSize: "0.6rem" }}>
          WUNSCHLISTE
        </h2>
        {wishlistProducts.length > 0 && (
          <span className="font-sans text-xs text-text-secondary bg-surface-hover border border-border px-2 py-0.5">
            {wishlistProducts.length}
          </span>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-square bg-surface-hover animate-pulse" />
          ))}
        </div>
      ) : wishlistProducts.length === 0 ? (
        <div className="border-2 border-dashed border-border p-8 text-center">
          <Heart size={32} className="text-border mx-auto mb-3" />
          <p className="font-sans text-sm text-text-secondary mb-4">
            Deine Wunschliste ist leer.
          </p>
          <Link href="/shop" className="btn-primary inline-flex justify-center">
            <ShoppingBag size={14} />
            Zum Shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {wishlistProducts.map((product) => (
            <WishlistCard key={product.id} product={product} onRemove={remove} />
          ))}
        </div>
      )}
    </section>
  );
}

function WishlistCard({
  product,
  onRemove,
}: {
  product: Product;
  onRemove: (id: string) => void;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group relative bg-surface border border-border hover:border-accent-orange transition-all">
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-square bg-surface-hover overflow-hidden">
          {!imgError ? (
            <Image
              src={product.images[0] ?? "/images/placeholder-product.jpg"}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface-hover">
              <span className="text-2xl">🎮</span>
            </div>
          )}
          {product.is_sold && (
            <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
              <span className="font-pixel text-error" style={{ fontSize: "0.55rem" }}>
                VERKAUFT
              </span>
            </div>
          )}
        </div>
        <div className="p-2.5">
          <p className="font-sans text-xs font-semibold text-text-primary line-clamp-2 leading-snug">
            {product.title}
          </p>
          <p className="font-mono text-sm font-bold text-accent-orange mt-1">
            {product.price.toFixed(2).replace(".", ",")} {SITE.currencySymbol}
          </p>
        </div>
      </Link>

      {/* Remove button */}
      <button
        onClick={() => onRemove(product.id)}
        className="absolute top-1.5 right-1.5 bg-background/80 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:text-error text-text-secondary"
        aria-label="Aus Wunschliste entfernen"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}
