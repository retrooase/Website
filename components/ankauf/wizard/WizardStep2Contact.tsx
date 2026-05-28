import { type WizardData, type WizardErrors } from "./types";

type ContactFields = Pick<WizardData, "name" | "email" | "phone" | "plz">;

const inputClass =
  "w-full bg-surface border border-border text-text-primary placeholder:text-text-secondary px-4 py-3 font-sans text-sm outline-none focus:border-accent-orange transition-colors min-h-[44px]";
const labelClass =
  "font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2 block";

export function WizardStep2Contact({
  data,
  errors,
  onChange,
}: {
  data: ContactFields;
  errors: WizardErrors;
  onChange: (field: keyof ContactFields, value: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-sans font-bold text-text-primary text-lg mb-1">
          Wie können wir dich erreichen?
        </h3>
        <p className="font-sans text-sm text-text-secondary">
          Wir antworten per E-Mail innerhalb von 24 Stunden.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label htmlFor="wz-name" className={labelClass}>
              Name <span className="text-accent-orange">*</span>
            </label>
            <input
              id="wz-name"
              type="text"
              value={data.name}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="Max Mustermann"
              autoComplete="name"
              className={`${inputClass} ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && (
              <p className="font-sans text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* E-Mail */}
          <div>
            <label htmlFor="wz-email" className={labelClass}>
              E-Mail <span className="text-accent-orange">*</span>
            </label>
            <input
              id="wz-email"
              type="email"
              value={data.email}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="du@email.de"
              autoComplete="email"
              className={`${inputClass} ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && (
              <p className="font-sans text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Telefon */}
          <div>
            <label htmlFor="wz-phone" className={labelClass}>
              Telefon{" "}
              <span className="text-text-secondary normal-case font-normal tracking-normal">
                (optional)
              </span>
            </label>
            <input
              id="wz-phone"
              type="tel"
              value={data.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="+49 123 456789"
              autoComplete="tel"
              className={inputClass}
            />
          </div>

          {/* PLZ */}
          <div>
            <label htmlFor="wz-plz" className={labelClass}>
              Postleitzahl{" "}
              <span className="text-text-secondary normal-case font-normal tracking-normal">
                (optional)
              </span>
            </label>
            <input
              id="wz-plz"
              type="text"
              value={data.plz}
              onChange={(e) =>
                onChange("plz", e.target.value.replace(/\D/g, "").slice(0, 5))
              }
              placeholder="12345"
              autoComplete="postal-code"
              maxLength={5}
              className={inputClass}
            />
          </div>
        </div>

        <div className="border border-border bg-surface p-4">
          <p className="font-sans text-xs text-text-secondary leading-relaxed">
            Deine Daten werden ausschließlich für die Bearbeitung deiner Anfrage verwendet.
            Kein Newsletter, kein Spam.
          </p>
        </div>
      </div>
    </div>
  );
}
