<?php
$servername = "localhost";
$username = "your_username";
$password = "your_password";
$dbname = "freelans";

// Створення з'єднання
$conn = new mysqli($servername, $username, $password, $dbname);

// Перевірка з'єднання
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Отримання даних з POST запиту
$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$password = $_POST['password']; // Зверніть увагу на безпеку: використовуйте password_hash в реальних умовах!
$telegram = $_POST['telegram'];
$specialty = $_POST['specialty'];
$bank_card = $_POST['bank_card'];

// Підготовка SQL запиту
$sql = "INSERT INTO freelanser_akks (name, email, password, telegram, phone, spacialty, bank_card)
VALUES ('$name', '$email', '$password', '$telegram', '$phone', '$specialty', '$bank_card')";

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
