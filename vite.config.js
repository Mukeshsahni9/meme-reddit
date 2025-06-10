import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { qrcode } from 'vite-plugin-qrcode';

export default defineConfig({
  plugins: [
    react(),
    qrcode({
      // Enable QR code generation
      enabled: true,
      // Show QR code in terminal
      showQR: true,
      // Custom port if needed
      port: 5173
    })
  ],
  server: {
    host: '0.0.0.0',  // allow external access
    port: 5173,
    strictPort: true,
    cors: true,
    allowedHosts: [
      '2626-103-48-199-10.ngrok-free.app',
      '.ngrok-free.app'  // This will allow all ngrok-free.app subdomains
    ]
  },
});
