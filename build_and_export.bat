@echo off
setlocal enabledelayedexpansion

:: Add standard Windows system folders to PATH in case they are missing from user environment
set "PATH=C:\Windows\System32;C:\Windows\System32\Wbem;C:\Windows\System32\WindowsPowerShell\v1.0\;%PATH%"

echo ===================================================
echo XENOR X - Frontend static export boshlanmoqda...
echo ===================================================

:: 1. Check if npm is already in PATH
where npm >nul 2>nul
if %ERRORLEVEL% equ 0 (
    set "DETECTED_PATH="
    goto :check_url
)

:: 2. Auto-detect Node.js in common paths
echo [Info] npm aniqlanmadi. Node.js qidirilmoqda...
set "DETECTED_PATH="

if exist "C:\Program Files\nodejs\npm.cmd" (
    set "DETECTED_PATH=C:\Program Files\nodejs"
    goto :found
)
if exist "C:\Program Files (x86)\nodejs\npm.cmd" (
    set "DETECTED_PATH=C:\Program Files (x86)\nodejs"
    goto :found
)
if exist "%USERPROFILE%\AppData\Local\Programs\nodejs\npm.cmd" (
    set "DETECTED_PATH=%USERPROFILE%\AppData\Local\Programs\nodejs"
    goto :found
)
if exist "%USERPROFILE%\AppData\Roaming\nvm\nodejs\npm.cmd" (
    set "DETECTED_PATH=%USERPROFILE%\AppData\Roaming\nvm\nodejs"
    goto :found
)
if exist "C:\ProgramData\nvm\nodejs\npm.cmd" (
    set "DETECTED_PATH=C:\ProgramData\nvm\nodejs"
    goto :found
)
if exist "%USERPROFILE%\AppData\Roaming\npm\npm.cmd" (
    set "DETECTED_PATH=%USERPROFILE%\AppData\Roaming\npm"
    goto :found
)

for /d %%d in ("%USERPROFILE%\AppData\Roaming\nvm\v*") do (
    if exist "%%d\npm.cmd" (
        set "DETECTED_PATH=%%d"
        goto :found
    )
)

echo.
echo [Xatolik] Tizimda Node.js (npm) topilmadi!
echo Iltimos, Node.js ni o'rnating: https://nodejs.org/
echo O'rnatgandan so'ng ushbu skriptni qayta ishga tushiring.
pause
exit /b 1

:found
echo [Muvaffaqiyat] Node.js topildi: !DETECTED_PATH!
set "PATH=!DETECTED_PATH!;%PATH%"

:check_url
echo.
echo ===================================================
echo Backend URL Sozlamalari (Railway API)
echo ===================================================

set "ENV_FILE=d:\Abdulloh-tech\frontend\.env.local"
set "CURRENT_URL="

:: Read current URL if exists
if exist "%ENV_FILE%" (
    for /f "tokens=2 delims==" %%i in ('type "%ENV_FILE%" ^| findstr "NEXT_PUBLIC_API_URL"') do (
        set "CURRENT_URL=%%i"
    )
)

if not "!CURRENT_URL!"=="" (
    :: Remove /api/v1 suffix for displaying to user
    set "DISPLAY_URL=!CURRENT_URL:/api/v1=!"
    echo Hozirgi saqlangan Backend URL: !DISPLAY_URL!
    set /p "ans=Ushbu URLni saqlab qolishni xohlaysizmi? (y/n): "
    if /i "!ans!"=="y" (
        goto :build
    )
    if /i "!ans!"=="" (
        goto :build
    )
)

echo.
echo Iltimos, Railway'dagi backend URL manzilini kiriting.
echo Masalan: https://abdulloh-tech-production.up.railway.app
set /p "USER_URL=Backend URL: "

:: Trim spaces
set "USER_URL=%USER_URL: =%"

:: If user didn't enter anything, default to localhost
if "%USER_URL%"=="" (
    set "USER_URL=http://localhost:8080"
    echo.
    echo [Info] URL kiritilmadi. Standart localhost ulanmoqda.
)

:: Remove trailing slash if present
if "%USER_URL:~-1%"=="/" set "USER_URL=%USER_URL:~0,-1%"

:: Save to .env.local
echo NEXT_PUBLIC_API_URL=%USER_URL%/api/v1 > "%ENV_FILE%"
echo [Muvaffaqiyat] Yangi URL saqlandi: %USER_URL%

:build
echo.
echo ===================================================
echo Loyihani build qilish boshlanmoqda...
echo ===================================================
cd /d "d:\Abdulloh-tech\frontend"
call npm run build
if %ERRORLEVEL% neq 0 (
    echo.
    echo [Xatolik] Frontend build qilishda xatolik yuz berdi.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ===================================================
echo Build muvaffaqiyatli tugadi. Out papkasi Desktopga nusxalanmoqda...
echo ===================================================
if exist "%USERPROFILE%\Desktop\out" (
    echo Eskisi o'chirilmoqda...
    rmdir /s /q "%USERPROFILE%\Desktop\out"
)
xcopy /E /I /Y "out" "%USERPROFILE%\Desktop\out"

echo.
echo ===================================================
echo Barcha ishlar bajarildi!
echo Desktopda "out" papkasi yaratildi.
echo Uni Eskiz.uz xostingidagi domainingizga yuklashingiz mumkin.
echo ===================================================
pause
