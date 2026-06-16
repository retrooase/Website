"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/hooks/useCart";
import { SITE } from "@/lib/constants";

export default function WarenkorbPage() {
  const { items, isLoaded, removeFromCart, clearCart, total, count } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    if (items.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds: items.map((i) => i.productId) }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? "Checkout fehlgeschlagen");
        setLoading(false);
        return;
      }
      clearCart();
      window.location.href = data.url;
    } catch {
      setError("Netzwerkfehler. Bitte erneut versuchen.");
      setLoading(false);
    }
  }

  if (!isLoaded) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="font-sans text-text-secondary">Lädt…</p>
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingCart className="mx-auto mb-6 text-text-secondary" size={56} strokeWidth={1.5} />
        <h1 className="font-sans text-2xl font-bold text-text-primary mb-3">
          Dein Warenkorb ist leer
        </h1>
        <p className="font-sans text-text-secondary mb-8">
          Stöbere im Shop und füge Artikel hinzu.
        </p>
        <Link href="/shop" className="btn-primary justify-center">
          <ShoppingBag size={16} />
          Zum Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-sans text-2xl font-bold text-text-primary mb-2">
        Warenkorb
      </h1>
      <p className="font-sans text-sm text-text-secondary mb-8">
        {count} {count === 1 ? "Artikel" : "Artikel"}
      </p>

      <div className="space-y-3 mb-8">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-4 border border-border bg-surface p-3"
          >
            {/* Bild */}
            <div className="w-16 h-16 flex-shrink-0 border border-border relative overflow-hidden bg-surface-hover">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag size={20} className="text-text-secondary" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <Link
                href={`/shop/${item.slug}`}
                className="font-sans text-sm font-semibold text-text-primary hover:text-accent-orange transition-colors line-clamp-2"
              >
                {item.title}
              </Link>
              <p className="price-tag text-base mt-0.5">
                {item.price.toFixed(2).replace(".", ",")} {SITE.currencySymbol}
              </p>
            </div>

            {/* Entfernen */}
            <button
              onClick={() => removeFromCart(item.productId)}
              className="p-2 text-text-secondary hover:text-error transition-colors flex-shrink-0"
              aria-label="Entfernen"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Zusammenfassung */}
      <div className="border-2 border-border bg-surface p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-sans text-sm text-text-secondary">Zwischensumme</span>
          <span className="price-tag text-xl">
            {total.toFixed(2).replace(".", ",")} {SITE.currencySymbol}
          </span>
        </div>
        <p className="font-sans text-xs text-text-secondary">inkl. MwSt. · Versandkosten werden beim Checkout berechnet</p>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <p className="font-sans text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="btn-primary w-full justify-center py-3.5 text-base disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Weiterleitung…
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Zur Kasse
            <ArrowRight size={18} />
          </span>
        )}
      </button>

      <button
        onClick={clearCart}
        className="w-full mt-3 font-sans text-xs text-text-secondary hover:text-error transition-colors py-2"
      >
        Warenkorb leeren
      </button>
    </div>
  );
}
