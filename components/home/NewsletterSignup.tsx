"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

type State = "idle" | "loading" | "success" | "error";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "Fehler beim Anmelden.");
        setState("error");
      } else {
        setState("success");
      }
    } catch {
      setErrorMsg("Verbindungsfehler. Bitte erneut versuchen.");
      setState("error");
    }
  }

  return (
    <section
      className="py-24 sm:py-32 scroll-fade relative overflow-hidden"
      style={{ background: "#111111" }}
    >
      {/* Subtle orange orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,107,53,0.07), transparent 60%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <span
            className="font-pixel text-accent-orange block mb-5"
            style={{ fontSize: "0.45rem", letterSpacing: "0.2em" }}
          >
            NEWSLETTER
          </span>

          <h2
            className="font-sans font-bold text-white mb-5 leading-tight"
            style={{ fontSize: "clamp(1.75rem, 3vw, 2.75rem)" }}
          >
            Deals direkt ins Postfach.
          </h2>

          <p className="font-sans text-white/55 mb-10 leading-relaxed">
            Neue Arrivals, exklusive Angebote &amp; Retro-Tipps —
            kein Spam, jederzeit abmeldbar.
          </p>

          {state === "success" ? (
            <div className="flex flex-col items-center gap-4 py-10 border border-white/15">
              <CheckCircle size={36} className="text-accent-orange" />
              <p className="font-sans font-semibold text-white text-base">
                Angemeldet ✓
              </p>
              <p className="font-sans text-sm text-white/55">
                Danke! Du erhältst eine Bestätigungsmail.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="deine@email.de"
                  required
                  className="flex-1 bg-white/8 border border-white/15 text-white placeholder:text-white/35 px-5 py-3.5 font-sans text-sm outline-none focus:border-accent-orange transition-colors min-h-[50px]"
                  aria-label="E-Mail-Adresse"
                  disabled={state === "loading"}
                />
                <button
                  type="submit"
                  disabled={state === "loading" || !email.trim()}
                  className="bg-accent-orange text-background px-8 py-3.5 font-sans font-semibold text-sm hover:bg-[#e05a28] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 flex-shrink-0 min-h-[50px]"
                >
                  {state === "loading" ? (
                    <span className="opacity-70">Laden…</span>
                  ) : (
                    <>
                      <Send size={15} />
                      Anmelden
                    </>
                  )}
                </button>
              </div>

              {state === "error" && (
                <div className="flex items-center gap-2 text-red-400 font-sans text-sm">
                  <AlertCircle size={14} />
                  {errorMsg}
                </div>
              )}

              <p className="font-sans text-xs text-white/35">
                Mit der Anmeldung stimmst du unserer{" "}
                <Link href="/datenschutz" className="text-accent-orange hover:underline">
                  Datenschutzerklärung
                </Link>{" "}
                zu.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
