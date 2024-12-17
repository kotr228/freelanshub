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

$conn = new mysqli("localhost", "root", "Sillver-228", "freelans");
if ($conn->connect_error) {
    die("Помилка підключення: " . $conn->connect_error);
}
$conn->set_charset("utf8");

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
    default:
        $sql = "SELECT * FROM job WHERE id_c = ? AND status = 'Активне'";
        break;
}

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
?>
