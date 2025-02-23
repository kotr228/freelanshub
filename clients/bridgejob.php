<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
include('db_connect.php');

// Перевірка авторизації
if (!isset($_SESSION['user_id'])) {
    header("Location: loginclients.html");
}

$kay = (int)$_GET['kay'];
$id_j = intval($_GET['id_j'] ?? 0);

if (!is_numeric($kay) || !is_numeric($id_j)) {
    die("Неправильні параметри.");
}

header("Location: infojobclients.php?id_j = . $id_j");

switch ($kay) {
    case 1:
        header("Location: infojobclients.php?id_j = . $id_j");
        break;
    case 2:
        header("Location: infojobclients.php?id_j = . $id_j");
        break;
    case 3:
        header("Location: infojobclients.php?id_j = . $id_j");
        break;
    
}

/*if ($kay == 1) {
    header("Location: infojobclients.php?id_j = . $id_j");
    exit;
} elseif($kay == 2) {
    
} elseif ($kay == 3) {
    
}*/

?>