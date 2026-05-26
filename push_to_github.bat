@echo off
chcp 65001 >nul
title Abdulloh-Tech - GitHub ga yuklash
color 0A

echo.
echo ╔════════════════════════════════════════════════════╗
echo ║   ABDULLOH-TECH VERIFY - GitHub ga Yuklash        ║
echo ║   Avtomatik Git Push Skripti                      ║
echo ╚════════════════════════════════════════════════════╝
echo.

REM ──────────────────────────────────────────────────
REM 1-QADAM: GitHub username ni so'rash
REM ──────────────────────────────────────────────────
set /p GITHUB_USER="GitHub username-ingizni kiriting: "

if "%GITHUB_USER%"=="" (
    echo [XATO] Username kiritilmadi!
    pause
    exit /b 1
)

set REPO_NAME=abdulloh-tech-verify
set REPO_URL=https://github.com/%GITHUB_USER%/%REPO_NAME%.git

echo.
echo [INFO] Repository: %REPO_URL%
echo.

REM ──────────────────────────────────────────────────
REM 2-QADAM: GitHub CLI orqali repo yaratish
REM ──────────────────────────────────────────────────
echo [1/5] GitHub-da yangi repository yaratilmoqda...

where gh >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] GitHub CLI topildi. Repository yaratilmoqda...
    gh repo create %REPO_NAME% --public --confirm 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Repository muvaffaqiyatli yaratildi!
    ) else (
        echo [INFO] Repository allaqachon mavjud yoki qo'lda yaratish kerak.
        echo [INFO] Agar yaratilmagan bo'lsa, quyidagi havolaga o'ting:
        echo        https://github.com/new
        echo        Repository nomi: %REPO_NAME%
        echo.
        echo Repository yaratib bo'lgach, ENTER bosing...
        pause >nul
    )
) else (
    echo [INFO] GitHub CLI (gh) o'rnatilmagan.
    echo [INFO] Iltimos, quyidagi havolaga o'ting va yangi repository yarating:
    echo.
    echo        https://github.com/new
    echo.
    echo        Repository nomi: %REPO_NAME%
    echo        Turi: Public
    echo        README, .gitignore, License - QOYMANG (hammasi unchecked)
    echo.
    echo Repository yaratib bo'lgach, ENTER bosing...
    pause >nul
)

REM ──────────────────────────────────────────────────
REM 3-QADAM: Git init va commit
REM ──────────────────────────────────────────────────
echo.
echo [2/5] Git repository tayyorlanmoqda...

cd /d d:\Abdulloh-tech

if exist ".git" (
    echo [INFO] Git allaqachon ishga tushgan, davom etamiz...
) else (
    git init
    echo [OK] Git repository yaratildi.
)

echo.
echo [3/5] Fayllar qo'shilmoqda...
git add .
git commit -m "feat: XENOR X L-Verify Pro - Product Verification System with all fixes applied"

echo.
echo [4/5] Remote ulanmoqda va kod yuborilmoqda...
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main

echo.
echo [5/5] GitHub-ga push qilinmoqda...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ╔════════════════════════════════════════════════════╗
    echo ║  MUVAFFAQIYATLI YUKLANDI!                         ║
    echo ╚════════════════════════════════════════════════════╝
    echo.
    echo  GitHub Repository: https://github.com/%GITHUB_USER%/%REPO_NAME%
    echo.
    echo ──────────────────────────────────────────────────────
    echo  KEYINGI QADAM: Loyihani tekin serverga deploy qilish
    echo ──────────────────────────────────────────────────────
    echo.
    echo  FRONTEND (Next.js) uchun Vercel:
    echo    1. https://vercel.com ga kiring
    echo    2. "Import Project" bosing
    echo    3. GitHub repo-ni tanlang: %REPO_NAME%
    echo    4. Root Directory: frontend
    echo    5. Framework: Next.js
    echo    6. Deploy bosing
    echo.
    echo  BACKEND (Spring Boot) uchun Render:
    echo    1. https://render.com ga kiring
    echo    2. "New Web Service" bosing
    echo    3. GitHub repo-ni ulang: %REPO_NAME%
    echo    4. Root Directory: backend
    echo    5. Build: ./mvnw clean package -DskipTests
    echo    6. Start: java -jar target/*.jar
    echo    7. Environment Variables:
    echo       JWT_SECRET = (256-bit base64 kalit)
    echo       DB_PASSWORD = (PostgreSQL parolingiz)
    echo.
) else (
    echo.
    echo [XATO] Push amalga oshmadi!
    echo.
    echo Mumkin bo'lgan sabablar:
    echo   1. GitHub-da repository yaratilmagan
    echo   2. GitHub credentials (token) kiritilmagan
    echo   3. Internet aloqasi yo'q
    echo.
    echo Qo'lda urinib ko'ring:
    echo   git push -u origin main
    echo.
)

echo.
pause
