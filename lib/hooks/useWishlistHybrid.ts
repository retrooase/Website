"use client";

import { useCallback, useSyncExternalStore } from "react";
import { createClient } from "@/lib/supabase/client";

const STORAGE_KEY = "retroase_wishlist_v1";
const EMPTY: string[] = [];

/**
 * Geteilter Modul-Store für die Wunschliste.
 *
 * Wichtig: Alle Komponenten (Navigation-Badge, WishlistButton, Wunschlisten-
 * Seite, Profil) teilen sich denselben State über useSyncExternalStore.
 * Dadurch aktualisiert sich der Badge live beim Hinzufügen/Entfernen –
 * früher hatte jede Hook-Instanz ihr eigenes useState und blieb stehen.
 */
let items: string[] = EMPTY;
let loaded = false;
let initialized = false;
let userId: string | null = null;
let supabaseSynced = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function setItems(next: string[]) {
  items = next;
  emit();
}

function readStorage(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return EMPTY;
    // Defensiv: leere / nicht-string Einträge ignorieren (Geister-Werte)
    return parsed.filter(
      (id): id is string => typeof id === "string" && id.length > 0
    );
  } catch {
    return EMPTY;
  }
}

function writeStorage(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {}
}

function syncFromSupabase() {
  if (!userId || supabaseSynced) return;
  supabaseSynced = true;

  const supabase = createClient();
  const local = readStorage();

  supabase
    .from("wishlist_items")
    .select("product_id")
    .then(({ data, error }) => {
      if (error) return;
      const dbIds = (data ?? []).map((r) => r.product_id as string);

      // localStorage-Items die noch nicht in der DB sind, hochladen
      const toSync = local.filter((id) => !dbIds.includes(id));
      if (toSync.length > 0) {
        supabase
          .from("wishlist_items")
          .upsert(toSync.map((product_id) => ({ user_id: userId, product_id })))
          .then(() => {});
      }

      // Mergen: DB + local (ohne Duplikate)
      const merged = Array.from(new Set([...dbIds, ...local]));
      writeStorage(merged);
      setItems(merged);
    });
}

function ensureInit() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  setItems(readStorage());
  loaded = true;
  emit();

  // Tab-übergreifende Synchronisation
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) setItems(readStorage());
  });

  const supabase = createClient();

  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session?.user) {
      userId = session.user.id;
      syncFromSupabase();
    }
  });

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN" && session?.user) {
      userId = session.user.id;
      syncFromSupabase();
    } else if (event === "SIGNED_OUT") {
      userId = null;
      supabaseSynced = false;
      setItems(readStorage());
    }
  });
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  ensureInit();
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot() {
  return items;
}

function getServerSnapshot() {
  return EMPTY;
}

function getLoaded() {
  return loaded;
}

function getLoadedServer() {
  return false;
}

export function toggleWishlist(productId: string) {
  const isAdding = !items.includes(productId);
  const next = isAdding
    ? [...items, productId]
    : items.filter((id) => id !== productId);

  writeStorage(next);
  setItems(next);

  if (userId) {
    const supabase = createClient();
    if (isAdding) {
      supabase
        .from("wishlist_items")
        .upsert({ user_id: userId, product_id: productId })
        .then(() => {});
    } else {
      supabase
        .from("wishlist_items")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId)
        .then(() => {});
    }
  }
}

/**
 * Idempotentes Entfernen nur aus localStorage + Store (kein DB-Zugriff).
 * Für Stellen, die den DB-Delete bereits selbst erledigen (z. B. Profil),
 * aber den Badge synchron halten müssen.
 */
export function removeFromWishlistLocal(productId: string) {
  if (!items.includes(productId)) return;
  const next = items.filter((id) => id !== productId);
  writeStorage(next);
  setItems(next);
}

export function useWishlistHybrid() {
  const wishlist = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const isLoaded = useSyncExternalStore(
    subscribe,
    getLoaded,
    getLoadedServer
  );

  const isInWishlist = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  );

  return {
    wishlist,
    toggleWishlist,
    isInWishlist,
    isLoaded,
    count: wishlist.length,
  };
}
