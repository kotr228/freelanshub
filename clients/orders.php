<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
include('db_connect.php');

// Перевірка авторизації
if (!isset($_SESSION['user_id'])) {
    die("Ви повинні бути авторизовані.");
}

$user_id = $_SESSION['user_id'];
$filter = $_GET['filter'] ?? 'active'; // За замовчуванням "активні замовлення"

$conn = new mysqli("localhost", "nkloqzcz_root", "Sillver-228", "nkloqzcz_freelans");
if ($conn->connect_error) {
    die("Помилка підключення: " . $conn->connect_error);
}
$conn->set_charset("utf8");
var_dump($_GET['filter']); // Додатковий вивід для перевірки
var_dump($user_id); // Перевірка ідентифікатора користувача
settype($user_id, "intrgre");

// Формування SQL-запиту залежно від фільтру
switch ($filter) {
    case 'inactive':
        $sql = "SELECT * FROM job WHERE id_c = ? AND (status = 'Неактивне' OR status = 'Сплачене')";
        break;
    case 'in_progress':
        $sql = "SELECT * FROM job WHERE id_c = ? AND status = 'Активне' AND id_f IS NOT NULL";
        break;
    case 'free':
        $sql = "SELECT * FROM job WHERE id_c = ? AND status = 'Активне' AND id_f IS NULL";
        break;
    case 'done':
        $sql = "SELECT * FROM job WHERE id_c = ? AND status = 'Виконане' AND id_f IS NOT NULL";
        break;
    default:
        $sql = "SELECT * FROM job WHERE id_c = ? AND status = 'Активне'";
        break;
}
echo "SQL запит: " . $sql;

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
echo "SQL запит: " . $stmt;
$result = $stmt->get_result();
?>
