"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient, createAdminSupabaseClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin";
import { SITE } from "@/lib/constants";

async function assertSuperAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminUser(user.email)) throw new Error("Nur der Haupt-Admin kann Rechte vergeben.");
}

export async function toggleAdminStatus(userId: string, isAdmin: boolean) {
  await assertSuperAdmin();

  const raw = process.env.ADMIN_EMAIL || SITE.adminEmail;
  const superAdmins = raw.split(",").map((e) => e.trim().toLowerCase());

  const adminClient = createAdminSupabaseClient();
  const { data: target } = await adminClient.auth.admin.getUserById(userId);
  if (target?.user?.email && superAdmins.includes(target.user.email.toLowerCase())) {
    throw new Error("Haupt-Admin-Rechte können nicht entzogen werden.");
  }

  const { error } = await adminClient
    .from("user_profiles")
    .update({ is_admin: isAdmin })
    .eq("id", userId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/admins");
}
