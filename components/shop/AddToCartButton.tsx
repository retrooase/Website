"use client";

import { ShoppingCart, Check } from "lucide-react";
import { useCart, type CartItem } from "@/lib/hooks/useCart";

type Props = {
  product: CartItem;
  isSold: boolean;
};

export function AddToCartButton({ product, isSold }: Props) {
  const { addToCart, isInCart, isLoaded } = useCart();
  const inCart = isLoaded && isInCart(product.productId);

  if (isSold) return null;

  return (
    <button
      onClick={() => addToCart(product)}
      disabled={inCart}
      className={`flex items-center justify-center gap-2 font-sans text-sm font-semibold px-5 py-3 border-2 transition-all min-h-[48px] ${
        inCart
          ? "border-accent-green text-accent-green bg-accent-green/10 cursor-default"
          : "border-border text-text-secondary hover:border-accent-orange hover:text-accent-orange"
      }`}
    >
      {inCart ? <Check size={18} /> : <ShoppingCart size={18} />}
      {inCart ? "Im Warenkorb" : "In den Warenkorb"}
    </button>
  );
}
