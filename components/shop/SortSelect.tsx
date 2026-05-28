"use client";

import { ChevronDown } from "lucide-react";

export type SortOption = "newest" | "price-asc" | "price-desc" | "popular";

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Neueste zuerst" },
  { value: "price-asc", label: "Preis: Günstigste zuerst" },
  { value: "price-desc", label: "Preis: Teuerste zuerst" },
  { value: "popular", label: "Beliebteste zuerst" },
];

type Props = {
  value: SortOption;
  onChange: (v: SortOption) => void;
};

export function SortSelect({ value, onChange }: Props) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="w-full bg-surface border border-border text-text-primary px-4 py-2.5 pr-10 appearance-none cursor-pointer font-sans text-sm transition-colors duration-150 min-h-[44px] outline-none focus:border-accent-orange"
        aria-label="Sortierung"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value} className="bg-surface text-text-primary">
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
      />
    </div>
  );
}
