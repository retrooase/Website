import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { AnkaufHero } from "@/components/ankauf/AnkaufHero";
import { AnkaufCategories } from "@/components/ankauf/AnkaufCategories";
import { AnkaufPriceWidget } from "@/components/ankauf/AnkaufPriceWidget";
import { AnkaufBarcodeCard } from "@/components/ankauf/AnkaufBarcodeCard";
import { AnkaufProcess } from "@/components/ankauf/AnkaufProcess";
import { AnkaufTrust } from "@/components/ankauf/AnkaufTrust";
import { AnkaufFAQ } from "@/components/ankauf/AnkaufFAQ";
import { AnkaufWizard } from "@/components/ankauf/wizard/AnkaufWizard";

export const metadata: Metadata = {
  title: "Ankauf — Retro-Gear verkaufen | RetrOase",
  description:
    "Verkauf deine Konsolen, Spiele, Pokémon-Karten und ganze Sammlungen. Faire Preise, schnelle Auszahlung, kostenloses Versandlabel — direkt aus Deutschland.",
};

export default function AnkaufPage() {
  return (
    <>
      {/* 1. Hero */}
      <AnkaufHero />

      {/* 2. Was möchtest du verkaufen? */}
      <AnkaufCategories />

      {/* 3. Preisschätzer + Barcode Scanner */}
      <section
        className="py-20 sm:py-28 bg-surface scroll-fade"
        id="preisschaetzer"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-accent-orange mb-3">
              Tools
            </p>
            <h2
              className="font-sans font-bold text-text-primary"
              style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)" }}
            >
              Preis schätzen & Produkt erkennen
            </h2>
            <p className="font-sans text-sm text-text-secondary mt-2 max-w-lg mx-auto">
              Nutze den Preisschätzer für einen Richtwert — oder scann direkt den Barcode
              deines Produkts.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
            <AnkaufPriceWidget />
            <AnkaufBarcodeCard />
          </div>
        </div>
      </section>

      {/* 4. Ablauf in 3 Schritten */}
      <AnkaufProcess />

      {/* 5. Vertrauensbereich */}
      <AnkaufTrust />

      {/* 6. FAQ */}
      <AnkaufFAQ />

      {/* 7. Ankauf-Wizard */}
      <section
        className="py-20 sm:py-28 bg-surface scroll-fade"
        id="angebot"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-accent-orange mb-3">
              Angebot anfragen
            </p>
            <h2
              className="font-sans font-bold text-text-primary leading-tight"
              style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)" }}
            >
              Einfach anfragen, kein Risiko.
            </h2>
            <p className="font-sans text-sm text-text-secondary mt-2 max-w-lg mx-auto">
              In 5 kurzen Schritten zur unverbindlichen Anfrage.
              Kein Druck — du entscheidest ob du annimmst.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <AnkaufWizard />
          </div>

          <div className="max-w-2xl mx-auto mt-6">
            <div className="border border-border bg-background p-5">
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary mb-1">
                Lieber direkt?
              </p>
              <p className="font-sans text-sm text-text-secondary">
                Schreib uns direkt an{" "}
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-accent-orange hover:underline font-medium"
                >
                  {SITE.email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
