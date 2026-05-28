import { Check } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { type WizardData, type WizardErrors } from "./types";

const SELL_TYPE_LABELS: Record<string, string> = {
  einzeln: "🎮 Einzelnes Produkt",
  mehrere: "📦 Mehrere Produkte",
  sammlung: "🗃️ Ganze Sammlung",
  defekt: "🔧 Defektes Gerät",
  pokemon: "⚡ Pokémon & Karten",
  zubehoer: "🔌 Zubehör & Controller",
};

function SummaryRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-3 py-2.5 border-b border-border last:border-0">
      <span className="font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary w-32 flex-shrink-0 pt-0.5">
        {label}
      </span>
      <span className="font-sans text-sm text-text-primary break-words flex-1">
        {value}
      </span>
    </div>
  );
}

function CheckboxField({
  id,
  checked,
  onChange,
  error,
  children,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-start gap-3 cursor-pointer group"
      >
        <div
          className={`w-5 h-5 border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
            checked
              ? "bg-accent-orange border-accent-orange"
              : "border-border group-hover:border-accent-orange/60"
          }`}
        >
          {checked && <Check size={11} className="text-background" />}
        </div>
        <span className="font-sans text-sm text-text-secondary leading-relaxed">
          {children}
        </span>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
      </label>
      {error && (
        <p className="font-sans text-xs text-red-500 mt-1 ml-8">{error}</p>
      )}
    </div>
  );
}

export function WizardStep5Summary({
  data,
  errors,
  onChange,
}: {
  data: WizardData;
  errors: WizardErrors;
  onChange: (field: "acceptTerms" | "acceptPrivacy", value: boolean) => void;
}) {
  const categoryLabel =
    CATEGORIES.find((c) => c.label === data.category)?.label ?? data.category;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-sans font-bold text-text-primary text-lg mb-1">
          Alles korrekt?
        </h3>
        <p className="font-sans text-sm text-text-secondary">
          Prüfe deine Angaben bevor du die Anfrage abschickst.
        </p>
      </div>

      {/* Summary cards */}
      <div className="space-y-4">
        {/* Verkaufstyp */}
        <div className="border border-border bg-surface p-4">
          <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-accent-orange mb-2">
            Verkaufstyp
          </p>
          <p className="font-sans text-sm font-semibold text-text-primary">
            {data.sellType ? SELL_TYPE_LABELS[data.sellType] : "—"}
          </p>
        </div>

        {/* Kontakt */}
        <div className="border border-border bg-surface p-4">
          <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-accent-orange mb-2">
            Kontakt
          </p>
          <SummaryRow label="Name" value={data.name} />
          <SummaryRow label="E-Mail" value={data.email} />
          <SummaryRow label="Telefon" value={data.phone} />
          <SummaryRow label="PLZ" value={data.plz} />
        </div>

        {/* Produkt */}
        <div className="border border-border bg-surface p-4">
          <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-accent-orange mb-2">
            Produkt
          </p>
          <SummaryRow label="Produkt" value={data.productName} />
          <SummaryRow label="Kategorie" value={categoryLabel} />
          <SummaryRow label="Plattform" value={data.platform} />
          <SummaryRow label="Zustand" value={data.condition} />
          <SummaryRow label="Vollständigkeit" value={data.completeness} />
          <SummaryRow label="Menge" value={data.quantity !== "1" ? data.quantity : ""} />
          <SummaryRow
            label="Wunschpreis"
            value={data.desiredPrice ? `${data.desiredPrice} €` : ""}
          />
          <SummaryRow label="Beschreibung" value={data.description} />
        </div>

        {/* Fotos */}
        <div className="border border-border bg-surface p-4">
          <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-accent-orange mb-2">
            Fotos
          </p>
          <p className="font-sans text-sm text-text-primary">
            {data.photos.length === 0
              ? "Keine Fotos hinzugefügt"
              : `${data.photos.length} ${data.photos.length === 1 ? "Foto" : "Fotos"} ausgewählt`}
          </p>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-4 pt-2">
        <CheckboxField
          id="wz-terms"
          checked={data.acceptTerms}
          onChange={(v) => onChange("acceptTerms", v)}
          error={errors.acceptTerms}
        >
          Ich möchte eine{" "}
          <strong className="text-text-primary font-semibold">
            unverbindliche Anfrage
          </strong>{" "}
          stellen. Es entsteht kein Kaufzwang. Ich kann das Angebot ablehnen.
        </CheckboxField>

        <CheckboxField
          id="wz-privacy"
          checked={data.acceptPrivacy}
          onChange={(v) => onChange("acceptPrivacy", v)}
          error={errors.acceptPrivacy}
        >
          Ich habe die{" "}
          <a
            href="/datenschutz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-orange hover:underline font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            Datenschutzerklärung
          </a>{" "}
          gelesen und akzeptiere sie.
        </CheckboxField>
      </div>
    </div>
  );
}
