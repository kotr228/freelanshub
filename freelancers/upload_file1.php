<?php
include('db_connect.php'); // Підключення до бази даних

// Перевіряємо, чи файл був завантажений
if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK && isset($_POST['id_j'])) {
    $id_j = intval($_POST['id_j']); // ID замовлення
    $uploadDir = 'uploads/'; // Папка для збереження файлів

    // Отримуємо інформацію про файл
    $fileName = basename($_FILES['file']['name']);
    $fileTmpPath = $_FILES['file']['tmp_name'];
    $fileSize = $_FILES['file']['size'];
    $fileType = $_FILES['file']['type'];

    // Перевірка дозволених типів файлів
    $allowedExtensions = ['jpg', 'png', 'pdf', 'docx', 'txt'];
    $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

    if (!in_array($fileExtension, $allowedExtensions)) {
        die("Помилка: Тип файлу .$fileExtension не дозволений.");
    }

    // Генеруємо унікальне ім'я файлу
    $newFileName = uniqid('file_', true) . '.' . $fileExtension;
    $destination = $uploadDir . $newFileName;

    // Переміщуємо файл у папку
    if (move_uploaded_file($fileTmpPath, $destination)) {
        // Зберігаємо інформацію про файл у базу даних
        $query = "INSERT INTO files (id_j, file_name, file_path) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param('iss', $id_j, $fileName, $destination);
        if ($stmt->execute()) {
            header("Location: infojobmake.php?id_j=" . htmlspecialchars($_SESSION['id_j']));
        } else {
            echo "Помилка при збереженні файлу в базу даних.";
        }
    } else {
        echo "Помилка завантаження файлу.";
    }
} else {
    echo "Неправильний запит.";
}
?>
