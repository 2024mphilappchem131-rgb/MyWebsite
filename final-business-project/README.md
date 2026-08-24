# Lahore Fresh Bakes Final Project

PHP and MySQL website with an admin panel for a local bakery business in Johar Town, Lahore.

## Project Structure

```text
final-business-project/
├── index.php            Home page
├── about.php            About page + "Meet Our Team" section
├── products.php         Products list
├── contact.php          Contact form (saves to database)
├── header.php           Shared header and navigation
├── footer.php           Shared footer
├── config.php           Database connection + shared helper functions
├── database.sql         MySQL export (import this first)
├── project-report.md    Project report
├── assets/css/style.css Stylesheet for public pages and admin panel
├── uploads/             Uploaded product and team member images
├── screenshots/         Localhost demo screenshots
└── admin/
    ├── login.php        Admin login
    ├── logout.php       Ends the session
    ├── dashboard.php    Record counts
    ├── products.php     Product list + delete
    ├── add_product.php  Create a product
    ├── edit_product.php Update a product
    ├── team.php         Full team member CRUD
    ├── messages.php     Customer messages from the contact form
    ├── admin_header.php Shared admin header (contains the login check)
    └── admin_footer.php Shared admin footer
```

## Features

- Public pages: Home, About, Products, Contact
- Contact form saved in MySQL
- Secure admin login with PHP sessions and hashed passwords
- Admin dashboard with record counts
- Full product CRUD: add, edit, delete, list
- Full team member CRUD with photo upload, shown on the About page
- Image upload with JPG, PNG, and WEBP validation (real MIME type checked, 2MB limit)
- MySQL database with 5 tables and a foreign key relationship
- Responsive mobile and desktop layout
- Project report included for submission

## Database

Five tables: `admins`, `categories`, `products`, `messages`, `team_members`.

`products.category_id` is a foreign key referencing `categories.id` with
`ON DELETE CASCADE`, so every product belongs to a real category.

## Local Setup

1. Import `database.sql` into MySQL (phpMyAdmin, or the command below):

```bash
mysql -u root -p < database.sql
```

2. Update the database credentials in `config.php` if your MySQL user or
   password is different.

3. Start the PHP server from inside this folder:

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

## Security Notes

- All queries use PDO prepared statements, which prevents SQL injection.
- All output passes through the `e()` helper, which prevents XSS.
- Passwords are stored as hashes and checked with `password_verify()`.
- `require_admin()` runs inside `admin_header.php`, so every admin page is
  protected before any private data is printed.
- Uploaded files are validated by their real MIME type, not their extension.

## Submission Checklist

- [x] 4-page responsive website (Home, About, Products, Contact)
- [x] Contact page with working contact form
- [x] Secure admin panel with login
- [x] Full CRUD for products and team members
- [x] Image upload
- [x] MySQL database with related tables + `database.sql` export
- [x] Responsive on mobile and desktop
- [x] Project report (`project-report.md`)
- [x] Source code commented
- [x] Localhost screenshots (`screenshots/`)
- [ ] 3-5 minute demo video (record this yourself)

### Screenshots

`screenshots/` contains the public pages and the admin login page. Before
submitting, log in and also capture: Dashboard, Manage Products, Add Product,
Edit Product, and Team Members. For mobile screenshots, use the browser's
device toolbar (F12, then Ctrl+Shift+M in Chrome).

### Demo video

Record 3-5 minutes showing: the four public pages, submitting the contact form,
the message appearing in the admin panel, admin login, add/edit/delete a
product with an image upload, add/edit/delete a team member with a photo, that
member appearing on the About page, and the MySQL database tables.
