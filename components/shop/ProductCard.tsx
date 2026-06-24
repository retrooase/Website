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

function getProductLogo(product: Product): string {
  const haystack = `${product.category} ${product.platform} ${product.title}`.toLowerCase();

  if (haystack.includes("pok")) return "/ankauf/logos/pokemon.svg";
  if (haystack.includes("playstation")) return "/ankauf/logos/playstation.svg";
  if (haystack.includes("game boy") || haystack.includes("nintendo")) return "/ankauf/logos/nintendo.svg";
  if (haystack.includes("zubeh")) return "/ankauf/logos/accessory.svg";
  if (haystack.includes("retro")) return "/ankauf/logos/retro.svg";

  return "/home/hero-controller.svg";
}

type Props = {
  product: Product;
  priority?: boolean;
};

export function ProductCard({ product, priority = false }: Props) {
  const [imgError, setImgError] = useState(false);
  const condition = CONDITION_STYLE[product.condition] ?? { dot: "bg-text-tertiary", text: "text-text-tertiary" };
  const formattedPrice = product.price.toFixed(2).replace(".", ",");
  const primaryImage = product.images[0];
  const showPlaceholder = imgError || !primaryImage || primaryImage.includes("placeholder-product");
  const productLogo = getProductLogo(product);

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group relative block overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#0b0810]/86 shadow-[0_18px_54px_rgba(0,0,0,0.36),inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-accent-orange/40 hover:shadow-[0_26px_70px_rgba(0,0,0,0.48),0_0_34px_rgba(255,95,46,0.12)]"
      aria-label={`${product.title} — ${formattedPrice} ${SITE.currencySymbol}`}
    >
      <div
        className="pointer-events-none absolute inset-x-8 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,233,168,0.82), transparent)" }}
        aria-hidden="true"
      />

      {/* Image */}
      <div
        className="relative aspect-square overflow-hidden"
        style={{
          background:
            "radial-gradient(circle at 50% 44%, rgba(255,95,46,0.16), transparent 42%), radial-gradient(circle at 68% 64%, rgba(34,211,163,0.10), transparent 44%), linear-gradient(160deg, rgba(31,28,45,0.95), rgba(10,8,15,0.95))",
        }}
      >
        {!showPlaceholder ? (
          <Image
            src={primaryImage}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            onError={() => setImgError(true)}
            priority={priority}
          />
        ) : (
          <PlaceholderImage logo={productLogo} title={product.title} />
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
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" aria-hidden="true" />
      </div>

      {/* Info */}
      <div className="p-4 sm:p-5">
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
        <div className="flex items-baseline justify-between border-t border-white/12 pt-3">
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

function PlaceholderImage({ logo, title }: { logo: string; title: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="absolute inset-8 rounded-full bg-accent-orange/10 blur-3xl" aria-hidden="true" />
      <div className="relative flex h-20 w-20 items-center justify-center rounded-[1.4rem] border border-white/10 bg-black/28 shadow-[0_18px_44px_rgba(0,0,0,0.35),0_0_28px_rgba(255,95,46,0.10)] sm:h-24 sm:w-24">
        <Image src={logo} alt="" width={58} height={58} className="h-11 w-11 sm:h-14 sm:w-14" aria-hidden="true" />
      </div>
      <span className="sr-only">{title}</span>
    </div>
  );
}
