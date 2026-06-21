"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, ImageIcon, Plus, Search, Sparkles, Trash2 } from "lucide-react";
import {
  FALLBACK_PRICE_CATALOG,
  calculateRange,
  getBrands,
  getCompletenessById,
  getConditionById,
  getFamilies,
  getVariantById,
  getVariants,
  searchVariants,
  type CompletenessId,
  type ConditionId,
  type DemandLevel,
  type PriceCatalogData,
  type PriceRange,
  type PriceVariant,
} from "./priceCatalog";
import { useReducedMotion } from "../lib/hooks";
import { ConfettiBurst } from "../scroll/ConfettiBurst";

type SellMode = "single" | "collection";

interface LineItem {
  id: string;
  variantId: string;
  condition: ConditionId;
  completeness: CompletenessId;
  quantity: number;
  range: PriceRange;
}

const DEFAULT_CONDITION: ConditionId = "good";
const DEFAULT_COMPLETENESS: CompletenessId = "complete";

// Symbole fuer die rotierenden Slot-Walzen waehrend der Aufdeckung.
const SLOT_SYMBOLS = ["🎮", "🕹️", "👾", "💎", "🪙", "⭐", "🏆", "💰"];

function formatEuro(value: number) {
  return `${Math.round(value).toLocaleString("de-DE")} €`;
}

function sumRanges(items: LineItem[]): PriceRange {
  return items.reduce<PriceRange>(
    (total, item) => [total[0] + item.range[0], total[1] + item.range[1]],
    [0, 0],
  );
}

function clampQuantity(value: number) {
  return Math.max(1, Math.min(99, Math.round(value || 1)));
}

function extractQuantityFromText(value: string) {
  const match = value.match(/(?:^|\s|x)(\d{1,2})(?=\s|x|stk|stueck|stück|spiele|games|$)/i);
  return match ? clampQuantity(Number(match[1])) : null;
}

function normalizeConfigText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ÃŸ/g, "ss");
}

function cleanList(values: Array<string | null | undefined>) {
  const seen = new Set<string>();
  return values
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value))
    .filter((value) => {
      const key = normalizeConfigText(value);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function canRenderImage(src?: string | null) {
  if (!src) return false;
  if (src.startsWith("/")) return true;
  try {
    const url = new URL(src);
    return (
      url.hostname.endsWith(".supabase.co") ||
      url.hostname === "i.ebayimg.com" ||
      url.hostname === "placehold.co"
    );
  } catch {
    return false;
  }
}

function getVariantImage(variant?: PriceVariant | null) {
  return variant?.imageUrl ?? variant?.familyImageUrl ?? null;
}

function getBrandLogo(brand: string, variants: PriceVariant[]) {
  return variants.find((variant) => variant.brand === brand && variant.brandLogoUrl)?.brandLogoUrl ?? null;
}

function getBrandMark(brand: string) {
  const normalized = normalizeConfigText(brand);
  if (normalized.includes("nintendo")) return "N";
  if (normalized.includes("sony") || normalized.includes("playstation")) return "PS";
  if (normalized.includes("microsoft") || normalized.includes("xbox")) return "X";
  if (normalized.includes("pokemon")) return "PK";
  if (normalized.includes("zubehor")) return "ZB";
  return brand.slice(0, 2).toUpperCase();
}

function getTypeLabel(type: PriceVariant["type"]) {
  const labels: Record<PriceVariant["type"], string> = {
    console: "Konsole",
    handheld: "Handheld",
    game: "Spiel",
    cards: "Karten",
    accessory: "Zubehör",
    bundle: "Bundle",
  };
  return labels[type];
}

function getDemandLabel(demand: DemandLevel) {
  if (demand === "hot") return "gefragt";
  if (demand === "niche") return "speziell";
  return "stabil";
}

function getEquipmentPlan(variant?: PriceVariant | null) {
  const required = cleanList(variant?.requiredAccessories ?? []);
  const optional = cleanList(variant?.optionalAccessories ?? []);
  if (required.length || optional.length) return { required, optional, source: "catalog" as const };

  const text = normalizeConfigText([variant?.brand, variant?.family, variant?.name, variant?.type].filter(Boolean).join(" "));

  if (!variant) return { required: ["Produkt"], optional: ["Originalverpackung", "Zubehor"], source: "fallback" as const };
  if (variant.type === "cards" || text.includes("karten") || text.includes("pokemon")) {
    return {
      required: ["Karten"],
      optional: ["Binder", "Sleeves", "Toploader"],
      source: "fallback" as const,
    };
  }
  if (variant.type === "game" || text.includes("spiel")) {
    return {
      required: ["Spielmodul / Disc"],
      optional: ["Originalverpackung", "Anleitung", "Schutzhulle"],
      source: "fallback" as const,
    };
  }
  if (text.includes("switch lite")) {
    return {
      required: ["Ladegerat / Netzteil"],
      optional: ["Originalverpackung", "Tasche", "Displayschutz"],
      source: "fallback" as const,
    };
  }
  if (text.includes("switch")) {
    return {
      required: ["Dock", "Joy-Con links/rechts", "Netzteil", "HDMI-Kabel"],
      optional: ["Originalverpackung", "Joy-Con-Grip", "Handgelenkschlaufen"],
      source: "fallback" as const,
    };
  }
  if (text.includes("ds") || text.includes("3ds") || text.includes("gba sp")) {
    return {
      required: ["Ladegerat / Netzteil", "Stift / Stylus"],
      optional: ["Originalverpackung", "Anleitung", "Tasche"],
      source: "fallback" as const,
    };
  }
  if (text.includes("game boy") || text.includes("gameboy")) {
    return {
      required: ["Batteriedeckel"],
      optional: ["Originalverpackung", "Anleitung", "Tasche"],
      source: "fallback" as const,
    };
  }
  if (text.includes("playstation") || text.includes("ps5") || text.includes("ps4") || text.includes("xbox")) {
    return {
      required: ["Controller", "Netzteil", "HDMI-Kabel"],
      optional: ["Originalverpackung", "Anleitung", "Zweiter Controller"],
      source: "fallback" as const,
    };
  }

  return {
    required: ["Produkt", "Kabel / Netzteil"],
    optional: ["Originalverpackung", "Anleitung", "Weiteres Zubehor"],
    source: "fallback" as const,
  };
}

function VisualImage({
  src,
  alt,
  className,
  sizes,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  sizes: string;
}) {
  if (!src || !canRenderImage(src)) return null;
  const imageSrc = src;
  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      unoptimized={imageSrc.startsWith("http")}
    />
  );
}

function ProductFallback({ variant }: { variant?: PriceVariant | null }) {
  return (
    <div className="ak-product-fallback" aria-hidden="true">
      <ImageIcon size={22} />
      <strong>{variant ? getBrandMark(variant.name) : "RO"}</strong>
      <span>{variant ? getTypeLabel(variant.type) : "Produkt"}</span>
    </div>
  );
}

type AnkaufPriceToolV2Props = {
  catalog?: PriceCatalogData;
  offerCtaLabel?: string;
  onOfferStart?: () => void;
  requireRevealBeforeOffer?: boolean;
};

export function AnkaufPriceToolV2({
  catalog = FALLBACK_PRICE_CATALOG,
  offerCtaLabel,
  onOfferStart,
  requireRevealBeforeOffer = false,
}: AnkaufPriceToolV2Props) {
  const catalogVariants = catalog.variants.length ? catalog.variants : FALLBACK_PRICE_CATALOG.variants;
  const catalogConditions = catalog.conditions.length ? catalog.conditions : FALLBACK_PRICE_CATALOG.conditions;
  const catalogCompleteness = catalog.completeness.length
    ? catalog.completeness
    : FALLBACK_PRICE_CATALOG.completeness;
  const storeCreditBonus = Math.max(0, Math.min(0.5, catalog.storeCreditBonus));
  const initialVariant =
    catalogVariants.find((variant) => variant.id === "nintendo-ds-lite") ??
    catalogVariants[0] ??
    FALLBACK_PRICE_CATALOG.variants[0];

  const [mode, setMode] = useState<SellMode>("single");
  const [brand, setBrand] = useState(initialVariant?.brand ?? "Nintendo");
  const [family, setFamily] = useState(initialVariant?.family ?? "Nintendo DS");
  const [variantId, setVariantId] = useState(initialVariant?.id ?? "nintendo-ds-lite");
  const [condition, setCondition] = useState<ConditionId>(DEFAULT_CONDITION);
  const [completeness, setCompleteness] = useState<CompletenessId>(DEFAULT_COMPLETENESS);
  const [quantity, setQuantity] = useState(1);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<LineItem[]>([]);
  const reduced = useReducedMotion();
  const [reveal, setReveal] = useState<"idle" | "rolling" | "done">("idle");
  const [progress, setProgress] = useState(0);

  const brands = useMemo(() => getBrands(catalogVariants), [catalogVariants]);
  const families = useMemo(() => getFamilies(brand, catalogVariants), [brand, catalogVariants]);
  const variants = useMemo(() => getVariants(brand, family, catalogVariants), [brand, family, catalogVariants]);
  const searchResults = useMemo(() => searchVariants(query, catalogVariants), [query, catalogVariants]);

  const selectedVariant = getVariantById(variantId, catalogVariants);
  const selectedRange = selectedVariant
    ? calculateRange(selectedVariant, condition, completeness, quantity, catalogConditions, catalogCompleteness)
    : null;
  const selectedEquipment = useMemo(() => getEquipmentPlan(selectedVariant), [selectedVariant]);

  useEffect(() => {
    if (getVariantById(variantId, catalogVariants) || catalogVariants.length === 0) return;
    const nextVariant = catalogVariants[0];
    setBrand(nextVariant.brand);
    setFamily(nextVariant.family);
    setVariantId(nextVariant.id);
  }, [catalogVariants, variantId]);

  useEffect(() => {
    if (!catalogConditions.some((item) => item.id === condition) && catalogConditions[0]) {
      setCondition(catalogConditions[0].id);
    }
    if (!catalogCompleteness.some((item) => item.id === completeness) && catalogCompleteness[0]) {
      setCompleteness(catalogCompleteness[0].id);
    }
  }, [catalogCompleteness, catalogConditions, completeness, condition]);

  // Der EINE Wert, der am Ende enthuellt wird: im Einzel-Modus das aktuelle Produkt,
  // im Sammlungs-Modus die Summe des Pakets.
  const activeRange: PriceRange =
    mode === "single" ? selectedRange ?? [0, 0] : sumRanges(items);
  const activeMin = activeRange[0];
  const activeMax = activeRange[1];
  const creditRange: PriceRange = [
    activeMin * (1 + storeCreditBonus),
    activeMax * (1 + storeCreditBonus),
  ];
  const canReveal =
    mode === "single" ? Boolean(selectedVariant && selectedRange) : items.length > 0;

  // Jede Aenderung am Wert blendet ein bereits aufgedecktes Ergebnis wieder aus,
  // damit nie ein veralteter Preis stehen bleibt.
  useEffect(() => {
    setReveal("idle");
  }, [activeMin, activeMax, mode]);

  // Aufdeckung: die Slot-Walzen drehen ~1,6 s, dann steht das Ergebnis.
  useEffect(() => {
    if (reveal !== "rolling") return;
    if (reduced) {
      setReveal("done");
      return;
    }
    const timeout = window.setTimeout(() => setReveal("done"), 1600);
    return () => window.clearTimeout(timeout);
  }, [reveal, reduced]);

  // Nach der Aufdeckung zaehlen die Zahlen hoch (easeOutCubic). reduced -> sofort voll.
  useEffect(() => {
    if (reveal !== "done") {
      setProgress(0);
      return;
    }
    if (reduced) {
      setProgress(1);
      return;
    }
    let raf = 0;
    let start = 0;
    const duration = 850;
    const step = (ts: number) => {
      if (!start) start = ts;
      const t = Math.min(1, (ts - start) / duration);
      setProgress(1 - Math.pow(1 - t, 3));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reveal, reduced]);

  function changeMode(next: SellMode) {
    if (next === mode) return;
    setMode(next);
    setReveal("idle");
    if (next === "single") setQuantity(1);
  }

  function revealValue() {
    if (!canReveal) return;
    setProgress(0);
    setReveal("rolling");
  }

  function selectVariant(variant: PriceVariant) {
    setBrand(variant.brand);
    setFamily(variant.family);
    setVariantId(variant.id);
    if (mode === "collection") {
      const queryQuantity = extractQuantityFromText(query);
      if (queryQuantity) setQuantity(queryQuantity);
    }
    setQuery("");
  }

  function handleBrandChange(nextBrand: string) {
    const nextFamily = getFamilies(nextBrand, catalogVariants)[0] ?? "";
    const nextVariant = nextFamily ? getVariants(nextBrand, nextFamily, catalogVariants)[0] : null;
    setBrand(nextBrand);
    setFamily(nextFamily);
    setVariantId(nextVariant?.id ?? "");
  }

  function handleFamilyChange(nextFamily: string) {
    const nextVariant = getVariants(brand, nextFamily, catalogVariants)[0] ?? null;
    setFamily(nextFamily);
    setVariantId(nextVariant?.id ?? "");
  }

  function addItem() {
    if (!selectedVariant || !selectedRange) return;
    const id = `${selectedVariant.id}-${Date.now()}`;
    setItems((current) => [
      ...current,
      {
        id,
        variantId: selectedVariant.id,
        condition,
        completeness,
        quantity: clampQuantity(quantity),
        range: selectedRange,
      },
    ]);
    setQuantity(1);
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function updateItemQuantity(id: string, nextQuantity: number) {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        const variant = getVariantById(item.variantId, catalogVariants);
        const amount = clampQuantity(nextQuantity);
        return variant
          ? {
              ...item,
              quantity: amount,
              range: calculateRange(
                variant,
                item.condition,
                item.completeness,
                amount,
                catalogConditions,
                catalogCompleteness,
              ),
            }
          : item;
      }),
    );
  }

  function scrollToForm() {
    const source: LineItem[] =
      mode === "collection"
        ? items
        : selectedVariant && selectedRange
          ? [
              {
                id: "single",
                variantId: selectedVariant.id,
                condition,
                completeness,
                quantity: clampQuantity(quantity),
                range: selectedRange,
              },
            ]
          : [];
    try {
      const items = source.map((item) => {
            const variant = getVariantById(item.variantId, catalogVariants);
            return {
              variantId: item.variantId,
              name: variant?.name,
              brand: variant?.brand,
              family: variant?.family,
              quantity: item.quantity,
              condition: getConditionById(item.condition, catalogConditions).label,
              completeness: getCompletenessById(item.completeness, catalogCompleteness).label,
              range: item.range,
            };
          });

      localStorage.setItem(
        "retroase_price_tool_items",
        JSON.stringify({
          version: 2,
          source: "ankauf-price-tool-v2",
          mode,
          savedAt: Date.now(),
          items,
        }),
      );
    } catch {
      // Lokale Speicherung ist nur Komfort, der CTA darf trotzdem funktionieren.
    }

    if (onOfferStart) {
      onOfferStart();
      return;
    }

    document.getElementById("angebot")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="ak-price-tool" aria-label="Ankauf Preisrechner">
      {/* Kopf: Titel + Modus-Wahl */}
      <div className="ak-price-head">
        <span className="ak-chip">
          <Sparkles size={14} />
          Preis-Vault
        </span>
        <h3 className="ak-display ak-price-title">Was ist es wert?</h3>
        <p className="ak-price-subtitle">
          Wähl, ob du ein einzelnes Produkt oder eine ganze Sammlung verkaufst — den Wert
          enthüllst du am Ende mit einem Klick.
        </p>

        <div className="ak-mode-toggle" role="tablist" aria-label="Was möchtest du verkaufen?">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "single"}
            className={`ak-mode-tab ${mode === "single" ? "is-active" : ""}`}
            onClick={() => changeMode("single")}
          >
            <span className="ak-mode-emoji" aria-hidden="true">🎮</span>
            <span className="ak-mode-label">Einzelnes Produkt</span>
            <span className="ak-mode-hint">Eine Konsole, ein Spiel, ein Teil</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "collection"}
            className={`ak-mode-tab ${mode === "collection" ? "is-active" : ""}`}
            onClick={() => changeMode("collection")}
          >
            <span className="ak-mode-emoji" aria-hidden="true">📦</span>
            <span className="ak-mode-label">Ganze Sammlung</span>
            <span className="ak-mode-hint">Mehrere Sachen zusammen</span>
          </button>
        </div>
      </div>

      {/* Eingabe: visueller Setup-Builder */}
      <section className="ak-picker-panel" aria-label="Produkt auswählen">
        <label className="ak-price-label" htmlFor="ak-price-search">
          {mode === "single" ? "Was möchtest du verkaufen?" : "Produkt suchen"}
        </label>
        <div className="ak-search-wrap ak-search-lg">
          <Search size={20} />
          <input
            id="ak-price-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="z.B. PlayStation 5, Game Boy, Pokémon Karten…"
          />
        </div>

        {query && (
          <div className="ak-search-results">
            {searchResults.length > 0 ? (
              searchResults.map((variant) => (
                <button key={variant.id} type="button" onClick={() => selectVariant(variant)}>
                  <span>{variant.name}</span>
                  <small>
                    {variant.brand} / {variant.family}
                  </small>
                </button>
              ))
            ) : (
              <p>Kein direkter Treffer — wähl es unten einfach manuell aus.</p>
            )}
          </div>
        )}

        <div className="ak-config-step">
          <div className="ak-config-step-head">
            <span className="ak-config-step-number">01</span>
            <div>
              <span className="ak-price-label">Marke</span>
              <strong>Wähl dein System</strong>
            </div>
          </div>
          <div className="ak-brand-grid" role="listbox" aria-label="Marke">
            {brands.map((item) => {
              const logo = getBrandLogo(item, catalogVariants);
              const count = catalogVariants.filter((variant) => variant.brand === item).length;
              return (
                <button
                  key={item}
                  type="button"
                  className={item === brand ? "is-active" : ""}
                  onClick={() => handleBrandChange(item)}
                  aria-selected={item === brand}
                >
                  <span className="ak-brand-logo">
                    <VisualImage
                      src={logo}
                      alt={`${item} Logo`}
                      className="ak-brand-logo-img"
                      sizes="72px"
                    />
                    {!canRenderImage(logo) && <strong>{getBrandMark(item)}</strong>}
                  </span>
                  <span>
                    {item}
                    <small>{count} Option{count === 1 ? "" : "en"}</small>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="ak-config-step">
          <div className="ak-config-step-head">
            <span className="ak-config-step-number">02</span>
            <div>
              <span className="ak-price-label">Reihe</span>
              <strong>Grenz es ein</strong>
            </div>
          </div>
          <div className="ak-family-rail" role="listbox" aria-label="Reihe">
            {families.map((item) => {
              const familyVariants = getVariants(brand, item, catalogVariants);
              const image = getVariantImage(familyVariants[0]);
              return (
                <button
                  key={item}
                  type="button"
                  className={item === family ? "is-active" : ""}
                  onClick={() => handleFamilyChange(item)}
                  aria-selected={item === family}
                >
                  <span className="ak-family-mini">
                    <VisualImage
                      src={image}
                      alt={item}
                      className="ak-family-mini-img"
                      sizes="54px"
                    />
                    {!canRenderImage(image) && <span>{getBrandMark(item)}</span>}
                  </span>
                  <strong>{item}</strong>
                  <small>{familyVariants.length} Modell{familyVariants.length === 1 ? "" : "e"}</small>
                </button>
              );
            })}
          </div>
        </div>

        <div className="ak-config-step">
          <div className="ak-config-step-head">
            <span className="ak-config-step-number">03</span>
            <div>
              <span className="ak-price-label">Modell</span>
              <strong>Such dir die genaue Version aus</strong>
            </div>
          </div>
          <div className="ak-model-grid" role="listbox" aria-label="Modell">
            {variants.map((variant) => {
              const image = getVariantImage(variant);
              const equipment = getEquipmentPlan(variant);
              const active = variant.id === variantId;
              return (
                <button
                  key={variant.id}
                  type="button"
                  className={active ? "is-active" : ""}
                  onClick={() => setVariantId(variant.id)}
                  aria-selected={active}
                >
                  <span className="ak-model-visual">
                    <VisualImage
                      src={image}
                      alt={variant.name}
                      className="ak-model-img"
                      sizes="(max-width: 620px) 42vw, 180px"
                    />
                    {!canRenderImage(image) && <ProductFallback variant={variant} />}
                    {active && (
                      <span className="ak-model-check">
                        <CheckCircle2 size={16} />
                      </span>
                    )}
                  </span>
                  <span className="ak-model-copy">
                    <small>{getTypeLabel(variant.type)} / {getDemandLabel(variant.demand)}</small>
                    <strong>{variant.name}</strong>
                    <em>{formatEuro(variant.baseRange[0])} - {formatEuro(variant.baseRange[1])}</em>
                  </span>
                  <span className="ak-model-equipment">
                    {[...equipment.required, ...equipment.optional].slice(0, 3).map((entry) => (
                      <i key={entry}>{entry}</i>
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="ak-config-details">
          <div className="ak-config-fields">
            <label>
              <span className="ak-price-label">Zustand</span>
              <select value={condition} onChange={(event) => setCondition(event.target.value as ConditionId)}>
                {catalogConditions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <small>{getConditionById(condition, catalogConditions).hint}</small>
            </label>

            <label>
              <span className="ak-price-label">Vollständigkeit</span>
              <select
                value={completeness}
                onChange={(event) => setCompleteness(event.target.value as CompletenessId)}
              >
                {catalogCompleteness.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <small>{getCompletenessById(completeness, catalogCompleteness).hint}</small>
            </label>
          </div>

          <div className="ak-loadout-panel">
            <div className="ak-loadout-head">
              <span className="ak-price-label">Ausstattung</span>
              <strong>{selectedVariant?.name ?? "Produkt"}</strong>
            </div>
            <div className="ak-loadout-groups">
              <div>
                <span>Wichtig</span>
                {selectedEquipment.required.map((entry) => (
                  <p key={entry}>
                    <CheckCircle2 size={14} />
                    {entry}
                  </p>
                ))}
              </div>
              {selectedEquipment.optional.length > 0 && (
                <div>
                  <span>Optional</span>
                  {selectedEquipment.optional.map((entry) => (
                    <p key={entry}>
                      <Plus size={14} />
                      {entry}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {mode === "collection" && (
            <div className="ak-add-row">
              <label>
                <span className="ak-price-label">Anzahl</span>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={quantity}
                  onChange={(event) => setQuantity(clampQuantity(Number(event.target.value)))}
                />
              </label>
              <button type="button" className="ak-add-item" onClick={addItem} disabled={!selectedVariant}>
                <Plus size={20} />
                Produkt hinzufügen
              </button>
            </div>
          )}
        </div>

        <div className="ak-picker-stack ak-picker-stack-legacy" hidden>
          <div>
            <span className="ak-price-label">Marke</span>
            <div className="ak-brand-row">
              {brands.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={item === brand ? "is-active" : ""}
                  onClick={() => handleBrandChange(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="ak-field-grid">
            <label>
              <span className="ak-price-label">Reihe</span>
              <select value={family} onChange={(event) => handleFamilyChange(event.target.value)}>
                {families.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="ak-price-label">Modell</span>
              <select value={variantId} onChange={(event) => setVariantId(event.target.value)}>
                {variants.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="ak-field-grid">
            <label>
              <span className="ak-price-label">Zustand</span>
              <select value={condition} onChange={(event) => setCondition(event.target.value as ConditionId)}>
                {catalogConditions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <small>{getConditionById(condition, catalogConditions).hint}</small>
            </label>

            <label>
              <span className="ak-price-label">Vollständigkeit</span>
              <select
                value={completeness}
                onChange={(event) => setCompleteness(event.target.value as CompletenessId)}
              >
                {catalogCompleteness.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <small>{getCompletenessById(completeness, catalogCompleteness).hint}</small>
            </label>
          </div>

          {mode === "collection" && (
            <div className="ak-add-row">
              <label>
                <span className="ak-price-label">Anzahl</span>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={quantity}
                  onChange={(event) => setQuantity(clampQuantity(Number(event.target.value)))}
                />
              </label>
              <button type="button" className="ak-add-item" onClick={addItem} disabled={!selectedVariant}>
                <Plus size={20} />
                Produkt hinzufügen
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Sammlung: Liste der Produkte (ohne Einzelpreis) */}
      {mode === "collection" && (
        <section className="ak-paket-panel" aria-label="Dein Paket">
          <div className="ak-paket-head">
            <span className="ak-mode-emoji" aria-hidden="true">📦</span>
            <div>
              <span className="ak-eyebrow">Dein Paket</span>
              <h4>
                {items.length === 0
                  ? "Noch leer"
                  : `${items.length} Produkt${items.length === 1 ? "" : "e"} drin`}
              </h4>
            </div>
          </div>

          <div className="ak-item-list">
            {items.length === 0 ? (
              <div className="ak-empty-package">
                <strong>Noch nichts im Paket.</strong>
                <span>Wähl oben ein Produkt aus und füg es hinzu.</span>
              </div>
            ) : (
              items.map((item) => {
                const variant = getVariantById(item.variantId, catalogVariants);
                if (!variant) return null;
                return (
                  <article key={item.id} className="ak-item-row">
                    <div>
                      <strong>
                        {item.quantity > 1 ? `${item.quantity}× ` : ""}
                        {variant.name}
                      </strong>
                      <span>
                        {variant.brand} / {variant.family} ·{" "}
                        {getConditionById(item.condition, catalogConditions).label}
                      </span>
                    </div>
                    <div className="ak-item-actions">
                      <input
                        aria-label={`Anzahl für ${variant.name}`}
                        type="number"
                        min={1}
                        max={99}
                        value={item.quantity}
                        onChange={(event) => updateItemQuantity(item.id, Number(event.target.value))}
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`${variant.name} entfernen`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* Einzel-Modus: kompakte Produkt-Zusammenfassung (ohne Preis) */}
      {mode === "single" && selectedVariant && (
        <section className="ak-paket-panel" aria-label="Dein Produkt">
          <div className="ak-single-summary">
            <span className="ak-mode-emoji" aria-hidden="true">🎮</span>
            <div>
              <strong>{selectedVariant.name}</strong>
              <span>
                {selectedVariant.brand} / {selectedVariant.family} ·{" "}
                {getConditionById(condition, catalogConditions).label} ·{" "}
                {getCompletenessById(completeness, catalogCompleteness).label}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* DER eine Ort fuer den Wert: Enthuellen */}
      <div className="ak-reveal-zone" data-state={reveal}>
        {!canReveal && (
          <p className="ak-reveal-empty">
            {mode === "single"
              ? "Wähl oben dein Produkt aus, dann kannst du den Wert enthüllen."
              : "Füg mindestens ein Produkt hinzu, dann kannst du den Wert enthüllen."}
          </p>
        )}

        {canReveal && reveal === "idle" && (
          <button type="button" className="ak-reveal-trigger" onClick={revealValue}>
            <span className="ak-reveal-trigger-main">
              <Sparkles size={20} />
              Wert enthüllen
            </span>
            <small>Effektive Auszahlung — oder mehr als RetrOase-Guthaben?</small>
          </button>
        )}

        {canReveal && reveal === "rolling" && (
          <div className="ak-slot-stage" aria-hidden="true">
            <div className="ak-slot3">
              {[0, 1, 2].map((reel) => (
                <div key={reel} className="ak-slot3-reel">
                  <div className="ak-slot3-strip" style={{ animationDelay: `${reel * 0.14}s` }}>
                    {[...SLOT_SYMBOLS, ...SLOT_SYMBOLS].map((symbol, idx) => (
                      <span key={idx}>{symbol}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="ak-slot-caption">Dein Wert wird ermittelt…</p>
            <ConfettiBurst enabled={!reduced} count={130} />
          </div>
        )}

        {canReveal && reveal === "done" && (
          <>
            <div className="ak-reveal-result" aria-live="polite">
              <div className="ak-reveal-card ak-reveal-cash">
                <span className="ak-reveal-kicker">💸 Effektive Auszahlung</span>
                <strong>
                  {formatEuro(activeMin * progress)} – {formatEuro(activeMax * progress)}
                </strong>
                <small>Sofort &amp; direkt aufs Konto</small>
              </div>

              <div className="ak-reveal-or">
                <span>oder</span>
              </div>

              <div className="ak-reveal-card ak-reveal-credit">
                <span className="ak-reveal-badge">+{Math.round(storeCreditBonus * 100)}% Power-Up</span>
                <span className="ak-reveal-kicker">🪙 RetrOase Guthaben</span>
                <strong>
                  {formatEuro(creditRange[0] * progress)} – {formatEuro(creditRange[1] * progress)}
                </strong>
                <small>Trade-In Bonus · im Shop einlösbar</small>
              </div>
            </div>
            <p className="ak-reveal-note">
              Unverbindlicher Richtwert. Das Power-Up gibt&apos;s als RetrOase-Guthaben — das finale
              Angebot bestätigen wir nach kurzer Prüfung.
            </p>
          </>
        )}
      </div>

      {/* CTA */}
      <div className="ak-tool-footer">
        <p>Unverbindlich &amp; kostenlos — du entscheidest am Ende, ob du verkaufst.</p>
        <button
          type="button"
          className="ak-cta ak-price-cta"
          onClick={scrollToForm}
          disabled={!canReveal || (requireRevealBeforeOffer && reveal !== "done")}
        >
          <span>
            {offerCtaLabel ??
              (mode === "single" ? "Dieses Produkt anbieten" : "Mit diesem Paket anbieten")}
          </span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
