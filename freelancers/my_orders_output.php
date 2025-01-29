<?php
// Підключення до бази даних
$conn = new mysqli("localhost", "nkloqzcz_root", "Sillver-228", "nkloqzcz_freelans");

if ($conn->connect_error) {
    die("Помилка підключення: " . $conn->connect_error);
}

// Отримання параметрів фільтрації
$type = $_GET['type'] ?? '';
$specialty = $_GET['specialty'] ?? '';
$deadline = $_GET['deadline'] ?? '';
$price_from = $_GET['price_from'] ?? 0;
$price_to = $_GET['price_to'] ?? 1000;

// Формування SQL-запиту з умовами фільтрації
$sql = "SELECT * FROM job WHERE price BETWEEN $price_from AND $price_to";

if (!empty($type)) {
    $sql .= " AND tipe = '$type'";
}
if (!empty($specialty)) {
    $sql .= " AND spacsalyty = '$specialty'";
}

if (!empty($deadline)) {
    $sql .= " AND date <= '$deadline'";
}

if (!empty($status)) {
    $sql .= " AND status != 'Активне'";
}

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        echo "<div class='block_info'>";
        echo "<p>Назва: " . htmlspecialchars($row['lable']) . "</p>";
        echo "<p>Спеціальність: " . htmlspecialchars($row['spacsalyty']) . "</p>";
        echo "<p>Тип: " . htmlspecialchars($row['tipe']) . "</p>";
        echo "<p>Статус: " . htmlspecialchars($row['status']) . "</p>";
        echo "<div class='data_price'>";
        echo "<p>Срок до: " . htmlspecialchars($row['date']) . "</p>";
        echo "<p>Ціна: " . htmlspecialchars($row['price']) . "</p>";
        echo "<a href='infojobmake.php?id_j=" . htmlspecialchars($row['id_j']) . "' class='header_item'>Детальніше</a>"; // Кнопка
        echo "</div>";
        echo "</div>";
    }
} else {
    echo "<p>Немає замовлень за заданими параметрами.</p>";
}

$conn->close();
?>
