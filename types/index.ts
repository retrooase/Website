// ============================================================
// RetrOase — Zentrale TypeScript-Typen
// ============================================================

export type ProductCondition = "Sehr Gut" | "Gut" | "Akzeptabel";
export type ProductCategory =
  | "Nintendo"
  | "Game Boy"
  | "PlayStation"
  | "Pokémon"
  | "Zubehör"
  | "Retro";
export type ProductBadge = "NEU" | "SELTEN" | "TOP-ZUSTAND" | "SCHNÄPPCHEN";

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  condition: ProductCondition;
  category: ProductCategory;
  platform: string;
  images: string[];
  ebay_id?: string;
  ebay_url?: string;
  is_sold: boolean;
  is_featured: boolean;
  badge?: ProductBadge;
  created_at: string;
  // Technische Details (optional)
  language?: string;
  region?: string;
  release_year?: number;
  serial_number?: string;
  includes?: string[]; // Lieferumfang
}

export type AnkaufStatus =
  | "Eingegangen"
  | "In Bewertung"
  | "Angebot gesendet"
  | "Angenommen"
  | "Abgelehnt";

export type AnkaufLabel =
  | "Sehr gefragt"
  | "Gut verkäuflich"
  | "Schwer zu verkaufen"
  | "Zu beschädigt";

export interface AnkaufRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  plz: string;
  product_name: string;
  category: ProductCategory;
  condition: ProductCondition;
  description: string;
  images: string[];
  desired_price?: number;
  quantity: number;
  completeness: string[]; // OVP, Anleitung, etc.
  status: AnkaufStatus;
  offer_from?: number;
  offer_to?: number;
  admin_label?: AnkaufLabel;
  admin_comment?: string;
  created_at: string;
}

export interface WishlistAlert {
  id: string;
  user_id: string;
  search_query: string;
  category?: ProductCategory;
  is_active: boolean;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at: string;
  is_active: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image?: string;
  category: "Guides" | "News" | "Sammlertipps" | "Produktvorstellungen";
  tags?: string[];
  published_at?: string;
  created_at: string;
  read_time?: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
}

export interface PriceEstimate {
  min: number;
  max: number;
  category: ProductCategory;
  condition: ProductCondition;
}

// Filter-Typen für den Shop
export interface ShopFilters {
  category?: ProductCategory[];
  condition?: ProductCondition[];
  priceMin?: number;
  priceMax?: number;
  platform?: string[];
  onlyAvailable?: boolean;
  sortBy?: "newest" | "price_asc" | "price_desc" | "popular" | "rare";
  search?: string;
}
