# 📦 Інструкція з білду та деплою FreelanceHub

## 🏗️ 1. БІЛД ПРОЄКТУ

### Frontend (Next.js 14)

```bash
cd frontend
npm install
npm run build
```

**Що створює білд:**
- `.next/` - папка з оптимізованим production build
- `.next/standalone/` - самодостатня версія для деплою
- `.next/static/` - статичні файли (JS, CSS, зображення)

**Перевірка білду локально:**
```bash
npm start
# Сервер запуститься на http://localhost:5173
```

### Backend (Node.js + Express + MySQL)

```bash
cd backend
npm install
```

**Backend не потребує білду**, але потрібно:
- Налаштувати `.env` файл
- Переконатись що MySQL база даних доступна
- Запустити міграції/створити таблиці

---

## 🚀 2. ЩО ВИВАНТАЖИТИ НА СЕРВЕР

### Frontend файли:

```
frontend/
├── .next/                    # Build папка (обов'язково!)
├── public/                   # Статичні файли
├── node_modules/             # Або встановити на сервері
├── package.json              # Обов'язково
├── package-lock.json         # Обов'язково
├── next.config.js            # Конфігурація Next.js
└── .env.production           # Production змінні оточення
```

### Backend файли:

```
backend/
├── src/                      # Всі вихідні файли
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server-mysql.js
├── node_modules/             # Або встановити на сервері
├── package.json              # Обов'язково
├── package-lock.json         # Обов'язково
└── .env                      # Production змінні оточення
```

### ⚠️ НЕ ВИВАНТАЖУВАТИ:
- `.git/` - версіонування не потрібне на продакшені
- `node_modules/` якщо плануєте `npm install` на сервері
- `.env.local`, `.env.development` - тільки production .env
- IDE файли (`.vscode/`, `.idea/`)

---

## 🌍 3. НАЛАШТУВАННЯ ЗМІННИХ ОТОЧЕННЯ

### Frontend `.env.production`:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Backend `.env`:

```env
# База даних MySQL
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=freelancehub
DB_DIALECT=mysql

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d

# Сервер
PORT=5000
NODE_ENV=production

# CORS
CLIENT_URL=https://yourdomain.com

# Email (якщо використовується)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@email.com
EMAIL_PASS=your_email_password
```

---

## 🖥️ 4. ДЕПЛОЙ НА СЕРВЕР

### Варіант А: Традиційний VPS/Dedicated сервер

#### 1. Підготовка сервера (Ubuntu/Debian):

```bash
# Оновлення системи
sudo apt update && sudo apt upgrade -y

# Встановлення Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Встановлення MySQL
sudo apt install mysql-server -y
sudo mysql_secure_installation

# Встановлення PM2 (процес-менеджер)
sudo npm install -g pm2

# Встановлення Nginx
sudo apt install nginx -y
```

#### 2. Завантаження файлів на сервер:

```bash
# Використовуйте scp, rsync або git
rsync -avz --exclude 'node_modules' ./frontend/ user@server:/var/www/freelancehub/frontend/
rsync -avz --exclude 'node_modules' ./backend/ user@server:/var/www/freelancehub/backend/
```

#### 3. Налаштування Backend:

```bash
cd /var/www/freelancehub/backend
npm install --production
pm2 start src/server-mysql.js --name "freelancehub-api"
pm2 save
pm2 startup
```

#### 4. Налаштування Frontend:

```bash
cd /var/www/freelancehub/frontend
npm install --production
npm run build
pm2 start npm --name "freelancehub-web" -- start
pm2 save
```

#### 5. Налаштування Nginx (reverse proxy):

```nginx
# /etc/nginx/sites-available/freelancehub

# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Активувати конфігурацію:

```bash
sudo ln -s /etc/nginx/sites-available/freelancehub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. Налаштування SSL (Let's Encrypt):

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

### Варіант Б: Vercel (Frontend) + Railway/Render (Backend)

#### Frontend на Vercel:

1. Перейдіть на [vercel.com](https://vercel.com)
2. Підключіть GitHub репозиторій
3. Встановіть налаштування:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Environment Variables**: Додайте `NEXT_PUBLIC_API_URL`
4. Deploy!

#### Backend на Railway:

1. Перейдіть на [railway.app](https://railway.app)
2. Створіть новий проект з GitHub
3. Додайте MySQL базу даних
4. Встановіть змінні оточення з `.env`
5. Встановіть start command: `npm run dev`
6. Deploy!

### Варіант В: Docker (рекомендовано для масштабування)

#### Створіть `docker-compose.yml`:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: freelancehub
      MYSQL_USER: freelanceuser
      MYSQL_PASSWORD: freelancepass
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      DB_HOST: mysql
      DB_USER: freelanceuser
      DB_PASSWORD: freelancepass
      DB_NAME: freelancehub
      JWT_SECRET: your_secret
    depends_on:
      - mysql

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      NEXT_PUBLIC_API_URL: http://backend:5000
    depends_on:
      - backend

volumes:
  mysql_data:
```

Запуск:

```bash
docker-compose up -d
```

---

## 🔍 5. SEO НАЛАШТУВАННЯ (УЖЕ ЗРОБЛЕНО!)

### ✅ Що вже налаштовано:

1. **Metadata в `layout.jsx`**:
   - Open Graph теги для соцмереж
   - Twitter Card
   - Keywords та description
   - Structured metadata

2. **Автоматична генерація `sitemap.xml`**:
   - Next.js автоматично створить на `/sitemap.xml`
   - Оновлюється при кожному білді

3. **Автоматична генерація `robots.txt`**:
   - Доступний на `/robots.txt`
   - Налаштовані правила для пошукових ботів

4. **PWA Manifest**:
   - Додаток можна встановити як PWA
   - Чорно-жовта тема

### 📝 Додаткові рекомендації SEO:

1. **Додайте іконки** в `frontend/public/`:
   - `favicon.ico` (32x32)
   - `icon-192.png` (192x192)
   - `icon-512.png` (512x512)
   - `apple-touch-icon.png` (180x180)

2. **Google Search Console**:
   - Зареєструйте сайт на [search.google.com/search-console](https://search.google.com/search-console)
   - Додайте код верифікації в `layout.jsx` → `metadata.verification.google`

3. **Yandex Webmaster**:
   - Зареєструйте на [webmaster.yandex.ua](https://webmaster.yandex.ua)
   - Додайте код верифікації в `metadata.verification.yandex`

4. **Структуровані дані (Schema.org)**:
   - Додайте JSON-LD для кращої індексації
   - Приклад для головної сторінки:

```jsx
// В page.jsx головної сторінки
export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'FreelanceHub',
    description: 'Платформа для фрілансерів та замовників',
    url: 'https://yourdomain.com',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ваш контент */}
    </>
  );
}
```

5. **Додайте metadata для кожної сторінки**:

```jsx
// Приклад для projects/page.jsx
export const metadata = {
  title: 'Проєкти',
  description: 'Знайдіть цікаві проєкти для фрілансу на FreelanceHub',
};
```

---

## ✅ ЧЕКЛИСТ ПЕРЕД ДЕПЛОЄМ

- [ ] Білд успішний (`npm run build`)
- [ ] Всі .env змінні налаштовані для production
- [ ] MySQL база даних створена та доступна
- [ ] SSL сертифікат налаштований (HTTPS)
- [ ] Favicon та іконки додані в `/public`
- [ ] Google Analytics додано (опціонально)
- [ ] Backup стратегія налаштована
- [ ] Моніторинг налаштовано (PM2, Sentry)
- [ ] Домен налаштовано та DNS записи активні

---

## 🔧 КОРИСНІ КОМАНДИ

```bash
# PM2 команди
pm2 list                    # Список процесів
pm2 logs freelancehub-api   # Логи backend
pm2 logs freelancehub-web   # Логи frontend
pm2 restart all             # Перезапуск всіх
pm2 stop all                # Зупинка всіх
pm2 delete all              # Видалення всіх

# Nginx
sudo systemctl status nginx
sudo systemctl restart nginx
sudo nginx -t               # Перевірка конфігурації

# MySQL
sudo systemctl status mysql
mysql -u root -p
```

---

## 🎉 ГОТОВО!

Ваш FreelanceHub проект готовий до production деплою з повним SEO налаштуванням!

**Питання?** Перевірте логи: `pm2 logs` або `sudo tail -f /var/log/nginx/error.log`
