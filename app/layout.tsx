import type { Metadata, Viewport } from "next";
import { Press_Start_2P, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/ui/Navigation";
import { Footer } from "@/components/ui/Footer";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { BackToTop } from "@/components/ui/BackToTop";
import { CookieBanner } from "@/components/ui/CookieBanner";
import { ScrollFadeObserver } from "@/components/ui/ScrollFadeObserver";
import { ThemeProvider } from "@/components/ui/ThemeProvider";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://retroase.de"),
  title: {
    default: "RetrOase — Wo Gaming-Träume wahr werden.",
    template: "%s | RetrOase",
  },
  description:
    "Retro-Gaming Shop aus Deutschland. Geprüfte Secondhand-Konsolen, Spiele, Zubehör und Pokémon-Karten. Nintendo, Game Boy, PlayStation und mehr.",
  keywords: [
    "Retro Gaming",
    "Secondhand Konsolen",
    "Game Boy",
    "Nintendo",
    "PlayStation",
    "Pokémon Karten",
    "Retro Shop Deutschland",
    "SNES",
    "N64",
    "GameCube",
  ],
  authors: [{ name: "RetrOase", url: "https://retroase.de" }],
  creator: "RetrOase",
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://retroase.de",
    siteName: "RetrOase",
    title: "RetrOase — Wo Gaming-Träume wahr werden.",
    description:
      "Retro-Gaming Shop aus Deutschland. Geprüfte Secondhand-Konsolen, Spiele, Zubehör und Pokémon-Karten.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "RetrOase — Retro Gaming Shop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RetrOase — Wo Gaming-Träume wahr werden.",
    description: "Retro-Gaming Shop aus Deutschland.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${pressStart2P.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-text-primary font-sans antialiased">
        <ThemeProvider>
          <ToastProvider>
            <Navigation />
            <main>{children}</main>
            <Footer />
            <WhatsAppButton />
            <BackToTop />
            <CookieBanner />
            <ScrollFadeObserver />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
