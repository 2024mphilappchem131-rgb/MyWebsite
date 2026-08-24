<?php
/**
 * config.php
 * Shared setup file for the whole project.
 * Every page starts with require 'config.php' so that the session, the database
 * connection, and the common helper functions are always available.
 */

// Sessions are used to remember that an admin has logged in.
session_start();

// ---------------------------------------------------------------------------
// Database connection settings (change these if your MySQL setup is different)
// ---------------------------------------------------------------------------
$host = 'localhost';
$database = 'lahore_fresh_bakes';
$username = 'root';
$password = '';

try {
    // PDO is used instead of mysqli because prepared statements are easy to
    // write with it, which protects the queries from SQL injection.
    $pdo = new PDO("mysql:host=$host;dbname=$database;charset=utf8mb4", $username, $password, [
        // Turn database problems into exceptions instead of silent failures.
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        // Fetch rows as associative arrays, so $row['name'] works.
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $error) {
    die('Database connection failed. Import database.sql and check config.php.');
}

/**
 * Escape a value before printing it in HTML.
 * This stops stored text (product names, customer messages, team bios) from
 * being treated as HTML, which prevents XSS attacks.
 */
function e($value) {
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

/**
 * Returns true when an admin is logged in during this session.
 */
function is_admin() {
    return isset($_SESSION['admin_id']);
}

/**
 * Protects an admin page. If the visitor is not logged in they are sent to the
 * login page and the script stops, so no admin data is ever printed.
 */
function require_admin() {
    if (!is_admin()) {
        header('Location: login.php');
        exit;
    }
}

/**
 * Handles an uploaded image for both products and team members.
 *
 * @param string $fieldName Name of the file input in the form.
 * @param string $prefix    Prefix for the saved file name ("product" or "team").
 * @param string $oldImage  Existing file name, kept when no new file is chosen.
 * @return string The file name to store in the database.
 * @throws RuntimeException When the file type or size is not allowed.
 */
function upload_image($fieldName, $prefix, $oldImage = '') {
    // Nothing was chosen, so keep whatever image the record already had.
    // This is what lets "Edit" work without re-uploading the same photo.
    if (empty($_FILES[$fieldName]['name'])) {
        return $oldImage;
    }

    $allowedTypes = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];

    // The real MIME type is read from the file contents, not from the file
    // extension, so renaming a .php file to .png will still be rejected.
    $fileType = mime_content_type($_FILES[$fieldName]['tmp_name']);

    if (!isset($allowedTypes[$fileType])) {
        throw new RuntimeException('Only JPG, PNG, and WEBP images are allowed.');
    }

    // Keep uploads small so the server is not filled with large files.
    if ($_FILES[$fieldName]['size'] > 2 * 1024 * 1024) {
        throw new RuntimeException('Image size must be less than 2MB.');
    }

    // uniqid() gives every upload its own name, so two files with the same
    // original name cannot overwrite each other.
    $fileName = uniqid($prefix . '_', true) . '.' . $allowedTypes[$fileType];
    $target = __DIR__ . '/uploads/' . $fileName;

    if (!move_uploaded_file($_FILES[$fieldName]['tmp_name'], $target)) {
        throw new RuntimeException('Image upload failed.');
    }

    return $fileName;
}
?>
