"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { assertAdmin } from "@/lib/admin";

export async function toggleAlertActive(id: string, active: boolean) {
  await assertAdmin();
  const admin = createAdminSupabaseClient();
  const { error } = await admin
    .from("wishlist_alerts")
    .update({ is_active: active })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/alerts");
}
