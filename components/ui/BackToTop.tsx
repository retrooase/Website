"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { clsx } from "clsx";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={clsx(
        "fixed bottom-24 right-6 z-40 w-12 h-12 bg-surface border-2 border-border",
        "flex items-center justify-center text-text-secondary",
        "hover:border-accent-orange hover:text-accent-orange transition-all duration-200",
        "hover:shadow-pixel-orange",
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
      style={{ transition: "opacity 0.3s, transform 0.3s" }}
      aria-label="Nach oben scrollen"
      aria-hidden={!isVisible}
    >
      <ChevronUp size={20} />
    </button>
  );
}
