import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import {
  ankaufConfirmationHtml,
  ankaufAdminHtml,
  CONFIRMATION_SUBJECT,
  adminSubject,
} from "@/lib/email/ankauf";

interface AnkaufBody {
  sellType?: string;
  name?: string;
  email?: string;
  phone?: string;
  plz?: string;
  productName?: string;
  category?: string;
  platform?: string;
  condition?: string;
  completeness?: string;
  description?: string;
  desiredPrice?: string | number;
  quantity?: string | number;
  acceptedUnverbindlich?: boolean;
  acceptedPrivacy?: boolean;
}

const VALID_CONDITIONS = ["Sehr Gut", "Gut", "Akzeptabel", "Defekt"] as const;
const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_PHOTOS = 10;

function parseRecipients(value: string | undefined, fallback: string): string | string[] {
  const recipients = (value ?? fallback)
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  if (recipients.length === 0) return fallback;
  return recipients.length === 1 ? recipients[0] : recipients;
}

function emailResultFailed(result: PromiseSettledResult<{ error?: unknown }>) {
  return result.status === "rejected" || Boolean(result.value?.error);
}

export async function POST(req: Request) {
  // Parse FormData
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Ungültiges Formular." }, { status: 400 });
  }

  // Parse JSON-Daten aus "data"-Feld
  const rawData = formData.get("data");
  if (!rawData || typeof rawData !== "string") {
    return NextResponse.json({ error: "Pflichtfeld 'data' fehlt." }, { status: 400 });
  }

  let body: AnkaufBody;
  try {
    body = JSON.parse(rawData);
  } catch {
    return NextResponse.json({ error: "Ungültige Daten." }, { status: 400 });
  }

  // Foto-Files sammeln (photo_0, photo_1, ...)
  const rawPhotos: Array<{ index: number; file: File }> = [];
  for (const [key, value] of Array.from(formData.entries())) {
    const match = key.match(/^photo_(\d+)$/);
    if (match && value instanceof File && value.size > 0) {
      rawPhotos.push({ index: parseInt(match[1], 10), file: value });
    }
  }
  rawPhotos.sort((a, b) => a.index - b.index);
  const photoFiles = rawPhotos.map((p) => p.file);

  // Foto-Validierung
  if (photoFiles.length > MAX_PHOTOS) {
    return NextResponse.json(
      { error: `Maximal ${MAX_PHOTOS} Fotos erlaubt.` },
      { status: 400 }
    );
  }
  for (const file of photoFiles) {
    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Dateityp nicht erlaubt: ${file.type}. Erlaubt: JPG, PNG, WEBP.` },
        { status: 400 }
      );
    }
    if (file.size > MAX_PHOTO_SIZE) {
      return NextResponse.json(
        { error: `"${file.name}" ist zu groß (max. 5 MB pro Foto).` },
        { status: 400 }
      );
    }
  }

  // Pflichtfeld-Validierung
  if (!body.name?.trim())
    return NextResponse.json({ error: "Name ist erforderlich." }, { status: 400 });

  if (!body.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))
    return NextResponse.json({ error: "Gültige E-Mail ist erforderlich." }, { status: 400 });

  if (!body.sellType)
    return NextResponse.json({ error: "Verkaufstyp ist erforderlich." }, { status: 400 });

  if (!body.productName?.trim())
    return NextResponse.json({ error: "Produktname ist erforderlich." }, { status: 400 });

  if (!body.condition || !VALID_CONDITIONS.includes(body.condition as typeof VALID_CONDITIONS[number]))
    return NextResponse.json({ error: "Ungültiger Zustand." }, { status: 400 });

  if (!body.description?.trim())
    return NextResponse.json({ error: "Beschreibung ist erforderlich." }, { status: 400 });

  if (!body.acceptedUnverbindlich || !body.acceptedPrivacy)
    return NextResponse.json({ error: "Zustimmungen fehlen." }, { status: 400 });

  const supabase = createAdminSupabaseClient();

  const desiredPrice = body.desiredPrice
    ? parseFloat(String(body.desiredPrice))
    : null;
  const quantity = body.quantity
    ? Math.max(1, parseInt(String(body.quantity), 10) || 1)
    : 1;
  const completeness = body.completeness ? [body.completeness] : [];

  // Eintrag in DB erstellen (images vorerst leer)
  const { data: inserted, error: insertError } = await supabase
    .from("ankauf_requests")
    .insert({
      sell_type: body.sellType,
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim() || null,
      plz: body.plz?.trim() || null,
      product_name: body.productName.trim(),
      category: body.category?.trim() || "Sonstiges",
      platform: body.platform?.trim() || null,
      condition: body.condition,
      completeness,
      description: body.description.trim(),
      images: [],
      desired_price: desiredPrice && !isNaN(desiredPrice) ? desiredPrice : null,
      quantity,
      accepted_unverbindlich: body.acceptedUnverbindlich,
      accepted_privacy: body.acceptedPrivacy,
      status: "Eingegangen",
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("[api/ankauf] DB insert error:", insertError.code, insertError.message);
    return NextResponse.json(
      { error: "Fehler beim Speichern. Bitte versuche es erneut." },
      { status: 500 }
    );
  }

  const requestId = inserted.id as string;
  let photoWarning: string | undefined;
  const uploadedPaths: string[] = [];

  // Fotos hochladen
  if (photoFiles.length > 0) {

    for (let i = 0; i < photoFiles.length; i++) {
      const file = photoFiles[i];
      const ext = file.name.match(/\.(jpe?g|png|webp)$/i)?.[1]?.toLowerCase() ?? "jpg";
      const path = `${requestId}/${String(i).padStart(2, "0")}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("ankauf-items")
        .upload(path, file, { contentType: file.type, upsert: false });

      if (uploadError) {
        console.error(`[api/ankauf] Upload ${i} error:`, uploadError.message);

        const isBucketMissing =
          uploadError.message.toLowerCase().includes("bucket") ||
          uploadError.message.toLowerCase().includes("not found");

        if (isBucketMissing) {
          photoWarning =
            "Fotos konnten nicht hochgeladen werden — Storage-Bucket fehlt. Anfrage wurde trotzdem gespeichert.";
          break;
        }
      } else {
        uploadedPaths.push(path);
      }
    }

    if (uploadedPaths.length > 0) {
      await supabase
        .from("ankauf_requests")
        .update({ images: uploadedPaths })
        .eq("id", requestId);
    }

    if (!photoWarning && uploadedPaths.length < photoFiles.length) {
      photoWarning = `${uploadedPaths.length} von ${photoFiles.length} Fotos hochgeladen. Anfrage wurde gespeichert.`;
    }
  }

  // E-Mails senden (Fehler dürfen die Anfrage nicht blockieren)
  let emailWarning: string | undefined;
  const FROM =
    process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  const ADMIN = parseRecipients(process.env.ADMIN_EMAIL, "eren@retroase.de");

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const requestDate = new Date().toISOString();

    const emailResults = await Promise.allSettled([
      resend.emails.send({
        from: `RetrOase Ankauf <${FROM}>`,
        to: body.email.trim().toLowerCase(),
        subject: CONFIRMATION_SUBJECT,
        html: ankaufConfirmationHtml({
          id: requestId,
          productName: body.productName!.trim(),
          category: body.category?.trim() ?? "Sonstiges",
          platform: body.platform?.trim() || null,
          condition: body.condition!,
          photoCount: uploadedPaths.length,
          requestDate,
        }),
      }),
      resend.emails.send({
        from: `RetrOase System <${FROM}>`,
        to: ADMIN,
        subject: adminSubject(body.productName!.trim()),
        html: ankaufAdminHtml({
          requestId,
          sellType: body.sellType ?? null,
          name: body.name!.trim(),
          email: body.email!.trim().toLowerCase(),
          phone: body.phone?.trim() || null,
          plz: body.plz?.trim() || null,
          productName: body.productName!.trim(),
          category: body.category?.trim() ?? "Sonstiges",
          platform: body.platform?.trim() || null,
          condition: body.condition!,
          completeness: body.completeness || null,
          description: body.description!.trim(),
          desiredPrice: desiredPrice && !isNaN(desiredPrice) ? desiredPrice : null,
          quantity,
          imagePaths: uploadedPaths,
          requestDate,
        }),
      }),
    ]);

    const failedEmails = emailResults.filter(emailResultFailed);
    if (failedEmails.length === emailResults.length) {
      emailWarning = "E-Mail-Benachrichtigung konnte nicht gesendet werden.";
      console.error("[api/ankauf] Both emails failed:", emailResults);
    } else if (failedEmails.length > 0) {
      emailWarning = "Eine E-Mail-Benachrichtigung konnte nicht gesendet werden.";
      console.error("[api/ankauf] Some emails failed:", emailResults);
    }
  } catch (err) {
    emailWarning = "E-Mail-Benachrichtigung konnte nicht gesendet werden.";
    console.error("[api/ankauf] Email error:", err);
  }

  return NextResponse.json({
    success: true,
    id: requestId,
    ...(photoWarning && { photoWarning }),
    ...(emailWarning && { emailWarning }),
  });
}
