import { ShieldCheck, Truck, Star, Package, BadgePercent } from "lucide-react";

const STATS = [
  { value: "500+",  label: "eBay-Bewertungen", sub: "Verified Seller",     Icon: Star },
  { value: "100%",  label: "Geprüfte Ware",    sub: "Jedes Teil getestet", Icon: ShieldCheck },
  { value: "1–2",   label: "Tage Versand",     sub: "aus Deutschland",     Icon: Truck },
  { value: "€50+",  label: "Gratisversand",    sub: "ab Bestellwert",      Icon: Package },
  { value: "19%",   label: "MwSt. inkl.",      sub: "Preistransparenz",    Icon: BadgePercent },
] as const;

export function TrustBadges() {
  return (
    <div className="border-y border-border/60 overflow-hidden">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto sm:grid sm:grid-cols-5 divide-x divide-border/60 scrollbar-hide">
          {STATS.map(({ value, label, sub, Icon }) => (
            <div
              key={label}
              className="group flex flex-col items-center justify-center gap-2 px-6 py-6 text-center min-w-[140px] sm:min-w-0 flex-shrink-0 hover:bg-surface-hover transition-colors duration-200"
            >
              <Icon
                size={20}
                className="text-accent-orange opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                aria-hidden="true"
              />
              <div>
                <p
                  className="font-display font-bold text-text-primary leading-none"
                  style={{ fontSize: "clamp(1.2rem, 2vw, 1.6rem)" }}
                >
                  {value}
                </p>
                <p className="font-sans text-xs font-semibold text-text-primary mt-1">{label}</p>
                <p className="font-sans text-[0.68rem] text-text-tertiary mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
