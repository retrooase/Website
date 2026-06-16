import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { updateAnkaufStatus, updateAnkaufAdmin } from "../actions";
import type { AnkaufStatus, AnkaufLabel } from "@/types";

export const metadata: Metadata = {
  title: "Anfrage Detail | Admin | RetrOase",
  robots: { index: false },
};

const ALL_STATUSES: AnkaufStatus[] = [
  "Eingegangen",
  "In Bewertung",
  "Angebot gesendet",
  "Angenommen",
  "Abgelehnt",
];

const ALL_LABELS: AnkaufLabel[] = [
  "Sehr gefragt",
  "Gut verkäuflich",
  "Schwer zu verkaufen",
  "Zu beschädigt",
  "Hohe Marge möglich",
  "Selten prüfen",
];

type PageProps = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> };

export default async function AnkaufDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { saved } = await searchParams;

  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const admin = createAdminSupabaseClient();
  const { data: row, error } = await admin
    .from("ankauf_requests")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !row) notFound();

  // Signed URLs für Fotos
  const imageUrls: string[] = [];
  const imagePaths: string[] = row.images ?? [];
  for (const path of imagePaths) {
    if (path.startsWith("http")) {
      imageUrls.push(path);
    } else {
      const { data } = await admin.storage
        .from("ankauf-items")
        .createSignedUrl(path, 3600);
      if (data?.signedUrl) imageUrls.push(data.signedUrl);
    }
  }

  const statusAction = updateAnkaufStatus.bind(null, id);
  const adminAction = updateAnkaufAdmin.bind(null, id);

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/ankauf"
          className="flex items-center gap-1.5 font-sans text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={15} />
          Zurück
        </Link>
        <span className="text-border">/</span>
        <StatusBadge status={row.status as AnkaufStatus} />
      </div>

      {saved === "1" && (
        <div className="mb-5 px-4 py-3 bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
          <span className="text-green-600 dark:text-green-400 text-sm font-sans">Änderungen gespeichert.</span>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Linke Spalte: Details */}
        <div className="space-y-5">
          {/* Kontakt */}
          <Section title="Kontakt">
            <Field label="Name" value={row.name} />
            <Field label="E-Mail" value={row.email} />
            {row.phone && <Field label="Telefon" value={row.phone} />}
            {row.plz && <Field label="PLZ" value={row.plz} />}
          </Section>

          {/* Produkt */}
          <Section title="Produkt">
            <Field label="Produkt" value={row.product_name} />
            <Field label="Kategorie" value={row.category} />
            {row.platform && <Field label="Plattform" value={row.platform} />}
            <Field label="Zustand" value={row.condition} />
            {row.completeness?.length > 0 && (
              <Field label="Vollständigkeit" value={row.completeness.join(", ")} />
            )}
            {row.sell_type && <Field label="Verkaufstyp" value={row.sell_type} />}
            <Field label="Menge" value={String(row.quantity)} />
            {row.desired_price != null && (
              <Field label="Wunschpreis" value={`${row.desired_price} €`} />
            )}
          </Section>

          {/* Beschreibung */}
          {row.description && (
            <Section title="Beschreibung">
              <p className="font-sans text-sm text-text-primary whitespace-pre-wrap">{row.description}</p>
            </Section>
          )}

          {/* Meta */}
          <Section title="Meta">
            <Field label="ID" value={row.id} mono />
            <Field
              label="Eingegangen"
              value={new Date(row.created_at).toLocaleString("de-DE")}
            />
            {row.updated_at && (
              <Field
                label="Aktualisiert"
                value={new Date(row.updated_at).toLocaleString("de-DE")}
              />
            )}
          </Section>
        </div>

        {/* Rechte Spalte: Fotos + Admin-Aktionen */}
        <div className="space-y-5">
          {/* Fotos */}
          <Section title={`Fotos (${imageUrls.length})`}>
            {imageUrls.length === 0 ? (
              <p className="font-sans text-sm text-text-secondary">Keine Fotos vorhanden.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {imageUrls.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block aspect-square relative overflow-hidden border border-border hover:border-accent-orange/50 transition-colors">
                    <Image
                      src={url}
                      alt={`Foto ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 200px"
                    />
                  </a>
                ))}
              </div>
            )}
          </Section>

          {/* Status ändern */}
          <Section title="Status ändern">
            <form
              action={async (formData: FormData) => {
                "use server";
                const status = formData.get("status") as AnkaufStatus;
                await statusAction(status);
              }}
              className="flex gap-2"
            >
              <select
                name="status"
                defaultValue={row.status}
                className="pixel-input flex-1 text-sm py-2"
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button type="submit" className="btn-primary py-2 px-4 text-sm whitespace-nowrap">
                Speichern
              </button>
            </form>
            <p className="font-sans text-xs text-text-secondary mt-1">
              Ändert auch den Status auf der Kunden-Seite.
            </p>
          </Section>

          {/* Admin-Felder */}
          <Section title="Admin-Notizen">
            <form
              action={async (formData: FormData) => {
                "use server";
                const comment = formData.get("admin_comment") as string;
                const offerFromRaw = formData.get("offer_from") as string;
                const offerToRaw = formData.get("offer_to") as string;
                const label = (formData.get("admin_label") as AnkaufLabel) || null;
                await adminAction({
                  admin_comment: comment || undefined,
                  offer_from: offerFromRaw ? parseFloat(offerFromRaw) : null,
                  offer_to: offerToRaw ? parseFloat(offerToRaw) : null,
                  admin_label: label,
                });
              }}
              className="space-y-3"
            >
              <div>
                <label className="block font-sans text-xs font-semibold text-text-secondary mb-1">
                  Label
                </label>
                <select name="admin_label" defaultValue={row.admin_label ?? ""} className="pixel-input w-full text-sm py-2">
                  <option value="">— kein Label —</option>
                  {ALL_LABELS.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-sans text-xs font-semibold text-text-secondary mb-1">
                    Angebot von (€)
                  </label>
                  <input
                    type="number"
                    name="offer_from"
                    step="0.01"
                    min="0"
                    defaultValue={row.offer_from ?? ""}
                    className="pixel-input w-full text-sm py-2"
                    placeholder="z. B. 30"
                  />
                </div>
                <div>
                  <label className="block font-sans text-xs font-semibold text-text-secondary mb-1">
                    Angebot bis (€)
                  </label>
                  <input
                    type="number"
                    name="offer_to"
                    step="0.01"
                    min="0"
                    defaultValue={row.offer_to ?? ""}
                    className="pixel-input w-full text-sm py-2"
                    placeholder="z. B. 50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-sans text-xs font-semibold text-text-secondary mb-1">
                  Kommentar (intern)
                </label>
                <textarea
                  name="admin_comment"
                  defaultValue={row.admin_comment ?? ""}
                  rows={3}
                  className="pixel-input w-full text-sm py-2 resize-none"
                  placeholder="Interne Notizen…"
                />
              </div>

              <button type="submit" className="btn-secondary w-full text-sm py-2">
                Notizen speichern
              </button>
            </form>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-border p-4">
      <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary mb-3">
        {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex gap-2">
      <span className="font-sans text-xs text-text-secondary w-28 flex-shrink-0">{label}</span>
      <span className={`font-sans text-sm text-text-primary break-all ${mono ? "font-mono text-xs" : ""}`}>
        {value}
      </span>
    </div>
  );
}
