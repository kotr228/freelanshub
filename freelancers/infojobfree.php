<?php
include('db_connect.php');
include('order_detail_data.php');
?>

<!DOCTYPE html>
<html lang="UK">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Делать заказы</title>
  <link rel="stylesheet" href="style.css/infojobfree.css">
</head>
<body class="body">
<div class="site">
  <header class="header">
    <div class="header_item">Цінова політика</div>
    <div class="header_item">Політика конфедеційності</div>
    <div class="header_item">Служба підтримки</div>
    <button class="header_item" onclick="location.href='delat_zakazy.php'">На головну</button>
    <?php include('get_user.php'); ?>
    <div class="header_user-info">
      <p class="header_user-name"><?php echo htmlspecialchars($user_name); ?></p>
      <a href="#">
        <img class="logo-user" src="img/png-transparent-computer-icons-user-profile-user-account-avatar-heroes-silhouette-black-thumbnail.png" alt="">
      </a>
      <div class="dropdown-menu">
        <button class="dropdown-item">Змінити аккаунт</button>
        <button class="dropdown-item">Вийти з аккаунту</button>
        <button class="dropdown-item" onclick="location.href='correcting-info.php'">Налаштування аккаунту</button>
      </div>
    </div>
  </header>
  <main class="main">
    <div class="block_main ch">
      <div class="block-info-file">
        <div class="block_info ch">
          <p>Назва: <?php echo htmlspecialchars($order['lable']); ?></p>
          <p>Спеціальність: <?php echo htmlspecialchars($order['spacsalyty']); ?></p>
          <p>Тип: <?php echo htmlspecialchars($order['tipe']); ?></p>
          <p>Статус: <?php echo htmlspecialchars($order['status']); ?></p>
          <div class="data_price">
            <p>Срок до: <?php echo htmlspecialchars($order['date']); ?></p>
            <p>Ціна: <?php echo htmlspecialchars($order['price']); ?> грн</p>
          </div>
        </div>
        <div class="block_files ch">
          <p>Вкладені файли:</p>
          <div class="files_area"></div>
        </div>
      </div>
      <div class="block_comments">
        <div class="com">
          <p>Коментарі:</p>
          <textarea class="coment"></textarea>
        </div>
        
       <a class="vzatysa" href="take_order.php">Взятись <br>за замовлення</a>

      </div>
    </div>
    <div class="block_chat ch">
      <p>Чат з замовником:</p>
      <div class="chat_area"></div>
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

 
</body>
</html>
