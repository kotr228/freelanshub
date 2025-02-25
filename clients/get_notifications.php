<?php
session_start();
include('db_connect.php'); // Підключення до бази
include('get_user.php'); // Підключаємо файл для отримання даних користувача

header('Content-Type: application/json'); // Встановлюємо заголовок JSON

// Переконуємося, що користувач авторизований
if (!$user_id) {
    echo json_encode(["error" => "Користувач не авторизований"]);
    exit;
}

$conn->set_charset("utf8");

// Отримуємо всі сповіщення для поточного користувача
$query = "SELECT id_n_c, message FROM notifications_c WHERE id_c = ? ORDER BY id_n_c DESC";
$stmt = $conn->prepare($query);

if (!$stmt) {
    echo json_encode(["error" => "Помилка запиту: " . $conn->error]);
    exit;
}

$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$notifications = [];
while ($row = $result->fetch_assoc()) {
    $notifications[] = $row;
}

$stmt->close();

// Повертаємо список сповіщень у форматі JSON
echo json_encode($notifications);
?>
