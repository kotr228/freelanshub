<?php
// Підключення до бази даних
$host = "localhost";
$username = "root";
$password = "Sillver-228";
$dbname = "freelans";

$conn = new mysqli($host, $username, $password, $dbname);

// Перевірка з'єднання
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Перевірка, чи користувач увійшов у систему
session_start();
if (!isset($_SESSION['user_id'])) {
    // Якщо не увійшов, перенаправляємо на сторінку логіну
    header("Location: loginfreelans.html");
    exit();
}

// Отримання імені користувача за його ID
$user_id = $_SESSION['user_id'];
$query = "SELECT name FROM cliants_akks WHERE id_c = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$stmt->bind_result($user_name);
$stmt->fetch();
$stmt->close();
?>