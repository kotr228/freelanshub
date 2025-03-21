<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Підключення до бази даних
$host = "localhost";
$username = "root";
$password = "Sillver-228";
$dbname = "freelans";

$conn = new mysqli("localhost", "nkloqzcz_root", "Sillver-228", "nkloqzcz_freelans");

// Перевірка з'єднання
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Перевірка, чи користувач увійшов у систему

if (!isset($_SESSION['user_id'])) {
    // Якщо не увійшов, перенаправляємо на сторінку логіну
    header("Location: loginclients.html");
    exit();
}

// Отримання імені користувача за його ID
$user_id = $_SESSION['user_id'];
$query = "SELECT phone FROM cliants_akks WHERE id_c = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$stmt->bind_result($user_phone);
$stmt->fetch();
$stmt->close();
?>
