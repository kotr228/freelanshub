<?php
include('../db_connect.php'); // ВАЖЛИВО! Оскільки файл в `clients/`, треба правильно підключити БД

// Переконуємося, що користувач авторизований
if (!isset($_SESSION['user_id_c'])) {
    echo json_encode(["error" => "Користувач не авторизований"]);
    exit;
}

if (!isset($_SESSION['user_id_c'])) {
    die(json_encode([])); // Якщо користувач не авторизований, повертаємо порожній масив
}

$user_id_c = $_SESSION['user_id_c'];

$conn = new mysqli("localhost", "nkloqzcz_root", "Sillver-228", "nkloqzcz_freelans");
if ($conn->connect_error) {
    die(json_encode(["error" => "Помилка підключення до БД"]));
}
$conn->set_charset("utf8");

// Отримуємо всі непрочитані сповіщення для замовника
$stmt = $conn->prepare("SELECT id_n_c, message FROM notifications_c WHERE id_c = ? AND is_read = 0 ORDER BY id_n_c DESC");
$stmt->bind_param("i", $user_id_c);
$stmt->execute();
$result = $stmt->get_result();

$notifications = [];
while ($row = $result->fetch_assoc()) {
    $notifications[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode($notifications);
?>
