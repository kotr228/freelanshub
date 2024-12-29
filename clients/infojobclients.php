<?php
include('db_connect.php');
include('order_detail_data.php');
include('coments.php');

if (session_status() === PHP_SESSION_NONE) {
  session_start();
}

// Перевірка, чи встановлено user_id у сесії
if (!isset($_SESSION['user_id']) || empty($_SESSION['user_id'])) {
  die("Error: user_id не встановлено або порожній.");
}

$id_c = $_SESSION['user_id']; // Встановлюємо $id_c як user_id із сесії

// Обробка форми для вставки повідомлення
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  if (isset($_POST['id_j'], $_POST['message'], $_POST['id_f'])) {
      $id_j = intval($_POST['id_j']);
      $id_f = intval($_POST['id_f']);
      $message = trim($_POST['message']);

      // Перевірка значень
      var_dump($id_j, $id_f, $message);

      // Запит до бази даних
      $query = "INSERT INTO chat (id_j, id_c, id_f, message, created_at) VALUES (?, ?, ?, ?, NOW())";
      $stmt = $conn->prepare($query);
      $stmt->bind_param("iiis", $id_j, $id_c, $id_f, $message);
      $stmt->execute();

      echo "Повідомлення успішно збережено.";
  } 
}

// Отримання історії чату
function fetchChatHistory($id_j) {
    global $conn;
    $query = "SELECT c.*, cf.file_path FROM chat c LEFT JOIN chat_files cf ON c.id_chat = cf.id_chat WHERE c.id_j = ? AND c.id_c = ? ORDER BY c.created_at ASC";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ii", $id_j, $_SESSION['client_id']);
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

        // Додавання повідомлення до БД
        $query = "INSERT INTO chat (id_j, id_c, message, created_at) VALUES (?, ?, ?, NOW())";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("iis", $id_j, $id_c, $message);
        $stmt->execute();

        if ($filePath) {
            $chatId = $conn->insert_id;
            $query = "INSERT INTO chat_files (id_chat, file_name, file_path) VALUES (?, ?, ?)";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("iss", $chatId, basename($filePath), $filePath);
            $stmt->execute();
        }

        echo json_encode(['success' => true]);
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
          <input type="hidden" name="id_j" value="<?php echo $order['id_j']; ?>">
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
      <div class="chat_area" id="chatArea">
      <?php
$chatHistory = fetchChatHistory($order['id_j']);
foreach ($chatHistory as $message) {
    echo "<div class='chat_message'>";
    echo "<p>" . nl2br(htmlspecialchars($message['message'])) . "</p>"; // Підтримка нових рядків
    if (!empty($message['file_path'])) {
        echo "<p><strong>Файл:</strong> <a href='" . htmlspecialchars($message['file_path']) . "' target='_blank' download>" . htmlspecialchars(basename($message['file_path'])) . "</a></p>"; // Додано атрибут download
    }
    echo "<small>" . htmlspecialchars($message['created_at']) . "</small>";
    echo "</div>";
}
?>
      </div>
      <div class="chat_input_area">
        <form id="chatForm" action="" method="POST" enctype="multipart/form-data">
          <textarea class="chat_input" name="message" id="messageInput" placeholder="Напишіть повідомлення..."></textarea>
          <input type="hidden" name="id_j" value="<?php echo $order['id_j']; ?>">
          <input type="file" name="file" id="fileInput" class="file_input">
          <button class="send_button" type="submit">Надіслати</button>
        </form>
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
</body>
</html>
