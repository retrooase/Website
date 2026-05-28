import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { TickerBar } from "@/components/home/TickerBar";
import { TrustBadges } from "@/components/home/TrustBadges";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { AnkaufTeaser } from "@/components/home/AnkaufTeaser";
import { PriceEstimator } from "@/components/home/PriceEstimator";
import { BlogPreview } from "@/components/home/BlogPreview";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";

export const metadata: Metadata = {
  title: "RetrOase — Wo Gaming-Träume wahr werden.",
  description:
    "Retro-Gaming Shop aus Deutschland. Geprüfte Secondhand-Konsolen, Spiele, Zubehör und Pokémon-Karten. Nintendo, Game Boy, PlayStation und mehr.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TickerBar />
      <TrustBadges />
      <FeaturedProducts />
      <CategoriesGrid />
      <AnkaufTeaser />
      <PriceEstimator />
      <BlogPreview />
      <NewsletterSignup />
    </>
  );
}
