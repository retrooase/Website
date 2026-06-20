-- ============================================================
-- RetrOase - Ankauf Preis-Admin (Phase 3)
-- Ausfuehren in: Supabase Dashboard -> SQL Editor
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------
-- Einstellungen
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ankauf_price_settings (
  key           TEXT PRIMARY KEY,
  numeric_value NUMERIC(10, 4),
  text_value    TEXT,
  description   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS ankauf_price_settings_updated_at ON ankauf_price_settings;
CREATE TRIGGER ankauf_price_settings_updated_at
  BEFORE UPDATE ON ankauf_price_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ------------------------------------------------------------
-- Grundkatalog: Marken -> Reihen/Geraete -> Varianten
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ankauf_price_brands (
  slug       TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  logo_url   TEXT,
  sort_order INTEGER NOT NULL DEFAULT 100,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ankauf_price_devices (
  slug       TEXT PRIMARY KEY,
  brand_slug TEXT NOT NULL REFERENCES ankauf_price_brands(slug) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  image_url  TEXT,
  sort_order INTEGER NOT NULL DEFAULT 100,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ankauf_price_variants (
  slug                 TEXT PRIMARY KEY,
  brand_slug           TEXT NOT NULL REFERENCES ankauf_price_brands(slug) ON DELETE CASCADE,
  device_slug          TEXT NOT NULL REFERENCES ankauf_price_devices(slug) ON DELETE CASCADE,
  name                 TEXT NOT NULL,
  item_type            TEXT NOT NULL CHECK (item_type IN ('console', 'handheld', 'game', 'cards', 'accessory', 'bundle')),
  base_price_min       NUMERIC(10, 2) NOT NULL CHECK (base_price_min >= 0),
  base_price_max       NUMERIC(10, 2) NOT NULL CHECK (base_price_max >= base_price_min),
  demand_level         TEXT NOT NULL DEFAULT 'steady' CHECK (demand_level IN ('hot', 'steady', 'niche')),
  aliases              TEXT[] NOT NULL DEFAULT '{}',
  eans                 TEXT[] NOT NULL DEFAULT '{}',
  image_url            TEXT,
  required_accessories TEXT[] NOT NULL DEFAULT '{}',
  optional_accessories TEXT[] NOT NULL DEFAULT '{}',
  notes                TEXT,
  sort_order           INTEGER NOT NULL DEFAULT 100,
  is_active            BOOLEAN NOT NULL DEFAULT TRUE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ankauf_price_conditions (
  id         TEXT PRIMARY KEY,
  label      TEXT NOT NULL,
  factor     NUMERIC(6, 4) NOT NULL CHECK (factor >= 0),
  hint       TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 100,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ankauf_price_completeness (
  id         TEXT PRIMARY KEY,
  label      TEXT NOT NULL,
  factor     NUMERIC(6, 4) NOT NULL CHECK (factor >= 0),
  hint       TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 100,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Exakte Spiele-Ausnahmen fuer spaeter: Standardwerte laufen ueber variants,
-- teure/seltene EANs koennen hier separat gepflegt werden.
CREATE TABLE IF NOT EXISTS ankauf_price_games (
  slug           TEXT PRIMARY KEY,
  title          TEXT NOT NULL,
  platform       TEXT NOT NULL,
  eans           TEXT[] NOT NULL DEFAULT '{}',
  cover_url      TEXT,
  price_tier     TEXT NOT NULL DEFAULT 'standard' CHECK (price_tier IN ('standard', 'premium', 'rare', 'manual')),
  base_price_min NUMERIC(10, 2) CHECK (base_price_min >= 0),
  base_price_max NUMERIC(10, 2) CHECK (base_price_max >= base_price_min),
  demand_level   TEXT NOT NULL DEFAULT 'steady' CHECK (demand_level IN ('hot', 'steady', 'niche')),
  aliases        TEXT[] NOT NULL DEFAULT '{}',
  notes          TEXT,
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ankauf_price_accessories (
  slug                   TEXT PRIMARY KEY,
  name                   TEXT NOT NULL,
  compatible_device_slug TEXT REFERENCES ankauf_price_devices(slug) ON DELETE SET NULL,
  eans                   TEXT[] NOT NULL DEFAULT '{}',
  image_url              TEXT,
  base_price_min         NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (base_price_min >= 0),
  base_price_max         NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (base_price_max >= base_price_min),
  notes                  TEXT,
  is_active              BOOLEAN NOT NULL DEFAULT TRUE,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ankauf_price_adjustments (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scope         TEXT NOT NULL CHECK (scope IN ('global', 'brand', 'device', 'variant', 'game')),
  target_slug   TEXT,
  label         TEXT NOT NULL,
  factor        NUMERIC(6, 4),
  amount_delta  NUMERIC(10, 2),
  starts_at     TIMESTAMPTZ,
  ends_at       TIMESTAMPTZ,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS ankauf_price_brands_updated_at ON ankauf_price_brands;
CREATE TRIGGER ankauf_price_brands_updated_at BEFORE UPDATE ON ankauf_price_brands
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS ankauf_price_devices_updated_at ON ankauf_price_devices;
CREATE TRIGGER ankauf_price_devices_updated_at BEFORE UPDATE ON ankauf_price_devices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS ankauf_price_variants_updated_at ON ankauf_price_variants;
CREATE TRIGGER ankauf_price_variants_updated_at BEFORE UPDATE ON ankauf_price_variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS ankauf_price_conditions_updated_at ON ankauf_price_conditions;
CREATE TRIGGER ankauf_price_conditions_updated_at BEFORE UPDATE ON ankauf_price_conditions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS ankauf_price_completeness_updated_at ON ankauf_price_completeness;
CREATE TRIGGER ankauf_price_completeness_updated_at BEFORE UPDATE ON ankauf_price_completeness
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS ankauf_price_games_updated_at ON ankauf_price_games;
CREATE TRIGGER ankauf_price_games_updated_at BEFORE UPDATE ON ankauf_price_games
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS ankauf_price_accessories_updated_at ON ankauf_price_accessories;
CREATE TRIGGER ankauf_price_accessories_updated_at BEFORE UPDATE ON ankauf_price_accessories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS ankauf_price_adjustments_updated_at ON ankauf_price_adjustments;
CREATE TRIGGER ankauf_price_adjustments_updated_at BEFORE UPDATE ON ankauf_price_adjustments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX IF NOT EXISTS ankauf_price_devices_brand_idx ON ankauf_price_devices (brand_slug);
CREATE INDEX IF NOT EXISTS ankauf_price_variants_brand_idx ON ankauf_price_variants (brand_slug);
CREATE INDEX IF NOT EXISTS ankauf_price_variants_device_idx ON ankauf_price_variants (device_slug);
CREATE INDEX IF NOT EXISTS ankauf_price_variants_type_idx ON ankauf_price_variants (item_type);
CREATE INDEX IF NOT EXISTS ankauf_price_variants_active_idx ON ankauf_price_variants (is_active);
CREATE INDEX IF NOT EXISTS ankauf_price_games_platform_idx ON ankauf_price_games (platform);
CREATE INDEX IF NOT EXISTS ankauf_price_games_eans_idx ON ankauf_price_games USING GIN (eans);
CREATE INDEX IF NOT EXISTS ankauf_price_variants_eans_idx ON ankauf_price_variants USING GIN (eans);

-- ------------------------------------------------------------
-- RLS: Preise sind lesbar, Admin schreibt mit service_role.
-- ------------------------------------------------------------
ALTER TABLE ankauf_price_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ankauf_price_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE ankauf_price_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE ankauf_price_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE ankauf_price_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ankauf_price_completeness ENABLE ROW LEVEL SECURITY;
ALTER TABLE ankauf_price_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE ankauf_price_accessories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ankauf_price_adjustments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ankauf_price_settings_public_read" ON ankauf_price_settings;
CREATE POLICY "ankauf_price_settings_public_read" ON ankauf_price_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "ankauf_price_settings_admin_write" ON ankauf_price_settings;
CREATE POLICY "ankauf_price_settings_admin_write" ON ankauf_price_settings FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "ankauf_price_brands_public_read" ON ankauf_price_brands;
CREATE POLICY "ankauf_price_brands_public_read" ON ankauf_price_brands FOR SELECT USING (is_active = true OR auth.role() = 'service_role');
DROP POLICY IF EXISTS "ankauf_price_brands_admin_write" ON ankauf_price_brands;
CREATE POLICY "ankauf_price_brands_admin_write" ON ankauf_price_brands FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "ankauf_price_devices_public_read" ON ankauf_price_devices;
CREATE POLICY "ankauf_price_devices_public_read" ON ankauf_price_devices FOR SELECT USING (is_active = true OR auth.role() = 'service_role');
DROP POLICY IF EXISTS "ankauf_price_devices_admin_write" ON ankauf_price_devices;
CREATE POLICY "ankauf_price_devices_admin_write" ON ankauf_price_devices FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "ankauf_price_variants_public_read" ON ankauf_price_variants;
CREATE POLICY "ankauf_price_variants_public_read" ON ankauf_price_variants FOR SELECT USING (is_active = true OR auth.role() = 'service_role');
DROP POLICY IF EXISTS "ankauf_price_variants_admin_write" ON ankauf_price_variants;
CREATE POLICY "ankauf_price_variants_admin_write" ON ankauf_price_variants FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "ankauf_price_conditions_public_read" ON ankauf_price_conditions;
CREATE POLICY "ankauf_price_conditions_public_read" ON ankauf_price_conditions FOR SELECT USING (is_active = true OR auth.role() = 'service_role');
DROP POLICY IF EXISTS "ankauf_price_conditions_admin_write" ON ankauf_price_conditions;
CREATE POLICY "ankauf_price_conditions_admin_write" ON ankauf_price_conditions FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "ankauf_price_completeness_public_read" ON ankauf_price_completeness;
CREATE POLICY "ankauf_price_completeness_public_read" ON ankauf_price_completeness FOR SELECT USING (is_active = true OR auth.role() = 'service_role');
DROP POLICY IF EXISTS "ankauf_price_completeness_admin_write" ON ankauf_price_completeness;
CREATE POLICY "ankauf_price_completeness_admin_write" ON ankauf_price_completeness FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "ankauf_price_games_public_read" ON ankauf_price_games;
CREATE POLICY "ankauf_price_games_public_read" ON ankauf_price_games FOR SELECT USING (is_active = true OR auth.role() = 'service_role');
DROP POLICY IF EXISTS "ankauf_price_games_admin_write" ON ankauf_price_games;
CREATE POLICY "ankauf_price_games_admin_write" ON ankauf_price_games FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "ankauf_price_accessories_public_read" ON ankauf_price_accessories;
CREATE POLICY "ankauf_price_accessories_public_read" ON ankauf_price_accessories FOR SELECT USING (is_active = true OR auth.role() = 'service_role');
DROP POLICY IF EXISTS "ankauf_price_accessories_admin_write" ON ankauf_price_accessories;
CREATE POLICY "ankauf_price_accessories_admin_write" ON ankauf_price_accessories FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "ankauf_price_adjustments_public_read" ON ankauf_price_adjustments;
CREATE POLICY "ankauf_price_adjustments_public_read" ON ankauf_price_adjustments FOR SELECT USING (is_active = true OR auth.role() = 'service_role');
DROP POLICY IF EXISTS "ankauf_price_adjustments_admin_write" ON ankauf_price_adjustments;
CREATE POLICY "ankauf_price_adjustments_admin_write" ON ankauf_price_adjustments FOR ALL USING (auth.role() = 'service_role');

-- ------------------------------------------------------------
-- Seed: aktuelle lokale Preislogik sichern
-- ------------------------------------------------------------
INSERT INTO ankauf_price_settings (key, numeric_value, description)
VALUES ('store_credit_bonus', 0.1000, 'Bonus fuer RetrOase-Guthaben gegenueber Sofort-Auszahlung')
ON CONFLICT (key) DO UPDATE SET
  numeric_value = EXCLUDED.numeric_value,
  description = EXCLUDED.description;

INSERT INTO ankauf_price_conditions (id, label, factor, hint, sort_order) VALUES
  ('mint', 'Sehr gut', 1.0000, 'gepflegt, getestet, kaum Spuren', 10),
  ('good', 'Gut', 0.8200, 'normale Nutzungsspuren', 20),
  ('fair', 'Akzeptabel', 0.5800, 'deutliche Spuren, funktioniert', 30),
  ('defective', 'Defekt', 0.2800, 'geht nicht oder teilweise defekt', 40)
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label, factor = EXCLUDED.factor, hint = EXCLUDED.hint, sort_order = EXCLUDED.sort_order;

INSERT INTO ankauf_price_completeness (id, label, factor, hint, sort_order) VALUES
  ('boxed', 'OVP + Zubehoer', 1.1400, 'Karton, Kabel, Controller, Beilagen', 10),
  ('complete', 'Komplett ohne OVP', 1.0000, 'alles zum Spielen dabei', 20),
  ('loose', 'Nur Geraet / Spiel', 0.7400, 'ohne OVP oder Zubehoer', 30),
  ('missing', 'Unvollstaendig', 0.5500, 'wichtiges Zubehoer fehlt', 40)
ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label, factor = EXCLUDED.factor, hint = EXCLUDED.hint, sort_order = EXCLUDED.sort_order;

INSERT INTO ankauf_price_brands (slug, name, sort_order) VALUES
  ('sony', 'Sony', 10),
  ('nintendo', 'Nintendo', 20),
  ('microsoft', 'Microsoft', 30),
  ('pokemon', 'Pokemon', 40),
  ('retro', 'Retro', 50),
  ('zubehoer', 'Zubehoer', 60)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

INSERT INTO ankauf_price_devices (slug, brand_slug, name, sort_order) VALUES
  ('sony-playstation-5', 'sony', 'PlayStation 5', 10),
  ('sony-playstation-4', 'sony', 'PlayStation 4', 20),
  ('sony-playstation-2', 'sony', 'PlayStation 2', 30),
  ('nintendo-switch', 'nintendo', 'Switch', 10),
  ('nintendo-ds', 'nintendo', 'Nintendo DS', 20),
  ('nintendo-3ds', 'nintendo', 'Nintendo 3DS', 30),
  ('nintendo-game-boy', 'nintendo', 'Game Boy', 40),
  ('nintendo-n64', 'nintendo', 'Nintendo 64', 50),
  ('nintendo-gamecube', 'nintendo', 'GameCube', 60),
  ('microsoft-xbox-series', 'microsoft', 'Xbox Series', 10),
  ('pokemon-karten', 'pokemon', 'Karten', 10),
  ('pokemon-spiele', 'pokemon', 'Spiele', 20),
  ('retro-snes', 'retro', 'SNES', 10),
  ('retro-sega', 'retro', 'Sega', 20),
  ('zubehoer-controller', 'zubehoer', 'Controller', 10)
ON CONFLICT (slug) DO UPDATE SET brand_slug = EXCLUDED.brand_slug, name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

INSERT INTO ankauf_price_variants
  (slug, brand_slug, device_slug, name, item_type, base_price_min, base_price_max, demand_level, aliases, sort_order)
VALUES
  ('sony-ps5-disc', 'sony', 'sony-playstation-5', 'PS5 Disc Edition', 'console', 280, 390, 'hot', ARRAY['ps5','playstation 5','disc','laufwerk'], 10),
  ('sony-ps5-digital', 'sony', 'sony-playstation-5', 'PS5 Digital Edition', 'console', 230, 330, 'hot', ARRAY['ps5 digital','playstation 5 digital','digital edition'], 20),
  ('sony-ps5-slim-disc', 'sony', 'sony-playstation-5', 'PS5 Slim Disc', 'console', 300, 420, 'hot', ARRAY['ps5 slim','slim disc','ps5 slim laufwerk'], 30),
  ('sony-ps5-slim-digital', 'sony', 'sony-playstation-5', 'PS5 Slim Digital', 'console', 250, 350, 'hot', ARRAY['ps5 slim digital','slim digital'], 40),
  ('sony-ps4-pro', 'sony', 'sony-playstation-4', 'PS4 Pro', 'console', 120, 190, 'steady', ARRAY['playstation 4 pro','ps4 pro'], 50),
  ('sony-ps4-slim', 'sony', 'sony-playstation-4', 'PS4 Slim', 'console', 90, 150, 'steady', ARRAY['playstation 4 slim','ps4 slim'], 60),
  ('sony-ps2-slim', 'sony', 'sony-playstation-2', 'PS2 Slim', 'console', 55, 95, 'steady', ARRAY['playstation 2 slim','ps2 slim'], 70),
  ('nintendo-switch-oled', 'nintendo', 'nintendo-switch', 'Nintendo Switch OLED', 'handheld', 190, 280, 'hot', ARRAY['switch oled','oled switch'], 10),
  ('nintendo-switch-v2', 'nintendo', 'nintendo-switch', 'Nintendo Switch V2', 'handheld', 150, 230, 'hot', ARRAY['switch','switch v2','rote box'], 20),
  ('nintendo-switch-lite', 'nintendo', 'nintendo-switch', 'Nintendo Switch Lite', 'handheld', 85, 140, 'steady', ARRAY['switch lite','lite'], 30),
  ('nintendo-ds-lite', 'nintendo', 'nintendo-ds', 'Nintendo DS Lite', 'handheld', 28, 60, 'steady', ARRAY['ds lite','nintendo ds lite'], 40),
  ('nintendo-dsi', 'nintendo', 'nintendo-ds', 'Nintendo DSi', 'handheld', 25, 55, 'steady', ARRAY['dsi','nintendo dsi'], 50),
  ('nintendo-ds-game', 'nintendo', 'nintendo-ds', 'Nintendo DS Spiel', 'game', 4, 18, 'steady', ARRAY['ds spiel','nintendo ds spiel','ds spiele'], 60),
  ('nintendo-3ds-xl', 'nintendo', 'nintendo-3ds', 'Nintendo 3DS XL', 'handheld', 75, 150, 'hot', ARRAY['3ds xl','new 3ds xl'], 70),
  ('nintendo-gameboy-color', 'nintendo', 'nintendo-game-boy', 'Game Boy Color', 'handheld', 45, 95, 'hot', ARRAY['gbc','gameboy color','game boy color'], 80),
  ('nintendo-gameboy-advance-sp', 'nintendo', 'nintendo-game-boy', 'Game Boy Advance SP', 'handheld', 65, 125, 'hot', ARRAY['gba sp','advance sp','gameboy advance sp'], 90),
  ('nintendo-gameboy-game', 'nintendo', 'nintendo-game-boy', 'Game Boy Spiel', 'game', 8, 35, 'steady', ARRAY['game boy spiel','gameboy spiel','gb spiel'], 100),
  ('nintendo-n64', 'nintendo', 'nintendo-n64', 'Nintendo 64 Konsole', 'console', 75, 150, 'hot', ARRAY['n64','nintendo 64'], 110),
  ('nintendo-gamecube', 'nintendo', 'nintendo-gamecube', 'Nintendo GameCube', 'console', 80, 160, 'hot', ARRAY['gamecube','game cube'], 120),
  ('microsoft-series-x', 'microsoft', 'microsoft-xbox-series', 'Xbox Series X', 'console', 260, 380, 'hot', ARRAY['series x','xbox series x'], 10),
  ('microsoft-series-s', 'microsoft', 'microsoft-xbox-series', 'Xbox Series S', 'console', 120, 190, 'steady', ARRAY['series s','xbox series s'], 20),
  ('pokemon-card-collection', 'pokemon', 'pokemon-karten', 'Pokemon Karten Sammlung', 'cards', 20, 220, 'hot', ARRAY['pokemon karten','karten sammlung'], 10),
  ('pokemon-gameboy-game', 'pokemon', 'pokemon-spiele', 'Pokemon Game Boy Spiel', 'game', 35, 120, 'hot', ARRAY['pokemon gelb','pokemon rot','pokemon blau','pokemon game boy'], 20),
  ('retro-snes', 'retro', 'retro-snes', 'Super Nintendo Konsole', 'console', 75, 150, 'hot', ARRAY['snes','super nintendo'], 10),
  ('retro-sega-mega-drive', 'retro', 'retro-sega', 'Sega Mega Drive', 'console', 55, 115, 'steady', ARRAY['mega drive','sega mega drive'], 20),
  ('accessory-controller-original', 'zubehoer', 'zubehoer-controller', 'Original Controller', 'accessory', 10, 38, 'steady', ARRAY['controller','original controller','joy con','dual sense'], 10)
ON CONFLICT (slug) DO UPDATE SET
  brand_slug = EXCLUDED.brand_slug,
  device_slug = EXCLUDED.device_slug,
  name = EXCLUDED.name,
  item_type = EXCLUDED.item_type,
  base_price_min = EXCLUDED.base_price_min,
  base_price_max = EXCLUDED.base_price_max,
  demand_level = EXCLUDED.demand_level,
  aliases = EXCLUDED.aliases,
  sort_order = EXCLUDED.sort_order;
