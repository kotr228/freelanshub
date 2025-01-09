<?php
include('db_connect.php');
include('orders.php'); // Підключення скрипта
?>

<!DOCTYPE html>
<html lang="UK">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Пересматривать заказы</title>
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
    <button class="header_item" onclick="location.href='../../index.html'">На головну</button>
    <div class="header_user-info">
      <p class="header_user-name"><?php echo htmlspecialchars($user_name); ?></p>
      <a href="#">
        <img class="logo-user" src="/img/png-transparent-computer-icons-user-profile-user-account-avatar-heroes-silhouette-black-thumbnail.png" alt="">
      </a>
      <div class="dropdown-menu">
    <button class="dropdown-item" onclick="location.href='loginclients.html'">Змінити аккаунт</button>
    <button class="dropdown-item" onclick="location.href='registerclients.html'">Вийти з аккаунту</button>
    <button class="dropdown-item" onclick="location.href='correcting-info.php'">Налаштування аккаунту</button>
    <div class="dropdown-item">  <a href="#modaln" class="btn-open-modaln">Сповіщення</a>
  <!-- Модальне вікно для сповіщень -->
      <div id="modaln" class="modaln">
        <div class="modaln-content">
        <h3>Сповіщення</h3>
        <div class="notifications-list">
          <!-- Тут будуть відображатися сповіщення -->
          <p>Нове повідомлення: Замовлення №123 оновлено.</p>
          <p>Сповіщення: Ваше замовлення прийнято.</p>
        </div>
        <div class="modaln-actions">
        <a href="#" class="btnn-close">Закрити</a>
      </div>
  </div>
  </div> 
  </div>   
</div>

</div>
  </header>
  <div class="main-header">
    <button class="header_item" onclick="location.href='?filter=active'">Активні замовлення</button>
    <button class="header_item" onclick="location.href='?filter=inactive'">Неактивні замовлення</button>
    <button class="header_item" onclick="location.href='?filter=in_progress'">Замовлення на виконанні</button>
    <button class="header_item" onclick="location.href='?filter=free'">Вільні замовлення</button>
  </div>
  <main class="main">
  <?php while ($row = $result->fetch_assoc()): ?>
    <div class="block_info">
      <p>Назва: <?= htmlspecialchars($row['lable']) ?></p>
      <p>Спеціальність: <?= htmlspecialchars($row['spacsalyty']) ?></p>
      <p>Тип: <?= htmlspecialchars($row['tipe']) ?></p>
      <p>Тип: Tipe</p>
      <p>Статус: <?= htmlspecialchars($row['status']) ?></p>
      <div class="data_price">
        <p>Срок до: <?= htmlspecialchars($row['date']) ?></p>
        <p>Ціна: <?= htmlspecialchars($row['price']) ?> грн</p>
        <?php echo "<a href='infojobclients.php?id_j=" . htmlspecialchars($row['id_j']) . "' class='header_item'>Детальніше</a>"; ?>
      </div>
    </div>
    <?php endwhile; ?>
  </main>

  <div class="obolocka">
    <footer class="footer">
      <img class="logo" src="/img/Freelanshub (1).png" alt="logo">
      <div class="footer-item">Реклама</div>
      <div class="footer-item">Партнерство</div>
      <div class="footer-item">Про нас</div>
      <button class="footer-item" onclick="location.href='pupliczacaz.php'">Зробити замовлення</button>
    </footer>
  </div>
</div>

 
</body>
</html>
<script>
  // Отримання елементів
const btnOpenModalNotifications = document.querySelector('.btn-open-modal-notifications');
const modalNotifications = document.getElementById('modal-notifications');
const btnCloseModal = modalNotifications.querySelector('.btn-close');

// Відкриття модального вікна
btnOpenModalNotifications.addEventListener('click', () => {
  modalNotifications.style.display = 'block';
});

// Закриття модального вікна
btnCloseModal.addEventListener('click', () => {
  modalNotifications.style.display = 'none';
});

// Закриття модального вікна при кліку поза ним
window.addEventListener('click', (event) => {
  if (event.target === modalNotifications) {
    modalNotifications.style.display = 'none';
  }
});

</script>