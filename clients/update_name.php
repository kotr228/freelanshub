<?php
include('db_connect.php');
session_start();

if (!isset($_SESSION['user_id'])) {
    die("Користувач не авторизований.");
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $new_name = trim($_POST['new_name']);
    $user_id = $_SESSION['user_id'];

    if (empty($new_name)) {
        die("Ім'я не може бути порожнім.");
    }

    $query = "UPDATE freelans.cliants_akks SET name = ? WHERE id_c = ?";
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
