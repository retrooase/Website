"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { SITE } from "@/lib/constants";

export function WhatsAppButton() {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const whatsappUrl = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(SITE.whatsappMessage)}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Tooltip */}
      {isTooltipVisible && (
        <div className="bg-surface border-2 border-success px-4 py-3 max-w-[200px] animate-slide-up shadow-pixel">
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
        className="w-14 h-14 bg-success border-2 border-success flex items-center justify-center text-background transition-all duration-200 hover:shadow-neon-green hover:scale-110"
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
