"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle, ChevronDown } from "lucide-react";
import { CATEGORIES, CONDITIONS } from "@/lib/constants";

type State = "idle" | "loading" | "success" | "error";

type FormData = {
  name: string;
  email: string;
  category: string;
  condition: string;
  description: string;
};

export function AnkaufForm() {
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    category: "",
    condition: "",
    description: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.category || !form.description.trim()) return;
    setState("loading");

    try {
      const res = await fetch("/api/ankauf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Fehler beim Absenden.");
        setState("error");
      } else {
        setState("success");
      }
    } catch {
      setErrorMsg("Verbindungsfehler. Bitte erneut versuchen.");
      setState("error");
    }
  }

  const isValid =
    form.name.trim() && form.email.trim() && form.category && form.description.trim();

  if (state === "success") {
    return (
      <div className="flex flex-col items-center gap-5 py-16 text-center">
        <CheckCircle size={44} className="text-accent-orange" />
        <h3 className="font-sans font-bold text-text-primary text-xl">
          Anfrage eingegangen!
        </h3>
        <p className="font-sans text-text-secondary leading-relaxed max-w-sm">
          Wir melden uns innerhalb von 24 Stunden per E-Mail mit einem Angebot.
        </p>
        <p className="font-sans text-xs text-text-secondary border border-border px-4 py-2">
          Kein Druck — du entscheidest, ob du annimmst.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Name + E-Mail */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label
            className="font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2 block"
            htmlFor="af-name"
          >
            Dein Name
          </label>
          <input
            id="af-name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Max Mustermann"
            required
            disabled={state === "loading"}
            className="w-full bg-surface border border-border text-text-primary placeholder:text-text-secondary px-4 py-3 font-sans text-sm outline-none focus:border-accent-orange transition-colors min-h-[44px]"
          />
        </div>
        <div>
          <label
            className="font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2 block"
            htmlFor="af-email"
          >
            E-Mail
          </label>
          <input
            id="af-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="du@email.de"
            required
            disabled={state === "loading"}
            className="w-full bg-surface border border-border text-text-primary placeholder:text-text-secondary px-4 py-3 font-sans text-sm outline-none focus:border-accent-orange transition-colors min-h-[44px]"
          />
        </div>
      </div>

      {/* Kategorie + Zustand */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label
            className="font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2 block"
            htmlFor="af-category"
          >
            Kategorie
          </label>
          <div className="relative">
            <select
              id="af-category"
              name="category"
              value={form.category}
              onChange={handleChange}
              disabled={state === "loading"}
              className="w-full bg-surface border border-border text-text-primary px-4 py-3 pr-10 appearance-none cursor-pointer font-sans text-sm min-h-[44px] outline-none focus:border-accent-orange transition-colors"
            >
              <option value="">— Kategorie wählen —</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.label} className="bg-surface">
                  {cat.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
            />
          </div>
        </div>
        <div>
          <label
            className="font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2 block"
            htmlFor="af-condition"
          >
            Zustand
          </label>
          <div className="relative">
            <select
              id="af-condition"
              name="condition"
              value={form.condition}
              onChange={handleChange}
              disabled={state === "loading"}
              className="w-full bg-surface border border-border text-text-primary px-4 py-3 pr-10 appearance-none cursor-pointer font-sans text-sm min-h-[44px] outline-none focus:border-accent-orange transition-colors"
            >
              <option value="">— Zustand wählen —</option>
              {CONDITIONS.map((c) => (
                <option key={c.id} value={c.label} className="bg-surface">
                  {c.label} — {c.description}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Beschreibung */}
      <div>
        <label
          className="font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2 block"
          htmlFor="af-description"
        >
          Was möchtest du verkaufen?
        </label>
        <textarea
          id="af-description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="z.B. Game Boy Color (lila), läuft einwandfrei, mit OVP + 5 Spiele (Pokémon Gelb, Tetris ...)"
          rows={4}
          required
          disabled={state === "loading"}
          className="w-full bg-surface border border-border text-text-primary placeholder:text-text-secondary px-4 py-3 font-sans text-sm outline-none focus:border-accent-orange transition-colors resize-none leading-relaxed"
        />
      </div>

      {/* Fehler */}
      {state === "error" && (
        <div className="flex items-center gap-2 text-error font-sans text-sm">
          <AlertCircle size={14} />
          {errorMsg}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={state === "loading" || !isValid}
        className="bg-accent-orange text-background w-full px-8 py-4 font-sans font-semibold text-sm hover:bg-[#e05a28] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[52px]"
      >
        {state === "loading" ? (
          <span className="opacity-70">Wird gesendet…</span>
        ) : (
          <>
            <Send size={16} />
            Angebot anfragen
          </>
        )}
      </button>

      <p className="font-sans text-xs text-text-secondary text-center">
        Kein Risiko — du entscheidest ob du annimmst.
      </p>
    </form>
  );
}
