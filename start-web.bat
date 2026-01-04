@echo off
REM Olric Web App Başlatma Script'i (Windows)
REM Sadece web uygulamasını başlatır

echo.
echo 🚀 Olric Web uygulaması başlatılıyor...
echo.

REM Node.js kontrol
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js bulunamadı! Lütfen Node.js 18 veya üzeri yükleyin.
    pause
    exit /b 1
)

echo ✅ Node.js bulundu
node -v
echo.

REM Dependencies yükleme
if not exist "node_modules" (
    echo 📦 Bağımlılıklar yükleniyor...
    call npm install
    echo.
)

REM Sadece web uygulamasını başlat
echo 🎯 Web uygulaması başlatılıyor (Port 3000)...
echo.
call npm run dev --filter=web
