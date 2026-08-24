<?php
/**
 * admin/login.php
 * Secure admin login. Passwords are never stored as plain text: the database
 * keeps a hash, and password_verify() compares the typed password against it.
 */
require '../config.php';

// Already logged in, so skip the form.
if (is_admin()) {
    header('Location: dashboard.php');
    exit;
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $stmt = $pdo->prepare('SELECT * FROM admins WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    $admin = $stmt->fetch();

    if ($admin && password_verify($password, $admin['password_hash'])) {
        // A new session id is generated on login to prevent session fixation.
        session_regenerate_id(true);

        // Storing the id in the session is what marks this visitor as an admin.
        $_SESSION['admin_id'] = $admin['id'];
        $_SESSION['admin_name'] = $admin['name'];
        header('Location: dashboard.php');
        exit;
    }

    // One general message for both wrong email and wrong password, so an
    // attacker cannot find out which email addresses exist.
    $error = 'Invalid admin email or password.';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login</title>
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
    <section class="section">
        <h2>Admin Login</h2>
        <p class="section-lead">Use admin@freshbakes.test / admin123 for demo.</p>
        <?php if ($error): ?><p class="notice" style="background:#fee2e2;color:#991b1b;"><?= e($error) ?></p><?php endif; ?>
        <form class="form card" method="post">
            <input type="email" name="email" placeholder="Admin email" required>
            <input type="password" name="password" placeholder="Password" required>
            <button class="btn" type="submit">Login</button>
        </form>
    </section>
</body>
</html>
