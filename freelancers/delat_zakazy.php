<?php
include('db_connect.php');
// Підключення до бази даних
$conn = new mysqli("localhost", "root", "Sillver-228", "freelans");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$conn->set_charset("utf8");

// Ініціалізація фільтрів
$type = $_GET['type'] ?? '';
$specialty = $_GET['specialty'] ?? '';
$deadline = $_GET['deadline'] ?? '';
$price_from = $_GET['price-from'] ?? '';
$price_to = $_GET['price-to'] ?? '';

// Формування SQL-запиту з фільтрами
$query = "SELECT lable, spacsalyty, tipe, status, price, DATE_FORMAT(date, '%d.%m.%Y') AS formatted_date 
          FROM job WHERE status = 'open'";

$conditions = [];

if (!empty($type)) {
    $conditions[] = "tipe = '" . $conn->real_escape_string($type) . "'";
}
if (!empty($specialty)) {
    $conditions[] = "spacsalyty = '" . $conn->real_escape_string($specialty) . "'";
}
if (!empty($deadline)) {
    $conditions[] = "DATE(date) <= '" . $conn->real_escape_string($deadline) . "'";
}
if (!empty($price_from)) {
    $conditions[] = "price >= " . (float)$price_from;
}
if (!empty($price_to)) {
    $conditions[] = "price <= " . (float)$price_to;
}

if (count($conditions) > 0) {
    $query .= " AND " . implode(" AND ", $conditions);
}

$result = $conn->query($query);

$orders = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Каталог замовлень</title>
  <link rel="stylesheet" href="style.css/delat_zakazu.css">
</head>
<body class="body">
<div class="site">
  <header class="header">
    <div class="header_item">Цінова політика</div>
    <div class="header_item">Політика конфіденційності</div>
    <div class="header_item">Служба підтримки</div>
    <div class="header_item">На головну</div>
    <div class="header_user-info">
      <p class="header_user-name"><?php echo htmlspecialchars($user_name); ?></p> <!-- Виведення імені користувача -->
      <a href="#">
        <img class="logo-user" src="img/png-transparent-computer-icons-user-profile-user-account-avatar-heroes-silhouette-black-thumbnail.png" alt="">
      </a>
      <div class="dropdown-menu">
        <button class="dropdown-item">Змінити аккаунт</button>
        <button class="dropdown-item">Вийти з аккаунту</button>
        <button class="dropdown-item">Налаштування аккаунту</button>
      </div>
    </div>
  </header>

  <main class="main">
    <div class="block-parametrs">
      <form method="GET" action="orders.php">
        <div class="style_pole">
          <label for="type">Тип:</label>
          <select id="type" name="type" class="input">
            <option value="" disabled selected></option>
            <option value="type1" <?= $type == 'type1' ? 'selected' : '' ?>>Одноразова робота</option>
            <option value="type2" <?= $type == 'type2' ? 'selected' : '' ?>>Робота на певний період</option>
            <option value="type2" <?= $type == 'type2' ? 'selected' : '' ?>>Робота на довгий період часу</option>
          </select>
        </div>

        <div class="style_pole">
          <label for="specialty">Спеціальність:</label>
          <select id="specialty" name="specialty" class="input">
            <option value="" disabled selected></option>
            <option value="spec1" <?= $specialty == 'spec1' ? 'selected' : '' ?>>Програмування</option>
            <option value="spec2" <?= $specialty == 'spec2' ? 'selected' : '' ?>>Студентські роботи</option>
          </select>
        </div>

        <div class="style_pole">
          <label for="deadline">Дедлайн:</label>
          <input class="input-data" type="date" id="deadline" name="deadline" value="<?= htmlspecialchars($deadline) ?>" />
        </div>

        <div class="style_pole">
          <p>Ціна</p>
          <label for="price-from">Від:</label>
          <input class="input-price" type="number" id="price-from" name="price-from" value="<?= htmlspecialchars($price_from) ?>" placeholder="0" />
      
          <label for="price-to">До:</label>
          <input class="input-price" type="number" id="price-to" name="price-to" value="<?= htmlspecialchars($price_to) ?>" placeholder="1000" />
        </div>

        <!-- <button class="header_item" type="submit">Фільтрувати</button> -->
      </form>
    </div>

    <div class="orders">
      <?php /*if (count($orders) > 0): ?>
        <?php foreach ($orders as $order): ?>
          <div class="block_info">
            <p>Назва: <?= htmlspecialchars($order['lable']) ?></p>
            <p>Спеціальність: <?= htmlspecialchars($order['spacsalyty']) ?></p>
            <p>Тип: <?= htmlspecialchars($order['tipe']) ?></p>
            <p>Статус: <?= htmlspecialchars($order['status']) ?></p>
            <div class="data_price">
              <p>Срок до: <?= $order['formatted_date'] ?></p>
              <p>Ціна: <?= $order['price'] ?> грн</p>
            </div>
          </div>
        <?php endforeach; ?>
      <?php else: */?>
        <div class="block_info">
      <?php include 'orders.php'; ?>
    </div>
      <?php /*endif;*/?>
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
