"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Check,
  CheckCircle,
  ChevronLeft,
  ClipboardList,
  Copy,
  ExternalLink,
  Loader2,
  PackageCheck,
  Plus,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import type { PriceVariant } from "../price/priceCatalog";

type WizardStep = 0 | 1 | 2 | 3 | 4;

type WizardItem = {
  id: string;
  variantId?: string;
  name: string;
  brand: string;
  family: string;
  category: string;
  quantity: number;
  condition: string;
  completeness: string;
  accessories: string[];
  notes: string;
  range?: [number, number];
};

type ContactState = {
  name: string;
  email: string;
  phone: string;
  plz: string;
};

type ConsentState = {
  terms: boolean;
  privacy: boolean;
};

type ImportPayload = {
  version?: number;
  source?: string;
  savedAt?: number;
  items?: unknown;
};

type ImportItem = {
  variantId?: string;
  name?: string;
  brand?: string;
  family?: string;
  quantity?: number;
  condition?: string;
  completeness?: string;
  range?: [number, number];
};

type SubmitWarnings = {
  photoWarning?: string | null;
  emailWarning?: string | null;
};

type AnkaufWizardV2Props = {
  storeCreditBonus: number;
  variants?: PriceVariant[];
};

const STORAGE_KEY = "retroase_price_tool_items";
const IMPORT_MAX_AGE_MS = 20 * 60 * 1000;
const MAX_PHOTOS = 10;

const CONDITIONS = ["Sehr Gut", "Gut", "Akzeptabel", "Defekt"] as const;
const COMPLETENESS_OPTIONS = [
  "OVP + Zubehor",
  "Komplett ohne OVP",
  "Nur Gerat / Spiel",
  "Unvollstandig",
] as const;
const ACCESSORY_OPTIONS = [
  "Originalverpackung",
  "Ladegerat / Netzteil",
  "Controller",
  "Kabel",
  "Anleitung",
  "Stift / Kleinteile",
] as const;

const STEPS: Array<{ label: string; title: string }> = [
  { label: "Paket", title: "Paket bestatigen" },
  { label: "Details", title: "Zustand & Zubehor" },
  { label: "Fotos", title: "Fotos hinzufugen" },
  { label: "Kontakt", title: "Kontakt" },
  { label: "Review", title: "Prufen & senden" },
];

function formatEuro(value: number) {
  return `${Math.round(value).toLocaleString("de-DE")} EUR`;
}

function createId(prefix = "item") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalize(value: string) {
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

function isImportItem(value: unknown): value is ImportItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.name === "string" || typeof item.brand === "string" || typeof item.family === "string";
}

function mapCondition(value?: string) {
  const text = normalize(value ?? "");
  if (text.includes("sehr") || text.includes("mint")) return "Sehr Gut";
  if (text.includes("defekt")) return "Defekt";
  if (text.includes("akzept") || text.includes("fair")) return "Akzeptabel";
  return "Gut";
}

function mapCompleteness(value?: string) {
  const text = normalize(value ?? "");
  if (text.includes("ovp") || text.includes("boxed")) return "OVP + Zubehor";
  if (text.includes("komplett") || text.includes("complete")) return "Komplett ohne OVP";
  if (text.includes("nur") || text.includes("lose")) return "Nur Gerat / Spiel";
  if (text.includes("unvoll") || text.includes("missing")) return "Unvollstandig";
  return "Komplett ohne OVP";
}

function uniqueList(values: Array<string | null | undefined>) {
  const seen = new Set<string>();
  return values
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value))
    .filter((value) => {
      const key = normalize(value);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function inferVariant(item: WizardItem, variants: PriceVariant[]) {
  if (variants.length === 0) return null;
  if (item.variantId) {
    const direct = variants.find((variant) => variant.id === item.variantId);
    if (direct) return direct;
  }

  const itemNameText = normalize(item.name);
  const itemText = normalize([item.brand, item.family, item.name, item.category].filter(Boolean).join(" "));
  if (!itemText) return null;

  const exact = variants.find((variant) => {
    const names = [variant.id, variant.name, ...variant.aliases].map(normalize);
    return names.some((name) => name && (name === itemNameText || name === itemText));
  });
  if (exact) return exact;

  return (
    variants.find((variant) => {
      const names = [variant.name, ...variant.aliases].map(normalize).filter(Boolean);
      return names.some((name) => itemText.includes(name) || Boolean(itemNameText && name.includes(itemNameText)));
    }) ?? null
  );
}

function defaultAccessoryPlan(item: WizardItem, variant: PriceVariant | null) {
  const text = normalize([variant?.brand, variant?.family, variant?.name, variant?.type, item.brand, item.family, item.name, item.category].filter(Boolean).join(" "));

  if (variant?.type === "cards" || text.includes("karten") || text.includes("pokemon")) {
    return {
      required: ["Karten"],
      optional: ["Binder", "Sleeves", "Toploader", "Displays / Boxen"],
    };
  }

  if (variant?.type === "game" || text.includes("spiel")) {
    return {
      required: ["Spielmodul / Disc"],
      optional: ["Originalverpackung", "Anleitung", "Schutzhulle"],
    };
  }

  if (text.includes("switch lite")) {
    return {
      required: ["Ladegerat / Netzteil"],
      optional: ["Originalverpackung", "Tasche", "Displayschutz"],
    };
  }

  if (text.includes("switch")) {
    return {
      required: ["Dock", "Joy-Con links/rechts", "Netzteil", "HDMI-Kabel"],
      optional: ["Originalverpackung", "Joy-Con-Grip", "Handgelenkschlaufen", "Tasche"],
    };
  }

  if (text.includes("ds") || text.includes("3ds") || text.includes("gba sp")) {
    return {
      required: ["Ladegerat / Netzteil", "Stift / Stylus"],
      optional: ["Originalverpackung", "Anleitung", "Tasche"],
    };
  }

  if (text.includes("game boy") || text.includes("gameboy")) {
    return {
      required: ["Batteriedeckel"],
      optional: ["Originalverpackung", "Anleitung", "Tasche"],
    };
  }

  if (text.includes("playstation") || text.includes("ps5") || text.includes("ps4") || text.includes("xbox")) {
    return {
      required: ["Controller", "Netzteil", "HDMI-Kabel"],
      optional: ["Originalverpackung", "Anleitung", "Zweiter Controller"],
    };
  }

  return {
    required: [...ACCESSORY_OPTIONS],
    optional: [],
  };
}

function getAccessoryPlan(item: WizardItem, variants: PriceVariant[]) {
  const variant = inferVariant(item, variants);
  const catalogRequired = uniqueList(variant?.requiredAccessories ?? []);
  const catalogOptional = uniqueList(variant?.optionalAccessories ?? []);

  if (catalogRequired.length || catalogOptional.length) {
    return {
      variantName: variant?.name ?? item.name,
      source: "catalog" as const,
      required: catalogRequired,
      optional: catalogOptional,
    };
  }

  const defaults = defaultAccessoryPlan(item, variant);
  return {
    variantName: variant?.name ?? item.name,
    source: variant ? ("fallback" as const) : ("generic" as const),
    required: uniqueList(defaults.required),
    optional: uniqueList(defaults.optional),
  };
}

function mapCategory(item: Pick<WizardItem, "brand" | "family" | "name"> | ImportItem) {
  const text = normalize([item.brand, item.family, item.name].filter(Boolean).join(" "));
  if (text.includes("pokemon")) return "Pokemon";
  if (text.includes("game boy") || text.includes("gameboy")) return "Game Boy";
  if (text.includes("sony") || text.includes("playstation") || text.includes("ps5") || text.includes("ps4")) {
    return "PlayStation";
  }
  if (text.includes("zubehor") || text.includes("controller")) return "Zubehor";
  if (text.includes("nintendo") || text.includes("switch") || text.includes("ds") || text.includes("gamecube")) {
    return "Nintendo";
  }
  return "Retro";
}

function categoryLabel(value: string) {
  const text = normalize(value);
  const category = CATEGORIES.find((item) => normalize(item.label) === text || normalize(item.id) === text);
  return category?.label ?? value;
}

function itemName(item: Pick<WizardItem, "name" | "quantity">) {
  return item.quantity > 1 ? `${item.quantity}x ${item.name || "Produkt"}` : item.name || "Produkt";
}

function readPriceToolImport(): WizardItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  const parsed = JSON.parse(raw) as ImportPayload | unknown[];
  if (Array.isArray(parsed)) {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }

  if (
    !parsed ||
    typeof parsed !== "object" ||
    parsed.version !== 2 ||
    parsed.source !== "ankauf-price-tool-v2" ||
    typeof parsed.savedAt !== "number" ||
    !Array.isArray(parsed.items)
  ) {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }

  if (Date.now() - parsed.savedAt > IMPORT_MAX_AGE_MS) {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }

  return parsed.items.filter(isImportItem).map((item) => ({
    id: createId("import"),
    variantId: item.variantId,
    name: item.name ?? "Unbekanntes Produkt",
    brand: item.brand ?? "",
    family: item.family ?? "",
    category: categoryLabel(mapCategory(item)),
    quantity: clampQuantity(item.quantity),
    condition: mapCondition(item.condition),
    completeness: mapCompleteness(item.completeness),
    accessories: [],
    notes: "",
    range: item.range,
  }));
}

function createEmptyItem(): WizardItem {
  return {
    id: createId("manual"),
    name: "",
    brand: "",
    family: "",
    category: "Nintendo",
    quantity: 1,
    condition: "Gut",
    completeness: "Komplett ohne OVP",
    accessories: [],
    notes: "",
  };
}

function getTotalRange(items: WizardItem[]) {
  const ranges = items
    .map((item) => item.range)
    .filter((range): range is [number, number] => Boolean(range));
  if (ranges.length === 0) return null;
  return ranges.reduce<[number, number]>((sum, range) => [sum[0] + range[0], sum[1] + range[1]], [0, 0]);
}

function getSellType(items: WizardItem[]) {
  const text = normalize(items.map((item) => `${item.category} ${item.brand} ${item.name}`).join(" "));
  if (items.some((item) => item.condition === "Defekt")) return "defekt";
  if (text.includes("pokemon")) return "pokemon";
  if (text.includes("zubehor") || text.includes("controller")) return "zubehoer";
  if (items.length > 1) return "mehrere";
  return "einzeln";
}

function getWorstCondition(items: WizardItem[]) {
  const order = ["Sehr Gut", "Gut", "Akzeptabel", "Defekt"];
  return items.reduce((worst, item) => (order.indexOf(item.condition) > order.indexOf(worst) ? item.condition : worst), "Sehr Gut");
}

function buildProductName(items: WizardItem[]) {
  if (items.length === 1) return itemName(items[0]);
  const preview = items.slice(0, 3).map(itemName).join(", ");
  return `Paket: ${preview}${items.length > 3 ? ` + ${items.length - 3} weitere` : ""}`;
}

function buildDescription(items: WizardItem[], storeCreditBonus: number) {
  const totalRange = getTotalRange(items);
  const lines = items.map((item) => {
    const range = item.range ? `, Schatzung: ${formatEuro(item.range[0])} - ${formatEuro(item.range[1])}` : "";
    const accessories = item.accessories.length ? `, Zubehor: ${item.accessories.join(", ")}` : "";
    const notes = item.notes.trim() ? `, Hinweis: ${item.notes.trim()}` : "";
    return `- ${itemName(item)} (${[item.brand, item.family].filter(Boolean).join(" / ") || item.category}), Zustand: ${item.condition}, Vollstandigkeit: ${item.completeness}${accessories}${range}${notes}`;
  });

  const payout = `Offen - Kunde entscheidet nach finalem Angebot. Aktueller RetrOase-Guthaben-Bonus: +${Math.round(
    storeCreditBonus * 100,
  )}%.`;
  const total = totalRange ? `\nGesamtschatzung: ${formatEuro(totalRange[0])} - ${formatEuro(totalRange[1])}` : "";

  return `AnkaufWizardV2 Anfrage\nAuszahlungsentscheidung: ${payout}\n${total}\n\nProdukte:\n${lines.join("\n")}`;
}

function getApiCategory(items: WizardItem[]) {
  const categories = Array.from(new Set(items.map((item) => item.category).filter(Boolean)));
  return categories.length === 1 ? categories[0] : "Retro";
}

function getApiPlatform(items: WizardItem[]) {
  return Array.from(new Set(items.map((item) => item.family || item.brand).filter(Boolean))).slice(0, 4).join(", ");
}

function getApiCompleteness(items: WizardItem[]) {
  return Array.from(new Set(items.map((item) => item.completeness).filter(Boolean))).join(", ");
}

function getValidationError(step: WizardStep, items: WizardItem[], contact: ContactState, consent: ConsentState) {
  if (step === 0) {
    if (items.length === 0) return "Fuge mindestens ein Produkt hinzu.";
    if (items.some((item) => !item.name.trim())) return "Gib jedem Produkt einen Namen.";
  }
  if (step === 1) {
    if (items.some((item) => !item.condition || !item.completeness)) return "Wahle Zustand und Vollstandigkeit.";
  }
  if (step === 3) {
    if (!contact.name.trim()) return "Name ist erforderlich.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) return "Gib eine gultige E-Mail ein.";
  }
  if (step === 4) {
    if (!consent.terms || !consent.privacy) return "Bestatige bitte die unverbindliche Anfrage und den Datenschutz.";
  }
  return null;
}

function MissionMap({ current }: { current: WizardStep }) {
  return (
    <div className="ak-wizard-v2-map" aria-label="Fortschritt">
      {STEPS.map((step, index) => {
        const state = index < current ? "done" : index === current ? "active" : "next";
        return (
          <div key={step.label} className="ak-wizard-v2-node" data-state={state}>
            <span>{index < current ? <Check size={13} /> : index + 1}</span>
            <small>{step.label}</small>
          </div>
        );
      })}
    </div>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button type="button" className="ak-wizard-v2-icon-btn" onClick={onClick} aria-label={label} title={label}>
      {children}
    </button>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="ak-wizard-v2-summary-line">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function AccessoryGroup({
  title,
  hint,
  kind,
  options,
  selected,
  onToggle,
}: {
  title: string;
  hint: string;
  kind: "required" | "optional";
  options: string[];
  selected: string[];
  onToggle: (accessory: string) => void;
}) {
  if (options.length === 0) return null;

  return (
    <div className="ak-wizard-v2-kit-group" data-kind={kind}>
      <div className="ak-wizard-v2-kit-group-head">
        <strong>{title}</strong>
        <span>{hint}</span>
      </div>
      <div className="ak-wizard-v2-chips">
        {options.map((accessory) => (
          <button
            key={accessory}
            type="button"
            className={selected.includes(accessory) ? "is-active" : ""}
            onClick={() => onToggle(accessory)}
          >
            {accessory}
          </button>
        ))}
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <button type="button" className="ak-wizard-v2-copy" onClick={handleCopy}>
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Kopiert" : "ID kopieren"}
    </button>
  );
}

export function AnkaufWizardV2({ storeCreditBonus, variants = [] }: AnkaufWizardV2Props) {
  const [step, setStep] = useState<WizardStep>(0);
  const [items, setItems] = useState<WizardItem[]>([createEmptyItem()]);
  const [imported, setImported] = useState(false);
  const [contact, setContact] = useState<ContactState>({ name: "", email: "", phone: "", plz: "" });
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [consent, setConsent] = useState<ConsentState>({ terms: false, privacy: false });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<SubmitWarnings>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bonus = Math.max(0, Math.min(0.5, storeCreditBonus));

  useEffect(() => {
    try {
      const importedItems = readPriceToolImport();
      if (importedItems.length === 0) return;
      setItems(importedItems);
      setImported(true);
    } catch {
      // Komfort-Import: Bei kaputten lokalen Daten bleibt der Wizard manuell nutzbar.
    }
  }, []);

  useEffect(() => {
    const urls = photos.map((file) => URL.createObjectURL(file));
    setPhotoPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [photos]);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  function scrollTop() {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function updateItem(id: string, patch: Partial<WizardItem>) {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        const shouldInferVariant =
          patch.name !== undefined || patch.brand !== undefined || patch.family !== undefined;
        const next = { ...item, ...patch, ...(shouldInferVariant ? { variantId: undefined } : {}) };
        if (typeof patch.quantity === "number" && item.range) {
          const prevQty = Math.max(1, item.quantity);
          const nextQty = Math.max(1, patch.quantity);
          next.range = [
            Math.round((item.range[0] / prevQty) * nextQty),
            Math.round((item.range[1] / prevQty) * nextQty),
          ];
        }
        return next;
      }),
    );
    setError(null);
  }

  function addItem() {
    setItems((current) => [...current, createEmptyItem()]);
    setError(null);
  }

  function removeItem(id: string) {
    setItems((current) => (current.length > 1 ? current.filter((item) => item.id !== id) : current));
    setError(null);
  }

  function clearImport() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // LocalStorage kann in restriktiven Browsermodi blockiert sein.
    }
    setItems([createEmptyItem()]);
    setImported(false);
    setStep(0);
    setError(null);
    scrollTop();
  }

  function toggleAccessory(itemId: string, accessory: string) {
    const item = items.find((entry) => entry.id === itemId);
    if (!item) return;
    const accessories = item.accessories.includes(accessory)
      ? item.accessories.filter((entry) => entry !== accessory)
      : [...item.accessories, accessory];
    updateItem(itemId, { accessories });
  }

  function addPhotos(files: FileList | null) {
    if (!files) return;
    // Muss zum Server-Vertrag passen (/api/ankauf akzeptiert nur diese Typen).
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const remaining = MAX_PHOTOS - photos.length;
    const incoming = Array.from(files);
    const valid = incoming
      .filter((file) => allowedTypes.includes(file.type))
      .slice(0, remaining);
    const rejected = incoming.filter((file) => !allowedTypes.includes(file.type)).length;
    if (valid.length > 0) setPhotos((current) => [...current, ...valid]);
    if (rejected > 0) {
      setError("Nur JPG, PNG oder WebP werden akzeptiert. Andere Formate (z. B. HEIC oder GIF) wurden ignoriert.");
    }
  }

  function nextStep() {
    const validation = getValidationError(step, items, contact, consent);
    if (validation) {
      setError(validation);
      return;
    }
    setError(null);
    setStep((current) => Math.min(4, current + 1) as WizardStep);
    scrollTop();
  }

  function previousStep() {
    setError(null);
    setStep((current) => Math.max(0, current - 1) as WizardStep);
    scrollTop();
  }

  async function submit() {
    const validation = getValidationError(4, items, contact, consent);
    if (validation) {
      setError(validation);
      return;
    }

    setLoading(true);
    setError(null);
    setWarnings({});

    try {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          sellType: getSellType(items),
          name: contact.name,
          email: contact.email,
          phone: contact.phone || undefined,
          plz: contact.plz || undefined,
          productName: buildProductName(items),
          category: getApiCategory(items),
          platform: getApiPlatform(items) || undefined,
          condition: getWorstCondition(items),
          completeness: getApiCompleteness(items) || undefined,
          description: buildDescription(items, bonus),
          quantity: totalQuantity,
          acceptedUnverbindlich: consent.terms,
          acceptedPrivacy: consent.privacy,
        }),
      );
      photos.forEach((file, index) => formData.append(`photo_${index}`, file));

      const response = await fetch("/api/ankauf", { method: "POST", body: formData });
      const json = await response.json();
      if (!response.ok) {
        setError(json.error ?? "Die Anfrage konnte nicht gesendet werden.");
        return;
      }

      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Cleanup ist Komfort.
      }
      setRequestId(json.id ?? null);
      setWarnings({ photoWarning: json.photoWarning, emailWarning: json.emailWarning });
      setSubmitted(true);
      scrollTop();
    } catch {
      setError("Netzwerkfehler. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div ref={topRef} className="ak-wizard-v2">
        <div className="ak-wizard-v2-success">
          <div className="ak-wizard-v2-success-icon">
            <CheckCircle size={34} />
          </div>
          <span className="ak-eyebrow">Mission abgeschlossen</span>
          <h3>Anfrage eingegangen</h3>
          <p>Wir prufen dein Paket und melden uns innerhalb von 24 Stunden.</p>

          {requestId && (
            <div className="ak-wizard-v2-id">
              <span>Anfrage-ID</span>
              <strong>{requestId.toUpperCase()}</strong>
              <CopyButton text={requestId.toUpperCase()} />
            </div>
          )}

          {(warnings.photoWarning || warnings.emailWarning) && (
            <div className="ak-wizard-v2-warning">
              {warnings.photoWarning && <p>{warnings.photoWarning}</p>}
              {warnings.emailWarning && <p>{warnings.emailWarning}</p>}
            </div>
          )}

          <div className="ak-wizard-v2-success-actions">
            {requestId && (
              <Link href={`/ankauf/status/${requestId}`}>
                Anfrage verfolgen <ExternalLink size={14} />
              </Link>
            )}
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setStep(0);
                setItems([createEmptyItem()]);
                setPhotos([]);
                setConsent({ terms: false, privacy: false });
                setRequestId(null);
              }}
            >
              Neue Anfrage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={topRef} className="ak-wizard-v2">
      <div className="ak-wizard-v2-shell">
        <aside className="ak-wizard-v2-side">
          <span className="ak-chip">Ankauf-Mission</span>
          <h3>{STEPS[step].title}</h3>
          <p>Ein Schritt pro Screen. Dein Paket bleibt sichtbar, der Rest wird gefuhrt.</p>
          <MissionMap current={step} />
          <div className="ak-wizard-v2-side-total">
            <span>Paket</span>
            <strong>{items.length} Produkt{items.length === 1 ? "" : "e"}</strong>
            <small>{totalQuantity} Teil{totalQuantity === 1 ? "" : "e"} insgesamt</small>
          </div>
        </aside>

        <main className="ak-wizard-v2-main">
          {error && <div className="ak-wizard-v2-error">{error}</div>}

          {step === 0 && (
            <section className="ak-wizard-v2-panel" aria-label="Paket bestatigen">
              <div className="ak-wizard-v2-panel-head">
                <PackageCheck size={22} />
                <div>
                  <span className="ak-eyebrow">{imported ? "Ubernommen" : "Start"}</span>
                  <h4>{imported ? "Dein Preis-Paket ist bereit" : "Was mochtest du verkaufen?"}</h4>
                </div>
              </div>

              {imported && (
                <div className="ak-wizard-v2-import">
                  <p>Aus dem Preisschatzer ubernommen. Du kannst alles anpassen.</p>
                  <button type="button" onClick={clearImport}>
                    Import entfernen
                  </button>
                </div>
              )}

              <div className="ak-wizard-v2-items">
                {items.map((item, index) => (
                  <article key={item.id} className="ak-wizard-v2-item">
                    <div className="ak-wizard-v2-item-top">
                      <span>Slot {index + 1}</span>
                      <IconButton label="Produkt entfernen" onClick={() => removeItem(item.id)}>
                        <Trash2 size={15} />
                      </IconButton>
                    </div>
                    <label>
                      Produktname
                      <input
                        value={item.name}
                        onChange={(event) => updateItem(item.id, { name: event.target.value })}
                        placeholder="z.B. Nintendo DS Lite"
                      />
                    </label>
                    <div className="ak-wizard-v2-grid-2">
                      <label>
                        Marke
                        <input
                          value={item.brand}
                          onChange={(event) => updateItem(item.id, { brand: event.target.value })}
                          placeholder="Nintendo"
                        />
                      </label>
                      <label>
                        Reihe / Modell
                        <input
                          value={item.family}
                          onChange={(event) => updateItem(item.id, { family: event.target.value })}
                          placeholder="Nintendo DS"
                        />
                      </label>
                    </div>
                    <div className="ak-wizard-v2-grid-2">
                      <label>
                        Kategorie
                        <select value={item.category} onChange={(event) => updateItem(item.id, { category: event.target.value })}>
                          {CATEGORIES.map((category) => (
                            <option key={category.id} value={category.label}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Anzahl
                        <input
                          type="number"
                          min={1}
                          max={9999}
                          value={item.quantity}
                          onChange={(event) => updateItem(item.id, { quantity: clampQuantity(event.target.value) })}
                        />
                      </label>
                    </div>
                  </article>
                ))}
              </div>

              <button type="button" className="ak-wizard-v2-add" onClick={addItem}>
                <Plus size={17} /> Weiteres Produkt hinzufugen
              </button>
            </section>
          )}

          {step === 1 && (
            <section className="ak-wizard-v2-panel" aria-label="Zustand und Zubehor">
              <div className="ak-wizard-v2-panel-head">
                <ClipboardList size={22} />
                <div>
                  <span className="ak-eyebrow">Prufung</span>
                  <h4>Zustand, OVP und Zubehor</h4>
                </div>
              </div>

              <div className="ak-wizard-v2-items">
                {items.map((item) => {
                  const accessoryPlan = getAccessoryPlan(item, variants);
                  return (
                    <article key={item.id} className="ak-wizard-v2-item">
                      <div className="ak-wizard-v2-item-title">
                        <strong>{itemName(item)}</strong>
                        {item.range && <small>{formatEuro(item.range[0])} - {formatEuro(item.range[1])}</small>}
                      </div>
                      <div className="ak-wizard-v2-grid-2">
                        <label>
                          Zustand
                          <select value={item.condition} onChange={(event) => updateItem(item.id, { condition: event.target.value })}>
                            {CONDITIONS.map((condition) => (
                              <option key={condition} value={condition}>
                                {condition}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label>
                          Vollstandigkeit
                          <select
                            value={item.completeness}
                            onChange={(event) => updateItem(item.id, { completeness: event.target.value })}
                          >
                            {COMPLETENESS_OPTIONS.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>

                      <div className="ak-wizard-v2-kit">
                        <div className="ak-wizard-v2-kit-head">
                          <span className="ak-wizard-v2-label">Dabei?</span>
                          <small>
                            {accessoryPlan.source === "catalog"
                              ? `Checkliste aus deinem Preis-Katalog: ${accessoryPlan.variantName}`
                              : "Standard-Checkliste, bis du eigene Werte im Admin pflegst."}
                          </small>
                        </div>
                        <AccessoryGroup
                          title="Wichtig fur den Preis"
                          hint="Alles anklicken, was wirklich dabei ist."
                          kind="required"
                          options={accessoryPlan.required}
                          selected={item.accessories}
                          onToggle={(accessory) => toggleAccessory(item.id, accessory)}
                        />
                        <AccessoryGroup
                          title="Bonus-Zubehor"
                          hint="Erhoht oft die Bewertung oder macht das Paket attraktiver."
                          kind="optional"
                          options={accessoryPlan.optional}
                          selected={item.accessories}
                          onToggle={(accessory) => toggleAccessory(item.id, accessory)}
                        />
                      </div>

                      <label>
                        Hinweis
                        <textarea
                          value={item.notes}
                          onChange={(event) => updateItem(item.id, { notes: event.target.value })}
                          rows={2}
                          placeholder="z.B. Display hat Kratzer, Ladegerat fehlt, OVP dabei"
                        />
                      </label>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="ak-wizard-v2-panel" aria-label="Fotos hinzufugen">
              <div className="ak-wizard-v2-panel-head">
                <Camera size={22} />
                <div>
                  <span className="ak-eyebrow">Beweise</span>
                  <h4>Fotos fur ein genaueres Angebot</h4>
                </div>
              </div>

              <button type="button" className="ak-wizard-v2-drop" onClick={() => fileRef.current?.click()}>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="sr-only"
                  onChange={(event) => addPhotos(event.target.files)}
                />
                <Upload size={26} />
                <strong>Fotos auswahlen</strong>
                <span>Vorderseite, Ruckseite, Schaden, Zubehor und OVP helfen uns.</span>
              </button>

              <div className="ak-wizard-v2-photo-hints">
                {["Vorderseite", "Ruckseite", "Schaden", "Zubehor", "OVP"].map((hint) => (
                  <span key={hint}>{hint}</span>
                ))}
              </div>

              {photoPreviews.length > 0 && (
                <div className="ak-wizard-v2-photos">
                  {photoPreviews.map((url, index) => (
                    <div key={url} className="ak-wizard-v2-photo">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Foto ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => setPhotos((current) => current.filter((_, photoIndex) => photoIndex !== index))}
                        aria-label={`Foto ${index + 1} entfernen`}
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {step === 3 && (
            <section className="ak-wizard-v2-panel" aria-label="Kontakt">
              <div className="ak-wizard-v2-panel-head">
                <ShieldCheck size={22} />
                <div>
                  <span className="ak-eyebrow">Kontakt</span>
                  <h4>Wohin schicken wir dein Angebot?</h4>
                </div>
              </div>
              <div className="ak-wizard-v2-grid-2">
                <label>
                  Name
                  <input value={contact.name} onChange={(event) => setContact((prev) => ({ ...prev, name: event.target.value }))} placeholder="Max Mustermann" />
                </label>
                <label>
                  E-Mail
                  <input type="email" value={contact.email} onChange={(event) => setContact((prev) => ({ ...prev, email: event.target.value }))} placeholder="du@email.de" />
                </label>
                <label>
                  Telefon optional
                  <input value={contact.phone} onChange={(event) => setContact((prev) => ({ ...prev, phone: event.target.value }))} placeholder="+49 ..." />
                </label>
                <label>
                  PLZ optional
                  <input
                    value={contact.plz}
                    onChange={(event) => setContact((prev) => ({ ...prev, plz: event.target.value.replace(/\D/g, "").slice(0, 5) }))}
                    placeholder="12345"
                    inputMode="numeric"
                  />
                </label>
              </div>
            </section>
          )}

          {step === 4 && (
            <section className="ak-wizard-v2-panel" aria-label="Zusammenfassung">
              <div className="ak-wizard-v2-panel-head">
                <CheckCircle size={22} />
                <div>
                  <span className="ak-eyebrow">Finale Prufung</span>
                  <h4>Alles bereit?</h4>
                </div>
              </div>

              <div className="ak-wizard-v2-review">
                <SummaryLine label="Paket" value={buildProductName(items)} />
                <SummaryLine label="Menge" value={`${totalQuantity} Teil${totalQuantity === 1 ? "" : "e"}`} />
                <SummaryLine label="Auszahlung" value={`Entscheidung nach Angebot, Guthaben-Bonus aktuell +${Math.round(bonus * 100)}%`} />
                <SummaryLine label="Kontakt" value={`${contact.name} / ${contact.email}`} />
                <SummaryLine label="Fotos" value={photos.length ? `${photos.length} Foto${photos.length === 1 ? "" : "s"}` : "Keine Fotos"} />
              </div>

              <div className="ak-wizard-v2-consents">
                <label>
                  <input
                    type="checkbox"
                    checked={consent.terms}
                    onChange={(event) => setConsent((prev) => ({ ...prev, terms: event.target.checked }))}
                  />
                  <span>Ich stelle eine unverbindliche Anfrage und entscheide erst nach dem Angebot.</span>
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={consent.privacy}
                    onChange={(event) => setConsent((prev) => ({ ...prev, privacy: event.target.checked }))}
                  />
                  <span>
                    Ich akzeptiere die{" "}
                    <a href="/datenschutz" target="_blank" rel="noopener noreferrer">
                      Datenschutzerklarung
                    </a>
                    .
                  </span>
                </label>
              </div>
            </section>
          )}

          <div className="ak-wizard-v2-nav">
            <button type="button" onClick={previousStep} disabled={step === 0 || loading}>
              <ChevronLeft size={17} />
              Zuruck
            </button>
            <span>{step + 1} / {STEPS.length}</span>
            {step < 4 ? (
              <button type="button" className="is-primary" onClick={nextStep}>
                Weiter
                <ArrowRight size={17} />
              </button>
            ) : (
              <button type="button" className="is-primary" onClick={submit} disabled={loading}>
                {loading ? <Loader2 size={17} className="animate-spin" /> : <ArrowRight size={17} />}
                Anfrage senden
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
