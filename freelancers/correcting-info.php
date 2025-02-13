<?php
include('db_connect.php');
include('tg_info.php');
include('email_info.php');
include('phone_info.php');
include('get_user.php');
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
  
    <div class="header_user-info">
      <p class="header_user-name"><?php echo htmlspecialchars($user_name); ?></p>
        <img class="logo-user" src="<?php echo htmlspecialchars($avatar_path); ?>" alt="">
    </div>
    <button class="header_item" onclick="location.href='delat_zakazy.php'">На головну</button>
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
        <a href="#modalem" class="btn-open-modaltg">Змінити адресу електронної пошти</a>

        <div id="modalem">
      <div class="modal-contentem">
      <h3>Оновлення пошти</h3>
      <form action="update_em.php" method="POST">
        <label for="new_em">Нова адреса електронної пошти:</label>
          <input type="text" id="new_em" name="new_em" required>
            <div class="modal-actions">
               <button type="submit" class="btn-updateem">Оновити</button>
              <a href="#" class="btn-closeem">Скасувати</a>
            </div>
          </form>
        </div>
      </div>
      </form>

      </div>

      <div class="row">
        <span><?php echo htmlspecialchars($user_phone); ?></span>
        <a href="#modalph" class="btn-open-modaltg">Змінити номер телефону</a>

        <div id="modalph">
      <div class="modal-contentph">
      <h3>Оновлення номеру телефону</h3>
      <form action="update_ph.php" method="POST">
        <label for="new_ph">Новий номер телефону:</label>
          <input type="text" id="new_ph" name="new_ph" required>
            <div class="modal-actions">
               <button type="submit" class="btn-updateph">Оновити</button>
              <a href="#" class="btn-closeph">Скасувати</a>
            </div>
          </form>
        </div>
      </div>
      </form>
      </div>
    </div>
    <div class="block-container n1">
      <p>Про себе</p>
      <textarea placeholder="Про себе" name="" id=""><?php echo htmlspecialchars($user_about); ?></textarea>
      <a href="#modal-about" class="btn-open-modal-about">Змінити інформацію про себе</a>

      <!-- Модальне вікно -->
      <div id="modal-about">
        <div class="modala-content">
            <h3>Оновлення інформації про себе</h3>
            <form action="update_about.php" method="POST">
                <label for="new_about">Нова інформація:</label>
                <textarea id="new_about" name="new_about" required><?php echo htmlspecialchars($user_about); ?></textarea>
                <div class="modal-actions">
                    <button type="submit">Оновити</button>
                    <a href="#" class="btn-close">Скасувати</a>
                </div>
            </form>
        </div>
      </div>

    </div>
    <div class="block-container ava">
      <div class="avatar">
        <img src="<?php echo htmlspecialchars($avatar_path); ?>" alt="">
        <a href="#modal-avatar-update" class="user-avatar-change-link">Змінити аватар</a>
    </div>

    <div id="modal-avatar-update" class="modal-avatar">
        <div class="modal-avatar-content">
            <h3>Оновлення аватару</h3>
            <form action="update_avatar.php" method="POST" enctype="multipart/form-data">
                <label for="new-avatar-input">Оберіть новий аватар:</label>
                <input type="file" id="new-avatar-input" name="new_avatar" accept="image/*" required>
                <div class="modal-avatar-actions">
                    <button type="submit" class="btn-avatar-update">Оновити</button>
                    <a href="#" class="btn-avatar-cancel">Скасувати</a>
                </div>
            </form>
        </div>
    </div>

    

      <button onclick="location.href='my_orders.php'">Замовлення на виконанні</button>
    </div>
  </main>
</div>

 
</body>
</html>
//