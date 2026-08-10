<?php
require '../config.php';
require_admin();

$error = '';
$editingMember = null;

if (isset($_GET['delete'])) {
    $stmt = $pdo->prepare('SELECT image FROM team_members WHERE id = ?');
    $stmt->execute([(int) $_GET['delete']]);
    $member = $stmt->fetch();

    $stmt = $pdo->prepare('DELETE FROM team_members WHERE id = ?');
    $stmt->execute([(int) $_GET['delete']]);

    if ($member && $member['image']) {
        $imagePath = __DIR__ . '/../uploads/' . $member['image'];
        if (is_file($imagePath)) {
            unlink($imagePath);
        }
    }

    header('Location: team.php');
    exit;
}

if (isset($_GET['edit'])) {
    $stmt = $pdo->prepare('SELECT * FROM team_members WHERE id = ?');
    $stmt->execute([(int) $_GET['edit']]);
    $editingMember = $stmt->fetch();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $id = (int) ($_POST['id'] ?? 0);
        $image = upload_image('image', 'team', $_POST['old_image'] ?? '');

        if ($id > 0) {
            $stmt = $pdo->prepare('UPDATE team_members SET name = ?, position = ?, bio = ?, image = ? WHERE id = ?');
            $stmt->execute([
                trim($_POST['name']),
                trim($_POST['position']),
                trim($_POST['bio']),
                $image,
                $id,
            ]);
        } else {
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
        $error = $uploadError->getMessage();
    }
}

$members = $pdo->query('SELECT * FROM team_members ORDER BY id DESC')->fetchAll();
$pageTitle = 'Team Members';
include 'admin_header.php';
?>
<h1>Team Members</h1>
<?php if ($error): ?><p class="notice" style="background:#fee2e2;color:#991b1b;"><?= e($error) ?></p><?php endif; ?>

<form class="form card" method="post" enctype="multipart/form-data">
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
