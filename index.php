<?php
$conn = new mysqli("localhost", "nkloqzcz_root", "Sillver-228", "nkloqzcz_freelans");
if ($conn->connect_error) {
    die("Помилка підключення: " . $conn->connect_error);
}

// Перевіряємо, коли востаннє проводилося очищення
$result = $conn->query("SELECT last_cleanup FROM cleanup LIMIT 1");
$row = $result->fetch_assoc();
$last_cleanup = $row ? $row['last_cleanup'] : "2000-01-01";

// Якщо сьогодні ще не виконувалося очищення
if ($last_cleanup < date("Y-m-d")) {
    // Знаходимо ID замовлень, які старші за 30 днів
    $ordersToDelete = $conn->query("SELECT id_j FROM job WHERE date < NOW() - INTERVAL 30 DAY");

    if ($ordersToDelete->num_rows > 0) {
        $orderIds = [];
        while ($row = $ordersToDelete->fetch_assoc()) {
            $orderIds[] = $row['id_j'];
        }
        $idList = implode(",", $orderIds); // Перетворюємо масив у список ID

        // 2. Отримуємо всі шляхи до файлів, які потрібно видалити
        $filesToDelete = $conn->query("SELECT file_path FROM files WHERE id_j IN ($idList)");

        while ($file = $filesToDelete->fetch_assoc()) {
            $filePath = $file['file_path']; // Формуємо повний шлях
            if (file_exists($filePath)) {
                unlink($filePath); // Видаляємо файл
            }
        }

        // Видаляємо пов'язані файли
        $conn->query("DELETE FROM files WHERE id_j IN ($idList)");

        // Видаляємо замовлення
        $conn->query("DELETE FROM job WHERE id_j IN ($idList) AND status = 'S1' AND id_f IS NULL");
    }

    $ordersToDelete = $conn->query("SELECT id_j FROM job WHERE date < NOW() - INTERVAL 365 DAY AND status = 'S3' AND id_f IS NULL");

    if ($ordersToDelete->num_rows > 0) {
        $orderIds = [];
        while ($row = $ordersToDelete->fetch_assoc()) {
            $orderIds[] = $row['id_j'];
        }
        $idList = implode(",", $orderIds); // Перетворюємо масив у список ID

        // 2. Отримуємо всі шляхи до файлів, які потрібно видалити
        $filesToDelete = $conn->query("SELECT file_path FROM files WHERE id_j IN ($idList)");

        while ($file = $filesToDelete->fetch_assoc()) {
            $filePath = $file['file_path']; // Формуємо повний шлях
            if (file_exists($filePath)) {
                unlink($filePath); // Видаляємо файл
            }
        }

        // Видаляємо пов'язані файли
        $conn->query("DELETE FROM files WHERE id_j IN ($idList)");

        // Видаляємо замовлення
        $conn->query("DELETE FROM job WHERE id_j IN ($idList) AND status = 'S3' AND id_f IS NULL");
    }


    
    // Оновлюємо дату останнього очищення
    $conn->query("UPDATE cleanup SET last_cleanup = CURDATE()");
}

$conn->close();
?>


<!DOCTYPE html>
<html lang="UK">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ГОЛОВНА</title>
  <link rel="stylesheet" href="index.css">
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


    <div class="header_item"><a href="#modal-about" class="btn-open-modal-about">Служба підтримки</a>
    
      <div id="modal-about">
        <div class="modala-content">
          <h3>Служба підтримки:</h3>
          <br><h6>telegram username: @freelansehub</h6>
          <h3>Реклама і партнерстово:</h3>
          <br><h6>telegram username: @freelansehun_partner</h6>
          <div class="modala-actions">
           <a href="#" class="btn-close">Закрити</a>
         </div>
        </div>
      </div>
    
    </div>
  </header>
  <main class="main">
    <a href="/freelancers/loginfreelans.html" class="button">
      <div class="content">
        <img src="free-icon-freelancer-5024208.png" alt="Freelancer Icon" class="img">
        <p class="caption">Увійти як фрілансер</p>
      </div>
    </a>
    
    <a href="/clients/loginclients.html" class="button">
      <div class="content">
        <img src="free-icon-computer-15557975.png" alt="Freelancer Icon" class="img">
        <p class="caption">Увійти як замовник</p>
      </div>
    </a>
    <div class="button">Рекламка</div>
  </main>

  <div class="obolocka">
    <footer class="footer">
      <img class="logo" src="img/Freelanshub (1).png" alt="logo">
      <div class="footer-item"><a href="#modal-about" class="btn-open-modal-about">Реклама</a></div>
      <div class="footer-item"><a href="#modal-about" class="btn-open-modal-about">Партнерство</a></div>
      <div class="footer-item">Про нас</div>
    </footer>
  </div>
</div>

 
</body>
</html>
