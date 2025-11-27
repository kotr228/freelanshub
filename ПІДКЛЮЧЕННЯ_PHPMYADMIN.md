# 🔌 Підключення до PHPMyAdmin (MySQL)

## 📋 Покрокова інструкція

### Крок 1: Створіть базу даних в PHPMyAdmin

1. Відкрийте PHPMyAdmin: `http://localhost/phpmyadmin`
2. Клікніть **"Нова"** (New) зліва
3. Введіть назву: `freelancehub`
4. Кодування: `utf8mb4_unicode_ci`
5. Натисніть **"Створити"**

### Крок 2: Імпортуйте структуру БД

1. Оберіть базу `freelancehub`
2. Вкладка **"Імпорт"**
3. **"Виберіть файл"** → оберіть `backend/database/freelancehub.sql`
4. Натисніть **"Вперед"**
5. Дочекайтеся: "Імпорт успішно завершено" ✅

### Крок 3: Налаштуйте .env файл

У папці `freelancefub_3_0/backend/` створіть файл `.env`:

```env
PORT=5000
NODE_ENV=development

# PHPMYADMIN / MYSQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=freelancehub
DB_USER=root
DB_PASSWORD=

# JWT
JWT_SECRET=your-secret-key-123
JWT_EXPIRE=7d

# Frontend
CLIENT_URL=http://localhost:3000
```

---

## 🎯 Заповнення даних:

### Для XAMPP:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=freelancehub
DB_USER=root
DB_PASSWORD=
```
*(пароль порожній за замовчуванням)*

### Для WAMP:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=freelancehub
DB_USER=root
DB_PASSWORD=
```

### Для MAMP (Mac):
```env
DB_HOST=localhost
DB_PORT=8889
DB_NAME=freelancehub
DB_USER=root
DB_PASSWORD=root
```

### Для Laravel Valet / Herd:
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=freelancehub
DB_USER=root
DB_PASSWORD=
```

---

## 🚀 Крок 4: Запуск

### У папці `freelancefub_3_0/backend/`:

```bash
# Встановіть залежності (якщо ще не зробили)
npm install

# Запустіть MySQL версію
npm run dev:mysql
```

### У папці `freelancefub_3_0/frontend/`:

```bash
# Встановіть залежності
npm install

# Запустіть frontend
npm run dev
```

---

## ✅ Перевірка підключення

### 1. Backend має показати:
```
🔌 Підключення до MySQL...
✅ MySQL підключено: localhost
✅ Моделі синхронізовано

╔═══════════════════════════════════════════════╗
║   🚀 FreelanceHub Server (MySQL)              ║
║   📡 Порт: 5000                               ║
║   💾 MySQL підключено                         ║
╚═══════════════════════════════════════════════╝
```

### 2. Перевірте API:
Відкрийте: `http://localhost:5000`

Має показати:
```json
{
  "success": true,
  "message": "FreelanceHub API v1.0 (MySQL)",
  "database": "MySQL"
}
```

### 3. Frontend:
Відкрийте: `http://localhost:3000`

---

## 🔧 Налаштування PHPMyAdmin

### Якщо не можете підключитися:

**1. Перевірте чи запущений MySQL:**
- XAMPP: відкрийте Control Panel → Start MySQL
- WAMP: іконка в треї → Start MySQL

**2. Перевірте порт:**
```bash
netstat -an | findstr 3306
```

**3. Створіть користувача (якщо root не працює):**

У PHPMyAdmin → вкладка **"Облікові записи"**:

```sql
CREATE USER 'freelancehub'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON freelancehub.* TO 'freelancehub'@'localhost';
FLUSH PRIVILEGES;
```

Тоді в `.env`:
```env
DB_USER=freelancehub
DB_PASSWORD=password123
```

---

## 📁 Структура файлів

Ваша папка `freelancefub_3_0` має виглядати так:

```
freelancefub_3_0/
├── backend/
│   ├── src/
│   ├── .env          ← СТВОРІТЬ ЦЕЙ ФАЙЛ!
│   ├── package.json
│   └── database/
│       └── freelancehub.sql  ← Імпортуйте в PHPMyAdmin
│
└── frontend/
    ├── src/
    ├── .env          ← СТВОРІТЬ: VITE_API_URL=http://localhost:5000/api
    └── package.json
```

---

## 🐛 Усунення проблем

### Помилка: "MYSQL налаштування не знайдено"
✅ Створіть файл `.env` в папці `backend/`

### Помилка: "Access denied"
✅ Перевірте `DB_USER` та `DB_PASSWORD`
✅ Для XAMPP пароль зазвичай порожній

### Помилка: "Unknown database"
✅ Створіть БД в PHPMyAdmin: `CREATE DATABASE freelancehub;`
✅ Імпортуйте SQL файл

### Помилка: "Can't connect to MySQL"
✅ Запустіть MySQL в XAMPP/WAMP
✅ Перевірте порт (3306)

---

## 🎉 Готово!

Тепер ваш FreelanceHub працює з PHPMyAdmin!

**Тестування:**
1. Зареєструйте користувача: `http://localhost:3000/register`
2. Створіть проєкт
3. Перевірте в PHPMyAdmin → таблиця `users` та `projects`

Дані зберігаються в **вашій локальній MySQL базі**! ✅
