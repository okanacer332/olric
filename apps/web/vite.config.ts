import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path'; // Use * as path to avoid the default import error

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    allowedHosts: ['okanacer.xyz', '.okanacer.xyz'],
    host: true,
  }
});