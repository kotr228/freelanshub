<?php
include('db_connect.php');
include('tg_info.php');
include('email_info.php');
include('phone_info.php');
?>

<!DOCTYPE html>
<html lang="UK">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Редачить инфо про себя</title>
  <link rel="stylesheet" href="style.css/correcting-info.css">
</head>
<body class="body">
<div class="site">
  <header class="header">
  <?php include('get_user.php'); ?>
    <div class="header_user-info">
      <p class="header_user-name"><?php echo htmlspecialchars($user_name); ?></p>
        <img class="logo-user" src="<?php echo htmlspecialchars($avatar_path); ?>" alt="">
    </div>
    <img class="logo" src="img/Freelanshub (1).png" alt="logo">
  </header>
  <main class="main">
    <div class="block-container">
      <div class="row">
        <span><?php echo htmlspecialchars($user_name); ?></span>
        <a href="#modal" class="btn-open-modal">Змінити ім'я</a>

        <!-- Модальне вікно -->
      <div id="modal">
      <div class="modal-content">
      <h3>Оновлення імені</h3>
      <form action="update_name.php" method="POST">
        <label for="new_name">Нове ім'я:</label>
          <input type="text" id="new_name" name="new_name" required>
            <div class="modal-actions">
               <button type="submit" class="btn-update">Оновити</button>
              <a href="#" class="btn-close">Скасувати</a>
            </div>
          </form>
        </div>
      </div>
      </form>

      </div>
      <div class="row">
        <span><?php echo htmlspecialchars($user_tg); ?></span>
        <a href="#modaltg" class="btn-open-modaltg">Змінити телеграм</a>
    
         <!-- Модальне вікно -->
      <div id="modaltg">
      <div class="modal-contenttg">
      <h3>Оновлення телеграму</h3>
      <form action="update_tg.php" method="POST">
        <label for="new_tg">Новий телеграм:</label>
          <input type="text" id="new_tg" name="new_tg" required>
            <div class="modal-actions">
               <button type="submit" class="btn-updatetg">Оновити</button>
              <a href="#" class="btn-closetg">Скасувати</a>
            </div>
          </form>
        </div>
      </div>
      </form>

      </div>
      <div class="row">
        <span><?php echo htmlspecialchars($user_email); ?></span>
        <button>Змінити адресу електронної пошти</button>
      </div>
      <div class="row">
        <span><?php echo htmlspecialchars($user_phone); ?></span>
        <button>Змінити номер телефону</button>
      </div>
    </div>
    <div class="block-container n1">
      <p>Про себе</p>
      <textarea placeholder="Про себе" name="" id=""></textarea>
      <button>Змінити інформацію про себе</button>
    </div>
    <div class="block-container ava">
      <div class="avatar">
        <img src="<?php echo htmlspecialchars($avatar_path); ?>" alt="">
        <button>Змінити аватар</button>
      </div>

      <button>Замовлення на виконанні</button>
    </div>
  </main>
</div>

 
</body>
</html>
