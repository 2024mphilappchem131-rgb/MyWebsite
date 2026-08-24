<?php
/**
 * admin/dashboard.php
 * Admin home page. Shows a simple count of the records in each table.
 * The login check happens inside admin_header.php via require_admin().
 */
require '../config.php';
$pageTitle = 'Dashboard';

// COUNT(*) queries give the totals shown in the cards below.
$productsCount = $pdo->query('SELECT COUNT(*) AS total FROM products')->fetch()['total'];
$messagesCount = $pdo->query('SELECT COUNT(*) AS total FROM messages')->fetch()['total'];
$categoriesCount = $pdo->query('SELECT COUNT(*) AS total FROM categories')->fetch()['total'];
$teamCount = $pdo->query('SELECT COUNT(*) AS total FROM team_members')->fetch()['total'];
include 'admin_header.php';
?>
<h1>Dashboard</h1>
<p>Welcome, <?= e($_SESSION['admin_name'] ?? 'Admin') ?>.</p>
<div class="grid">
    <div class="card"><h3>Products</h3><p class="price"><?= e($productsCount) ?></p></div>
    <div class="card"><h3>Categories</h3><p class="price"><?= e($categoriesCount) ?></p></div>
    <div class="card"><h3>Messages</h3><p class="price"><?= e($messagesCount) ?></p></div>
    <div class="card"><h3>Team Members</h3><p class="price"><?= e($teamCount) ?></p></div>
</div>
<?php include 'admin_footer.php'; ?>
