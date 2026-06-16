import type { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Checkout abgebrochen | RetrOase",
  robots: { index: false },
};

export default function AbgebrochenPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <XCircle className="mx-auto mb-6 text-text-secondary" size={56} strokeWidth={1.5} />

      <h1 className="font-sans text-2xl font-bold text-text-primary mb-3">
        Checkout abgebrochen
      </h1>
      <p className="font-sans text-text-secondary mb-8">
        Kein Problem — dein Artikel wartet noch auf dich.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/shop" className="btn-primary justify-center">
          Zurück zum Shop
        </Link>
      </div>
    </div>
  );
}
