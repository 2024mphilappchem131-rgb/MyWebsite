<?php
require 'config.php';
$pageTitle = 'About - Lahore Fresh Bakes';
$currentPage = 'about';
include 'header.php';
?>
<section class="section">
    <h2>About Our Bakery</h2>
    <p class="section-lead">Lahore Fresh Bakes started as a home-based bakery and now serves local customers near Johar Town, Lahore.</p>
    <div class="grid">
        <div class="card">
            <h3>Business Problem</h3>
            <p>Customers need a simple way to view bakery products, check prices, and contact the bakery without visiting the shop.</p>
        </div>
        <div class="card">
            <h3>Our Solution</h3>
            <p>This website displays products, receives contact messages, and gives the owner an admin panel to manage product data.</p>
        </div>
        <div class="card">
            <h3>Quality Promise</h3>
            <p>Every order is prepared fresh with clear pricing, clean packaging, and reliable pickup timing.</p>
        </div>
    </div>
</section>
<?php include 'footer.php'; ?>
