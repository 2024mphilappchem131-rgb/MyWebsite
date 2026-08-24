<?php
/**
 * header.php
 * Shared top part of every public page: the <head> section and the navigation
 * bar. Each page sets $pageTitle and $currentPage before including this file.
 */

// $currentPage is used to highlight the active navigation link.
$currentPage = $currentPage ?? '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <!-- Viewport tag is required for the responsive mobile layout to work -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= e($pageTitle ?? 'Lahore Fresh Bakes') ?></title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <header class="site-header">
        <a class="brand" href="index.php">Lahore Fresh Bakes</a>
        <nav class="nav">
            <a class="<?= $currentPage === 'home' ? 'active' : '' ?>" href="index.php">Home</a>
            <a class="<?= $currentPage === 'about' ? 'active' : '' ?>" href="about.php">About</a>
            <a class="<?= $currentPage === 'products' ? 'active' : '' ?>" href="products.php">Products</a>
            <a class="<?= $currentPage === 'contact' ? 'active' : '' ?>" href="contact.php">Contact</a>
            <a href="admin/login.php">Admin</a>
        </nav>
    </header>
    <main>
