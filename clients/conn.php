<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Налаштування підключення до бази даних
$host = "localhost";
$user = "root";
$password = "Sillver-228"; // Вкажіть свій пароль для MySQL, якщо є
$dbname = "freelans";

// Підключення до бази даних
$conn = new mysqli("localhost", "nkloqzcz_root", "Sillver-228", "nkloqzcz_freelans");

// Перевірка підключення
if ($conn->connect_error) {
    die("Помилка підключення: " . $conn->connect_error);
}
?>
