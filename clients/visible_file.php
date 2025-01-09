<?php
// Підключення до бази даних
include('db_connect.php');
// Перевірка параметра 'id_j' у URL
$id_j = intval($_GET['id_j'] ?? 0);

// Перевірка, чи передано коректний ID
if ($id_j <= 0) {
    echo "<p>Невірний ID замовлення.</p>";
    exit;
}

// Підготовка SQL-запиту для отримання файлів
$stmt = $conn->prepare("SELECT file_name, file_path FROM files WHERE id_j = ?");
if ($stmt === false) {
    echo "<p>Помилка підготовки запиту: " . htmlspecialchars($conn->error) . "</p>";
    exit;
}

$stmt->bind_param("i", $id_j);
$stmt->execute();
$result = $stmt->get_result();

// Виведення результатів
if ($result->num_rows > 0) {
    echo '<div class="files_area">';
    while ($file = $result->fetch_assoc()) {
        echo '<div class="file_item">';
        echo '<a href="' . htmlspecialchars($file['file_path']) . '" download>' . htmlspecialchars($file['file_name']) . '</a>';
        echo '</div>';
    }
    echo '</div>';
} else {
    echo "<p>Файлів немає.</p>";
}

$stmt->close();
?>
