"use client";

import { clsx } from "clsx";
import { CATEGORIES, CONDITIONS } from "@/lib/constants";
import { PriceSlider } from "./PriceSlider";

export type Filters = {
  categories: string[];
  conditions: string[];
  priceRange: [number, number];
  platforms: string[];
  onlyAvailable: boolean;
};

export const DEFAULT_FILTERS: Filters = {
  categories: [],
  conditions: [],
  priceRange: [0, 250],
  platforms: [],
  onlyAvailable: true,
};

type Props = {
  filters: Filters;
  onChange: (f: Filters) => void;
  allPlatforms: string[];
  resultCount: number;
};

export function FilterPanel({ filters, onChange, allPlatforms, resultCount }: Props) {
  function toggleArr<T>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
  }

  const activeCount =
    filters.categories.length +
    filters.conditions.length +
    filters.platforms.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 250 ? 1 : 0) +
    (!filters.onlyAvailable ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="font-pixel text-text-primary" style={{ fontSize: "0.6rem" }}>
            FILTER
          </span>
          {activeCount > 0 && (
            <span className="bg-accent-orange text-background text-xs px-1.5 py-0.5 font-sans font-bold">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={() => onChange(DEFAULT_FILTERS)}
            className="font-sans text-xs text-text-secondary hover:text-accent-orange transition-colors"
          >
            Zurücksetzen
          </button>
        )}
      </div>

      {/* Verfügbarkeit */}
      <FilterSection title="Verfügbarkeit">
        <label className="flex items-center gap-2.5 cursor-pointer group py-0.5">
          <input
            type="checkbox"
            checked={filters.onlyAvailable}
            onChange={(e) => onChange({ ...filters, onlyAvailable: e.target.checked })}
            className="sr-only"
          />
          <span
            className={clsx(
              "w-4 h-4 border-2 flex items-center justify-center transition-colors flex-shrink-0",
              filters.onlyAvailable
                ? "border-accent-orange bg-accent-orange"
                : "border-border bg-transparent group-hover:border-accent-orange"
            )}
          >
            {filters.onlyAvailable && (
              <span className="text-background font-bold text-xs leading-none">✓</span>
            )}
          </span>
          <span className="font-sans text-sm text-text-primary">Nur verfügbare</span>
        </label>
      </FilterSection>

      {/* Kategorien */}
      <FilterSection title="Kategorie">
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <CheckItem
              key={cat.id}
              label={`${cat.icon} ${cat.label}`}
              checked={filters.categories.includes(cat.label)}
              onChange={() =>
                onChange({ ...filters, categories: toggleArr(filters.categories, cat.label) })
              }
            />
          ))}
        </div>
      </FilterSection>

      {/* Zustand */}
      <FilterSection title="Zustand">
        <div className="space-y-1">
          {CONDITIONS.map((c) => (
            <CheckItem
              key={c.id}
              label={c.label}
              labelClass={c.color}
              checked={filters.conditions.includes(c.label)}
              onChange={() =>
                onChange({ ...filters, conditions: toggleArr(filters.conditions, c.label) })
              }
            />
          ))}
        </div>
      </FilterSection>

      {/* Preis */}
      <FilterSection title="Preis">
        <PriceSlider
          min={0}
          max={250}
          value={filters.priceRange}
          onChange={(v) => onChange({ ...filters, priceRange: v })}
        />
      </FilterSection>

      {/* Plattform */}
      <FilterSection title="Plattform">
        <div className="space-y-1">
          {allPlatforms.map((p) => (
            <CheckItem
              key={p}
              label={p}
              checked={filters.platforms.includes(p)}
              onChange={() =>
                onChange({ ...filters, platforms: toggleArr(filters.platforms, p) })
              }
            />
          ))}
        </div>
      </FilterSection>

      {/* Ergebnis-Anzeige */}
      <p className="font-sans text-xs text-text-secondary text-center pt-2 border-t border-border">
        {resultCount} {resultCount === 1 ? "Artikel" : "Artikel"} gefunden
      </p>
    </div>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <span className="font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary block">
        {title}
      </span>
      {children}
    </div>
  );
}

function CheckItem({
  label,
  labelClass,
  checked,
  onChange,
}: {
  label: string;
  labelClass?: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group py-0.5">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span
        className={clsx(
          "w-4 h-4 border-2 flex items-center justify-center transition-colors flex-shrink-0",
          checked
            ? "border-accent-orange bg-accent-orange"
            : "border-border bg-transparent group-hover:border-accent-orange"
        )}
      >
        {checked && <span className="text-background font-bold text-xs leading-none">✓</span>}
      </span>
      <span className={clsx("font-sans text-sm text-text-primary", labelClass)}>{label}</span>
    </label>
  );
}
