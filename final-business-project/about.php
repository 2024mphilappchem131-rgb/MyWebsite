<?php
/**
 * about.php
 * Public About page. It explains the business and shows the team members that
 * the owner has added from the admin panel.
 */
require 'config.php';
$pageTitle = 'About - Lahore Fresh Bakes';
$currentPage = 'about';

// Team members are read from the database so the owner can change the team
// from the admin panel without editing this file.
$members = $pdo->query('SELECT * FROM team_members ORDER BY id ASC')->fetchAll();

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

<!-- Team section: one card for each row in the team_members table -->
<section class="section">
    <h2>Meet Our Team</h2>
    <p class="section-lead">The small team that bakes, packs, and delivers every order.</p>
    <?php if ($members): ?>
        <div class="grid">
            <?php foreach ($members as $member): ?>
                <article class="card team-card">
                    <?php if ($member['image']): ?>
                        <img class="team-photo" src="uploads/<?= e($member['image']) ?>" alt="<?= e($member['name']) ?>">
                    <?php else: ?>
                        <!-- No photo uploaded yet, so show the first letter of the name instead -->
                        <div class="team-photo team-initial"><?= e(strtoupper(substr($member['name'], 0, 1))) ?></div>
                    <?php endif; ?>
                    <h3><?= e($member['name']) ?></h3>
                    <p class="team-role"><?= e($member['position']) ?></p>
                    <p><?= e($member['bio']) ?></p>
                </article>
            <?php endforeach; ?>
        </div>
    <?php else: ?>
        <p class="section-lead">Team details will be added soon.</p>
    <?php endif; ?>
</section>
<?php include 'footer.php'; ?>
