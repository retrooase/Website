"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { clsx } from "clsx";
import type { Product } from "@/lib/types";
import { WishlistButton } from "./WishlistButton";
import { SITE } from "@/lib/constants";

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

const badgeClass: Record<string, string> = {
  NEU: "badge-new",
  SELTEN: "badge-rare",
  "TOP-ZUSTAND": "badge-top",
  SCHNÄPPCHEN: "badge-deal",
};

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block bg-surface border border-border hover:border-accent-orange hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(255,107,53,0.12)] transition-all duration-200 overflow-hidden"
      aria-label={`${product.title} — ${product.price.toFixed(2)} ${SITE.currencySymbol}`}
    >
      {/* Bild */}
      <div className="relative aspect-square bg-surface-hover overflow-hidden">
        {!imgError ? (
          <Image
            src={product.images[0] ?? "/images/placeholder-product.jpg"}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <PlaceholderImage category={product.category} />
        )}

        {/* Badge */}
        {product.badge && (
          <span
            className={clsx(
              "badge absolute top-2 left-2 z-10",
              badgeClass[product.badge] ?? "badge-new"
            )}
          >
            {product.badge}
          </span>
        )}

        {/* SOLD overlay */}
        {product.is_sold && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-20">
            <span className="font-pixel text-error" style={{ fontSize: "0.65rem" }}>
              VERKAUFT
            </span>
          </div>
        )}

        {/* Wunschliste */}
        <div className="absolute top-1 right-1 z-10">
          <WishlistButton productId={product.id} size="sm" />
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        {/* Zustand + Plattform */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span
              className={clsx(
                "inline-block w-2 h-2 rounded-none flex-shrink-0",
                conditionDot[product.condition] ?? "bg-text-secondary"
              )}
            />
            <span
              className={clsx(
                "font-sans text-xs",
                conditionColor[product.condition] ?? "text-text-secondary"
              )}
            >
              {product.condition}
            </span>
          </div>
          <span className="font-sans text-xs text-text-secondary truncate max-w-[90px] text-right">
            {product.platform}
          </span>
        </div>

        {/* Titel */}
        <h3 className="font-sans text-sm font-semibold text-text-primary leading-snug line-clamp-2">
          {product.title}
        </h3>

        {/* Preis */}
        <div className="flex items-baseline gap-2 pt-1 border-t border-border">
          <span className="font-mono text-base font-bold text-accent-orange">
            {product.price.toFixed(2).replace(".", ",")} {SITE.currencySymbol}
          </span>
          <span className="font-sans text-xs text-text-secondary">inkl. MwSt.</span>
        </div>

        {/* Trust-Micro */}
        <p className="font-sans text-xs text-text-secondary">
          <span className="text-success">✓</span> Geprüft · Versand 1–2 Tage
        </p>
      </div>
    </Link>
  );
}

function PlaceholderImage({ category }: { category: string }) {
  const icons: Record<string, string> = {
    "Game Boy": "🕹️",
    Nintendo: "🎮",
    PlayStation: "🎯",
    "Pokémon": "⚡",
    Zubehör: "🔌",
    Retro: "👾",
  };
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-surface-hover">
      <span className="text-4xl">{icons[category] ?? "🎮"}</span>
      <span className="font-pixel text-text-secondary" style={{ fontSize: "0.45rem" }}>
        {category}
      </span>
    </div>
  );
}
