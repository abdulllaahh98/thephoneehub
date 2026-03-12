@echo off
setlocal enabledelayedexpansion

echo ======================================================
echo           THE PHONE HUB - STARTUP ENGINE
echo ======================================================
echo.

:: 1. Check for MySQL
echo [1/3] Checking MySQL Database status...
:: Try to find XAMPP directory
set "XAMPP_DIR=C:\xampp"

:: Check if MySQL is already running on 3306
netstat -ano | findstr :3306 >nul
if !errorlevel! equ 0 (
    echo [SUCCESS] MySQL is already running.
) else (
    echo [INFO] MySQL is not running. Attempting to start...
    if exist "!XAMPP_DIR!\mysql\bin\mysqld.exe" (
        start "MySQL Server" /min "!XAMPP_DIR!\mysql\bin\mysqld.exe" --defaults-file="!XAMPP_DIR!\mysql\bin\my.ini"
        echo [INFO] Startup command sent. Waiting 5 seconds...
        timeout /t 5 /nobreak >nul
        netstat -ano | findstr :3306 >nul
        if !errorlevel! equ 0 (
            echo [SUCCESS] MySQL started successfully.
        ) else (
            echo [ERROR] MySQL failed to start automatically.
            echo        PLEASE OPEN XAMPP CONTROL PANEL AND CLICK 'START' ON MYSQL manually.
            pause
        )
    ) else (
        echo [ERROR] MySQL not found in !XAMPP_DIR!. 
        echo        PLEASE START MYSQL MANUALLY FROM XAMPP.
        pause
    )
)

:: 2. Start Backend
echo [2/3] Starting Backend (Laravel)...
cd /d "c:\xampp\htdocs\anti-phone\backend"
:: Check if port 8000 is occupied
netstat -ano | findstr :8000 >nul
if !errorlevel! equ 0 (
    echo [WARNING] Port 8000 is occupied. Restarting backend...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000') do taskkill /f /pid %%a >nul 2>&1
)
start "TPH-BACKEND" php artisan serve --host=127.0.0.1 --port=8000

:: 3. Start Frontend
echo [3/3] Starting Frontend (React)...
cd /d "c:\xampp\htdocs\anti-phone\frontend"
:: Check if port 5173 is occupied
netstat -ano | findstr :5173 >nul
if !errorlevel! equ 0 (
    echo [INFO] Port 5173 is occupied. Vite will try the next available port.
)
start "TPH-FRONTEND" npm run dev

echo.
echo ======================================================
echo PROJECT STATUS: 
echo.
echo FRONTEND URL: http://127.0.0.1:5173
echo BACKEND URL:  http://127.0.0.1:8000
echo ======================================================
echo.
echo CRITICAL: If you get "Registration Failed" or "Connection Failed", 
echo           check XAMPP and make sure MySQL (port 3306) is GREEN.
echo.
choice /M "Open website now?" /C YN
if !errorlevel! equ 1 start http://127.0.0.1:5173

echo.
echo Keep this window open. Press any key to exit script (servers will keep running).
pause
