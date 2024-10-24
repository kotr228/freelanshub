<?php
// Отримання даних з форми
$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$telegram = $_POST['telegram'];
$specialization = $_POST['specialization'];
$password = $_POST['password'];

// Підключення до бази даних
$db_conn = new mysqli("localhost", "root", "Sillver-228", "freelans");

if (mysqli_connect_errno()) {
    echo 'Помилка підключення до бази даних: ' . mysqli_connect_error();
    exit();
} else {
    echo 'Підключення успішне';
}

// Встановлення кодування UTF-8
mysqli_set_charset($db_conn, "utf8");

// Захист від SQL-ін'єкцій
$name = mysqli_real_escape_string($db_conn, $name);
$email = mysqli_real_escape_string($db_conn, $email);
$phone = mysqli_real_escape_string($db_conn, $phone);
$telegram = mysqli_real_escape_string($db_conn, $telegram);
$specialization = mysqli_real_escape_string($db_conn, $specialization);
$password = password_hash($password, PASSWORD_DEFAULT); // Захист пароля

// Перевірка, чи існує вже такий користувач
$check_user = "SELECT email FROM freelanser_akks WHERE email='$email'";
$result = mysqli_query($db_conn, $check_user);

if (mysqli_num_rows($result) > 0) {
    echo '<br>Користувач з такою електронною адресою вже існує.';
} else {
    // Додавання користувача до бази даних
    $sql = "INSERT INTO freelanser_akks (name, email, phone, telegram, spacialty, password, rating, bank_card) 
            VALUES ('$name', '$email', '$phone', '$telegram', '$specialization', '$password', 0, '')";
    
    if (mysqli_query($db_conn, $sql)) {
        echo '<br>Реєстрація успішна!';
    } else {
        echo '<br>Помилка: ' . mysqli_error($db_conn);
    }
}

// Закриття з'єднання
$db_conn->close();
?>

<form action="registrfreelans.html" method="POST">
    <input name="submit" type="submit" value="Повернутись до реєстрації">
</form>
