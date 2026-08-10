<?php require_admin(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= e($pageTitle ?? 'Admin Panel') ?></title>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
    <div class="admin-layout">
        <aside class="admin-side">
            <h2>Admin Panel</h2>
            <p>Lahore Fresh Bakes</p>
            <a href="dashboard.php">Dashboard</a>
            <a href="products.php">Manage Products</a>
            <a href="add_product.php">Add Product</a>
            <a href="team.php">Team Members</a>
            <a href="messages.php">Messages</a>
            <a href="logout.php">Logout</a>
        </aside>
        <main class="admin-main">
