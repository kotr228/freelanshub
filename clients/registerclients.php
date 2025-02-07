<?php
  if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
  // Отримання даних з форми
  $name = $_POST['name'];
  $email = $_POST['email'];
  $phone = $_POST['phone'];
  $telegram = $_POST['telegram'];
  $password = $_POST['password'];
  
// Функція для перевірки спецсимволів
function has_invalid_chars($input) {
    $forbidden_chars = ['--', "'", '"', ';', '<', '>', '\\', '/', '`', '$'];
    foreach ($forbidden_chars as $char) {
        if (strpos($input, $char) !== false) {
            return true;
        }
    }
    return false;
}

// Перевірка введених даних
if (has_invalid_chars($name) || has_invalid_chars($email) || has_invalid_chars($phone) || has_invalid_chars($telegram) || has_invalid_chars($password)) {
    $_SESSION['error_message'] = "❌ Помилка: Використання спецсимволів заборонено!";
    header("Location: registerfreeland.html"); // Повертаємося назад на форму
    exit();
}

  // Підключення до бази даних 
  $db_conn = new mysqli("localhost", "nkloqzcz_root", "Sillver-228", "nkloqzcz_freelans");
  
  if (mysqli_connect_errno()) {
      echo 'Помилка підключення до бази даних: ' . mysqli_connect_error();
      exit();
  } else {
      echo 'Підключення успішне';
  }
  $result = mysqli_query($db_conn, 'SELECT * FROM cliants_akks');
  // Встановлення кодування UTF-8
  mysqli_set_charset($db_conn, "utf8");
  
  // Захист від SQL-ін'єкцій
  $name = mysqli_real_escape_string($db_conn, $name);
  $email = mysqli_real_escape_string($db_conn, $email);
  $phone = mysqli_real_escape_string($db_conn, $phone);
  $telegram = mysqli_real_escape_string($db_conn, $telegram);
  $password = password_hash($password, PASSWORD_DEFAULT); // Захист пароля
  
  // Перевірка, чи існує вже такий користувач
  $check_user = "SELECT email FROM cliants_akks WHERE email='$email'";
  $result = mysqli_query($db_conn, $check_user);
  
  if (mysqli_num_rows($result) > 0) {
      echo '<br>Користувач з такою електронною адресою вже існує.';
  } else {
      // Додавання користувача до бази даних
      $sql = "INSERT INTO cliants_akks (name, email, password, telegram, phone) 
              VALUES ('$name', '$email', '$password', '$telegram', '$phone')";
      
      if (mysqli_query($db_conn, $sql)) {
        header("Location: loginclients.html");
        exit();
      } else {
          echo '<br>Помилка: ' . mysqli_error($db_conn);
      }
  }
  
  // Закриття з'єднання
  $db_conn->close();
  ?>