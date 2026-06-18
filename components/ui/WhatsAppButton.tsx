"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { SITE } from "@/lib/constants";

export function WhatsAppButton() {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const whatsappUrl = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(SITE.whatsappMessage)}`;

  return (
    <div className="fixed bottom-[calc(5.75rem+env(safe-area-inset-bottom))] right-4 z-50 flex flex-col items-end gap-2 md:bottom-6 md:right-6">
      {/* Tooltip */}
      {isTooltipVisible && (
        <div className="hidden bg-surface border-2 border-success px-4 py-3 max-w-[200px] animate-slide-up shadow-pixel sm:block">
          <p className="font-sans text-xs text-text-primary leading-relaxed">
            Direkt auf WhatsApp schreiben — wir antworten schnell! 💬
          </p>
        </div>
      )}

      {/* Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-success border-2 border-success flex items-center justify-center text-background shadow-[0_10px_28px_rgba(57,255,20,0.22)] transition-all duration-200 hover:shadow-neon-green hover:scale-110 md:w-14 md:h-14"
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
        onFocus={() => setIsTooltipVisible(true)}
        onBlur={() => setIsTooltipVisible(false)}
        aria-label="Auf WhatsApp schreiben"
      >
        <MessageCircle size={26} strokeWidth={2.5} />
      </a>
    </div>
  );
}
