"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";

type PriceRange = [number, number];

const WIDGET_DATA: Record<string, Record<string, Record<string, PriceRange>>> = {
  "Game Boy": {
    "Game Boy Original": { "Sehr Gut": [40, 70], "Gut": [25, 45], "Akzeptabel": [10, 25] },
    "Game Boy Pocket": { "Sehr Gut": [35, 60], "Gut": [20, 40], "Akzeptabel": [8, 20] },
    "Game Boy Color": { "Sehr Gut": [60, 100], "Gut": [40, 65], "Akzeptabel": [20, 40] },
    "Game Boy Advance": { "Sehr Gut": [50, 90], "Gut": [35, 55], "Akzeptabel": [15, 35] },
    "Game Boy Advance SP": { "Sehr Gut": [60, 100], "Gut": [40, 65], "Akzeptabel": [20, 40] },
    "Game Boy Micro": { "Sehr Gut": [80, 140], "Gut": [55, 90], "Akzeptabel": [25, 55] },
  },
  "Nintendo": {
    "NES": { "Sehr Gut": [70, 130], "Gut": [45, 90], "Akzeptabel": [20, 45] },
    "SNES": { "Sehr Gut": [80, 150], "Gut": [50, 90], "Akzeptabel": [25, 50] },
    "Nintendo 64": { "Sehr Gut": [90, 160], "Gut": [60, 100], "Akzeptabel": [30, 60] },
    "GameCube": { "Sehr Gut": [100, 180], "Gut": [70, 120], "Akzeptabel": [40, 70] },
    "Wii": { "Sehr Gut": [60, 100], "Gut": [40, 70], "Akzeptabel": [20, 40] },
    "Wii U": { "Sehr Gut": [120, 200], "Gut": [80, 140], "Akzeptabel": [40, 80] },
    "Nintendo Switch": { "Sehr Gut": [180, 280], "Gut": [140, 220], "Akzeptabel": [100, 160] },
    "Nintendo DS / DS Lite": { "Sehr Gut": [40, 75], "Gut": [25, 55], "Akzeptabel": [10, 25] },
    "Nintendo 3DS": { "Sehr Gut": [60, 110], "Gut": [40, 80], "Akzeptabel": [20, 40] },
    "Nintendo 3DS XL": { "Sehr Gut": [70, 130], "Gut": [50, 100], "Akzeptabel": [25, 50] },
  },
  "PlayStation": {
    "PlayStation 1 (PS1)": { "Sehr Gut": [70, 120], "Gut": [45, 80], "Akzeptabel": [20, 45] },
    "PlayStation 2 (PS2)": { "Sehr Gut": [80, 130], "Gut": [55, 90], "Akzeptabel": [25, 55] },
    "PlayStation 3 (PS3)": { "Sehr Gut": [50, 90], "Gut": [30, 60], "Akzeptabel": [15, 30] },
    "PlayStation 4 (PS4)": { "Sehr Gut": [150, 250], "Gut": [100, 170], "Akzeptabel": [70, 110] },
    "PSP": { "Sehr Gut": [60, 110], "Gut": [40, 75], "Akzeptabel": [15, 40] },
    "PlayStation Vita": { "Sehr Gut": [100, 180], "Gut": [65, 120], "Akzeptabel": [30, 65] },
  },
  "Pokémon & Karten": {
    "Pokémon-Karten (Sammlung)": { "Sehr Gut": [30, 200], "Gut": [15, 80], "Akzeptabel": [5, 30] },
    "Pokémon-Karten (einzelnes Set)": { "Sehr Gut": [20, 150], "Gut": [10, 80], "Akzeptabel": [5, 25] },
    "Pokémon-Spiel (Game Boy)": { "Sehr Gut": [40, 120], "Gut": [25, 70], "Akzeptabel": [10, 30] },
    "Pokémon-Spiel (DS / 3DS)": { "Sehr Gut": [25, 60], "Gut": [15, 40], "Akzeptabel": [5, 20] },
  },
  "Retro": {
    "Sega Mega Drive": { "Sehr Gut": [60, 110], "Gut": [40, 75], "Akzeptabel": [20, 40] },
    "Sega Saturn": { "Sehr Gut": [80, 150], "Gut": [50, 100], "Akzeptabel": [25, 50] },
    "Sega Dreamcast": { "Sehr Gut": [100, 180], "Gut": [65, 120], "Akzeptabel": [30, 65] },
    "Atari 2600": { "Sehr Gut": [50, 90], "Gut": [30, 65], "Akzeptabel": [15, 35] },
    "Sonstige Retro-Konsole": { "Sehr Gut": [30, 80], "Gut": [15, 50], "Akzeptabel": [5, 25] },
  },
  "Zubehör": {
    "Controller (original)": { "Sehr Gut": [15, 45], "Gut": [10, 30], "Akzeptabel": [4, 15] },
    "Netzteil / Kabel (original)": { "Sehr Gut": [8, 25], "Gut": [5, 18], "Akzeptabel": [2, 10] },
    "Memory Card / Speicherkarte": { "Sehr Gut": [8, 20], "Gut": [5, 14], "Akzeptabel": [2, 8] },
    "Sonstiges Zubehör": { "Sehr Gut": [5, 20], "Gut": [3, 12], "Akzeptabel": [2, 6] },
  },
};

const COMPLETENESS_FACTORS: Record<string, number> = {
  "Vollständig (mit OVP)": 1.0,
  "Ohne OVP": 0.85,
  "Nur Gerät / kein Zubehör": 0.7,
};

const ALL_CONDITIONS = ["Sehr Gut", "Gut", "Akzeptabel", "Defekt"] as const;
const ALL_COMPLETENESS = Object.keys(COMPLETENESS_FACTORS);
const ALL_CATEGORIES = Object.keys(WIDGET_DATA);

function computeRange(
  category: string,
  device: string,
  condition: string,
  completeness: string
): PriceRange | null {
  const deviceData = WIDGET_DATA[category]?.[device];
  if (!deviceData) return null;

  const condKey = condition === "Defekt" ? "Akzeptabel" : condition;
  const base = deviceData[condKey];
  if (!base) return null;

  const defektFactor = condition === "Defekt" ? 0.35 : 1.0;
  const complFactor = COMPLETENESS_FACTORS[completeness] ?? 1.0;

  return [
    Math.max(1, Math.round(base[0] * defektFactor * complFactor)),
    Math.round(base[1] * defektFactor * complFactor),
  ];
}

type SelectFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  options: readonly string[];
  disabled?: boolean;
};

function SelectField({
  id,
  label,
  value,
  onChange,
  placeholder,
  options,
  disabled = false,
}: SelectFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2 block"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full bg-surface border border-border text-text-primary px-4 py-2.5 pr-10 appearance-none cursor-pointer font-sans text-sm min-h-[44px] outline-none focus:border-accent-orange transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-surface">
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
        />
      </div>
    </div>
  );
}

export function AnkaufPriceWidget() {
  const [category, setCategory] = useState("");
  const [device, setDevice] = useState("");
  const [condition, setCondition] = useState("");
  const [completeness, setCompleteness] = useState("");

  const devices = useMemo(
    () => (category ? Object.keys(WIDGET_DATA[category] ?? {}) : []),
    [category]
  );

  const range = useMemo(
    () =>
      category && device && condition && completeness
        ? computeRange(category, device, condition, completeness)
        : null,
    [category, device, condition, completeness]
  );

  function handleCategoryChange(val: string) {
    setCategory(val);
    setDevice("");
    setCondition("");
    setCompleteness("");
  }

  function handleDeviceChange(val: string) {
    setDevice(val);
    setCondition("");
    setCompleteness("");
  }

  return (
    <div className="bg-background border border-border p-6 lg:p-7 shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-none">
      <div className="mb-6">
        <p className="font-sans text-xs font-semibold uppercase tracking-widest text-accent-orange mb-1">
          Preisschätzer
        </p>
        <h3 className="font-sans font-bold text-text-primary text-xl">
          Was ist es wert?
        </h3>
        <p className="font-sans text-xs text-text-secondary mt-1.5">
          Wähle Kategorie, Modell, Zustand und Vollständigkeit für einen Richtwert.
        </p>
      </div>

      <div className="space-y-4">
        <SelectField
          id="pw-cat"
          label="Kategorie"
          value={category}
          onChange={handleCategoryChange}
          placeholder="— Kategorie wählen —"
          options={ALL_CATEGORIES}
        />
        <SelectField
          id="pw-device"
          label="Modell / Produkt"
          value={device}
          onChange={handleDeviceChange}
          placeholder="— Modell wählen —"
          options={devices}
          disabled={!category}
        />
        <SelectField
          id="pw-cond"
          label="Zustand"
          value={condition}
          onChange={setCondition}
          placeholder="— Zustand wählen —"
          options={ALL_CONDITIONS}
          disabled={!device}
        />
        <SelectField
          id="pw-compl"
          label="Vollständigkeit"
          value={completeness}
          onChange={setCompleteness}
          placeholder="— Vollständigkeit wählen —"
          options={ALL_COMPLETENESS}
          disabled={!condition}
        />

        {range ? (
          <div className="border border-accent-orange bg-surface p-5 text-center">
            <p className="font-sans text-xs text-text-secondary mb-2 uppercase tracking-wider">
              Geschätzter Ankaufswert
            </p>
            <p className="font-mono text-3xl font-bold text-accent-orange">
              {range[0]} – {range[1]} €
            </p>
            <p className="font-sans text-xs text-text-secondary mt-2">
              Unverbindlicher Richtwert — finales Angebot nach Prüfung
            </p>
            <a
              href="#angebot"
              className="mt-4 inline-flex items-center gap-2 bg-accent-orange text-background px-6 py-2.5 font-sans font-semibold text-sm hover:bg-[#e05a28] transition-colors"
            >
              Ankauf starten
              <ArrowRight size={14} />
            </a>
          </div>
        ) : (
          <div className="border border-dashed border-border p-6 text-center">
            <p className="font-sans text-sm text-text-secondary">
              Fülle alle Felder aus für einen Richtwert
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
