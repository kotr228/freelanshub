<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Отримання даних з форми
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$telegram = $_POST['telegram'] ?? '';
$password = $_POST['password'] ?? '';

// Функція перевірки спецсимволів
function has_invalid_chars($input) {
    $forbidden_chars = ['--', "'", '"', ';', '<', '>', '\\', '/', '`', '$'];
    foreach ($forbidden_chars as $char) {
        if (strpos($input, $char) !== false) {
            return true;
        }
    }
    return false;
}

// Масив для збереження помилок
$errors = [];

if (has_invalid_chars($name)) {
    $errors['name'] = "Ім'я містить заборонені символи!";
}

if (has_invalid_chars($email)) {
    $errors['email'] = "Email містить заборонені символи!";
}

if (has_invalid_chars($phone)) {
    $errors['phone'] = "Телефон містить заборонені символи!";
}

if (has_invalid_chars($telegram)) {
    $errors['telegram'] = "Телеграм нік містить заборонені символи!";
}

if (has_invalid_chars($password)) {
    $errors['password'] = "Пароль містить заборонені символи!";
}

// Якщо є помилки – повертаємо JSON
if (!empty($errors)) {
    echo json_encode(['status' => 'error', 'errors' => $errors]);
    exit();
}

// Підключення до бази даних
$db_conn = new mysqli("localhost", "nkloqzcz_root", "Sillver-228", "nkloqzcz_freelans");

if ($db_conn->connect_errno) {
    echo json_encode(['status' => 'error', 'message' => 'Помилка підключення до бази даних: ' . $db_conn->connect_error]);
    exit();
}

// Встановлення кодування UTF-8
mysqli_set_charset($db_conn, "utf8");

// Захист від SQL-ін'єкцій
$name = mysqli_real_escape_string($db_conn, $name);
$email = mysqli_real_escape_string($db_conn, $email);
$phone = mysqli_real_escape_string($db_conn, $phone);
$telegram = mysqli_real_escape_string($db_conn, $telegram);
$password = password_hash($password, PASSWORD_DEFAULT); // Хешування пароля

// Перевірка, чи існує вже такий користувач
$check_user = "SELECT email FROM cliants_akks WHERE email='$email'";
$result = mysqli_query($db_conn, $check_user);

if (mysqli_num_rows($result) > 0) {
    echo json_encode(['status' => 'error', 'message' => 'Користувач з такою електронною адресою вже існує.']);
} else {
    // Додавання користувача до бази даних
    $sql = "INSERT INTO cliants_akks (name, email, password, telegram, phone) 
            VALUES ('$name', '$email', '$password', '$telegram', '$phone')";

    if (mysqli_query($db_conn, $sql)) {
        echo json_encode(['status' => 'success', 'message' => 'Реєстрація успішна!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Помилка реєстрації: ' . mysqli_error($db_conn)]);
    }
}

// Закриття з'єднання
$db_conn->close();
?>
