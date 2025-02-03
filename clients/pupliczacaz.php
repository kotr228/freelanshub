<?php
include('db_connect.php');
include('get_user.php');
?>

<!DOCTYPE html>
<html lang="UK">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Делать заказы</title>
  <link rel="stylesheet" href="style.css/pupliczacaz.css">
</head>
<body class="body">
<div class="site">
<header class="header">
  <div class="header_item"><a href="#modal" class="btn-open-modal">Цінова політика</a>

<!-- Модальне вікно -->
<div id="modal">
  <div class="modal-content">
    <h3>Цінова політика</h3>
     <h6>Платформа забирає певну частину платежу на утримання хостингу сайту. Для різних типів замовлень різні відсотки, також відсоток залежить від ціни.</h6>
     <br><h4>Залежність відсотку від ціни замовлення:</h4>
     <h6>До 1000 грн/25 usd - 5%</h6>
     <h6>Від 1000 грн/25 usd до 42000 грн/1000 usd - 10%</h6>
     <h6>Від 42000 грн/1000 usd до 84000 грн/2000 usd - 12%</h6>
     <h6>Від 84000 грн/2000 usd - 15%</h6>
     <br><h4>УВАГА!</h4>
     <h6>Платформа робить платіж автоматично після сплати замовлення клієнтом, а клієнт може сплатити гроші за замовлення тільки після того, як виконавець повідомить про виконану роботу</h6><br>
    <div class="modal-actions">
     <a href="#" class="btn-close">Закрити</a>
   </div>
  </div>
</div>
</div>

<div class="header_item"><a href="#modalph" class="btn-open-modal">Політика конфеденційності</a>
    
    <div id="modalph">
      <div class="modal-contentph">
        <h3>Політика конфеденційності</h3>
         <h6>Платформа не збирає ваші персональні данні окрім пошти, номеру телефону та інших засобів зв'язку, також нам необхідна банківська картка виконавця. Також модератори не можуть змінити ваші паролі, оскільки у нас немає до них доступу, пізніше з'явиться можливість зміни паролю користувачем.</h6>
         <br><h4>Файли:</h4>
         <h6>Ми зберігаємо файли, які ви прикріплюєте до обмінників файлів, але ми не використовуємо їх. Також ми можемо надати ваші файли при необхідності, якщо ви втратите доступ до них.</h6>
         <h6>Якщо є необхідність передати не файл, а проект, необхідно архівувати його.</h6>
         <br><h4>УВАГА!</h4>
         <h6>Платформа з часом видаляє старі файли, тобто вони можуть зберігатися рік, як і всі замовлення, тобто через рік після створення замовлення, система видаляє замовлення з бази даних, а також всі файли, які пов'язані з цим замовленням.</h6><br>
        <div class="modalph-actions">
         <a href="#" class="btn-closeph">Закрити</a>
       </div>
      </div>
    </div>

  </div>
    <div class="header_item">Служба підтримки</div>
    <button class="header_item" onclick="location.href='../../index.html'">На головну</button>
    <div class="header_user-info">
      <p class="header_user-name"><?php echo htmlspecialchars($user_name); ?></p>
      <a href="#">
      <img class="logo-user" src="<?php echo htmlspecialchars($avatar_path); ?>" alt="">
      </a>
      <div class="dropdown-menu">
    <button class="dropdown-item" onclick="location.href='loginclients.html'">Змінити аккаунт</button>
    <button class="dropdown-item" onclick="location.href='registerclients.html'">Вийти з аккаунту</button>
    <button class="dropdown-item" onclick="location.href='correcting-info.php'">Налаштування аккаунту</button>
    <div class="dropdown-item">  <a href="#modaln" class="btn-open-modaln">Сповіщення</a>
  <!-- Модальне вікно для сповіщень -->
  <div id="notificationModal" class="modal">
  <div class="modal-content">
  <button class="btn-open-modal-notifications">Сповіщення</button>
    <ul id="notificationList"></ul>
    <button class="btn-close" onclick="closeModal()">Закрити</button>
  </div>
</div>
  </div> 
  </div>   
</div>

</div>
  </header>
  
  <form action="submit_order.php" method="POST" class="form-main">
    <main class="main">
      <div class="block-parametrs">
        <div class="style_pole">
          <label for="type">Тип:</label>
          <select id="type" class="input" name="type" required>
            <option value="" disabled selected></option>
            <option value="type1" <?= $type == 'type1' ? 'selected' : '' ?>>Одноразова робота</option>
            <option value="type2" <?= $type == 'type2' ? 'selected' : '' ?>>Робота на певний період</option>
            <option value="type3" <?= $type == 'type3' ? 'selected' : '' ?>>Робота на довгий період часу</option>
          </select>
        </div>
  
        <div class="style_pole">
          <label for="specialty">Спеціальність:</label>
          <select id="specialty" class="input" name="specialty" required>
            <option value="" disabled selected></option>
            <option value="spec1">Виготовлення кошторисної документації (інвесторська кошторисна документація, договірна ціна тощо)</option>
            <option value="spec2">Написання пояснювальної записки до проектної документації</option>
            <option value="spec3">Дистанційне ведення бухгалтерії підприємства</option>
            <option value="spec4">Переклад та коригування текстів</option>
            <option value="spec5">Написання та коригування статей для видань</option>
            <option value="spec6">Створення рекламних макетів, логотипів підприємств</option>  
            <option value="spec7">3д-дизайн</option>
            <option value="spec8">2д-дизайн</option>
            <option value="spec9">Фронтенд для сайтів</option>  
            <option value="spec10">Бекенд для сайтів</option>
            <option value="spec11">Фулстак для сайтів</option>
            <option value="spec12">Відеомонтаж</option>
            <option value="spec13">Фотомонтаж</option>
            <option value="spec14">Програмування</option>
            <option value="spec15">Студентські роботи</option>
          </select>
        </div>
  
        <div class="style_pole">
          <label for="deadline">Дедлайн:</label>
          <input class="input-data" type="date" id="deadline" name="deadline" required />
        </div>
  
        <div class="style_pole">
          <label for="price">Ціна:</label>
          <input class="input-price" type="number" id="price" name="price" placeholder="0" required />
        </div>
  
        <div class="style_pole">
          <label for="name">Назва:</label>
          <input class="input-price" type="text" id="name" name="name" placeholder="Зробити дизайн" required />
        </div>
      </div>
  
      <div class="opus-i-button">
        <div class="block_info">
          <label class="textic" for="description">Опис замовлення:</label>
          <textarea placeholder="Введіть ваш опис" class="poleopus" id="description" name="description" rows="4" required></textarea>
        </div>
        <button type="submit" class="puplic">
          Опублікувати замовлення
        </button>
      </div>
    </main>
  </form>
  

  <div class="obolocka">
    <footer class="footer">
      <img class="logo" src="img/Freelanshub (1).png" alt="logo">
      <div class="footer-item">Реклама</div>
      <div class="footer-item">Партнерство</div>
      <div class="footer-item">Про нас</div>
    </footer>
  </div>
</div>

 
</body>
</html>
