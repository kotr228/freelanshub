<?php
// Підключення до бази даних
$conn = new mysqli("localhost", "nkloqzcz_root", "Sillver-228", "nkloqzcz_freelans");

if ($conn->connect_error) {
    die("Помилка підключення: " . $conn->connect_error);
}

// Отримання параметрів фільтрації
$type = $_GET['type'] ?? null;
$specialty = $_GET['specialty'] ?? null;
$deadline = $_GET['deadline'] ?? null;
$price_from = isset($_GET['price_from']) && is_numeric($_GET['price_from']) ? (float)$_GET['price_from'] : null;
$price_to = isset($_GET['price_to']) && is_numeric($_GET['price_to']) ? (float)$_GET['price_to'] : null;

if (($type === null) && ($specialty === null) && ($deadline === null) && ($price_from === null) && ($price_to === null)){
    $sql = "SELECT * FROM job";
} else {
    // Формування SQL-запиту з умовами фільтрації
$sql = "SELECT * FROM job WHERE price BETWEEN $price_from AND $price_to";

if (!empty($type)) {
    $sql .= " AND tipe = '" . $conn->real_escape_string($type) . "'";
}

if (!empty($specialty)) {
    $sql .= " AND spacsalyty = '" . $conn->real_escape_string($specialty) . "'";
}

if (!empty($deadline)) {
    $sql .= " AND date >= '" . $conn->real_escape_string($deadline) . "'";
}
}

$sql .= " AND id_f IS NULL";

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
        echo "<a href='infojobfree.php?id_j=" . htmlspecialchars($row['id_j']) . "' class='header_item'>Детальніше</a>"; // Кнопка
        echo "</div>";
        echo "</div>";
    }
} else {
    echo "<p>Немає замовлень за заданими параметрами.</p>";
}

$conn->close();
?>
