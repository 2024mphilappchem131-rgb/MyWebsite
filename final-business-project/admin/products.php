<?php
/**
 * admin/products.php
 * Product list for the admin (the "Read" and "Delete" parts of product CRUD).
 * Adding is in add_product.php and editing is in edit_product.php.
 */
require '../config.php';
require_admin();

// DELETE: remove the product row and its uploaded image file.
if (isset($_GET['delete'])) {
    // The image name must be read before the row is deleted.
    $stmt = $pdo->prepare('SELECT image FROM products WHERE id = ?');
    $stmt->execute([(int) $_GET['delete']]);
    $product = $stmt->fetch();

    $stmt = $pdo->prepare('DELETE FROM products WHERE id = ?');
    $stmt->execute([(int) $_GET['delete']]);

    // Remove the image file too so the uploads folder stays clean.
    if ($product && $product['image']) {
        $imagePath = __DIR__ . '/../uploads/' . $product['image'];
        if (is_file($imagePath)) {
            unlink($imagePath);
        }
    }

    // Redirect so refreshing the page does not delete anything again.
    header('Location: products.php');
    exit;
}

// READ: all products with their category name for the table below.
$products = $pdo->query('SELECT products.*, categories.name AS category_name FROM products JOIN categories ON categories.id = products.category_id ORDER BY products.id DESC')->fetchAll();
$pageTitle = 'Manage Products';
include 'admin_header.php';
?>
<h1>Manage Products</h1>
<p><a class="btn" href="add_product.php">Add New Product</a></p>

<h2>Product List</h2>
<table class="table">
    <thead>
        <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Actions</th></tr>
    </thead>
    <tbody>
        <?php foreach ($products as $product): ?>
            <tr>
                <td>
                    <?php if ($product['image']): ?>
                        <img src="../uploads/<?= e($product['image']) ?>" alt="<?= e($product['name']) ?>" style="width:90px;height:70px;object-fit:cover;border-radius:6px;">
                    <?php endif; ?>
                </td>
                <td><?= e($product['name']) ?></td>
                <td><?= e($product['category_name']) ?></td>
                <td>PKR <?= e(number_format($product['price'])) ?></td>
                <td class="actions">
                    <a class="btn secondary" href="edit_product.php?id=<?= e($product['id']) ?>">Edit</a>
                    <a class="btn danger" href="products.php?delete=<?= e($product['id']) ?>" onclick="return confirm('Delete this product?')">Delete</a>
                </td>
            </tr>
        <?php endforeach; ?>
    </tbody>
</table>
<?php include 'admin_footer.php'; ?>
