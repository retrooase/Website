"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const schema = z
  .object({
    name: z.string().min(2, "Name muss mindestens 2 Zeichen haben").max(60),
    email: z.string().email("Ungültige E-Mail-Adresse"),
    password: z.string().min(8, "Mindestens 8 Zeichen"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwörter stimmen nicht überein",
    path: ["confirm"],
  });

type Fields = z.infer<typeof schema>;

export function RegisterForm() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Fields>({ resolver: zodResolver(schema) });

  async function onSubmit(data: Fields) {
    setServerError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: data.email.trim().toLowerCase(),
      password: data.password,
      options: {
        data: { full_name: data.name.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setServerError(
        error.message.includes("already registered")
          ? "Diese E-Mail ist bereits registriert."
          : "Registrierung fehlgeschlagen. Bitte erneut versuchen."
      );
      return;
    }

    // Falls E-Mail-Bestätigung deaktiviert ist, direkt weiterleiten
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData.session) {
      router.push("/profil");
      router.refresh();
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="text-4xl">📬</div>
        <h2 className="font-sans text-xl font-bold text-text-primary">
          Fast fertig!
        </h2>
        <p className="font-sans text-sm text-text-secondary leading-relaxed">
          Wir haben dir eine Bestätigungs-E-Mail geschickt. Bitte klicke auf den Link
          darin, um deinen Account zu aktivieren.
        </p>
        <Link href="/login" className="btn-primary inline-flex justify-center mt-2">
          Zum Login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Name */}
      <div>
        <label className="block font-sans text-sm font-semibold text-text-primary mb-1.5">
          Dein Name
        </label>
        <input
          type="text"
          autoComplete="name"
          className="pixel-input w-full"
          placeholder="Vorname Nachname"
          {...register("name")}
        />
        {errors.name && (
          <p className="mt-1 font-sans text-xs text-error">{errors.name.message}</p>
        )}
      </div>

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
            autoComplete="new-password"
            className="pixel-input w-full pr-11"
            placeholder="Min. 8 Zeichen"
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

      {/* Passwort bestätigen */}
      <div>
        <label className="block font-sans text-sm font-semibold text-text-primary mb-1.5">
          Passwort bestätigen
        </label>
        <input
          type={showPw ? "text" : "password"}
          autoComplete="new-password"
          className="pixel-input w-full"
          placeholder="••••••••"
          {...register("confirm")}
        />
        {errors.confirm && (
          <p className="mt-1 font-sans text-xs text-error">{errors.confirm.message}</p>
        )}
      </div>

      {/* Fehler */}
      {serverError && (
        <div className="bg-error/10 border border-error/30 px-4 py-3">
          <p className="font-sans text-sm text-error">{serverError}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full justify-center"
      >
        <UserPlus size={16} />
        {isSubmitting ? "Registrieren…" : "Account erstellen"}
      </button>

      {/* Login link */}
      <p className="font-sans text-sm text-text-secondary text-center">
        Bereits registriert?{" "}
        <Link href="/login" className="text-accent-orange hover:underline font-semibold">
          Einloggen
        </Link>
      </p>
    </form>
  );
}
