"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { assertAdmin } from "@/lib/admin";
import type { AnkaufStatus, AnkaufLabel } from "@/types";

export async function updateAnkaufStatus(id: string, status: AnkaufStatus) {
  await assertAdmin();
  const admin = createAdminSupabaseClient();
  const { error } = await admin
    .from("ankauf_requests")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/ankauf/${id}`);
  revalidatePath(`/ankauf/status/${id}`);
  redirect(`/admin/ankauf/${id}?saved=1`);
}

export async function updateAnkaufAdmin(
  id: string,
  data: {
    admin_comment?: string;
    offer_from?: number | null;
    offer_to?: number | null;
    admin_label?: AnkaufLabel | null;
  }
) {
  await assertAdmin();
  const admin = createAdminSupabaseClient();
  const { error } = await admin
    .from("ankauf_requests")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/ankauf/${id}`);
  redirect(`/admin/ankauf/${id}?saved=1`);
}
