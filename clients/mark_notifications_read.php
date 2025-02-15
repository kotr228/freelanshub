<?php
include('db_connect.php');
include('get_user.php'); // Використовуємо $user_id

$conn->query("UPDATE notifications SET is_read = 1 WHERE user_id = $user_id");
?>
