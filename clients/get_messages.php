<?php
include('../db_connect.php'); // Використовуємо правильне підключення

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Якщо користувач не авторизований, повертаємо порожній масив
if (!isset($_SESSION['user_id_c'])) {
    echo json_encode([]);
    exit;
}

$user_id_c = $_SESSION['user_id_c'];

$conn->set_charset("utf8");

// Отримуємо всі непрочитані сповіщення для замовника
$stmt = $conn->prepare("SELECT id_n_c, message FROM notifications_c WHERE id_c = ? AND is_read = 0 ORDER BY id_n_c DESC");
$stmt->bind_param("i", $user_id_c);
$stmt->execute();
$result = $stmt->get_result();

$notifications = [];
while ($row = $result->fetch_assoc()) {
    $notifications[] = $row;
}

// Виводимо JSON
echo json_encode($notifications, JSON_UNESCAPED_UNICODE);

// Закриваємо з'єднання
$stmt->close();
$conn->close();
?>
