# 🗄️ MySQL Database для FreelanceHub

## Опис

Цей SQL скрипт створює повну структуру бази даних для FreelanceHub в MySQL/MariaDB.

## 📋 Структура бази даних

### Таблиці:

1. **users** - Користувачі (фрілансери та замовники)
2. **projects** - Проєкти/завдання
3. **bids** - Заявки на проєкти
4. **reviews** - Відгуки користувачів
5. **messages** - Повідомлення між користувачами
6. **project_attachments** - Файли, прикріплені до проєктів
7. **message_attachments** - Файли в повідомленнях

## 🚀 Встановлення через PHPMyAdmin

### Метод 1: Імпорт SQL файлу

1. Відкрийте **PHPMyAdmin** (зазвичай: http://localhost/phpmyadmin)
2. Увійдіть з вашими credentials (root/password)
3. Натисніть вкладку **"Імпорт"** у верхньому меню
4. Натисніть **"Виберіть файл"**
5. Оберіть файл `freelancehub_mysql.sql`
6. Натисніть **"Вперед"** (Go)
7. Дочекайтеся повідомлення "Імпорт успішно завершено"

### Метод 2: Через SQL вкладку

1. Відкрийте **PHPMyAdmin**
2. Натисніть вкладку **"SQL"**
3. Відкрийте файл `freelancehub_mysql.sql` в текстовому редакторі
4. Скопіюйте весь вміст файлу
5. Вставте в текстове поле SQL в PHPMyAdmin
6. Натисніть **"Вперед"**

## 💻 Встановлення через командний рядок

### Windows (Command Prompt):

```cmd
cd "C:\xampp\mysql\bin"
mysql -u root -p < "шлях\до\freelancehub_mysql.sql"
```

### Windows (PowerShell):

```powershell
& "C:\xampp\mysql\bin\mysql.exe" -u root -p < "C:\path\to\freelancehub_mysql.sql"
```

### Linux/Mac:

```bash
mysql -u root -p < /path/to/freelancehub_mysql.sql
```

Після запуску введіть пароль MySQL.

## ✅ Перевірка встановлення

Після імпорту перевірте:

1. У PHPMyAdmin з'явилася база даних **freelancehub**
2. У ній є 7 таблиць
3. У таблиці users є правильна структура

### SQL запит для перевірки:

```sql
USE freelancehub;
SHOW TABLES;
```

Повинні з'явитися:
- bids
- message_attachments
- messages
- project_attachments
- projects
- reviews
- users

## 🔧 Налаштування Backend для MySQL

Якщо ви хочете використовувати MySQL замість MongoDB, вам потрібно:

### 1. Встановити MySQL драйвер для Node.js:

```bash
cd backend
npm install mysql2
# або для Sequelize ORM
npm install sequelize mysql2
```

### 2. Оновити .env файл:

```env
# Замість MONGODB_URI використайте:
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=freelancehub
DB_USER=root
DB_PASSWORD=your_password
```

### 3. Створити MySQL конфігурацію

Створіть файл `backend/src/config/mysql.js`:

```javascript
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'freelancehub',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
```

## 📊 Приклади SQL запитів

### Отримати всіх фрілансерів:

```sql
SELECT id, name, email, rating, skills 
FROM users 
WHERE role = 'freelancer' 
ORDER BY rating DESC;
```

### Отримати відкриті проєкти:

```sql
SELECT p.*, u.name as client_name
FROM projects p
JOIN users u ON p.client_id = u.id
WHERE p.status = 'open'
ORDER BY p.created_at DESC;
```

### Отримати заявки на проєкт:

```sql
SELECT b.*, u.name as freelancer_name, u.rating
FROM bids b
JOIN users u ON b.freelancer_id = u.id
WHERE b.project_id = 1
ORDER BY b.created_at DESC;
```

### Отримати повідомлення:

```sql
SELECT m.*, 
  s.name as sender_name,
  r.name as receiver_name
FROM messages m
JOIN users s ON m.sender_id = s.id
JOIN users r ON m.receiver_id = r.id
WHERE m.project_id = 1
ORDER BY m.created_at ASC;
```

## 🔐 Безпека

### Рекомендації:

1. **Змініть пароль root** в PHPMyAdmin:
```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'новий_складний_пароль';
```

2. **Створіть окремого користувача** для додатку:
```sql
CREATE USER 'freelancehub_user'@'localhost' IDENTIFIED BY 'складний_пароль';
GRANT ALL PRIVILEGES ON freelancehub.* TO 'freelancehub_user'@'localhost';
FLUSH PRIVILEGES;
```

3. **Використовуйте нового користувача** в .env:
```env
DB_USER=freelancehub_user
DB_PASSWORD=складний_пароль
```

## 📝 Примітки

- Всі паролі в таблиці `users` повинні бути хешовані (bcrypt)
- JSON поля (skills, portfolio) зберігаються як TEXT
- AUTO_INCREMENT починається з 1
- Використовується utf8mb4 для підтримки емодзі та спецсимволів
- FULLTEXT індекс для швидкого пошуку в проєктах

## 🐛 Усунення проблем

### Помилка: "Table already exists"
Видаліть базу даних:
```sql
DROP DATABASE IF EXISTS freelancehub;
```
Потім запустіть скрипт знову.

### Помилка: "Access denied"
Перевірте права доступу користувача MySQL.

### Помилка з FOREIGN KEY
Переконайтеся, що InnoDB engine підтримується вашою версією MySQL.

## 📞 Підтримка

Для додаткової допомоги див. основний README.md проєкту.
