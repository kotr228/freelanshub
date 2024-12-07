<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

include('db_connect.php'); // Підключення до бази даних

// Отримання ID користувача із сесії
$user_id = $_SESSION['user_id'] ?? null;

// Ініціалізація змінних
$user_name = "User";
$avatar_path = "img/default-avatar.png"; // Шлях до стандартного аватара

if ($user_id) {
    // Отримання даних користувача з бази даних
    $query = "SELECT name, avatar FROM freelans.freelanser_akks WHERE id_f = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $stmt->bind_result($name, $avatar);
    if ($stmt->fetch()) {
        $user_name = $name;
        $avatar_path = $avatar ? "uploads/avatars/$avatar" : $avatar_path;
    }
    $stmt->close();
}
?>
