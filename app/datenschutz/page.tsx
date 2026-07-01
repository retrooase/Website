import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Datenschutzerklärung gemäß DSGVO für RetrOase — Informationen zur Verarbeitung deiner Daten.",
  alternates: { canonical: "/datenschutz" },
  robots: { index: false, follow: true },
};

export default function DatenschutzPage() {
  return (
    <LegalPageLayout title="Datenschutzerklärung" lastUpdated="[PLATZHALTER: Datum]">
      <section>
        <h2 className="font-sans font-bold text-text-primary text-base mb-2">1. Verantwortlicher</h2>
        <p>
          Verantwortlich für die Datenverarbeitung auf dieser Website ist:
          <br />
          [PLATZHALTER: Vollständiger Name / Firmenname, Anschrift]
          <br />
          E-Mail: {SITE.email}
        </p>
      </section>

      <section>
        <h2 className="font-sans font-bold text-text-primary text-base mb-2">2. Hosting</h2>
        <p>
          Diese Website wird bei Vercel Inc. gehostet. Beim Aufruf der Website werden automatisch
          technische Zugriffsdaten (z. B. IP-Adresse, Zeitpunkt des Zugriffs, aufgerufene Seite) in
          Server-Logs verarbeitet, soweit dies für den technischen Betrieb erforderlich ist
          (Art. 6 Abs. 1 lit. f DSGVO).
        </p>
      </section>

      <section>
        <h2 className="font-sans font-bold text-text-primary text-base mb-2">
          3. Konto, Bestellungen &amp; Datenbank
        </h2>
        <p>
          Für Nutzerkonten, Wunschlisten, Preis-Alerts und die Verwaltung von Produkten und
          Bestellungen nutzen wir Supabase als Datenbank- und Authentifizierungsdienst. Bei einer
          Registrierung verarbeiten wir die von dir angegebenen Daten (z. B. E-Mail-Adresse) zur
          Bereitstellung deines Kundenkontos (Art. 6 Abs. 1 lit. b DSGVO).
        </p>
      </section>

      <section>
        <h2 className="font-sans font-bold text-text-primary text-base mb-2">4. Zahlungsabwicklung</h2>
        <p>
          Zahlungen werden über den Zahlungsdienstleister Stripe abgewickelt. Dabei werden die für
          die Zahlungsabwicklung notwendigen Daten (z. B. Zahlungsart, Betrag, Bestelldaten) an
          Stripe übermittelt (Art. 6 Abs. 1 lit. b DSGVO). Stripe verarbeitet Zahlungsdaten nach
          eigenen Datenschutzbestimmungen.
        </p>
      </section>

      <section>
        <h2 className="font-sans font-bold text-text-primary text-base mb-2">5. E-Mail-Versand</h2>
        <p>
          Für den Versand von Bestell-, Ankauf- und Newsletter-E-Mails nutzen wir den Dienst Resend.
          Dabei werden E-Mail-Adresse und Nachrichteninhalt verarbeitet, um dich zu kontaktieren
          (Art. 6 Abs. 1 lit. b bzw. lit. a DSGVO bei Newsletter-Anmeldung).
        </p>
      </section>

      <section>
        <h2 className="font-sans font-bold text-text-primary text-base mb-2">6. Newsletter</h2>
        <p>
          Wenn du dich für unseren Newsletter anmeldest, verwenden wir deine E-Mail-Adresse, um dir
          Angebote und Neuigkeiten zuzusenden. Die Anmeldung erfolgt auf Grundlage deiner
          Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Du kannst diese Einwilligung jederzeit über den
          Abmeldelink in jeder E-Mail oder per Nachricht an {SITE.email} widerrufen.
        </p>
      </section>

      <section>
        <h2 className="font-sans font-bold text-text-primary text-base mb-2">
          7. Cookies, LocalStorage &amp; Analyse
        </h2>
        <p>
          Wir verwenden technisch notwendige LocalStorage-Einträge (z. B. für Warenkorb, Wunschliste
          und deine Cookie-Einwilligung), damit die Website funktioniert (Art. 6 Abs. 1 lit. f
          DSGVO).
        </p>
        <p>
          Zur anonymisierten, aggregierten Reichweiten- und Performance-Messung nutzen wir Vercel
          Analytics und Vercel Speed Insights. Diese Dienste sind standardmäßig darauf ausgelegt,
          ohne Tracking-Cookies auszukommen und erstellen keine personenbezogenen Nutzerprofile.
          [PLATZHALTER: Falls zusätzliche Analyse-/Marketing-Tools wie Google Analytics oder
          Meta Pixel eingebunden werden, hier ergänzen und Consent-Steuerung entsprechend
          erweitern.]
        </p>
      </section>

      <section>
        <h2 className="font-sans font-bold text-text-primary text-base mb-2">8. Speicherdauer</h2>
        <p>
          Wir speichern personenbezogene Daten nur so lange, wie es für die genannten Zwecke
          erforderlich ist oder gesetzliche Aufbewahrungspflichten (z. B. handels- und
          steuerrechtliche Vorgaben) bestehen. [PLATZHALTER: konkrete Aufbewahrungsfristen
          ergänzen.]
        </p>
      </section>

      <section>
        <h2 className="font-sans font-bold text-text-primary text-base mb-2">9. Deine Rechte</h2>
        <p>
          Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
          Datenübertragbarkeit sowie Widerspruch gegen die Verarbeitung deiner Daten. Wende dich
          dazu an {SITE.email}. Außerdem hast du das Recht, dich bei einer
          Datenschutz-Aufsichtsbehörde zu beschweren.
        </p>
      </section>
    </LegalPageLayout>
  );
}
