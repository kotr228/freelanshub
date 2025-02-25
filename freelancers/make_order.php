<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

include('db_connect.php');
include('order_detail_data.php'); // Підключаємо файл з інформацією про замовлення

if (!isset($_SESSION['user_id_f'])) {
    header("Location: loginfreelans.html");
    exit;
}

if (!isset($_SESSION['id_j']) || !is_numeric($_SESSION['id_j'])) {
    die("Помилка: ID замовлення некоректний.");
}

$order_id = $_SESSION['id_j'];
$id_f = $_SESSION['user_id_f'];

// Переконуємося, що у нас є назва замовлення
$order_title = $order['lable'] ?? "Без назви";

// Отримуємо ID замовника
$client_id = $order['id_c'] ?? null;
if (!$client_id) {
    die("Помилка: ID замовника не знайдено.");
}

// Оновлення статусу замовлення
$update_stmt = $conn->prepare("UPDATE job SET status = 'S2', id_f = ? WHERE id_j = ?");
$update_stmt->bind_param("ii", $id_f, $order_id);
if (!$update_stmt->execute()) {
    die("Помилка при оновленні замовлення: " . $update_stmt->error);
}
$update_stmt->close();

// Додаємо сповіщення з назвою замовлення
$message = "Вітаю. Ваше замовлення «$order_title» виконано";
$insert_stmt = $conn->prepare("INSERT INTO notifications_c (id_c, id_j, message, is_read) VALUES (?, ?, ?, 0)");
$insert_stmt->bind_param("iis", $client_id, $order_id, $message);

if (!$insert_stmt->execute()) {
    die("Помилка при додаванні сповіщення: " . $insert_stmt->error);
}

$insert_stmt->close();
$conn->close();

// Перенаправлення
header("Location: delat_zakazy.php");
exit;
?>
