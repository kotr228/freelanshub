<?php
include('db_connect.php');
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
    <div class="header_item">На головну</div>
    <div class="header_user-info">
      <p class="header_user-name"><?php echo htmlspecialchars($user_name); ?></p>
      <a href="#">
        <img class="logo-user" src="img/png-transparent-computer-icons-user-profile-user-account-avatar-heroes-silhouette-black-thumbnail.png" alt="">
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
            <option value="type1">Тип 1</option>
            <option value="type2">Тип 2</option>
          </select>
        </div>
  
        <div class="style_pole">
          <label for="specialty">Спеціальність:</label>
          <select id="specialty" class="input" name="specialty" required>
            <option value="" disabled selected></option>
            <option value="spec1">Спеціальність 1</option>
            <option value="spec2">Спеціальність 2</option>
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
