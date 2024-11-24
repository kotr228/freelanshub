<!DOCTYPE html>
<html lang="UK">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Делать заказы</title>
  <link rel="stylesheet" href="style.css/delat_zakazu.css">
</head>
<body class="body">

<?php
session_start();

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
    $password = $_POST['password'];

    // Захист від SQL ін'єкцій
    $email = $conn->real_escape_string($email);
    $password = $conn->real_escape_string($password);

    // Запит до бази даних для перевірки користувача
    $query = "SELECT * FROM freelanser_akks WHERE email='$email'";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if (password_verify($password, $row['password'])) {
            $_SESSION['user_id'] = $row['id_f'];
            echo "<p>Вхід успішний! Вітаємо, {$row['name']}!</p>";
        } else {
            echo "<p>Неправильний пароль!</p>";
        }
    } else {
        echo "<p>Користувач з таким email не знайдений!</p>";
    }
    $conn->close();
}
?>
  



  <header class="header">
    <div class="header_item">Цінова політика</div>
    <div class="header_item">Політика конфедеційності</div>
    <div class="header_item">Служба підтримки</div>
    <div class="header_item">На головну</div>
    <div class="header_user-info">
      <p class="header_user-name">User</p>
      <a href="#">
        <img class="logo-user" src="img/png-transparent-computer-icons-user-profile-user-account-avatar-heroes-silhouette-black-thumbnail.png" alt="">
      </a> 
    </div>
  </header>
  <main class="main">
    <div class="block-parametrs">
      <div class="style_pole">
        <label for="type">Тип:</label>
        <select id="type" class="input">
          <option value="" disabled selected></option>
          <option value="type1">Тип 1</option>
          <option value="type2">Тип 2</option>
        </select>
      </div>

      <div class="style_pole">
        <label for="specialty">Спеціальність:</label>
        <select id="specialty" class="input">
          <option value="" disabled selected></option>
          <option value="spec1">Спеціальність 1</option>
          <option value="spec2">Спеціальність 2</option>
        </select>
      </div>

      <div class="style_pole">
        <label for="deadline">Дедлайн:</label>
        <input class="input-data" type="date" id="deadline" />
      </div>
      

      <div class="style_pole">
        <p>Ціна</p>
        <label for="price-from">Від:</label>
        <input class="input-price" type="number" id="price-from" placeholder="0" />
    
        <label for="price-to">До:</label>
        <input class="input-price" type="number" id="price-to" placeholder="1000" />
      </div>
    </div>
  </main>

  <div class="obolocka">
    <footer class="footer">
      <img class="logo" src="img/Freelanshub (1).png" alt="logo">
      <div class="footer-item">Реклама</div>
      <div class="footer-item">Партнерство</div>
      <div class="footer-item">Про нас</div>
    </footer>
  </div>
 
</body>
</html>