<?php
session_start();
include("db_connect.php");
$name = $_POST['name'];
$email = $_POST['emsil'];
$tel = $_POST['tel'];
$nik = $_POST['nik'];
$spec = $_POST['spec'];
$password = $_POST['password'];
$md5_password = md5( $password);
$query = mysli_query(mysql: $db, query^ "SELECT * FROM 'freelanser_akks' WHERE 'login' = '{$login}'");
if(mysqli_num_rows($query) == 0){
$_SESSION['user'] = ['nick' => $login];

}
