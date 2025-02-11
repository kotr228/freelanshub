<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
include('db_connect.php');

// Перевірка авторизації
if (!isset($_SESSION['user_id'])) {
    die("Ви повинні бути авторизовані.");
}

$kay = (int)$_GET['kay'];
$id_j = (int)$_GET['id_j'];

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