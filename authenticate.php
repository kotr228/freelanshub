<?php
session_start();
$servername = "localhost";
$username = "root";
$password = "Sillver-228";
$dbname = "freelans";

// Створення з'єднання
$conn = new mysqli($servername, $username, $password, $dbname);

// Перевірка з'єднання
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Отримання даних з POST запиту
$email = $_POST['email'];
$password = $_POST['password'];  // Password entered by the user

// Пошук користувача за email
$sql = "SELECT * FROM freelanser_akks WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    
    // Перевірка паролю
    if ($password === $row['password']) {
        // Вхід успішний, створення сесії
        $_SESSION['freelancer_id'] = $row['id'];
        $_SESSION['name'] = $row['name'];
        header("Location: dashboard.php");  // Перенаправлення на панель фрілансера
        exit();
    } else {
        echo "Невірний пароль.";
    }
} else {
    echo "Користувача з таким email не знайдено.";
}

$conn->close();
?>
