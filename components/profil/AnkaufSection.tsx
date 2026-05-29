"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ExternalLink, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type AnkaufRequest = {
  id: string;
  product_name: string;
  category: string;
  condition: string;
  status: string;
  created_at: string;
};

const statusColor: Record<string, string> = {
  Eingegangen: "text-accent-yellow",
  "In Bewertung": "text-accent-orange",
  "Angebot gesendet": "text-success",
  Angenommen: "text-success",
  Abgelehnt: "text-error",
};

const statusDot: Record<string, string> = {
  Eingegangen: "bg-accent-yellow",
  "In Bewertung": "bg-accent-orange",
  "Angebot gesendet": "bg-success",
  Angenommen: "bg-success",
  Abgelehnt: "bg-error",
};

type Props = { email: string };

export function AnkaufSection({ email }: Props) {
  const [requests, setRequests] = useState<AnkaufRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("ankauf_requests")
      .select("id, product_name, category, condition, status, created_at")
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setRequests((data as AnkaufRequest[]) ?? []);
        setLoading(false);
      });
  }, [email]);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Package size={18} className="text-accent-orange" />
        <h2 className="font-pixel text-text-primary" style={{ fontSize: "0.6rem" }}>
          MEINE ANKAUF-ANFRAGEN
        </h2>
        {requests.length > 0 && (
          <span className="font-sans text-xs text-text-secondary bg-surface-hover border border-border px-2 py-0.5">
            {requests.length}
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-surface-hover animate-pulse" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="border-2 border-dashed border-border p-8 text-center">
          <Package size={32} className="text-border mx-auto mb-3" />
          <p className="font-sans text-sm text-text-secondary mb-4">
            Noch keine Ankauf-Anfragen vorhanden.
          </p>
          <Link href="/ankauf" className="btn-primary inline-flex justify-center">
            Jetzt Ankauf starten
          </Link>
        </div>
      ) : (
        <ul className="space-y-2">
          {requests.map((req) => (
            <li
              key={req.id}
              className="flex items-center gap-3 p-3.5 bg-surface border border-border hover:border-text-secondary/30 transition-colors"
            >
              {/* Status dot */}
              <span
                className={`flex-shrink-0 w-2.5 h-2.5 ${statusDot[req.status] ?? "bg-text-secondary"}`}
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-sans text-sm font-semibold text-text-primary truncate">
                  {req.product_name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-sans text-xs text-text-secondary">
                    {req.category}
                  </span>
                  <span className="text-border">·</span>
                  <span
                    className={`font-sans text-xs font-semibold ${statusColor[req.status] ?? "text-text-secondary"}`}
                  >
                    {req.status}
                  </span>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-1 flex-shrink-0 text-text-secondary">
                <Clock size={11} />
                <span className="font-sans text-xs">{formatDate(req.created_at)}</span>
              </div>

              {/* Link */}
              <Link
                href={`/ankauf/status/${req.id}`}
                className="flex-shrink-0 text-text-secondary hover:text-accent-orange transition-colors p-1"
                aria-label="Anfrage-Status ansehen"
              >
                <ExternalLink size={14} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
