@echo off
REM Olric Projesi Başlatma Script'i (Windows)
REM Tek komutla tüm projeyi ayağa kaldırır

echo.
echo 🚀 Olric projesi başlatılıyor...
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

REM Dependencies yükleme (sadece ilk çalıştırmada veya package.json değiştiğinde)
if not exist "node_modules" (
    echo 📦 Bağımlılıklar yükleniyor...
    call npm install
    echo.
)

REM Projeyi başlat
echo 🎯 Geliştirme sunucusu başlatılıyor...
echo.
call npm run dev
