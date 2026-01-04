#!/bin/bash

# Olric Web App Başlatma Script'i (Mac/Ubuntu)
# Sadece web uygulamasını başlatır

echo "🚀 Olric Web uygulaması başlatılıyor..."
echo ""

# Node.js versiyonu kontrolü
if ! command -v node &> /dev/null; then
    echo "❌ Node.js bulunamadı! Lütfen Node.js 18 veya üzeri yükleyin."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js versiyonu çok düşük! En az v18 gerekli. Mevcut: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) bulundu"
echo ""

# Dependencies yükleme
if [ ! -d "node_modules" ]; then
    echo "📦 Bağımlılıklar yükleniyor..."
    npm install
    echo ""
fi

# Sadece web uygulamasını başlat
echo "🎯 Web uygulaması başlatılıyor (Port 3000)..."
echo ""
npm run dev --filter=web
