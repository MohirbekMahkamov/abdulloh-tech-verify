@echo off
title XP-80C Printer Sozlash Tizimi
color 0A
cls

echo ==========================================================
echo          PRINTERNI AVTOMATIK SOZLASH SKRIPTI (80x40mm)
echo ==========================================================
echo.

:: Check for Administrator rights
net session >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo [XATO] Ushbu skriptni ishga tushirish uchun administrator huquqlari kerak!
    echo.
    echo Iltimos, quyidagilarni bajaring:
    echo 1. Ushbu oynani yoping.
    echo 2. "setup_printer.bat" ustiga sichqonchaning o'ng tugmasini bosing.
    echo 3. "Запуск от имени администратора" (Run as Administrator) ni tanlang.
    echo.
    pause
    exit /b
)

echo [1/2] 80x40mm stiker formati yaratilmoqda...
:: Add form with 80mm width and 40mm height (in micrometers: 80000 and 40000)
powershell -Command "Add-PrinterForm -Name '80x40_stiker' -SizeWidth 80000 -SizeHeight 40000" >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [INFO] Form allaqachon mavjud yoki tizim tomonidan qo'shildi.
) else (
    echo [OK] 80x40_stiker formati muvaffaqiyatli yaratildi.
)
echo.

echo [2/2] XP-80C (copy 1) printeriga ushbu format biriktirilmoqda...
powershell -Command "Set-PrintConfiguration -PrinterName 'XP-80C (copy 1)' -PaperSize '80x40_stiker'" >nul 2>&1
if %errorlevel% neq 0 (
    color 0E
    echo [OGOHLANTIRISH] Printerni sozlashda xatolik yuz berdi.
    echo Iltimos, Windows sozlamalarida printer nomi aynan 'XP-80C (copy 1)' ekanligini tekshiring.
) else (
    echo [OK] XP-80C (copy 1) prineri uchun default o'lcham 80x40mm qilib belgilandi.
)
echo.

echo ==========================================================
echo SOZLASH YAKUNLANDI!
echo Endi brauzerni yangilab (F5), stikerni qaytadan chop eting.
echo Chop etish oynasida:
echo 1. "Размер бумаги" (Paper size) -> "80x40_stiker" ni tanlang.
echo 2. "Масштаб" (Scale) -> "По умолчанию" (Default) yoki "100" qiling.
echo ==========================================================
echo.
pause
