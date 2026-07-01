import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Widerrufsrecht",
  description: "Widerrufsbelehrung und Muster-Widerrufsformular für Bestellungen bei RetrOase.",
  alternates: { canonical: "/widerruf" },
  robots: { index: false, follow: true },
};

export default function WiderrufPage() {
  return (
    <LegalPageLayout title="Widerrufsbelehrung" lastUpdated="[PLATZHALTER: Datum]">
      <section>
        <h2 className="font-sans font-bold text-text-primary text-base mb-2">Widerrufsrecht</h2>
        <p>
          Verbraucherinnen und Verbraucher haben das Recht, binnen vierzehn Tagen ohne Angabe von
          Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag,
          an dem du oder ein von dir benannter Dritter, der nicht der Beförderer ist, die Waren in
          Besitz genommen hat bzw. haben.
        </p>
        <p>
          Um dein Widerrufsrecht auszuüben, musst du uns
          <br />
          [PLATZHALTER: Name / Firmenname]
          <br />
          [PLATZHALTER: Anschrift]
          <br />
          E-Mail: {SITE.email}
          <br />
          mittels einer eindeutigen Erklärung (z. B. per Post versandter Brief oder E-Mail) über
          deinen Entschluss, diesen Vertrag zu widerrufen, informieren. Du kannst dafür das unten
          stehende Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.
        </p>
        <p>
          Zur Wahrung der Widerrufsfrist reicht es aus, dass du die Mitteilung über die Ausübung des
          Widerrufsrechts vor Ablauf der Widerrufsfrist absendest.
        </p>
      </section>

      <section>
        <h2 className="font-sans font-bold text-text-primary text-base mb-2">Folgen des Widerrufs</h2>
        <p>
          Wenn du diesen Vertrag widerrufst, haben wir dir alle Zahlungen, die wir von dir erhalten
          haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich
          daraus ergeben, dass du eine andere Art der Lieferung als die von uns angebotene,
          günstigste Standardlieferung gewählt hast), unverzüglich und spätestens binnen vierzehn
          Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über deinen Widerruf dieses
          Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe
          Zahlungsmittel, das du bei der ursprünglichen Transaktion eingesetzt hast, es sei denn,
          mit dir wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden dir wegen dieser
          Rückzahlung Entgelte berechnet.
        </p>
        <p>
          Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten haben oder
          bis du den Nachweis erbracht hast, dass du die Waren zurückgesandt hast, je nachdem,
          welches der frühere Zeitpunkt ist.
        </p>
        <p>
          Du hast die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen ab dem
          Tag, an dem du uns über den Widerruf dieses Vertrags unterrichtest, an uns zurückzusenden
          oder zu übergeben. Die Frist ist gewahrt, wenn du die Waren vor Ablauf der Frist von
          vierzehn Tagen absendest. Du trägst die unmittelbaren Kosten der Rücksendung der Waren.
        </p>
        <p>
          Du musst für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser Wertverlust
          auf einen zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht
          notwendigen Umgang mit ihnen zurückzuführen ist.
        </p>
      </section>

      <section>
        <h2 className="font-sans font-bold text-text-primary text-base mb-2">
          Muster-Widerrufsformular
        </h2>
        <p>(Wenn du den Vertrag widerrufen willst, fülle bitte dieses Formular aus und sende es zurück.)</p>
        <div className="border-2 border-border bg-surface p-4 font-mono text-xs text-text-primary space-y-2">
          <p>An:</p>
          <p>
            [PLATZHALTER: Name / Firmenname]
            <br />
            [PLATZHALTER: Anschrift]
            <br />
            E-Mail: {SITE.email}
          </p>
          <p>
            Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den
            Kauf der folgenden Waren (*)/die Erbringung der folgenden Dienstleistung (*)
          </p>
          <p>Bestellt am (*)/erhalten am (*):</p>
          <p>Name des/der Verbraucher(s):</p>
          <p>Anschrift des/der Verbraucher(s):</p>
          <p>Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):</p>
          <p>Datum:</p>
          <p className="text-text-tertiary">(*) Unzutreffendes streichen.</p>
        </div>
      </section>

      <section>
        <h2 className="font-sans font-bold text-text-primary text-base mb-2">
          Ausnahmen vom Widerrufsrecht
        </h2>
        <p>
          Bei versiegelter Ware, die aus Gründen des Gesundheitsschutzes oder der Hygiene nicht zur
          Rückgabe geeignet ist und deren Versiegelung nach der Lieferung entfernt wurde, sowie bei
          Waren, die nach Kundenspezifikation angefertigt wurden, besteht das Widerrufsrecht nicht.
          [PLATZHALTER: prüfen, ob für das eigene Sortiment (z. B. versiegelte Sammelkarten)
          Ausnahmen relevant sind.]
        </p>
      </section>
    </LegalPageLayout>
  );
}
