<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
include('db_connect.php');

if (!isset($_SESSION['user_id_f'])) {
    die("Ви повинні бути авторизовані.");
}

$user_id = $_SESSION['user_id_f'];
$order_id = isset($_GET['id_j']) ? (int)$_GET['id_j'] : 0;
?>