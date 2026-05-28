export type Product = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  condition: "Sehr Gut" | "Gut" | "Akzeptabel";
  category: string;
  platform: string;
  images: string[];
  is_sold: boolean;
  is_featured: boolean;
  badge: string | null;
  language?: string;
  region?: string;
  release_year?: number;
  includes?: string[];
};

export type WishlistItem = {
  productId: string;
  addedAt: number;
};
