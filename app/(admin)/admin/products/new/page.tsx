import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createProduct } from "../actions";
import { GenerateAIButton } from "@/components/admin/GenerateAIButton";

export const metadata: Metadata = {
  title: "Neues Produkt | Admin | RetrOase",
  robots: { index: false },
};

const CATEGORIES = ["Nintendo", "Game Boy", "PlayStation", "Pokémon", "Zubehör", "Retro"];
const CONDITIONS = ["Sehr Gut", "Gut", "Akzeptabel"];
const BADGES = ["NEU", "SELTEN", "TOP-ZUSTAND", "SCHNÄPPCHEN", "TOP DEAL"];

export default function NewProductPage() {
  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/products"
          className="flex items-center gap-1.5 font-sans text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={15} />
          Zurück
        </Link>
        <span className="text-border">/</span>
        <span className="font-sans text-sm text-text-primary font-medium">Neues Produkt</span>
      </div>

      <form action={createProduct} className="space-y-5">
        {/* Grunddaten */}
        <FormSection title="Grunddaten">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label>Titel *</Label>
              <input name="title" required className="pixel-input w-full text-sm py-2" placeholder="z. B. Super Mario World SNES" />
            </div>
            <div className="sm:col-span-2">
              <Label>Slug (leer = auto)</Label>
              <input name="slug" className="pixel-input w-full text-sm py-2 font-mono" placeholder="super-mario-world-snes" />
              <p className="font-sans text-xs text-text-secondary mt-1">Wird automatisch aus dem Titel generiert falls leer.</p>
            </div>
            <div className="sm:col-span-2">
              <Label>Beschreibung *</Label>
              <GenerateAIButton />
              <textarea name="description" required rows={4} className="pixel-input w-full text-sm py-2 resize-y mt-2" placeholder="Produktbeschreibung…" />
            </div>
          </div>
        </FormSection>

        {/* Kategorie & Zustand */}
        <FormSection title="Klassifikation">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Kategorie *</Label>
              <select name="category" required className="pixel-input w-full text-sm py-2">
                <option value="">— wählen —</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <Label>Plattform</Label>
              <input name="platform" className="pixel-input w-full text-sm py-2" placeholder="z. B. SNES, Game Boy Color" />
            </div>
            <div>
              <Label>Zustand *</Label>
              <select name="condition" required className="pixel-input w-full text-sm py-2">
                <option value="">— wählen —</option>
                {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <Label>Badge</Label>
              <select name="badge" className="pixel-input w-full text-sm py-2">
                <option value="">— kein Badge —</option>
                {BADGES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>
        </FormSection>

        {/* Preise */}
        <FormSection title="Preise & Marge">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Verkaufspreis (€) *</Label>
              <input name="price" type="number" step="0.01" min="0" required className="pixel-input w-full text-sm py-2" placeholder="29.99" />
            </div>
            <div>
              <Label>Einkaufspreis (€)</Label>
              <input name="purchase_price" type="number" step="0.01" min="0" className="pixel-input w-full text-sm py-2" placeholder="15.00" />
              <p className="font-sans text-xs text-text-secondary mt-1">Intern — für Margenberechnung.</p>
            </div>
          </div>
        </FormSection>

        {/* EAN & eBay */}
        <FormSection title="EAN / Barcode & eBay">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>EAN / Barcode</Label>
              <input name="ean" className="pixel-input w-full text-sm py-2 font-mono" placeholder="4902370507249" />
              <p className="font-sans text-xs text-text-secondary mt-1">Für spätere Barcode-Identifikation.</p>
            </div>
            <div>
              <Label>eBay-ID</Label>
              <input name="ebay_id" className="pixel-input w-full text-sm py-2 font-mono" placeholder="123456789012" />
            </div>
            <div className="sm:col-span-2">
              <Label>eBay-URL</Label>
              <input name="ebay_url" type="url" className="pixel-input w-full text-sm py-2" placeholder="https://www.ebay.de/itm/…" />
            </div>
          </div>
        </FormSection>

        {/* Technische Details */}
        <FormSection title="Technische Details">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Sprache</Label>
              <input name="language" className="pixel-input w-full text-sm py-2" placeholder="DE, EN, JAP…" />
            </div>
            <div>
              <Label>Region</Label>
              <input name="region" className="pixel-input w-full text-sm py-2" placeholder="PAL, NTSC…" />
            </div>
          </div>
        </FormSection>

        {/* Optionen */}
        <FormSection title="Optionen">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="is_featured" className="w-4 h-4 accent-accent-orange" />
            <span className="font-sans text-sm text-text-primary">Als Featured markieren</span>
          </label>
        </FormSection>

        {/* Bilder */}
        <FormSection title="Produktbilder">
          <p className="font-sans text-xs text-text-secondary mb-3">
            JPG, PNG oder WEBP · max. 5 MB pro Bild · max. 10 Bilder · Bucket: <code className="font-mono">product-images</code>
          </p>
          <input
            type="file"
            name="images"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="font-sans text-sm text-text-primary file:mr-3 file:py-1.5 file:px-3 file:border file:border-border file:bg-surface-hover file:text-xs file:font-sans file:text-text-secondary file:cursor-pointer"
          />
        </FormSection>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary py-2.5 px-6 text-sm">
            Produkt erstellen
          </button>
          <Link href="/admin/products" className="btn-secondary py-2.5 px-6 text-sm">
            Abbrechen
          </Link>
        </div>
      </form>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-border p-4">
      <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block font-sans text-xs font-semibold text-text-secondary mb-1">
      {children}
    </label>
  );
}
