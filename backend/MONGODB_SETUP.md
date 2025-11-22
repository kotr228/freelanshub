# 🗄️ Налаштування MongoDB

## Швидкий старт (MongoDB Atlas - РЕКОМЕНДОВАНО)

### 1. Створіть безкоштовний акаунт
- Перейдіть: https://www.mongodb.com/cloud/atlas/register
- Зареєструйтеся (email + пароль)

### 2. Створіть кластер
- Натисніть **"Build a Database"**
- Оберіть **FREE** (M0 Sandbox)
- Оберіть регіон (Frankfurt або Amsterdam для України)
- Натисніть **"Create"**

### 3. Налаштуйте безпеку
**Database Access:**
- Перейдіть в **Database Access**
- Натисніть **"Add New Database User"**
- Username: `freelanceuser`
- Password: створіть складний пароль (ЗБЕРЕЖІТЬ ЦЕЙ ПАРОЛЬ!)
- Database User Privileges: **Read and write to any database**

**Network Access:**
- Перейдіть в **Network Access**
- Натисніть **"Add IP Address"**
- Натисніть **"Allow Access from Anywhere"** (0.0.0.0/0)
- Confirm

### 4. Отримайте Connection String
- Поверніться до **Database**
- Натисніть **"Connect"** на вашому кластері
- Оберіть **"Connect your application"**
- Скопіюйте Connection String (виглядає так):

```
mongodb+srv://freelanceuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 5. Оновіть .env файл

У файлі `backend/.env` замініть рядок:

```env
MONGODB_URI=mongodb+srv://freelanceuser:ВАШ_ПАРОЛЬ@cluster0.xxxxx.mongodb.net/freelancehub?retryWrites=true&w=majority
```

**ВАЖЛИВО:** 
- Замініть `<password>` на ваш справжній пароль
- Замініть `xxxxx` на вашу адресу кластера
- Додайте `/freelancehub` після `.net`

### 6. Запустіть сервер

```bash
npm run dev
```

Ви повинні побачити: ✅ MongoDB підключено!

---

## Альтернатива: Локальна MongoDB на Windows

### 1. Завантажте MongoDB
- Перейдіть: https://www.mongodb.com/try/download/community
- Оберіть версію для Windows
- Завантажте MSI інсталятор

### 2. Встановіть MongoDB
- Запустіть завантажений .msi файл
- Оберіть **"Complete"**
- Залишіть галочку **"Install MongoDB as a Service"**
- Завершіть встановлення

### 3. Перевірте, що MongoDB запущена

Відкрийте PowerShell від імені Адміністратора:

```powershell
# Перевірити статус
Get-Service MongoDB

# Запустити (якщо не запущена)
net start MongoDB
```

### 4. Перевірте підключення

Ваш .env вже налаштований для локальної MongoDB:

```env
MONGODB_URI=mongodb://localhost:27017/freelancehub
```

### 5. Запустіть сервер

```bash
npm run dev
```

---

## 🐛 Усунення проблем

### Помилка: "MONGODB_URI не знайдено"
- Переконайтеся, що файл `.env` знаходиться в папці `backend/`
- Перезапустіть сервер після зміни `.env`

### Помилка: "Authentication failed"
- Перевірте правильність username та password
- Переконайтеся, що пароль не містить спецсимволів (або закодуйте їх)

### Помилка: "Connection timeout"
- Перевірте Network Access в MongoDB Atlas
- Переконайтеся, що ваш IP дозволений (або 0.0.0.0/0)

### Локальна MongoDB не запускається
```powershell
# Перевірте чи встановлена
mongod --version

# Створіть папку для даних (якщо потрібно)
mkdir C:\data\db

# Запустіть вручну
mongod
```

---

## ✅ Тестування підключення

Коли сервер запущений, ви повинні побачити:

```
🔌 Підключення до MongoDB...
✅ MongoDB підключено: cluster0-shard-00-00.xxxxx.mongodb.net
```

або (для локальної):

```
🔌 Підключення до MongoDB...
✅ MongoDB підключено: localhost
```

Якщо бачите це - все працює! 🎉
