import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Clock, ChevronRight, ArrowLeft, AlertCircle } from "lucide-react";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Anfrage-Status | RetrOase",
  robots: "noindex,nofollow",
};

// ─── Typen ───────────────────────────────────────────────────
const STATUS_STEPS = [
  "Eingegangen",
  "In Bewertung",
  "Angebot gesendet",
  "Angenommen",
] as const;

type AnkaufStatus =
  | "Eingegangen"
  | "In Bewertung"
  | "Angebot gesendet"
  | "Angenommen"
  | "Abgelehnt";

interface AnkaufRequest {
  id: string;
  product_name: string;
  category: string;
  platform: string | null;
  condition: string;
  status: AnkaufStatus;
  created_at: string;
}

// ─── Hilfsfunktionen ─────────────────────────────────────────
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getActiveIndex(status: AnkaufStatus): number {
  if (status === "Abgelehnt") return -1;
  return STATUS_STEPS.indexOf(status as typeof STATUS_STEPS[number]);
}

// ─── Komponenten ─────────────────────────────────────────────
function StatusTimeline({ status }: { status: AnkaufStatus }) {
  const activeIdx = getActiveIndex(status);
  const isRejected = status === "Abgelehnt";

  if (isRejected) {
    return (
      <div className="flex items-center gap-3 border border-red-300/40 bg-red-50/30 dark:bg-red-400/5 px-5 py-4 mb-8">
        <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
        <div>
          <p className="font-sans font-semibold text-sm text-red-600 dark:text-red-400">
            Anfrage abgelehnt
          </p>
          <p className="font-sans text-xs text-text-secondary mt-0.5">
            Wir konnten leider kein Angebot machen. Bei Fragen: hallo@retroase.de
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* Desktop — horizontal */}
      <div className="hidden sm:flex items-center">
        {STATUS_STEPS.map((step, i) => {
          const isDone = i < activeIdx;
          const isCurrent = i === activeIdx;

          return (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 flex items-center justify-center border-2 transition-colors ${
                    isDone
                      ? "border-accent-orange bg-accent-orange"
                      : isCurrent
                      ? "border-accent-orange bg-transparent"
                      : "border-border bg-transparent"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle size={14} className="text-background" />
                  ) : isCurrent ? (
                    <Clock size={14} className="text-accent-orange" />
                  ) : (
                    <span className="w-2 h-2 bg-border rounded-full" />
                  )}
                </div>
                <p
                  className={`font-sans text-[10px] mt-2 text-center max-w-[80px] leading-tight ${
                    isCurrent
                      ? "font-semibold text-accent-orange"
                      : isDone
                      ? "font-medium text-text-primary"
                      : "text-text-secondary"
                  }`}
                >
                  {step}
                </p>
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div
                  className={`h-px flex-1 mx-2 mb-5 ${
                    isDone ? "bg-accent-orange" : "bg-border"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile — vertical */}
      <div className="sm:hidden space-y-3">
        {STATUS_STEPS.map((step, i) => {
          const isDone = i < activeIdx;
          const isCurrent = i === activeIdx;

          return (
            <div key={step} className="flex items-center gap-3">
              <div
                className={`w-6 h-6 flex items-center justify-center border-2 flex-shrink-0 ${
                  isDone
                    ? "border-accent-orange bg-accent-orange"
                    : isCurrent
                    ? "border-accent-orange"
                    : "border-border"
                }`}
              >
                {isDone ? (
                  <CheckCircle size={11} className="text-background" />
                ) : isCurrent ? (
                  <Clock size={11} className="text-accent-orange" />
                ) : (
                  <span className="w-1.5 h-1.5 bg-border rounded-full" />
                )}
              </div>
              <span
                className={`font-sans text-sm ${
                  isCurrent
                    ? "font-semibold text-accent-orange"
                    : isDone
                    ? "font-medium text-text-primary"
                    : "text-text-secondary"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-14 h-14 border border-border bg-surface flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={24} className="text-text-secondary" />
        </div>
        <h1 className="font-sans font-bold text-text-primary text-xl mb-3">
          Anfrage nicht gefunden
        </h1>
        <p className="font-sans text-sm text-text-secondary mb-8 leading-relaxed">
          Diese Anfrage-ID existiert nicht oder ist ungültig.
          Bitte prüfe den Link oder starte eine neue Anfrage.
        </p>
        <Link
          href="/ankauf#angebot"
          className="inline-flex items-center gap-2 bg-accent-orange text-background font-sans font-semibold text-sm px-6 py-3 hover:bg-[#e05a28] transition-colors"
        >
          <ArrowLeft size={14} />
          Neue Anfrage stellen
        </Link>
      </div>
    </div>
  );
}

// ─── Seite ───────────────────────────────────────────────────
export default async function AnkaufStatusPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  // Basis-Validierung: muss UUID-ähnlich sein
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidPattern.test(id)) {
    return <NotFound />;
  }

  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("ankauf_requests")
    .select("id, product_name, category, platform, condition, status, created_at")
    .eq("id", id)
    .single();

  if (error || !data) {
    return <NotFound />;
  }

  const request = data as AnkaufRequest;

  return (
    <main className="min-h-[70vh] bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-surface">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 font-sans text-xs text-text-secondary">
            <Link href="/" className="hover:text-accent-orange transition-colors">
              Startseite
            </Link>
            <ChevronRight size={12} />
            <Link href="/ankauf" className="hover:text-accent-orange transition-colors">
              Ankauf
            </Link>
            <ChevronRight size={12} />
            <span className="text-text-primary">Status</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-accent-orange mb-2">
              Ankauf-Status
            </p>
            <h1
              className="font-sans font-bold text-text-primary leading-tight"
              style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
            >
              {request.product_name}
            </h1>
          </div>

          {/* Status-Timeline */}
          <div className="border border-border bg-background p-6 mb-6">
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary mb-6">
              Status-Verlauf
            </p>
            <StatusTimeline status={request.status} />
            <p className="font-sans text-xs text-text-secondary">
              Aktueller Status:{" "}
              <span className="font-semibold text-accent-orange">{request.status}</span>
            </p>
          </div>

          {/* Details */}
          <div className="border border-border bg-background p-6 mb-6">
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary mb-4">
              Produkt-Details
            </p>
            <div className="space-y-3">
              {[
                { label: "Anfrage-ID", value: request.id.toUpperCase(), mono: true },
                { label: "Produkt", value: request.product_name },
                { label: "Kategorie", value: request.category },
                ...(request.platform ? [{ label: "Plattform", value: request.platform }] : []),
                { label: "Zustand", value: request.condition },
                { label: "Eingegangen am", value: formatDate(request.created_at) },
              ].map(({ label, value, mono }) => (
                <div
                  key={label}
                  className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-2 border-b border-border last:border-0"
                >
                  <span className="font-sans text-xs text-text-secondary sm:w-36 flex-shrink-0">
                    {label}
                  </span>
                  <span
                    className={`font-sans text-sm text-text-primary font-medium break-all ${
                      mono ? "font-mono text-xs" : ""
                    }`}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Hinweis */}
          <div className="border border-border bg-surface p-5 mb-8">
            <p className="font-sans text-xs font-semibold text-text-primary mb-1">
              Fragen zu deiner Anfrage?
            </p>
            <p className="font-sans text-xs text-text-secondary leading-relaxed">
              Schreib uns unter{" "}
              <a
                href="mailto:hallo@retroase.de"
                className="text-accent-orange hover:underline"
              >
                hallo@retroase.de
              </a>{" "}
              und gib deine Anfrage-ID an. Wir melden uns schnellstmöglich.
            </p>
          </div>

          {/* Back */}
          <Link
            href="/ankauf"
            className="inline-flex items-center gap-2 font-sans text-sm text-text-secondary hover:text-accent-orange transition-colors"
          >
            <ArrowLeft size={14} />
            Zurück zum Ankauf
          </Link>
        </div>
      </div>
    </main>
  );
}
