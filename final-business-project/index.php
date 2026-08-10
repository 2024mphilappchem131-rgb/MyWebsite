<?php
require 'config.php';
$pageTitle = 'Home - Lahore Fresh Bakes';
$currentPage = 'home';
$products = $pdo->query('SELECT products.*, categories.name AS category_name FROM products JOIN categories ON categories.id = products.category_id ORDER BY products.id DESC LIMIT 3')->fetchAll();
include 'header.php';
?>
<section class="hero">
    <div>
        <h1>Fresh bakery items for Lahore families.</h1>
        <p>Lahore Fresh Bakes is a local bakery offering custom cakes, breads, cupcakes, and event dessert boxes with same-day pickup options.</p>
        <a class="btn" href="products.php">View Products</a>
        <a class="btn secondary" href="contact.php">Order Now</a>
    </div>
    <div class="hero-panel">
        <div class="hero-note">Daily fresh baking from 8 AM</div>
    </div>
</section>

<section class="section">
    <h2>Popular Products</h2>
    <p class="section-lead">These are some of the most requested bakery products.</p>
    <div class="grid">
        <?php foreach ($products as $product): ?>
            <article class="card">
                <?php if ($product['image']): ?>
                    <img src="uploads/<?= e($product['image']) ?>" alt="<?= e($product['name']) ?>">
                <?php endif; ?>
                <h3><?= e($product['name']) ?></h3>
                <p><?= e($product['category_name']) ?></p>
                <p><?= e($product['description']) ?></p>
                <p class="price">PKR <?= e(number_format($product['price'])) ?></p>
            </article>
        <?php endforeach; ?>
    </div>
</section>
<?php include 'footer.php'; ?>
