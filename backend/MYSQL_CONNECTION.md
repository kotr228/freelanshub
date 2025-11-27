# 🔌 Підключення MySQL до FreelanceHub

## ✅ Крок 1: Створіть файл .env

У папці `backend/` створіть або відредагуйте файл `.env`:

```env
# Порт сервера
PORT=5000
NODE_ENV=development

# ============ MYSQL НАЛАШТУВАННЯ ============
DB_HOST=localhost
DB_PORT=3306
DB_NAME=freelancehub
DB_USER=root
DB_PASSWORD=ваш_пароль_тут

# JWT налаштування
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Frontend URL
CLIENT_URL=http://localhost:3000
```

---

## 📝 Як заповнити дані:

### 1. DB_HOST - Хост бази даних
- Локально: `localhost` або `127.0.0.1`
- Віддалений сервер: IP адреса або домен

**Приклад:**
```env
DB_HOST=localhost
```

### 2. DB_PORT - Порт MySQL
- За замовчуванням: `3306`

**Приклад:**
```env
DB_PORT=3306
```

### 3. DB_NAME - Ім'я бази даних
- Назва БД, яку ви створили (через PHPMyAdmin або SQL скрипт)

**Приклад:**
```env
DB_NAME=freelancehub
```

### 4. DB_USER - Ім'я користувача MySQL
- За замовчуванням: `root`
- Або створений вами користувач

**Приклад:**
```env
DB_USER=root
```

### 5. DB_PASSWORD - Пароль користувача
- Ваш пароль від MySQL
- Якщо немає пароля, залиште порожнім: `DB_PASSWORD=`

**Приклад:**
```env
DB_PASSWORD=MyPassword123
```

---

## 🚀 Крок 2: Запустіть сервер з MySQL

```bash
cd backend
npm run dev:mysql
```

Або для production:
```bash
npm run start:mysql
```

---

## ✅ Перевірка підключення

Якщо все правильно, ви побачите:

```
🔌 Підключення до MySQL...
✅ MySQL підключено: localhost
✅ Моделі синхронізовано

╔═══════════════════════════════════════════════╗
║   🚀 FreelanceHub Server (MySQL)              ║
║   📡 Порт: 5000                               ║
║   🌍 Режим: development                       ║
║   💾 MySQL підключено                         ║
╚═══════════════════════════════════════════════╝
```

---

## 📋 Повний приклад .env файлу:

```env
# Server
PORT=5000
NODE_ENV=development

# MySQL Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=freelancehub
DB_USER=root
DB_PASSWORD=password123

# JWT
JWT_SECRET=my-super-secret-key-12345-change-this
JWT_EXPIRE=7d

# Frontend
CLIENT_URL=http://localhost:3000

# Email (опціонально)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-password
EMAIL_FROM=noreply@freelancehub.com
```

---

## 🔍 Усунення проблем

### Помилка: "MYSQL налаштування не знайдено"
**Рішення:**
- Перевірте, що файл `.env` знаходиться в папці `backend/`
- Перевірте, що всі змінні `DB_*` присутні

### Помилка: "Access denied for user"
**Рішення:**
- Перевірте правильність `DB_USER` та `DB_PASSWORD`
- У PHPMyAdmin: перейдіть в **Користувачі** → перевірте права доступу

### Помилка: "Unknown database 'freelancehub'"
**Рішення:**
- База даних не створена
- Імпортуйте SQL файл: `backend/database/freelancehub.sql`
- Або створіть вручну: `CREATE DATABASE freelancehub;`

### Помилка: "Can't connect to MySQL server"
**Рішення:**
- Перевірте, чи запущений MySQL сервер
- Windows: Відкрийте **Services** → знайдіть **MySQL** → Start
- Перевірте порт: `netstat -an | findstr 3306`

---

## 📊 Тестування API

Після запуску перейдіть на:
```
http://localhost:5000
```

Ви повинні побачити:
```json
{
  "success": true,
  "message": "FreelanceHub API v1.0 (MySQL)",
  "database": "MySQL",
  "endpoints": {
    "auth": "/api/auth",
    "users": "/api/users",
    "projects": "/api/projects",
    ...
  }
}
```

---

## 🎯 Готово!

Тепер ваш backend працює з MySQL! 

**Наступні кроки:**
1. Запустіть frontend: `cd ../frontend && npm run dev`
2. Зареєструйте користувача
3. Створіть проєкт
4. Протестуйте функціонал

---

## 💡 Примітка

Цей backend працює **ТАК САМО**, як MongoDB версія, але використовує MySQL/Sequelize замість MongoDB/Mongoose.

Всі API endpoints залишаються **однаковими**!
