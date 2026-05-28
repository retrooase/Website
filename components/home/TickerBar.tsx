import { TICKER_TEXT } from "@/lib/constants";

export function TickerBar() {
  const text = `${TICKER_TEXT}${TICKER_TEXT}`;

  return (
    <div
      className="w-full overflow-hidden bg-accent-orange py-2.5 border-y border-accent-orange"
      aria-hidden="true"
    >
      <div className="ticker-track">
        <span
          className="font-pixel text-background whitespace-nowrap px-4"
          style={{ fontSize: "0.5rem", letterSpacing: "0.12em" }}
        >
          {text}
        </span>
        <span
          className="font-pixel text-background whitespace-nowrap px-4"
          style={{ fontSize: "0.5rem", letterSpacing: "0.12em" }}
        >
          {text}
        </span>
      </div>
    </div>
  );
}
