#!/bin/bash

# Olric Projesi Başlatma Script'i (Mac/Ubuntu)
# Tek komutla tüm projeyi ayağa kaldırır

echo "🚀 Olric projesi başlatılıyor..."
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

# Dependencies yükleme (sadece ilk çalıştırmada veya package.json değiştiğinde)
if [ ! -d "node_modules" ]; then
    echo "📦 Bağımlılıklar yükleniyor..."
    npm install
    echo ""
fi

# Projeyi başlat
echo "🎯 Geliştirme sunucusu başlatılıyor..."
echo ""
npm run dev
