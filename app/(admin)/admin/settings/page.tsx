import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Einstellungen | Admin | RetrOase",
  robots: { index: false },
};

export default function SettingsPage() {
  const adminEmail = process.env.ADMIN_EMAIL || SITE.adminEmail;

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="font-sans text-2xl font-bold text-text-primary">Einstellungen</h1>
        <p className="font-sans text-sm text-text-secondary mt-1">System-Übersicht und Konfiguration</p>
      </div>

      <div className="space-y-5">
        {/* Admin */}
        <Section title="Admin-Konfiguration">
          <div className="space-y-2">
            <Row label="Admin-E-Mail" value={adminEmail} />
            <Row label="Shop-Name" value={SITE.name} />
            <Row label="Domain" value={SITE.domain} />
          </div>
        </Section>

        {/* Storage Buckets */}
        <Section title="Storage Buckets (Supabase)">
          <p className="font-sans text-xs text-text-secondary mb-3">
            Diese Buckets müssen im Supabase Dashboard unter Storage manuell angelegt sein.
          </p>
          <div className="space-y-2">
            {[
              { name: "ankauf-items", type: "Privat", note: "Fotos aus Ankauf-Anfragen", status: "ok" },
              { name: "product-images", type: "Öffentlich", note: "Produktbilder", status: "manual" },
              { name: "blog-images", type: "Öffentlich", note: "Blog-Titelbilder", status: "manual" },
            ].map((b) => (
              <div key={b.name} className="flex items-center justify-between gap-3 p-3 border border-border">
                <div className="flex items-center gap-3">
                  {b.status === "ok" ? (
                    <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle size={14} className="text-amber-500 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-mono text-xs font-semibold text-text-primary">{b.name}</p>
                    <p className="font-sans text-xs text-text-secondary">{b.note}</p>
                  </div>
                </div>
                <span className={`font-sans text-xs px-2 py-0.5 ${b.type === "Öffentlich" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" : "bg-surface-hover text-text-secondary border border-border"}`}>
                  {b.type}
                </span>
              </div>
            ))}
          </div>
          <p className="font-sans text-xs text-amber-600 dark:text-amber-400 mt-3">
            Buckets mit ⚠ müssen manuell im Supabase Dashboard angelegt werden, falls noch nicht vorhanden.
          </p>
        </Section>

        {/* Env-Variablen */}
        <Section title="Benötigte Env-Variablen">
          <p className="font-sans text-xs text-text-secondary mb-3">
            Werte werden aus Sicherheitsgründen nicht angezeigt.
          </p>
          <div className="space-y-1">
            {[
              { name: "NEXT_PUBLIC_SUPABASE_URL", desc: "Supabase-Projekt-URL", required: true },
              { name: "NEXT_PUBLIC_SUPABASE_ANON_KEY", desc: "Supabase Anon-Key (öffentlich)", required: true },
              { name: "SUPABASE_SERVICE_ROLE_KEY", desc: "Supabase Service-Role-Key (Admin)", required: true },
              { name: "ADMIN_EMAIL", desc: "Admin-E-Mail(s), kommasepariert", required: false },
              { name: "RESEND_API_KEY", desc: "Resend API Key für E-Mail-Versand", required: false },
              { name: "RESEND_FROM_EMAIL", desc: "Absender-E-Mail (z. B. info@retroase.de)", required: false },
            ].map((v) => (
              <div key={v.name} className="flex items-center gap-3 py-2 border-b border-border last:border-b-0">
                <span className={`font-sans text-[10px] px-1.5 py-0.5 flex-shrink-0 ${v.required ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" : "bg-surface-hover text-text-secondary border border-border"}`}>
                  {v.required ? "Pflicht" : "Optional"}
                </span>
                <span className="font-mono text-xs text-text-primary">{v.name}</span>
                <span className="font-sans text-xs text-text-secondary ml-auto text-right">{v.desc}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Ausstehende Integrationen */}
        <Section title="Ausstehende Integrationen">
          {[
            {
              name: "eBay Developer",
              status: "pending",
              note: "Beim Launch: EBAY_VERIFICATION_TOKEN + Endpoint https://retroase.de/api/ebay/account-deletion im Developer Portal eintragen → Keys werden aktiviert.",
              icon: Clock,
            },
            {
              name: "Stripe",
              status: "pending",
              note: "Stripe-Keys und Checkout erst einrichten wenn Phase 6 (Shop-Integration) beginnt.",
              icon: Clock,
            },
            {
              name: "Domain retroase.de",
              status: "pending",
              note: "Domain bei Porkbun registrieren und DNS auf Vercel zeigen nach dem Launch.",
              icon: Clock,
            },
          ].map((item) => (
            <div key={item.name} className="flex gap-3 p-3 border border-amber-200 bg-amber-50 dark:border-amber-800/50 dark:bg-amber-900/10 mb-2 last:mb-0">
              <item.icon size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-sans text-sm font-semibold text-text-primary">{item.name}</p>
                <p className="font-sans text-xs text-text-secondary mt-0.5">{item.note}</p>
              </div>
            </div>
          ))}
        </Section>

        {/* Build-Info */}
        <Section title="Build-Info">
          <div className="space-y-2">
            <Row label="Framework" value="Next.js 14 App Router" />
            <Row label="Hosting" value="Vercel (Hobby)" />
            <Row label="Datenbank" value="Supabase (Free Tier)" />
            <Row label="E-Mail" value="Resend" />
            <Row label="Payments" value="Stripe (ausstehend)" />
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-border p-4">
      <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="font-sans text-xs text-text-secondary w-32 flex-shrink-0">{label}</span>
      <span className="font-sans text-xs text-text-primary">{value}</span>
    </div>
  );
}
