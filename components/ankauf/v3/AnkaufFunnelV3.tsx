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

const FUNNEL_STATS = [
  { value: "4,9/5", label: "Bewertung" },
  { value: "2.400+", label: "Faire Ankäufe" },
  { value: "24 h", label: "Antwortzeit" },
  { value: "0 €", label: "Versand n. Freigabe" },
];

const FUNNEL_REVIEWS = [
  {
    text: "Nicht das übliche Feilschen. Transparent, freundlich und sehr unkompliziert.",
    name: "Sabrina T.",
  },
  {
    text: "Schnelle Antwort, fairer Preis und die Auszahlung war direkt da.",
    name: "Marcel K.",
  },
  {
    text: "Ich hatte keine Ahnung, was meine Sachen wert sind. RetrOase hat alles erklärt.",
    name: "Lea M.",
  },
];

const FUNNEL_FAQ = [
  {
    q: "Wie läuft die Auszahlung?",
    a: "Nach kurzer Prüfung deines Pakets bekommst du ein finales Angebot. Du wählst dann zwischen Sofort-Auszahlung und RetrOase-Guthaben mit Bonus.",
  },
  {
    q: "Was, wenn ich nicht einverstanden bin?",
    a: "Alles unverbindlich. Passt das Angebot nicht, schicken wir dir dein Paket kostenlos zurück.",
  },
  {
    q: "Was kostet der Versand?",
    a: "Nach deiner Freigabe bekommst du ein kostenloses Versandlabel – für dich entstehen keine Versandkosten.",
  },
  {
    q: "Wie schnell geht das?",
    a: "In der Regel meldet sich unser Retro-Team innerhalb von 24 Stunden mit der nächsten Info.",
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

          <div className="ak-funnel-v3-stats" aria-label="Zahlen und Fakten">
            {FUNNEL_STATS.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>

          <section className="ak-funnel-v3-social" aria-label="Bewertungen">
            <header>
              <span className="ak-funnel-v3-stars" aria-hidden="true">★★★★★</span>
              <strong>Das sagen Verkäufer über uns</strong>
            </header>
            <div className="ak-funnel-v3-reviews">
              {FUNNEL_REVIEWS.map((review) => (
                <figure key={review.name}>
                  <span className="ak-funnel-v3-stars" aria-label="5 von 5 Sternen">★★★★★</span>
                  <blockquote>{review.text}</blockquote>
                  <figcaption>{review.name}</figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section className="ak-funnel-v3-faq" aria-label="Häufige Fragen">
            <strong>Häufige Fragen</strong>
            {FUNNEL_FAQ.map((entry) => (
              <details key={entry.q}>
                <summary>{entry.q}</summary>
                <p>{entry.a}</p>
              </details>
            ))}
          </section>
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
