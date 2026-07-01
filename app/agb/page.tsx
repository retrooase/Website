import type { Metadata } from "next";
import { SITE, SHIPPING_INFO } from "@/lib/constants";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "AGB",
  description: "Allgemeine Geschäftsbedingungen (AGB) von RetrOase für Bestellungen im Online-Shop.",
  alternates: { canonical: "/agb" },
  robots: { index: false, follow: true },
};

export default function AgbPage() {
  return (
    <LegalPageLayout title="Allgemeine Geschäftsbedingungen" lastUpdated="[PLATZHALTER: Datum]">
      <section>
        <h2 className="font-sans font-bold text-text-primary text-base mb-2">§ 1 Geltungsbereich</h2>
        <p>
          Diese AGB gelten für alle Bestellungen, die Verbraucher und Unternehmer über den
          Online-Shop {SITE.domain} bei [PLATZHALTER: Name / Firmenname] abschließen.
        </p>
      </section>

      <section>
        <h2 className="font-sans font-bold text-text-primary text-base mb-2">
          § 2 Vertragspartner &amp; Vertragsschluss
        </h2>
        <p>
          Der Kaufvertrag kommt zustande mit [PLATZHALTER: Name / Firmenname], [PLATZHALTER:
          Anschrift]. Die Darstellung der Produkte im Shop stellt kein rechtlich bindendes Angebot
          dar, sondern eine unverbindliche Aufforderung zur Bestellung. Mit Anklicken des
          Bestellbuttons gibst du ein verbindliches Angebot zum Kauf ab. Der Vertrag kommt durch
          unsere Bestätigung (z. B. per E-Mail) oder durch Lieferung der Ware zustande.
        </p>
      </section>

      <section>
        <h2 className="font-sans font-bold text-text-primary text-base mb-2">§ 3 Zustand der Ware</h2>
        <p>
          Bei RetrOase handelt es sich, sofern nicht anders gekennzeichnet, um geprüfte
          Secondhand-Ware. Der Zustand jedes Artikels (z.&nbsp;B. „Sehr Gut&ldquo;, „Gut&ldquo;, „Akzeptabel&ldquo;)
          wird in der Produktbeschreibung angegeben. Optische Gebrauchsspuren, die dem angegebenen
          Zustand entsprechen, stellen keinen Sachmangel dar.
        </p>
      </section>

      <section>
        <h2 className="font-sans font-bold text-text-primary text-base mb-2">
          § 4 Preise &amp; Versandkosten
        </h2>
        <p>
          Alle angegebenen Preise sind Endpreise und enthalten die gesetzliche Umsatzsteuer, sofern
          diese ausgewiesen wird. Es gelten die zum Zeitpunkt der Bestellung im Shop angezeigten
          Versandkosten. Ab einem Bestellwert von {SHIPPING_INFO.freeShippingAbove} {SITE.currencySymbol}{" "}
          versenden wir innerhalb Deutschlands kostenfrei. Die Lieferzeit beträgt in der Regel{" "}
          {SHIPPING_INFO.daysMin}–{SHIPPING_INFO.daysMax} Werktage. [PLATZHALTER: Angaben zu
          internationalem Versand ergänzen, falls angeboten.]
        </p>
      </section>

      <section>
        <h2 className="font-sans font-bold text-text-primary text-base mb-2">§ 5 Zahlungsarten</h2>
        <p>
          Die Zahlung erfolgt über die im Checkout angezeigten Zahlungsarten, abgewickelt über
          unseren Zahlungsdienstleister Stripe. [PLATZHALTER: konkrete Zahlungsarten auflisten, z. B.
          Kreditkarte, PayPal, Klarna, SEPA-Lastschrift.]
        </p>
      </section>

      <section>
        <h2 className="font-sans font-bold text-text-primary text-base mb-2">§ 6 Eigentumsvorbehalt</h2>
        <p>Die gelieferte Ware bleibt bis zur vollständigen Bezahlung unser Eigentum.</p>
      </section>

      <section>
        <h2 className="font-sans font-bold text-text-primary text-base mb-2">
          § 7 Gewährleistung
        </h2>
        <p>
          Es gilt das gesetzliche Mängelhaftungsrecht. Bei Verkäufen an Verbraucher gilt bei
          gebrauchter Ware eine verkürzte Verjährungsfrist für Mängelansprüche von einem Jahr ab
          Ablieferung der Ware, sofern der Mangel nicht arglistig verschwiegen wurde. [PLATZHALTER:
          juristisch prüfen lassen, insbesondere im Hinblick auf aktuelle Rechtsprechung zu
          verkürzten Gewährleistungsfristen bei Gebrauchtware.]
        </p>
      </section>

      <section>
        <h2 className="font-sans font-bold text-text-primary text-base mb-2">§ 8 Widerrufsrecht</h2>
        <p>
          Für Verbraucher gilt ein gesetzliches Widerrufsrecht. Einzelheiten findest du in unserer{" "}
          <a href="/widerruf" className="text-accent-orange hover:underline">
            Widerrufsbelehrung
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="font-sans font-bold text-text-primary text-base mb-2">§ 9 Schlussbestimmungen</h2>
        <p>
          Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. Sollte
          eine Bestimmung dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen
          unberührt.
        </p>
      </section>
    </LegalPageLayout>
  );
}
