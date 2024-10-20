<?php
session_start();
include 'config.php';  // Assuming 'config.php' holds the database connection details

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Capture the form data
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Database query to check if the freelancer exists
    $sql = "SELECT * FROM freelancers WHERE username = ? LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        // Verify the password
        if (password_verify($password, $row['password'])) {
            // Authentication successful, set session variables
            $_SESSION['freelancer_id'] = $row['id'];
            $_SESSION['username'] = $row['username'];
            header("Location: dashboard.php");  // Redirect to the freelancer dashboard
            exit();
        } else {
            echo "Невірний пароль.";
        }
    } else {
        echo "Немає такого користувача.";
    }
}
?>
