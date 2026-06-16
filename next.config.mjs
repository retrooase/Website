/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage (public + signed URLs)
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/**",
      },
      // eBay-Bilder (für Sync)
      {
        protocol: "https",
        hostname: "i.ebayimg.com",
      },
      // Platzhalter-Bilder
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // Komprimierung aktivieren
  compress: true,

  // Trailing Slash für SEO
  trailingSlash: false,

  // Experimentelle Features (Next.js 14)
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  // Header für Sicherheit & Caching
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      // Fonts & Icons: 1 Jahr im Browser cachen
      {
        source: "/_next/static/media/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // JS/CSS Chunks: immutable (Filename enthält Hash)
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // Bilder im /public Ordner: 7 Tage
      {
        source: "/images/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
