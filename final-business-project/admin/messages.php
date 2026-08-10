<?php
require '../config.php';
$pageTitle = 'Customer Messages';
$messages = $pdo->query('SELECT * FROM messages ORDER BY id DESC')->fetchAll();
include 'admin_header.php';
?>
<h1>Customer Messages</h1>
<table class="table">
    <thead>
        <tr><th>Name</th><th>Email</th><th>Phone</th><th>Message</th><th>Date</th></tr>
    </thead>
    <tbody>
        <?php foreach ($messages as $message): ?>
            <tr>
                <td><?= e($message['customer_name']) ?></td>
                <td><?= e($message['email']) ?></td>
                <td><?= e($message['phone']) ?></td>
                <td><?= e($message['message']) ?></td>
                <td><?= e($message['created_at']) ?></td>
            </tr>
        <?php endforeach; ?>
    </tbody>
</table>
<?php include 'admin_footer.php'; ?>
