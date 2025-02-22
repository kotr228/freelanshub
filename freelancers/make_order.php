<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

include('db_connect.php');

if (!isset($_SESSION['user_id_f'])) {
    die("Ви повинні бути авторизовані для виконання цієї дії");
}

if (!isset($_SESSION['order_id']) || !is_numeric($_SESSION['order_id'])) {
    die("Помилка: ID замовлення некоректний.");
}

$order_id = $_SESSION['order_id'];
$id_f = $_SESSION['user_id_f'];

// Підключення до бази даних
$conn = new mysqli("localhost", "nkloqzcz_root", "Sillver-228", "nkloqzcz_freelans");
if ($conn->connect_error) {
    die("Помилка підключення до БД: " . $conn->connect_error);
}
$conn->set_charset("utf8");

// Отримуємо ID замовника
$stmt = $conn->prepare("SELECT id_c FROM job WHERE id_j = ?");
$stmt->bind_param("i", $order_id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $client_id = $row['id_c'];
} else {
    die("Помилка: Замовник не знайдений.");
}

$stmt->close();

// Оновлення статусу замовлення
$update_stmt = $conn->prepare("UPDATE job SET status = 'S2', id_f = ? WHERE id_j = ?");
$update_stmt->bind_param("ii", $id_f, $order_id);
if (!$update_stmt->execute()) {
    die("Помилка при оновленні замовлення: " . $update_stmt->error);
}
$update_stmt->close();

// Додаємо сповіщення
$message = "Вітаю. Ваше замовлення #$order_id виконано";
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
