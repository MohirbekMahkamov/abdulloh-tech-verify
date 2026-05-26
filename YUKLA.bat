@echo off
chcp 65001 >nul
title GitHub-ga yuklash
color 0A

echo.
echo ========================================
echo   ABDULLOH-TECH - GitHub-ga yuklanmoqda
echo ========================================
echo.

REM ── Git joylashuvini avtomatik topish ──
set "GIT_CMD=git"

REM Tekshirish: git PATH-da bormi?
where git >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Git topildi: PATH orqali
    goto :START_PUSH
)

REM Keng tarqalgan joylashuvlarni tekshirish
if exist "C:\Program Files\Git\bin\git.exe" (
    set "GIT_CMD=C:\Program Files\Git\bin\git.exe"
    echo [OK] Git topildi: C:\Program Files\Git\bin\
    goto :START_PUSH
)

if exist "C:\Program Files (x86)\Git\bin\git.exe" (
    set "GIT_CMD=C:\Program Files (x86)\Git\bin\git.exe"
    echo [OK] Git topildi: C:\Program Files (x86)\Git\bin\
    goto :START_PUSH
)

if exist "%LOCALAPPDATA%\Programs\Git\bin\git.exe" (
    set "GIT_CMD=%LOCALAPPDATA%\Programs\Git\bin\git.exe"
    echo [OK] Git topildi: %LOCALAPPDATA%\Programs\Git\bin\
    goto :START_PUSH
)

if exist "%USERPROFILE%\AppData\Local\Programs\Git\bin\git.exe" (
    set "GIT_CMD=%USERPROFILE%\AppData\Local\Programs\Git\bin\git.exe"
    echo [OK] Git topildi: AppData\Local\Programs\Git\bin\
    goto :START_PUSH
)

REM Diskdan qidirish
echo [INFO] Git qidirilmoqda...
for /f "delims=" %%i in ('dir /s /b "C:\git.exe" 2^>nul') do (
    set "GIT_CMD=%%i"
    echo [OK] Git topildi: %%i
    goto :START_PUSH
)

REM Git topilmadi - yuklab olish kerak
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║  [XATO] Git kompyuteringizda o'rnatilmagan!           ║
echo ║                                                        ║
echo ║  Git-ni yuklab olish uchun quyidagi havola ochiladi:   ║
echo ║  https://git-scm.com/download/win                      ║
echo ║                                                        ║
echo ║  O'rnatib bo'lgach, ushbu skriptni qayta ishga         ║
echo ║  tushiring.                                            ║
echo ╚════════════════════════════════════════════════════════╝
echo.
start https://git-scm.com/download/win
pause
exit /b 1

:START_PUSH
echo.
cd /d d:\Abdulloh-tech

echo [1/4] Git ishga tushirilmoqda...
"%GIT_CMD%" init

echo.
echo [2/4] Fayllar qo'shilmoqda...
"%GIT_CMD%" add .

echo.
echo [3/4] Commit qilinmoqda...
"%GIT_CMD%" commit -m "feat: XENOR X L-Verify Pro - Product Verification System"

echo.
echo [4/4] GitHub-ga yuborilmoqda...
"%GIT_CMD%" remote remove origin 2>nul
"%GIT_CMD%" remote add origin https://github.com/MohirbekMahkamov/abdulloh-tech-verify.git
"%GIT_CMD%" branch -M main
"%GIT_CMD%" push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================
    echo   MUVAFFAQIYATLI YUKLANDI!
    echo ========================================
    echo.
    echo   https://github.com/MohirbekMahkamov/abdulloh-tech-verify
    echo.
) else (
    echo [XATO] Push amalga oshmadi.
    echo Sabab: GitHub credentials yoki token kerak bo'lishi mumkin.
    echo.
)

pause
