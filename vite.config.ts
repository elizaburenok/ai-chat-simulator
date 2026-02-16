import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/ai-chat-simulator/',
  plugins: [react()],
  resolve: {
    alias: {
      '@tokens': path.resolve(__dirname, 'tokens'),
    },
  },
});
