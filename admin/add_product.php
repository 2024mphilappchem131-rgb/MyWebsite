<?php
/**
 * admin/add_product.php
 * The "Create" part of product CRUD. Saves a new product with its image.
 */
require '../config.php';
require_admin();

$error = '';

// Categories fill the dropdown; a product must belong to one of them because
// products.category_id is a foreign key to categories.id.
$categories = $pdo->query('SELECT * FROM categories ORDER BY name')->fetchAll();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Validate and save the uploaded image, then store its file name.
        $image = upload_image('image', 'product');

        $stmt = $pdo->prepare('INSERT INTO products (category_id, name, description, price, image) VALUES (?, ?, ?, ?, ?)');
        $stmt->execute([
            (int) $_POST['category_id'],
            trim($_POST['name']),
            trim($_POST['description']),
            (float) $_POST['price'],
            $image,
        ]);

        header('Location: products.php');
        exit;
    } catch (RuntimeException $uploadError) {
        // Show why the image was rejected instead of saving an invalid product.
        $error = $uploadError->getMessage();
    }
}

$pageTitle = 'Add Product';
include 'admin_header.php';
?>
<h1>Add Product</h1>
<?php if ($error): ?><p class="notice" style="background:#fee2e2;color:#991b1b;"><?= e($error) ?></p><?php endif; ?>

<form class="form card" method="post" enctype="multipart/form-data">
    <select name="category_id" required>
        <?php foreach ($categories as $category): ?>
            <option value="<?= e($category['id']) ?>"><?= e($category['name']) ?></option>
        <?php endforeach; ?>
    </select>
    <input type="text" name="name" placeholder="Product name" required>
    <textarea name="description" placeholder="Product description" required></textarea>
    <input type="number" name="price" placeholder="Price" required>
    <input type="file" name="image" accept="image/jpeg,image/png,image/webp" required>
    <button class="btn" type="submit">Add Product</button>
</form>
<?php include 'admin_footer.php'; ?>
