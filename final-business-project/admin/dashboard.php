<?php
require '../config.php';
$pageTitle = 'Dashboard';
$productsCount = $pdo->query('SELECT COUNT(*) AS total FROM products')->fetch()['total'];
$messagesCount = $pdo->query('SELECT COUNT(*) AS total FROM messages')->fetch()['total'];
$categoriesCount = $pdo->query('SELECT COUNT(*) AS total FROM categories')->fetch()['total'];
include 'admin_header.php';
?>
<h1>Dashboard</h1>
<p>Welcome, <?= e($_SESSION['admin_name'] ?? 'Admin') ?>.</p>
<div class="grid">
    <div class="card"><h3>Products</h3><p class="price"><?= e($productsCount) ?></p></div>
    <div class="card"><h3>Categories</h3><p class="price"><?= e($categoriesCount) ?></p></div>
    <div class="card"><h3>Messages</h3><p class="price"><?= e($messagesCount) ?></p></div>
</div>
<?php include 'admin_footer.php'; ?>
