<?php
include('db_connect.php');
include('get_user.php'); // Отримуємо $user_id із сесії

if (!$user_id) {
    echo json_encode(["error" => "Користувач не авторизований"]);
    exit;
}

// Виконуємо SQL-запит
$query = "SELECT id, message FROM notifications WHERE user_id = ? AND is_read = 0";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$notifications = [];
while ($row = $result->fetch_assoc()) {
    $notifications[] = $row;
}

$stmt->close();
$conn->close();

// Повертаємо JSON-відповідь
echo json_encode($notifications);
?>
