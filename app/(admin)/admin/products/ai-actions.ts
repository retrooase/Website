"use server";

import { assertAdmin } from "@/lib/admin";
import { EBAY_SYSTEM_PROMPT, EBAY_USER_PROMPT } from "@/lib/prompts/ebay";

export type AIInput = {
  title: string;
  platform?: string;
  category?: string;
  condition?: string;
  price?: string;
  badge?: string;
  language?: string;
  region?: string;
};

export type AIResult = {
  ebay_titel: string;
  shop_beschreibung: string;
  zustandsbeschreibung: string;
  lieferumfang_text: string;
  instagram_caption: string;
  bundle_tipp: string;
  preis_einschaetzung: string;
  seo_keywords: string[];
};

type ActionResult =
  | { ok: true; data: AIResult }
  | { ok: false; error: string };

export async function generateAIDescription(input: AIInput): Promise<ActionResult> {
  await assertAdmin();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      error:
        "ANTHROPIC_API_KEY nicht konfiguriert. Bitte in .env.local eintragen (console.anthropic.com).",
    };
  }

  if (!input.title?.trim()) {
    return { ok: false, error: "Titel ist erforderlich." };
  }

  const prompt = EBAY_USER_PROMPT.replace("{title}", input.title)
    .replace("{platform}", input.platform || "nicht angegeben")
    .replace("{category}", input.category || "Retro")
    .replace("{condition}", input.condition || "Gut")
    .replace("{price}", input.price || "nicht angegeben")
    .replace("{badge}", input.badge || "keiner")
    .replace("{language}", input.language || "nicht angegeben")
    .replace(/{region}/g, input.region || "nicht angegeben")
    .replace(/{platform}/g, input.platform || "nicht angegeben");

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2048,
        system: EBAY_SYSTEM_PROMPT,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({})) as Record<string, unknown>;
      const msg = (body as { error?: { message?: string } }).error?.message ?? `HTTP ${res.status}`;
      return { ok: false, error: `Anthropic API Fehler: ${msg}` };
    }

    const json = await res.json() as {
      content?: Array<{ type: string; text: string }>;
    };
    const text = json.content?.find((c) => c.type === "text")?.text ?? "";

    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return { ok: false, error: "KI hat kein gültiges JSON zurückgegeben. Bitte erneut versuchen." };
    }

    const parsed = JSON.parse(match[0]) as Partial<AIResult>;

    const result: AIResult = {
      ebay_titel: parsed.ebay_titel ?? "",
      shop_beschreibung: parsed.shop_beschreibung ?? "",
      zustandsbeschreibung: parsed.zustandsbeschreibung ?? "",
      lieferumfang_text: parsed.lieferumfang_text ?? "",
      instagram_caption: parsed.instagram_caption ?? "",
      bundle_tipp: parsed.bundle_tipp ?? "",
      preis_einschaetzung: parsed.preis_einschaetzung ?? "",
      seo_keywords: Array.isArray(parsed.seo_keywords) ? parsed.seo_keywords : [],
    };

    return { ok: true, data: result };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unbekannter Fehler";
    return { ok: false, error: `Generierung fehlgeschlagen: ${msg}` };
  }
}
