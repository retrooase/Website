import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { getPublishedPosts } from "@/lib/blog";

const CATEGORY_COLOR: Record<string, string> = {
  Guides:               "rgba(255,95,46,0.9)",
  News:                 "rgba(34,211,163,0.9)",
  Sammlertipps:         "rgba(200,136,10,0.9)",
  Produktvorstellungen: "rgba(80,130,220,0.9)",
};

export async function BlogPreview() {
  const posts = await getPublishedPosts(3);

  if (posts.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 scroll-fade bg-surface">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-10 sm:mb-14">
          <div>
            <p className="font-sans text-xs font-semibold tracking-[0.18em] uppercase text-accent-orange mb-3">
              Wissen &amp; Guides
            </p>
            <h2
              className="font-display font-bold text-text-primary"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.75rem)" }}
            >
              Aus dem Blog
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-2 font-sans text-sm font-semibold text-accent-orange hover:gap-3 transition-all duration-200 group"
          >
            Alle Artikel
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {posts.map((post) => {
            const catColor = CATEGORY_COLOR[post.category] ?? "rgba(255,95,46,0.9)";
            const date = post.published_at ?? post.created_at;

            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-background border border-border rounded-2xl hover:border-border-strong hover:-translate-y-0.5 hover:shadow-hover transition-all duration-300 overflow-hidden"
              >
                <div className="relative aspect-[16/10] bg-surface-hover overflow-hidden">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-surface-hover">
                      <span className="text-5xl opacity-20">📝</span>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-4">
                    <span
                      className="font-sans text-[0.68rem] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-white"
                      style={{ background: catColor }}
                    >
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="px-5 py-5 flex flex-col flex-1">
                  <h3 className="font-display font-bold text-text-primary text-sm leading-snug mb-2 group-hover:text-accent-orange transition-colors duration-200 line-clamp-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="font-sans text-xs text-text-secondary leading-relaxed line-clamp-3 flex-1 mb-4">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-text-tertiary border-t border-border/60 pt-3 mt-auto">
                    {post.read_time && (
                      <span className="flex items-center gap-1.5">
                        <Clock size={11} aria-hidden="true" />
                        {post.read_time} Min.
                      </span>
                    )}
                    {post.read_time && <span aria-hidden="true">·</span>}
                    <span>
                      {new Date(date).toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 sm:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full border border-border text-text-secondary font-sans text-sm font-medium hover:border-accent-orange hover:text-accent-orange transition-all duration-200"
          >
            Alle Artikel lesen
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
