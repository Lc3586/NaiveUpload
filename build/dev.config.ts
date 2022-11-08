import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// 文档: https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      docs: resolve(__dirname, '../docs')
    }
  },
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
  ]
});
