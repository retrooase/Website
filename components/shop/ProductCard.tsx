"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { WishlistButton } from "./WishlistButton";
import { SITE } from "@/lib/constants";

const CONDITION_STYLE: Record<string, { dot: string; text: string }> = {
  "Sehr Gut":  { dot: "bg-accent-teal",  text: "text-accent-teal" },
  Gut:         { dot: "bg-accent-gold",   text: "text-accent-gold" },
  Akzeptabel:  { dot: "bg-warning",       text: "text-warning" },
};

const BADGE_STYLE: Record<string, string> = {
  NEU:           "bg-accent-teal text-[#0D0B12]",
  SELTEN:        "bg-accent-gold text-[#0D0B12]",
  "TOP-ZUSTAND": "bg-accent-orange text-white",
  SCHNÄPPCHEN:   "bg-success text-[#0D0B12]",
};

type Props = {
  product: Product;
  priority?: boolean;
};

export function ProductCard({ product, priority = false }: Props) {
  const [imgError, setImgError] = useState(false);
  const condition = CONDITION_STYLE[product.condition] ?? { dot: "bg-text-tertiary", text: "text-text-tertiary" };
  const formattedPrice = product.price.toFixed(2).replace(".", ",");

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block bg-surface border border-border rounded-2xl overflow-hidden hover:border-border-strong hover:-translate-y-0.5 hover:shadow-hover transition-all duration-300"
      aria-label={`${product.title} — ${formattedPrice} ${SITE.currencySymbol}`}
    >
      {/* Image */}
      <div className="relative aspect-square bg-surface-hover overflow-hidden rounded-t-2xl">
        {!imgError ? (
          <Image
            src={product.images[0] ?? "/images/placeholder-product.jpg"}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            onError={() => setImgError(true)}
            priority={priority}
          />
        ) : (
          <PlaceholderImage category={product.category} />
        )}

        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute top-2.5 left-2.5 z-10 font-sans text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${BADGE_STYLE[product.badge] ?? "bg-accent-orange text-white"}`}
          >
            {product.badge}
          </span>
        )}

        {/* SOLD overlay */}
        {product.is_sold && (
          <div className="absolute inset-0 bg-background/85 flex items-center justify-center z-20 backdrop-blur-sm">
            <span className="font-display font-bold text-sm text-error tracking-widest">
              VERKAUFT
            </span>
          </div>
        )}

        {/* Wishlist */}
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <WishlistButton productId={product.id} size="sm" />
        </div>

        {/* Bottom accent line on hover */}
        <div
          className="absolute inset-x-0 bottom-0 h-0.5 bg-accent-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_8px_rgba(255,95,46,0.6)]"
          aria-hidden="true"
        />
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Platform + condition */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${condition.dot}`} aria-hidden="true" />
            <span className={`font-sans text-[0.68rem] font-medium ${condition.text}`}>
              {product.condition}
            </span>
          </div>
          <span className="font-sans text-[0.65rem] text-text-tertiary truncate max-w-[80px] text-right">
            {product.platform}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-sans text-sm font-semibold text-text-primary leading-snug line-clamp-2 mb-3 group-hover:text-accent-orange transition-colors duration-200">
          {product.title}
        </h3>

        {/* Price */}
        <div className="flex items-baseline justify-between border-t border-border/60 pt-3">
          <span className="font-display font-bold text-accent-orange leading-none text-lg">
            {formattedPrice} {SITE.currencySymbol}
          </span>
          <span className="font-sans text-[0.62rem] text-text-tertiary">
            inkl. MwSt.
          </span>
        </div>

        <p className="font-sans text-[0.65rem] text-text-tertiary mt-2">
          <span className="text-accent-teal">✓</span> Geprüft · Versand 1–2 Tage
        </p>
      </div>
    </Link>
  );
}

function PlaceholderImage({ category }: { category: string }) {
  const icons: Record<string, string> = {
    "Game Boy":  "🕹️",
    Nintendo:    "🎮",
    PlayStation: "🎯",
    "Pokémon":   "⚡",
    Zubehör:     "🔌",
    Retro:       "👾",
  };
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-surface-hover">
      <span className="text-4xl opacity-50">{icons[category] ?? "🎮"}</span>
    </div>
  );
}
