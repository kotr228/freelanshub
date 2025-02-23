<?php
include('db_connect.php');
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: loginclients.html");
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $new_em = trim($_POST['new_em']);
    $user_id = $_SESSION['user_id'];

    if (empty($new_em)) {
        die("Телеграм не може бути порожнім.");
    }

    $query = "UPDATE nkloqzcz_freelans.cliants_akks SET email = ? WHERE id_c = ?";
    $stmt = $conn->prepare($query);

    if (!$stmt) {
        die("Помилка запиту: " . $conn->error);
    }

    $stmt->bind_param("si", $new_em, $user_id);

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
