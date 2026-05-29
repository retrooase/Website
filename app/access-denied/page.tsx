import type { Metadata } from "next";
import Link from "next/link";
import { ShieldX } from "lucide-react";

export const metadata: Metadata = {
  title: "Kein Zugriff | RetrOase",
  robots: { index: false },
};

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-surface border-2 border-border flex items-center justify-center">
            <ShieldX size={28} className="text-error" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="font-pixel text-text-primary" style={{ fontSize: "0.7rem" }}>
            KEIN ZUGRIFF
          </h1>
          <p className="font-sans text-sm text-text-secondary">
            Du hast keine Berechtigung, diesen Bereich zu betreten.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-secondary text-xs py-2 px-5">
            Zur Startseite
          </Link>
          <Link href="/profil" className="btn-primary text-xs py-2 px-5">
            Mein Profil
          </Link>
        </div>
      </div>
    </div>
  );
}
