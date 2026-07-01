import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mein Profil",
  robots: { index: false, follow: false },
};

export default function ProfilLayout({ children }: { children: React.ReactNode }) {
  return children;
}
