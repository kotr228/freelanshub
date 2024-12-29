<?php
include('db_connect.php'); // Перевірте, чи правильний шлях до файлу db_connect.php

// Отримання ID замовлення
$order_id = isset($_GET['id_j']) ? intval($_GET['id_j']) : 0;

// Перевірка наявності з'єднання з базою даних
if (!isset($conn)) {
    die("Помилка: підключення до бази даних не встановлено.");
}

// Підготовка запиту
$query = $conn->prepare("SELECT description FROM job WHERE id_j = ?");
$query->bind_param("i", $order_id);

// Виконання запиту
$query->execute();

// Отримання результату
$query->bind_result($description);
$query->fetch();
$query->close();

// Якщо опис не знайдено
if (!$description) {
    $description = "Опис відсутній";
}
?>
