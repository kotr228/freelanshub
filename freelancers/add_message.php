<?php
include('db_connect.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    session_start();

    if (!isset($_SESSION['user_id_f'])) {
        echo json_encode(['success' => false, 'error' => 'Ви не авторизовані']);
        exit;
    }

    $id_c = $_SESSION['user_id_f'];
    $id_j = intval($_POST['id_j'] ?? 0);
    $message = trim($_POST['message'] ?? '');

    if ($id_j <= 0 || empty($message)) {
        echo json_encode(['success' => false, 'error' => 'Неправильні дані']);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO `chat` (id_j, id_f, id_c, message) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("iiis", $id_j, $id_c, $id_c, $message);
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Не вдалося надіслати повідомлення']);
    }
    $stmt->close();
}
?>
