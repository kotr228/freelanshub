<?php
include('db_connect.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id_j = intval($_POST['id_j']);
    $uploadDir = 'uploads/'; // Каталог для збереження файлів
    $uploadFile = $uploadDir . basename($_FILES['file']['name']);

    // Перевіряємо, чи є помилки при завантаженні
    if ($_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        die("Помилка завантаження файлу.");
    }

    // Переміщаємо файл у вказану директорію
    if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadFile)) {
        // Зберігаємо інформацію про файл у базу даних
        $stmt = $conn->prepare("INSERT INTO files (id_j, file_name, file_path) VALUES (?, ?, ?)");
        $stmt->bind_param("iss", $id_j, $_FILES['file']['name'], $uploadFile);
        if ($stmt->execute()) {
            echo "Файл успішно завантажено!";
        } else {
            echo "Помилка запису в базу даних.";
        }
        $stmt->close();
    } else {
        echo "Не вдалося перемістити файл.";
    }
} else {
    echo "Невірний метод запиту.";
}
?>
