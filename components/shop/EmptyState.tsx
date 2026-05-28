export function EmptyState({ query }: { query?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
      {/* Pixel-Sprite Animation */}
      <div className="relative w-24 h-24">
        <PixelGhost />
      </div>

      <div className="text-center space-y-3">
        <h3 className="font-pixel text-text-primary" style={{ fontSize: "0.7rem" }}>
          Keine Produkte gefunden
        </h3>
        {query ? (
          <p className="font-sans text-sm text-text-secondary max-w-xs">
            Für &ldquo;<strong className="text-text-primary">{query}</strong>&rdquo; gibt es
            gerade nichts — probiere einen anderen Begriff.
          </p>
        ) : (
          <p className="font-sans text-sm text-text-secondary max-w-xs">
            Mit diesen Filtern sind keine Artikel verfügbar. Passe die Filter an!
          </p>
        )}
      </div>
    </div>
  );
}

function PixelGhost() {
  return (
    <div
      className="animate-float flex flex-col items-center gap-0"
      style={{ imageRendering: "pixelated" }}
    >
      {/* Ghost body via box-shadow trick — simplified via divs */}
      <div className="grid grid-cols-8 gap-0">
        {GHOST_PIXELS.map((row, ri) =>
          row.map((on, ci) => (
            <div
              key={`${ri}-${ci}`}
              style={{
                width: 10,
                height: 10,
                background: on === 1 ? "var(--text-secondary)" : on === 2 ? "var(--text-primary)" : "transparent",
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

/* 8×11 Ghost pixel map: 0=transparent 1=body 2=eyes */
const GHOST_PIXELS = [
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 2, 2, 2, 2, 1, 1],
  [1, 1, 2, 0, 2, 0, 1, 1],
  [1, 1, 2, 2, 2, 2, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 1, 1, 1, 0, 1],
  [0, 0, 1, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];
