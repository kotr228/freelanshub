<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
include('db_connect.php');

$order_id = isset($_GET['id_j']) ? (int)$_GET['id_j'] : 0;

$stmt = $conn->prepare("SELECT c.message, c.created_at, f.name AS username 
                        FROM chat c 
                        JOIN freelanser_akks f ON c.id_f = f.id_f 
                        WHERE c.id_j = ? 
                        ORDER BY c.created_at ASC");
$stmt->bind_param("i", $order_id);
$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    echo "<div class='message'>";
    echo "<strong>" . htmlspecialchars($row['username']) . ":</strong> " 
        . htmlspecialchars($row['message']);
    echo " <em style='font-size:0.8em; color:#666;'>(" . $row['created_at'] . ")</em>";
    echo "</div>";
}
?>
