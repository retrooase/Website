"use client";

// Architecture note: when camera scanning is added, implement this interface
// and wire onResult to the price widget or form.
// Recommended library: @zxing/browser or html5-qrcode (do NOT install yet)
//
// export interface BarcodeResult {
//   ean: string;
//   name?: string;
//   category?: string;
//   platform?: string;
// }

import { useState } from "react";
import { Search, Camera, QrCode } from "lucide-react";

export function AnkaufBarcodeCard() {
  const [ean, setEan] = useState("");

  return (
    <div className="bg-background border border-border p-6 lg:p-7 shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-none">
      <div className="mb-6">
        <div className="flex items-start justify-between gap-3 mb-1">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-accent-orange">
            Barcode-Scanner
          </p>
          <span className="font-sans text-[10px] font-bold bg-surface border border-border text-text-secondary px-2 py-0.5 uppercase tracking-wide flex-shrink-0">
            Bald verfügbar
          </span>
        </div>
        <h3 className="font-sans font-bold text-text-primary text-xl">
          EAN / Barcode scannen
        </h3>
        <p className="font-sans text-xs text-text-secondary mt-1.5">
          Scann den Barcode deines Spiels oder Produkts — wir erkennen es automatisch.
        </p>
      </div>

      <div className="space-y-4">
        {/* Manual EAN input */}
        <div>
          <label
            htmlFor="ean-input"
            className="font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2 block"
          >
            EAN manuell eingeben
          </label>
          <div className="flex gap-2">
            <input
              id="ean-input"
              type="text"
              value={ean}
              onChange={(e) => setEan(e.target.value.replace(/\D/g, ""))}
              placeholder="z.B. 4902370524567"
              maxLength={14}
              className="flex-1 bg-surface border border-border text-text-primary placeholder:text-text-secondary px-4 py-2.5 font-mono text-sm outline-none focus:border-accent-orange transition-colors min-h-[44px]"
            />
            <button
              type="button"
              disabled
              title="EAN-Suche kommt bald"
              className="px-4 min-h-[44px] border border-border text-text-secondary flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:border-accent-orange transition-colors"
              aria-label="Barcode suchen"
            >
              <Search size={16} />
            </button>
          </div>
        </div>

        {/* Camera scan button */}
        <button
          type="button"
          disabled
          title="Kamera-Scanner kommt bald"
          className="w-full flex items-center justify-center gap-3 border border-dashed border-border text-text-secondary px-6 py-5 font-sans text-sm hover:border-accent-orange transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Camera size={20} />
          <span className="font-medium">Mit Kamera scannen</span>
          <span className="font-sans text-[10px] font-bold bg-surface border border-border px-2 py-0.5 uppercase tracking-wide">
            Bald
          </span>
        </button>

        {/* Info card */}
        <div className="flex items-start gap-3 border border-border bg-surface p-4">
          <QrCode size={18} className="text-accent-orange flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-sans text-xs font-semibold text-text-primary mb-1">
              Für Spiele mit Originalverpackung
            </p>
            <p className="font-sans text-xs text-text-secondary leading-relaxed">
              Barcode-Scanning beschleunigt die Anfrage: wir erkennen dein Spiel automatisch
              und müssen weniger manuell nachfragen. Ideal für moderne Produkte mit EAN.
            </p>
          </div>
        </div>

        {/* Supported formats note */}
        <p className="font-sans text-xs text-text-secondary text-center">
          Unterstützt: EAN-13, EAN-8, UPC-A — für alle gängigen Spiele & Produkte
        </p>
      </div>
    </div>
  );
}
