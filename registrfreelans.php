<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <title>Сайт для фрілансерів</title>
  
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css">

  <link rel='stylesheet prefetch' href='http://maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css'>

      <link rel="stylesheet" href="style.css/registrfreeland.css">

  
</head>

<body>

<?php
  if ($_SERVER["REQUEST_METHOD"] == "POST") {
      $name = htmlspecialchars($_POST['name']);
      $email = htmlspecialchars($_POST['email']);
      $phone = htmlspecialchars($_POST['phone']);
      $telegram = htmlspecialchars($_POST['telegram']);
      $speciality = htmlspecialchars($_POST['speciality']);
      $password = htmlspecialchars($_POST['password']);
      
      // Підключення до бази даних
$db_conn = new mysqli("localhost", "root", "Sillver-228", "freelans");

if (mysqli_connect_errno()) {
    echo 'Помилка підключення до бази даних: ' . mysqli_connect_error();
    exit();
} else {
    echo 'Підключення успішне';
}

// Встановлення кодування UTF-8
mysqli_set_charset($db_conn, "utf8");

// Захист від SQL-ін'єкцій
$name = mysqli_real_escape_string($db_conn, $name);
$email = mysqli_real_escape_string($db_conn, $email);
$phone = mysqli_real_escape_string($db_conn, $phone);
$telegram = mysqli_real_escape_string($db_conn, $telegram);
$specialization = mysqli_real_escape_string($db_conn, $specialization);
$password = password_hash($password, PASSWORD_DEFAULT); // Захист пароля

// Перевірка, чи існує вже такий користувач
$check_user = "SELECT email FROM freelanser_akks WHERE email='$email'";
$result = mysqli_query($db_conn, $check_user);

if (mysqli_num_rows($result) > 0) {
    echo '<br>Користувач з такою електронною адресою вже існує.';
} else {
    // Додавання користувача до бази даних
    $sql = "INSERT INTO freelanser_akks (name, email, phone, telegram, spacialty, password, rating, bank_card) 
            VALUES ('$name', '$email', '$phone', '$telegram', '$specialization', '$password', 0, '')";
    
    if (mysqli_query($db_conn, $sql)) {
        echo '<br>Реєстрація успішна!';
    } else {
        echo '<br>Помилка: ' . mysqli_error($db_conn);
    }
}

// Закриття з'єднання
$db_conn->close();
?>

    <!-- ICONS -->
  <svg id="svg-source" height="0" version="1.1"  xmlns="http://www.w3.org/2000/svg" 
  xmlns:xlink="http://www.w3.org/1999/xlink" style="position: absolute">
  <g id="man-people-user" data-iconmelon="Streamline Icon Set:de32eb2621491c1a881a9fe846236da1">
      <g id="Expanded">
        <g>
          <g>
            <path  d="M16.028,20c-4.764,0-8.639-4.486-8.639-10s3.875-10,8.639-10c4.763,0,8.638,4.486,8.638,10
          S20.791,20,16.028,20z M16.028,1.333C12,1.333,8.722,5.221,8.722,10s3.277,8.667,7.306,8.667c4.029,0,7.306-3.888,7.306-8.667
          S20.057,1.333,16.028,1.333z"></path>
          </g>
        <g>
          <path  d="M31.988,32H0.012v-4.515c0-1.967,1.245-3.733,3.097-4.395l8.224-2.266v-2.77h1.333v3.785L3.51,24.361
          c-1.275,0.458-2.165,1.72-2.165,3.124v3.182h29.309v-3.182c0-1.404-0.889-2.666-2.213-3.139l-9.107-2.506v-3.758h1.332v2.742
          l8.178,2.251c1.9,0.677,3.145,2.442,3.145,4.409V32z"></path>
        </g>
        <g>
                      <path  d="M21.865,8.812c-0.045,0-0.09-0.001-0.137-0.003c-1.5-0.055-3.25-1.004-4.361-2.287
          C16.59,7.513,15.48,8.15,14.106,8.383c-2.403,0.413-5.152-0.51-5.988-1.321l0.928-0.957c0.403,0.391,2.69,1.329,4.836,0.964
          c1.332-0.226,2.292-0.911,2.854-2.034l0.558-1.114l0.617,1.082c0.738,1.292,2.508,2.425,3.867,2.475
          c0.604,0.016,1.033-0.165,1.307-0.571l1.105,0.745C23.686,8.403,22.863,8.812,21.865,8.812z"></path>
                    </g>
                  </g>
                </g>
              </g>
              <g id="lock-locker" data-iconmelon="Streamline Icon Set:5d43c6f45cdbecfd5b8a12bc9e5dd33c">
                <g id="Expanded">
                  <g>
                    <g>
                      <circle  cx="16" cy="20" r="1.333"></circle>
                    </g>
            <g>
                <path  d="M16,25.333c-0.369,0-0.667-0.298-0.667-0.666v-4C15.333,20.298,15.631,20,16,20s0.667,0.298,0.667,0.667
          v4C16.667,25.035,16.369,25.333,16,25.333z"></path>
            </g>
            <g>
              <path  d="M28,32H4V12h24V32z M5.333,30.667h21.333V13.333H5.333V30.667z"></path>
          </g>
          <g>
          <path  d="M24,12.667h-1.333V8c0-3.676-2.991-6.667-6.667-6.667c-3.676,0-6.667,2.99-6.667,6.667v4.667H8V8
          c0-4.412,3.588-8,8-8c4.411,0,8,3.588,8,8V12.667z"></path>
            </g>
          </g>
        </g>
    </g>
  </svg>
  <!-- ICONS -->



<div class="wrapper">
  <div class="header">
    <h3 class="sign-in">Зареєстуватися</h3>
    <div class="container">
      <div class="button" role="button" tabindex="0" onclick="window.location.href='loginfreelans.html'">
          Увійти в існуючий
      </div>
  </div>
  </div>
  
  <form method="POST" action="">
      <!--Поле для імені-->
      <div>
         <label class="user" for="text">
           <svg viewBox="0 0 32 32">
                    <g filter="">
                      <use xlink:href="#man-people-user"></use>
                    </g>
                  </svg>
         </label>
        <input class="user-input" type="text" name="name" id="name" placeholder="Введіть ім'я"  />
      </div> 

      <!--Поле для ПОЧТИ-->
      <div>
        <label class="user" for="text">
          <svg viewBox="0 0 32 32">
                   <g filter="">
                     <use xlink:href="#man-people-user"></use>
                   </g>
                 </svg>
        </label>
       <input class="user-input" type="email" name="name" id="name" placeholder="Почта. example@gmail.com"  />
     </div> 

     <!--Поле для номера-->
      <div>
        <label class="user" for="text">
          <svg viewBox="0 0 32 32">
                  <g filter="">
                    <use xlink:href="#man-people-user"></use>
                  </g>
                </svg>
        </label>
        <input class="user-input" type="tel" name="name" id="name" placeholder="Номер телефону: +380ХХХХХХХХ"  />
      </div>
      <!--Поле для тг ніку-->
      <div>
        <label class="user" for="text">
          <svg viewBox="0 0 32 32">
                  <g filter="">
                    <use xlink:href="#man-people-user"></use>
                  </g>
                </svg>
        </label>
        <input class="user-input" type="text" name="name" id="name" placeholder="Нік у телеграмі: @example"  />
      </div>
      <!--Поле для спеца-->
      <div>
        <label class="user" for="text">
          <svg viewBox="0 0 32 32">
                  <g filter="">
                    <use xlink:href="#man-people-user"></use>
                  </g>
                </svg>
        </label>
        <input class="user-input" type="text" name="name" id="name" placeholder="Ваша спеціальність"  />
      </div>  


      <!--Поле для Паролю-->
      <div>
        <label class="lock" for="password">
          <svg viewBox="0 0 32 32">
             <g filter="">
               <use xlink:href="#lock-locker"></use>
              </g>
            </svg>  
        </label>
        <input type="password" name="name" id="name" placeholder="" />
      </div> 
      
      <div>
        <input type="submit" value="Sign in" />
      </div>
      <div class="radio-check">   
        <input type="radio" class="radio-no" id="no" name="remember" value="no" checked>
        <label for="no"><i class="fa fa-times"></i></label>  
        <input type="radio" class="radio-yes" id="yes" name="remember" value="yes">
        <label for="yes"><i class="fa fa-check"></i></label>
        <span class="switch-selection"></span>
      </div>
      <span class="check-label">Запамятати мене</span>=
    </form>  
</div>
  <script src='http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js'></script>



</body>
</html>