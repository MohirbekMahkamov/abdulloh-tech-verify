@echo off
chcp 65001 >nul
title XENOR X L-Verify Pro - Local Server
color 0B

echo.
echo ╔════════════════════════════════════════════════════╗
echo ║   XENOR X L-Verify Pro                            ║
echo ║   Localhost-da ishga tushirish                     ║
echo ╚════════════════════════════════════════════════════╝
echo.

REM ── Node.js borligini tekshirish ──
set "NPM_CMD=npm"
set "NPX_CMD=npx"

where npm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Node.js topildi!
    goto :START_APP
)

REM Keng tarqalgan joylashuvlarni tekshirish
if exist "C:\Program Files\nodejs\npm.cmd" (
    set "NPM_CMD=C:\Program Files\nodejs\npm.cmd"
    set "NPX_CMD=C:\Program Files\nodejs\npx.cmd"
    echo [OK] Node.js topildi: C:\Program Files\nodejs\
    goto :START_APP
)

if exist "%APPDATA%\nvm\current\npm.cmd" (
    set "NPM_CMD=%APPDATA%\nvm\current\npm.cmd"
    set "NPX_CMD=%APPDATA%\nvm\current\npx.cmd"
    echo [OK] Node.js (nvm) topildi!
    goto :START_APP
)

if exist "%LOCALAPPDATA%\Programs\nodejs\npm.cmd" (
    set "NPM_CMD=%LOCALAPPDATA%\Programs\nodejs\npm.cmd"
    set "NPX_CMD=%LOCALAPPDATA%\Programs\nodejs\npx.cmd"
    echo [OK] Node.js topildi: LocalAppData
    goto :START_APP
)

echo [XATO] Node.js topilmadi!
echo Node.js yuklab olish: https://nodejs.org
start https://nodejs.org
pause
exit /b 1

:START_APP
echo.
cd /d d:\Abdulloh-tech\frontend

echo [1/2] Kerakli paketlar o'rnatilmoqda (npm install)...
echo       Bu birinchi marta 1-2 daqiqa davom etishi mumkin...
echo.
call "%NPM_CMD%" install

echo.
echo [2/2] Frontend server ishga tushirilmoqda...
echo.
echo ╔════════════════════════════════════════════════════╗
echo ║                                                    ║
echo ║   Brauzerda quyidagi manzilni oching:              ║
echo ║                                                    ║
echo ║   http://localhost:3000                             ║
echo ║                                                    ║
echo ║   Admin panel:  http://localhost:3000/admin/login   ║
echo ║   Login: admin@abdulloh.tech                       ║
echo ║   Parol: Admin123!                                 ║
echo ║                                                    ║
echo ║   To'xtatish uchun: Ctrl+C bosing                  ║
echo ║                                                    ║
echo ╚════════════════════════════════════════════════════╝
echo.

call "%NPM_CMD%" run dev

pause
