<?php
// Підключення до бази даних
include('db_connect.php');

// Перевірка наявності параметра 'order_id' в URL
if (isset($_GET['id_j'])) {
    $order_id = $_GET['id_j'];  // Отримуємо id замовлення

    // Запит для отримання файлів
    $query = "SELECT file_name, file_path FROM files WHERE id_j = ?";
    $stmt = $conn->prepare($query);
    
    if ($stmt === false) {
        echo "Помилка підготовки запиту: " . $conn->error;
        exit;
    }

    $stmt->bind_param("i", $order_id);
    $stmt->execute();
    $result = $stmt->get_result();

    // Перевірка, чи є файли
    if ($result->num_rows > 0) {
        echo "<form action='' method='post' enctype='multipart/form-data'>";
        echo "Файли знайдено: " . $result->num_rows;
        echo "<div class='files_area'>";
        
        // Виведення файлів у формі
        while ($file = $result->fetch_assoc()) {
            $file_path = 'uploads/' . $file['file_path'];
            echo "<div class='file_item'>";
            echo "<label for='file_{$file['file_name']}'>" . htmlspecialchars($file['file_name']) . "</label>";
            echo "<input type='checkbox' name='files[]' value='{$file_path}' id='file_{$file['file_name']}'>";
            echo "</div>";
        }
        
        echo "</div>";
        echo "</form>";
    } else {
        echo "Файли не знайдено.";
    }
} else {
    echo "Не вказано 'order_id' у URL.";
}
?>
