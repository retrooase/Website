const TRUST_ITEMS = [
  {
    icon: "🇩🇪",
    title: "Deutsches Team",
    desc: "Retro-Gaming-Enthusiasten aus Deutschland — kein anonymer Massenankäufer, sondern echte Kenner.",
  },
  {
    icon: "🤝",
    title: "Keine Verkaufspflicht",
    desc: "Du entscheidest ob du annimmst. Lehnst du unser Angebot ab — kein Problem, kein Druck.",
  },
  {
    icon: "🔍",
    title: "Ehrliche Bewertung",
    desc: "Wir nennen dir einen fairen, realistischen Preis. Kein Lowballing, keine Überraschungen.",
  },
  {
    icon: "🔒",
    title: "Sicher & versichert",
    desc: "Versand mit Sendungsverfolgung und Versicherung. Deine Ware ist bei uns in guten Händen.",
  },
  {
    icon: "💬",
    title: "Persönliche Rückmeldung",
    desc: "Du bekommst eine individuelle Antwort von uns — kein Bot, kein automatisiertes System.",
  },
  {
    icon: "⚡",
    title: "Schnelle Auszahlung",
    desc: "Auszahlung innerhalb von 48 Stunden nach Eingang und Prüfung deiner Ware. Direkt auf dein Konto.",
  },
] as const;

export function AnkaufTrust() {
  return (
    <section className="py-20 sm:py-28 bg-surface scroll-fade">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-accent-orange mb-3">
            Warum RetrOase?
          </p>
          <h2
            className="font-sans font-bold text-text-primary"
            style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)" }}
          >
            Fair. Schnell. Persönlich.
          </h2>
          <p className="font-sans text-sm text-text-secondary mt-2 max-w-lg mx-auto">
            Kein Massenankäufer. Wir kennen den Wert von Retro-Ware und bieten faire Preise.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TRUST_ITEMS.map((item) => (
            <div
              key={item.title}
              className="flex gap-4 p-6 bg-background border border-border hover:border-accent-orange hover:shadow-[0_4px_16px_rgba(255,107,53,0.07)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none transition-all duration-200"
            >
              <span className="text-2xl flex-shrink-0 mt-0.5" aria-hidden="true">
                {item.icon}
              </span>
              <div>
                <h3 className="font-sans font-semibold text-text-primary text-sm mb-1.5">
                  {item.title}
                </h3>
                <p className="font-sans text-xs text-text-secondary leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
