<?php
session_start();

$host = 'localhost';
$database = 'lahore_fresh_bakes';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$database;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $error) {
    die('Database connection failed. Import database.sql and check config.php.');
}

function e($value) {
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function is_admin() {
    return isset($_SESSION['admin_id']);
}

function require_admin() {
    if (!is_admin()) {
        header('Location: login.php');
        exit;
    }
}

function upload_image($fieldName, $prefix, $oldImage = '') {
    if (empty($_FILES[$fieldName]['name'])) {
        return $oldImage;
    }

    $allowedTypes = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
    $fileType = mime_content_type($_FILES[$fieldName]['tmp_name']);

    if (!isset($allowedTypes[$fileType])) {
        throw new RuntimeException('Only JPG, PNG, and WEBP images are allowed.');
    }

    if ($_FILES[$fieldName]['size'] > 2 * 1024 * 1024) {
        throw new RuntimeException('Image size must be less than 2MB.');
    }

    $fileName = uniqid($prefix . '_', true) . '.' . $allowedTypes[$fileType];
    $target = __DIR__ . '/uploads/' . $fileName;

    if (!move_uploaded_file($_FILES[$fieldName]['tmp_name'], $target)) {
        throw new RuntimeException('Image upload failed.');
    }

    return $fileName;
}
?>
