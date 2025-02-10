<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
include('db_connect.php');

// Перевірка авторизації
if (!isset($_SESSION['user_id'])) {
    die("Ви повинні бути авторизовані.");
}

$user_id = (int) $_SESSION['user_id'];
$filter = $_GET['filter'] ?? 'active'; // За замовчуванням "активні замовлення"

//$conn = new mysqli("localhost", "nkloqzcz_root", "Sillver-228", "nkloqzcz_freelans");
if ($conn->connect_error) {
    die("Помилка підключення: " . $conn->connect_error);
}
$conn->set_charset("utf8mb3_general_ci");

// Формування SQL-запиту залежно від фільтру
switch ($filter) {
    case 'inactive':
        $sql = "SELECT * FROM job WHERE id_c = $user_id AND (status = 'S3' OR status = 'S4')";
        break;
    case 'in_progress':
        $sql = "SELECT * FROM job WHERE id_c = $user_id AND status = 'S1' AND id_f IS NOT NULL";
        break;
    case 'free':
        $sql = "SELECT * FROM job WHERE id_c = $user_id AND status = 'S1' AND id_f IS NULL";
        break;
    case 'done':
        $sql = "SELECT * FROM job WHERE id_c = $user_id AND status = 'S2' AND id_f IS NOT NULL";
        break;
    default:
        $sql = "SELECT * FROM job WHERE id_c = $user_id AND status = 'S1'";
        break;
}


//$stmt = $conn->prepare($sql);

//$stmt->execute();
//$result = $stmt->get_result();
$result = $conn->query($sql);
var_dump($user_id);
var_dump($filter);
var_dump($result);

?>