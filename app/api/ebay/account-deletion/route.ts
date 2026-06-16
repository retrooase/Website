import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// eBay verifies the endpoint with a GET + challenge_code
export async function GET(request: NextRequest) {
  const challengeCode = request.nextUrl.searchParams.get("challenge_code");
  if (!challengeCode) {
    return NextResponse.json({ error: "Missing challenge_code" }, { status: 400 });
  }

  const token = process.env.EBAY_VERIFICATION_TOKEN;
  const endpoint = process.env.NEXT_PUBLIC_SITE_URL + "/api/ebay/account-deletion";

  if (!token || !endpoint) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const hash = crypto
    .createHash("sha256")
    .update(challengeCode + token + endpoint)
    .digest("hex");

  return NextResponse.json({ challengeResponse: hash });
}

// eBay sends POST when a user requests account deletion
export async function POST() {
  // DSGVO: Hier könnten wir user-spezifische Daten löschen.
  // Für RetrOase speichern wir keine eBay-User-Daten → einfach 200 OK.
  return NextResponse.json({ received: true }, { status: 200 });
}
