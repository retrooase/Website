import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { getPostBySlug, getRelatedPosts, getAllPostSlugs } from "@/lib/blog";
import { SITE } from "@/lib/constants";
import { blogPostingSchema, breadcrumbSchema, jsonLdString } from "@/lib/seo";

export const revalidate = 60;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { robots: { index: false, follow: true } };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    keywords: [post.category, ...(post.tags ?? []), "Retro Gaming", "RetrOase"],
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      url: `${SITE.url}/blog/${post.slug}`,
      images: post.image ? [{ url: post.image, width: 1200, height: 630, alt: post.title }] : undefined,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      authors: [SITE.name],
      tags: post.tags ?? undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.image ? [post.image] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const [post, related] = await Promise.all([
    getPostBySlug(slug),
    getPostBySlug(slug).then((p) =>
      p ? getRelatedPosts(p.category, slug, 3) : []
    ),
  ]);

  if (!post) notFound();

  const date = post.published_at ?? post.created_at;

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(blogPostingSchema(post)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            breadcrumbSchema([
              { name: "Startseite", url: "/" },
              { name: "Blog", url: "/blog" },
              { name: post.title },
            ])
          ),
        }}
      />
      {/* Hero */}
      <div className="relative bg-surface border-b border-border">
        {post.image && (
          <div className="relative h-56 sm:h-72 lg:h-96 overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
          </div>
        )}

        <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <Link
              href="/blog"
              className="flex items-center gap-1.5 font-sans text-sm text-text-secondary hover:text-accent-orange transition-colors"
            >
              <ArrowLeft size={14} />
              Blog
            </Link>
            <span className="text-border">/</span>
            <span className="font-sans text-sm text-text-secondary truncate max-w-[200px]">{post.category}</span>
          </div>

          {/* Category */}
          <span className="font-sans text-xs font-bold uppercase tracking-widest text-accent-orange mb-3 block">
            {post.category}
          </span>

          {/* Title */}
          <h1
            className="font-sans font-bold text-text-primary leading-tight mb-5"
            style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}
          >
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary">
            <span className="flex items-center gap-1.5">
              <Calendar size={12} />
              {new Date(date).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
            {post.read_time && (
              <span className="flex items-center gap-1.5">
                <Clock size={12} />
                {post.read_time} Min. Lesezeit
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <MarkdownContent content={post.content} />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-border">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="font-sans text-xs text-text-secondary bg-surface border border-border px-2.5 py-1"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Back to blog */}
        <div className="mt-10 pt-6 border-t border-border">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-accent-orange hover:text-text-primary transition-colors"
          >
            <ArrowLeft size={15} />
            Zurück zum Blog
          </Link>
        </div>
      </div>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="bg-surface border-t border-border py-12 sm:py-16">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-sans font-bold text-text-primary text-xl mb-8">
              Weitere Artikel
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((p) => {
                const pDate = p.published_at ?? p.created_at;
                return (
                  <Link
                    key={p.id}
                    href={`/blog/${p.slug}`}
                    className="group flex flex-col bg-background border border-border hover:border-accent-orange hover:-translate-y-1 transition-all duration-200"
                  >
                    <div className="relative aspect-[16/10] bg-surface-hover overflow-hidden">
                      {p.image ? (
                        <Image src={p.image} alt={p.title} fill sizes="33vw" className="object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl opacity-20">📝</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <span className="font-sans text-xs font-semibold uppercase tracking-wide text-accent-orange mb-1.5">
                        {p.category}
                      </span>
                      <h3 className="font-sans font-bold text-text-primary text-sm leading-snug group-hover:text-accent-orange transition-colors line-clamp-2 flex-1">
                        {p.title}
                      </h3>
                      <p className="font-sans text-xs text-text-secondary mt-2">
                        {new Date(pDate).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// ── Einfacher Markdown-Renderer (kein externes Package) ─────────────────────

function MarkdownContent({ content }: { content: string }) {
  const blocks = parseMarkdown(content);
  return (
    <div className="prose-blog">
      {blocks.map((block, i) => renderBlock(block, i))}
    </div>
  );
}

type Block =
  | { type: "h1" | "h2" | "h3"; text: string }
  | { type: "p"; spans: Span[] }
  | { type: "ul" | "ol"; items: Span[][] }
  | { type: "blockquote"; text: string }
  | { type: "code"; lang: string; code: string }
  | { type: "hr" }
  | { type: "br" };

type Span = { kind: "text" | "bold" | "italic" | "code" | "link"; text: string; href?: string };

function parseMarkdown(md: string): Block[] {
  const lines = md.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: "code", lang, code: codeLines.join("\n") });
      i++;
      continue;
    }

    // HR
    if (/^---+$/.test(line.trim()) || /^\*\*\*+$/.test(line.trim())) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // Headings
    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.slice(4).trim() });
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.slice(3).trim() });
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      blocks.push({ type: "h1", text: line.slice(2).trim() });
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      blocks.push({ type: "blockquote", text: line.slice(2).trim() });
      i++;
      continue;
    }

    // Unordered list
    if (/^[-*+] /.test(line)) {
      const items: Span[][] = [];
      while (i < lines.length && /^[-*+] /.test(lines[i])) {
        items.push(parseInline(lines[i].replace(/^[-*+] /, "")));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    // Ordered list
    if (/^\d+\. /.test(line)) {
      const items: Span[][] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(parseInline(lines[i].replace(/^\d+\. /, "")));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    // Empty line → paragraph break
    if (line.trim() === "") {
      blocks.push({ type: "br" });
      i++;
      continue;
    }

    // Paragraph — collect consecutive non-empty lines
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith(">") &&
      !lines[i].startsWith("```") &&
      !/^[-*+] /.test(lines[i]) &&
      !/^\d+\. /.test(lines[i]) &&
      !/^---+$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ type: "p", spans: parseInline(paraLines.join(" ")) });
    }
  }

  return blocks;
}

function parseInline(text: string): Span[] {
  const spans: Span[] = [];
  // Tokenize: **bold**, *italic*, `code`, [link](url)
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[(.+?)\]\((.+?)\))/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      spans.push({ kind: "text", text: text.slice(last, match.index) });
    }
    if (match[2] !== undefined) {
      spans.push({ kind: "bold", text: match[2] });
    } else if (match[3] !== undefined) {
      spans.push({ kind: "italic", text: match[3] });
    } else if (match[4] !== undefined) {
      spans.push({ kind: "code", text: match[4] });
    } else if (match[5] !== undefined) {
      spans.push({ kind: "link", text: match[5], href: match[6] });
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    spans.push({ kind: "text", text: text.slice(last) });
  }
  return spans;
}

function renderSpans(spans: Span[], keyPrefix: string) {
  return spans.map((s, i) => {
    const key = `${keyPrefix}-${i}`;
    if (s.kind === "bold") return <strong key={key} className="font-semibold text-text-primary">{s.text}</strong>;
    if (s.kind === "italic") return <em key={key} className="italic">{s.text}</em>;
    if (s.kind === "code") return <code key={key} className="font-mono text-[0.85em] bg-surface-hover text-accent-orange px-1.5 py-0.5 border border-border">{s.text}</code>;
    if (s.kind === "link") return <a key={key} href={s.href} className="text-accent-orange underline hover:no-underline" target="_blank" rel="noopener noreferrer">{s.text}</a>;
    return <span key={key}>{s.text}</span>;
  });
}

function renderBlock(block: Block, i: number) {
  const key = i;
  switch (block.type) {
    case "h1":
      return <h1 key={key} className="font-sans font-bold text-text-primary mt-10 mb-4 leading-tight" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)" }}>{block.text}</h1>;
    case "h2":
      return <h2 key={key} className="font-sans font-bold text-text-primary mt-8 mb-3 leading-tight border-b border-border pb-2" style={{ fontSize: "clamp(1.15rem, 2.5vw, 1.5rem)" }}>{block.text}</h2>;
    case "h3":
      return <h3 key={key} className="font-sans font-semibold text-text-primary mt-6 mb-2" style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)" }}>{block.text}</h3>;
    case "p":
      return <p key={key} className="font-sans text-sm sm:text-base text-text-secondary leading-relaxed mb-0">{renderSpans(block.spans, `p${i}`)}</p>;
    case "ul":
      return (
        <ul key={key} className="my-4 pl-5 space-y-1.5 list-none">
          {block.items.map((item, j) => (
            <li key={j} className="font-sans text-sm sm:text-base text-text-secondary leading-relaxed flex gap-2.5">
              <span className="text-accent-orange flex-shrink-0 mt-0.5">▸</span>
              <span>{renderSpans(item, `ul${i}-${j}`)}</span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol key={key} className="my-4 pl-5 space-y-1.5 list-none counter-reset-[item]">
          {block.items.map((item, j) => (
            <li key={j} className="font-sans text-sm sm:text-base text-text-secondary leading-relaxed flex gap-2.5">
              <span className="text-accent-orange font-mono font-bold flex-shrink-0 min-w-[1.5rem]">{j + 1}.</span>
              <span>{renderSpans(item, `ol${i}-${j}`)}</span>
            </li>
          ))}
        </ol>
      );
    case "blockquote":
      return (
        <blockquote key={key} className="my-5 border-l-4 border-accent-orange pl-5 py-1">
          <p className="font-sans text-sm italic text-text-secondary leading-relaxed">{block.text}</p>
        </blockquote>
      );
    case "code":
      return (
        <div key={key} className="my-5 border border-border overflow-hidden">
          {block.lang && (
            <div className="bg-surface-hover px-3 py-1.5 border-b border-border">
              <span className="font-mono text-xs text-text-secondary">{block.lang}</span>
            </div>
          )}
          <pre className="bg-surface overflow-x-auto p-4">
            <code className="font-mono text-xs text-text-primary leading-relaxed whitespace-pre">{block.code}</code>
          </pre>
        </div>
      );
    case "hr":
      return <hr key={key} className="my-8 border-none h-px bg-border" />;
    case "br":
      return <div key={key} className="h-4" />;
    default:
      return null;
  }
}
