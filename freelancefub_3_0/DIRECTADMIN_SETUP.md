# 🚀 Інструкція з деплою на DirectAdmin

## Крок 1: Завантажте файли на сервер

### Варіант A: Через Git (рекомендовано)

```bash
# Підключіться до сервера через SSH
ssh your_username@freelanshub.com.ua

# Перейдіть до папки сайту
cd ~/domains/freelanshub.com.ua/public_html

# Клонуйте репозиторій
git clone https://github.com/kotr228/freelanshub.git .
cd freelancefub_3_0
```

### Варіант B: Через FTP/File Manager

1. Завантажте всю папку `freelancefub_3_0` на сервер
2. Розмістіть її в `/home/YOUR_USERNAME/domains/freelanshub.com.ua/public_html/`

---

## Крок 2: Встановіть залежності

```bash
# Frontend
cd ~/domains/freelanshub.com.ua/public_html/freelancefub_3_0/frontend
npm install --production

# Backend
cd ~/domains/freelanshub.com.ua/public_html/freelancefub_3_0/backend
npm install --production
```

---

## Крок 3: Налаштуйте змінні оточення

### Frontend (.env)

Створіть файл `frontend/.env`:

```env
NEXT_PUBLIC_API_URL=http://freelanshub.com.ua:5000
NEXT_PUBLIC_SITE_URL=http://freelanshub.com.ua
NODE_ENV=production
```

### Backend (.env)

Створіть файл `backend/.env`:

```env
# Database
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=freelancehub
DB_DIALECT=mysql

# JWT
JWT_SECRET=ваш_дуже_секретний_ключ_змініть_це
JWT_EXPIRE=30d

# Server
PORT=5000
NODE_ENV=production

# CORS
CLIENT_URL=http://freelanshub.com.ua
```

---

## Крок 4: Створіть базу даних

1. Увійдіть в DirectAdmin
2. Перейдіть в **MySQL Management**
3. Створіть нову базу даних: `freelancehub`
4. Створіть користувача та надайте йому всі права

Імпортуйте структуру:

```bash
mysql -u your_db_user -p freelancehub < backend/database/schema.sql
```

---

## Крок 5: Налаштуйте Node.js Web Application для Frontend

В DirectAdmin перейдіть в **Web Applications** → **CREATE APPLICATION**:

### Налаштування:

- **Node.js version**: `10.24.1` або найновіша доступна
- **Application mode**: `Production`
- **Application root**: `/home/YOUR_USERNAME/domains/freelanshub.com.ua/public_html/freelancefub_3_0/frontend`
- **Application URL**: `freelanshub.com.ua`
- **Application startup file**: `server.js`

### Environment variables (ADD VARIABLE):

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_URL` | `http://freelanshub.com.ua:5000` |
| `NEXT_PUBLIC_SITE_URL` | `http://freelanshub.com.ua` |
| `PORT` | `3000` |
| `NODE_ENV` | `production` |

Натисніть **CREATE**.

---

## Крок 6: Налаштуйте Node.js Web Application для Backend

Створіть ще одне application:

### Налаштування:

- **Node.js version**: `10.24.1` або найновіша доступна
- **Application mode**: `Production`
- **Application root**: `/home/YOUR_USERNAME/domains/freelanshub.com.ua/public_html/freelancefub_3_0/backend`
- **Application URL**: `api.freelanshub.com.ua` (або піддомен)
- **Application startup file**: `src/server-mysql.js`

### Environment variables:

Додайте всі змінні з `backend/.env`

---

## Крок 7: Зробіть білд Frontend

**ВАЖЛИВО:** Білд потрібно зробити **після** створення application в DirectAdmin!

```bash
cd ~/domains/freelanshub.com.ua/public_html/freelancefub_3_0/frontend
npm run build
```

Після білду DirectAdmin автоматично перезапустить додаток.

---

## Крок 8: Перевірка

Відкрийте у браузері:

- **Frontend**: http://freelanshub.com.ua
- **Backend API**: http://freelanshub.com.ua:5000 (або http://api.freelanshub.com.ua)

---

## 🔧 Налагодження

### Переглянути логи:

В DirectAdmin → **Web Applications** → натисніть на вашу application → **View Logs**

### Перезапустити application:

В DirectAdmin → **Web Applications** → натисніть на вашу application → **Restart**

### Оновити код з Git:

```bash
cd ~/domains/freelanshub.com.ua/public_html/freelancefub_3_0
git pull origin claude/analyze-core-issues-013hLr21mNb33ZyuHaX5EdbC
cd frontend && npm install && npm run build
```

Потім перезапустіть application в DirectAdmin.

---

## 📝 Альтернатива: PM2 (якщо є SSH доступ)

Якщо у вас є повний SSH доступ:

```bash
# Встановіть PM2
npm install -g pm2

# Запустіть Frontend
cd ~/domains/freelanshub.com.ua/public_html/freelancefub_3_0/frontend
pm2 start server.js --name "freelancehub-web"

# Запустіть Backend
cd ~/domains/freelanshub.com.ua/public_html/freelancefub_3_0/backend
pm2 start src/server-mysql.js --name "freelancehub-api"

# Зберегти для автозапуску
pm2 save
pm2 startup
```

---

## ✅ Чеклист

- [ ] Файли завантажені на сервер
- [ ] npm install виконано для frontend і backend
- [ ] .env файли створені та налаштовані
- [ ] MySQL база даних створена та імпортована
- [ ] Node.js Web Applications створені в DirectAdmin
- [ ] Environment variables додані
- [ ] npm run build виконано для frontend
- [ ] Сайт відкривається в браузері
- [ ] API відповідає на запити

---

**Потрібна допомога?** Перевірте логи в DirectAdmin Web Applications!
