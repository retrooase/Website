"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { clsx } from "clsx";

const COOKIE_KEY = "retroase_cookie_consent";

type ConsentState = "accepted" | "rejected" | null;

export function CookieBanner() {
  const [consent, setConsent] = useState<ConsentState>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY) as ConsentState;
    if (!stored) {
      // Kurze Verzögerung für bessere UX.
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
    setConsent(stored);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setConsent("accepted");
    setIsVisible(false);
    // Google Analytics aktivieren [ASSUMPTION: GA4 wird in Phase 7 integriert]
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_KEY, "rejected");
    setConsent("rejected");
    setIsVisible(false);
  };

  if (!isVisible || consent !== null) return null;

  return (
    <div
      className={clsx(
        "fixed bottom-0 left-0 right-0 z-50 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:p-6",
        "bg-surface/98 backdrop-blur-md border-t-2 border-border",
        "animate-slide-up",
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Cookie-Einstellungen"
      aria-live="polite"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex items-start gap-2.5 sm:gap-3 flex-1">
            <Cookie
              size={20}
              className="text-accent-orange flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <p
                className="font-pixel text-text-primary mb-0.5 sm:mb-1"
                style={{ fontSize: "0.52rem", lineHeight: "1.7" }}
              >
                Cookies & Datenschutz
              </p>
              <p className="font-sans text-[0.72rem] sm:text-xs text-text-secondary leading-relaxed">
                <span className="sm:hidden">
                  Cookies für Analytics und Einkaufserlebnis. Mehr in der{" "}
                </span>
                <span className="hidden sm:inline">
                  Wir nutzen Cookies für Analytics und ein besseres Einkaufserlebnis.
                  Deine Daten bleiben in Deutschland. Mehr dazu in unserer{" "}
                </span>
                <Link href="/datenschutz" className="text-accent-orange hover:underline">
                  Datenschutzerklärung
                </Link>
                <span className="hidden sm:inline">.</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-2 sm:gap-3 flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={handleReject}
              className="btn-secondary py-2 px-3 sm:px-4 text-center justify-center"
              style={{ fontSize: "0.48rem", minHeight: "40px" }}
            >
              Ablehnen
            </button>
            <button
              onClick={handleAccept}
              className="btn-primary py-2 px-3 sm:px-4 text-center justify-center"
              style={{ fontSize: "0.48rem", minHeight: "40px" }}
            >
              Alle akzeptieren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
