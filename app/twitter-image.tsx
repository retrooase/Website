import { ImageResponse } from "next/og";
import { renderOgImage, OG_SIZE } from "@/lib/og-image";

export const runtime = "edge";
export const alt = "RetrOase — Wo Gaming-Träume wahr werden.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function TwitterImage() {
  return new ImageResponse(renderOgImage(), { ...size });
}
