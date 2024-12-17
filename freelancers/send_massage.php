<?php
session_start();
include('db_connect.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id_j'], $_POST['message'])) {
    $order_id = (int)$_POST['id_j'];
    $message = trim($_POST['message']);
    $user_id = $_SESSION['user_id'];

    if (!empty($message)) {
        $stmt = $conn->prepare("INSERT INTO chat (id_j, id_f, message) VALUES (?, ?, ?)");
        $stmt->bind_param("iis", $order_id, $user_id, $message);

        if ($stmt->execute()) {
            echo "Повідомлення надіслано.";
        } else {
            echo "Помилка: " . $stmt->error;
        }
    } else {
        echo "Повідомлення не може бути порожнім.";
    }
}
?>
