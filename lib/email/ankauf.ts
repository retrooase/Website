// ============================================================
// RetrOase — Ankauf E-Mail-Templates
// Alle Templates geben einen HTML-String zurück (kein JSX/React).
// Absender-Adresse: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev"
// Live: info@retroase.de sobald Domain in Resend verifiziert.
// ============================================================

export interface ConfirmationData {
  id: string;
  productName: string;
  category: string;
  platform?: string | null;
  condition: string;
  photoCount: number;
  requestDate: string; // ISO string
}

export interface AdminData {
  requestId: string;
  sellType?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  plz?: string | null;
  productName: string;
  category: string;
  platform?: string | null;
  condition: string;
  completeness?: string | null;
  description: string;
  desiredPrice?: number | null;
  quantity: number;
  imagePaths: string[];
  requestDate: string;
}

export const CONFIRMATION_SUBJECT = "Deine Ankauf-Anfrage bei RetrOase ✓";
export function adminSubject(productName: string): string {
  return `Neue Ankauf-Anfrage: ${productName}`;
}

// ────────────────────────────────────────────────
// Hilfsfunktionen
// ────────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function baseLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>RetrOase</title>
</head>
<body style="margin:0;padding:0;background:#f0f0f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0f0;padding:32px 0;">
  <tr>
    <td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

        <!-- Header -->
        <tr>
          <td style="background:#0a0a0a;padding:24px 32px;text-align:left;">
            <span style="font-family:'Courier New',monospace;font-size:11px;font-weight:700;color:#ff6b35;letter-spacing:3px;text-transform:uppercase;">RETROASE</span>
            <br />
            <span style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:10px;color:#999999;letter-spacing:1px;">WO GAMING-TRÄUME WAHR WERDEN.</span>
          </td>
        </tr>

        <!-- Content -->
        <tr>
          <td style="background:#ffffff;padding:40px 32px;">
            ${content}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#0a0a0a;padding:20px 32px;text-align:center;">
            <p style="margin:0 0 6px;font-size:11px;color:#aaaaaa;">
              RetrOase · Retro-Gaming Ankauf aus Deutschland
            </p>
            <p style="margin:0;font-size:11px;">
              <a href="https://retroase.de" style="color:#ff6b35;text-decoration:none;">retroase.de</a>
              &nbsp;·&nbsp;
              <a href="mailto:hallo@retroase.de" style="color:#ff6b35;text-decoration:none;">hallo@retroase.de</a>
            </p>
            <p style="margin:8px 0 0;font-size:10px;color:#777777;">
              Diese E-Mail wurde automatisch generiert. Bitte nicht direkt antworten.
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

function infoRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:10px 12px;border-bottom:1px solid #eeeeee;font-size:12px;color:#555555;font-weight:600;width:38%;vertical-align:top;background:#f8f8f8;">${label}</td>
    <td style="padding:10px 12px;border-bottom:1px solid #eeeeee;font-size:13px;color:#111111;font-weight:500;vertical-align:top;background:#ffffff;">${value}</td>
  </tr>`;
}

// ────────────────────────────────────────────────
// Kunden-Bestätigung
// ────────────────────────────────────────────────

export function ankaufConfirmationHtml(data: ConfirmationData): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://retroase.de";
  const statusUrl = `${siteUrl}/ankauf/status/${data.id}`;

  const content = `
    <!-- Greeting -->
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111111;line-height:1.3;">
      Anfrage eingegangen!
    </h1>
    <p style="margin:0 0 28px;font-size:14px;color:#555555;line-height:1.6;">
      Danke, dass du dein Retro-Gear bei uns anfragen möchtest. Wir haben alles erhalten
      und melden uns innerhalb von <strong style="color:#111111;">24 Stunden</strong> mit einem fairen Angebot.
    </p>

    <!-- Orange divider -->
    <div style="height:3px;background:#ff6b35;margin-bottom:28px;width:48px;"></div>

    <!-- Summary -->
    <p style="margin:0 0 12px;font-size:11px;font-weight:700;color:#444444;text-transform:uppercase;letter-spacing:2px;">
      Deine Anfrage
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      ${infoRow("Anfrage-ID", `<span style="font-family:'Courier New',monospace;font-size:11px;">${data.id.toUpperCase()}</span>`)}
      ${infoRow("Produkt", data.productName)}
      ${infoRow("Kategorie", data.category)}
      ${data.platform ? infoRow("Plattform", data.platform) : ""}
      ${infoRow("Zustand", data.condition)}
      ${infoRow("Fotos", data.photoCount > 0 ? `${data.photoCount} Foto${data.photoCount !== 1 ? "s" : ""} hochgeladen` : "Keine Fotos")}
      ${infoRow("Eingegangen am", formatDate(data.requestDate))}
    </table>

    <!-- Status link -->
    <p style="margin:0 0 16px;font-size:14px;color:#555555;">
      Den aktuellen Status deiner Anfrage kannst du jederzeit hier verfolgen:
    </p>
    <div style="margin-bottom:32px;text-align:center;">
      <a href="${statusUrl}"
         style="display:inline-block;background:#ff6b35;color:#ffffff;font-size:13px;font-weight:700;padding:14px 32px;text-decoration:none;letter-spacing:0.5px;">
        Anfrage-Status ansehen →
      </a>
    </div>

    <!-- What happens next -->
    <div style="background:#f9f9f9;border-left:3px solid #ff6b35;padding:16px 20px;margin-bottom:28px;">
      <p style="margin:0 0 10px;font-size:12px;font-weight:700;color:#111111;text-transform:uppercase;letter-spacing:1px;">
        Was passiert als nächstes?
      </p>
      <ol style="margin:0;padding-left:18px;font-size:13px;color:#555555;line-height:1.8;">
        <li>Wir prüfen deine Anfrage und die Fotos</li>
        <li>Du erhältst innerhalb von 24h ein Angebot per E-Mail</li>
        <li>Du entscheidest — kein Kaufzwang, keine Kosten</li>
        <li>Bei Annahme: kostenloses Versandlabel + Auszahlung in 48h</li>
      </ol>
    </div>

    <!-- Disclaimer -->
    <p style="margin:0;font-size:11px;color:#aaaaaa;line-height:1.6;border-top:1px solid #f0f0f0;padding-top:20px;">
      Diese Anfrage ist vollständig unverbindlich. Es entsteht keinerlei Kaufzwang.
      Du hast Fragen? Schreib uns jederzeit an
      <a href="mailto:hallo@retroase.de" style="color:#ff6b35;">hallo@retroase.de</a>.
    </p>
  `;

  return baseLayout(content);
}

// ────────────────────────────────────────────────
// Admin-Benachrichtigung
// ────────────────────────────────────────────────

export function ankaufAdminHtml(data: AdminData): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const dashboardHint = supabaseUrl
    ? `${supabaseUrl.replace("supabase.co", "supabase.co")}/project/default/editor`
    : "Supabase Dashboard";

  const content = `
    <!-- Alert header -->
    <div style="background:#fff8f0;border:1px solid #ff6b35;padding:16px 20px;margin-bottom:28px;display:flex;align-items:center;gap:12px;">
      <span style="font-size:20px;">📦</span>
      <div>
        <p style="margin:0;font-size:14px;font-weight:700;color:#111111;">Neue Ankauf-Anfrage</p>
        <p style="margin:2px 0 0;font-size:12px;color:#555555;">Eingegangen am ${formatDate(data.requestDate)}</p>
      </div>
    </div>

    <!-- Orange divider -->
    <div style="height:3px;background:#ff6b35;margin-bottom:24px;width:48px;"></div>

    <!-- Kontakt -->
    <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#444444;text-transform:uppercase;letter-spacing:2px;">Kontakt</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      ${infoRow("Name", data.name)}
      ${infoRow("E-Mail", `<a href="mailto:${data.email}" style="color:#ff6b35;">${data.email}</a>`)}
      ${data.phone ? infoRow("Telefon", data.phone) : ""}
      ${data.plz ? infoRow("PLZ", data.plz) : ""}
    </table>

    <!-- Produkt -->
    <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#444444;text-transform:uppercase;letter-spacing:2px;">Produkt</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      ${infoRow("Anfrage-ID", `<span style="font-family:'Courier New',monospace;font-size:11px;">${data.requestId}</span>`)}
      ${data.sellType ? infoRow("Verkaufstyp", data.sellType) : ""}
      ${infoRow("Produktname", data.productName)}
      ${infoRow("Kategorie", data.category)}
      ${data.platform ? infoRow("Plattform", data.platform) : ""}
      ${infoRow("Zustand", data.condition)}
      ${data.completeness ? infoRow("Vollständigkeit", data.completeness) : ""}
      ${infoRow("Menge", String(data.quantity))}
      ${data.desiredPrice ? infoRow("Wunschpreis", `${data.desiredPrice.toFixed(2)} €`) : ""}
    </table>

    <!-- Beschreibung -->
    <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#444444;text-transform:uppercase;letter-spacing:2px;">Beschreibung</p>
    <div style="background:#f9f9f9;padding:14px 16px;margin-bottom:28px;font-size:13px;color:#333333;line-height:1.6;white-space:pre-wrap;border-left:3px solid #e0e0e0;">
${data.description}
    </div>

    <!-- Fotos -->
    <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#444444;text-transform:uppercase;letter-spacing:2px;">
      Fotos (${data.imagePaths.length})
    </p>
    ${
      data.imagePaths.length > 0
        ? `<ul style="margin:0 0 28px;padding-left:18px;font-size:12px;color:#555555;line-height:2;">
        ${data.imagePaths.map((p) => `<li><span style="font-family:'Courier New',monospace;">${p}</span></li>`).join("")}
      </ul>`
        : `<p style="margin:0 0 28px;font-size:13px;color:#aaaaaa;">Keine Fotos hochgeladen.</p>`
    }

    <!-- Supabase link -->
    <div style="background:#f5f5f5;padding:14px 16px;font-size:12px;color:#555555;border-top:2px solid #e0e0e0;">
      Supabase Dashboard: Tabelle <strong>ankauf_requests</strong> → ID
      <span style="font-family:'Courier New',monospace;font-size:11px;">${data.requestId}</span>
      <br />
      <a href="${dashboardHint}" style="color:#ff6b35;font-size:11px;">Dashboard öffnen</a>
    </div>
  `;

  return baseLayout(content);
}
