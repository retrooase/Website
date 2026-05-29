"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bell, BellOff, Plus, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES, CONDITIONS } from "@/lib/constants";

type Alert = {
  id: string;
  search_query: string;
  category: string | null;
  platform: string | null;
  condition: string | null;
  max_price: number | null;
  is_active: boolean;
  created_at: string;
};

const schema = z.object({
  search_query: z.string().min(2, "Mindestens 2 Zeichen").max(100),
  category: z.string().optional(),
  platform: z.string().max(60).optional(),
  condition: z.string().optional(),
  max_price: z.string().optional(),
});

type Fields = z.infer<typeof schema>;

type Props = { userId: string };

export function AlertsSection({ userId }: Props) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Fields>({ resolver: zodResolver(schema) });

  useEffect(() => {
    loadAlerts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function loadAlerts() {
    const supabase = createClient();
    const { data } = await supabase
      .from("wishlist_alerts")
      .select("*")
      .order("created_at", { ascending: false });
    setAlerts((data as Alert[]) ?? []);
    setLoading(false);
  }

  async function onCreate(data: Fields) {
    setCreating(true);
    setFormError(null);
    const parsedPrice = data.max_price ? parseFloat(data.max_price) : null;
    if (data.max_price && (isNaN(parsedPrice!) || parsedPrice! <= 0)) {
      setFormError("Ungültiger Preis.");
      setCreating(false);
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.from("wishlist_alerts").insert({
      user_id: userId,
      search_query: data.search_query.trim(),
      category: data.category || null,
      platform: data.platform?.trim() || null,
      condition: data.condition || null,
      max_price: parsedPrice,
      is_active: true,
    });

    if (error) {
      setFormError("Fehler beim Erstellen. Bitte erneut versuchen.");
    } else {
      reset();
      setShowForm(false);
      await loadAlerts();
    }
    setCreating(false);
  }

  async function toggleActive(id: string, current: boolean) {
    const supabase = createClient();
    await supabase
      .from("wishlist_alerts")
      .update({ is_active: !current })
      .eq("id", id);
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, is_active: !current } : a))
    );
  }

  async function deleteAlert(id: string) {
    const supabase = createClient();
    await supabase.from("wishlist_alerts").delete().eq("id", id);
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-accent-orange" />
          <h2 className="font-pixel text-text-primary" style={{ fontSize: "0.6rem" }}>
            SUCH-ALERTS
          </h2>
          {alerts.length > 0 && (
            <span className="font-sans text-xs text-text-secondary bg-surface-hover border border-border px-2 py-0.5">
              {alerts.length}
            </span>
          )}
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setFormError(null); }}
          className="btn-secondary text-xs py-1.5 px-3 min-h-[36px]"
        >
          {showForm ? <X size={13} /> : <Plus size={13} />}
          {showForm ? "Abbrechen" : "Neuer Alert"}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form
          onSubmit={handleSubmit(onCreate)}
          className="border-2 border-accent-orange/40 bg-surface p-5 mb-5 space-y-4"
        >
          <h3 className="font-pixel text-text-primary" style={{ fontSize: "0.55rem" }}>
            ALERT ERSTELLEN
          </h3>

          <div>
            <label className="block font-sans text-xs font-semibold text-text-secondary mb-1">
              Was suchst du? *
            </label>
            <input
              type="text"
              className="pixel-input w-full"
              placeholder="z. B. Game Boy Color Lila, Pokémon Gelb OVP…"
              {...register("search_query")}
            />
            {errors.search_query && (
              <p className="mt-1 font-sans text-xs text-error">{errors.search_query.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-sans text-xs font-semibold text-text-secondary mb-1">
                Kategorie
              </label>
              <select className="pixel-input w-full" {...register("category")}>
                <option value="">Alle Kategorien</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.label}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-sans text-xs font-semibold text-text-secondary mb-1">
                Zustand
              </label>
              <select className="pixel-input w-full" {...register("condition")}>
                <option value="">Alle Zustände</option>
                {CONDITIONS.map((c) => (
                  <option key={c.id} value={c.label}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-sans text-xs font-semibold text-text-secondary mb-1">
                Plattform (optional)
              </label>
              <input
                type="text"
                className="pixel-input w-full"
                placeholder="z. B. Game Boy Color"
                {...register("platform")}
              />
            </div>

            <div>
              <label className="block font-sans text-xs font-semibold text-text-secondary mb-1">
                Max. Preis (€)
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                className="pixel-input w-full"
                placeholder="z. B. 80"
                {...register("max_price")}
              />
              {errors.max_price && (
                <p className="mt-1 font-sans text-xs text-error">{errors.max_price.message as string}</p>
              )}
            </div>
          </div>

          {formError && (
            <p className="font-sans text-xs text-error">{formError}</p>
          )}

          <button type="submit" disabled={creating} className="btn-primary">
            <Bell size={14} />
            {creating ? "Wird erstellt…" : "Alert aktivieren"}
          </button>
        </form>
      )}

      {/* Alert list */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-16 bg-surface-hover animate-pulse" />
          ))}
        </div>
      ) : alerts.length === 0 ? (
        <div className="border-2 border-dashed border-border p-8 text-center">
          <Bell size={32} className="text-border mx-auto mb-3" />
          <p className="font-sans text-sm text-text-secondary mb-1">
            Keine Such-Alerts vorhanden.
          </p>
          <p className="font-sans text-xs text-text-secondary">
            Lege einen Alert an und werde benachrichtigt, sobald wir ein passendes Produkt haben.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {alerts.map((alert) => (
            <AlertRow
              key={alert.id}
              alert={alert}
              onToggle={toggleActive}
              onDelete={deleteAlert}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function AlertRow({
  alert,
  onToggle,
  onDelete,
}: {
  alert: Alert;
  onToggle: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const chips = [
    alert.category,
    alert.platform,
    alert.condition,
    alert.max_price ? `≤ ${alert.max_price} €` : null,
  ].filter(Boolean) as string[];

  return (
    <li className="flex items-start gap-3 p-3.5 bg-surface border border-border hover:border-text-secondary/30 transition-colors">
      {/* Toggle */}
      <button
        onClick={() => onToggle(alert.id, alert.is_active)}
        className={`mt-0.5 flex-shrink-0 transition-colors ${
          alert.is_active ? "text-accent-orange" : "text-text-secondary"
        }`}
        aria-label={alert.is_active ? "Alert deaktivieren" : "Alert aktivieren"}
      >
        {alert.is_active ? <Bell size={16} /> : <BellOff size={16} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`font-sans text-sm font-semibold leading-snug ${
            alert.is_active ? "text-text-primary" : "text-text-secondary line-through"
          }`}
        >
          {alert.search_query}
        </p>
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {chips.map((chip) => (
              <span
                key={chip}
                className="font-sans text-xs text-text-secondary bg-surface-hover border border-border px-1.5 py-0.5"
              >
                {chip}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Delete */}
      <button
        onClick={() => onDelete(alert.id)}
        className="flex-shrink-0 text-text-secondary hover:text-error transition-colors p-1"
        aria-label="Alert löschen"
      >
        <Trash2 size={14} />
      </button>
    </li>
  );
}
