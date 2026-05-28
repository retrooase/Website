import { ChevronDown } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { type WizardData, type WizardErrors, type SellType } from "./types";

type DetailFields = Pick<
  WizardData,
  | "productName"
  | "category"
  | "platform"
  | "condition"
  | "completeness"
  | "description"
  | "desiredPrice"
  | "quantity"
>;

const CONDITIONS = ["Sehr Gut", "Gut", "Akzeptabel", "Defekt"] as const;

const COMPLETENESS_OPTIONS = [
  "Vollständig (mit OVP)",
  "Ohne OVP",
  "Nur Gerät / kein Zubehör",
  "Nicht anwendbar",
] as const;

const inputClass =
  "w-full bg-surface border border-border text-text-primary placeholder:text-text-secondary px-4 py-3 font-sans text-sm outline-none focus:border-accent-orange transition-colors min-h-[44px]";
const labelClass =
  "font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2 block";
const errorClass = "font-sans text-xs text-red-500 mt-1";

function SelectField({
  id,
  label,
  required,
  value,
  onChange,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}{" "}
        {required ? (
          <span className="text-accent-orange">*</span>
        ) : (
          <span className="text-text-secondary normal-case font-normal tracking-normal">
            (optional)
          </span>
        )}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} appearance-none pr-10 cursor-pointer ${
            error ? "border-red-500" : ""
          }`}
        >
          {children}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
        />
      </div>
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
}

function getProductNamePlaceholder(sellType: SellType | null): string {
  switch (sellType) {
    case "pokemon":
      return "z.B. Pokémon Base Set 1st Edition, Pikachu Holo";
    case "sammlung":
      return "z.B. Game Boy Sammlung (20+ Spiele), Nintendo 64 Bundle";
    case "defekt":
      return "z.B. Game Boy Color (startet nicht, Display defekt)";
    default:
      return "z.B. Game Boy Color (lila), Nintendo 64, Pokémon Gelb";
  }
}

export function WizardStep3Details({
  data,
  errors,
  onChange,
  sellType,
}: {
  data: DetailFields;
  errors: WizardErrors;
  onChange: (field: keyof DetailFields, value: string) => void;
  sellType: SellType | null;
}) {
  const showPlatform = sellType !== "pokemon" && sellType !== "sammlung";

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-sans font-bold text-text-primary text-lg mb-1">
          Beschreib dein Produkt
        </h3>
        <p className="font-sans text-sm text-text-secondary">
          Je mehr Details, desto präziser unser Angebot.
        </p>
      </div>

      <div className="space-y-4">
        {/* Produktname */}
        <div>
          <label htmlFor="wz-productname" className={labelClass}>
            {sellType === "sammlung" ? "Sammlung beschreiben" : "Produktname"}{" "}
            <span className="text-accent-orange">*</span>
          </label>
          <input
            id="wz-productname"
            type="text"
            value={data.productName}
            onChange={(e) => onChange("productName", e.target.value)}
            placeholder={getProductNamePlaceholder(sellType)}
            className={`${inputClass} ${errors.productName ? "border-red-500" : ""}`}
          />
          {errors.productName && <p className={errorClass}>{errors.productName}</p>}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Kategorie */}
          <SelectField
            id="wz-category"
            label="Kategorie"
            value={data.category}
            onChange={(v) => onChange("category", v)}
            error={errors.category}
          >
            <option value="">— Kategorie wählen —</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.label} className="bg-surface">
                {cat.icon} {cat.label}
              </option>
            ))}
          </SelectField>

          {/* Plattform/Modell (hide for Pokémon and Sammlung) */}
          {showPlatform ? (
            <div>
              <label htmlFor="wz-platform" className={labelClass}>
                Plattform / Modell{" "}
                <span className="text-text-secondary normal-case font-normal tracking-normal">
                  (optional)
                </span>
              </label>
              <input
                id="wz-platform"
                type="text"
                value={data.platform}
                onChange={(e) => onChange("platform", e.target.value)}
                placeholder="z.B. Game Boy Color, PS2 Slim"
                className={inputClass}
              />
            </div>
          ) : (
            <div>
              <label htmlFor="wz-quantity" className={labelClass}>
                Anzahl / Menge
              </label>
              <input
                id="wz-quantity"
                type="number"
                min="1"
                max="9999"
                value={data.quantity}
                onChange={(e) => onChange("quantity", e.target.value)}
                className={inputClass}
              />
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Zustand */}
          <SelectField
            id="wz-condition"
            label="Zustand"
            required
            value={data.condition}
            onChange={(v) => onChange("condition", v)}
            error={errors.condition}
          >
            <option value="">— Zustand wählen —</option>
            {CONDITIONS.map((c) => (
              <option key={c} value={c} className="bg-surface">
                {c}
              </option>
            ))}
          </SelectField>

          {/* Vollständigkeit */}
          <SelectField
            id="wz-completeness"
            label="Vollständigkeit"
            value={data.completeness}
            onChange={(v) => onChange("completeness", v)}
            error={errors.completeness}
          >
            <option value="">— wählen —</option>
            {COMPLETENESS_OPTIONS.map((o) => (
              <option key={o} value={o} className="bg-surface">
                {o}
              </option>
            ))}
          </SelectField>
        </div>

        {/* Beschreibung */}
        <div>
          <label htmlFor="wz-description" className={labelClass}>
            Beschreibung <span className="text-accent-orange">*</span>
          </label>
          <textarea
            id="wz-description"
            value={data.description}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="Was hast du, in welchem Zustand? Besonderheiten, Zubehör, bekannte Defekte..."
            rows={4}
            className={`${inputClass} resize-none leading-relaxed ${
              errors.description ? "border-red-500" : ""
            }`}
          />
          {errors.description && <p className={errorClass}>{errors.description}</p>}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Wunschpreis */}
          <div>
            <label htmlFor="wz-desiredprice" className={labelClass}>
              Wunschpreis in €{" "}
              <span className="text-text-secondary normal-case font-normal tracking-normal">
                (optional)
              </span>
            </label>
            <input
              id="wz-desiredprice"
              type="number"
              min="0"
              value={data.desiredPrice}
              onChange={(e) => onChange("desiredPrice", e.target.value)}
              placeholder="z.B. 45"
              className={`${inputClass} font-mono`}
            />
          </div>

          {/* Menge (nur wenn Platform gezeigt wird) */}
          {showPlatform && (
            <div>
              <label htmlFor="wz-qty" className={labelClass}>
                Anzahl / Menge
              </label>
              <input
                id="wz-qty"
                type="number"
                min="1"
                max="9999"
                value={data.quantity}
                onChange={(e) => onChange("quantity", e.target.value)}
                className={inputClass}
              />
            </div>
          )}
        </div>

        {data.condition === "Defekt" && (
          <div className="border border-amber-400/40 bg-amber-50/50 dark:bg-amber-400/5 p-4">
            <p className="font-sans text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
              <span className="font-semibold">Defekte Geräte:</span> Beschreib im Freitextfeld
              möglichst genau was nicht funktioniert. Wir kaufen auch defekte Ware an.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
