# 🛠️ MySQL Workbench - Інструкція встановлення FreelanceHub DB

## 📥 Метод 1: Імпорт SQL скрипту (Рекомендовано)

### Крок 1: Відкрийте MySQL Workbench
1. Запустіть **MySQL Workbench**
2. Підключіться до вашого MySQL сервера (Local instance)

### Крок 2: Відкрийте SQL файл
1. Натисніть **File** → **Open SQL Script**
2. Оберіть файл `freelancehub_workbench.sql`
3. Скрипт відкриється в новій вкладці

### Крок 3: Виконайте скрипт
1. Натисніть іконку **⚡ Execute** (або **Ctrl+Shift+Enter**)
2. Дочекайтеся завершення виконання
3. Перевірте вкладку **Output** на наявність помилок

### Крок 4: Оновіть список баз даних
1. Натисніть правою кнопкою на **Schemas** в лівій панелі
2. Оберіть **Refresh All**
3. Ви повинні побачити базу `freelancehub` з 7 таблицями

---

## 🎨 Метод 2: Створення через EER діаграму

### Крок 1: Створіть нову модель
1. **File** → **New Model**
2. **Add Diagram**

### Крок 2: Імпортуйте SQL
1. **File** → **Import** → **Reverse Engineer MySQL Create Script**
2. Оберіть `freelancehub_workbench.sql`
3. **Next** → **Finish**

### Крок 3: Перегляньте діаграму
Тепер ви можете побачити візуальну схему бази даних з усіма зв'язками!

### Крок 4: Синхронізуйте з сервером
1. **Database** → **Forward Engineer**
2. Оберіть ваш MySQL сервер
3. **Next** → **Execute**

---

## ✅ Перевірка встановлення

### У MySQL Workbench:

1. У панелі **Schemas** розгорніть `freelancehub`
2. Розгорніть **Tables**
3. Ви повинні побачити:
   - `users`
   - `projects`
   - `bids`
   - `reviews`
   - `messages`
   - `project_attachments`
   - `message_attachments`

### SQL запит для перевірки:

```sql
USE freelancehub;
SHOW TABLES;
SELECT COUNT(*) as total_tables FROM information_schema.tables 
WHERE table_schema = 'freelancehub';
```

Має повернути: **7 таблиць**

---

## 📊 Візуалізація схеми бази даних

### Створення EER діаграми з існуючої БД:

1. **Database** → **Reverse Engineer**
2. Виберіть підключення
3. **Next** → Оберіть схему `freelancehub` → **Next**
4. Оберіть всі таблиці → **Execute**
5. **Next** → **Finish**

Тепер ви можете побачити красиву діаграму зв'язків!

---

## 🔍 Корисні SQL запити для тестування

### 1. Перевірити користувачів:

```sql
USE freelancehub;

SELECT 
    id, 
    name, 
    email, 
    role, 
    rating,
    reviews_count,
    created_at
FROM users;
```

### 2. Перевірити проєкти:

```sql
SELECT 
    p.id,
    p.title,
    p.category,
    p.budget,
    p.status,
    u.name as client_name,
    p.bids_count
FROM projects p
JOIN users u ON p.client_id = u.id;
```

### 3. Перевірити заявки:

```sql
SELECT 
    b.id,
    p.title as project_title,
    u.name as freelancer_name,
    b.amount,
    b.delivery_time,
    b.status
FROM bids b
JOIN projects p ON b.project_id = p.id
JOIN users u ON b.freelancer_id = u.id;
```

### 4. Статистика по платформі:

```sql
SELECT 
    (SELECT COUNT(*) FROM users WHERE role = 'freelancer') as freelancers,
    (SELECT COUNT(*) FROM users WHERE role = 'client') as clients,
    (SELECT COUNT(*) FROM projects) as total_projects,
    (SELECT COUNT(*) FROM projects WHERE status = 'open') as open_projects,
    (SELECT COUNT(*) FROM bids) as total_bids;
```

---

## 🔧 Налаштування підключення в Workbench

### Створення нового підключення:

1. На головній сторінці Workbench натисніть **[+]** біля **MySQL Connections**
2. Введіть параметри:
   - **Connection Name**: FreelanceHub Local
   - **Hostname**: localhost (або 127.0.0.1)
   - **Port**: 3306
   - **Username**: root (або ваш користувач)
   - **Password**: (збережіть в vault)
3. **Test Connection**
4. Якщо успішно → **OK**

---

## 🗃️ Експорт даних

### Експорт структури та даних:

1. **Server** → **Data Export**
2. Оберіть схему `freelancehub`
3. Оберіть опцію:
   - **Export to Self-Contained File** (один файл)
   - Або **Export to Dump Project Folder** (папка з окремими файлами)
4. **Include Create Schema**: ✅
5. **Start Export**

---

## 📋 Backup та Restore

### Створення бекапу:

```sql
-- У Workbench:
Server → Data Export → Export to Self-Contained File
```

### Відновлення з бекапу:

```sql
-- У Workbench:
Server → Data Import → Import from Self-Contained File
```

Або через командний рядок:

```bash
# Backup
mysqldump -u root -p freelancehub > backup.sql

# Restore
mysql -u root -p freelancehub < backup.sql
```

---

## 🐛 Усунення проблем

### Помилка: "Can't connect to MySQL server"

**Рішення:**
1. Перевірте, чи запущений MySQL сервер
2. У Windows: Відкрийте **Services** → знайдіть **MySQL** → Start
3. У Mac/Linux: `sudo systemctl start mysql`

### Помилка: "Access denied for user"

**Рішення:**
1. Перевірте username та password
2. Спробуйте змінити пароль:
```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'новий_пароль';
FLUSH PRIVILEGES;
```

### Помилка: "Table already exists"

**Рішення:**
Скрипт автоматично видаляє існуючі таблиці (`DROP TABLE IF EXISTS`), але якщо проблема залишається:

```sql
DROP DATABASE IF EXISTS freelancehub;
```

Потім виконайте скрипт знову.

### Помилка з JSON полями (старі версії MySQL)

JSON підтримується з MySQL 5.7.8+. Якщо у вас старіша версія:
1. Оновіть MySQL до версії 5.7.8 або новішої
2. Або замініть `JSON` на `TEXT` у скрипті

---

## 💡 Корисні поради

### 1. Автоматичне форматування SQL
**Натисніть**: `Ctrl + B` для beautify SQL коду

### 2. Виконання частини запиту
Виділіть потрібні рядки → `Ctrl + Shift + Enter`

### 3. Експорт результатів
Після виконання запиту → правою кнопкою на результатах → **Export**

### 4. Збереження запитів
**File** → **Save Script** для збереження часто використовуваних запитів

### 5. Створення представлень (Views)
```sql
CREATE VIEW active_projects AS
SELECT p.*, u.name as client_name
FROM projects p
JOIN users u ON p.client_id = u.id
WHERE p.status = 'open';
```

---

## 🎓 Додаткові ресурси

- [MySQL Workbench Documentation](https://dev.mysql.com/doc/workbench/en/)
- [MySQL Tutorial](https://www.mysqltutorial.org/)
- Основний README проєкту: `README.md`

---

✅ **Готово!** Ваша база даних FreelanceHub готова до використання!
