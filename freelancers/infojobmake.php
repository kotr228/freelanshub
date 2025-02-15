<?php
include('db_connect.php');
include('order_detail_data.php');
include('chat.php');
include('coments.php');
$order_id = $_GET['id_j'];
$_SESSION['order_id'] = $order_id;
// Перевірка, чи сесія активна
if (session_status() === PHP_SESSION_NONE) {
  session_start();
}

// Перевірка авторизації клієнта
if (!isset($_SESSION['user_id_f'])) {
  die("Error: Ви не авторизовані!");
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
  <title>Делать заказы</title>
  <link rel="stylesheet" href="style.css/infojobfree.css">
  <script>
        // Функція для завантаження чату
        function loadChat() {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "load_chat.php?id_j=<?php echo $order_id; ?>", true);
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
    const message = document.getElementById("message").value.trim();
    if (message) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "send_massage.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onload = function () {
            console.log("Статус сервера:", xhr.status);
            console.log("Відповідь сервера:", xhr.responseText);
            if (xhr.status === 200) {
                document.getElementById("message").value = "";
                loadChat();
            } else {
                alert("Помилка: " + xhr.responseText);
            }
        };
        xhr.onerror = function () {
            alert("Помилка з'єднання із сервером.");
        };
        xhr.send("id_j=<?php echo $order_id; ?>&message=" + encodeURIComponent(message));
    } else {
        alert("Введіть повідомлення перед надсиланням.");
    }
}


    </script>
</head>
<body class="body" onload="loadChat()">
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
    <button class="header_item" onclick="location.href='my_orders.php'">На попередню</button>
    <?php include('get_user.php'); ?>
    <div class="header_user-info">
      <p class="header_user-name"><?php echo htmlspecialchars($user_name); ?></p>
      <a href="#">
        <img class="logo-user" src="img/png-transparent-computer-icons-user-profile-user-account-avatar-heroes-silhouette-black-thumbnail.png" alt="">
      </a>
      <div class="dropdown-menu">
        <button class="dropdown-item" onclick="location.href='loginfreelans.html'">Змінити аккаунт</button>
        <button class="dropdown-item" onclick="location.href='registrfreelans.html'">Вийти з аккаунту</button>
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
          <form action="upload_file1.php" method="post" enctype="multipart/form-data">
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
        
       
      <?php
       $status = $order['status'] ?? '';

      // Перевіряємо, чи статус "Активне"
      if ($status === 'S1'): ?>
      <a class="vzatysa" href="make_order.php">Позначити <br>як виконане</a>
      <?php endif; ?>


      </div>
    </div>
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
      <img class="logo" src="img/Freelanshub (1).png" alt="logo">
      <div class="footer-item">Реклама</div>
      <div class="footer-item">Партнерство</div>
      <div class="footer-item">Про нас</div>
    </footer>
  </div>
</div>
//Додавання повідомлення в чаи в баззу даних далі на реакті 
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
setInterval(() => {
  fetch('get_messages.php?id_j=<?php echo $id_j; ?>')
    .then(response => response.json())
    .then(data => {
      const chatArea = document.getElementById('chatArea');
      chatArea.innerHTML = ''; // Очищуємо попередній вміст
      data.messages.forEach(chat => {
        const newMessage = document.createElement('div');
        newMessage.classList.add('chat_message');
        newMessage.innerHTML = `
          <span class="chat_time">${chat.created_at}</span>
          <p class="chat_text">${chat.message}</p>
        `;
        chatArea.appendChild(newMessage);
      });
      chatArea.scrollTop = chatArea.scrollHeight; // Прокручуємо до останнього повідомлення
    })
    .catch(error => console.error('Error:', error));
}, 1500); // Оновлюємо чат кожні 5 секунд
</script>
 
</body>
</html>
