"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { PRICE_ESTIMATES, SITE } from "@/lib/constants";

export function PriceEstimator() {
  const categories = Object.keys(PRICE_ESTIMATES);
  const [category, setCategory] = useState("");
  const [device, setDevice] = useState("");
  const [condition, setCondition] = useState("");

  const devices = category ? Object.keys(PRICE_ESTIMATES[category] ?? {}) : [];
  const conditions = device && category ? Object.keys(PRICE_ESTIMATES[category]?.[device] ?? {}) : [];
  const range = category && device && condition ? PRICE_ESTIMATES[category]?.[device]?.[condition] : null;

  function handleCategoryChange(val: string) {
    setCategory(val);
    setDevice("");
    setCondition("");
  }
  function handleDeviceChange(val: string) {
    setDevice(val);
    setCondition("");
  }

  return (
    <section className="py-20 sm:py-28 bg-surface scroll-fade">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-accent-orange mb-3">
              Ankauf-Tool
            </p>
            <h2 className="font-sans font-bold text-text-primary mb-3" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)" }}>
              Was ist dein Gerät wert?
            </h2>
            <p className="font-sans text-sm text-text-secondary">
              Wähle Kategorie, Modell und Zustand — wir nennen dir einen Richtwert.
            </p>
          </div>

          {/* Widget */}
          <div className="bg-background border border-border p-6 lg:p-8 space-y-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-none">
            {/* Kategorie */}
            <div>
              <label
                className="font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2 block"
                htmlFor="pe-category"
              >
                Kategorie
              </label>
              <div className="relative">
                <select
                  id="pe-category"
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full bg-surface border border-border text-text-primary px-4 py-2.5 pr-10 appearance-none cursor-pointer font-sans text-sm min-h-[44px] outline-none focus:border-accent-orange transition-colors"
                >
                  <option value="">— Kategorie wählen —</option>
                  {categories.map((c) => (
                    <option key={c} value={c} className="bg-surface">
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
                />
              </div>
            </div>

            {/* Gerät */}
            <div>
              <label
                className="font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2 block"
                htmlFor="pe-device"
              >
                Modell / Gerät
              </label>
              <div className="relative">
                <select
                  id="pe-device"
                  value={device}
                  onChange={(e) => handleDeviceChange(e.target.value)}
                  className="w-full bg-surface border border-border text-text-primary px-4 py-2.5 pr-10 appearance-none cursor-pointer font-sans text-sm min-h-[44px] outline-none focus:border-accent-orange transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!category}
                >
                  <option value="">— Gerät wählen —</option>
                  {devices.map((d) => (
                    <option key={d} value={d} className="bg-surface">
                      {d}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
                />
              </div>
            </div>

            {/* Zustand */}
            <div>
              <label
                className="font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2 block"
                htmlFor="pe-condition"
              >
                Zustand
              </label>
              <div className="relative">
                <select
                  id="pe-condition"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full bg-surface border border-border text-text-primary px-4 py-2.5 pr-10 appearance-none cursor-pointer font-sans text-sm min-h-[44px] outline-none focus:border-accent-orange transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!device}
                >
                  <option value="">— Zustand wählen —</option>
                  {conditions.map((c) => (
                    <option key={c} value={c} className="bg-surface">
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
                />
              </div>
            </div>

            {/* Ergebnis */}
            {range ? (
              <div className="border border-accent-orange bg-surface p-6 text-center animate-fade-in">
                <p className="font-sans text-xs text-text-secondary mb-3 uppercase tracking-wider">
                  Geschätzter Ankaufswert
                </p>
                <p className="font-mono text-3xl font-bold text-accent-orange">
                  {range[0]} – {range[1]} {SITE.currencySymbol}
                </p>
                <p className="font-sans text-xs text-text-secondary mt-3">
                  Richtwert — das finale Angebot nach Prüfung kann abweichen.
                </p>
              </div>
            ) : (
              <div className="border border-dashed border-border p-6 text-center">
                <p className="font-sans text-sm text-text-secondary">
                  Wähle Kategorie, Gerät und Zustand
                </p>
              </div>
            )}

            {range && (
              <Link href="/ankauf" className="btn-primary w-full justify-center">
                Jetzt Angebot anfragen
                <ArrowRight size={15} />
              </Link>
            )}
          </div>

          <p className="text-center font-sans text-xs text-text-secondary mt-5">
            Nicht dabei? Schreib uns — wir kaufen fast alles an.
          </p>
        </div>
      </div>
    </section>
  );
}
