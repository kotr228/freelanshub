
<?php
include('db_connect.php');
include('order_detail_data.php');
include('coments.php');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Перевірка, чи сесія активна
  if (session_status() === PHP_SESSION_NONE) {
      session_start();
  }

  // Перевірка авторизації клієнта
  if (!isset($_SESSION['user_id'])) {


  $id_c = $_SESSION['user_id']; // Отримання ID клієнта із сесії
  $id_j = intval($_GET['id_j'] ?? 0);
  $message = trim($_POST['message'] ?? '');

  if ($id_j <= 0 || empty($message)) {
      die("Error: Неправильні або порожні дані.");
  }
}
  try {
      // SQL-запит на додавання повідомлення
      $query = "INSERT INTO chat (id_j, id_c, id_f, message, created_at) VALUES (?, ?, ?, ?, NOW())";
      $stmt = $conn->prepare($query);

      if (!$stmt) {
          throw new Exception("Error preparing statement: " . $conn->error);
      }

      $id_f = 123; // Замінити на відповідне значення або витягувати з сесії
      $stmt->bind_param("iiis", $id_j, $id_c, $id_f, $message);

      if (!$stmt->execute()) {
          throw new Exception("Error executing statement: " . $stmt->error);
      }

      echo "Повідомлення успішно додано.";
  } catch (Exception $e) {
      die("Error: " . $e->getMessage());
  }
}


// Отримання історії чату
function fetchChatHistory($id_j) {
    global $conn;
    $query = "SELECT c.*, cf.file_path FROM chat c LEFT JOIN chat_files cf ON c.id_chat = cf.id_chat WHERE c.id_j = ? AND c.id_c = ? ORDER BY c.created_at ASC";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ii", $id_j, $_SESSION['user_id']);
    $stmt->execute();
    $result = $stmt->get_result();
    $chatHistory = [];
    while ($row = $result->fetch_assoc()) {
        $chatHistory[] = $row;
    }
    return $chatHistory;
}

// Збереження нового повідомлення
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['message'], $_POST['id_j'])) {
        $id_j = intval($_POST['id_j']);
        $message = $_POST['message'];
        $filePath = null;

        // Перевірка наявності файлу
        if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
            if (!is_dir('uploads')) {
                mkdir('uploads', 0777, true);
            }

            $uploadDir = 'uploads/';
            $fileName = time() . '-' . basename($_FILES['file']['name']);

            // Перевірка дозволених форматів файлів
            $allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'docx'];
            $fileExtension = pathinfo($fileName, PATHINFO_EXTENSION);
            if (!in_array(strtolower($fileExtension), $allowedExtensions)) {
                die("Error: Заборонений формат файлу.");
            }

            $filePath = $uploadDir . $fileName;
            if (!move_uploaded_file($_FILES['file']['tmp_name'], $filePath)) {
                die("Error: Не вдалося завантажити файл.");
            }
        }
        exit;
    }

}if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  var_dump($_POST);
}
?>

<!DOCTYPE html>
<html lang="UK">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Смотреть заказіь</title>
  <link rel="stylesheet" href="style.css/infojobclients.css">
  <style>
    .block_chat {
      border: 1px solid #ccc;
      padding: 10px;
      border-radius: 5px;
    }

    .chat_area {
      height: 300px;
      overflow-y: scroll;
      background-color: #f9f9f9;
      margin-bottom: 10px;
      padding: 10px;
      border: 1px solid #ddd;
    }

    .chat_input_area {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .chat_input {
      flex-grow: 1;
      height: 40px;
      resize: none;
      padding: 5px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }

    .file_input {
      border: none;
    }

    .send_button {
      background-color: #007bff;
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
    }

    .send_button:hover {
      background-color: #0056b3;
    }

    .chat_message {
      margin-bottom: 10px;
    }

    .chat_message p {
      margin: 0;
    }

    .chat_message small {
      color: #888;
    }
  </style>
</head>
<body class="body">
<div class="site">
  <header class="header">
    <div class="header_item">Цінова політика</div>
    <div class="header_item">Політика конфедеційності</div>
    <div class="header_item">Служба підтримки</div>
    <div class="header_item">На головну</div>
    <div class="header_user-info">
      <p class="header_user-name">User</p>
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
      <div class="chat_area"></div>
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
      <div class="footer-item">Зробити замовлення</div>
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
