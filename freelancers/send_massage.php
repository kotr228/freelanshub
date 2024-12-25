<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
include('db_connect.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id_j'], $_POST['message'])) {
    $order_id = (int)$_POST['id_j'];
    $message = trim($_POST['message']);
    $user_id = $_SESSION['user_id'] ?? null;

    if (!empty($message) && $user_id) {
        $stmt = $conn->prepare("INSERT INTO chat (id_j, id_f, message) VALUES (?, ?, ?)");
        $stmt->bind_param("iis", $order_id, $user_id, $message);
        if ($stmt->execute()) {
            echo "Повідомлення надіслано";
        } else {
            http_response_code(500);
            echo "Помилка: " . $stmt->error;
        }
    } else {
        http_response_code(400);
        echo "Неправильні дані.";
    }
} else {
    http_response_code(405);
    echo "Неправильний метод запиту.";
}
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

?>
