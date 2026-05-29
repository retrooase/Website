"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

const STORAGE_KEY = "retroase_wishlist_v1";

export function useWishlistHybrid() {
  const [items, setItems] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const syncedRef = useRef(false);

  // localStorage lesen
  function readStorage(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  }

  function writeStorage(ids: string[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {}
  }

  // Mount: localStorage + auth state abonnieren
  useEffect(() => {
    const local = readStorage();
    setItems(local);
    setIsLoaded(true);

    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUserId(session.user.id);
      } else if (event === "SIGNED_OUT") {
        setUserId(null);
        syncedRef.current = false;
        const local = readStorage();
        setItems(local);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Supabase-Sync wenn userId gesetzt
  useEffect(() => {
    if (!userId || syncedRef.current) return;
    syncedRef.current = true;

    const supabase = createClient();
    const local = readStorage();

    // Supabase-Items laden
    supabase
      .from("wishlist_items")
      .select("product_id")
      .then(({ data }) => {
        const dbIds = (data ?? []).map((r) => r.product_id as string);

        // localStorage-Items die noch nicht in DB sind, pushen
        const toSync = local.filter((id) => !dbIds.includes(id));
        if (toSync.length > 0) {
          supabase
            .from("wishlist_items")
            .upsert(toSync.map((product_id) => ({ user_id: userId, product_id })))
            .then(() => {});
        }

        // Mergen: DB + local (ohne Duplikate)
        const merged = Array.from(new Set([...dbIds, ...local]));
        setItems(merged);
        writeStorage(merged);
      });
  }, [userId]);

  const toggleWishlist = useCallback(
    (productId: string) => {
      setItems((prev) => {
        const isAdding = !prev.includes(productId);
        const next = isAdding
          ? [...prev, productId]
          : prev.filter((id) => id !== productId);

        writeStorage(next);

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

        return next;
      });
    },
    [userId]
  );

  const isInWishlist = useCallback(
    (productId: string) => items.includes(productId),
    [items]
  );

  return {
    wishlist: items,
    toggleWishlist,
    isInWishlist,
    isLoaded,
    count: items.length,
  };
}
