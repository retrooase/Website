/**
 * SEKTION 3 — Live-Ankauf-Ticker
 * Zwei horizontale Endlos-Ticker (unterschiedliche Richtung & Tempo) wirken wie
 * ein lebendiger Börsen-Feed. Reiner CSS-Marquee (nur transform → GPU-schonend);
 * bei prefers-reduced-motion über die globale ak-Regel ruhiggestellt.
 *
 * Server-Komponente (keine Hooks/Browser-APIs nötig).
 */

interface Deal {
  name: string;
  price: number;
}

const DEALS_A: Deal[] = [
  { name: "Game Boy", price: 65 },
  { name: "PlayStation 4", price: 140 },
  { name: "Nintendo Switch", price: 195 },
  { name: "Pokémon-Karten", price: 80 },
  { name: "Game Boy Advance", price: 72 },
  { name: "Nintendo 64", price: 110 },
];

const DEALS_B: Deal[] = [
  { name: "GameCube", price: 130 },
  { name: "PlayStation 2", price: 95 },
  { name: "SNES", price: 145 },
  { name: "Nintendo DS", price: 60 },
  { name: "PlayStation 5", price: 380 },
  { name: "Wii", price: 70 },
];

function TickerRow({ deals, direction }: { deals: Deal[]; direction: "left" | "right" }) {
  // Inhalt doppelt rendern → nahtlose Endlosschleife (Track verschiebt sich um -50%)
  const sequence = [...deals, ...deals];
  return (
    <div className="ak-ticker-row" aria-hidden="true">
      <div className={`ak-ticker-track ak-ticker-${direction}`}>
        {sequence.map((d, i) => (
          <span key={i} className="ak-ticker-item">
            <span className="ak-ticker-name">{d.name}</span>
            <span className="ak-ticker-sep">für</span>
            <span className="ak-mono ak-ticker-price">{d.price} €</span>
            <span className="ak-ticker-tag">angekauft</span>
            <span className="ak-ticker-dot">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Section3Ticker() {
  return (
    <section className="ak-stage ak-ticker-section" aria-label="Live-Ankauf-Ticker">
      <div className="ak-ticker-head">
        <span className="ak-chip">
          <i className="ak-live-dot" />
          Live-Ankauf
        </span>
      </div>
      <TickerRow deals={DEALS_A} direction="left" />
      <TickerRow deals={DEALS_B} direction="right" />
    </section>
  );
}
