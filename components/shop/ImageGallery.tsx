"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { clsx } from "clsx";

type Props = {
  images: string[];
  title: string;
};

export function ImageGallery({ images, title }: Props) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const touchStart = useRef<number | null>(null);

  const prev = useCallback(() => setActive((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setActive((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") setLightboxOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, prev, next]);

  function onTouchStart(e: React.TouchEvent) {
    touchStart.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStart.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 50) dx > 0 ? prev() : next();
    touchStart.current = null;
  }

  const safeImages = images.length > 0 ? images : ["/images/placeholder-product.jpg"];

  return (
    <>
      {/* Hauptbild */}
      <div
        className="relative aspect-square bg-surface-hover border-2 border-border overflow-hidden group cursor-zoom-in"
        onClick={() => setLightboxOpen(true)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        role="button"
        aria-label="Bild vergrößern"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setLightboxOpen(true)}
      >
        {!imgErrors[active] ? (
          <Image
            src={safeImages[active]}
            alt={`${title} — Bild ${active + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-102"
            priority
            onError={() => setImgErrors((p) => ({ ...p, [active]: true }))}
          />
        ) : (
          <PlaceholderImg />
        )}

        {/* Zoom-Icon */}
        <div className="absolute bottom-3 right-3 bg-background/70 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn size={18} className="text-text-secondary" />
        </div>

        {/* Pfeil-Navigation (mehrere Bilder) */}
        {safeImages.length > 1 && (
          <>
            <NavBtn dir="left" onClick={(e) => { e.stopPropagation(); prev(); }} />
            <NavBtn dir="right" onClick={(e) => { e.stopPropagation(); next(); }} />
          </>
        )}
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {safeImages.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={clsx(
                "relative flex-shrink-0 w-16 h-16 border-2 overflow-hidden transition-all",
                i === active ? "border-accent-orange" : "border-border hover:border-text-secondary"
              )}
              aria-label={`Bild ${i + 1}`}
            >
              {!imgErrors[i] ? (
                <Image
                  src={src}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                  onError={() => setImgErrors((p) => ({ ...p, [i]: true }))}
                />
              ) : (
                <PlaceholderImg />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-text-secondary hover:text-white p-3 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
            aria-label="Lightbox schließen"
          >
            <X size={28} />
          </button>

          <div
            className="relative w-full max-w-3xl aspect-square mx-4"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {!imgErrors[active] ? (
              <Image
                src={safeImages[active]}
                alt={`${title} — groß`}
                fill
                sizes="100vw"
                className="object-contain"
                onError={() => setImgErrors((p) => ({ ...p, [active]: true }))}
              />
            ) : (
              <PlaceholderImg />
            )}
          </div>

          {safeImages.length > 1 && (
            <>
              <NavBtn dir="left" onClick={(e) => { e.stopPropagation(); prev(); }} large />
              <NavBtn dir="right" onClick={(e) => { e.stopPropagation(); next(); }} large />
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                {safeImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setActive(i); }}
                    className={clsx(
                      "w-2 h-2 transition-all",
                      i === active ? "bg-accent-orange" : "bg-text-secondary"
                    )}
                    aria-label={`Bild ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

function NavBtn({
  dir,
  onClick,
  large,
}: {
  dir: "left" | "right";
  onClick: (e: React.MouseEvent) => void;
  large?: boolean;
}) {
  const Icon = dir === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      className={clsx(
        "absolute top-1/2 -translate-y-1/2 bg-background/70 hover:bg-background text-white transition-all",
        "min-h-[44px] min-w-[44px] flex items-center justify-center",
        dir === "left" ? "left-2" : "right-2",
        large && "lg:left-4 lg:right-4"
      )}
      aria-label={dir === "left" ? "Vorheriges Bild" : "Nächstes Bild"}
    >
      <Icon size={large ? 28 : 20} />
    </button>
  );
}

function PlaceholderImg() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-surface-hover">
      <span className="text-4xl">🎮</span>
    </div>
  );
}
