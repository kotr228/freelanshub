<?php
include('db_connect.php');
include('get_user.php');

$query = "UPDATE notifications SET is_read = 1 WHERE user_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();

echo json_encode(["success" => true]);
?>
