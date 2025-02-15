<?php
include('db_connect.php');
include('get_user.php');

$query = "SELECT message FROM notifications WHERE user_id = ? AND is_read = 0 ORDER BY created_at DESC";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$notifications = [];
while ($row = $result->fetch_assoc()) {
    $notifications[] = $row;
}

echo json_encode($notifications);
?>
