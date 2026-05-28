import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

const PLACEHOLDER_POSTS = [
  {
    slug: "game-boy-color-kaufen-guide",
    title: "Game Boy Color kaufen: Das musst du wissen",
    excerpt:
      "Original oder Klon? Worauf du beim Kauf eines Game Boy Colors achten solltest — Display, Tasten, Akku und wo du ihn bekommst.",
    category: "Guide",
    readTime: "5 Min.",
    date: "2025-05-01",
    emoji: "🕹️",
  },
  {
    slug: "pokemon-karten-echt-oder-fake",
    title: "Pokémon-Karten: Echt oder Fake erkennen",
    excerpt:
      "Wir zeigen dir 7 schnelle Checks, mit denen du gefälschte Pokémon-Karten sofort erkennst — ohne Hilfsmittel.",
    category: "Tipps",
    readTime: "4 Min.",
    date: "2025-04-20",
    emoji: "⚡",
  },
  {
    slug: "ps2-slim-vs-fat-unterschied",
    title: "PS2 Slim vs. Fat — Was ist der Unterschied?",
    excerpt:
      "Beide spielen dieselben Spiele, aber es gibt wichtige Unterschiede. Wir erklären, welche Version für dich die richtige ist.",
    category: "Vergleich",
    readTime: "6 Min.",
    date: "2025-04-05",
    emoji: "🎯",
  },
];

export function BlogPreview() {
  return (
    <section className="py-20 sm:py-28 bg-surface scroll-fade">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-accent-orange mb-2">
              Wissen &amp; Guides
            </p>
            <h2 className="font-sans font-bold text-text-primary" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)" }}>
              Aus dem Blog
            </h2>
            <p className="font-sans text-sm text-text-secondary mt-2">
              Guides, Tipps &amp; Retro-Wissen
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden sm:flex items-center gap-2 font-sans text-sm font-medium text-accent-orange hover:text-text-primary transition-colors"
          >
            Alle Artikel
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {PLACEHOLDER_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-background border border-border hover:border-accent-orange hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(255,107,53,0.10)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none transition-all duration-200"
            >
              {/* Top */}
              <div className="px-5 pt-5 pb-4 flex items-center justify-between">
                <span className="text-2xl" aria-hidden="true">{post.emoji}</span>
                <span className="font-sans text-xs font-semibold uppercase tracking-wide text-accent-orange">
                  {post.category}
                </span>
              </div>

              {/* Content */}
              <div className="px-5 pb-5 flex flex-col flex-1">
                <h3 className="font-sans font-bold text-text-primary text-sm leading-snug mb-2 group-hover:text-accent-orange transition-colors">
                  {post.title}
                </h3>
                <p className="font-sans text-xs text-text-secondary leading-relaxed line-clamp-3 flex-1 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-3 text-xs text-text-secondary border-t border-border pt-3">
                  <span className="flex items-center gap-1.5">
                    <Clock size={11} />
                    {post.readTime}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {new Date(post.date).toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link href="/blog" className="btn-secondary w-full justify-center">
            Alle Artikel lesen
          </Link>
        </div>
      </div>
    </section>
  );
}
