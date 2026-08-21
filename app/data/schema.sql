-- de flores haute couture Database Schema

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed default admin email for local development testing
INSERT INTO admins (email) VALUES ('admin@deflores.com') ON CONFLICT DO NOTHING;

-- 2. OTP Verification Table
CREATE TABLE IF NOT EXISTS admin_otps (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Action and Activity Logging
CREATE TABLE IF NOT EXISTS action_logs (
    id SERIAL PRIMARY KEY,
    actor_email VARCHAR(255),
    action_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Newsletter Subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Products Catalog
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price VARCHAR(50) NOT NULL,
    description TEXT,
    colors JSONB DEFAULT '[]'::jsonb,
    sizes JSONB DEFAULT '[]'::jsonb,
    rating DECIMAL(3, 2) DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed default products from the previous JSON dataset
INSERT INTO products (id, title, price, description, colors, sizes, rating, review_count) VALUES
('1', 'Mint Sequin Lehenga', '₹28,500', 'Mint Sequin Lehenga features premium georgette fabric adorned with hand-stitched glistening sequins.', '[{"name": "Mint", "hex": "#a3ebd6"}, {"name": "Ivory", "hex": "#fffff0"}]'::jsonb, '["S", "M", "L", "XL"]'::jsonb, 4.90, 41),
('2', 'Ivory Embroidered Festive Chic', '₹24,000', 'Crafted in premium silk cotton, this Ivory set represents elegant symmetry.', '[{"name": "Ivory", "hex": "#fdfaf2"}]'::jsonb, '["S", "M", "L"]'::jsonb, 4.80, 29),
('3', 'Scarlet Draped Georgette Gown', '₹22,500', 'A striking georgette silhouette featuring elegant cowl drapes.', '[{"name": "Scarlet", "hex": "#cc0000"}]'::jsonb, '["S", "M", "L", "XL"]'::jsonb, 4.90, 33),
('4', 'Emerald Designer Lehenga Set', '₹32,000', 'Premium emerald green georgette lehenga set featuring intricate zari embroidery.', '[{"name": "Emerald", "hex": "#046342"}]'::jsonb, '["S", "M", "L", "XL", "XXL"]'::jsonb, 5.00, 18)
ON CONFLICT DO NOTHING;

-- 6. Product Images Mapping
CREATE TABLE IF NOT EXISTS product_images (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(100) REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed default images mapping
INSERT INTO product_images (product_id, image_url) VALUES
('1', '/crop_green.png'),
('2', '/crop_white.png'),
('3', '/crop_red.png'),
('4', '/crop_green.png')
ON CONFLICT DO NOTHING;

-- 7. Gallery Images (Supabase CDN references)
CREATE TABLE IF NOT EXISTS gallery_images (
    id SERIAL PRIMARY KEY,
    image_url TEXT NOT NULL,
    description TEXT,
    filename VARCHAR(255),
    aspect_ratio DECIMAL(5, 3) DEFAULT 1.000,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial gallery slots to avoid blank start
INSERT INTO gallery_images (image_url, description, filename, aspect_ratio) VALUES
('/gallery_purple.jpg', 'Haute Couture', 'gallery_purple.jpg', 0.667),
('/crop_green.png', 'Mint Shadow', 'crop_green.png', 0.667),
('/crop_white.png', 'Pink Shadow', 'crop_white.png', 0.667),
('/crop_red.png', 'Mustard Shadow', 'crop_red.png', 0.667),
('/gallery_purple.jpg', 'Detail Lace', 'gallery_purple.jpg', 0.667),
('/crop_white.png', 'Embroidered Back', 'crop_white.png', 0.667)
ON CONFLICT DO NOTHING;

-- 8. User Activity Logs
CREATE TABLE IF NOT EXISTS user_activity_logs (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    device_id VARCHAR(100) NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    page_url VARCHAR(255),
    scroll_percentage INTEGER,
    target_element TEXT,
    browser_meta JSONB,
    product_id VARCHAR(100),
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Email to Device ID mapping table
CREATE TABLE IF NOT EXISTS user_devices (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    device_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(email, device_id)
);
