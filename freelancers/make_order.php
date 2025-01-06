<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

include('db_connect.php');

// Перевірка, чи користувач авторизований
if (!isset($_SESSION['user_id'])) {
    die("Ви повинні бути авторизовані для виконання цієї дії.");
}

// Перевірка, чи є id замовлення в сесії
if (isset($_SESSION['order_id']) && is_numeric($_SESSION['order_id'])) {
    $order_id = $_SESSION['order_id'];
    $id_f = $_SESSION['user_id'];

    // Підключення до бази даних
    $conn = new mysqli("localhost", "root", "Sillver-228", "freelans");
    if ($conn->connect_error) {
        die("Помилка підключення до бази даних: " . $conn->connect_error);
    }
    $conn->set_charset("utf8");

    // Перевірка, чи доступне замовлення
    $stmt = $conn->prepare("SELECT * FROM job WHERE id_j = ? AND status = 'Активне'");
    $stmt->bind_param("i", $order_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Оновлення статусу замовлення
        $update_stmt = $conn->prepare("UPDATE job SET status = 'Виконане', id_f = ? WHERE id_j = ?");
        $update_stmt->bind_param("ii", $id_f, $order_id);
        if ($update_stmt->execute()) {
            header("Location: delat_zakazy.php");
        } else {
            echo "Помилка при оновленні замовлення: " . $conn->error;
        }
        $update_stmt->close();
    } else {
        echo "Замовлення недоступне або вже взято.";
    }

    $stmt->close();
    $conn->close();
} else {
    die("ID замовлення не знайдено в сесії або воно некоректне.");
}
?>
