<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require 'conn.php'; // Підключення до бази даних

// Перевірка, чи був відправлений файл
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['new_avatar'])) {
    // Ідентифікатор користувача
    $userId = $_SESSION['user_id']; // Передбачено, що ID користувача зберігається в сесії

    // Директорія для збереження аватарів
    $uploadDir = 'uploads/avatars/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // Дані завантаженого файлу
    $file = $_FILES['new_avatar'];
    $fileName = basename($file['name']);
    $fileTmpName = $file['tmp_name'];
    $fileSize = $file['size'];
    $fileError = $file['error'];
    $fileType = $file['type'];

    // Дозволені формати файлів
    $allowed = ['jpg', 'jpeg', 'png', 'gif'];
    $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

    if (in_array($fileExt, $allowed)) {
        if ($fileError === 0) {
            if ($fileSize <= 2 * 1024 * 1024) { // Обмеження: 2MB
                // Унікальне ім'я файлу
                $newFileName = uniqid('avatar_', true) . '.' . $fileExt;
                $fileDestination = $uploadDir . $newFileName;

                // Переміщення файлу в директорію
                if (move_uploaded_file($fileTmpName, $fileDestination)) {
                    // Оновлення запису в базі даних
                    $sql = "UPDATE freelans.freelanser_akks SET avatar = ? WHERE id_f = ?";
                    $stmt = $conn->prepare($sql);
                    $stmt->bind_param('si', $fileDestination, $userId);

                    if ($stmt->execute()) {
                        $_SESSION['avatar_path'] = $fileDestination; // Оновлення сесії
                        header('Location: correcting-info.php?success=Аватар оновлено');
                        exit();
                    } else {
                        unlink($fileDestination); // Видалення файлу у разі помилки
                        die('Помилка бази даних.');
                    }
                } else {
                    die('Помилка завантаження файлу.');
                }
            } else {
                die('Файл занадто великий. Максимальний розмір: 2MB.');
            }
        } else {
            die('Помилка під час завантаження файлу.');
        }
    } else {
        die('Недопустимий формат файлу. Дозволені формати: JPG, JPEG, PNG, GIF.');
    }
} else {
    die('Файл не було завантажено.');
}
?>
