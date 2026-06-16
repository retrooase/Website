import { SITE } from "@/lib/constants";
import { createServerSupabaseClient, createAdminSupabaseClient } from "@/lib/supabase/server";

export function isAdminUser(email?: string | null): boolean {
  if (!email) return false;
  const raw = process.env.ADMIN_EMAIL || SITE.adminEmail;
  const admins = raw.split(",").map((e) => e.trim().toLowerCase());
  return admins.includes(email.toLowerCase());
}

export async function assertAdmin(): Promise<void> {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Nicht eingeloggt.");
  if (isAdminUser(user.email)) return;
  const adminClient = createAdminSupabaseClient();
  const { data } = await adminClient
    .from("user_profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (data?.is_admin !== true) throw new Error("Keine Admin-Rechte.");
}
