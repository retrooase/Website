"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  Loader2,
  PackageCheck,
  X,
} from "lucide-react";
import { SITE } from "@/lib/constants";
import { type SellType, type WizardData, type WizardErrors } from "./types";
import { WizardProgress } from "./WizardProgress";
import { WizardStep1Type } from "./WizardStep1Type";
import { WizardStep2Contact } from "./WizardStep2Contact";
import { WizardStep3Details } from "./WizardStep3Details";
import { WizardStep4Photos } from "./WizardStep4Photos";
import { WizardStep5Summary } from "./WizardStep5Summary";

const INITIAL: WizardData = {
  sellType: null,
  name: "",
  email: "",
  phone: "",
  plz: "",
  productName: "",
  category: "",
  platform: "",
  condition: "",
  completeness: "",
  description: "",
  desiredPrice: "",
  quantity: "1",
  photos: [],
  acceptTerms: false,
  acceptPrivacy: false,
};

const PRICE_TOOL_STORAGE_KEY = "retroase_price_tool_items";

type PriceToolItem = {
  name?: string;
  brand?: string;
  family?: string;
  quantity?: number;
  condition?: string;
  completeness?: string;
  range?: [number, number];
};

type PriceToolImportPayload = {
  version?: number;
  source?: string;
  savedAt?: number;
  items?: unknown;
};

type PrefillSummary = {
  count: number;
  label: string;
  rangeLabel: string | null;
};

const PRICE_TOOL_IMPORT_MAX_AGE_MS = 20 * 60 * 1000;

function formatEuro(value: number) {
  return `${Math.round(value).toLocaleString("de-DE")} €`;
}

function isPriceToolItem(value: unknown): value is PriceToolItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.name === "string" || typeof item.brand === "string" || typeof item.family === "string";
}

function readPriceToolImport(): PriceToolItem[] {
  const raw = localStorage.getItem(PRICE_TOOL_STORAGE_KEY);
  if (!raw) return [];

  const parsed = JSON.parse(raw) as PriceToolImportPayload | unknown[];

  // Alte Builds speicherten nur ein Array. Diese Daten koennen stale sein und werden
  // bewusst entfernt, damit nicht alte Pakete in neue Anfragen rutschen.
  if (Array.isArray(parsed)) {
    localStorage.removeItem(PRICE_TOOL_STORAGE_KEY);
    return [];
  }

  if (!parsed || typeof parsed !== "object") return [];
  const payload = parsed as PriceToolImportPayload;
  if (
    payload.version !== 2 ||
    payload.source !== "ankauf-price-tool-v2" ||
    typeof payload.savedAt !== "number" ||
    !Array.isArray(payload.items)
  ) {
    localStorage.removeItem(PRICE_TOOL_STORAGE_KEY);
    return [];
  }

  const isFresh = Date.now() - payload.savedAt <= PRICE_TOOL_IMPORT_MAX_AGE_MS;
  if (!isFresh) {
    localStorage.removeItem(PRICE_TOOL_STORAGE_KEY);
    return [];
  }

  return payload.items.filter(isPriceToolItem);
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss");
}

function clampQuantity(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(1, Math.min(9999, Math.round(parsed))) : 1;
}

function mapCondition(value: string | undefined) {
  const normalized = normalizeText(value ?? "");
  if (normalized.includes("sehr") || normalized.includes("mint")) return "Sehr Gut";
  if (normalized.includes("defekt")) return "Defekt";
  if (normalized.includes("akzept") || normalized.includes("fair")) return "Akzeptabel";
  return "Gut";
}

function mapCompleteness(value: string | undefined) {
  const normalized = normalizeText(value ?? "");
  if (normalized.includes("ovp") || normalized.includes("boxed")) return "Vollständig (mit OVP)";
  if (normalized.includes("komplett") || normalized.includes("complete")) return "Ohne OVP";
  if (normalized.includes("nur") || normalized.includes("lose") || normalized.includes("unvoll")) {
    return "Nur Gerät / kein Zubehör";
  }
  return "Nicht anwendbar";
}

function mapCategory(item: PriceToolItem) {
  const text = normalizeText([item.brand, item.family, item.name].filter(Boolean).join(" "));
  if (text.includes("pokemon")) return "Pokémon";
  if (text.includes("game boy") || text.includes("gameboy")) return "Game Boy";
  if (text.includes("sony") || text.includes("playstation") || text.includes("ps5") || text.includes("ps4")) {
    return "PlayStation";
  }
  if (text.includes("zubehor") || text.includes("controller")) return "Zubehör";
  if (text.includes("nintendo") || text.includes("switch") || text.includes("ds") || text.includes("gamecube")) {
    return "Nintendo";
  }
  return "Retro";
}

function getSellType(items: PriceToolItem[]): SellType {
  const allText = normalizeText(items.map((item) => `${item.brand ?? ""} ${item.name ?? ""}`).join(" "));
  if (allText.includes("pokemon")) return "pokemon";
  if (allText.includes("zubehor") || allText.includes("controller")) return "zubehoer";
  if (items.some((item) => normalizeText(item.condition ?? "").includes("defekt"))) return "defekt";
  if (items.length > 1) return "mehrere";
  return "einzeln";
}

function itemLabel(item: PriceToolItem) {
  const quantity = clampQuantity(item.quantity);
  const name = item.name ?? "Unbekanntes Produkt";
  return quantity > 1 ? `${quantity}x ${name}` : name;
}

function getTotalRange(items: PriceToolItem[]): [number, number] | null {
  const ranges = items
    .map((item) => item.range)
    .filter((range): range is [number, number] => Array.isArray(range) && range.length === 2);
  if (ranges.length === 0) return null;
  return ranges.reduce<[number, number]>(
    (total, range) => [total[0] + Number(range[0] || 0), total[1] + Number(range[1] || 0)],
    [0, 0],
  );
}

function buildProductName(items: PriceToolItem[]) {
  if (items.length === 1) return itemLabel(items[0]);
  const preview = items.slice(0, 3).map(itemLabel).join(", ");
  const rest = items.length > 3 ? ` + ${items.length - 3} weitere` : "";
  return `Paket: ${preview}${rest}`;
}

function buildDescription(items: PriceToolItem[], totalRange: [number, number] | null) {
  const lines = items.map((item) => {
    const rangeLabel = item.range ? `, Schätzung: ${formatEuro(item.range[0])} - ${formatEuro(item.range[1])}` : "";
    return `- ${itemLabel(item)} (${[item.brand, item.family].filter(Boolean).join(" / ") || "ohne Kategorie"}), Zustand: ${item.condition ?? "nicht angegeben"}, Vollständigkeit: ${item.completeness ?? "nicht angegeben"}${rangeLabel}`;
  });
  const total = totalRange
    ? `\nGesamtschätzung aus dem Preisschätzer: ${formatEuro(totalRange[0])} - ${formatEuro(totalRange[1])}`
    : "";

  return `Aus dem RetrOase-Preisschätzer übernommen:\n${lines.join("\n")}${total}\n\nBitte final prüfen und Angebot senden.`;
}

function buildPrefill(items: PriceToolItem[]) {
  const first = items[0];
  const totalRange = getTotalRange(items);
  const distinctFamilies = Array.from(new Set(items.map((item) => item.family).filter(Boolean) as string[]));
  const totalQuantity = items.reduce((sum, item) => sum + clampQuantity(item.quantity), 0);
  const categories = Array.from(new Set(items.map(mapCategory)));
  const category = categories.length === 1 ? categories[0] : mapCategory(first);

  return {
    data: {
      sellType: getSellType(items),
      productName: buildProductName(items),
      category,
      platform: distinctFamilies.slice(0, 3).join(", "),
      condition: mapCondition(first.condition),
      completeness: mapCompleteness(first.completeness),
      description: buildDescription(items, totalRange),
      quantity: String(totalQuantity),
    } satisfies Partial<WizardData>,
    summary: {
      count: items.length,
      label: buildProductName(items),
      rangeLabel: totalRange ? `${formatEuro(totalRange[0])} - ${formatEuro(totalRange[1])}` : null,
    } satisfies PrefillSummary,
  };
}

function validate(step: number, data: WizardData): WizardErrors {
  const e: WizardErrors = {};

  if (step === 0) {
    if (!data.sellType) e.sellType = "Bitte wähle einen Verkaufstyp.";
  } else if (step === 1) {
    if (!data.name.trim()) e.name = "Name ist erforderlich.";
    if (!data.email.trim()) {
      e.email = "E-Mail ist erforderlich.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      e.email = "Bitte eine gültige E-Mail eingeben.";
    }
  } else if (step === 2) {
    if (!data.productName.trim()) e.productName = "Bitte das Produkt beschreiben.";
    if (!data.condition) e.condition = "Bitte einen Zustand wählen.";
    if (!data.description.trim()) e.description = "Bitte eine kurze Beschreibung eingeben.";
  } else if (step === 4) {
    if (!data.acceptTerms) e.acceptTerms = "Bitte bestätige die unverbindliche Anfrage.";
    if (!data.acceptPrivacy) e.acceptPrivacy = "Bitte akzeptiere die Datenschutzerklärung.";
  }

  return e;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Kopieren"
      className="ml-2 inline-flex items-center justify-center w-6 h-6 border border-border text-text-secondary hover:border-accent-orange hover:text-accent-orange transition-colors flex-shrink-0"
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
    </button>
  );
}

function WizardSuccess({
  onReset,
  requestId,
  photoWarning,
  emailWarning,
}: {
  onReset: () => void;
  requestId: string | null;
  photoWarning?: string | null;
  emailWarning?: string | null;
}) {
  const hasWarnings = photoWarning || emailWarning;

  return (
    <div className="py-10 px-6 lg:px-8">
      {/* Icon + Titel */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-[rgba(255,107,53,0.10)] flex items-center justify-center flex-shrink-0">
          <CheckCircle size={24} className="text-accent-orange" />
        </div>
        <div>
          <h3 className="font-sans font-bold text-text-primary text-xl leading-tight">
            Anfrage eingegangen!
          </h3>
          <p className="font-sans text-xs text-text-secondary mt-0.5">
            Wir melden uns innerhalb von 24 Stunden.
          </p>
        </div>
      </div>

      {/* Trennlinie */}
      <div className="h-px bg-border mb-6" />

      {/* Anfrage-ID */}
      {requestId && (
        <div className="mb-6">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2">
            Anfrage-ID
          </p>
          <div className="flex items-center bg-surface border border-border px-4 py-3">
            <span className="font-mono text-xs text-text-primary flex-1 break-all">
              {requestId.toUpperCase()}
            </span>
            <CopyButton text={requestId.toUpperCase()} />
          </div>
        </div>
      )}

      {/* Info-Blöcke */}
      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        <div className="border border-border bg-surface p-4">
          <p className="font-sans text-xs font-semibold text-text-primary mb-1">
            Angebot in 24h
          </p>
          <p className="font-sans text-xs text-text-secondary leading-relaxed">
            Wir prüfen deine Anfrage und senden dir ein faires Angebot per E-Mail.
          </p>
        </div>
        <div className="border border-border bg-surface p-4">
          <p className="font-sans text-xs font-semibold text-text-primary mb-1">
            100 % unverbindlich
          </p>
          <p className="font-sans text-xs text-text-secondary leading-relaxed">
            Kein Kaufzwang. Du entscheidest, ob du das Angebot annimmst.
          </p>
        </div>
      </div>

      {/* Warnungen */}
      {hasWarnings && (
        <div className="mb-6 space-y-2">
          {photoWarning && (
            <p className="font-sans text-xs text-amber-700 dark:text-amber-400 border border-amber-400/40 bg-amber-50/50 dark:bg-amber-400/5 px-4 py-3">
              {photoWarning}
            </p>
          )}
          {emailWarning && (
            <p className="font-sans text-xs text-amber-700 dark:text-amber-400 border border-amber-400/40 bg-amber-50/50 dark:bg-amber-400/5 px-4 py-3">
              {emailWarning}
            </p>
          )}
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {requestId && (
          <Link
            href={`/ankauf/status/${requestId}`}
            className="flex items-center justify-center gap-2 bg-accent-orange text-background font-sans font-semibold text-sm px-5 py-3 hover:bg-[#e05a28] transition-colors min-h-[44px]"
          >
            Anfrage verfolgen
            <ExternalLink size={14} />
          </Link>
        )}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 border border-border text-text-secondary font-sans font-semibold text-sm px-5 py-3 hover:border-accent-orange hover:text-accent-orange transition-colors min-h-[44px]"
        >
          Zur Startseite
        </Link>
        {SITE.whatsapp.length > 4 && (
          <a
            href={`https://wa.me/${SITE.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border border-border text-text-secondary font-sans font-semibold text-sm px-5 py-3 hover:border-green-500 hover:text-green-600 transition-colors min-h-[44px]"
          >
            WhatsApp
          </a>
        )}
      </div>

      {/* Reset */}
      <div className="border-t border-border pt-4">
        <button
          type="button"
          onClick={onReset}
          className="font-sans text-xs text-text-secondary hover:text-accent-orange transition-colors underline"
        >
          Neue Anfrage stellen
        </button>
      </div>
    </div>
  );
}

export function AnkaufWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>(INITIAL);
  const [errors, setErrors] = useState<WizardErrors>({});
  const [prefillSummary, setPrefillSummary] = useState<PrefillSummary | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [photoWarning, setPhotoWarning] = useState<string | null>(null);
  const [emailWarning, setEmailWarning] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const items = readPriceToolImport();
      if (items.length === 0) return;

      const prefill = buildPrefill(items);
      setData((prev) => ({ ...prev, ...prefill.data }));
      setPrefillSummary(prefill.summary);
      setStep(1);
    } catch {
      // Die Vorbefuellung ist Komfort. Bei kaputten lokalen Daten bleibt der Wizard normal nutzbar.
    }
  }, []);

  function scrollTop() {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function update(patch: Partial<WizardData>) {
    setData((prev) => ({ ...prev, ...patch }));
    const next = { ...errors };
    Object.keys(patch).forEach((k) => delete next[k]);
    setErrors(next);
  }

  function clearPriceToolImport() {
    try {
      localStorage.removeItem(PRICE_TOOL_STORAGE_KEY);
    } catch {
      // Lokaler Speicher kann im Privatmodus blockiert sein.
    }

    setPrefillSummary(null);
    setData((prev) => ({
      ...prev,
      sellType: null,
      productName: "",
      category: "",
      platform: "",
      condition: "",
      completeness: "",
      description: "",
      desiredPrice: "",
      quantity: "1",
    }));
    setErrors({});
    setStep(0);
    scrollTop();
  }

  function handleNext() {
    const errs = validate(step, data);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep((s) => s + 1);
    scrollTop();
  }

  function handleBack() {
    setErrors({});
    setStep((s) => s - 1);
    scrollTop();
  }

  async function handleSubmit() {
    const errs = validate(4, data);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setSubmitError(null);
    setPhotoWarning(null);
    setEmailWarning(null);

    try {
      const fd = new FormData();
      fd.append(
        "data",
        JSON.stringify({
          sellType: data.sellType,
          name: data.name,
          email: data.email,
          phone: data.phone || undefined,
          plz: data.plz || undefined,
          productName: data.productName,
          category: data.category,
          platform: data.platform || undefined,
          condition: data.condition,
          completeness: data.completeness || undefined,
          description: data.description,
          desiredPrice: data.desiredPrice || undefined,
          quantity: data.quantity,
          acceptedUnverbindlich: data.acceptTerms,
          acceptedPrivacy: data.acceptPrivacy,
        })
      );
      data.photos.forEach((file, i) => fd.append(`photo_${i}`, file));

      const res = await fetch("/api/ankauf", { method: "POST", body: fd });
      const json = await res.json();

      if (!res.ok) {
        setSubmitError(json.error ?? "Unbekannter Fehler. Bitte versuche es erneut.");
        return;
      }

      if (json.photoWarning) setPhotoWarning(json.photoWarning);
      if (json.emailWarning) setEmailWarning(json.emailWarning);
      if (json.id) setRequestId(json.id);
      try {
        localStorage.removeItem(PRICE_TOOL_STORAGE_KEY);
      } catch {
        // Die Anfrage wurde gespeichert; ein fehlgeschlagener Cleanup darf nicht stoeren.
      }
      setPrefillSummary(null);
      setSubmitted(true);
      scrollTop();
    } catch {
      setSubmitError("Netzwerkfehler. Bitte prüfe deine Verbindung und versuche es erneut.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div
        ref={topRef}
        className="bg-background border border-border shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-none"
      >
        <WizardSuccess
          onReset={() => {
            setData(INITIAL);
            setStep(0);
            setPrefillSummary(null);
            setSubmitted(false);
            setPhotoWarning(null);
            setEmailWarning(null);
            setRequestId(null);
          }}
          requestId={requestId}
          photoWarning={photoWarning}
          emailWarning={emailWarning}
        />
      </div>
    );
  }

  return (
    <div
      ref={topRef}
      className="bg-background border border-border shadow-[0_2px_16px_rgba(0,0,0,0.06)] dark:shadow-none"
    >
      <div className="p-6 lg:p-8">
        <WizardProgress current={step} />

        {prefillSummary && (
          <div className="mb-6 border border-accent-orange/40 bg-[rgba(255,107,53,0.06)] p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center border border-accent-orange/50 bg-background text-accent-orange">
                <PackageCheck size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-accent-orange">
                  Aus dem Preisschätzer übernommen
                </p>
                <p className="mt-1 font-sans text-sm font-semibold text-text-primary">
                  {prefillSummary.label}
                </p>
                <p className="mt-1 font-sans text-xs text-text-secondary">
                  {prefillSummary.count} Produkt{prefillSummary.count === 1 ? "" : "e"}
                  {prefillSummary.rangeLabel ? ` · Schätzung: ${prefillSummary.rangeLabel}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={clearPriceToolImport}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center border border-border text-text-secondary transition-colors hover:border-accent-orange hover:text-accent-orange"
                aria-label="Import aus dem Preisschätzer entfernen"
                title="Import entfernen"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        <div className="min-h-[340px]">
          {step === 0 && (
            <WizardStep1Type
              value={data.sellType}
              onChange={(v) => update({ sellType: v })}
              error={errors.sellType}
            />
          )}
          {step === 1 && (
            <WizardStep2Contact
              data={data}
              errors={errors}
              onChange={(field, value) => update({ [field]: value })}
            />
          )}
          {step === 2 && (
            <WizardStep3Details
              data={data}
              errors={errors}
              onChange={(field, value) => update({ [field]: value })}
              sellType={data.sellType}
            />
          )}
          {step === 3 && (
            <WizardStep4Photos
              photos={data.photos}
              onChange={(photos) => update({ photos })}
            />
          )}
          {step === 4 && (
            <WizardStep5Summary
              data={data}
              errors={errors}
              onChange={(field, value) => update({ [field]: value })}
            />
          )}
        </div>
      </div>

      {/* Submit error */}
      {submitError && (
        <div className="mx-6 lg:mx-8 mb-0 border border-red-400/40 bg-red-50/50 dark:bg-red-400/5 px-4 py-3">
          <p className="font-sans text-xs text-red-600 dark:text-red-400 leading-relaxed">
            {submitError}
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between px-6 lg:px-8 py-5 border-t border-border bg-surface">
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 0 || loading}
          className="flex items-center gap-1.5 font-sans text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed min-h-[44px] px-2"
        >
          <ChevronLeft size={16} />
          Zurück
        </button>

        <span className="font-sans text-xs text-text-secondary">
          {step + 1} / 5
        </span>

        {step < 4 ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 bg-accent-orange text-background font-sans font-semibold text-sm px-6 py-3 hover:bg-[#e05a28] transition-colors min-h-[44px]"
          >
            Weiter
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 bg-accent-orange text-background font-sans font-semibold text-sm px-6 py-3 hover:bg-[#e05a28] transition-colors min-h-[44px] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Wird gesendet…
              </>
            ) : (
              <>
                <ArrowRight size={16} />
                Anfrage absenden
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
