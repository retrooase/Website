"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, CheckCircle2, Package, ShieldCheck, Sparkles, Truck, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
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
  "Du entscheidest am Ende",
];

const HOW_STEPS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Package, title: "Zusammenstellen", text: "Such dein Gerät, Spiel oder deine ganze Sammlung." },
  { icon: Sparkles, title: "Wert sehen", text: "Enthülle sofort deinen fairen Richtwert." },
  { icon: Truck, title: "Kostenlos einsenden", text: "Gratis Versandlabel nach deiner Freigabe." },
  { icon: Wallet, title: "Geld kassieren", text: "Aufs Konto – oder als Guthaben mit Bonus." },
];

const PROOF_ITEMS: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: ShieldCheck,
    title: "Fair & geprüft",
    text: "Die Schätzung ist ein Richtwert. Dein finales Angebot kommt nach kurzer Prüfung.",
  },
  {
    icon: Truck,
    title: "Versand geht aufs Haus",
    text: "Nach deiner Freigabe schicken wir dir ein kostenloses Versandlabel.",
  },
  {
    icon: Wallet,
    title: "Du entscheidest",
    text: "Auszahlung aufs Konto – oder als Guthaben mit Extra-Bonus.",
  },
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
            <span className="ak-chip">
              <Sparkles size={14} />
              RetrOase Ankauf
            </span>
            <h1 className="ak-display">Mach dein altes Gaming zu Geld.</h1>
            <p>
              Konsole, Spiel oder ganze Sammlung – schätz den Wert in unter einer Minute,
              sende kostenlos ein und lass dich auszahlen. Du entscheidest am Ende.
            </p>
            <ul className="ak-funnel-v3-trust" aria-label="Vorteile">
              {TRUST_ITEMS.map((item) => (
                <li key={item}>
                  <CheckCircle2 size={15} />
                  {item}
                </li>
              ))}
            </ul>
          </header>

          <ol className="ak-funnel-v3-how" aria-label="So funktioniert's">
            {HOW_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={step.title}>
                  <span className="ak-funnel-v3-how-icon">
                    <Icon size={20} />
                    <i aria-hidden="true">{index + 1}</i>
                  </span>
                  <strong>{step.title}</strong>
                  <span>{step.text}</span>
                </li>
              );
            })}
          </ol>

          <div className="ak-funnel-v3-tool">
            <AnkaufPriceToolV2
              catalog={priceCatalog}
              offerCtaLabel="Schätzung passt – Ankauf starten"
              onOfferStart={startCheckout}
              requireRevealBeforeOffer
            />
          </div>

          <aside className="ak-funnel-v3-proof" aria-label="Gut zu wissen">
            {PROOF_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title}>
                  <Icon size={18} />
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </div>
              );
            })}
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
