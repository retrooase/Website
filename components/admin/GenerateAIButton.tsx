"use client";

import { useState } from "react";
import { Sparkles, Copy, Check } from "lucide-react";
import { generateAIDescription, type AIResult } from "@/app/(admin)/admin/products/ai-actions";

export function GenerateAIButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AIResult | null>(null);

  async function handleGenerate() {
    const get = (name: string) =>
      (
        document.querySelector(
          `[name="${name}"]`
        ) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null
      )?.value ?? "";

    const input = {
      title: get("title"),
      platform: get("platform"),
      category: get("category"),
      condition: get("condition"),
      badge: get("badge"),
      price: get("price"),
      language: get("language"),
      region: get("region"),
    };

    if (!input.title.trim()) {
      setError("Bitte zuerst einen Titel eingeben.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const res = await generateAIDescription(input);
    setLoading(false);

    if (!res.ok) {
      setError(res.error);
      return;
    }

    const textarea = document.querySelector(
      '[name="description"]'
    ) as HTMLTextAreaElement | null;
    if (textarea) {
      textarea.value = res.data.shop_beschreibung;
    }

    setResult(res.data);
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading}
        className="flex items-center gap-2 font-sans text-xs font-semibold px-3 py-2 border border-accent-orange/50 text-accent-orange hover:bg-accent-orange/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Sparkles size={13} />
        {loading ? "KI generiert…" : "KI generieren"}
      </button>

      {error && (
        <p className="font-sans text-xs text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2">
          {error}
        </p>
      )}

      {result && (
        <div className="border border-border bg-surface p-3 space-y-3">
          <p className="font-sans text-xs text-accent-green flex items-center gap-1.5">
            <Check size={12} /> Beschreibung automatisch befüllt
          </p>

          <CopyRow label="eBay-Titel" value={result.ebay_titel} />
          <CopyRow label="Instagram Caption" value={result.instagram_caption} />

          <div>
            <p className="font-sans text-xs font-semibold text-text-secondary mb-0.5">Bundle-Tipp</p>
            <p className="font-sans text-xs text-text-primary">{result.bundle_tipp}</p>
          </div>

          <div>
            <p className="font-sans text-xs font-semibold text-text-secondary mb-0.5">Preis-Einschätzung</p>
            <p className="font-sans text-xs text-text-primary">{result.preis_einschaetzung}</p>
          </div>

          {result.seo_keywords.length > 0 && (
            <div>
              <p className="font-sans text-xs font-semibold text-text-secondary mb-1">SEO-Keywords</p>
              <div className="flex flex-wrap gap-1">
                {result.seo_keywords.map((kw) => (
                  <span key={kw} className="font-sans text-xs bg-surface-hover border border-border px-2 py-0.5 text-text-secondary">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-0.5">
        <p className="font-sans text-xs font-semibold text-text-secondary">{label}</p>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1 font-sans text-xs text-accent-orange hover:underline"
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? "Kopiert" : "Kopieren"}
        </button>
      </div>
      <p className="font-sans text-xs text-text-primary leading-relaxed">{value}</p>
    </div>
  );
}
