# Lahore Fresh Bakes Final Project

PHP and MySQL website for a local bakery business.

## Features

- Public pages: Home, About, Products, Contact
- Contact form saved in MySQL
- Secure admin login with PHP sessions
- Admin dashboard
- Full product CRUD: add, edit, delete, list
- Product image upload with JPG, PNG, and WEBP validation
- MySQL database with related tables: admins, categories, products, messages
- Responsive mobile and desktop layout
- Short report included for project submission

## Local Setup

1. Import `database.sql` into MySQL.
2. Update database credentials in `config.php` if needed.
3. Start PHP server:

```bash
php -S localhost:8001
```

4. Open:

```text
http://localhost:8001
```

## Admin Login

- URL: `http://localhost:8001/admin/login.php`
- Email: `admin@freshbakes.test`
- Password: `admin123`

## Submission Notes

- Take screenshots of Home, Products, Contact, Admin Login, and Product CRUD.
- Record a 3-5 minute demo showing public pages, login, add/edit/delete product, image upload, and MySQL database.
- Upload this folder to GitHub with `database.sql`.
