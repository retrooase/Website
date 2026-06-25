"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

type State = "idle" | "loading" | "success" | "error";

export function NewsletterSignup() {
  const [email, setEmail]       = useState("");
  const [state, setState]       = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("loading");

    try {
      const res  = await fetch("/api/newsletter", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: email.trim() }),
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
      className="relative py-24 sm:py-36 scroll-fade overflow-hidden"
      style={{ background: "transparent" }}
      aria-labelledby="newsletter-heading"
    >
      {/* Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(255,95,46,0.09) 0%, transparent 65%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto text-center">

          <p className="font-sans text-xs font-semibold tracking-[0.2em] uppercase text-accent-orange mb-6">
            Newsletter
          </p>

          <h2
            id="newsletter-heading"
            className="font-display font-bold text-white mb-5 leading-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.03em" }}
          >
            Deals direkt
            <br />
            <span className="text-accent-orange">ins Postfach.</span>
          </h2>

          <p className="font-sans text-white/50 mb-3 leading-relaxed max-w-sm mx-auto">
            Neue Arrivals, exklusive Angebote &amp; Retro-Tipps —
            kein Spam, jederzeit abmeldbar.
          </p>

          <p className="font-sans text-xs text-white/30 mb-10">
            Bereits 1.200+ Abonnenten
          </p>

          {state === "success" ? (
            <div className="flex flex-col items-center gap-4 py-10 border border-white/10 rounded-2xl bg-white/[0.03]">
              <CheckCircle size={36} className="text-accent-teal" />
              <p className="font-sans font-semibold text-white text-base">
                Angemeldet ✓
              </p>
              <p className="font-sans text-sm text-white/50">
                Danke! Du erhältst eine Bestätigungsmail.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="deine@email.de"
                  required
                  className="flex-1 bg-white/[0.06] border border-white/[0.12] rounded-full text-white placeholder:text-white/30 px-5 py-3.5 font-sans text-sm outline-none focus:border-accent-orange/60 focus:ring-2 focus:ring-accent-orange/15 transition-all min-h-[50px]"
                  aria-label="E-Mail-Adresse"
                  disabled={state === "loading"}
                />
                <button
                  type="submit"
                  disabled={state === "loading" || !email.trim()}
                  className="flex-shrink-0 inline-flex items-center justify-center gap-2 bg-accent-orange text-white px-7 py-3.5 rounded-full font-sans font-semibold text-sm hover:bg-accent-orange/90 hover:shadow-[0_0_24px_rgba(255,95,46,0.4)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[50px]"
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
                <div className="flex items-center justify-center gap-2 text-red-400 font-sans text-sm">
                  <AlertCircle size={14} aria-hidden="true" />
                  {errorMsg}
                </div>
              )}

              <p className="font-sans text-xs text-white/30">
                Mit der Anmeldung stimmst du unserer{" "}
                <Link href="/datenschutz" className="text-accent-orange/70 hover:text-accent-orange transition-colors underline underline-offset-2">
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
