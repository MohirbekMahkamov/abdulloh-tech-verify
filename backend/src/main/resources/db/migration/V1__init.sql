-- Create products table
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- ELECTRONICS, PRINTER, FURNITURE, TEXTILE
    specs TEXT NOT NULL, -- JSON string or formatted text
    warranty_period VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create batches table
CREATE TABLE batches (
    id BIGSERIAL PRIMARY KEY,
    batch_code VARCHAR(50) UNIQUE NOT NULL,
    product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
    production_date DATE NOT NULL,
    total_count INTEGER NOT NULL DEFAULT 0,
    iso_standard_status BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create dealers table
CREATE TABLE dealers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(100) NOT NULL,
    contact_info VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create barcodes table
CREATE TABLE barcodes (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
    batch_id BIGINT REFERENCES batches(id) ON DELETE SET NULL,
    dealer_id BIGINT REFERENCES dealers(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    scan_count INTEGER NOT NULL DEFAULT 0,
    last_scanned_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE admin_users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_ADMIN',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create scan_logs table
CREATE TABLE scan_logs (
    id BIGSERIAL PRIMARY KEY,
    barcode_id BIGINT REFERENCES barcodes(id) ON DELETE CASCADE,
    scanned_at TIMESTAMP DEFAULT NOW(),
    ip_address VARCHAR(50),
    user_agent VARCHAR(500)
);

-- Insert admin user (email: admin@abdulloh.tech, password: Admin123! - BCrypt hash)
INSERT INTO admin_users (email, password_hash, full_name, role) 
VALUES ('admin@abdulloh.tech', '$2a$12$w0.04L7WnBvL5w5oOexvKeEwzL9/nU.n5d0lTte2lR6/PZ.hJ4v8G', 'Abdulloh Admin', 'ROLE_ADMIN');

-- Insert 15 dealers
INSERT INTO dealers (name, region, contact_info, is_active) VALUES
('Toshkent Central Hub', 'Toshkent', '+998901234501', true),
('Namangan Central Hub', 'Namangan', '+998901234502', true),
('Andijon Tech Store', 'Andijon', '+998901234503', true),
('Farg''ona Digital', 'Farg''ona', '+998901234504', true),
('Buxoro Electronics', 'Buxoro', '+998901234505', true),
('Samarqand Tech', 'Samarqand', '+998901234506', true),
('Qashqadaryo Digital', 'Qashqadaryo', '+998901234507', true),
('Surxondaryo Tech', 'Surxondaryo', '+998901234508', true),
('Jizzax Electronics', 'Jizzax', '+998901234509', true),
('Sirdaryo Digital', 'Sirdaryo', '+998901234510', true),
('Xorazm Tech Store', 'Xorazm', '+998901234511', true),
('Navoiy Electronics', 'Navoiy', '+998901234512', true),
('Nukus Digital Hub', 'Qoraqalpog''iston', '+998901234513', true),
('Olmaliq Tech', 'Toshkent viloyati', '+998901234514', true),
('Chirchiq Electronics', 'Toshkent viloyati', '+998901234515', true);

-- Insert 4 products
INSERT INTO products (name, category, specs, warranty_period) VALUES
('Monoblok XENOR X 27" 4K', 'ELECTRONICS', '{"processor": "Intel Core i7 13700", "ram": "16GB DDR5", "storage": "1TB NVMe SSD", "screen": "27-inch 4K IPS UHD"}', '1 yil'),
('Interaktiv Panel XENOR Pro 86"', 'ELECTRONICS', '{"os": "Android 12 / Windows 11", "touch": "40 points Multi-touch", "screen": "86-inch 4K UHD LED", "ram": "8GB", "storage": "128GB"}', '2 yil'),
('Laser Printer XENOR FastPrint 400', 'PRINTER', '{"speed": "40 ppm", "resolution": "1200x1200dpi", "interfaces": "USB, Wi-Fi, Ethernet", "duplex": "Auto Duplex"}', '1 yil'),
('Ofis stoli Ergonomic Premium X', 'FURNITURE', '{"material": "Premium MDF, Steel legs", "adjustments": "Electric Height Adjustable (70-120cm)", "load_capacity": "120kg"}', '3 yil');

-- Insert batches
INSERT INTO batches (batch_code, product_id, production_date, total_count, iso_standard_status) VALUES
('BATCH-2026-X1', 1, '2026-01-15', 100, true),
('BATCH-2026-X2', 2, '2026-02-10', 50, true),
('BATCH-2026-X3', 3, '2026-03-01', 200, true);

-- Insert barcodes (using standard EAN-13 valid codes)
-- Formula for EAN-13 verification:
-- 478000123456(c) -> 4+7*3+8+0*3+0+0*3+1+2*3+3+4*3+5+6*3 = 4+21+8+0+0+0+1+6+3+12+5+18 = 78. Next multiple of 10 is 80. Check digit = 2. EAN-13: 4780001234562
-- 478000123457(c) -> 4+21+8+0+0+0+1+6+3+12+5+21 = 81. Next multiple of 10 is 90. Check digit = 9. EAN-13: 4780001234579
INSERT INTO barcodes (code, product_id, batch_id, dealer_id, is_active, scan_count) VALUES
('4780001234562', 1, 1, 1, true, 0),
('4780001234579', 1, 1, 2, true, 0),
('4780001234586', 1, 1, 3, true, 0),
('4780001234593', 2, 2, 1, true, 0),
('4780001234609', 2, 2, 4, true, 0),
('4780001234616', 3, 3, 5, true, 0),
('4780001234623', 3, 3, 6, true, 0),
('4780001234630', 3, 3, 7, true, 0),
('4780001234647', 4, null, 1, true, 0),
('4780001234654', 4, null, 2, true, 0);
