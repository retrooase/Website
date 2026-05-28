import { TRUST_BADGES } from "@/lib/constants";

export function TrustBadges() {
  return (
    <div className="border-y border-border bg-surface">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:flex sm:justify-center sm:flex-wrap">
          {TRUST_BADGES.map((badge) => (
            <div
              key={badge.text}
              className="flex items-center gap-3 px-6 py-5 border-r border-b sm:border-b-0 border-border last:border-r-0"
            >
              <span className="text-xl flex-shrink-0" aria-hidden="true">
                {badge.icon}
              </span>
              <span className="font-sans text-sm font-semibold text-text-primary whitespace-nowrap">
                {badge.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
