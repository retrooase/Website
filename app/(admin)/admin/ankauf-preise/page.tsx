import type { Metadata } from "next";
import Link from "next/link";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import {
  createBrand,
  createDevice,
  createVariant,
  toggleVariantActive,
  updateStoreCreditBonus,
  updateVariant,
} from "./actions";
import { Database, Plus, SlidersHorizontal } from "lucide-react";

export const metadata: Metadata = {
  title: "Preis-Katalog | Admin | RetrOase",
  robots: { index: false },
};

type BrandRow = {
  slug: string;
  name: string;
  logo_url: string | null;
  sort_order: number;
  is_active: boolean;
};

type DeviceRow = {
  slug: string;
  brand_slug: string;
  name: string;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

type VariantRow = {
  slug: string;
  brand_slug: string;
  device_slug: string;
  name: string;
  item_type: string;
  base_price_min: number;
  base_price_max: number;
  demand_level: string;
  aliases: string[];
  eans: string[];
  image_url: string | null;
  required_accessories: string[];
  optional_accessories: string[];
  notes: string | null;
  is_active: boolean;
  updated_at: string;
};

type SettingRow = {
  key: string;
  numeric_value: number | null;
  text_value: string | null;
};

type PageProps = {
  searchParams: Promise<{ brand?: string; type?: string; status?: string; q?: string; saved?: string }>;
};

const ITEM_TYPES = [
  { value: "console", label: "Konsole" },
  { value: "handheld", label: "Handheld" },
  { value: "game", label: "Spiel" },
  { value: "cards", label: "Karten" },
  { value: "accessory", label: "Zubehör" },
  { value: "bundle", label: "Bundle" },
];

const DEMAND_LEVELS = [
  { value: "hot", label: "Stark gefragt" },
  { value: "steady", label: "Stabil" },
  { value: "niche", label: "Nische" },
];

export default async function AnkaufPreisePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const brandFilter = params.brand ?? "all";
  const typeFilter = params.type ?? "all";
  const statusFilter = params.status ?? "active";
  const query = (params.q ?? "").trim().toLowerCase();

  const admin = createAdminSupabaseClient();
  const [brandsRes, devicesRes, variantsRes, settingsRes] = await Promise.all([
    admin.from("ankauf_price_brands").select("slug, name, logo_url, sort_order, is_active").order("sort_order"),
    admin.from("ankauf_price_devices").select("slug, brand_slug, name, image_url, sort_order, is_active").order("sort_order"),
    admin
      .from("ankauf_price_variants")
      .select(
        "slug, brand_slug, device_slug, name, item_type, base_price_min, base_price_max, demand_level, aliases, eans, image_url, required_accessories, optional_accessories, notes, is_active, updated_at",
      )
      .order("brand_slug")
      .order("sort_order"),
    admin.from("ankauf_price_settings").select("key, numeric_value, text_value"),
  ]);

  const firstError = brandsRes.error ?? devicesRes.error ?? variantsRes.error ?? settingsRes.error;
  const missingMigration = firstError?.code === "42P01";

  const brands = ((brandsRes.data ?? []) as BrandRow[]).sort((a, b) => a.sort_order - b.sort_order);
  const devices = ((devicesRes.data ?? []) as DeviceRow[]).sort((a, b) => a.sort_order - b.sort_order);
  const settings = (settingsRes.data ?? []) as SettingRow[];
  const allVariants = (variantsRes.data ?? []) as VariantRow[];

  const storeCreditBonus = Number(settings.find((item) => item.key === "store_credit_bonus")?.numeric_value ?? 0.1);
  const devicesBySlug = new Map(devices.map((device) => [device.slug, device]));
  const brandsBySlug = new Map(brands.map((brand) => [brand.slug, brand]));

  const variants = allVariants.filter((variant) => {
    if (brandFilter !== "all" && variant.brand_slug !== brandFilter) return false;
    if (typeFilter !== "all" && variant.item_type !== typeFilter) return false;
    if (statusFilter === "active" && !variant.is_active) return false;
    if (statusFilter === "inactive" && variant.is_active) return false;
    if (query) {
      const haystack = [
        variant.name,
        variant.slug,
        variant.brand_slug,
        variant.device_slug,
        ...variant.aliases,
        ...variant.eans,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });

  function buildUrl(overrides: Record<string, string | undefined>) {
    const merged = {
      brand: brandFilter !== "all" ? brandFilter : undefined,
      type: typeFilter !== "all" ? typeFilter : undefined,
      status: statusFilter !== "active" ? statusFilter : undefined,
      q: query || undefined,
      ...overrides,
    };
    const p = new URLSearchParams();
    for (const [key, value] of Object.entries(merged)) {
      if (value) p.set(key, value);
    }
    const s = p.toString();
    return `/admin/ankauf-preise${s ? `?${s}` : ""}`;
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between mb-6">
        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-accent-orange mb-2">
            Ankauf
          </p>
          <h1 className="font-sans text-2xl font-bold text-text-primary">Preis-Katalog</h1>
          <p className="font-sans text-sm text-text-secondary mt-1 max-w-2xl">
            Zentrale Preiswahrheit für das Ankauf-Tool: Marken, Reihen, Varianten,
            Basispreise und Trade-In-Bonus.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 min-w-[280px]">
          <Metric label="Marken" value={String(brands.length)} />
          <Metric label="Varianten" value={String(allVariants.length)} />
          <Metric label="Guthaben" value={`+${Math.round(storeCreditBonus * 100)}%`} />
        </div>
      </div>

      {params.saved && (
        <div className="mb-5 px-4 py-3 bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
          <span className="text-green-600 dark:text-green-400 text-sm font-sans">
            Änderung gespeichert.
          </span>
        </div>
      )}

      {firstError && (
        <div className="mb-6 border border-red-200 bg-red-50 p-4 dark:border-red-900/60 dark:bg-red-950/30">
          <h2 className="font-sans text-sm font-semibold text-red-700 dark:text-red-300">
            {missingMigration ? "Preis-Katalog ist noch nicht in Supabase angelegt." : "Fehler beim Laden."}
          </h2>
          <p className="font-sans text-sm text-red-700/80 dark:text-red-200/80 mt-1">
            {missingMigration
              ? "Führe zuerst die Migration im Supabase SQL Editor aus."
              : firstError.message}
          </p>
          {missingMigration && (
            <code className="mt-3 block font-mono text-xs text-red-800 dark:text-red-200 bg-white/70 dark:bg-black/30 p-3 overflow-x-auto">
              supabase/migrations/20260618_ankauf_price_admin.sql
            </code>
          )}
        </div>
      )}

      {!missingMigration && (
        <>
          <div className="grid xl:grid-cols-[minmax(0,1fr)_360px] gap-6 mb-8">
            <div className="space-y-5">
              <FormSection title="Trade-In Bonus" icon={<SlidersHorizontal size={16} />}>
                <form action={updateStoreCreditBonus} className="grid sm:grid-cols-[1fr_auto] gap-3 items-end">
                  <div>
                    <Label>RetrOase-Guthaben Bonus (%)</Label>
                    <input
                      name="store_credit_bonus_percent"
                      type="number"
                      min={0}
                      max={50}
                      step={1}
                      defaultValue={Math.round(storeCreditBonus * 100)}
                      className="pixel-input w-full text-sm py-2 font-mono"
                    />
                    <p className="font-sans text-xs text-text-secondary mt-1">
                      Aktuell wird im Frontend +{Math.round(storeCreditBonus * 100)}% als Guthaben-Bonus gezeigt.
                    </p>
                  </div>
                  <button type="submit" className="btn-primary py-2 px-4 text-sm">
                    Speichern
                  </button>
                </form>
              </FormSection>

              <FormSection title="Filter" icon={<Database size={16} />}>
                <div className="flex flex-col gap-3">
                  <form method="get" action="/admin/ankauf-preise" className="grid sm:grid-cols-[1fr_auto] gap-2">
                    <input
                      type="search"
                      name="q"
                      defaultValue={query}
                      placeholder="Modell, Slug, Alias oder EAN suchen..."
                      className="pixel-input py-2 text-sm"
                    />
                    <button type="submit" className="btn-secondary py-2 px-4 text-sm">
                      Suchen
                    </button>
                  </form>

                  <div className="flex flex-wrap gap-1">
                    <FilterLink href={buildUrl({ brand: undefined })} active={brandFilter === "all"} label="Alle Marken" />
                    {brands.map((brand) => (
                      <FilterLink
                        key={brand.slug}
                        href={buildUrl({ brand: brand.slug })}
                        active={brandFilter === brand.slug}
                        label={brand.name}
                      />
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    <FilterLink href={buildUrl({ type: undefined })} active={typeFilter === "all"} label="Alle Typen" />
                    {ITEM_TYPES.map((type) => (
                      <FilterLink
                        key={type.value}
                        href={buildUrl({ type: type.value })}
                        active={typeFilter === type.value}
                        label={type.label}
                      />
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    <FilterLink href={buildUrl({ status: undefined })} active={statusFilter === "active"} label="Aktiv" />
                    <FilterLink href={buildUrl({ status: "inactive" })} active={statusFilter === "inactive"} label="Inaktiv" />
                    <FilterLink href={buildUrl({ status: "all" })} active={statusFilter === "all"} label="Alle Status" />
                  </div>
                </div>
              </FormSection>
            </div>

            <div className="space-y-5">
              <CreateBrandForm />
              <CreateDeviceForm brands={brands} />
            </div>
          </div>

          <div className="grid xl:grid-cols-[minmax(0,1fr)_360px] gap-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-sans text-lg font-bold text-text-primary">
                  Varianten ({variants.length})
                </h2>
                <p className="font-sans text-xs text-text-secondary">
                  Basispreis vor Zustand/OVP-Faktor
                </p>
              </div>

              {variants.length === 0 ? (
                <div className="border-2 border-dashed border-border p-10 text-center">
                  <p className="font-sans text-sm text-text-secondary">Keine Variante gefunden.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {variants.map((variant) => (
                    <VariantEditor
                      key={variant.slug}
                      variant={variant}
                      brandName={brandsBySlug.get(variant.brand_slug)?.name ?? variant.brand_slug}
                      deviceName={devicesBySlug.get(variant.device_slug)?.name ?? variant.device_slug}
                    />
                  ))}
                </div>
              )}
            </div>

            <CreateVariantForm brands={brands} devices={devices} />
          </div>
        </>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface border border-border p-3">
      <p className="font-sans text-[10px] font-semibold uppercase tracking-widest text-text-secondary">
        {label}
      </p>
      <p className="font-mono text-xl font-bold text-text-primary mt-1">{value}</p>
    </div>
  );
}

function FormSection({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="bg-surface border border-border p-4">
      <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block font-sans text-xs font-semibold text-text-secondary mb-1">
      {children}
    </label>
  );
}

function FilterLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={`font-sans text-xs px-3 py-1.5 border transition-colors ${
        active
          ? "border-accent-orange text-accent-orange bg-accent-orange/5"
          : "border-border text-text-secondary hover:border-text-secondary/50"
      }`}
    >
      {label}
    </Link>
  );
}

function CreateBrandForm() {
  return (
    <FormSection title="Neue Marke" icon={<Plus size={16} />}>
      <form action={createBrand} className="space-y-3">
        <Field name="name" label="Name" placeholder="Nintendo" required />
        <Field name="slug" label="Slug (leer = auto)" placeholder="nintendo" />
        <Field name="logo_url" label="Logo-URL" placeholder="/images/brands/nintendo.png" />
        <label className="flex items-center gap-2 font-sans text-sm text-text-secondary">
          <input name="is_active" type="checkbox" defaultChecked className="accent-accent-orange" />
          Aktiv
        </label>
        <button type="submit" className="btn-secondary w-full py-2 text-sm">
          Marke anlegen
        </button>
      </form>
    </FormSection>
  );
}

function CreateDeviceForm({ brands }: { brands: BrandRow[] }) {
  return (
    <FormSection title="Neue Reihe / Gerät" icon={<Plus size={16} />}>
      <form action={createDevice} className="space-y-3">
        <div>
          <Label>Marke</Label>
          <select name="brand_slug" required className="pixel-input w-full text-sm py-2">
            {brands.map((brand) => (
              <option key={brand.slug} value={brand.slug}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
        <Field name="name" label="Name" placeholder="Nintendo DS" required />
        <Field name="slug" label="Slug (leer = auto)" placeholder="nintendo-ds" />
        <Field name="image_url" label="Bild-URL" placeholder="/images/ankauf/nintendo-ds.png" />
        <label className="flex items-center gap-2 font-sans text-sm text-text-secondary">
          <input name="is_active" type="checkbox" defaultChecked className="accent-accent-orange" />
          Aktiv
        </label>
        <button type="submit" className="btn-secondary w-full py-2 text-sm">
          Reihe anlegen
        </button>
      </form>
    </FormSection>
  );
}

function CreateVariantForm({ brands, devices }: { brands: BrandRow[]; devices: DeviceRow[] }) {
  return (
    <FormSection title="Neue Variante" icon={<Plus size={16} />}>
      <form action={createVariant} className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>Marke</Label>
            <select name="brand_slug" required className="pixel-input w-full text-sm py-2">
              {brands.map((brand) => (
                <option key={brand.slug} value={brand.slug}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Reihe</Label>
            <select name="device_slug" required className="pixel-input w-full text-sm py-2">
              {devices.map((device) => (
                <option key={device.slug} value={device.slug}>
                  {device.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Field name="name" label="Name" placeholder="Nintendo 3DS XL" required />
        <Field name="slug" label="Slug (leer = auto)" placeholder="nintendo-3ds-xl" />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>Typ</Label>
            <select name="item_type" defaultValue="console" className="pixel-input w-full text-sm py-2">
              {ITEM_TYPES.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Nachfrage</Label>
            <select name="demand_level" defaultValue="steady" className="pixel-input w-full text-sm py-2">
              {DEMAND_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Field name="base_price_min" label="Preis von" type="number" step="0.01" min="0" required />
          <Field name="base_price_max" label="Preis bis" type="number" step="0.01" min="0" required />
        </div>
        <TextArea name="aliases" label="Aliase" placeholder="ds lite, nintendo ds lite" />
        <TextArea name="eans" label="EANs" placeholder="Eine EAN pro Zeile oder mit Komma getrennt" />
        <label className="flex items-center gap-2 font-sans text-sm text-text-secondary">
          <input name="is_active" type="checkbox" defaultChecked className="accent-accent-orange" />
          Aktiv
        </label>
        <button type="submit" className="btn-primary w-full py-2 text-sm">
          Variante anlegen
        </button>
      </form>
    </FormSection>
  );
}

function VariantEditor({
  variant,
  brandName,
  deviceName,
}: {
  variant: VariantRow;
  brandName: string;
  deviceName: string;
}) {
  const updateAction = updateVariant.bind(null, variant.slug);
  const toggleAction = toggleVariantActive.bind(null, variant.slug, !variant.is_active);

  return (
    <details className="bg-surface border border-border open:border-accent-orange/40">
      <summary className="cursor-pointer list-none p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-sans text-sm font-semibold text-text-primary">{variant.name}</h3>
              <span className={`font-sans text-[10px] uppercase tracking-widest px-2 py-0.5 ${variant.is_active ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"}`}>
                {variant.is_active ? "Aktiv" : "Inaktiv"}
              </span>
              <span className="font-sans text-[10px] uppercase tracking-widest px-2 py-0.5 bg-accent-orange/10 text-accent-orange">
                {variant.item_type}
              </span>
            </div>
            <p className="font-sans text-xs text-text-secondary mt-1">
              {brandName} / {deviceName} · <code className="font-mono">{variant.slug}</code>
            </p>
          </div>
          <div className="font-mono text-lg font-bold text-text-primary">
            {Number(variant.base_price_min).toFixed(0)} € - {Number(variant.base_price_max).toFixed(0)} €
          </div>
        </div>
      </summary>

      <div className="border-t border-border p-4">
        <form action={updateAction} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <Field name="name" label="Name" defaultValue={variant.name} required />
            <Field name="image_url" label="Bild-URL" defaultValue={variant.image_url ?? ""} />
          </div>
          <div className="grid sm:grid-cols-4 gap-3">
            <div>
              <Label>Typ</Label>
              <select name="item_type" defaultValue={variant.item_type} className="pixel-input w-full text-sm py-2">
                {ITEM_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Nachfrage</Label>
              <select name="demand_level" defaultValue={variant.demand_level} className="pixel-input w-full text-sm py-2">
                {DEMAND_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>
            <Field name="base_price_min" label="Preis von" type="number" step="0.01" min="0" defaultValue={String(variant.base_price_min)} required />
            <Field name="base_price_max" label="Preis bis" type="number" step="0.01" min="0" defaultValue={String(variant.base_price_max)} required />
          </div>
          <div className="grid lg:grid-cols-2 gap-3">
            <TextArea name="aliases" label="Aliase" defaultValue={variant.aliases.join(", ")} />
            <TextArea name="eans" label="EANs" defaultValue={variant.eans.join(", ")} />
            <TextArea name="required_accessories" label="Pflicht-Zubehör / OVP-Checkliste" defaultValue={variant.required_accessories.join(", ")} placeholder="Stift, Ladegerät, OVP" />
            <TextArea name="optional_accessories" label="Optionales Zubehör" defaultValue={variant.optional_accessories.join(", ")} />
          </div>
          <TextArea name="notes" label="Interne Notiz" defaultValue={variant.notes ?? ""} />

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
            <label className="flex items-center gap-2 font-sans text-sm text-text-secondary">
              <input name="is_active" type="checkbox" defaultChecked={variant.is_active} className="accent-accent-orange" />
              Aktiv im Preistool
            </label>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary py-2 px-4 text-sm">
                Speichern
              </button>
            </div>
          </div>
        </form>

        <form action={toggleAction} className="mt-3">
          <button type="submit" className="font-sans text-xs text-text-secondary hover:text-accent-orange transition-colors">
            {variant.is_active ? "Variante deaktivieren" : "Variante aktivieren"}
          </button>
        </form>
      </div>
    </details>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  defaultValue,
  required,
  min,
  step,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  min?: string;
  step?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        min={min}
        step={step}
        className="pixel-input w-full text-sm py-2"
      />
    </div>
  );
}

function TextArea({
  label,
  name,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <textarea
        name={name}
        rows={2}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="pixel-input w-full text-sm py-2 resize-y"
      />
    </div>
  );
}
