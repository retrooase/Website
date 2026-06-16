"use client";

import { useState } from "react";
import { Sparkles, Copy, CheckCheck } from "lucide-react";
import { generateAIDescription, type AIResult } from "@/app/(admin)/admin/products/ai-actions";

type Tab = "beschreibung" | "ebay" | "instagram" | "extras";

export function KIGeneratorPanel() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("beschreibung");
  const [applied, setApplied] = useState(false);

  function readFormValues() {
    const getInput = (name: string) =>
      (document.querySelector(`input[name="${name}"]`) as HTMLInputElement | null)
        ?.value?.trim() || undefined;
    const getSelect = (name: string) =>
      (document.querySelector(`select[name="${name}"]`) as HTMLSelectElement | null)
        ?.value?.trim() || undefined;

    return {
      title: getInput("title") ?? "",
      platform: getInput("platform"),
      category: getSelect("category"),
      condition: getSelect("condition"),
      price: getInput("price"),
      badge: getSelect("badge"),
      language: getInput("language"),
      region: getInput("region"),
    };
  }

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setApplied(false);

    const input = readFormValues();
    if (!input.title) {
      setError("Bitte zuerst einen Titel eingeben.");
      setLoading(false);
      return;
    }

    const res = await generateAIDescription(input);
    setLoading(false);

    if (!res.ok) {
      setError(res.error);
    } else {
      setResult(res.data);
      setTab("beschreibung");
    }
  }

  function applyDescription() {
    if (!result) return;
    const textarea = document.querySelector(
      'textarea[name="description"]'
    ) as HTMLTextAreaElement | null;
    if (!textarea) return;

    const full = [
      result.shop_beschreibung,
      result.zustandsbeschreibung,
      result.lieferumfang_text,
      "🚚 Versand & Zahlung bei RetrOase:\n\n📦 Schneller & sicherer Versand – gut verpackt mit Sendungsnummer.\n💳 Zahlungsmöglichkeiten: PayPal, Überweisung oder eBay-Zahlungsabwicklung.",
      "🌟 Vielen Dank, dass du bei RetrOase vorbeischaust – wir freuen uns, gemeinsam mit dir ein Stück Gaming-Geschichte am Leben zu halten. 🎮",
    ]
      .filter(Boolean)
      .join("\n\n");

    textarea.value = full;
    setApplied(true);
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: "beschreibung", label: "Shop-Text" },
    { key: "ebay", label: "eBay-Titel" },
    { key: "instagram", label: "Instagram" },
    { key: "extras", label: "Extras" },
  ];

  return (
    <div className="bg-surface border border-accent-orange/40 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-accent-orange" />
          <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary">
            KI-Beschreibung
          </h2>
        </div>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="btn-primary flex items-center gap-1.5 text-xs py-1.5 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin inline-block" />
              Generiere…
            </>
          ) : (
            <>
              <Sparkles size={12} />
              Generieren
            </>
          )}
        </button>
      </div>

      <p className="font-sans text-xs text-text-secondary mb-3">
        Titel, Kategorie, Zustand und Plattform ausfüllen — dann hier generieren.
      </p>

      {error && (
        <div className="mb-3 p-3 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 font-sans text-xs text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-3">
          <div className="flex border-b border-border">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`font-sans text-xs px-3 py-1.5 border-b-2 -mb-px transition-colors ${
                  tab === t.key
                    ? "border-accent-orange text-accent-orange"
                    : "border-transparent text-text-secondary hover:text-text-primary"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "beschreibung" && (
            <div className="space-y-2">
              <div className="font-sans text-xs text-text-secondary bg-surface-hover border border-border p-3 max-h-52 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {[result.shop_beschreibung, result.zustandsbeschreibung, result.lieferumfang_text]
                  .filter(Boolean)
                  .join("\n\n")}
              </div>
              <button
                type="button"
                onClick={applyDescription}
                className={`flex items-center gap-1.5 font-sans text-xs px-3 py-1.5 border transition-colors ${
                  applied
                    ? "border-green-400 text-green-700 bg-green-50 dark:border-green-700 dark:bg-green-900/20 dark:text-green-400"
                    : "border-accent-orange text-accent-orange hover:bg-accent-orange/5"
                }`}
              >
                {applied ? (
                  <>
                    <CheckCheck size={12} /> In Beschreibungsfeld übernommen
                  </>
                ) : (
                  "In Formular übernehmen"
                )}
              </button>
            </div>
          )}

          {tab === "ebay" && (
            <div className="space-y-2">
              <p className="font-sans text-xs text-text-secondary">
                {result.ebay_titel.length}/80 Zeichen
              </p>
              <div className="font-mono text-xs text-text-primary bg-surface-hover border border-border p-3 break-all">
                {result.ebay_titel}
              </div>
              <CopyButton text={result.ebay_titel} label="eBay-Titel kopieren" />
            </div>
          )}

          {tab === "instagram" && (
            <div className="space-y-2">
              <div className="font-sans text-xs text-text-secondary bg-surface-hover border border-border p-3 whitespace-pre-wrap leading-relaxed">
                {result.instagram_caption}
              </div>
              <CopyButton text={result.instagram_caption} label="Caption kopieren" />
            </div>
          )}

          {tab === "extras" && (
            <div className="space-y-3">
              <InfoBlock label="💰 Preiseinschätzung" value={result.preis_einschaetzung} />
              <InfoBlock label="📦 Bundle-Tipp" value={result.bundle_tipp} />
              <InfoBlock
                label="🔍 SEO-Keywords"
                value={
                  Array.isArray(result.seo_keywords)
                    ? result.seo_keywords.join(", ")
                    : String(result.seo_keywords)
                }
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="flex items-center gap-1.5 font-sans text-xs px-3 py-1.5 border border-border text-text-secondary hover:border-accent-orange hover:text-accent-orange transition-colors"
    >
      {copied ? (
        <>
          <CheckCheck size={12} /> Kopiert!
        </>
      ) : (
        <>
          <Copy size={12} /> {label}
        </>
      )}
    </button>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="font-sans text-xs font-semibold text-text-secondary">{label}</p>
      <p className="font-sans text-xs text-text-primary bg-surface-hover border border-border p-2">
        {value}
      </p>
    </div>
  );
}
