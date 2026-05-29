"use client";

import { Heart } from "lucide-react";
import { useWishlistHybrid } from "@/lib/hooks/useWishlistHybrid";
import { clsx } from "clsx";

type Props = {
  productId: string;
  size?: "sm" | "md";
  className?: string;
};

export function WishlistButton({ productId, size = "md", className }: Props) {
  const { toggleWishlist, isInWishlist, isLoaded } = useWishlistHybrid();
  const active = isLoaded && isInWishlist(productId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(productId);
      }}
      aria-label={active ? "Von Wunschliste entfernen" : "Zur Wunschliste hinzufügen"}
      className={clsx(
        "flex items-center justify-center transition-all duration-150",
        "min-h-[44px] min-w-[44px]",
        size === "sm" ? "p-1.5" : "p-2",
        active
          ? "text-error"
          : "text-text-secondary hover:text-error",
        className
      )}
    >
      <Heart
        size={size === "sm" ? 16 : 20}
        className={clsx(
          "transition-all duration-150",
          active ? "fill-error" : "fill-transparent"
        )}
      />
    </button>
  );
}
