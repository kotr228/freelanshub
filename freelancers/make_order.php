<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

include('db_connect.php');

if (!isset($_SESSION['user_id_f'])) {
    die("Ви повинні бути авторизовані для виконання цієї дії");
}

if (isset($_SESSION['order_id']) && is_numeric($_SESSION['order_id'])) {
    $order_id = $_SESSION['order_id'];
    $id_f = $_SESSION['user_id_f'];

    $conn = new mysqli("localhost", "nkloqzcz_root", "Sillver-228", "nkloqzcz_freelans");
    if ($conn->connect_error) {
        die("Помилка підключення до бази даних: " . $conn->connect_error);
    }
    $conn->set_charset("utf8");

    // Перевіряємо, чи замовлення доступне
    $stmt = $conn->prepare("SELECT id_c FROM job WHERE id_j = ? AND status = 'S1'");
    $stmt->bind_param("i", $order_id);
    $stmt->execute();
    $result = $stmt->get_result();


    if ($row = $result->fetch_assoc()) {
        $client_id = $row['id_c']; // Отримуємо ID замовника

    
    if ($result->num_rows > 0) {
        // Оновлення статусу замовлення
        $update_stmt = $conn->prepare("UPDATE job SET status = 'S2', id_f = ? WHERE id_j = ?");
        $update_stmt->bind_param("ii", $id_f, $order_id);
        if ($update_stmt->execute()) {
            // Додаємо запис про сповіщення в таблицю `notifications_c`
            $message = "Вітаю. Ваше замовлення #$order_id виконано";
            $insert_stmt = $conn->prepare("INSERT INTO notifications_c (id_c, id_j, message, is_read) VALUES (?, ?, ?, 0)");
            $insert_stmt->bind_param("iis", $client_id, $order_id, $message);
            $insert_stmt->execute();
            $insert_stmt->close();
        
            header("Location: delat_zakazy.php");
        }        
         else {
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