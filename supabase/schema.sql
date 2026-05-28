-- ============================================================
-- RetrOase — Supabase Datenbankschema
-- Ausführen in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Erweiterungen aktivieren
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- Für Full-Text-Suche

-- ============================================================
-- TABELLE: products
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT NOT NULL,
  price         NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  condition     TEXT NOT NULL CHECK (condition IN ('Sehr Gut', 'Gut', 'Akzeptabel')),
  category      TEXT NOT NULL CHECK (category IN ('Nintendo', 'Game Boy', 'PlayStation', 'Pokémon', 'Zubehör', 'Retro')),
  platform      TEXT NOT NULL DEFAULT '',
  images        TEXT[] NOT NULL DEFAULT '{}',
  ebay_id       TEXT UNIQUE,
  ebay_url      TEXT,
  is_sold       BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured   BOOLEAN NOT NULL DEFAULT FALSE,
  badge         TEXT CHECK (badge IN ('NEU', 'SELTEN', 'TOP-ZUSTAND', 'SCHNÄPPCHEN')),
  -- Technische Details
  language      TEXT,
  region        TEXT,
  release_year  INTEGER,
  serial_number TEXT,
  includes      TEXT[] DEFAULT '{}',
  -- Suchindex
  search_vector TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('german', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(category, '') || ' ' || coalesce(platform, ''))
  ) STORED,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index für Volltextsuche
CREATE INDEX IF NOT EXISTS products_search_idx ON products USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS products_category_idx ON products (category);
CREATE INDEX IF NOT EXISTS products_is_sold_idx ON products (is_sold);
CREATE INDEX IF NOT EXISTS products_is_featured_idx ON products (is_featured);
CREATE INDEX IF NOT EXISTS products_price_idx ON products (price);

-- ============================================================
-- TABELLE: ankauf_requests
-- ============================================================
CREATE TABLE IF NOT EXISTS ankauf_requests (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sell_type               TEXT,
  name                    TEXT NOT NULL,
  email                   TEXT NOT NULL,
  phone                   TEXT,
  plz                     TEXT,
  product_name            TEXT NOT NULL,
  category                TEXT NOT NULL,
  platform                TEXT,
  condition               TEXT NOT NULL CHECK (condition IN ('Sehr Gut', 'Gut', 'Akzeptabel', 'Defekt')),
  completeness            TEXT[] NOT NULL DEFAULT '{}',
  description             TEXT NOT NULL,
  images                  TEXT[] NOT NULL DEFAULT '{}',
  desired_price           NUMERIC(10, 2),
  quantity                INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 1),
  accepted_unverbindlich  BOOLEAN NOT NULL DEFAULT FALSE,
  accepted_privacy        BOOLEAN NOT NULL DEFAULT FALSE,
  status                  TEXT NOT NULL DEFAULT 'Eingegangen'
                          CHECK (status IN ('Eingegangen', 'In Bewertung', 'Angebot gesendet', 'Angenommen', 'Abgelehnt')),
  -- Admin-Felder
  offer_from              NUMERIC(10, 2),
  offer_to                NUMERIC(10, 2),
  admin_label             TEXT CHECK (admin_label IN ('Sehr gefragt', 'Gut verkäuflich', 'Schwer zu verkaufen', 'Zu beschädigt')),
  admin_comment           TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ankauf_status_idx ON ankauf_requests (status);
CREATE INDEX IF NOT EXISTS ankauf_email_idx ON ankauf_requests (email);
CREATE INDEX IF NOT EXISTS ankauf_created_idx ON ankauf_requests (created_at DESC);

-- ============================================================
-- TABELLE: wishlist_alerts
-- ============================================================
CREATE TABLE IF NOT EXISTS wishlist_alerts (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  search_query  TEXT NOT NULL,
  category      TEXT CHECK (category IN ('Nintendo', 'Game Boy', 'PlayStation', 'Pokémon', 'Zubehör', 'Retro')),
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  notified_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS alerts_user_idx ON wishlist_alerts (user_id);
CREATE INDEX IF NOT EXISTS alerts_active_idx ON wishlist_alerts (is_active);

-- ============================================================
-- TABELLE: newsletter_subscribers
-- ============================================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT NOT NULL UNIQUE,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  token         TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),  -- Abmelde-Token
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS newsletter_email_idx ON newsletter_subscribers (email);
CREATE INDEX IF NOT EXISTS newsletter_active_idx ON newsletter_subscribers (is_active);

-- ============================================================
-- TABELLE: blog_posts
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  content       TEXT NOT NULL,
  excerpt       TEXT,
  image         TEXT,
  category      TEXT NOT NULL CHECK (category IN ('Guides', 'News', 'Sammlertipps', 'Produktvorstellungen')),
  tags          TEXT[] DEFAULT '{}',
  read_time     INTEGER,  -- Lesezeit in Minuten
  is_published  BOOLEAN NOT NULL DEFAULT FALSE,
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS blog_slug_idx ON blog_posts (slug);
CREATE INDEX IF NOT EXISTS blog_published_idx ON blog_posts (is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS blog_category_idx ON blog_posts (category);

-- ============================================================
-- TABELLE: user_profiles (erweitert auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  name          TEXT,
  avatar_url    TEXT,
  newsletter    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELLE: wishlists (lokale Wunschliste mit Account-Sync)
-- ============================================================
CREATE TABLE IF NOT EXISTS wishlists (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  product_id    UUID NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS wishlist_user_idx ON wishlists (user_id);

-- ============================================================
-- TRIGGER: updated_at automatisch setzen
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER ankauf_updated_at
  BEFORE UPDATE ON ankauf_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER blog_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- TRIGGER: user_profiles automatisch anlegen bei Registrierung
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- products: öffentlich lesbar, nur Admins können schreiben
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (true);
CREATE POLICY "products_admin_write" ON products
  FOR ALL USING (auth.role() = 'service_role');

-- ankauf_requests: nur eigene lesen / alle erstellen
ALTER TABLE ankauf_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ankauf_insert" ON ankauf_requests
  FOR INSERT WITH CHECK (true);
CREATE POLICY "ankauf_own_read" ON ankauf_requests
  FOR SELECT USING (email = auth.jwt()->>'email' OR auth.role() = 'service_role');
CREATE POLICY "ankauf_admin" ON ankauf_requests
  FOR ALL USING (auth.role() = 'service_role');

-- wishlist_alerts: nur eigene
ALTER TABLE wishlist_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "alerts_own" ON wishlist_alerts
  FOR ALL USING (auth.uid() = user_id);

-- newsletter_subscribers: öffentlich erstellen, nur Admin lesen
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "newsletter_insert" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);
CREATE POLICY "newsletter_admin" ON newsletter_subscribers
  FOR ALL USING (auth.role() = 'service_role');

-- blog_posts: veröffentlichte öffentlich lesbar
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blog_public_read" ON blog_posts
  FOR SELECT USING (is_published = true);
CREATE POLICY "blog_admin" ON blog_posts
  FOR ALL USING (auth.role() = 'service_role');

-- user_profiles: eigenes Profil lesen/schreiben
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_own" ON user_profiles
  FOR ALL USING (auth.uid() = id);

-- wishlists: eigene Wunschliste
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wishlist_own" ON wishlists
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
-- Im Supabase Dashboard manuell anlegen oder via API:
-- bucket: "product-images"  (public: true)
-- bucket: "ankauf-items"   (public: false)
-- bucket: "blog-images"     (public: true)

-- ============================================================
-- SUPABASE STORAGE POLICIES (nach Bucket-Erstellung ausführen)
-- ============================================================
/*
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('ankauf-items', 'ankauf-items', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true);

CREATE POLICY "product_images_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "product_images_admin_write" ON storage.objects
  FOR INSERT USING (bucket_id = 'product-images' AND auth.role() = 'service_role');

CREATE POLICY "ankauf_images_insert" ON storage.objects
  FOR INSERT USING (bucket_id = 'ankauf-items');
CREATE POLICY "ankauf_images_admin_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'ankauf-items' AND auth.role() = 'service_role');
*/

-- ============================================================
-- MIGRATION: ankauf_requests — Phase 3.3 (2026-05-28)
-- Ausführen falls Tabelle bereits existiert:
-- ============================================================
/*
ALTER TABLE ankauf_requests
  ADD COLUMN IF NOT EXISTS sell_type TEXT,
  ADD COLUMN IF NOT EXISTS platform TEXT,
  ADD COLUMN IF NOT EXISTS accepted_unverbindlich BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS accepted_privacy BOOLEAN NOT NULL DEFAULT FALSE,
  ALTER COLUMN plz DROP NOT NULL;

ALTER TABLE ankauf_requests
  DROP CONSTRAINT IF EXISTS ankauf_requests_condition_check;

ALTER TABLE ankauf_requests
  ADD CONSTRAINT ankauf_requests_condition_check
  CHECK (condition IN ('Sehr Gut', 'Gut', 'Akzeptabel', 'Defekt'));
*/
