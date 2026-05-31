ALTER TABLE products ADD COLUMN supplier_name VARCHAR(255);
ALTER TABLE products ADD COLUMN supplier_phone VARCHAR(255);
ALTER TABLE products ADD COLUMN supplier_inn VARCHAR(255);
ALTER TABLE products ADD COLUMN receiver_name VARCHAR(255);
ALTER TABLE products ADD COLUMN receiver_phone VARCHAR(255);
ALTER TABLE products ADD COLUMN receiver_inn VARCHAR(255);
ALTER TABLE products ADD COLUMN manufacturer VARCHAR(255) DEFAULT 'Xenor-X';
