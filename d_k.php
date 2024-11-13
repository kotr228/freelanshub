<html>
<head>
    <title>Удаление</title>
</head>
<body bgcolor="#9ACD32">
<span style="color:blue;" size="14">
<h1><p align="center"> Результат </p></h1>
</span>
<center>

<?php

	$id=$_POST['id_k'];	

$db_conn = new mysqli("localhost", "root", "", "sk");//соединение с базой

if (mysqli_connect_errno())
  {
  echo 'Connection to database failed:'.mysqli_connect_error();//сообщение об успешном соединении
  exit();
  }
else
  {
  echo 'Соединение успешно';
  }
  
mysqli_set_charset($db_conn, "utf8");

$id_k="select id from klient where id='$id'";
$rez_id=mysqli_query($db_conn,$id_k);

if(mysqli_num_rows($rez_id)==1):
{
$id_del = "delete from klient where id='$id';";//Получение последнего номера из базы
//удаление из базы
$result_del = mysqli_query($db_conn,$id_del);

	if($result_del == false):
	{
	print("<br>". "Ошибка. запись не удалена ");
	}
	else:
		print ("<br>". "Запись успешно удалена". "<br>"."<br>");
	endif;  
}

else:
	print("<br>"."Клиент не найден");
endif;
	


$db_conn->close();

 ?>
 
<form action="http://localhost/p_f_k.php" method="POST"> 
	  <tr><input name="submit" type="submit" value="Вернуться на предыдущую страницу">   
</form>
 
<form action="http://localhost/index.html" method="POST"> 
	  <tr><input name="submit" type="submit" value="Вернуться на главную">   
</form>

<form action="http://localhost/poisk_k.html" method="POST"> 
	  <tr><input name="submit" type="submit" value="Вернуться к поиску">   
</form>

</center>
</body>
</html>















