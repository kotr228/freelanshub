<?php
include('db_connect.php');
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
        <button class="dropdown-item">Налаштування аккаунту</button>
      </div>
    </div>
  </header>
  <div class="main-header">
    <div class="header_item">Активні замовлення</div>
    <div class="header_item">Неактивні замовлення</div>
    <div class="header_item">Замовлення на виконанні</div>
    <div class="header_item">Вільні замовлення</div>
  </div>
  <main class="main">
    <div class="block_info">
      <p>Назва: Label</p>
      <p>Спеціальність</p>
      <p>Spacsalyty</p>
      <p>Тип: Tipe</p>
      <p>Статус: Status</p>
      <div class="data_price">
        <p>Срок до: data</p>
        <p>Цена: price</p>
      </div>
    </div>
  </main>

  <div class="obolocka">
    <footer class="footer">
      <img class="logo" src="/img/Freelanshub (1).png" alt="logo">
      <div class="footer-item">Реклама</div>
      <div class="footer-item">Партнерство</div>
      <div class="footer-item">Про нас</div>
      <div class="footer-item">Зробити замовлення</div>
    </footer>
  </div>
</div>

 
</body>
</html>