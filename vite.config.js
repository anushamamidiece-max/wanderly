import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// allowedHosts lets the dev server respond when previewed through a proxy domain.
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
