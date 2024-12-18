<?php
include('db_connect.php');
include('order_detail_data.php');
include('chat.php');
include('coments.php');

?>

<!DOCTYPE html>
<html lang="UK">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Делать заказы</title>
  <link rel="stylesheet" href="style.css/infojobfree.css">
  <script>
        // Функція для завантаження чату
        function loadChat() {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "load_chat.php?order_id=<?php echo $order_id; ?>", true);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    document.getElementById("chat-box").innerHTML = xhr.responseText;
                }
            };
            xhr.send();
        }

        // Запуск оновлення чату кожні 2 секунди
        setInterval(loadChat, 2000);

        // Надсилання повідомлення
        function sendMessage() {
            const message = document.getElementById("message").value;
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "send_message.php", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onload = function () {
                if (xhr.status === 200) {
                    document.getElementById("message").value = "";
                    loadChat();
                }
            };
            xhr.send("order_id=<?php echo $order_id; ?>&message=" + encodeURIComponent(message));
        }
    </script>
</head>
<body class="body" onload="loadChat()">
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
          <div class="files_area">
          <form action="upload_file.php" method="post" enctype="multipart/form-data">
            <input class="vzatysa1" type="hidden" name="id_j" value="<?php echo $order['id_j']; ?>">
            <input class="vzatysa1" type="file" name="file" id="file" required>
            <button class="vzatysa1" type="submit">Завантажити файл</button>
          </form>
          <?php include_once 'visible_file.php'; ?>
          </div>
        </div>
      </div>
      <div class="block_comments">
        <div class="com">
          <p>Коментарі:</p>
          <textarea class="coment" rows="5" cols="50" readonly><?php echo $description; ?></textarea>

        </div>
        
       <a class="vzatysa" href="take_order.php">Взятись <br>за замовлення</a>

      </div>
    </div>
    <div class="block_chat ch">
      <p>Чат з замовником:</p>
      <div class="chat_area" id="chat-box"></div>

      <!-- Форма для надсилання повідомлення -->
      <textarea class="vzatysa1" id="message" rows="3" cols="50" placeholder="Введіть ваше повідомлення..."></textarea><br>
      <button class="vzatysa1" onclick="sendMessage()">Надіслати</button>
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
