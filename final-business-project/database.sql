-- ===========================================================================
-- Lahore Fresh Bakes - Database Export
--
-- Import this file into MySQL (phpMyAdmin, or the command below) before
-- running the website:
--     mysql -u root -p < database.sql
--
-- Tables: admins, categories, products, messages, team_members
-- Relationship: products.category_id is a foreign key to categories.id
-- ===========================================================================

CREATE DATABASE IF NOT EXISTS lahore_fresh_bakes;
USE lahore_fresh_bakes;

-- Tables are dropped first so this file can be re-imported cleanly.
-- Order matters: products must be dropped before categories, because products
-- holds a foreign key that points at categories.
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS team_members;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS admins;

-- ---------------------------------------------------------------------------
-- admins: login accounts for the admin panel.
-- The password is stored only as a hash, never as plain text.
-- ---------------------------------------------------------------------------
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE, -- UNIQUE stops duplicate accounts
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------------
-- categories: product groups such as Cakes, Breads, and Desserts.
-- This is the "parent" table in the relationship with products.
-- ---------------------------------------------------------------------------
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------------
-- products: bakery items managed through the admin panel.
-- Each product belongs to one category through the category_id foreign key.
-- ---------------------------------------------------------------------------
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,       -- DECIMAL keeps prices exact
    image VARCHAR(255),                 -- file name only, file lives in /uploads
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id) REFERENCES categories(id)
        ON DELETE CASCADE               -- deleting a category removes its products
);

-- ---------------------------------------------------------------------------
-- messages: inquiries submitted through the public contact form.
-- ---------------------------------------------------------------------------
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------------
-- team_members: bakery staff managed in the admin panel and shown on the
-- public About page.
-- ---------------------------------------------------------------------------
CREATE TABLE team_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    position VARCHAR(120) NOT NULL,
    bio TEXT NOT NULL,
    image VARCHAR(255),                 -- photo file name, stored in /uploads
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================================================
-- Sample data
-- ===========================================================================

-- Demo admin account. The hash below is the password: admin123
INSERT INTO admins (name, email, password_hash) VALUES
('Bakery Admin', 'admin@freshbakes.test', '$2y$12$tjiEAn4KWtMGJjvyA4vn4eA2tfR.iuoIIoxQc3MjIb0.P84TqhHLK');

INSERT INTO categories (name, description) VALUES
('Cakes', 'Custom birthday, wedding, and celebration cakes.'),
('Breads', 'Fresh breads baked every morning.'),
('Desserts', 'Cupcakes, brownies, and dessert boxes.');

-- category_id values 1, 2, 3 match the three categories inserted above.
INSERT INTO products (category_id, name, description, price, image) VALUES
(1, 'Chocolate Fudge Cake', 'Rich chocolate cake with fudge frosting for birthdays and family events.', 2800, ''),
(1, 'Vanilla Cream Cake', 'Soft vanilla sponge with fresh cream and simple custom decoration.', 2400, ''),
(2, 'Garlic Bread Loaf', 'Fresh loaf with garlic butter, herbs, and soft center.', 450, ''),
(3, 'Cupcake Box', 'Six assorted cupcakes for tea time, gifts, and small events.', 900, '');

-- Photos are left empty here; they are uploaded from the admin panel.
INSERT INTO team_members (name, position, bio, image) VALUES
('Ayesha Khan', 'Head Baker', 'Handles cake recipes, baking quality, and daily production.', ''),
('Bilal Ahmed', 'Order Manager', 'Manages customer orders, pickup timing, and delivery coordination.', '');
