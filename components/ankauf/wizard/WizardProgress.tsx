import React from "react";
import { Check } from "lucide-react";

const STEPS = ["Verkaufstyp", "Kontakt", "Details", "Fotos", "Zusammenfassung"] as const;

export function WizardProgress({ current }: { current: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center">
        {STEPS.map((label, i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div
                className={`w-8 h-8 flex items-center justify-center border-2 transition-all duration-200 ${
                  i < current
                    ? "bg-accent-orange border-accent-orange"
                    : i === current
                    ? "bg-background border-accent-orange"
                    : "bg-background border-border"
                }`}
              >
                {i < current ? (
                  <Check size={13} className="text-background" />
                ) : (
                  <span
                    className={`font-sans text-[11px] font-bold ${
                      i === current ? "text-accent-orange" : "text-text-secondary"
                    }`}
                  >
                    {i + 1}
                  </span>
                )}
              </div>
              <span
                className={`font-sans text-[10px] font-semibold uppercase tracking-wide hidden sm:block ${
                  i === current ? "text-text-primary" : "text-text-secondary"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-px transition-all duration-300 mx-1.5 mb-4 sm:mb-0 ${
                  i < current ? "bg-accent-orange" : "bg-border"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <p className="sm:hidden font-sans text-xs text-text-secondary mt-3 text-center">
        Schritt {current + 1} von {STEPS.length}:{" "}
        <span className="font-semibold text-text-primary">{STEPS[current]}</span>
      </p>
    </div>
  );
}
