import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Registrieren",
  description: "Erstelle deinen kostenlosen RetrOase-Account.",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-1 mb-6">
            <span className="font-pixel text-accent-orange" style={{ fontSize: "0.85rem" }}>
              Retr
            </span>
            <span className="font-pixel text-accent-yellow" style={{ fontSize: "0.85rem" }}>
              Oase
            </span>
          </Link>
          <h1 className="font-sans text-2xl font-bold text-text-primary">
            Account erstellen
          </h1>
          <p className="font-sans text-sm text-text-secondary mt-2">
            Kostenlos · Wunschliste speichern · Such-Alerts anlegen
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface border-2 border-border p-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
