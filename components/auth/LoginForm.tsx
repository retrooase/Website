"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const schema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse"),
  password: z.string().min(6, "Mindestens 6 Zeichen"),
});

type Fields = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [forgotSent, setForgotSent] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<Fields>({ resolver: zodResolver(schema) });

  async function onSubmit(data: Fields) {
    setServerError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email.trim().toLowerCase(),
      password: data.password,
    });
    if (error) {
      setServerError(
        error.message === "Invalid login credentials"
          ? "E-Mail oder Passwort falsch."
          : "Anmeldung fehlgeschlagen. Bitte erneut versuchen."
      );
      return;
    }
    router.push("/profil");
    router.refresh();
  }

  async function handleForgot() {
    const email = getValues("email");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setServerError("Bitte E-Mail eingeben, dann 'Passwort vergessen' klicken.");
      return;
    }
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/profil`,
    });
    setForgotSent(true);
    setServerError(null);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* E-Mail */}
      <div>
        <label className="block font-sans text-sm font-semibold text-text-primary mb-1.5">
          E-Mail
        </label>
        <input
          type="email"
          autoComplete="email"
          className="pixel-input w-full"
          placeholder="deine@email.de"
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1 font-sans text-xs text-error">{errors.email.message}</p>
        )}
      </div>

      {/* Passwort */}
      <div>
        <label className="block font-sans text-sm font-semibold text-text-primary mb-1.5">
          Passwort
        </label>
        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            autoComplete="current-password"
            className="pixel-input w-full pr-11"
            placeholder="••••••••"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
            aria-label={showPw ? "Passwort verbergen" : "Passwort anzeigen"}
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 font-sans text-xs text-error">{errors.password.message}</p>
        )}
      </div>

      {/* Fehler / Erfolg */}
      {serverError && (
        <div className="bg-error/10 border border-error/30 px-4 py-3">
          <p className="font-sans text-sm text-error">{serverError}</p>
        </div>
      )}
      {forgotSent && (
        <div className="bg-success/10 border border-success/30 px-4 py-3">
          <p className="font-sans text-sm text-success">
            Reset-Link wurde gesendet — bitte E-Mail prüfen.
          </p>
        </div>
      )}

      {/* Passwort vergessen */}
      <button
        type="button"
        onClick={handleForgot}
        className="font-sans text-xs text-text-secondary hover:text-accent-orange transition-colors"
      >
        Passwort vergessen?
      </button>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full justify-center"
      >
        <LogIn size={16} />
        {isSubmitting ? "Anmelden…" : "Einloggen"}
      </button>

      {/* Register link */}
      <p className="font-sans text-sm text-text-secondary text-center">
        Noch kein Account?{" "}
        <Link href="/register" className="text-accent-orange hover:underline font-semibold">
          Jetzt registrieren
        </Link>
      </p>
    </form>
  );
}
