-- ============================================
-- ShopKH Supabase Tables - SQL Editor Version
-- ============================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'BUYER' CHECK (role IN ('BUYER', 'SELLER', 'ADMIN')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. SHOPS TABLE
CREATE TABLE IF NOT EXISTS shops (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    shop_name TEXT NOT NULL,
    description TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    seller_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    shop_id UUID REFERENCES shops(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price_usd DECIMAL(10,2) NOT NULL,
    price_riel INTEGER,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    stock INTEGER DEFAULT 0,
    images TEXT[] DEFAULT '{}',
    social_links JSONB DEFAULT '{}',
    qr_image TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DISABLE ROW LEVEL SECURITY
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE shops DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- INSERT DEFAULT CATEGORIES
INSERT INTO categories (name, icon) VALUES 
('Electronics', '💻'),
('Fashion', '👕'),
('Home & Garden', '🏠'),
('Sports', '⚽'),
('Books', '📚'),
('Food', '🍔'),
('Beauty', '💄'),
('Vehicles', '🚗'),
('Other', '📦')
ON CONFLICT (name) DO NOTHING;

-- CREATE INDEXES
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_shops_user_id ON shops(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

-- GRANT PERMISSIONS
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
