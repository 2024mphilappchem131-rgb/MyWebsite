<?php
/**
 * admin/logout.php
 * Ends the admin session and returns to the login page.
 */
require '../config.php';

// Destroying the session removes admin_id, so require_admin() will now block
// every admin page until the next successful login.
session_destroy();
header('Location: login.php');
exit;
?>
