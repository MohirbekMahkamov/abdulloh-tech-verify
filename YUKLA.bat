@echo off
chcp 65001 >nul
title GitHub-ga yuklash
color 0A

echo.
echo ========================================
echo   ABDULLOH-TECH - GitHub Akkaunt Tuzatish
echo ========================================
echo.

REM ── Git joylashuvini avtomatik topish ──
set "GIT_CMD=git"

where git >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    set "GIT_CMD=git"
    goto :FOUND
)
if exist "C:\Program Files\Git\bin\git.exe" (
    set "GIT_CMD=C:\Program Files\Git\bin\git.exe"
    goto :FOUND
)
if exist "C:\Program Files (x86)\Git\bin\git.exe" (
    set "GIT_CMD=C:\Program Files (x86)\Git\bin\git.exe"
    goto :FOUND
)
if exist "%LOCALAPPDATA%\Programs\Git\bin\git.exe" (
    set "GIT_CMD=%LOCALAPPDATA%\Programs\Git\bin\git.exe"
    goto :FOUND
)
echo [XATO] Git topilmadi!
pause
exit /b 1

:FOUND
echo [OK] Git topildi!
echo.

REM ── 1-QADAM: Eski credentials o'chirish ──
echo [1/6] Eski GitHub credentials o'chirilmoqda...
cmdkey /delete:git:https://github.com 2>nul
cmdkey /delete:LegacyGeneric:target=git:https://github.com 2>nul

REM Windows Credential Manager dan ham o'chirish
"%GIT_CMD%" credential reject <<EOF 2>nul
protocol=https
host=github.com
EOF

echo [OK] Eski credentials tozalandi.
echo.

REM ── 2-QADAM: Yangi akkaunt sozlash ──
echo [2/6] Git akkaunt sozlanmoqda (MohirbekMahkamov)...
"%GIT_CMD%" config --global user.name "MohirbekMahkamov"
"%GIT_CMD%" config --global user.email "mohirbek@abdulloh.tech"
echo [OK] Akkaunt sozlandi.
echo.

REM ── 3-QADAM: Repository ga o'tish ──
cd /d d:\Abdulloh-tech

echo [3/6] Git repository tayyorlanmoqda...
if not exist ".git" (
    "%GIT_CMD%" init
)

echo.
echo [4/6] Fayllar qo'shilmoqda...
"%GIT_CMD%" add .

echo.
echo [5/6] Commit qilinmoqda...
"%GIT_CMD%" commit -m "feat: XENOR X L-Verify Pro - Product Verification System" 2>nul
if %ERRORLEVEL% NEQ 0 (
    "%GIT_CMD%" commit --allow-empty -m "feat: XENOR X L-Verify Pro - Product Verification System"
)

echo.
echo [6/6] GitHub-ga yuborilmoqda...
"%GIT_CMD%" remote remove origin 2>nul
"%GIT_CMD%" remote add origin https://github.com/MohirbekMahkamov/abdulloh-tech-verify.git
"%GIT_CMD%" branch -M main

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║  Hozir GitHub login oynasi ochiladi.                   ║
echo ║  MohirbekMahkamov akkauntingiz bilan kiring!           ║
echo ║  (nurmuhamedovbotir334 EMAS!)                          ║
echo ╚════════════════════════════════════════════════════════╝
echo.

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
    echo ════════════════════════════════════════
    echo   AGAR YANA XATO BERSA:
    echo ════════════════════════════════════════
    echo.
    echo   1. Windows qidiruv-ga "Credential Manager" yozing
    echo   2. "Windows Credentials" bo'limini oching
    echo   3. "git:https://github.com" yozuvini toping
    echo   4. Uni o'chiring (Remove)
    echo   5. Keyin ushbu skriptni qayta ishga tushiring
    echo.
)

pause
