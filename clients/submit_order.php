<?php
// Підключення до бази даних
$servername = "localhost";
$username = "root";
$password = "Sillver-228";
$database = "freelans";

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$conn = new mysqli("localhost", "nkloqzcz_root", "Sillver-228", "nkloqzcz_freelans");

// Перевірка підключення
if ($conn->connect_error) {
    die("Помилка підключення: " . $conn->connect_error);
}

// Обробка форми
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $type = $_POST['type'];
    $specialty = $_POST['specialty'];
    $deadline = $_POST['deadline'];
    $price = $_POST['price'];
    $name = $_POST['name'];
    $description = $_POST['description'];
    $id_c = $_SESSION['user_id']; // ID клієнта, можна отримувати з сесії

    // Запит для вставки замовлення
    $sql = "INSERT INTO job (lable, spacsalyty, tipe, description, id_c, status, price, date)
            VALUES (?, ?, ?, ?, ?, 'S1', ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssids", $name, $specialty, $type, $description, $id_c, $price, $deadline);

    if ($stmt->execute()) {
        header("Location: peregladat_zakazy.php");
    } else {
        echo "Помилка: " . $stmt->error;
    }

    $stmt->close();
}

$conn->close();
?>
