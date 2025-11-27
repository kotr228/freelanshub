@echo off
echo ================================================
echo   FreelanceHub - Налаштування PHPMyAdmin
echo ================================================
echo.

REM Перевірка чи є папка freelancefub_3_0
if not exist "freelancefub_3_0" (
    echo [ПОМИЛКА] Папка freelancefub_3_0 не знайдена!
    echo Запустіть цей скрипт в папці де знаходиться freelancefub_3_0
    pause
    exit /b 1
)

echo [1/4] Створення .env для backend...
(
echo PORT=5000
echo NODE_ENV=development
echo.
echo # PHPMYADMIN / MYSQL
echo DB_HOST=localhost
echo DB_PORT=3306
echo DB_NAME=freelancehub
echo DB_USER=root
echo DB_PASSWORD=
echo.
echo # JWT
echo JWT_SECRET=freelancehub-secret-key-123456
echo JWT_EXPIRE=7d
echo.
echo # Frontend
echo CLIENT_URL=http://localhost:3000
) > freelancefub_3_0\backend\.env

echo [✓] Backend .env створено!
echo.

echo [2/4] Створення .env для frontend...
echo VITE_API_URL=http://localhost:5000/api > freelancefub_3_0\frontend\.env
echo [✓] Frontend .env створено!
echo.

echo [3/4] Копіювання SQL файлів...
if not exist "freelancefub_3_0\backend\database\" mkdir freelancefub_3_0\backend\database\
if exist "backend\database\freelancehub.sql" (
    copy backend\database\freelancehub.sql freelancefub_3_0\backend\database\ >nul
    echo [✓] SQL файл скопійовано!
) else (
    echo [!] SQL файл не знайдено, пропускаємо...
)
echo.

echo [4/4] Перевірка...
if exist "freelancefub_3_0\backend\.env" (
    echo [✓] Backend налаштовано
) else (
    echo [X] Backend НЕ налаштовано
)

if exist "freelancefub_3_0\frontend\.env" (
    echo [✓] Frontend налаштовано
) else (
    echo [X] Frontend НЕ налаштовано
)

echo.
echo ================================================
echo   Налаштування завершено!
echo ================================================
echo.
echo НАСТУПНІ КРОКИ:
echo.
echo 1. Відкрийте PHPMyAdmin: http://localhost/phpmyadmin
echo 2. Створіть базу даних: freelancehub
echo 3. Імпортуйте: freelancefub_3_0\backend\database\freelancehub.sql
echo.
echo 4. Запустіть backend:
echo    cd freelancefub_3_0\backend
echo    npm install
echo    npm run dev:mysql
echo.
echo 5. Запустіть frontend (в новому терміналі):
echo    cd freelancefub_3_0\frontend
echo    npm install
echo    npm run dev
echo.
echo ================================================
pause
