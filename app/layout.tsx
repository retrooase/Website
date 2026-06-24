import type { Metadata, Viewport } from "next";
import { Syne, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/ui/Navigation";
import { createServerSupabaseClient, createAdminSupabaseClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin";
import { Footer } from "@/components/ui/Footer";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { BackToTop } from "@/components/ui/BackToTop";
import { CookieBanner } from "@/components/ui/CookieBanner";
import { ScrollFadeObserver } from "@/components/ui/ScrollFadeObserver";
import { Suspense } from "react";

const syne = Syne({
  weight: ["400", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-display",
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
  themeColor: "#0D0B12",
};

async function NavWithAuth() {
  let isAdmin = false;
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      if (isAdminUser(user.email)) {
        isAdmin = true;
      } else {
        const adminClient = createAdminSupabaseClient();
        const { data } = await adminClient
          .from("user_profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single();
        isAdmin = data?.is_admin === true;
      }
    }
  } catch {
    // Auth-Fehler ignorieren
  }
  return <Navigation isAdmin={isAdmin} />;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`dark ${syne.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-text-primary font-sans antialiased">
        <ToastProvider>
          <Suspense fallback={<Navigation isAdmin={false} />}>
            <NavWithAuth />
          </Suspense>
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
          <BackToTop />
          <CookieBanner />
          <ScrollFadeObserver />
        </ToastProvider>
      </body>
    </html>
  );
}
