"use client";

// Pixel-Ladebalken — z.B. für Seitenwechsel oder API-Calls
export function PixelLoader({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20">
      <div className="font-pixel text-accent-orange animate-pixel-blink" style={{ fontSize: "0.65rem" }}>
        {message ?? "LADE..."}
      </div>
      <div className="pixel-progress w-64">
        <div className="pixel-progress-bar" />
      </div>
      <div className="font-pixel text-text-secondary" style={{ fontSize: "0.45rem" }}>
        RETROASE — BITTE WARTEN
      </div>
    </div>
  );
}

// Skeleton-Card für Produkt-Grid
export function ProductCardSkeleton() {
  return (
    <div className="pixel-card p-0 overflow-hidden">
      <div className="skeleton aspect-square w-full" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-3 w-2/3 rounded-none" />
        <div className="skeleton h-3 w-1/2 rounded-none" />
        <div className="skeleton h-6 w-1/3 rounded-none" />
        <div className="skeleton h-10 w-full rounded-none" />
      </div>
    </div>
  );
}

// Skeleton-Grid für Ladezeiten
export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
