import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/ai-chat-simulator/',
  plugins: [react()],
  server: {
    port: 5173,
    open: '/ai-chat-simulator/',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@tokens': path.resolve(__dirname, 'tokens'),
    },
  },
});
