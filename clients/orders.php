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
$conn->set_charset("utf8");

// Формування SQL-запиту залежно від фільтру
/*switch ($filter) {
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
}*/

if ($filter === 'inactive') {
    $sql .= "SELECT * FROM job WHERE id_c = $user_id AND (status = 'S3' OR status = 'S4')";
} elseif($filter === 'in_progress') {
    $sql = "SELECT * FROM job WHERE id_c = $user_id AND status = 'S1' AND id_f IS NOT NULL";
} elseif ($filter === 'free') {
    $sql = "SELECT * FROM job WHERE id_c = $user_id AND status = 'S1' AND id_f IS NULL";
} elseif ($filter === 'done') {
    $sql = "SELECT * FROM job WHERE id_c = $user_id AND status = 'S2' AND id_f IS NOT NULL";
} elseif ($filter === 'active') {
    $sql = "SELECT * FROM job WHERE id_c = $user_id AND status = 'S1'";
}



//$stmt = $conn->prepare($sql);

//$stmt->execute();
//$result = $stmt->get_result();
$result = $conn->query($sql);
var_dump($user_id);
var_dump($filter);
var_dump($result);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        echo "<div class='block_info'>";
        echo "<p>Назва: " . htmlspecialchars($row['lable']) . "</p>";
        echo "<p>Спеціальність: " . htmlspecialchars($row['spacsalyty']) . "</p>";
        echo "<p>Тип: " . htmlspecialchars($row['tipe']) . "</p>";
        echo "<p>Статус: " . htmlspecialchars($row['status']) . "</p>";
        echo "<div class='data_price'>";
        echo "<p>Срок до: " . htmlspecialchars($row['date']) . "</p>";
        echo "<p>Ціна: " . htmlspecialchars($row['price']) . "</p>";
        echo "<a href='infojobfree.php?id_j=" . htmlspecialchars($row['id_j']) . "' class='header_item'>Детальніше</a>"; // Кнопка
        echo "</div>";
        echo "</div>";
    }
} else {
    echo "<p>Немає замовлень за заданими параметрами.</p>";
}

?>