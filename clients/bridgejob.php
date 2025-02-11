<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
include('db_connect.php');

// Перевірка авторизації
if (!isset($_SESSION['user_id'])) {
    die("Ви повинні бути авторизовані.");
}

$kay = $_GET['kay'];

if ($kay == '1') {
    
} elseif($kay == '2') {
    
} elseif ($kay == '3') {
    
}

?>