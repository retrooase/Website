import type { Metadata } from "next";
import { Suspense } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { TickerBar } from "@/components/home/TickerBar";
import { TrustBadges } from "@/components/home/TrustBadges";
import { BasementFomo } from "@/components/home/BasementFomo";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { AnkaufTeaser } from "@/components/home/AnkaufTeaser";
import { PriceEstimator } from "@/components/home/PriceEstimator";
import { BlogPreview } from "@/components/home/BlogPreview";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "RetrOase — Wo Gaming-Träume wahr werden.",
  description:
    "Retro-Gaming Shop aus Deutschland. Geprüfte Secondhand-Konsolen, Spiele, Zubehör und Pokémon-Karten. Nintendo, Game Boy, PlayStation und mehr.",
};

function FeaturedSkeleton() {
  return (
    <section className="py-20 sm:py-28 bg-background">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-5 w-40 bg-surface-hover animate-pulse rounded-full mb-14" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-surface border border-border rounded-2xl overflow-hidden">
              <div className="aspect-square bg-surface-hover animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-2 bg-surface-hover animate-pulse rounded-full w-3/4" />
                <div className="h-2 bg-surface-hover animate-pulse rounded-full w-full" />
                <div className="h-4 bg-surface-hover animate-pulse rounded-full w-1/3 mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TickerBar />
      <TrustBadges />
      <BasementFomo />
      <Suspense fallback={<FeaturedSkeleton />}>
        <FeaturedProducts />
      </Suspense>
      <CategoriesGrid />
      <AnkaufTeaser />
      <PriceEstimator />
      <BlogPreview />
      <NewsletterSignup />
    </>
  );
}
