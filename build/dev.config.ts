import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// 文档: https://vitejs.dev/config/
export default defineConfig({
  root: 'docs',
  resolve: {
    alias: {
      '@': '../lib'
    }
  },
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
  ]
});
