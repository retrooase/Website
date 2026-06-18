"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Plus, Search, Sparkles, Trash2 } from "lucide-react";
import {
  PRICE_COMPLETENESS,
  PRICE_CONDITIONS,
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

// P10: Trade-In-Bonus — als RetrOase-Guthaben gibt es mehr als bei Sofort-Auszahlung.
// Bewusst ein einzelner Faktor; spaeter ueber den Preis-Admin (Supabase) steuerbar.
const STORE_CREDIT_BONUS = 0.1;

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

export function AnkaufPriceToolV2() {
  const [mode, setMode] = useState<SellMode>("single");
  const [brand, setBrand] = useState("Nintendo");
  const [family, setFamily] = useState("Nintendo DS");
  const [variantId, setVariantId] = useState("nintendo-ds-lite");
  const [condition, setCondition] = useState<ConditionId>(DEFAULT_CONDITION);
  const [completeness, setCompleteness] = useState<CompletenessId>(DEFAULT_COMPLETENESS);
  const [quantity, setQuantity] = useState(1);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<LineItem[]>([]);
  const reduced = useReducedMotion();
  const [reveal, setReveal] = useState<"idle" | "rolling" | "done">("idle");
  const [progress, setProgress] = useState(0);

  const brands = useMemo(() => getBrands(), []);
  const families = useMemo(() => getFamilies(brand), [brand]);
  const variants = useMemo(() => getVariants(brand, family), [brand, family]);
  const searchResults = useMemo(() => searchVariants(query), [query]);

  const selectedVariant = getVariantById(variantId);
  const selectedRange = selectedVariant
    ? calculateRange(selectedVariant, condition, completeness, quantity)
    : null;

  // Der EINE Wert, der am Ende enthuellt wird: im Einzel-Modus das aktuelle Produkt,
  // im Sammlungs-Modus die Summe des Pakets.
  const activeRange: PriceRange =
    mode === "single" ? selectedRange ?? [0, 0] : sumRanges(items);
  const activeMin = activeRange[0];
  const activeMax = activeRange[1];
  const creditRange: PriceRange = [
    activeMin * (1 + STORE_CREDIT_BONUS),
    activeMax * (1 + STORE_CREDIT_BONUS),
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
    const nextFamily = getFamilies(nextBrand)[0] ?? "";
    const nextVariant = nextFamily ? getVariants(nextBrand, nextFamily)[0] : null;
    setBrand(nextBrand);
    setFamily(nextFamily);
    setVariantId(nextVariant?.id ?? "");
  }

  function handleFamilyChange(nextFamily: string) {
    const nextVariant = getVariants(brand, nextFamily)[0] ?? null;
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
        const variant = getVariantById(item.variantId);
        const amount = clampQuantity(nextQuantity);
        return variant
          ? { ...item, quantity: amount, range: calculateRange(variant, item.condition, item.completeness, amount) }
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
      localStorage.setItem(
        "retroase_price_tool_items",
        JSON.stringify(
          source.map((item) => {
            const variant = getVariantById(item.variantId);
            return {
              name: variant?.name,
              brand: variant?.brand,
              family: variant?.family,
              quantity: item.quantity,
              condition: getConditionById(item.condition).label,
              completeness: getCompletenessById(item.completeness).label,
              range: item.range,
            };
          }),
        ),
      );
    } catch {
      // Lokale Speicherung ist nur Komfort, der CTA darf trotzdem funktionieren.
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

      {/* Eingabe: grosse, klare Felder */}
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

        <div className="ak-picker-stack">
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
                {PRICE_CONDITIONS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <small>{getConditionById(condition).hint}</small>
            </label>

            <label>
              <span className="ak-price-label">Vollständigkeit</span>
              <select
                value={completeness}
                onChange={(event) => setCompleteness(event.target.value as CompletenessId)}
              >
                {PRICE_COMPLETENESS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <small>{getCompletenessById(completeness).hint}</small>
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
                const variant = getVariantById(item.variantId);
                if (!variant) return null;
                return (
                  <article key={item.id} className="ak-item-row">
                    <div>
                      <strong>
                        {item.quantity > 1 ? `${item.quantity}× ` : ""}
                        {variant.name}
                      </strong>
                      <span>
                        {variant.brand} / {variant.family} · {getConditionById(item.condition).label}
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
                {getConditionById(condition).label} · {getCompletenessById(completeness).label}
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
                <span className="ak-reveal-badge">+{Math.round(STORE_CREDIT_BONUS * 100)}% Power-Up</span>
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
          disabled={!canReveal}
        >
          <span>{mode === "single" ? "Dieses Produkt anbieten" : "Mit diesem Paket anbieten"}</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
