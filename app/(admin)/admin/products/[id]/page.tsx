import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, TrendingUp, Star, ShoppingCart } from "lucide-react";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import {
  updateProduct,
  addProductImages,
  deleteProductImage,
  toggleProductSold,
  toggleProductFeatured,
} from "../actions";
import { DeleteButton } from "./DeleteButton";
import { GenerateAIButton } from "@/components/admin/GenerateAIButton";

export const metadata: Metadata = {
  title: "Produkt bearbeiten | Admin | RetrOase",
  robots: { index: false },
};

const CATEGORIES = ["Nintendo", "Game Boy", "PlayStation", "Pokémon", "Zubehör", "Retro"];
const CONDITIONS = ["Sehr Gut", "Gut", "Akzeptabel"];
const BADGES = ["NEU", "SELTEN", "TOP-ZUSTAND", "SCHNÄPPCHEN", "TOP DEAL"];

type PageProps = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> };

export default async function ProductEditPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { saved } = await searchParams;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const admin = createAdminSupabaseClient();
  const { data: product, error } = await admin.from("products").select("*").eq("id", id).single();
  if (error || !product) notFound();

  const margin =
    product.purchase_price != null ? product.price - product.purchase_price : null;

  const updateAction = updateProduct.bind(null, id);
  const addImagesAction = addProductImages.bind(null, id);

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/products"
          className="flex items-center gap-1.5 font-sans text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={15} />
          Zurück
        </Link>
        <span className="text-border">/</span>
        <span className="font-sans text-sm text-text-primary font-medium truncate max-w-xs">{product.title}</span>
      </div>

      {saved === "1" && (
        <div className="mb-5 px-4 py-3 bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800 flex items-center gap-2">
          <span className="text-green-600 dark:text-green-400 text-sm font-sans">Änderungen gespeichert.</span>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Linke Spalte: Editierformular */}
        <div>
          <form action={updateAction} className="space-y-4">
            <FormSection title="Grunddaten">
              <div className="space-y-3">
                <Field label="Titel *">
                  <input name="title" required defaultValue={product.title} className="pixel-input w-full text-sm py-2" />
                </Field>
                <Field label="Beschreibung *">
                  <GenerateAIButton />
                  <textarea name="description" required rows={4} defaultValue={product.description} className="pixel-input w-full text-sm py-2 resize-y mt-2" />
                </Field>
              </div>
            </FormSection>

            <FormSection title="Klassifikation">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Kategorie *">
                  <select name="category" required defaultValue={product.category} className="pixel-input w-full text-sm py-2">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Plattform">
                  <input name="platform" defaultValue={product.platform ?? ""} className="pixel-input w-full text-sm py-2" />
                </Field>
                <Field label="Zustand *">
                  <select name="condition" required defaultValue={product.condition} className="pixel-input w-full text-sm py-2">
                    {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Badge">
                  <select name="badge" defaultValue={product.badge ?? ""} className="pixel-input w-full text-sm py-2">
                    <option value="">— kein Badge —</option>
                    {BADGES.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </Field>
                <Field label="Sprache">
                  <input name="language" defaultValue={product.language ?? ""} className="pixel-input w-full text-sm py-2" />
                </Field>
                <Field label="Region">
                  <input name="region" defaultValue={product.region ?? ""} className="pixel-input w-full text-sm py-2" />
                </Field>
              </div>
            </FormSection>

            <FormSection title="Preise">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Verkaufspreis (€) *">
                  <input name="price" type="number" step="0.01" min="0" required defaultValue={product.price} className="pixel-input w-full text-sm py-2 font-mono" />
                </Field>
                <Field label="Einkaufspreis (€)">
                  <input name="purchase_price" type="number" step="0.01" min="0" defaultValue={product.purchase_price ?? ""} className="pixel-input w-full text-sm py-2 font-mono" />
                </Field>
              </div>
              {margin != null && (
                <div className={`flex items-center gap-2 mt-3 p-2 border ${margin >= 0 ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20" : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"}`}>
                  <TrendingUp size={14} className={margin >= 0 ? "text-green-600" : "text-red-500"} />
                  <span className="font-sans text-xs text-text-secondary">Marge:</span>
                  <span className={`font-mono text-sm font-bold ${margin >= 0 ? "text-green-700 dark:text-green-400" : "text-red-600"}`}>
                    {margin.toFixed(2)} €
                  </span>
                </div>
              )}
            </FormSection>

            <FormSection title="EAN / eBay">
              <div className="space-y-3">
                <Field label="EAN / Barcode">
                  <input name="ean" defaultValue={product.ean ?? ""} className="pixel-input w-full text-sm py-2 font-mono" placeholder="4902370507249" />
                </Field>
                <Field label="eBay-ID">
                  <input name="ebay_id" defaultValue={product.ebay_id ?? ""} className="pixel-input w-full text-sm py-2 font-mono" />
                </Field>
                <Field label="eBay-URL">
                  <input name="ebay_url" type="url" defaultValue={product.ebay_url ?? ""} className="pixel-input w-full text-sm py-2" />
                </Field>
              </div>
            </FormSection>

            <FormSection title="Optionen">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="is_featured" defaultChecked={product.is_featured} className="w-4 h-4 accent-accent-orange" />
                <span className="font-sans text-sm text-text-primary">Als Featured markieren</span>
              </label>
            </FormSection>

            <button type="submit" className="btn-primary w-full py-2.5 text-sm">
              Änderungen speichern
            </button>
          </form>
        </div>

        {/* Rechte Spalte */}
        <div className="space-y-5">
          {/* Bilder */}
          <FormSection title={`Produktbilder (${product.images?.length ?? 0})`}>
            {product.images?.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {(product.images as string[]).map((url: string, i: number) => (
                  <div key={i} className="relative group">
                    <div className="aspect-square relative border border-border overflow-hidden">
                      <Image src={url} alt={`Bild ${i + 1}`} fill className="object-cover" sizes="120px" />
                    </div>
                    <form
                      action={async () => {
                        "use server";
                        await deleteProductImage(id, url);
                      }}
                    >
                      <button
                        type="submit"
                        className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                        title="Bild löschen"
                      >
                        ×
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-sans text-sm text-text-secondary mb-3">Keine Bilder vorhanden.</p>
            )}
            <form action={addImagesAction}>
              <p className="font-sans text-xs text-text-secondary mb-2">Bilder hinzufügen:</p>
              <input
                type="file"
                name="images"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="font-sans text-xs text-text-primary file:mr-2 file:py-1 file:px-2 file:border file:border-border file:bg-surface-hover file:text-xs file:font-sans file:text-text-secondary file:cursor-pointer mb-2 block"
              />
              <button type="submit" className="btn-secondary text-xs py-1.5 px-3">
                Bilder hochladen
              </button>
            </form>
          </FormSection>

          {/* Quick-Actions */}
          <FormSection title="Quick-Actions">
            <div className="space-y-2">
              <form
                action={async () => {
                  "use server";
                  await toggleProductSold(id, !product.is_sold);
                }}
              >
                <button
                  type="submit"
                  className={`w-full flex items-center gap-2 px-3 py-2.5 font-sans text-sm border transition-colors ${
                    product.is_sold
                      ? "border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400"
                      : "border-border text-text-secondary hover:border-red-300 hover:text-red-600"
                  }`}
                >
                  <ShoppingCart size={14} />
                  {product.is_sold ? "Als verfügbar markieren" : "Als verkauft markieren"}
                </button>
              </form>

              <form
                action={async () => {
                  "use server";
                  await toggleProductFeatured(id, !product.is_featured);
                }}
              >
                <button
                  type="submit"
                  className={`w-full flex items-center gap-2 px-3 py-2.5 font-sans text-sm border transition-colors ${
                    product.is_featured
                      ? "border-accent-orange text-accent-orange bg-accent-orange/5"
                      : "border-border text-text-secondary hover:border-accent-orange/50"
                  }`}
                >
                  <Star size={14} />
                  {product.is_featured ? "Featured entfernen" : "Als Featured markieren"}
                </button>
              </form>

              <DeleteButton id={id} />
            </div>
          </FormSection>

          {/* Meta */}
          <FormSection title="Meta">
            <div className="space-y-2">
              <MetaField label="ID" value={product.id} mono />
              <MetaField label="Slug" value={product.slug} mono />
              <MetaField label="Erstellt" value={new Date(product.created_at).toLocaleString("de-DE")} />
              {product.updated_at && (
                <MetaField label="Aktualisiert" value={new Date(product.updated_at).toLocaleString("de-DE")} />
              )}
              <MetaField label="Status" value={product.is_sold ? "Verkauft" : "Verfügbar"} />
            </div>
          </FormSection>
        </div>
      </div>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-border p-4">
      <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary mb-3">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-sans text-xs font-semibold text-text-secondary mb-1">{label}</label>
      {children}
    </div>
  );
}

function MetaField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex gap-2">
      <span className="font-sans text-xs text-text-secondary w-24 flex-shrink-0">{label}</span>
      <span className={`font-sans text-xs text-text-primary break-all ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}
