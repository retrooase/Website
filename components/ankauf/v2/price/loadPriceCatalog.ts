import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import { createAdminSupabaseClient, createServerSupabaseClient } from "@/lib/supabase/server";
import {
  FALLBACK_PRICE_CATALOG,
  FALLBACK_STORE_CREDIT_BONUS,
  type CompletenessId,
  type ConditionId,
  type DemandLevel,
  type PriceCatalogData,
  type PriceCompleteness,
  type PriceCondition,
  type PriceVariant,
} from "./priceCatalog";

type BrandRow = {
  slug: string;
  name: string;
  logo_url: string | null;
  sort_order: number;
};

type DeviceRow = {
  slug: string;
  brand_slug: string;
  name: string;
  image_url: string | null;
  sort_order: number;
};

type VariantRow = {
  slug: string;
  brand_slug: string;
  device_slug: string;
  name: string;
  item_type: string;
  base_price_min: number | string;
  base_price_max: number | string;
  demand_level: string;
  aliases: string[] | null;
  image_url: string | null;
  required_accessories: string[] | null;
  optional_accessories: string[] | null;
  sort_order: number;
};

type ConditionRow = {
  id: string;
  label: string;
  factor: number | string;
  hint: string;
  sort_order: number;
};

type CompletenessRow = {
  id: string;
  label: string;
  factor: number | string;
  hint: string;
  sort_order: number;
};

type SettingRow = {
  numeric_value: number | string | null;
};

const ITEM_TYPES: PriceVariant["type"][] = [
  "console",
  "handheld",
  "game",
  "cards",
  "accessory",
  "bundle",
];

const DEMAND_LEVELS: DemandLevel[] = ["hot", "steady", "niche"];
const CONDITION_IDS: ConditionId[] = ["mint", "good", "fair", "defective"];
const COMPLETENESS_IDS: CompletenessId[] = ["boxed", "complete", "loose", "missing"];

function clampBonus(value: number) {
  if (!Number.isFinite(value)) return FALLBACK_STORE_CREDIT_BONUS;
  return Math.max(0, Math.min(0.5, value));
}

function toNumber(value: number | string | null | undefined, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toItemType(value: string): PriceVariant["type"] {
  return ITEM_TYPES.includes(value as PriceVariant["type"])
    ? (value as PriceVariant["type"])
    : "console";
}

function toDemandLevel(value: string): DemandLevel {
  return DEMAND_LEVELS.includes(value as DemandLevel) ? (value as DemandLevel) : "steady";
}

function toConditionId(value: string): ConditionId {
  return CONDITION_IDS.includes(value as ConditionId) ? (value as ConditionId) : "good";
}

function toCompletenessId(value: string): CompletenessId {
  return COMPLETENESS_IDS.includes(value as CompletenessId) ? (value as CompletenessId) : "complete";
}

function fallbackCatalog(source: PriceCatalogData["source"] = "fallback"): PriceCatalogData {
  return { ...FALLBACK_PRICE_CATALOG, source };
}

export async function loadPriceCatalog(): Promise<PriceCatalogData> {
  noStore();

  try {
    // Der Preis-Katalog wird nur serverseitig geladen. Mit Service-Key umgehen wir
    // unvollstaendige Public-RLS-Policies, ohne Secrets an den Browser zu geben.
    const supabase = process.env.SUPABASE_SERVICE_KEY
      ? createAdminSupabaseClient()
      : await createServerSupabaseClient();

    const [settingsRes, brandsRes, devicesRes, variantsRes, conditionsRes, completenessRes] =
      await Promise.all([
        supabase
          .from("ankauf_price_settings")
          .select("numeric_value")
          .eq("key", "store_credit_bonus")
          .maybeSingle(),
        supabase
          .from("ankauf_price_brands")
          .select("slug, name, logo_url, sort_order")
          .eq("is_active", true)
          .order("sort_order"),
        supabase
          .from("ankauf_price_devices")
          .select("slug, brand_slug, name, image_url, sort_order")
          .eq("is_active", true)
          .order("sort_order"),
        supabase
          .from("ankauf_price_variants")
          .select(
            "slug, brand_slug, device_slug, name, item_type, base_price_min, base_price_max, demand_level, aliases, image_url, required_accessories, optional_accessories, sort_order",
          )
          .eq("is_active", true)
          .order("brand_slug")
          .order("sort_order"),
        supabase
          .from("ankauf_price_conditions")
          .select("id, label, factor, hint, sort_order")
          .eq("is_active", true)
          .order("sort_order"),
        supabase
          .from("ankauf_price_completeness")
          .select("id, label, factor, hint, sort_order")
          .eq("is_active", true)
          .order("sort_order"),
      ]);

    const firstError =
      settingsRes.error ??
      brandsRes.error ??
      devicesRes.error ??
      variantsRes.error ??
      conditionsRes.error ??
      completenessRes.error;

    if (firstError) {
      console.warn("[ankauf-price-catalog] Supabase fallback:", firstError.message);
      return fallbackCatalog();
    }

    const brands = ((brandsRes.data ?? []) as BrandRow[]).sort((a, b) => a.sort_order - b.sort_order);
    const devices = ((devicesRes.data ?? []) as DeviceRow[]).sort((a, b) => a.sort_order - b.sort_order);
    const brandBySlug = new Map(brands.map((brand) => [brand.slug, brand]));
    const deviceBySlug = new Map(devices.map((device) => [device.slug, device]));
    const brandSortOrder = new Map(brands.map((brand) => [brand.slug, brand.sort_order]));
    const deviceSortOrder = new Map(devices.map((device) => [device.slug, device.sort_order]));
    const rawVariants = ((variantsRes.data ?? []) as VariantRow[]).sort((a, b) => {
      const brandDiff =
        (brandSortOrder.get(a.brand_slug) ?? 999) - (brandSortOrder.get(b.brand_slug) ?? 999);
      if (brandDiff !== 0) return brandDiff;
      const deviceDiff =
        (deviceSortOrder.get(a.device_slug) ?? 999) - (deviceSortOrder.get(b.device_slug) ?? 999);
      if (deviceDiff !== 0) return deviceDiff;
      return a.sort_order - b.sort_order;
    });

    if (rawVariants.length === 0) return fallbackCatalog();

    const variants: PriceVariant[] = rawVariants.map((variant) => ({
      id: variant.slug,
      brand: brandBySlug.get(variant.brand_slug)?.name ?? variant.brand_slug,
      family: deviceBySlug.get(variant.device_slug)?.name ?? variant.device_slug,
      name: variant.name,
      type: toItemType(variant.item_type),
      baseRange: [
        toNumber(variant.base_price_min, 0),
        toNumber(variant.base_price_max, 0),
      ],
      demand: toDemandLevel(variant.demand_level),
      aliases: variant.aliases ?? [],
      brandLogoUrl: brandBySlug.get(variant.brand_slug)?.logo_url ?? null,
      familyImageUrl: deviceBySlug.get(variant.device_slug)?.image_url ?? null,
      imageUrl: variant.image_url ?? deviceBySlug.get(variant.device_slug)?.image_url ?? null,
      requiredAccessories: variant.required_accessories ?? [],
      optionalAccessories: variant.optional_accessories ?? [],
    }));

    const conditions: PriceCondition[] = ((conditionsRes.data ?? []) as ConditionRow[]).map((condition) => ({
      id: toConditionId(condition.id),
      label: condition.label,
      factor: toNumber(condition.factor, 1),
      hint: condition.hint,
    }));

    const completeness: PriceCompleteness[] = ((completenessRes.data ?? []) as CompletenessRow[]).map((item) => ({
      id: toCompletenessId(item.id),
      label: item.label,
      factor: toNumber(item.factor, 1),
      hint: item.hint,
    }));

    const setting = settingsRes.data as SettingRow | null;

    return {
      variants,
      conditions: conditions.length ? conditions : FALLBACK_PRICE_CATALOG.conditions,
      completeness: completeness.length ? completeness : FALLBACK_PRICE_CATALOG.completeness,
      storeCreditBonus: clampBonus(toNumber(setting?.numeric_value, FALLBACK_STORE_CREDIT_BONUS)),
      source: "supabase",
    };
  } catch (error) {
    console.warn(
      "[ankauf-price-catalog] Supabase fallback:",
      error instanceof Error ? error.message : error,
    );
    return fallbackCatalog();
  }
}
