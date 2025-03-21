<?php
include('db_connect.php');
// Підключення до бази даних
$conn = new mysqli("localhost", "nkloqzcz_root", "Sillver-228", "nkloqzcz_freelans");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
if (session_status() === PHP_SESSION_NONE) {
  session_start();
}
$conn->set_charset("utf8");

// Ініціалізація фільтрів
$type = $_GET['type'] ?? '';
$specialty = $_GET['specialty'] ?? '';
$deadline = $_GET['deadline'] ?? '';
$price_from = $_GET['price-from'] ?? '';
$price_to = $_GET['price-to'] ?? '';

// Формування SQL-запиту з фільтрами


$conn->close();
?>

<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Каталог замовлень</title>
  <link rel="stylesheet" href="style.css/delat_zakazu.css">
</head>
<body class="body">
<div class="site">
  <header class="header">
  <div class="header_item"><a href="#modal" class="btn-open-modal">Цінова політика</a>

<!-- Модальне вікно -->
<div id="modal">
  <div class="modal-content">
    <h3>Цінова політика</h3>
     <h6>Платформа забирає певну частину платежу на утримання хостингу сайту. Для різних типів замовлень різні відсотки, також відсоток залежить від ціни.</h6>
     <br><h4>Залежність відсотку від ціни замовлення:</h4>
     <h6>До 1000 грн/25 usd - 5%</h6>
     <h6>Від 1000 грн/25 usd до 42000 грн/1000 usd - 10%</h6>
     <h6>Від 42000 грн/1000 usd до 84000 грн/2000 usd - 12%</h6>
     <h6>Від 84000 грн/2000 usd - 15%</h6>
     <br><h4>УВАГА!</h4>
     <h6>Платформа робить платіж автоматично після сплати замовлення клієнтом, а клієнт може сплатити гроші за замовлення тільки після того, як виконавець повідомить про виконану роботу</h6><br>
    <div class="modal-actions">
     <a href="#" class="btn-close">Закрити</a>
   </div>
  </div>
</div>
</div>

<div class="header_item"><a href="#modalph" class="btn-open-modal">Політика конфеденційності</a>
    
    <div id="modalph">
      <div class="modal-contentph">
        <h3>Політика конфеденційності</h3>
         <h6>Платформа не збирає ваші персональні данні окрім пошти, номеру телефону та інших засобів зв'язку, також нам необхідна банківська картка виконавця. Також модератори не можуть змінити ваші паролі, оскільки у нас немає до них доступу, пізніше з'явиться можливість зміни паролю користувачем.</h6>
         <br><h4>Файли:</h4>
         <h6>Ми зберігаємо файли, які ви прикріплюєте до обмінників файлів, але ми не використовуємо їх. Також ми можемо надати ваші файли при необхідності, якщо ви втратите доступ до них.</h6>
         <h6>Якщо є необхідність передати не файл, а проект, необхідно архівувати його.</h6>
         <br><h4>УВАГА!</h4>
         <h6>Платформа з часом видаляє старі файли, тобто вони можуть зберігатися рік, як і всі замовлення, тобто через рік після створення замовлення, система видаляє замовлення з бази даних, а також всі файли, які пов'язані з цим замовленням.</h6><br>
        <div class="modalph-actions">
         <a href="#" class="btn-closeph">Закрити</a>
       </div>
      </div>
    </div>

  </div>
  
    <div class="header_item">Служба підтримки</div>
    <button class="header_item" onclick="location.href='delat_zakazy.php'">На головну</button>
    <?php include('get_user.php'); ?>
    <div class="header_user-info">
      <p class="header_user-name"><?php echo htmlspecialchars($user_name); ?></p> <!-- Виведення імені користувача -->
      <a href="#">
        <img class="logo-user" src="<?php echo htmlspecialchars($avatar_path); ?>" alt="">
      </a>
      <div class="dropdown-menu">
      <button class="dropdown-item" onclick="location.href='loginfreelans.html'">Змінити аккаунт</button>
      <button class="dropdown-item" onclick="location.href='registrfreelans.html'">Вийти з аккаунту</button>
      <button class="dropdown-item" onclick="location.href='correcting-info.php'">Налаштування аккаунту</button>
      </div>
    </div>
  </header>

  <main class="main">
    <div class="block-parametrs">
      
    </div>

    <div class="orders">
      <?php include_once 'my_orders_output.php'; ?>    
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
</div>

<script>
document.getElementById("filter-button").addEventListener("click", function() {
    const form = document.getElementById("filter-form");
    const formData = new FormData(form);

    fetch("my_orders_output.php", {
        method: "GET",
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById("results").innerHTML = data; // Відображення результатів
    })
    .catch(error => {
        console.error("Помилка:", error);
    });
});
</script>

</body>
</html>
