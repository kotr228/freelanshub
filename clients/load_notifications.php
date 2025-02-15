<?php
include('db_connect.php');
include('get_user.php'); // Використовуємо $user_id

$result = $conn->query("SELECT message FROM notifications WHERE user_id = $user_id AND is_read = 0");

while ($row = $result->fetch_assoc()) {
    echo "<li>" . htmlspecialchars($row['message']) . "</li>";
}
?>
