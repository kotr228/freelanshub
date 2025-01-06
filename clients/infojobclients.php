<?php
include('db_connect.php');
include('order_detail_data.php');
include('coments.php');

// Перевірка, чи сесія активна
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Перевірка авторизації клієнта
if (!isset($_SESSION['user_id'])) {
    die("Error: Ви не авторизовані.");
}

$id_c = $_SESSION['user_id']; // Отримання ID клієнта із сесії
$id_j = intval($_GET['id_j'] ?? 0);

if ($id_j <= 0) {
    die("Error: Неправильний ID замовлення.");
}

// Отримання історії чату (для першого завантаження сторінки)
$stmt = $conn->prepare("SELECT message, created_at FROM chat WHERE id_j = ? AND id_c = ? ORDER BY created_at ASC");
$stmt->bind_param("ii", $id_j, $id_c);
$stmt->execute();
$result = $stmt->get_result();
$chatHistory = $result->fetch_all(MYSQLI_ASSOC);
$stmt->close();
?>

<!DOCTYPE html>
<html lang="UK">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Смотреть закази</title>
  <link rel="stylesheet" href="style.css/infojobclients.css">
</head>
<body class="body">
<div class="site">
  <header class="header">
    <div class="header_item">Цінова політика</div>
    <div class="header_item">Політика конфедеційності</div>
    <div class="header_item">Служба підтримки</div>
    <div class="header_item">На головну</div>
    <?php include('get_user.php'); ?>
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
        <div class="block_chat ch">
            <p>Чат з замовником:</p>
            <div class="chat_area" id="chatArea">
    <?php if (empty($chatHistory)): ?>
        <p>Напишіть ваше перше повідомлення</p>
    <?php else: ?>
        <?php foreach ($chatHistory as $chat): ?>
            <div class="chat_message">
                <span class="chat_time"><?php echo htmlspecialchars($chat['created_at']); ?></span>
                <p class="chat_text"><?php echo htmlspecialchars($chat['message']); ?></p>
            </div>
        <?php endforeach; ?>
    <?php endif; ?>
</div>
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
      <div class="footer-item">Зробити замовлення</div>
    </footer>
  </div>
</div>
<script>
document.getElementById('sendButton').addEventListener('click', () => {
  const messageInput = document.getElementById('messageInput');
  const fileInput = document.getElementById('fileInput');
  const chatArea = document.getElementById('chatArea');

  const message = messageInput.value.trim();
  if (!message && !fileInput.files.length) {
    alert('Введіть повідомлення або прикріпіть файл!');
    return;
  }

  const formData = new FormData();
  formData.append('message', message);
  if (fileInput.files.length) {
    formData.append('file', fileInput.files[0]);
  }
  formData.append('id_j', <?php echo $id_j; ?>);

  fetch('add_message.php', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      const newMessage = document.createElement('div');
      newMessage.classList.add('chat_message');
      newMessage.innerHTML = `
        <span class="chat_time">${new Date().toLocaleString()}</span>
        <p class="chat_text">${message}</p>
      `;
      chatArea.appendChild(newMessage);
      chatArea.scrollTop = chatArea.scrollHeight;
      messageInput.value = '';
      fileInput.value = '';
    } else {
      alert(data.error || 'Не вдалося надіслати повідомлення');
    }
  })
  .catch(error => console.error('Error:', error));
});

// Автоматичне оновлення чату
let lastMessageCount = 0; // Для збереження кількості попередніх повідомлень

setInterval(() => {
  fetch('get_messages.php?id_j=<?php echo $id_j; ?>')
    .then(response => response.json())
    .then(data => {
      const chatArea = document.getElementById('chatArea');
      chatArea.innerHTML = ''; // Очищуємо попередній вміст

      // Оновлюємо вміст чату
      data.messages.forEach(chat => {
        const newMessage = document.createElement('div');
        newMessage.classList.add('chat_message');
        newMessage.innerHTML = `
          <span class="chat_time">${chat.created_at}</span>
          <p class="chat_text">${chat.message}</p>
        `;
        chatArea.appendChild(newMessage);
      });

      // Прокручуємо до останнього повідомлення
      chatArea.scrollTop = chatArea.scrollHeight;

      // Перевірка на нові повідомлення
      const currentMessageCount = data.messages.length;
      if (currentMessageCount > lastMessageCount) {
        const newMessages = currentMessageCount - lastMessageCount;

        // Виводимо сповіщення
        alert(`У вас ${newMessages} нове(их) повідомлення!`);
      }

      // Оновлюємо кількість повідомлень
      lastMessageCount = currentMessageCount;
    })
    .catch(error => console.error('Error:', error));
}, 1500); // Оновлюємо чат кожні 1.5 секунди

</script>

</body>
</html>
