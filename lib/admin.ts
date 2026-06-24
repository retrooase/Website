import { createServerSupabaseClient, createAdminSupabaseClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/is-admin";

// Edge-taugliche, reine Pruefung liegt in lib/is-admin.ts. Hier importiert
// (assertAdmin nutzt sie) und wieder exportiert, damit bestehende Importe aus
// "@/lib/admin" weiter laufen.
export { isAdminUser };

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
