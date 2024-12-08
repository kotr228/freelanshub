<?php
include('db_connect.php');
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $new_about = $_POST['new_about'];
    $user_id = $_SESSION['user_id'];

    // Оновлення в базі даних
    $query = "UPDATE freelans.cliants_akks SET about = ? WHERE id_c = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("si", $new_about, $user_id);
    
    if ($stmt->execute()) {
        header('Location: correcting-info.php?success=1');
    } else {
        header('Location: correcting-info.php?error=1');
    }
    exit();
}
?>
