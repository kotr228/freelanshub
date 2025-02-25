<?php
session_start();
include('../db_connect.php'); // Переконайся, що шлях правильний!
$user_id_c = $_SESSION['user_id_c'];

$conn->set_charset("utf8");

$stmt = $conn->prepare("SELECT id_n_c, message FROM notifications_c WHERE id_c = ? ORDER BY id_n_c DESC");
$stmt->bind_param("i", $user_id_c);
$stmt->execute();
$result = $stmt->get_result();

$notifications = [];
while ($row = $result->fetch_assoc()) {
    $notifications[] = $row;
}

$stmt->close();

echo json_encode($notifications);
?>
