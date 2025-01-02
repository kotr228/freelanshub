
<?php
include('db_connect.php');
include('order_detail_data.php');
include('coments.php');
?>

<!DOCTYPE html>
include('db_connect.php');
    <div class="header_item">Політика конфедеційності</div>
    <div class="header_item">Служба підтримки</div>
    <div class="header_item">На головну</div>
    <?php include('get_user.php'); ?>
    <div class="header_user-info">
      <p class="header_user-name"><?php echo htmlspecialchars($user_name); ?></p>
      <a href="#">
    <div class="block_main ch">
      <div class="block-info-file">
        <div class="block_info ch">
          <p>Назва: Label</p>
          <p>Спеціальність: Spacsalyty</p>
          <p>Тип: Tipe</p>
          <p>Статус: Status</p>
          <p>Назва: <?php echo htmlspecialchars($order['lable']); ?></p>
          <p>Спеціальність: <?php echo htmlspecialchars($order['spacsalyty']); ?></p>
          <p>Тип: <?php echo htmlspecialchars($order['tipe']); ?></p>
          <p>Статус: <?php echo htmlspecialchars($order['status']); ?></p>
          <div class="data_price">
            <p>Срок до: date</p>
            <p>Ціна: price</p>
            <p>Срок до: <?php echo htmlspecialchars($order['date']); ?></p>
            <p>Ціна: <?php echo htmlspecialchars($order['price']); ?> грн</p>
          </div>
        </div>
        <div class="block_files ch">
          <p>Вкладені файли:</p>
          <div class="files_area"></div>
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
