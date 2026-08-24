<?php
/**
 * admin/edit_product.php
 * The "Update" part of product CRUD. Loads one product into the form and
 * saves the changes. Uploading a new image is optional when editing.
 */
require '../config.php';
require_admin();

$error = '';
$categories = $pdo->query('SELECT * FROM categories ORDER BY name')->fetchAll();

// Load the product named in the URL, for example edit_product.php?id=3
$stmt = $pdo->prepare('SELECT * FROM products WHERE id = ?');
$stmt->execute([(int) ($_GET['id'] ?? 0)]);
$product = $stmt->fetch();

// Invalid or missing id, so go back to the list instead of showing an error.
if (!$product) {
    header('Location: products.php');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // old_image keeps the current picture when no new file is selected.
        $image = upload_image('image', 'product', $_POST['old_image'] ?? '');
        $stmt = $pdo->prepare('UPDATE products SET category_id = ?, name = ?, description = ?, price = ?, image = ? WHERE id = ?');
        $stmt->execute([
            (int) $_POST['category_id'],
            trim($_POST['name']),
            trim($_POST['description']),
            (float) $_POST['price'],
            $image,
            (int) $product['id'],
        ]);

        header('Location: products.php');
        exit;
    } catch (RuntimeException $uploadError) {
        $error = $uploadError->getMessage();
    }
}

$pageTitle = 'Edit Product';
include 'admin_header.php';
?>
<h1>Edit Product</h1>
<?php if ($error): ?><p class="notice" style="background:#fee2e2;color:#991b1b;"><?= e($error) ?></p><?php endif; ?>

<form class="form card" method="post" enctype="multipart/form-data">
    <input type="hidden" name="old_image" value="<?= e($product['image']) ?>">
    <select name="category_id" required>
        <?php foreach ($categories as $category): ?>
            <option value="<?= e($category['id']) ?>" <?= (int) $product['category_id'] === (int) $category['id'] ? 'selected' : '' ?>>
                <?= e($category['name']) ?>
            </option>
        <?php endforeach; ?>
    </select>
    <input type="text" name="name" placeholder="Product name" value="<?= e($product['name']) ?>" required>
    <textarea name="description" placeholder="Product description" required><?= e($product['description']) ?></textarea>
    <input type="number" name="price" placeholder="Price" value="<?= e($product['price']) ?>" required>
    <input type="file" name="image" accept="image/jpeg,image/png,image/webp">
    <button class="btn" type="submit">Update Product</button>
    <a class="btn secondary" href="products.php">Cancel</a>
</form>
<?php include 'admin_footer.php'; ?>
