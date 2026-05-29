import type { Metadata } from "next";
import Link from "next/link";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { Package, Clock, Send, CheckCircle, XCircle, Bell, Mail } from "lucide-react";
import type { AnkaufStatus } from "@/types";

export const metadata: Metadata = {
  title: "Admin Dashboard | RetrOase",
  robots: { index: false },
};

const STATUS_ORDER: AnkaufStatus[] = [
  "Eingegangen",
  "In Bewertung",
  "Angebot gesendet",
  "Angenommen",
  "Abgelehnt",
];

const STATUS_META: Record<AnkaufStatus, { icon: React.ElementType; color: string; bg: string }> = {
  Eingegangen: { icon: Package, color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
  "In Bewertung": { icon: Clock, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/20" },
  "Angebot gesendet": { icon: Send, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
  Angenommen: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
  Abgelehnt: { icon: XCircle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
};

export default async function AdminDashboard() {
  const admin = createAdminSupabaseClient();

  const [ankaufResult, alertsResult, newsletterResult] = await Promise.all([
    admin.from("ankauf_requests").select("status"),
    admin.from("wishlist_alerts").select("id", { count: "exact", head: true }),
    admin
      .from("newsletter_subscribers")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
  ]);

  const ankaufRows = (ankaufResult.data ?? []) as { status: AnkaufStatus }[];
  const statusCounts: Record<AnkaufStatus, number> = {
    Eingegangen: 0,
    "In Bewertung": 0,
    "Angebot gesendet": 0,
    Angenommen: 0,
    Abgelehnt: 0,
  };
  for (const row of ankaufRows) {
    if (row.status in statusCounts) statusCounts[row.status]++;
  }

  const alertCount = alertsResult.count ?? 0;
  const newsletterCount = newsletterResult.count ?? 0;

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="font-sans text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="font-sans text-sm text-text-secondary mt-1">Übersicht über alle Aktivitäten</p>
      </div>

      {/* Ankauf-Status-Karten */}
      <div className="mb-3">
        <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary mb-3">
          Ankauf-Anfragen
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {STATUS_ORDER.map((status) => {
            const { icon: Icon, color, bg } = STATUS_META[status];
            return (
              <Link
                key={status}
                href={`/admin/ankauf?status=${encodeURIComponent(status)}`}
                className={`flex flex-col gap-2 p-4 border border-border hover:border-accent-orange/50 transition-colors ${bg}`}
              >
                <Icon size={18} className={color} />
                <div>
                  <p className="font-sans text-2xl font-bold text-text-primary leading-none">
                    {statusCounts[status]}
                  </p>
                  <p className="font-sans text-xs text-text-secondary mt-1 leading-snug">{status}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Sonstige Karten */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
        <div className="flex items-center gap-4 p-4 bg-surface border border-border">
          <div className="w-10 h-10 rounded-sm bg-accent-orange/10 flex items-center justify-center flex-shrink-0">
            <Bell size={18} className="text-accent-orange" />
          </div>
          <div>
            <p className="font-sans text-2xl font-bold text-text-primary leading-none">{alertCount}</p>
            <p className="font-sans text-xs text-text-secondary mt-1">Such-Alerts gesamt</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-surface border border-border">
          <div className="w-10 h-10 rounded-sm bg-accent-orange/10 flex items-center justify-center flex-shrink-0">
            <Mail size={18} className="text-accent-orange" />
          </div>
          <div>
            <p className="font-sans text-2xl font-bold text-text-primary leading-none">{newsletterCount}</p>
            <p className="font-sans text-xs text-text-secondary mt-1">Newsletter-Abonnenten</p>
          </div>
        </div>
      </div>
    </div>
  );
}
