"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, CheckCircle2, Lock, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { AnkaufPriceToolV2 } from "@/components/ankauf/v2/price/AnkaufPriceToolV2";
import type { PriceCatalogData } from "@/components/ankauf/v2/price/priceCatalog";
import { AnkaufWizardV2 } from "@/components/ankauf/v2/wizard/AnkaufWizardV2";

type FunnelPhase = "estimate" | "checkout";

type AnkaufFunnelV3Props = {
  priceCatalog: PriceCatalogData;
};

const TRUST_ITEMS = [
  "Kostenlos & unverbindlich",
  "Antwort in 24 h",
  "Versandlabel nach Freigabe",
  "Du entscheidest am Ende",
];

export function AnkaufFunnelV3({ priceCatalog }: AnkaufFunnelV3Props) {
  const [phase, setPhase] = useState<FunnelPhase>("estimate");
  const checkoutRef = useRef<HTMLElement>(null);
  const estimateRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.location.hash === "#angebot") {
      setPhase("checkout");
      window.setTimeout(() => {
        checkoutRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  }, []);

  function startCheckout() {
    setPhase("checkout");
    window.history.replaceState(null, "", "#angebot");
    window.setTimeout(() => {
      checkoutRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 40);
  }

  function backToEstimate() {
    setPhase("estimate");
    window.history.replaceState(null, "", "#preisschaetzer");
    window.setTimeout(() => {
      estimateRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 40);
  }

  return (
    <main className="ak-stage ak-funnel-v3" data-phase={phase}>
      <section ref={estimateRef} id="preisschaetzer" className="ak-funnel-v3-screen">
        <div className="ak-funnel-v3-shell">
          <header className="ak-funnel-v3-hero">
            <div>
              <span className="ak-chip">
                <Sparkles size={14} />
                Ankauf-Automat
              </span>
              <h1 className="ak-display">Was ist dein Retro-Gear wert?</h1>
              <p>
                Stell dein Paket zusammen, enthulle den Richtwert und starte danach direkt
                die unverbindliche Ankauf-Anfrage.
              </p>
            </div>

            <div className="ak-funnel-v3-progress" aria-label="Ablauf">
              <span className={phase === "estimate" ? "is-active" : "is-done"}>
                <i>1</i>
                Schatzen
              </span>
              <b />
              <span className={phase === "checkout" ? "is-active" : ""}>
                <i>2</i>
                Anfrage
              </span>
            </div>
          </header>

          <div className="ak-funnel-v3-trust" aria-label="Vorteile">
            {TRUST_ITEMS.map((item) => (
              <span key={item}>
                <CheckCircle2 size={15} />
                {item}
              </span>
            ))}
          </div>

          <div className="ak-funnel-v3-tool">
            <AnkaufPriceToolV2
              catalog={priceCatalog}
              offerCtaLabel="Schatzung passt - Ankauf starten"
              onOfferStart={startCheckout}
              requireRevealBeforeOffer
            />
          </div>

          <aside className="ak-funnel-v3-proof" aria-label="Kurzinfo">
            <div>
              <ShieldCheck size={18} />
              <strong>Fair gepruft</strong>
              <span>Die Schätzung ist ein Richtwert. Das finale Angebot kommt nach kurzer Prufung.</span>
            </div>
            <div>
              <Zap size={18} />
              <strong>Kein Formular-Marathon</strong>
              <span>Erst Wert sehen, dann nur noch die Details erganzen, die wir wirklich brauchen.</span>
            </div>
            <div>
              <Lock size={18} />
              <strong>Fokus-Modus</strong>
              <span>Nach dem Start verschwindet alles Unwichtige. Nur dein Paket und die Anfrage.</span>
            </div>
          </aside>
        </div>
      </section>

      {phase === "checkout" && (
        <section ref={checkoutRef} id="angebot" className="ak-funnel-v3-screen ak-funnel-v3-checkout">
          <div className="ak-funnel-v3-shell">
            <div className="ak-funnel-v3-checkout-head">
              <button type="button" onClick={backToEstimate}>
                <ArrowLeft size={16} />
                Schätzung bearbeiten
              </button>
              <span>Fokus-Modus</span>
            </div>

            <div className="ak-wizard-v2-heading ak-funnel-v3-wizard-heading">
              <p className="ak-eyebrow">Ankauf starten</p>
              <h2 className="ak-display ak-h2">Jetzt nur noch Details.</h2>
              <p>
                Dein Paket wurde aus dem Schatzer ubernommen. Prufe kurz Zustand,
                Zubehor, Fotos und Kontakt, dann schicken wir dir dein finales Angebot.
              </p>
            </div>

            <AnkaufWizardV2
              storeCreditBonus={priceCatalog.storeCreditBonus}
              variants={priceCatalog.variants}
            />
          </div>
        </section>
      )}
    </main>
  );
}
