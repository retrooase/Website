import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { AnkaufHeroV2 } from "@/components/ankauf/v2/hero/AnkaufHeroV2";
import { Section1Value } from "@/components/ankauf/v2/scroll/Section1Value";
import { Section2Psychology } from "@/components/ankauf/v2/scroll/Section2Psychology";
import { Section3Ticker } from "@/components/ankauf/v2/scroll/Section3Ticker";
import { Section4Steps } from "@/components/ankauf/v2/scroll/Section4Steps";
import { Section5Trust } from "@/components/ankauf/v2/scroll/Section5Trust";
import { Section6Fomo } from "@/components/ankauf/v2/scroll/Section6Fomo";
import { AnkaufPriceToolV2 } from "@/components/ankauf/v2/price/AnkaufPriceToolV2";
import { AnkaufFAQ } from "@/components/ankauf/AnkaufFAQ";
import { AnkaufWizard } from "@/components/ankauf/wizard/AnkaufWizard";

export const metadata: Metadata = {
  title: "Ankauf - Retro-Gear verkaufen | RetrOase",
  description:
    "Verkauf deine Konsolen, Spiele, Pokémon-Karten und ganze Sammlungen. Faire Preise, schnelle Auszahlung, kostenloses Versandlabel - direkt aus Deutschland.",
};

export default function AnkaufPage() {
  return (
    <>
      {/* 1. Hero - Ankauf V2 / VAULT-Erlebnis */}
      <AnkaufHeroV2 />

      {/* 2. Was ist dein Zeug wert? */}
      <Section1Value />

      {/* 3. Psychologie-Trigger */}
      <Section2Psychology />

      {/* 4. Live-Ankauf-Ticker */}
      <Section3Ticker />

      {/* 5. So einfach geht's */}
      <Section4Steps />

      {/* 6. Preistool V2 */}
      <section
        className="ak-stage ak-tool-section scroll-fade"
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
              Preis schätzen & Paketwert sehen
            </h2>
            <p className="font-sans text-sm text-text-secondary mt-2 max-w-lg mx-auto">
              Erfasse Konsolen, Spiele, Karten und Zubehör einzeln. Der Rechner zeigt dir
              sofort den geschätzten Gesamtwert.
            </p>
          </div>

          <AnkaufPriceToolV2 />
        </div>
      </section>

      {/* 7. Vertrauen & Beweise */}
      <Section5Trust />

      {/* 8. FOMO & Dringlichkeit */}
      <Section6Fomo />

      {/* 9. FAQ */}
      <AnkaufFAQ />

      {/* 10. Ankauf-Wizard */}
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
              Kein Druck - du entscheidest ob du annimmst.
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
