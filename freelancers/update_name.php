<?php
include('db_connect.php');
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id_f'])) {
    header("Location: loginfreelans.html");
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $new_name = trim($_POST['new_name']);
    $user_id = $_SESSION['user_id_f'];

    if (empty($new_name)) {
        die("Ім'я не може бути порожнім.");
    }

    $query = "UPDATE nkloqzcz_freelans.freelanser_akks SET name = ? WHERE id_f = ?";
    $stmt = $conn->prepare($query);

    if (!$stmt) {
        die("Помилка запиту: " . $conn->error);
    }

    $stmt->bind_param("si", $new_name, $user_id);

    if ($stmt->execute()) {
        header("Location: correcting-info.php?success=1");
        exit();
    } else {
        echo "Помилка оновлення імені: " . $stmt->error;
    }

    $stmt->close();
}

$conn->close();
?>
