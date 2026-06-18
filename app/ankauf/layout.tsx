import { Bebas_Neue } from "next/font/google";
import "./ankauf.css";
import { SmoothScroll } from "@/components/ankauf/v2/scroll/SmoothScroll";

// Dramatischer Display-Font nur für /ankauf — route-scoped geladen,
// belastet den Rest der Seite nicht. Eine Gewichtung reicht (Bebas hat nur 400).
const ankaufDisplay = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-ankauf-display",
  display: "swap",
});

export default function AnkaufLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Setzt die Font-Variable für das gesamte /ankauf-Segment.
  // Die Casino-Tokens leben in .ak-stage und greifen nur dort.
  // SmoothScroll aktiviert Lenis (mit reduced-motion-Fallback) für die Scroll-Story.
  return (
    <div className={ankaufDisplay.variable}>
      <SmoothScroll>{children}</SmoothScroll>
    </div>
  );
}
