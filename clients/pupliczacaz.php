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
    <div class="header_item">Цінова політика</div>
    <div class="header_item">Політика конфедеційності</div>
    <div class="header_item">Служба підтримки</div>
    <button class="header_item" onclick="location.href='peregladat_zakazy.php'">На головну</button>
    <div class="header_user-info">
      <p class="header_user-name"><?php echo htmlspecialchars($user_name); ?></p>
      <a href="#">
      <img class="logo-user" src="<?php echo htmlspecialchars($avatar_path); ?>" alt="">
      </a>
      <div class="dropdown-menu">
        <button class="dropdown-item">Змінити аккаунт</button>
        <button class="dropdown-item">Вийти з аккаунту</button>
        <button class="dropdown-item">Налаштування аккаунту</button>
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
