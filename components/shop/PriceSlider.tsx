"use client";

import { SITE } from "@/lib/constants";

type Props = {
  min: number;
  max: number;
  value: [number, number];
  onChange: (val: [number, number]) => void;
};

export function PriceSlider({ min, max, value, onChange }: Props) {
  const [lo, hi] = value;

  return (
    <div className="space-y-3">
      <div className="flex justify-between font-mono text-sm text-accent-orange">
        <span>{lo} {SITE.currencySymbol}</span>
        <span>{hi} {SITE.currencySymbol}</span>
      </div>

      {/* Min-Slider */}
      <div className="relative h-2 bg-surface-hover border border-border">
        <div
          className="absolute h-full bg-accent-orange"
          style={{
            left: `${((lo - min) / (max - min)) * 100}%`,
            width: `${((hi - lo) / (max - min)) * 100}%`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={lo}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v < hi) onChange([v, hi]);
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          aria-label="Mindestpreis"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={hi}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v > lo) onChange([lo, v]);
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          aria-label="Maximalpreis"
        />
      </div>

      <div className="flex gap-2">
        <input
          type="number"
          min={min}
          max={hi}
          value={lo}
          onChange={(e) => {
            const v = Math.max(min, Math.min(Number(e.target.value), hi - 1));
            onChange([v, hi]);
          }}
          className="pixel-input text-center text-sm w-1/2"
          aria-label="Von"
        />
        <input
          type="number"
          min={lo}
          max={max}
          value={hi}
          onChange={(e) => {
            const v = Math.min(max, Math.max(Number(e.target.value), lo + 1));
            onChange([lo, v]);
          }}
          className="pixel-input text-center text-sm w-1/2"
          aria-label="Bis"
        />
      </div>
    </div>
  );
}
