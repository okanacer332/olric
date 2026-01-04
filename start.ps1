#!/usr/bin/env pwsh

# Olric Projesi Başlatma Script'i (PowerShell - Windows/Mac/Ubuntu)
# Tek komutla tüm projeyi ayağa kaldırır

Write-Host ""
Write-Host "🚀 Olric projesi başlatılıyor..." -ForegroundColor Cyan
Write-Host ""

# Node.js kontrolü
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js $nodeVersion bulundu" -ForegroundColor Green
    Write-Host ""
    
    # Versiyon kontrolü
    $versionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($versionNumber -lt 18) {
        Write-Host "❌ Node.js versiyonu çok düşük! En az v18 gerekli. Mevcut: $nodeVersion" -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host "❌ Node.js bulunamadı! Lütfen Node.js 18 veya üzeri yükleyin." -ForegroundColor Red
    exit 1
}

# Dependencies yükleme (sadece ilk çalıştırmada veya package.json değiştiğinde)
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Bağımlılıklar yükleniyor..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Projeyi başlat
Write-Host "🎯 Geliştirme sunucusu başlatılıyor..." -ForegroundColor Cyan
Write-Host ""
npm run dev
