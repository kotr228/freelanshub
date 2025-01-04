<?php
include('db_connect.php');

$id_j = intval($_GET['id_j'] ?? 0);

$stmt = $conn->prepare("SELECT message, created_at FROM chat WHERE id_j = ? ORDER BY created_at ASC");
$stmt->bind_param("i", $id_j);
$stmt->execute();
$result = $stmt->get_result();
$messages = $result->fetch_all(MYSQLI_ASSOC);
$stmt->close();

echo json_encode(['messages' => $messages]);
?>
