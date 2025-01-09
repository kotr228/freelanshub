<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Ініціалізація змінних для підключення до бази даних
$host = "localhost";
$dbUsername = "root";
$dbPassword = "Sillver-228";
$dbName = "freelans";

// Встановлення з'єднання з базою даних
$conn = new mysqli($host, $dbUsername, $dbPassword, $dbName);

// Перевірка з'єднання
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Якщо форма була відправлена
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = trim($_POST['password']); // Обрізаємо пробіли

    // Захист від SQL ін'єкцій
    $email = $conn->real_escape_string($email);

    // Запит до бази даних для перевірки користувача
    $query = "SELECT * FROM cliants_akks WHERE email='$email'";
    $result = $conn->query($query);

    // Перевірка, чи знайдений користувач
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc(); // Отримання даних користувача

        // Діагностика: виведення хешу і введеного пароля
        echo "Збережений хеш пароля: " . $row['password'] . "<br>";  
        echo "Введений пароль: " . $password . "<br>";  

        // Діагностика: виведення результату функції password_verify()
        if (password_verify($password, $row['password'])) {
            echo "Пароль вірний!";
            // Успішний вхід
            $_SESSION['user_id'] = $row['id_c'];
            header("Location: peregladat_zakazy.php");
            exit();
        } else {
            echo "<p>Неправильний пароль!</p>";
        }
    } else {
        echo "<p>Користувач з таким email не знайдений!</p>";
    }

    // Закриття з'єднання
    $conn->close();
}
?>
