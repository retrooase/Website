import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wunschliste",
  robots: { index: false, follow: false },
};

export default function WunschlisteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
