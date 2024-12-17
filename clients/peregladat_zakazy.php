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
    <div class="header_item">Цінова політика</div>
    <div class="header_item">Політика конфедеційності</div>
    <div class="header_item">Служба підтримки</div>
    <div class="header_item">На головну</div>
    <div class="header_user-info">
      <p class="header_user-name"><?php echo htmlspecialchars($user_name); ?></p>
      <a href="#">
        <img class="logo-user" src="/img/png-transparent-computer-icons-user-profile-user-account-avatar-heroes-silhouette-black-thumbnail.png" alt="">
      </a>
      <div class="dropdown-menu">
        <button class="dropdown-item">Змінити аккаунт</button>
        <button class="dropdown-item">Вийти з аккаунту</button>
        <button class="dropdown-item" onclick="location.href='correcting-info.php'">Налаштування аккаунту</button>
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