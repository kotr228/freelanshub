<?php
include('db_connect.php'); // Підключення до бази даних

// Перевірка авторизації клієнта
if (!isset($_SESSION['user_id'])) {
    die("Error: Ви не авторизовані.");
}

// Отримання ID замовлення
$order_id = intval($_GET['id_j'] ?? 0);

if ($order_id <= 0) {
    die("Error: Неправильний ID замовлення.");
}

// Отримання даних замовлення
$stmt = $conn->prepare("
    SELECT job.price, job.status, freelanser_dod.bank_cart AS freelancer_cart
    FROM job 
    JOIN freelanser_dod ON job.id_f = freelanser_dod.id_f
    WHERE job.id_j = ?
");
$stmt->bind_param("i", $order_id);
$stmt->execute();
$result = $stmt->get_result();
$order = $result->fetch_assoc();
$stmt->close();

if (!$order || $order['status'] !== 'Виконане') {
    die("Error: Замовлення не виконане або не існує.");
}

// Логіка розрахунку відсотка
$price = (float)$order['price'];
$freelancer_cart = $order['freelancer_cart'];
$owner_cart = 'ВАШ_НОМЕР_КАРТКИ_ВЛАСНИКА'; // Змініть на ваш номер картки
$commission_rate = 0;

if ($price <= 1000) {
    $commission_rate = 0.05;
} elseif ($price <= 42000) {
    $commission_rate = 0.10;
} elseif ($price <= 84000) {
    $commission_rate = 0.12;
} else {
    $commission_rate = 0.15;
}

$commission = $price * $commission_rate;
$freelancer_payment = $price - $commission;

// Симуляція платежу
if (processPayment($freelancer_cart, $freelancer_payment) && processPayment($owner_cart, $commission)) {
    // Оновлення статусу замовлення
    $stmt = $conn->prepare("UPDATE job SET status = 'S3' WHERE id_j = ?");
    $stmt->bind_param("i", $order_id);
    $stmt->execute();
    $stmt->close();

    echo "Оплата успішно виконана!";
} else {
    echo "Помилка обробки платежу.";
}

// Функція для симуляції платежу
function processPayment($bankCart, $amount) {
    // Тут слід додати API для реального виконання транзакцій
    // Для тестування повертаємо true
    return true;
}
?>
