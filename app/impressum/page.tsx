import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum und Anbieterkennzeichnung gemäß § 5 TMG für RetrOase.",
  alternates: { canonical: "/impressum" },
  // Platzhalter-Inhalt -> bis zur Vervollständigung nicht indexieren
  robots: { index: false, follow: true },
};

export default function ImpressumPage() {
  return (
    <LegalPageLayout title="Impressum" lastUpdated="[PLATZHALTER: Datum]">
      <section>
        <h2 className="font-sans font-bold text-text-primary text-base mb-2">Angaben gemäß § 5 TMG</h2>
        <p>
          [PLATZHALTER: Vollständiger Name / Firmenname]
          <br />
          [PLATZHALTER: Straße, Hausnummer]
          <br />
          [PLATZHALTER: PLZ, Ort]
          <br />
          [PLATZHALTER: Land]
        </p>
      </section>

      <section>
        <h2 className="font-sans font-bold text-text-primary text-base mb-2">Kontakt</h2>
        <p>
          E-Mail: {SITE.email}
          <br />
          Telefon: [PLATZHALTER: Telefonnummer, falls veröffentlicht]
        </p>
      </section>

      <section>
        <h2 className="font-sans font-bold text-text-primary text-base mb-2">Umsatzsteuer-ID</h2>
        <p>
          Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
          <br />
          [PLATZHALTER: USt-IdNr. oder „Kleinunternehmer gemäß § 19 UStG — keine Umsatzsteuer wird
          ausgewiesen&ldquo;]
        </p>
      </section>

      <section>
        <h2 className="font-sans font-bold text-text-primary text-base mb-2">Handelsregister</h2>
        <p>
          [PLATZHALTER: Falls im Handelsregister eingetragen: Registergericht und Registernummer.
          Bei Einzelunternehmen ohne Eintragung kann dieser Abschnitt entfallen.]
        </p>
      </section>

      <section>
        <h2 className="font-sans font-bold text-text-primary text-base mb-2">
          Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
        </h2>
        <p>[PLATZHALTER: Name und Anschrift der verantwortlichen Person, z. B. für Blog-Inhalte]</p>
      </section>

      <section>
        <h2 className="font-sans font-bold text-text-primary text-base mb-2">EU-Streitschlichtung</h2>
        <p>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
          <a
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-orange hover:underline"
          >
            https://ec.europa.eu/consumers/odr/
          </a>
          . Unsere E-Mail-Adresse finden Sie oben unter „Kontakt&ldquo;. Wir sind nicht bereit oder
          verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen. [PLATZHALTER: ggf. anpassen, falls Teilnahmebereitschaft besteht]
        </p>
      </section>
    </LegalPageLayout>
  );
}
