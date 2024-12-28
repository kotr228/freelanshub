<?php
include('db_connect.php');
?>

<!DOCTYPE html>
<html lang="UK">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Смотреть заказіь</title>
  <link rel="stylesheet" href="style.css/infojobclients.css">
  
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
  <main class="main">
    <div class="block_main ch">
      <div class="block-info-file">
        <div class="block_info ch">
          <p>Назва: Label</p>
          <p>Спеціальність: Spacsalyty</p>
          <p>Тип: Tipe</p>
          <p>Статус: Status</p>
          <div class="data_price">
            <p>Срок до: date</p>
            <p>Ціна: price</p>
          </div>
        </div>
        <div class="block_files ch">
          <p>Вкладені файли:</p>
          <div class="files_area"></div>
        </div>
      </div>
      <div class="block_comments">
        <p>Коментарі:</p>
        <textarea class="coment"></textarea>
      </div>
    </div>
    <div class="block_chat ch">
      <p>Чат з замовником:</p>
      <div class="chat_area" id="chatArea"></div>
      <div class="chat_input_area">
        <textarea class="chat_input" id="messageInput" placeholder="Напишіть повідомлення..."></textarea>
        <input type="file" id="fileInput" class="file_input">
        <button class="send_button" id="sendButton">Надіслати</button>
      </div>
    </div>
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

<script>
  document.getElementById('sendButton').addEventListener('click', () => {
    const messageInput = document.getElementById('messageInput');
    const fileInput = document.getElementById('fileInput');
    const chatArea = document.getElementById('chatArea');

    // Отримуємо текст повідомлення
    const message = messageInput.value.trim();
    if (!message && !fileInput.files.length) {
      alert('Введіть повідомлення або прикріпіть файл!');
      return;
    }

    // Відображаємо повідомлення
    const newMessage = document.createElement('div');
    newMessage.classList.add('chat_message');
    newMessage.innerHTML = `
      <p>${message || "Файл прикріплено"}</p>
      <small>${new Date().toLocaleString()}</small>
    `;

    // Якщо прикріплений файл, додаємо посилання і кнопку для відкриття
    if (fileInput.files.length) {
      const file = fileInput.files[0];
      const fileUrl = URL.createObjectURL(file);
      newMessage.innerHTML += `
        <p><strong>Файл:</strong> ${file.name}</p>
        <button onclick="window.open('${fileUrl}', '_blank')">Відкрити файл</button>
      `;
    }

    chatArea.appendChild(newMessage);
    chatArea.scrollTop = chatArea.scrollHeight;

    // Очищуємо поле вводу
    messageInput.value = '';
    fileInput.value = '';

    // Відправляємо дані на сервер (за потреби)
    /*
    fetch('/api/messages', {
      method: 'POST',
      body: JSON.stringify({ message, file: fileInput.files[0] }),
      headers: { 'Content-Type': 'application/json' }
    });
    */
  });
</script>
</body>
</html>
