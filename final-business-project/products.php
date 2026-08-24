<?php
/**
 * products.php
 * Public Products page. Lists every product with its category and price.
 */
require 'config.php';
$pageTitle = 'Products - Lahore Fresh Bakes';
$currentPage = 'products';

// Products are joined with categories through the category_id foreign key so
// the category name can be displayed next to each product.
$products = $pdo->query('SELECT products.*, categories.name AS category_name FROM products JOIN categories ON categories.id = products.category_id ORDER BY products.id DESC')->fetchAll();

include 'header.php';
?>
<section class="section">
    <h2>Products</h2>
    <p class="section-lead">Browse fresh bakery products and custom order options.</p>
    <div class="grid">
        <?php foreach ($products as $product): ?>
            <article class="card">
                <?php if ($product['image']): ?>
                    <img class="product-img" src="uploads/<?= e($product['image']) ?>" alt="<?= e($product['name']) ?>">
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
