<?php
/**
 * admin/team.php
 * Full CRUD page for team members (Create, Read, Update, Delete).
 * The same form handles both adding and editing: a hidden "id" field decides
 * which one happens. Members added here appear on the public About page.
 */
require '../config.php';
require_admin(); // Only a logged-in admin may open this page.

$error = '';
$editingMember = null; // Holds the member being edited, or null when adding.

// ---------------------------------------------------------------------------
// DELETE: remove the member and also delete their photo from the uploads folder
// ---------------------------------------------------------------------------
if (isset($_GET['delete'])) {
    // Read the image name first, because after the DELETE the row is gone.
    $stmt = $pdo->prepare('SELECT image FROM team_members WHERE id = ?');
    $stmt->execute([(int) $_GET['delete']]);
    $member = $stmt->fetch();

    $stmt = $pdo->prepare('DELETE FROM team_members WHERE id = ?');
    $stmt->execute([(int) $_GET['delete']]);

    // Delete the photo file too, so unused images do not pile up on the server.
    if ($member && $member['image']) {
        $imagePath = __DIR__ . '/../uploads/' . $member['image'];
        if (is_file($imagePath)) {
            unlink($imagePath);
        }
    }

    // Redirect after deleting so a page refresh does not repeat the action.
    header('Location: team.php');
    exit;
}

// ---------------------------------------------------------------------------
// EDIT: load the selected member so the form below opens already filled in
// ---------------------------------------------------------------------------
if (isset($_GET['edit'])) {
    $stmt = $pdo->prepare('SELECT * FROM team_members WHERE id = ?');
    $stmt->execute([(int) $_GET['edit']]);
    $editingMember = $stmt->fetch();
}

// ---------------------------------------------------------------------------
// CREATE and UPDATE: both are handled by this one form submission
// ---------------------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // id is 0 when adding a new member, and the real id when editing.
        $id = (int) ($_POST['id'] ?? 0);

        // old_image keeps the current photo if no new file was chosen.
        $image = upload_image('image', 'team', $_POST['old_image'] ?? '');

        if ($id > 0) {
            // UPDATE an existing member.
            $stmt = $pdo->prepare('UPDATE team_members SET name = ?, position = ?, bio = ?, image = ? WHERE id = ?');
            $stmt->execute([
                trim($_POST['name']),
                trim($_POST['position']),
                trim($_POST['bio']),
                $image,
                $id,
            ]);
        } else {
            // INSERT a brand new member.
            $stmt = $pdo->prepare('INSERT INTO team_members (name, position, bio, image) VALUES (?, ?, ?, ?)');
            $stmt->execute([
                trim($_POST['name']),
                trim($_POST['position']),
                trim($_POST['bio']),
                $image,
            ]);
        }

        header('Location: team.php');
        exit;
    } catch (RuntimeException $uploadError) {
        // Image was rejected (wrong type or too large), so show the reason
        // instead of saving a broken record.
        $error = $uploadError->getMessage();
    }
}

// READ: load all members for the table at the bottom of the page.
$members = $pdo->query('SELECT * FROM team_members ORDER BY id DESC')->fetchAll();
$pageTitle = 'Team Members';
include 'admin_header.php';
?>
<h1>Team Members</h1>
<?php if ($error): ?><p class="notice" style="background:#fee2e2;color:#991b1b;"><?= e($error) ?></p><?php endif; ?>

<?php // enctype="multipart/form-data" is required for file uploads to work ?>
<form class="form card" method="post" enctype="multipart/form-data">
    <?php // The heading and button text change depending on add or edit mode ?>
    <h2><?= $editingMember ? 'Edit Team Member' : 'Add Team Member' ?></h2>
    <input type="hidden" name="id" value="<?= e($editingMember['id'] ?? '') ?>">
    <input type="hidden" name="old_image" value="<?= e($editingMember['image'] ?? '') ?>">
    <input type="text" name="name" placeholder="Member name" value="<?= e($editingMember['name'] ?? '') ?>" required>
    <input type="text" name="position" placeholder="Position" value="<?= e($editingMember['position'] ?? '') ?>" required>
    <textarea name="bio" placeholder="Short bio" required><?= e($editingMember['bio'] ?? '') ?></textarea>
    <input type="file" name="image" accept="image/jpeg,image/png,image/webp">
    <button class="btn" type="submit"><?= $editingMember ? 'Update Member' : 'Add Member' ?></button>
    <?php if ($editingMember): ?><a class="btn secondary" href="team.php">Cancel Edit</a><?php endif; ?>
</form>

<h2>Team List</h2>
<table class="table">
    <thead>
        <tr><th>Image</th><th>Name</th><th>Position</th><th>Bio</th><th>Actions</th></tr>
    </thead>
    <tbody>
        <?php foreach ($members as $member): ?>
            <tr>
                <td>
                    <?php if ($member['image']): ?>
                        <img src="../uploads/<?= e($member['image']) ?>" alt="<?= e($member['name']) ?>" style="width:80px;height:80px;object-fit:cover;border-radius:50%;">
                    <?php endif; ?>
                </td>
                <td><?= e($member['name']) ?></td>
                <td><?= e($member['position']) ?></td>
                <td><?= e($member['bio']) ?></td>
                <td class="actions">
                    <a class="btn secondary" href="team.php?edit=<?= e($member['id']) ?>">Edit</a>
                    <a class="btn danger" href="team.php?delete=<?= e($member['id']) ?>" onclick="return confirm('Delete this member?')">Delete</a>
                </td>
            </tr>
        <?php endforeach; ?>
    </tbody>
</table>
<?php include 'admin_footer.php'; ?>
