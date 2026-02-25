-- ============================================
-- ShopKH Supabase Database Migration
-- ============================================

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS shops CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ============================================
-- 1. PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'BUYER' CHECK (role IN ('BUYER', 'SELLER', 'ADMIN')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. SHOPS TABLE
-- ============================================
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

-- ============================================
-- 3. CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. PRODUCTS TABLE
-- ============================================
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

-- ============================================
-- DISABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================

-- Disable RLS on profiles
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Disable RLS on shops
ALTER TABLE shops DISABLE ROW LEVEL SECURITY;

-- Disable RLS on categories
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;

-- Disable RLS on products
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- ============================================
-- INSERT DEFAULT CATEGORIES
-- ============================================
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

-- ============================================
-- CREATE INDEXES FOR BETTER PERFORMANCE
-- ============================================

-- Indexes for profiles table
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Indexes for shops table
CREATE INDEX IF NOT EXISTS idx_shops_user_id ON shops(user_id);
CREATE INDEX IF NOT EXISTS idx_shops_is_verified ON shops(is_verified);
CREATE INDEX IF NOT EXISTS idx_shops_is_premium ON shops(is_premium);

-- Indexes for categories table
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- Indexes for products table
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_shop_id ON products(shop_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_price_usd ON products(price_usd);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- ============================================
-- CREATE UPDATED_AT TRIGGERS
-- ============================================

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for profiles table
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for shops table
CREATE TRIGGER update_shops_updated_at 
    BEFORE UPDATE ON shops 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for products table
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Grant all permissions to authenticated users (for development)
-- In production, you might want to be more restrictive
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Create a sample seller profile (for testing)
INSERT INTO profiles (user_id, full_name, role) VALUES 
('00000000-0000-0000-0000-000000000001', 'Test Seller', 'SELLER')
ON CONFLICT (user_id) DO NOTHING;

-- Create a sample shop for the test seller
INSERT INTO shops (user_id, shop_name, description) VALUES 
('00000000-0000-0000-0000-000000000001', 'Test Shop', 'A sample shop for testing')
ON CONFLICT DO NOTHING;

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

-- Migration completed successfully!
-- Tables created: profiles, shops, categories, products
-- RLS disabled on all tables
-- Indexes created for performance
-- Default categories inserted
-- Permissions granted
