import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: true,        // listen on IPv4 + IPv6 (localhost, 127.0.0.1 and LAN IP all work)
    port: 5173,
    strictPort: true,  // fail loudly instead of silently moving to 5174
    open: true,        // open the browser automatically
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: true,
  },
});
