import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // --- BURAYI GÜNCELLİYORUZ ---
  server: {
    port: 3000,
    host: true, // 0.0.0.0 üzerinden dinlemesi için (Cloudflare tüneli için gerekli)
    allowedHosts: [
      'okanacer.xyz',
      'www.okanacer.xyz',
      'all' // Test için tüm hostlara izin ver (veya sadece domainini yaz)
    ]
  }
})