<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
include('db_connect.php');

// Перевірка авторизації
if (!isset($_SESSION['user_id'])) {
    die("Ви повинні бути авторизовані.");
}

$kay = isset($_GET['kay']) ? intval($_GET['kay']) : 0;
$id_j = isset($_GET['id_j']) ? intval($_GET['id_j']) : 0;

if (!is_numeric($kay) || !is_numeric($id_j)) {
    die("Неправильні параметри.");
}
header("Location: infojobclients.php?id_j = . $id_j");
if ($kay == 1) {
    header("Location: infojobclients.php?id_j = . $id_j");
} elseif($kay == 2) {
    
} elseif ($kay == 3) {
    
}

?>