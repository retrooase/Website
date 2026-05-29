"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, CheckCircle, Loader2, Copy, Check, ExternalLink } from "lucide-react";
import { SITE } from "@/lib/constants";
import { type WizardData, type WizardErrors } from "./types";
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
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [photoWarning, setPhotoWarning] = useState<string | null>(null);
  const [emailWarning, setEmailWarning] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  function scrollTop() {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function update(patch: Partial<WizardData>) {
    setData((prev) => ({ ...prev, ...patch }));
    const next = { ...errors };
    Object.keys(patch).forEach((k) => delete next[k]);
    setErrors(next);
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
