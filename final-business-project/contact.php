<?php
require 'config.php';
$pageTitle = 'Contact - Lahore Fresh Bakes';
$currentPage = 'contact';
$success = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $stmt = $pdo->prepare('INSERT INTO messages (customer_name, email, phone, message) VALUES (?, ?, ?, ?)');
    $stmt->execute([
        trim($_POST['customer_name'] ?? ''),
        trim($_POST['email'] ?? ''),
        trim($_POST['phone'] ?? ''),
        trim($_POST['message'] ?? ''),
    ]);
    $success = true;
}

include 'header.php';
?>
<section class="section">
    <h2>Contact Us</h2>
    <p class="section-lead">Send a custom cake or catering inquiry. We will respond with price and pickup details.</p>
    <?php if ($success): ?>
        <p class="notice">Your message has been submitted successfully.</p>
    <?php endif; ?>
    <form class="form card" method="post">
        <input type="text" name="customer_name" placeholder="Your name" required>
        <input type="email" name="email" placeholder="Email address" required>
        <input type="text" name="phone" placeholder="Phone number" required>
        <textarea name="message" placeholder="Write your order details" required></textarea>
        <button class="btn" type="submit">Send Message</button>
    </form>
</section>
<?php include 'footer.php'; ?>
