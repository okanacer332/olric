# Olric Projesi - Hızlı Başlangıç Kılavuzu

Bu kılavuz, projeyi tüm platformlarda tek bir komutla nasıl başlatacağınızı gösterir.

## 🚀 Tek Komutla Başlatma

Projeyi farklı işletim sistemlerinde başlatmak için aşağıdaki komutları kullanın:

### 🍎 **macOS / 🐧 Linux (Ubuntu, Debian, vb.)**

```bash
./start.sh
```

**İlk kullanımda çalıştırma izni gerekebilir:**
```bash
chmod +x start.sh
./start.sh
```

---

### 🪟 **Windows**

#### Yöntem 1: Komut İstemi (CMD)
```cmd
start.bat
```

#### Yöntem 2: PowerShell
```powershell
.\start.ps1
```

**Not:** PowerShell script'leri için execution policy hatası alırsanız:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\start.ps1
```

---

## 📋 Script'lerin Yaptığı İşlemler

Tüm script'ler şu adımları otomatik olarak gerçekleştirir:

1. ✅ **Node.js Kontrol**: Node.js v18+ kurulu mu kontrol eder
2. 📦 **Bağımlılık Yükleme**: `node_modules` yoksa `npm install` çalıştırır
3. 🎯 **Proje Başlatma**: `npm run dev` ile tüm servisleri başlatır

---

## 🛠️ Gereksinimler

- **Node.js**: v18 veya üzeri
- **npm**: 10.9.3 veya üzeri

---

## 📚 Diğer Komutlar

Manuel kullanım için:

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme modunda başlat
npm run dev

# Production build
npm run build

# Linting
npm run lint

# Tip kontrolü
npm run check-types
```

---

## 🆘 Sorun Giderme

### "Node.js bulunamadı" hatası
Node.js yüklü değil. [nodejs.org](https://nodejs.org) adresinden yükleyin.

### "Node.js versiyonu çok düşük" hatası
En az v18 gerekli. Node.js'i güncelleyin.

### Port hatası
Başka bir servis kullanıyorsa, önce durdurmanız gerekebilir:
```bash
# Çalışan npm dev'i durdur
# Mac/Linux: Ctrl+C
# Windows: Ctrl+C veya terminali kapat
```

---

## 🎯 Hızlı Başlangıç

1. Terminal/Komut İstemi'ni açın
2. Proje klasörüne gidin: `cd /Users/meltemgoren/Desktop/Olric`
3. İşletim sisteminize uygun komutu çalıştırın
4. Tarayıcınızda açılan adreslere gidin

**Tebrikler! 🎉 Projeniz çalışıyor.**
