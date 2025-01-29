<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
include('db_connect.php');

if (isset($_GET['id_j']) && is_numeric($_GET['id_j'])) {
    $order_id = $_GET['id_j'];

    $_SESSION['id_j'] = $order_id;

    // Запит для отримання конкретного замовлення
    $conn = new mysqli("localhost", "nkloqzcz_root", "Sillver-228", "nkloqzcz_freelans");
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    $conn->set_charset("utf8");

    $stmt = $conn->prepare("SELECT * FROM job WHERE id_j = ?");
    $stmt->bind_param("i", $order_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $order = $result->fetch_assoc();
    } else {
        die("Замовлення не знайдено.");
    }
    $stmt->close();
    $conn->close();
} else {
    echo "Передане значення ID: " . htmlspecialchars($_GET['id_j']);
    if (!is_numeric($_GET['id_j'])) {
        die("ID некоректне.");
    }
    
    if (isset($_GET['id_j'])) {
        echo "ID замовлення: " . htmlspecialchars($_GET['id_j']);
    } else {
        die("ID не передано або воно некоректне.");
    }
    
}
?>
