"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";

type Props = {
  productId: string;
  isSold: boolean;
};

export function BuyButton({ productId, isSold }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isSold) {
    return (
      <button
        disabled
        className="btn-primary flex-1 justify-center opacity-50 cursor-not-allowed"
      >
        <ShoppingBag size={16} />
        Verkauft
      </button>
    );
  }

  async function handleBuy() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Fehler beim Checkout");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
      setLoading(false);
    }
  }

  return (
    <div className="flex-1">
      <button
        onClick={handleBuy}
        disabled={loading}
        className="btn-primary w-full justify-center"
      >
        {loading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Weiterleitung…
          </>
        ) : (
          <>
            <ShoppingBag size={16} />
            Jetzt kaufen
          </>
        )}
      </button>
      {error && (
        <p className="font-sans text-xs text-error mt-1.5">{error}</p>
      )}
    </div>
  );
}
