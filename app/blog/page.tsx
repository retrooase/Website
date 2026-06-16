import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import { getPublishedPosts } from "@/lib/blog";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog — Guides, Tipps & Retro-Wissen",
  description:
    "Retro-Gaming Guides, Kauftipps, Sammlerwissen und News rund um Nintendo, Game Boy, PlayStation und mehr — vom RetrOase Team.",
};

const CATEGORY_EMOJI: Record<string, string> = {
  Guides: "🕹️",
  News: "📡",
  Sammlertipps: "💎",
  Produktvorstellungen: "🎮",
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border bg-surface">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-accent-orange mb-3">
            Wissen &amp; Guides
          </p>
          <h1
            className="font-sans font-bold text-text-primary mb-4"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
          >
            Der RetrOase Blog
          </h1>
          <p className="font-sans text-sm text-text-secondary max-w-xl">
            Guides, Kauftipps, Sammlerwissen und News — alles rund um Retro-Gaming aus Deutschland.
          </p>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {posts.length === 0 ? (
          <div className="border-2 border-dashed border-border p-16 text-center">
            <p className="font-sans text-text-secondary text-sm">
              Noch keine Artikel veröffentlicht. Schau bald wieder vorbei!
            </p>
          </div>
        ) : (
          <>
            {/* Featured — erster Post groß */}
            <div className="mb-10">
              <FeaturedPost post={posts[0]} />
            </div>

            {/* Rest im Grid */}
            {posts.length > 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {posts.slice(1).map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

type Post = Awaited<ReturnType<typeof getPublishedPosts>>[number];

function FeaturedPost({ post }: { post: Post }) {
  const emoji = CATEGORY_EMOJI[post.category] ?? "📝";
  const date = post.published_at ?? post.created_at;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col lg:flex-row bg-surface border border-border hover:border-accent-orange hover:shadow-[0_12px_40px_rgba(255,107,53,0.08)] transition-all duration-200"
    >
      {/* Bild */}
      <div className="relative lg:w-[45%] aspect-[16/9] lg:aspect-auto bg-surface-hover overflow-hidden flex-shrink-0">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl opacity-30">{emoji}</span>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="font-sans text-xs font-bold uppercase tracking-wide bg-accent-orange text-white px-2.5 py-1">
            {post.category}
          </span>
        </div>
      </div>

      {/* Inhalt */}
      <div className="flex flex-col justify-between p-6 lg:p-10 flex-1">
        <div>
          <h2
            className="font-sans font-bold text-text-primary group-hover:text-accent-orange transition-colors mb-3 leading-snug"
            style={{ fontSize: "clamp(1.2rem, 2vw, 1.75rem)" }}
          >
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="font-sans text-sm text-text-secondary leading-relaxed line-clamp-4">
              {post.excerpt}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <div className="flex items-center gap-4 text-xs text-text-secondary">
            {post.read_time && (
              <span className="flex items-center gap-1.5">
                <Clock size={12} />
                {post.read_time} Min.
              </span>
            )}
            <span>
              {new Date(date).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <span className="flex items-center gap-1.5 font-sans text-xs font-semibold text-accent-orange">
            Lesen
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function PostCard({ post }: { post: Post }) {
  const emoji = CATEGORY_EMOJI[post.category] ?? "📝";
  const date = post.published_at ?? post.created_at;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col bg-background border border-border hover:border-accent-orange hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(255,107,53,0.08)] transition-all duration-200"
    >
      {/* Bild */}
      <div className="relative aspect-[16/10] bg-surface-hover overflow-hidden flex-shrink-0">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl opacity-30">{emoji}</span>
          </div>
        )}
      </div>

      {/* Inhalt */}
      <div className="flex flex-col flex-1 px-5 py-4">
        <span className="font-sans text-xs font-semibold uppercase tracking-wide text-accent-orange mb-2">
          {post.category}
        </span>
        <h3 className="font-sans font-bold text-text-primary text-sm leading-snug mb-2 group-hover:text-accent-orange transition-colors line-clamp-2">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="font-sans text-xs text-text-secondary leading-relaxed line-clamp-3 flex-1">
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center gap-3 text-xs text-text-secondary border-t border-border pt-3 mt-3">
          {post.read_time && (
            <span className="flex items-center gap-1.5">
              <Clock size={11} />
              {post.read_time} Min.
            </span>
          )}
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
}
