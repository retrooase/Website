import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Einloggen",
  description: "Melde dich bei deinem RetrOase-Account an.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
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
            Willkommen zurück
          </h1>
          <p className="font-sans text-sm text-text-secondary mt-2">
            Melde dich mit deinem Account an.
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface border-2 border-border p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
