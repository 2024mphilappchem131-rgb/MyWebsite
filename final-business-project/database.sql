CREATE DATABASE IF NOT EXISTS lahore_fresh_bakes;
USE lahore_fresh_bakes;

DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS team_members;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS admins;

CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id) REFERENCES categories(id)
        ON DELETE CASCADE
);

CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE team_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    position VARCHAR(120) NOT NULL,
    bio TEXT NOT NULL,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO admins (name, email, password_hash) VALUES
('Bakery Admin', 'admin@freshbakes.test', '$2y$12$tjiEAn4KWtMGJjvyA4vn4eA2tfR.iuoIIoxQc3MjIb0.P84TqhHLK');

INSERT INTO categories (name, description) VALUES
('Cakes', 'Custom birthday, wedding, and celebration cakes.'),
('Breads', 'Fresh breads baked every morning.'),
('Desserts', 'Cupcakes, brownies, and dessert boxes.');

INSERT INTO products (category_id, name, description, price, image) VALUES
(1, 'Chocolate Fudge Cake', 'Rich chocolate cake with fudge frosting for birthdays and family events.', 2800, ''),
(1, 'Vanilla Cream Cake', 'Soft vanilla sponge with fresh cream and simple custom decoration.', 2400, ''),
(2, 'Garlic Bread Loaf', 'Fresh loaf with garlic butter, herbs, and soft center.', 450, ''),
(3, 'Cupcake Box', 'Six assorted cupcakes for tea time, gifts, and small events.', 900, '');

INSERT INTO team_members (name, position, bio, image) VALUES
('Ayesha Khan', 'Head Baker', 'Handles cake recipes, baking quality, and daily production.', ''),
('Bilal Ahmed', 'Order Manager', 'Manages customer orders, pickup timing, and delivery coordination.', '');
